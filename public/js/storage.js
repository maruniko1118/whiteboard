/**
 * storage.js - Manages multi-board persistent caching, state, and serialization
 */

const STORAGE_KEY = 'whiteboard_app_state_v2';

export class BoardStorage {
  constructor() {
    this.state = this.loadState();
  }

  /**
   * Load state from localStorage or create fresh initial state
   */
  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.boards) && parsed.boards.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load board state from cache:', e);
    }

    // Default Initial State
    const defaultBoard = this.createNewBoardObject('メインボード');
    return {
      activeBoardId: defaultBoard.id,
      boards: [defaultBoard],
      theme: 'light'
    };
  }

  /**
   * Save current state to localStorage
   */
  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save board state to cache:', e);
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
      }
      this.saveState();
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
      this.saveState();
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
    this.saveState();
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
      this.saveState();
      return true;
    }
    return false;
  }

  /**
   * Duplicate a board
   */
  duplicateBoard(id) {
    const source = this.state.boards.find(b => b.id === id);
    if (!source) return null;

    const copy = {
      ...JSON.parse(JSON.stringify(source)),
      id: 'board_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: `${source.title} (コピー)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.state.boards.push(copy);
    this.state.activeBoardId = copy.id;
    this.saveState();
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
      this.saveState();
      return { deleted: false, reset: true, activeBoard: board };
    }

    const index = this.state.boards.findIndex(b => b.id === id);
    if (index !== -1) {
      this.state.boards.splice(index, 1);
      if (this.state.activeBoardId === id) {
        this.state.activeBoardId = this.state.boards[0].id;
      }
      this.saveState();
      return { deleted: true, activeBoard: this.getActiveBoard() };
    }
    return { deleted: false };
  }

  /**
   * Update strokes on active board
   */
  updateActiveBoardStrokes(strokes, undoStack, redoStack) {
    const board = this.getActiveBoard();
    if (board) {
      board.strokes = strokes;
      board.undoStack = undoStack || [];
      board.redoStack = redoStack || [];
      board.updatedAt = Date.now();
      this.saveState();
    }
  }

  /**
   * Get / Set Theme
   */
  getTheme() {
    return this.state.theme || 'light';
  }

  setTheme(theme) {
    this.state.theme = theme === 'dark' ? 'dark' : 'light';
    this.saveState();
  }

  /**
   * Export all boards as JSON file download
   */
  exportJson() {
    const data = JSON.stringify(this.state, null, 2);
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
  importJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data && Array.isArray(data.boards) && data.boards.length > 0) {
        this.state = data;
        if (!this.state.activeBoardId || !this.state.boards.some(b => b.id === this.state.activeBoardId)) {
          this.state.activeBoardId = this.state.boards[0].id;
        }
        this.saveState();
        return true;
      }
    } catch (e) {
      console.error('Invalid backup JSON:', e);
    }
    return false;
  }
}

