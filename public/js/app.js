/**
 * app.js - Material Design 3 Expressive Application Controller
 * Handles unified fixed-width board tabs, M3 2025 Dynamic Color tokens,
 * spring physics animations, 2D custom color studio, and calm auto-save status.
 */

import { generateM3ExpressiveTokens, animate } from './vendor/m3-expressive.js';
import { getIcon } from './icons.js';
import { BoardStorage } from './storage.js';
import { WhiteboardCanvas } from './canvas.js';

class WhiteboardApp {
  constructor() {
    this.storage = new BoardStorage();
    this.canvasElement = document.getElementById('whiteboard-canvas');
    this.canvasContainer = document.getElementById('canvas-container');

    // Initialize Theme & M3 Expressive Seed Color
    this.theme = this.storage.getTheme();
    this.seedColor = this.storage.getSeedColor();

    // Custom Color HSV State (default Expressive Violet #6750A4)
    this.hsv = { h: 256, s: 51, v: 64 };
    this.customHex = '#6750A4';
    this.renamingBoardId = null;

    // Apply M3 Expressive Theme before canvas init
    this.applyTheme(this.theme, false);

    // Initialize Canvas Engine
    this.canvasEngine = new WhiteboardCanvas(this.canvasElement, this.canvasContainer, {
      theme: this.theme,
      onStateChange: (state) => this.handleCanvasStateChange(state)
    });

    // Load Initial Active Board
    const activeBoard = this.storage.getActiveBoard();
    this.canvasEngine.loadBoard(activeBoard);

    // Bind DOM UI Events, Color Studio, Popovers & Shortcuts
    this.initUI();
    this.initColorStudio();
    this.renderQuickTabs();
    this.renderCustomSwatches();
    this.updateWidthUI(this.canvasEngine.currentWidth);
  }

  /**
   * Apply Material Design 3 Expressive Theme (Light / Dark + 2025 Dynamic Color Tokens)
   */
  applyTheme(theme, save = true) {
    this.theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);

    // Generate & apply 2025 M3 Expressive Dynamic Color Scheme tokens
    try {
      const tokens = generateM3ExpressiveTokens(this.seedColor, this.theme === 'dark');
      const rootStyle = document.documentElement.style;
      for (const [key, value] of Object.entries(tokens)) {
        rootStyle.setProperty(key, value);
      }
    } catch (e) {
      console.warn('Fallback to CSS default M3 tokens:', e);
    }

    // Update adaptive black/white swatch tooltip
    const blackBtn = document.querySelector('.color-btn[data-color="black"]');
    if (blackBtn) {
      blackBtn.title = this.theme === 'dark' ? '白 (ライト時は黒) [1]' : '黒 (ダーク時は白) [1]';
    }

    // Highlight active seed swatch
    document.querySelectorAll('.m3-seed-swatch').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.seed?.toLowerCase() === this.seedColor.toLowerCase());
    });

    if (this.canvasEngine) {
      this.canvasEngine.setTheme(this.theme);
    }

    if (save) {
      this.storage.setTheme(this.theme);
      const themeBtn = document.getElementById('theme-toggle-btn');
      if (themeBtn) {
        animate(
          themeBtn,
          { rotate: [-35, 0], scale: [0.82, 1] },
          { type: 'spring', stiffness: 480, damping: 22 }
        );
      }
      this.showToast(this.theme === 'dark' ? 'ダークテーマに切り替えました' : 'ライトテーマに切り替えました');
    }
  }

  /**
   * Set M3 Expressive Seed Color
   */
  setSeedColor(seedHex) {
    this.seedColor = seedHex;
    this.storage.setSeedColor(seedHex);
    this.applyTheme(this.theme, false);
    this.showToast('M3 Expressive テーマカラーを更新しました');
  }

  /**
   * Toggle Light / Dark Theme
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
    if (penBtn) penBtn.addEventListener('click', () => this.setTool('pen'));
    if (eraserBtn) eraserBtn.addEventListener('click', () => this.setTool('eraser'));

    // Preset Color Swatch Buttons
    document.querySelectorAll('.color-btn[data-color]').forEach(btn => {
      const colorKey = btn.dataset.color;
      if (colorKey === 'custom') return; // Handled by custom color studio trigger
      btn.addEventListener('click', () => {
        this.setColor(colorKey);
        this.closeAllPopovers();
      });
    });

    // Width Preset Buttons
    document.querySelectorAll('.width-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const width = Number(btn.dataset.width);
        this.setWidth(width);
      });
    });

    // M3 Slider for Fine Stroke Width
    const widthSlider = document.getElementById('m3-width-slider');
    if (widthSlider) {
      widthSlider.addEventListener('input', (e) => {
        const val = Number(e.target.value) || 5;
        this.setWidth(val);
      });
    }

    // Popover Toggles (Color Studio, Width Slider, Theme Seed, Data Menu)
    this.setupPopover('custom-color-btn', 'color-picker-popover', () => {
      this.setCustomColor(this.customHex, false);
      this.drawSpectrumCanvas();
    });
    this.setupPopover('width-slider-btn', 'width-popover');
    this.setupPopover('theme-seed-btn', 'theme-seed-popover');
    this.setupPopover('data-menu-btn', 'data-menu-popover');

    const closeColorPopoverBtn = document.getElementById('close-color-popover-btn');
    if (closeColorPopoverBtn) {
      closeColorPopoverBtn.addEventListener('click', () => this.closeAllPopovers());
    }

    // Close popovers when clicking outside
    document.addEventListener('pointerdown', (e) => {
      if (!e.target.closest('.m3-popover-anchor')) {
        this.closeAllPopovers();
      }
    });

    // M3 Seed Swatches
    document.querySelectorAll('.m3-seed-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.seed) {
          this.setSeedColor(btn.dataset.seed);
        }
      });
    });

    // Undo / Redo / Clear
    const undoBtn = document.getElementById('btn-undo');
    const redoBtn = document.getElementById('btn-redo');
    const clearBtn = document.getElementById('btn-clear');

    if (undoBtn) undoBtn.addEventListener('click', () => this.canvasEngine.undo());
    if (redoBtn) redoBtn.addEventListener('click', () => this.canvasEngine.redo());
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.promptConfirmDialog({
          title: 'ボードの全消去',
          message: '現在のボードの描画内容をすべて消去しますか？',
          confirmLabel: 'すべて消去',
          onConfirm: () => {
            this.canvasEngine.clear();
            this.showToast('ボードを消去しました');
          }
        });
      });
    }

    // Export PNG
    const exportBtn = document.getElementById('export-png-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportPng());
    }

    // New Board Button (+) in Unified Tab Strip
    const quickNewBoardBtn = document.getElementById('quick-new-board-btn');
    if (quickNewBoardBtn) {
      quickNewBoardBtn.addEventListener('click', () => this.createNewBoard());
    }

    // Smooth horizontal wheel scrolling on the tab strip
    const tabStrip = document.getElementById('quick-board-tabs');
    if (tabStrip) {
      tabStrip.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          tabStrip.scrollLeft += e.deltaY;
        }
      }, { passive: false });
    }

    // Backup Export & Import in Data Menu
    const exportAllBtn = document.getElementById('export-all-btn');
    const importFileInput = document.getElementById('import-file-input');

    if (exportAllBtn) {
      exportAllBtn.addEventListener('click', () => {
        this.storage.exportJson();
        this.closeAllPopovers();
        this.showToast('全ボードのJSONバックアップを保存しました');
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
              this.renderQuickTabs();
              this.renderCustomSwatches();
              this.closeAllPopovers();
              this.showToast('バックアップからボードを復元しました');
            } else {
              this.showToast('無効なバックアップファイルです');
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
   * Setup M3 Expressive Popover with spring animation
   */
  setupPopover(triggerId, popoverId, onOpen) {
    const trigger = document.getElementById(triggerId);
    const popover = document.getElementById(popoverId);
    if (!trigger || !popover) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = popover.classList.contains('open');
      this.closeAllPopovers();
      if (!isOpen) {
        popover.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        if (onOpen) onOpen();
      }
    });
  }

  closeAllPopovers() {
    document.querySelectorAll('.m3-popover.open').forEach(p => {
      p.classList.remove('open');
    });
    document.querySelectorAll('[aria-expanded="true"]').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  /**
   * Initialize 2D HSV Color Studio Popover (Spectrum + Hue + Hex + Saved Custom Colors)
   */
  initColorStudio() {
    this.spectrumCanvas = document.getElementById('color-spectrum-canvas');
    this.spectrumWrapper = document.getElementById('spectrum-wrapper');
    this.spectrumCursor = document.getElementById('spectrum-cursor');
    this.hueSlider = document.getElementById('color-hue-slider');
    this.hexInput = document.getElementById('custom-hex-input');
    this.nativeColorInput = document.getElementById('native-color-input');
    this.previewPill = document.getElementById('custom-preview-pill');
    this.customColorInner = document.getElementById('custom-color-inner');
    this.saveCustomBtn = document.getElementById('save-custom-color-btn');

    if (!this.spectrumCanvas) return;
    this.spectrumCtx = this.spectrumCanvas.getContext('2d');
    this.drawSpectrumCanvas();
    this.updateColorStudioUI();

    // Pointer interaction on 2D Saturation-Value Spectrum
    let isDraggingSpectrum = false;
    const pickFromSpectrum = (e) => {
      const rect = this.spectrumCanvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      this.hsv.s = Math.round((x / rect.width) * 100);
      this.hsv.v = Math.round(100 - (y / rect.height) * 100);
      const hex = this.hsvToHex(this.hsv.h, this.hsv.s, this.hsv.v);
      this.setCustomColor(hex, false);
    };

    this.spectrumWrapper.addEventListener('pointerdown', (e) => {
      isDraggingSpectrum = true;
      this.spectrumWrapper.setPointerCapture(e.pointerId);
      pickFromSpectrum(e);
    });
    this.spectrumWrapper.addEventListener('pointermove', (e) => {
      if (!isDraggingSpectrum) return;
      pickFromSpectrum(e);
    });
    this.spectrumWrapper.addEventListener('pointerup', () => {
      isDraggingSpectrum = false;
    });

    // Hue Slider
    if (this.hueSlider) {
      this.hueSlider.addEventListener('input', (e) => {
        this.hsv.h = Number(e.target.value);
        this.drawSpectrumCanvas();
        const hex = this.hsvToHex(this.hsv.h, this.hsv.s, this.hsv.v);
        this.setCustomColor(hex, false);
      });
    }

    // Hex Text Input
    if (this.hexInput) {
      this.hexInput.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          this.hsv = this.hexToHsv(val);
          this.drawSpectrumCanvas();
          this.setCustomColor(val.toUpperCase(), false);
        }
      });
    }

    // Native System Color Input fallback
    if (this.nativeColorInput) {
      this.nativeColorInput.addEventListener('input', (e) => {
        const val = e.target.value.toUpperCase();
        this.hsv = this.hexToHsv(val);
        this.drawSpectrumCanvas();
        this.setCustomColor(val, false);
      });
    }

    // Save Custom Color to My Colors
    if (this.saveCustomBtn) {
      this.saveCustomBtn.addEventListener('click', () => {
        this.storage.addCustomColor(this.customHex);
        this.renderCustomSwatches();
        this.setCustomColor(this.customHex, false);
        this.showToast(`マイカラー (${this.customHex}) を保存しました`);
      });
    }
  }

  /**
   * Render 2D HSV Spectrum on Canvas
   */
  drawSpectrumCanvas() {
    if (!this.spectrumCtx || !this.spectrumCanvas) return;
    const width = this.spectrumCanvas.width;
    const height = this.spectrumCanvas.height;
    const ctx = this.spectrumCtx;

    // Base hue fill
    ctx.fillStyle = `hsl(${this.hsv.h}, 100%, 50%)`;
    ctx.fillRect(0, 0, width, height);

    // White horizontal gradient (Saturation)
    const gradWhite = ctx.createLinearGradient(0, 0, width, 0);
    gradWhite.addColorStop(0, 'rgba(255,255,255,1)');
    gradWhite.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradWhite;
    ctx.fillRect(0, 0, width, height);

    // Black vertical gradient (Value / Brightness)
    const gradBlack = ctx.createLinearGradient(0, 0, 0, height);
    gradBlack.addColorStop(0, 'rgba(0,0,0,0)');
    gradBlack.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = gradBlack;
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * Update Color Studio UI indicators
   */
  updateColorStudioUI() {
    if (this.spectrumCursor) {
      this.spectrumCursor.style.left = `${this.hsv.s}%`;
      this.spectrumCursor.style.top = `${100 - this.hsv.v}%`;
      this.spectrumCursor.style.backgroundColor = this.customHex;
    }
    if (this.hueSlider) {
      this.hueSlider.value = String(this.hsv.h);
    }
    if (this.hexInput && document.activeElement !== this.hexInput) {
      this.hexInput.value = this.customHex.toUpperCase();
    }
    if (this.nativeColorInput) {
      this.nativeColorInput.value = this.customHex.toLowerCase();
    }
    if (this.previewPill) {
      this.previewPill.style.backgroundColor = this.customHex;
    }
    if (this.customColorInner) {
      this.customColorInner.style.backgroundColor = this.customHex;
    }
  }

  /**
   * Render Saved Custom Swatches Grid inside Color Studio
   */
  renderCustomSwatches() {
    const grid = document.getElementById('custom-swatches-grid');
    if (!grid) return;

    const colors = this.storage.getCustomColors();
    grid.innerHTML = '';

    colors.forEach(hex => {
      const btn = document.createElement('button');
      const isSelected =
        this.canvasEngine.currentColorKey === 'custom' &&
        this.customHex.toLowerCase() === hex.toLowerCase();
      btn.className = `m3-saved-swatch ${isSelected ? 'active' : ''}`;
      btn.style.backgroundColor = hex;
      btn.title = hex.toUpperCase();
      btn.innerHTML = '<md-ripple></md-ripple>';
      btn.addEventListener('click', () => {
        this.hsv = this.hexToHsv(hex);
        this.drawSpectrumCanvas();
        this.setCustomColor(hex.toUpperCase(), false);
      });
      grid.appendChild(btn);
    });
  }

  /**
   * Set Active Drawing Tool (Pen / Eraser) with M3 Expressive Icon Morph & Spring Physics
   */
  setTool(tool) {
    this.canvasEngine.currentTool = tool;
    document.querySelectorAll('.m3-tool-btn[data-tool]').forEach(btn => {
      const isTarget = btn.dataset.tool === tool;
      btn.classList.toggle('active', isTarget);
    });

    // Swap Outlined <-> Filled M3 Icons
    const penIconWrap = document.getElementById('tool-pen-icon');
    const eraserIconWrap = document.getElementById('tool-eraser-icon');
    if (penIconWrap) penIconWrap.innerHTML = getIcon('pen', tool === 'pen');
    if (eraserIconWrap) eraserIconWrap.innerHTML = getIcon('eraser', tool === 'eraser');

    const activeWrap = tool === 'pen' ? penIconWrap : eraserIconWrap;
    if (activeWrap) {
      animate(
        activeWrap,
        { scale: [0.72, 1.14, 1], rotate: [-12, 0] },
        { type: 'spring', stiffness: 520, damping: 24 }
      );
    }
  }

  /**
   * Set Preset Pen Color
   */
  setColor(colorKey) {
    this.setTool('pen');
    this.canvasEngine.currentColorKey = colorKey;
    document.querySelectorAll('.color-btn').forEach(btn => {
      const isMatch = btn.dataset.color === colorKey;
      btn.classList.toggle('active', isMatch);
      if (isMatch) {
        animate(
          btn,
          { scale: [0.85, 1.12, 1.08] },
          { type: 'spring', stiffness: 520, damping: 24 }
        );
      }
    });
    this.renderCustomSwatches();
  }

  /**
   * Set Arbitrary Custom Hex Color
   */
  setCustomColor(hex, closePopover = false) {
    this.customHex = hex.toUpperCase();
    this.setTool('pen');
    this.canvasEngine.currentColorKey = 'custom';
    this.canvasEngine.currentCustomColor = this.customHex;

    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === 'custom');
    });

    this.updateColorStudioUI();
    this.renderCustomSwatches();

    if (closePopover) {
      this.closeAllPopovers();
    }
  }

  /**
   * Set Stroke Width (1px..48px)
   */
  setWidth(width) {
    const clamped = Math.max(1, Math.min(48, Math.round(width)));
    this.canvasEngine.currentWidth = clamped;
    this.updateWidthUI(clamped);
  }

  updateWidthUI(width) {
    document.querySelectorAll('.width-btn').forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.width) === width);
    });

    const badge = document.getElementById('width-value-badge');
    const readout = document.getElementById('width-readout-label');
    const slider = document.getElementById('m3-width-slider');
    const liveDot = document.getElementById('width-live-dot');

    if (badge) badge.textContent = `${width}px`;
    if (readout) readout.textContent = `${width} px`;
    if (slider && Number(slider.value) !== width) slider.value = width;
    if (liveDot) {
      liveDot.style.width = `${width}px`;
      liveDot.style.height = `${width}px`;
    }
  }

  /**
   * Handle Canvas State Updates & Calm Non-Flickering Auto-Save
   */
  handleCanvasStateChange(state) {
    // Update Undo / Redo Buttons
    const undoBtn = document.getElementById('btn-undo');
    const redoBtn = document.getElementById('btn-redo');
    if (undoBtn) undoBtn.disabled = !state.canUndo;
    if (redoBtn) redoBtn.disabled = !state.canRedo;

    // Do not re-save or animate indicator when simply loading/switching boards
    if (state.isBoardLoad) return;

    // Immediately persist to LocalStorage (synchronous & zero-latency)
    this.storage.updateActiveBoardStrokes(state.strokes, state.undoStack, state.redoStack);

    // Update tooltip with timestamp without flickering the UI
    const cacheStatus = document.getElementById('cache-status');
    const nowStr = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (cacheStatus) {
      cacheStatus.title = `ローカルストレージに自動保存済み (最終保存: ${nowStr})`;
    }

    // Debounce a subtle check icon bounce only after user pauses drawing for 900ms (zero flicker!)
    clearTimeout(this.saveSettleTimer);
    this.saveSettleTimer = setTimeout(() => {
      const saveIcon = document.getElementById('save-status-icon');
      if (saveIcon) {
        animate(
          saveIcon,
          { scale: [0.86, 1.12, 1] },
          { type: 'spring', stiffness: 460, damping: 24 }
        );
      }
    }, 900);
  }

  /**
   * Render Unified Fixed-Width Board Tabs in Top App Bar
   * Consolidates tab switching, board title display, inline renaming, duplicating, and deleting!
   */
  renderQuickTabs() {
    const container = document.getElementById('quick-board-tabs');
    if (!container) return;

    const boards = this.storage.getAllBoards();
    const activeBoard = this.storage.getActiveBoard();

    container.innerHTML = '';

    boards.forEach(board => {
      const isActive = board.id === activeBoard.id;
      const tab = document.createElement('div');
      tab.className = `m3-board-tab ${isActive ? 'active' : ''}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.dataset.boardId = board.id;
      tab.title = `${board.title} (ダブルクリックで名前変更)`;

      const isRenaming = this.renamingBoardId === board.id;

      tab.innerHTML = `
        <md-ripple></md-ripple>
        <span class="m3-tab-lead-icon">${getIcon('board', isActive)}</span>
        ${
          isRenaming
            ? `<input type="text" class="m3-tab-rename-input" value="${this.escapeHtml(board.title)}" maxlength="40" aria-label="ボード名を入力" />`
            : `<span class="m3-tab-title">${this.escapeHtml(board.title)}</span>`
        }
        <div class="m3-tab-actions">
          <button class="m3-tab-action-btn rename" title="ボード名を変更" aria-label="ボード名を変更">
            ${getIcon('edit')}
          </button>
          <button class="m3-tab-action-btn duplicate" title="ボードを複製" aria-label="ボードを複製">
            ${getIcon('copy')}
          </button>
          <button class="m3-tab-action-btn delete" title="${boards.length > 1 ? 'ボードを削除' : 'ボードをリセット'}" aria-label="ボードを削除">
            ${getIcon('close')}
          </button>
        </div>
      `;

      // Handle inline rename input if currently editing this tab
      if (isRenaming) {
        const input = tab.querySelector('.m3-tab-rename-input');
        if (input) {
          requestAnimationFrame(() => {
            input.focus();
            input.select();
          });

          const commitRename = () => {
            if (this.renamingBoardId !== board.id) return;
            this.renamingBoardId = null;
            const nextTitle = input.value.trim();
            if (nextTitle && nextTitle !== board.title) {
              this.storage.renameBoard(board.id, nextTitle);
              this.showToast(`ボード名を「${nextTitle}」に変更しました`);
            }
            this.renderQuickTabs();
          };

          input.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
              e.preventDefault();
              commitRename();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              this.renamingBoardId = null;
              this.renderQuickTabs();
            }
          });

          input.addEventListener('blur', () => commitRename());
          input.addEventListener('click', (e) => e.stopPropagation());
        }
      }

      // Click tab to switch board
      tab.addEventListener('click', (e) => {
        if (e.target.closest('.m3-tab-action-btn') || e.target.closest('.m3-tab-rename-input')) return;
        if (!isActive) {
          this.switchBoard(board.id);
        }
      });

      // Double-click tab title to rename inline (zero position shift!)
      tab.addEventListener('dblclick', (e) => {
        if (e.target.closest('.m3-tab-action-btn')) return;
        e.stopPropagation();
        this.renamingBoardId = board.id;
        this.renderQuickTabs();
      });

      // Rename button inside tab
      const renameBtn = tab.querySelector('.m3-tab-action-btn.rename');
      if (renameBtn) {
        renameBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.renamingBoardId = board.id;
          this.renderQuickTabs();
        });
      }

      // Duplicate button inside tab
      const dupBtn = tab.querySelector('.m3-tab-action-btn.duplicate');
      if (dupBtn) {
        dupBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const copy = this.storage.duplicateBoard(board.id);
          if (copy) {
            this.canvasEngine.loadBoard(copy);
            this.renderQuickTabs(copy.id);
            this.showToast(`「${copy.title}」を複製しました`);
          }
        });
      }

      // Delete button inside tab
      const delBtn = tab.querySelector('.m3-tab-action-btn.delete');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isLast = boards.length <= 1;
          this.promptConfirmDialog({
            title: isLast ? 'ボードのリセット' : 'ボードの削除',
            message: isLast
              ? `「${board.title}」の描画内容をすべてクリアしますか？`
              : `ボード「${board.title}」を削除しますか？`,
            confirmLabel: isLast ? 'リセットする' : '削除する',
            onConfirm: () => {
              const res = this.storage.deleteBoard(board.id);
              if (res.activeBoard) {
                this.canvasEngine.loadBoard(res.activeBoard);
              }
              this.renderQuickTabs();
              this.showToast(res.deleted ? `「${board.title}」を削除しました` : 'ボードをリセットしました');
            }
          });
        });
      }

      container.appendChild(tab);
    });
  }

  /**
   * Switch Active Board with M3 Expressive Spring Animation
   */
  switchBoard(boardId) {
    const board = this.storage.switchBoard(boardId);
    if (board) {
      this.renamingBoardId = null;
      this.canvasEngine.loadBoard(board);
      this.renderQuickTabs();

      const activeTabEl = document.querySelector(`.m3-board-tab[data-board-id="${boardId}"]`);
      if (activeTabEl) {
        animate(
          activeTabEl,
          { scale: [0.93, 1.02, 1] },
          { type: 'spring', stiffness: 520, damping: 28 }
        );
      }
    }
  }

  /**
   * Create New Board and animate its tab entrance
   */
  createNewBoard() {
    const title = `ボード ${this.storage.getAllBoards().length + 1}`;
    const newBoard = this.storage.createBoard(title);
    this.renamingBoardId = null;
    this.canvasEngine.loadBoard(newBoard);
    this.renderQuickTabs();

    const newTabEl = document.querySelector(`.m3-board-tab[data-board-id="${newBoard.id}"]`);
    if (newTabEl) {
      newTabEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      animate(
        newTabEl,
        { scale: [0.85, 1.04, 1], opacity: [0.4, 1] },
        { type: 'spring', stiffness: 480, damping: 26 }
      );
    }
    this.showToast(`「${newBoard.title}」を作成しました`);
  }

  /**
   * Show M3 Expressive Confirmation Dialog
   */
  promptConfirmDialog({ title, message, confirmLabel, onConfirm }) {
    const dialog = document.getElementById('confirm-dialog');
    const titleEl = document.getElementById('dialog-title');
    const msgEl = document.getElementById('dialog-message');
    const confirmLabelEl = document.getElementById('dialog-confirm-label');
    const cancelBtn = document.getElementById('dialog-cancel-btn');
    const confirmBtn = document.getElementById('dialog-confirm-btn');

    if (!dialog) {
      if (confirm(message)) onConfirm();
      return;
    }

    if (titleEl) titleEl.textContent = title || '確認';
    if (msgEl) msgEl.textContent = message || '';
    if (confirmLabelEl) confirmLabelEl.textContent = confirmLabel || '実行する';

    dialog.showModal();
    const surface = dialog.querySelector('.m3-dialog-surface');
    if (surface) {
      animate(
        surface,
        { scale: [0.88, 1], opacity: [0, 1] },
        { type: 'spring', stiffness: 520, damping: 28 }
      );
    }

    const handleCancel = () => {
      dialog.close();
      cleanup();
    };

    const handleConfirm = () => {
      dialog.close();
      cleanup();
      onConfirm();
    };

    const cleanup = () => {
      cancelBtn.removeEventListener('click', handleCancel);
      confirmBtn.removeEventListener('click', handleConfirm);
    };

    cancelBtn.addEventListener('click', handleCancel);
    confirmBtn.addEventListener('click', handleConfirm);
  }

  /**
   * Export current board as PNG image
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

    const colorShortcutMap = {
      '1': 'black',
      '2': 'red',
      '3': 'orange',
      '4': 'yellow',
      '5': 'green',
      '6': 'blue',
      '7': 'purple'
    };

    if (colorShortcutMap[e.key]) {
      this.setColor(colorShortcutMap[e.key]);
    } else if (e.key.toLowerCase() === 'p') {
      this.setTool('pen');
    } else if (e.key.toLowerCase() === 'e') {
      this.setTool('eraser');
    } else if (e.key.toLowerCase() === 't') {
      this.toggleTheme();
    } else if (e.key === '[') {
      this.setWidth(Math.max(1, this.canvasEngine.currentWidth - 2));
    } else if (e.key === ']') {
      this.setWidth(Math.min(48, this.canvasEngine.currentWidth + 2));
    }
  }

  /**
   * HSV <-> HEX Utilities
   */
  hsvToHex(h, s, v) {
    const sNorm = s / 100;
    const vNorm = v / 100;
    const c = vNorm * sNorm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = vNorm - c;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    const toHex = (n) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  hexToHsv(hex) {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h = 0;
    if (d !== 0) {
      if (max === r) h = 60 * (((g - b) / d) % 6);
      else if (max === g) h = 60 * ((b - r) / d + 2);
      else h = 60 * ((r - g) / d + 4);
    }
    if (h < 0) h += 360;

    const s = max === 0 ? 0 : (d / max) * 100;
    const v = max * 100;

    return {
      h: Math.round(h),
      s: Math.round(s),
      v: Math.round(v)
    };
  }

  /**
   * Show M3 Expressive Snackbar / Toast
   */
  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
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

document.addEventListener('DOMContentLoaded', () => {
  window.app = new WhiteboardApp();
});
