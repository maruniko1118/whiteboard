/**
 * storage.js - Manages multi-board persistent caching, custom colors, M3 theme seed, and serialization
 * Uses per-board async IndexedDB writes with debounced/idle scheduling so continuous drawing never stalls,
 * while keeping undo/redo stacks strictly in-memory and providing seamless localStorage migration/fallback.
 */

const LEGACY_STORAGE_KEY = 'whiteboard_app_state_v2';
const PREFS_STORAGE_KEY = 'whiteboard_prefs_v1';
const IDB_NAME = 'whiteboard_app_db';
const IDB_VERSION = 1;
const STORE_META = 'meta';
const STORE_BOARDS = 'boards';
const META_KEY = 'app';
const SAVE_DEBOUNCE_MS = 600;

const DEFAULT_CUSTOM_COLORS = [
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f43f5e', // Rose
  '#a855f7', // Purple
  '#14b8a6', // Teal
  '#6366f1'  // Indigo
];

export class BoardStorage {
  constructor(options = {}) {
    this.isDrawingCheck = options.isDrawingCheck || (() => false);
    this.onSaveStatusChange = options.onSaveStatusChange || (() => {});

    this.db = null;
    this.useLocalStorageFallback = false;

    this.saveDebounceTimer = null;
    this.idleCallbackId = null;
    this.dirtyBoardIds = new Set();
    this.dirtyMeta = false;
    this.deletedBoardIds = new Set();
    this.isFlushing = false;
    this.pendingFlush = false;

    const prefs = this.loadPrefsSync();
    const defaultBoard = this.createNewBoardObject('メインボード');
    this.state = {
      activeBoardId: defaultBoard.id,
      boards: [defaultBoard],
      theme: prefs.theme,
      seedColor: prefs.seedColor,
      customColors: [...DEFAULT_CUSTOM_COLORS]
    };
  }

  /**
   * Read lightweight theme/seed prefs synchronously to avoid startup theme flash
   */
  loadPrefsSync() {
    try {
      const raw = localStorage.getItem(PREFS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          theme: parsed.theme === 'dark' ? 'dark' : 'light',
          seedColor: /^#[0-9A-Fa-f]{6}$/.test(parsed.seedColor || '') ? parsed.seedColor : '#6750A4'
        };
      }
      // Fallback: peek legacy state only for theme/seed if prefs key not yet created
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        const legacy = JSON.parse(legacyRaw);
        return {
          theme: legacy?.theme === 'dark' ? 'dark' : 'light',
          seedColor: /^#[0-9A-Fa-f]{6}$/.test(legacy?.seedColor || '') ? legacy.seedColor : '#6750A4'
        };
      }
    } catch (_) {
      // Ignore storage access errors
    }
    return { theme: 'light', seedColor: '#6750A4' };
  }

  savePrefsSync() {
    try {
      localStorage.setItem(
        PREFS_STORAGE_KEY,
        JSON.stringify({
          theme: this.state.theme || 'light',
          seedColor: this.state.seedColor || '#6750A4'
        })
      );
    } catch (_) {
      // Ignore storage quota/access errors for tiny prefs
    }
  }

  /**
   * Initialize persistent backend (IndexedDB primary + localStorage migration/fallback)
   */
  async init() {
    if (typeof indexedDB === 'undefined') {
      this.useLocalStorageFallback = true;
      this.state = this.loadStateFromLocalStorage();
      this.savePrefsSync();
      return this.state;
    }

    try {
      this.db = await this.openDatabase();
      const loaded = await this.loadStateFromIDB();

      if (loaded) {
        this.state = loaded;
      } else {
        // Migrate existing localStorage data (if any) into IndexedDB and strip legacy undo bloat
        const legacy = this.loadStateFromLocalStorage();
        this.state = legacy;
        await this.persistAllToIDB();
        try {
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        } catch (_) {}
      }

      this.savePrefsSync();
      return this.state;
    } catch (e) {
      console.warn('IndexedDB unavailable, falling back to localStorage:', e);
      this.db = null;
      this.useLocalStorageFallback = true;
      this.state = this.loadStateFromLocalStorage();
      this.savePrefsSync();
      return this.state;
    }
  }

  openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_META)) {
          db.createObjectStore(STORE_META);
        }
        if (!db.objectStoreNames.contains(STORE_BOARDS)) {
          db.createObjectStore(STORE_BOARDS, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('IndexedDB open blocked'));
    });
  }

  loadStateFromIDB() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_META, STORE_BOARDS], 'readonly');
      const metaReq = tx.objectStore(STORE_META).get(META_KEY);
      const boardsReq = tx.objectStore(STORE_BOARDS).getAll();

      tx.oncomplete = () => {
        const meta = metaReq.result;
        const rawBoards = boardsReq.result;
        if (!meta || !Array.isArray(rawBoards) || rawBoards.length === 0) {
          resolve(null);
          return;
        }

        const boardMap = new Map(rawBoards.map(b => [b.id, this.normalizeLoadedBoard(b)]));
        const orderedBoards = [];
        if (Array.isArray(meta.boardOrder)) {
          for (const id of meta.boardOrder) {
            const b = boardMap.get(id);
            if (b) {
              orderedBoards.push(b);
              boardMap.delete(id);
            }
          }
        }
        for (const b of boardMap.values()) {
          orderedBoards.push(b);
        }

        const activeBoardId = orderedBoards.some(b => b.id === meta.activeBoardId)
          ? meta.activeBoardId
          : orderedBoards[0].id;

        resolve({
          activeBoardId,
          boards: orderedBoards,
          theme: meta.theme === 'dark' ? 'dark' : 'light',
          seedColor: /^#[0-9A-Fa-f]{6}$/.test(meta.seedColor || '') ? meta.seedColor : '#6750A4',
          customColors: Array.isArray(meta.customColors) ? meta.customColors : [...DEFAULT_CUSTOM_COLORS]
        });
      };

      tx.onerror = () => reject(tx.error);
    });
  }

  normalizeLoadedBoard(board) {
    return {
      id: board.id,
      title: board.title || '無題ボード',
      strokes: Array.isArray(board.strokes) ? board.strokes : [],
      // Undo/redo stacks are session-only in memory to avoid 50x storage bloat
      undoStack: [],
      redoStack: [],
      createdAt: board.createdAt || Date.now(),
      updatedAt: board.updatedAt || Date.now()
    };
  }

  serializeBoardForStorage(board) {
    return {
      id: board.id,
      title: board.title,
      strokes: Array.isArray(board.strokes) ? board.strokes : [],
      createdAt: board.createdAt || Date.now(),
      updatedAt: board.updatedAt || Date.now()
    };
  }

  buildMetaObject() {
    return {
      activeBoardId: this.state.activeBoardId,
      boardOrder: this.state.boards.map(b => b.id),
      theme: this.state.theme || 'light',
      seedColor: this.state.seedColor || '#6750A4',
      customColors: Array.isArray(this.state.customColors)
        ? this.state.customColors
        : [...DEFAULT_CUSTOM_COLORS]
    };
  }

  persistAllToIDB() {
    if (!this.db) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_META, STORE_BOARDS], 'readwrite');
      const metaStore = tx.objectStore(STORE_META);
      const boardStore = tx.objectStore(STORE_BOARDS);

      metaStore.put(this.buildMetaObject(), META_KEY);
      for (const board of this.state.boards) {
        boardStore.put(this.serializeBoardForStorage(board));
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Load state from localStorage (fallback & legacy migration)
   */
  loadStateFromLocalStorage() {
    try {
      const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.boards) && parsed.boards.length > 0) {
          const boards = parsed.boards.map(b => this.normalizeLoadedBoard(b));
          const activeBoardId = boards.some(b => b.id === parsed.activeBoardId)
            ? parsed.activeBoardId
            : boards[0].id;
          return {
            activeBoardId,
            boards,
            theme: parsed.theme === 'dark' ? 'dark' : 'light',
            seedColor: /^#[0-9A-Fa-f]{6}$/.test(parsed.seedColor || '') ? parsed.seedColor : '#6750A4',
            customColors: Array.isArray(parsed.customColors)
              ? parsed.customColors
              : [...DEFAULT_CUSTOM_COLORS]
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load board state from cache:', e);
    }

    const prefs = this.loadPrefsSync();
    const defaultBoard = this.createNewBoardObject('メインボード');
    return {
      activeBoardId: defaultBoard.id,
      boards: [defaultBoard],
      theme: prefs.theme,
      seedColor: prefs.seedColor,
      customColors: [...DEFAULT_CUSTOM_COLORS]
    };
  }

  buildExportPayload() {
    return {
      activeBoardId: this.state.activeBoardId,
      boards: this.state.boards.map(b => this.serializeBoardForStorage(b)),
      theme: this.state.theme,
      seedColor: this.state.seedColor,
      customColors: this.state.customColors
    };
  }

  /**
   * Schedule debounced, idle-friendly save without blocking continuous drawing
   */
  scheduleSave() {
    this.clearPendingSaveTimers();
    this.saveDebounceTimer = setTimeout(() => {
      this.saveDebounceTimer = null;

      // Never serialize or write while user is actively drawing
      if (this.isDrawingCheck()) {
        this.scheduleSave();
        return;
      }

      const runFlush = () => {
        this.idleCallbackId = null;
        if (this.isDrawingCheck()) {
          this.scheduleSave();
          return;
        }
        this.flushSave();
      };

      if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
        this.idleCallbackId = window.requestIdleCallback(runFlush, { timeout: 1500 });
      } else {
        this.idleCallbackId = setTimeout(runFlush, 0);
      }
    }, SAVE_DEBOUNCE_MS);
  }

  clearPendingSaveTimers() {
    if (this.saveDebounceTimer !== null) {
      clearTimeout(this.saveDebounceTimer);
      this.saveDebounceTimer = null;
    }
    if (this.idleCallbackId !== null) {
      if (typeof window !== 'undefined' && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(this.idleCallbackId);
      } else {
        clearTimeout(this.idleCallbackId);
      }
      this.idleCallbackId = null;
    }
  }

  /**
   * Flush dirty changes immediately to IndexedDB (or localStorage fallback)
   */
  flushSave() {
    this.clearPendingSaveTimers();

    if (
      !this.dirtyMeta &&
      this.dirtyBoardIds.size === 0 &&
      this.deletedBoardIds.size === 0
    ) {
      return;
    }

    if (this.useLocalStorageFallback || !this.db) {
      try {
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(this.buildExportPayload()));
        this.dirtyMeta = false;
        this.dirtyBoardIds.clear();
        this.deletedBoardIds.clear();
        this.onSaveStatusChange({ status: 'saved', timestamp: Date.now() });
      } catch (e) {
        console.error('Failed to save board state to cache:', e);
        this.onSaveStatusChange({ status: 'error', error: e });
      }
      return;
    }

    if (this.isFlushing) {
      this.pendingFlush = true;
      return;
    }

    const writeMeta = this.dirtyMeta;
    const boardIdsToWrite = Array.from(this.dirtyBoardIds);
    const boardIdsToDelete = Array.from(this.deletedBoardIds);

    this.dirtyMeta = false;
    this.dirtyBoardIds.clear();
    this.deletedBoardIds.clear();
    this.isFlushing = true;

    try {
      const stores = (writeMeta || boardIdsToDelete.length > 0) && boardIdsToWrite.length > 0
        ? [STORE_META, STORE_BOARDS]
        : (writeMeta && boardIdsToWrite.length === 0 && boardIdsToDelete.length === 0)
          ? [STORE_META]
          : [STORE_BOARDS];

      const tx = this.db.transaction(stores, 'readwrite');

      if (writeMeta) {
        tx.objectStore(STORE_META).put(this.buildMetaObject(), META_KEY);
      }

      if (boardIdsToWrite.length > 0 || boardIdsToDelete.length > 0) {
        const boardStore = tx.objectStore(STORE_BOARDS);
        for (const id of boardIdsToDelete) {
          boardStore.delete(id);
        }
        for (const id of boardIdsToWrite) {
          const board = this.state.boards.find(b => b.id === id);
          if (board) {
            boardStore.put(this.serializeBoardForStorage(board));
          }
        }
      }

      tx.oncomplete = () => {
        this.isFlushing = false;
        this.onSaveStatusChange({ status: 'saved', timestamp: Date.now() });
        if (this.pendingFlush) {
          this.pendingFlush = false;
          this.flushSave();
        }
      };

      tx.onerror = () => {
        this.isFlushing = false;
        console.error('Failed to save board state to IndexedDB:', tx.error);
        this.onSaveStatusChange({ status: 'error', error: tx.error });
        if (this.pendingFlush) {
          this.pendingFlush = false;
          this.flushSave();
        }
      };
    } catch (e) {
      this.isFlushing = false;
      console.error('Failed to start IndexedDB save transaction:', e);
      this.onSaveStatusChange({ status: 'error', error: e });
    }
  }

  /**
   * Helper to create a new board data object
   */
  createNewBoardObject(title = '新規ボード') {
    return {
      id: 'board_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: title,
      strokes: [],
      undoStack: [],
      redoStack: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  /**
   * Get the currently active board
   */
  getActiveBoard() {
    let board = this.state.boards.find(b => b.id === this.state.activeBoardId);
    if (!board) {
      board = this.state.boards[0];
      if (board) {
        this.state.activeBoardId = board.id;
      } else {
        const newBoard = this.createNewBoardObject('メインボード');
        this.state.boards.push(newBoard);
        this.state.activeBoardId = newBoard.id;
        board = newBoard;
        this.dirtyBoardIds.add(newBoard.id);
      }
      this.dirtyMeta = true;
      this.flushSave();
    }
    return board;
  }

  /**
   * Get all boards
   */
  getAllBoards() {
    return this.state.boards;
  }

  /**
   * Switch active board
   */
  switchBoard(id) {
    const exists = this.state.boards.some(b => b.id === id);
    if (exists) {
      this.state.activeBoardId = id;
      this.dirtyMeta = true;
      this.flushSave();
      return this.getActiveBoard();
    }
    return null;
  }

  /**
   * Create a new board and switch to it
   */
  createBoard(title) {
    const name = title || `ボード ${this.state.boards.length + 1}`;
    const newBoard = this.createNewBoardObject(name);
    this.state.boards.push(newBoard);
    this.state.activeBoardId = newBoard.id;
    this.dirtyBoardIds.add(newBoard.id);
    this.dirtyMeta = true;
    this.flushSave();
    return newBoard;
  }

  /**
   * Rename an existing board
   */
  renameBoard(id, newTitle) {
    const board = this.state.boards.find(b => b.id === id);
    if (board && newTitle.trim()) {
      board.title = newTitle.trim();
      board.updatedAt = Date.now();
      this.dirtyBoardIds.add(board.id);
      this.flushSave();
      return true;
    }
    return false;
  }

  /**
   * Duplicate a board (only copies strokes, not transient undo/redo stacks)
   */
  duplicateBoard(id) {
    const source = this.state.boards.find(b => b.id === id);
    if (!source) return null;

    const copy = {
      id: 'board_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: `${source.title} (コピー)`,
      strokes: JSON.parse(JSON.stringify(source.strokes || [])),
      undoStack: [],
      redoStack: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.state.boards.push(copy);
    this.state.activeBoardId = copy.id;
    this.dirtyBoardIds.add(copy.id);
    this.dirtyMeta = true;
    this.flushSave();
    return copy;
  }

  /**
   * Delete a board
   */
  deleteBoard(id) {
    if (this.state.boards.length <= 1) {
      // Cannot delete only board: clear it instead
      const board = this.getActiveBoard();
      board.strokes = [];
      board.undoStack = [];
      board.redoStack = [];
      board.updatedAt = Date.now();
      this.dirtyBoardIds.add(board.id);
      this.flushSave();
      return { deleted: false, reset: true, activeBoard: board };
    }

    const index = this.state.boards.findIndex(b => b.id === id);
    if (index !== -1) {
      this.state.boards.splice(index, 1);
      this.dirtyBoardIds.delete(id);
      this.deletedBoardIds.add(id);
      if (this.state.activeBoardId === id) {
        const nextIndex = Math.min(index, this.state.boards.length - 1);
        this.state.activeBoardId = this.state.boards[nextIndex].id;
      }
      this.dirtyMeta = true;
      this.flushSave();
      return { deleted: true, activeBoard: this.getActiveBoard() };
    }
    return { deleted: false };
  }

  /**
   * Update strokes on active board in memory immediately and schedule non-blocking save
   */
  updateActiveBoardStrokes(strokes, undoStack, redoStack) {
    const board = this.getActiveBoard();
    if (board) {
      board.strokes = strokes;
      board.undoStack = undoStack || [];
      board.redoStack = redoStack || [];
      board.updatedAt = Date.now();
      this.dirtyBoardIds.add(board.id);
      this.scheduleSave();
    }
  }

  /**
   * Get / Set Theme ('light' | 'dark')
   */
  getTheme() {
    return this.state.theme || 'light';
  }

  setTheme(theme) {
    this.state.theme = theme === 'dark' ? 'dark' : 'light';
    this.savePrefsSync();
    this.dirtyMeta = true;
    this.flushSave();
  }

  /**
   * Get / Set M3 Expressive Seed Color
   */
  getSeedColor() {
    return this.state.seedColor || '#6750A4';
  }

  setSeedColor(hex) {
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      this.state.seedColor = hex;
      this.savePrefsSync();
      this.dirtyMeta = true;
      this.flushSave();
    }
  }

  /**
   * Get / Add / Remove Custom Pen Colors
   */
  getCustomColors() {
    if (!Array.isArray(this.state.customColors)) {
      this.state.customColors = [...DEFAULT_CUSTOM_COLORS];
    }
    return this.state.customColors;
  }

  addCustomColor(hex) {
    const normalized = (hex || '').trim().toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(normalized)) return this.getCustomColors();
    const list = this.getCustomColors().filter(c => c.toLowerCase() !== normalized);
    list.unshift(normalized);
    this.state.customColors = list.slice(0, 12);
    this.dirtyMeta = true;
    this.flushSave();
    return this.state.customColors;
  }

  /**
   * Export all boards as JSON file download (without transient undo/redo stacks)
   */
  exportJson() {
    this.flushSave();
    const data = JSON.stringify(this.buildExportPayload(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whiteboard_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Import boards from JSON string
   */
  async importJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data && Array.isArray(data.boards) && data.boards.length > 0) {
        const previousIds = new Set(this.state.boards.map(b => b.id));
        const boards = data.boards.map(b => this.normalizeLoadedBoard(b));
        const activeBoardId = boards.some(b => b.id === data.activeBoardId)
          ? data.activeBoardId
          : boards[0].id;

        this.state = {
          activeBoardId,
          boards,
          theme: data.theme === 'dark' ? 'dark' : this.state.theme || 'light',
          seedColor: /^#[0-9A-Fa-f]{6}$/.test(data.seedColor || '') ? data.seedColor : (this.state.seedColor || '#6750A4'),
          customColors: Array.isArray(data.customColors) ? data.customColors : this.getCustomColors()
        };

        this.savePrefsSync();
        for (const oldId of previousIds) {
          if (!boards.some(b => b.id === oldId)) {
            this.deletedBoardIds.add(oldId);
          }
        }
        for (const b of boards) {
          this.dirtyBoardIds.add(b.id);
        }
        this.dirtyMeta = true;
        this.flushSave();
        return true;
      }
    } catch (e) {
      console.error('Invalid backup JSON:', e);
    }
    return false;
  }
}
