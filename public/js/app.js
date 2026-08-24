/**
 * app.js - Main Application Controller
 * Handles UI interactions, toolbar, theme switching, board drawer, and keyboard shortcuts
 */

import { BoardStorage } from './storage.js';
import { WhiteboardCanvas } from './canvas.js';

class WhiteboardApp {
  constructor() {
    this.storage = new BoardStorage();
    this.canvasElement = document.getElementById('whiteboard-canvas');
    this.canvasContainer = document.getElementById('canvas-container');

    // Initialize Theme
    this.theme = this.storage.getTheme();
    this.applyTheme(this.theme, false);

    // Initialize Canvas Engine
    this.canvasEngine = new WhiteboardCanvas(this.canvasElement, this.canvasContainer, {
      theme: this.theme,
      onStateChange: (state) => this.handleCanvasStateChange(state)
    });

    // Load Initial Active Board
    const activeBoard = this.storage.getActiveBoard();
    this.canvasEngine.loadBoard(activeBoard);

    // Bind DOM UI Events & Shortcuts
    this.initUI();
    this.renderBoardList();
    this.renderQuickTabs();
    this.updateBoardHeader(activeBoard);
  }

  /**
   * Apply Theme (light / dark)
   */
  applyTheme(theme, save = true) {
    this.theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);

    // Update UI Black/White label & swatch tooltip
    const blackLabel = document.getElementById('label-black');
    const blackSwatch = document.getElementById('swatch-black');
    const blackBtn = document.querySelector('.color-btn[data-color="black"]');

    if (this.theme === 'dark') {
      if (blackLabel) blackLabel.textContent = '白';
      if (blackBtn) blackBtn.title = '白 [1]';
    } else {
      if (blackLabel) blackLabel.textContent = '黒';
      if (blackBtn) blackBtn.title = '黒 [1]';
    }

    if (this.canvasEngine) {
      this.canvasEngine.setTheme(this.theme);
    }

    if (save) {
      this.storage.setTheme(this.theme);
      this.showToast(this.theme === 'dark' ? '🌙 ダークテーマに変更しました' : '☀️ ホワイトテーマに変更しました');
    }
  }

  /**
   * Toggle Theme
   */
  toggleTheme() {
    const nextTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme, true);
  }

  /**
   * Initialize UI Event Handlers
   */
  initUI() {
    // Theme Toggle Button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Tools: Pen vs Eraser
    const penBtn = document.getElementById('tool-pen');
    const eraserBtn = document.getElementById('tool-eraser');

    if (penBtn && eraserBtn) {
      penBtn.addEventListener('click', () => this.setTool('pen'));
      eraserBtn.addEventListener('click', () => this.setTool('eraser'));
    }

    // Color buttons
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.dataset.color;
        this.setColor(color);
      });
    });

    // Width buttons
    const widthBtns = document.querySelectorAll('.width-btn');
    widthBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const width = Number(btn.dataset.width);
        this.setWidth(width);
      });
    });

    // Undo / Redo / Clear
    const undoBtn = document.getElementById('btn-undo');
    const redoBtn = document.getElementById('btn-redo');
    const clearBtn = document.getElementById('btn-clear');

    if (undoBtn) undoBtn.addEventListener('click', () => this.canvasEngine.undo());
    if (redoBtn) redoBtn.addEventListener('click', () => this.canvasEngine.redo());
    if (clearBtn) clearBtn.addEventListener('click', () => this.promptClearCanvas());

    // Export PNG
    const exportBtn = document.getElementById('export-png-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportPng());
    }

    // Board Drawer Controls
    const drawerBtn = document.getElementById('board-drawer-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const backdrop = document.getElementById('drawer-backdrop');
    const createBoardBtn = document.getElementById('create-board-btn');
    const quickNewBoardBtn = document.getElementById('quick-new-board-btn');

    if (drawerBtn) drawerBtn.addEventListener('click', () => this.toggleDrawer(true));
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => this.toggleDrawer(false));
    if (backdrop) backdrop.addEventListener('click', () => this.toggleDrawer(false));

    if (createBoardBtn) {
      createBoardBtn.addEventListener('click', () => {
        this.createNewBoard();
        this.toggleDrawer(false);
      });
    }

    if (quickNewBoardBtn) {
      quickNewBoardBtn.addEventListener('click', () => this.createNewBoard());
    }

    // Rename Board Inline in Header
    const titleEl = document.getElementById('active-board-title');
    const renameBtn = document.getElementById('rename-board-btn');

    if (renameBtn && titleEl) {
      renameBtn.addEventListener('click', () => {
        const currentTitle = titleEl.textContent;
        const newTitle = prompt('ボード名を入力してください:', currentTitle);
        if (newTitle && newTitle.trim()) {
          const active = this.storage.getActiveBoard();
          this.storage.renameBoard(active.id, newTitle.trim());
          this.updateBoardHeader(this.storage.getActiveBoard());
          this.renderBoardList();
          this.renderQuickTabs();
          this.showToast('ボード名を変更しました');
        }
      });
    }

    // Backup Export & Import
    const exportAllBtn = document.getElementById('export-all-btn');
    const importFileInput = document.getElementById('import-file-input');

    if (exportAllBtn) {
      exportAllBtn.addEventListener('click', () => {
        this.storage.exportJson();
        this.showToast('JSONバックアップを出力しました');
      });
    }

    if (importFileInput) {
      importFileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const success = this.storage.importJson(event.target.result);
            if (success) {
              const active = this.storage.getActiveBoard();
              this.canvasEngine.loadBoard(active);
              this.updateBoardHeader(active);
              this.renderBoardList();
              this.renderQuickTabs();
              this.showToast('ボードを復元しました');
            } else {
              alert('無効なファイル形式です');
            }
          };
          reader.readAsText(file);
        }
        importFileInput.value = '';
      });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
  }

  /**
   * Set Active Drawing Tool
   */
  setTool(tool) {
    this.canvasEngine.currentTool = tool;
    document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
    });
  }

  /**
   * Set Pen Color
   */
  setColor(colorKey) {
    this.setTool('pen');
    this.canvasEngine.currentColorKey = colorKey;
    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === colorKey);
    });
  }

  /**
   * Set Stroke Width
   */
  setWidth(width) {
    this.canvasEngine.currentWidth = width;
    document.querySelectorAll('.width-btn').forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.width) === width);
    });
  }

  /**
   * Handle Canvas State Updates & Cache Persistence
   */
  handleCanvasStateChange(state) {
    // Update Undo / Redo Buttons
    const undoBtn = document.getElementById('btn-undo');
    const redoBtn = document.getElementById('btn-redo');
    if (undoBtn) undoBtn.disabled = !state.canUndo;
    if (redoBtn) redoBtn.disabled = !state.canRedo;

    // Trigger save indicator
    const cacheStatus = document.getElementById('cache-status');
    if (cacheStatus) {
      cacheStatus.classList.add('saving');
      const text = cacheStatus.querySelector('.status-text');
      if (text) text.textContent = '保存中...';
    }

    // Save to LocalStorage Cache
    this.storage.updateActiveBoardStrokes(state.strokes, state.undoStack, state.redoStack);

    setTimeout(() => {
      if (cacheStatus) {
        cacheStatus.classList.remove('saving');
        const text = cacheStatus.querySelector('.status-text');
        if (text) text.textContent = '保存済み';
      }
    }, 200);
  }

  /**
   * Toggle Board Drawer Sidebar
   */
  toggleDrawer(open) {
    const drawer = document.getElementById('board-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    if (drawer && backdrop) {
      drawer.classList.toggle('open', open);
      backdrop.classList.toggle('open', open);
    }
    if (open) {
      this.renderBoardList();
    }
  }

  /**
   * Update Header info with active board
   */
  updateBoardHeader(board) {
    const titleEl = document.getElementById('active-board-title');
    const badgeEl = document.getElementById('board-count-badge');
    const totalBoards = this.storage.getAllBoards().length;

    if (titleEl) titleEl.textContent = board.title || '無題のボード';
    if (badgeEl) badgeEl.textContent = totalBoards;
  }

  /**
   * Render Top Quick Tabs
   */
  renderQuickTabs() {
    const container = document.getElementById('quick-board-tabs');
    if (!container) return;

    const boards = this.storage.getAllBoards();
    const activeBoard = this.storage.getActiveBoard();

    container.innerHTML = '';
    boards.forEach(board => {
      const tab = document.createElement('button');
      tab.className = `quick-tab ${board.id === activeBoard.id ? 'active' : ''}`;
      tab.textContent = board.title;
      tab.title = board.title;
      tab.addEventListener('click', () => this.switchBoard(board.id));
      container.appendChild(tab);
    });
  }

  /**
   * Render Board List in Sidebar Drawer
   */
  renderBoardList() {
    const listContainer = document.getElementById('drawer-board-list');
    if (!listContainer) return;

    const boards = this.storage.getAllBoards();
    const activeBoard = this.storage.getActiveBoard();

    listContainer.innerHTML = '';

    boards.forEach(board => {
      const card = document.createElement('div');
      card.className = `board-card ${board.id === activeBoard.id ? 'active' : ''}`;

      const strokesCount = (board.strokes || []).length;
      const updatedDate = new Date(board.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      card.innerHTML = `
        <div class="board-card-header">
          <span class="board-card-name">${this.escapeHtml(board.title)}</span>
          ${board.id === activeBoard.id ? '<span class="board-card-badge">編集中</span>' : ''}
        </div>
        <div class="board-card-meta">
          <span>ストローク: ${strokesCount}件</span>
          <span>更新: ${updatedDate}</span>
          <div class="board-card-actions">
            <button class="card-action-btn duplicate-btn" title="複製">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button class="card-action-btn delete-btn" title="削除">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7c-1 0-2-1-2-2V6"></path>
              </svg>
            </button>
          </div>
        </div>
      `;

      // Switch to this board when clicked
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-action-btn')) return;
        this.switchBoard(board.id);
        this.toggleDrawer(false);
      });

      // Duplicate Action
      const dupBtn = card.querySelector('.duplicate-btn');
      if (dupBtn) {
        dupBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const copy = this.storage.duplicateBoard(board.id);
          if (copy) {
            this.switchBoard(copy.id);
            this.renderBoardList();
            this.renderQuickTabs();
            this.showToast('ボードを複製しました');
          }
        });
      }

      // Delete Action
      const delBtn = card.querySelector('.delete-btn');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`「${board.title}」を削除しますか？`)) {
            const res = this.storage.deleteBoard(board.id);
            if (res.activeBoard) {
              this.canvasEngine.loadBoard(res.activeBoard);
              this.updateBoardHeader(res.activeBoard);
            }
            this.renderBoardList();
            this.renderQuickTabs();
            this.showToast(res.deleted ? 'ボードを削除しました' : 'ボードをリセットしました');
          }
        });
      }

      listContainer.appendChild(card);
    });
  }

  /**
   * Switch Active Board
   */
  switchBoard(boardId) {
    const board = this.storage.switchBoard(boardId);
    if (board) {
      this.canvasEngine.loadBoard(board);
      this.updateBoardHeader(board);
      this.renderBoardList();
      this.renderQuickTabs();
      this.showToast(`「${board.title}」に切り替えました`);
    }
  }

  /**
   * Create New Board
   */
  createNewBoard() {
    const title = `ボード ${this.storage.getAllBoards().length + 1}`;
    const newBoard = this.storage.createBoard(title);
    this.canvasEngine.loadBoard(newBoard);
    this.updateBoardHeader(newBoard);
    this.renderBoardList();
    this.renderQuickTabs();
    this.showToast(`「${newBoard.title}」を作成しました`);
  }

  /**
   * Prompt confirmation before clearing active board
   */
  promptClearCanvas() {
    const dialog = document.getElementById('confirm-dialog');
    const cancelBtn = document.getElementById('dialog-cancel-btn');
    const confirmBtn = document.getElementById('dialog-confirm-btn');

    if (!dialog) {
      if (confirm('ボードの内容をすべて消去しますか？')) {
        this.canvasEngine.clear();
        this.showToast('ボードを消去しました');
      }
      return;
    }

    dialog.showModal();

    const handleCancel = () => {
      dialog.close();
      cleanup();
    };

    const handleConfirm = () => {
      dialog.close();
      this.canvasEngine.clear();
      this.showToast('ボードを消去しました');
      cleanup();
    };

    const cleanup = () => {
      cancelBtn.removeEventListener('click', handleCancel);
      confirmBtn.removeEventListener('click', handleConfirm);
    };

    cancelBtn.addEventListener('click', handleCancel);
    confirmBtn.addEventListener('click', handleConfirm);
  }

  /**
   * Export board as PNG image
   */
  async exportPng() {
    try {
      const blob = await this.canvasEngine.exportAsPngBlob();
      const activeBoard = this.storage.getActiveBoard();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeBoard.title || 'whiteboard'}_${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
      URL.revokeObjectURL(url);
      this.showToast('PNG画像をダウンロードしました');
    } catch (e) {
      console.error('Failed to export PNG:', e);
      this.showToast('画像の保存に失敗しました');
    }
  }

  /**
   * Handle Keyboard Shortcuts
   */
  handleKeyboardShortcuts(e) {
    // Ignore when typing inside input / editable
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
      return;
    }

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    if (isCtrlOrCmd && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        this.canvasEngine.redo();
      } else {
        this.canvasEngine.undo();
      }
      return;
    }

    if (isCtrlOrCmd && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      this.canvasEngine.redo();
      return;
    }

    // Number keys for colors
    if (e.key === '1') {
      this.setColor('black');
    } else if (e.key === '2') {
      this.setColor('red');
    } else if (e.key === '3') {
      this.setColor('yellow');
    } else if (e.key === '4') {
      this.setColor('blue');
    } else if (e.key.toLowerCase() === 'p') {
      this.setTool('pen');
    } else if (e.key.toLowerCase() === 'e') {
      this.setTool('eraser');
    } else if (e.key.toLowerCase() === 't') {
      this.toggleTheme();
    } else if (e.key === '[') {
      this.setWidth(2);
    } else if (e.key === ']') {
      this.setWidth(12);
    }
  }

  /**
   * Show Toast Notification
   */
  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m]));
  }
}

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new WhiteboardApp();
});

