/**
 * app.js - Material Design 3 Expressive Application Controller
 * Handles unified full-title board tabs (zero truncation & zero position shift),
 * M3 2025 Dynamic Color tokens, mobile-first viewport-safe popovers,
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
    this.activePopoverPair = null;
    this.confirmCallback = null;
    this.renamingBoard = null;

    // Apply M3 Expressive Theme before canvas init
    this.applyTheme(this.theme, false);

    // Initialize Canvas Engine
    this.canvasEngine = new WhiteboardCanvas(this.canvasElement, this.canvasContainer, {
      theme: this.theme,
      onStateChange: (state) => this.handleCanvasStateChange(state),
      onViewportChange: (vp) => this.updateZoomUI(vp)
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
   * Safe wrapper around Motion animate() so animation errors never block UI logic
   */
  safeAnimate(target, keyframes, options) {
    if (!target) return;
    try {
      animate(target, keyframes, options);
    } catch (err) {
      // Ignore animation exceptions so UI interactions always complete
    }
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
      this.safeAnimate(
        themeBtn,
        { rotate: [-35, 0], scale: [0.82, 1] },
        { type: 'spring', stiffness: 480, damping: 22 }
      );
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
      if (colorKey === 'custom') return;
      btn.addEventListener('click', () => {
        this.setColor(colorKey);
        this.closeAllPopovers();
      });
    });

    // Width Preset Buttons (Toolbar & Width Popover Chips)
    document.querySelectorAll('.width-btn, .m3-width-chip').forEach(btn => {
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

    // Viewport-Safe Popover Toggles
    this.setupPopover('custom-color-btn', 'color-picker-popover', 'above', () => {
      this.setCustomColor(this.customHex, false);
      this.drawSpectrumCanvas();
    });
    this.setupPopover('width-slider-btn', 'width-popover', 'above');
    this.setupPopover('theme-seed-btn', 'theme-seed-popover', 'below');
    this.setupPopover('data-menu-btn', 'data-menu-popover', 'below');

    // Close buttons inside all popovers
    ['close-color-popover-btn', 'close-width-popover-btn', 'close-seed-popover-btn', 'close-data-popover-btn'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => this.closeAllPopovers());
      }
    });

    // Close popovers when clicking outside
    document.addEventListener('pointerdown', (e) => {
      if (
        !e.target.closest('.m3-popover') &&
        !e.target.closest('[aria-expanded]')
      ) {
        this.closeAllPopovers();
      }
    });

    window.addEventListener('resize', () => {
      if (this.activePopoverPair) {
        this.positionPopover(
          this.activePopoverPair.trigger,
          this.activePopoverPair.popover,
          this.activePopoverPair.placement
        );
      }
    });

    // M3 Seed Swatches
    document.querySelectorAll('.m3-seed-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.seed) {
          this.setSeedColor(btn.dataset.seed);
          this.closeAllPopovers();
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

    // Zoom / Pan HUD Controls
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const zoomResetBtn = document.getElementById('zoom-reset-btn');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        this.canvasEngine.zoomAt(1.25);
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        this.canvasEngine.zoomAt(0.8);
      });
    }
    if (zoomResetBtn) {
      zoomResetBtn.addEventListener('click', () => {
        this.canvasEngine.resetViewport();
        this.showToast('表示倍率・位置をリセットしました (100%)');
      });
    }

    // Unified Board Tab Controls: Add / Rename / Duplicate / Delete
    const quickNewBoardBtn = document.getElementById('quick-new-board-btn');
    const renameBoardBtn = document.getElementById('active-board-rename-btn');
    const duplicateBoardBtn = document.getElementById('active-board-duplicate-btn');
    const deleteBoardBtn = document.getElementById('active-board-delete-btn');

    if (quickNewBoardBtn) {
      quickNewBoardBtn.addEventListener('click', () => this.createNewBoard());
    }
    if (renameBoardBtn) {
      renameBoardBtn.addEventListener('click', () => {
        const active = this.storage.getActiveBoard();
        this.openRenameDialog(active);
      });
    }
    if (duplicateBoardBtn) {
      duplicateBoardBtn.addEventListener('click', () => {
        const active = this.storage.getActiveBoard();
        const copy = this.storage.duplicateBoard(active.id);
        if (copy) {
          this.canvasEngine.loadBoard(copy);
          this.renderQuickTabs();
          this.scrollToTab(copy.id);
          this.showToast(`「${copy.title}」を複製しました`);
        }
      });
    }
    if (deleteBoardBtn) {
      deleteBoardBtn.addEventListener('click', () => {
        const boards = this.storage.getAllBoards();
        const active = this.storage.getActiveBoard();
        const isLast = boards.length <= 1;
        this.promptConfirmDialog({
          title: isLast ? 'ボードのリセット' : 'ボードの削除',
          message: isLast
            ? `「${active.title}」の描画内容をすべてクリアしますか？`
            : `ボード「${active.title}」を削除しますか？`,
          confirmLabel: isLast ? 'リセットする' : '削除する',
          onConfirm: () => {
            const res = this.storage.deleteBoard(active.id);
            if (res.activeBoard) {
              this.canvasEngine.loadBoard(res.activeBoard);
            }
            this.renderQuickTabs();
            this.showToast(res.deleted ? `「${active.title}」を削除しました` : 'ボードをリセットしました');
          }
        });
      });
    }

    // Bind Modal Dialog Buttons ONCE (Confirm Dialog & Rename Dialog)
    const confirmDialog = document.getElementById('confirm-dialog');
    const dialogCancelBtn = document.getElementById('dialog-cancel-btn');
    const dialogConfirmBtn = document.getElementById('dialog-confirm-btn');

    if (dialogCancelBtn) {
      dialogCancelBtn.addEventListener('click', () => {
        this.confirmCallback = null;
        if (confirmDialog?.open) confirmDialog.close();
      });
    }
    if (dialogConfirmBtn) {
      dialogConfirmBtn.addEventListener('click', () => {
        const cb = this.confirmCallback;
        this.confirmCallback = null;
        if (confirmDialog?.open) confirmDialog.close();
        if (typeof cb === 'function') cb();
      });
    }
    if (confirmDialog) {
      confirmDialog.addEventListener('click', (e) => {
        if (e.target === confirmDialog) {
          this.confirmCallback = null;
          confirmDialog.close();
        }
      });
    }

    const renameDialog = document.getElementById('rename-dialog');
    const renameInput = document.getElementById('rename-dialog-input');
    const renameCancelBtn = document.getElementById('rename-cancel-btn');
    const renameConfirmBtn = document.getElementById('rename-confirm-btn');

    if (renameCancelBtn) {
      renameCancelBtn.addEventListener('click', () => {
        this.renamingBoard = null;
        if (renameDialog?.open) renameDialog.close();
      });
    }
    if (renameConfirmBtn) {
      renameConfirmBtn.addEventListener('click', () => {
        this.commitRenameDialog();
      });
    }
    if (renameInput) {
      renameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.commitRenameDialog();
        }
      });
    }
    if (renameDialog) {
      renameDialog.addEventListener('click', (e) => {
        if (e.target === renameDialog) {
          this.renamingBoard = null;
          renameDialog.close();
        }
      });
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
    const importJsonBtn = document.getElementById('import-json-btn');
    const importFileInput = document.getElementById('import-file-input');

    if (exportAllBtn) {
      exportAllBtn.addEventListener('click', () => {
        this.storage.exportJson();
        this.closeAllPopovers();
        this.showToast('全ボードのJSONバックアップを保存しました');
      });
    }

    if (importJsonBtn && importFileInput) {
      importJsonBtn.addEventListener('click', () => {
        importFileInput.click();
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
   * Setup Viewport-Safe M3 Expressive Popover
   */
  setupPopover(triggerId, popoverId, placement = 'above', onOpen) {
    const trigger = document.getElementById(triggerId);
    const popover = document.getElementById(popoverId);
    if (!trigger || !popover) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = popover.classList.contains('open');
      this.closeAllPopovers();
      if (!isOpen) {
        if (onOpen) onOpen();
        this.positionPopover(trigger, popover, placement);
        popover.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        this.activePopoverPair = { trigger, popover, placement };
      }
    });
  }

  /**
   * Dynamically position fixed popover so it never clips off-screen on mobile or desktop
   */
  positionPopover(trigger, popover, placement = 'above') {
    const trigRect = trigger.getBoundingClientRect();
    const popWidth = popover.offsetWidth || 260;
    const popHeight = popover.offsetHeight || 220;
    const margin = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = trigRect.left + trigRect.width / 2 - popWidth / 2;
    left = Math.max(margin, Math.min(vw - popWidth - margin, left));

    if (placement === 'below') {
      let top = trigRect.bottom + 10;
      if (top + popHeight > vh - margin) {
        top = Math.max(margin, vh - popHeight - margin);
      }
      popover.style.top = `${Math.round(top)}px`;
      popover.style.bottom = 'auto';
      popover.style.transformOrigin = 'top center';
    } else {
      // Place above the floating toolbar dock so it never covers toolbar buttons on mobile
      const toolbar = document.getElementById('floating-toolbar');
      const anchorTop = toolbar ? toolbar.getBoundingClientRect().top : trigRect.top;
      let bottom = vh - anchorTop + 12;
      if (vh - bottom - popHeight < margin) {
        bottom = Math.max(margin, vh - popHeight - margin);
      }
      popover.style.bottom = `${Math.round(bottom)}px`;
      popover.style.top = 'auto';
      popover.style.transformOrigin = 'bottom center';
    }

    popover.style.left = `${Math.round(left)}px`;
  }

  closeAllPopovers() {
    document.querySelectorAll('.m3-popover.open').forEach(p => {
      p.classList.remove('open');
    });
    document.querySelectorAll('[aria-expanded="true"]').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
    });
    this.activePopoverPair = null;
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

    if (this.hueSlider) {
      this.hueSlider.addEventListener('input', (e) => {
        this.hsv.h = Number(e.target.value);
        this.drawSpectrumCanvas();
        const hex = this.hsvToHex(this.hsv.h, this.hsv.s, this.hsv.v);
        this.setCustomColor(hex, false);
      });
    }

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

    if (this.nativeColorInput) {
      this.nativeColorInput.addEventListener('input', (e) => {
        const val = e.target.value.toUpperCase();
        this.hsv = this.hexToHsv(val);
        this.drawSpectrumCanvas();
        this.setCustomColor(val, false);
      });
    }

    if (this.saveCustomBtn) {
      this.saveCustomBtn.addEventListener('click', () => {
        this.storage.addCustomColor(this.customHex);
        this.renderCustomSwatches();
        this.setCustomColor(this.customHex, false);
        this.showToast(`マイカラー (${this.customHex}) を保存しました`);
      });
    }

    const applyCustomBtn = document.getElementById('apply-custom-color-btn');
    if (applyCustomBtn) {
      applyCustomBtn.addEventListener('click', () => {
        this.setCustomColor(this.customHex, true);
        this.showToast(`カラー ${this.customHex} を選択しました`);
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

    ctx.fillStyle = `hsl(${this.hsv.h}, 100%, 50%)`;
    ctx.fillRect(0, 0, width, height);

    const gradWhite = ctx.createLinearGradient(0, 0, width, 0);
    gradWhite.addColorStop(0, 'rgba(255,255,255,1)');
    gradWhite.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradWhite;
    ctx.fillRect(0, 0, width, height);

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
      btn.type = 'button';
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
  setTool(tool, animateIcon = true) {
    this.canvasEngine.currentTool = tool;
    document.querySelectorAll('.m3-tool-btn[data-tool]').forEach(btn => {
      const isTarget = btn.dataset.tool === tool;
      btn.classList.toggle('active', isTarget);
    });

    const penIconWrap = document.getElementById('tool-pen-icon');
    const eraserIconWrap = document.getElementById('tool-eraser-icon');
    if (penIconWrap) penIconWrap.innerHTML = getIcon('pen', tool === 'pen');
    if (eraserIconWrap) eraserIconWrap.innerHTML = getIcon('eraser', tool === 'eraser');

    if (animateIcon) {
      const activeWrap = tool === 'pen' ? penIconWrap : eraserIconWrap;
      this.safeAnimate(
        activeWrap,
        { scale: [0.76, 1], rotate: [-12, 0] },
        { type: 'spring', stiffness: 520, damping: 20 }
      );
    }
  }

  /**
   * Set Preset Pen Color
   */
  setColor(colorKey) {
    if (this.canvasEngine.currentTool !== 'pen') {
      this.setTool('pen', true);
    }
    this.canvasEngine.currentColorKey = colorKey;
    document.querySelectorAll('.color-btn').forEach(btn => {
      const isMatch = btn.dataset.color === colorKey;
      btn.classList.toggle('active', isMatch);
      if (isMatch) {
        this.safeAnimate(
          btn,
          { scale: [0.88, 1] },
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
    if (this.canvasEngine.currentTool !== 'pen') {
      this.setTool('pen', true);
    }
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
    document.querySelectorAll('.width-btn, .m3-width-chip').forEach(btn => {
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
   * Update Zoom HUD Readout
   */
  updateZoomUI(vp) {
    const zoomText = document.getElementById('zoom-level-text');
    if (zoomText && vp) {
      zoomText.textContent = `${Math.round(vp.scale * 100)}%`;
    }
  }

  /**
   * Handle Canvas State Updates & Calm Non-Flickering Auto-Save
   */
  handleCanvasStateChange(state) {
    const undoBtn = document.getElementById('btn-undo');
    const redoBtn = document.getElementById('btn-redo');
    if (undoBtn) undoBtn.disabled = !state.canUndo;
    if (redoBtn) redoBtn.disabled = !state.canRedo;

    if (state.isBoardLoad) return;

    this.storage.updateActiveBoardStrokes(state.strokes, state.undoStack, state.redoStack);

    const cacheStatus = document.getElementById('cache-status');
    const nowStr = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (cacheStatus) {
      cacheStatus.title = `ローカルストレージに自動保存済み (最終保存: ${nowStr})`;
    }

    clearTimeout(this.saveSettleTimer);
    this.saveSettleTimer = setTimeout(() => {
      const saveIcon = document.getElementById('save-status-icon');
      this.safeAnimate(
        saveIcon,
        { scale: [0.85, 1] },
        { type: 'spring', stiffness: 460, damping: 20 }
      );
    }, 900);
  }

  /**
   * Render Unified Board Tabs in Top App Bar
   * - Displays the FULL board name without '...' truncation!
   * - Identical sizing between active and inactive states so switching tabs never shifts positions!
   */
  renderQuickTabs() {
    const container = document.getElementById('quick-board-tabs');
    if (!container) return;

    const boards = this.storage.getAllBoards();
    const activeBoard = this.storage.getActiveBoard();

    container.innerHTML = '';

    boards.forEach(board => {
      const isActive = board.id === activeBoard.id;
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = `m3-board-tab ${isActive ? 'active' : ''}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.dataset.boardId = board.id;
      tab.title = `${board.title} (ダブルクリックで名前変更)`;

      tab.innerHTML = `
        <md-ripple></md-ripple>
        <span class="m3-tab-lead-icon">${getIcon('board', isActive)}</span>
        <span class="m3-tab-title">${this.escapeHtml(board.title)}</span>
      `;

      tab.addEventListener('click', () => {
        if (!isActive) {
          this.switchBoard(board.id);
        }
      });

      tab.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        this.openRenameDialog(board);
      });

      container.appendChild(tab);
    });

    // Update Delete button tooltip based on board count
    const deleteBoardBtn = document.getElementById('active-board-delete-btn');
    if (deleteBoardBtn) {
      deleteBoardBtn.title = boards.length > 1 ? '現在のボードを削除' : '現在のボードをリセット';
    }
  }

  scrollToTab(boardId) {
    const tabEl = document.querySelector(`.m3-board-tab[data-board-id="${boardId}"]`);
    if (tabEl) {
      tabEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }

  /**
   * Open M3 Expressive Rename Dialog
   */
  openRenameDialog(board) {
    const dialog = document.getElementById('rename-dialog');
    const input = document.getElementById('rename-dialog-input');

    if (!dialog || !input || !board) return;

    this.closeAllPopovers();
    this.renamingBoard = board;
    input.value = board.title || '';

    if (!dialog.open) {
      dialog.showModal();
    }

    const surface = dialog.querySelector('.m3-dialog-surface');
    this.safeAnimate(
      surface,
      { scale: [0.88, 1], opacity: [0, 1] },
      { type: 'spring', stiffness: 520, damping: 28 }
    );

    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
  }

  /**
   * Commit Board Rename from Rename Dialog
   */
  commitRenameDialog() {
    const dialog = document.getElementById('rename-dialog');
    const input = document.getElementById('rename-dialog-input');
    const board = this.renamingBoard;
    this.renamingBoard = null;

    if (dialog?.open) {
      dialog.close();
    }
    if (!board || !input) return;

    const nextTitle = input.value.trim();
    if (nextTitle && nextTitle !== board.title) {
      this.storage.renameBoard(board.id, nextTitle);
      this.renderQuickTabs();
      this.scrollToTab(board.id);
      this.showToast(`ボード名を「${nextTitle}」に変更しました`);
    }
  }

  /**
   * Switch Active Board with M3 Expressive Spring Animation
   */
  switchBoard(boardId) {
    const board = this.storage.switchBoard(boardId);
    if (board) {
      this.canvasEngine.loadBoard(board);
      this.renderQuickTabs();
      this.scrollToTab(boardId);

      const activeTabEl = document.querySelector(`.m3-board-tab[data-board-id="${boardId}"]`);
      this.safeAnimate(
        activeTabEl,
        { scale: [0.92, 1] },
        { type: 'spring', stiffness: 520, damping: 24 }
      );
    }
  }

  /**
   * Create New Board and animate its tab entrance
   */
  createNewBoard() {
    const title = `ボード ${this.storage.getAllBoards().length + 1}`;
    const newBoard = this.storage.createBoard(title);
    this.canvasEngine.loadBoard(newBoard);
    this.renderQuickTabs();
    this.scrollToTab(newBoard.id);

    const newTabEl = document.querySelector(`.m3-board-tab[data-board-id="${newBoard.id}"]`);
    this.safeAnimate(
      newTabEl,
      { scale: [0.85, 1], opacity: [0.4, 1] },
      { type: 'spring', stiffness: 480, damping: 24 }
    );
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

    if (!dialog) {
      if (confirm(message)) onConfirm();
      return;
    }

    this.closeAllPopovers();
    this.confirmCallback = onConfirm;

    if (titleEl) titleEl.textContent = title || '確認';
    if (msgEl) msgEl.textContent = message || '';
    if (confirmLabelEl) confirmLabelEl.textContent = confirmLabel || '実行する';

    if (!dialog.open) {
      dialog.showModal();
    }

    const surface = dialog.querySelector('.m3-dialog-surface');
    this.safeAnimate(
      surface,
      { scale: [0.88, 1], opacity: [0, 1] },
      { type: 'spring', stiffness: 520, damping: 28 }
    );
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

    if (isCtrlOrCmd && (e.key === '=' || e.key === '+')) {
      e.preventDefault();
      this.canvasEngine.zoomAt(1.25);
      return;
    }

    if (isCtrlOrCmd && e.key === '-') {
      e.preventDefault();
      this.canvasEngine.zoomAt(0.8);
      return;
    }

    if (isCtrlOrCmd && e.key === '0') {
      e.preventDefault();
      this.canvasEngine.resetViewport();
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
