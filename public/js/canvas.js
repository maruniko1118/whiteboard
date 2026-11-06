/**
 * canvas.js - High-performance HTML5 Canvas Vector Engine
 * Handles smooth Bézier curves, preset + arbitrary custom color rendering, Retina scaling, and theme adaptation
 */

// Preset color map (with theme-adaptive contrast)
export const PALETTE_COLORS = {
  light: {
    black: '#0f172a',
    red: '#ef4444',
    orange: '#f97316',
    yellow: '#d97706',
    green: '#10b981',
    blue: '#2563eb',
    purple: '#8b5cf6',
    pink: '#ec4899'
  },
  dark: {
    black: '#ffffff', // In dark theme, adaptive 'black' renders as crisp white
    red: '#f87171',
    orange: '#fb923c',
    yellow: '#facc15',
    green: '#34d399',
    blue: '#60a5fa',
    purple: '#a78bfa',
    pink: '#f472b6'
  }
};

export class WhiteboardCanvas {
  constructor(canvasElement, containerElement, options = {}) {
    this.canvas = canvasElement;
    this.container = containerElement;
    this.ctx = this.canvas.getContext('2d');

    // Current Drawing Config
    this.currentTool = 'pen'; // 'pen' | 'eraser'
    this.currentColorKey = 'black'; // preset key or 'custom'
    this.currentCustomColor = '#6750A4'; // custom hex when currentColorKey === 'custom'
    this.currentWidth = 5; // 1..48
    this.theme = options.theme || 'light';

    // Viewport Pan & Zoom State
    this.panX = 0;
    this.panY = 0;
    this.scale = 1;
    this.minScale = 0.2;
    this.maxScale = 5.0;

    // Interaction State
    this.isDrawing = false;
    this.isPanning = false;
    this.panPointerId = null;
    this.panLastClient = { x: 0, y: 0 };

    // Multi-touch Gesture State (for Smartphone 2-finger Pan & Pinch-to-Zoom)
    this.activePointers = new Map();
    this.isTouchGesturing = false;
    this.lastGestureMid = null;
    this.lastGestureDist = 0;

    this.currentStroke = null;
    this.strokes = [];
    this.undoStack = [];
    this.redoStack = [];

    // Callbacks
    this.onStateChange = options.onStateChange || (() => {});
    this.onViewportChange = options.onViewportChange || (() => {});

    // Init Canvas & Listeners
    this.setupCanvasSize();
    this.attachEventListeners();
    this.updateGridBackground();
  }

  /**
   * Set up canvas resolution for High-DPI screens
   */
  setupCanvasSize() {
    const rect = this.container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    this.dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = Math.floor(rect.width * this.dpr);
    this.canvas.height = Math.floor(rect.height * this.dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
    this.redrawAll();
  }

  /**
   * Synchronize the container's dot grid with current pan & zoom
   */
  updateGridBackground() {
    if (!this.container) return;
    const gridSize = 24 * this.scale;
    this.container.style.backgroundSize = `${gridSize}px ${gridSize}px`;
    this.container.style.backgroundPosition = `${this.panX}px ${this.panY}px`;
    this.onViewportChange({
      panX: this.panX,
      panY: this.panY,
      scale: this.scale
    });
  }

  /**
   * Zoom around a specific client (screen) coordinate or canvas center
   */
  zoomAt(factor, clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const cx = clientX !== undefined ? clientX - rect.left : this.width / 2;
    const cy = clientY !== undefined ? clientY - rect.top : this.height / 2;

    const nextScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * factor));
    if (Math.abs(nextScale - this.scale) < 0.0001) return;

    const worldX = (cx - this.panX) / this.scale;
    const worldY = (cy - this.panY) / this.scale;

    this.scale = nextScale;
    this.panX = cx - worldX * this.scale;
    this.panY = cy - worldY * this.scale;

    this.updateGridBackground();
    this.redrawAll();
  }

  /**
   * Reset viewport pan & zoom to 100% (1.0)
   */
  resetViewport() {
    this.panX = 0;
    this.panY = 0;
    this.scale = 1;
    this.updateGridBackground();
    this.redrawAll();
  }

  /**
   * Set Theme (light / dark) and trigger re-render
   */
  setTheme(newTheme) {
    this.theme = newTheme === 'dark' ? 'dark' : 'light';
    this.redrawAll();
  }

  /**
   * Resolve stroke color based on preset key, custom hex, and current theme
   */
  resolveColor(stroke) {
    if (stroke.tool === 'eraser') {
      return null;
    }
    if (stroke.customColor && stroke.colorKey === 'custom') {
      return stroke.customColor;
    }
    const colorKey = stroke.colorKey || 'black';
    if (colorKey.startsWith('#') || colorKey.startsWith('rgb') || colorKey.startsWith('hsl')) {
      return colorKey;
    }
    const palette = PALETTE_COLORS[this.theme] || PALETTE_COLORS.light;
    return palette[colorKey] || stroke.customColor || palette.black;
  }

  /**
   * Load board data into canvas
   */
  loadBoard(boardData) {
    this.strokes = boardData.strokes || [];
    this.undoStack = boardData.undoStack || [];
    this.redoStack = boardData.redoStack || [];
    this.panX = 0;
    this.panY = 0;
    this.scale = 1;
    this.updateGridBackground();
    this.redrawAll();
    this.notifyStateChange({ isBoardLoad: true });
  }

  /**
   * Attach Pointer, Wheel, ContextMenu, and Touch events
   */
  attachEventListeners() {
    const resizeObserver = new ResizeObserver(() => {
      this.setupCanvasSize();
    });
    resizeObserver.observe(this.container);

    // Prevent browser context menu on right-click so right-click drag pans smoothly
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    this.canvas.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    this.canvas.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    window.addEventListener('pointercancel', (e) => this.handlePointerUp(e));

    // Ctrl + Mouse Wheel Zoom (and Trackpad Pinch / Two-finger scroll)
    this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });

    this.canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  /**
   * Convert screen pointer event to canvas world coordinates
   */
  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    return {
      x: (screenX - this.panX) / this.scale,
      y: (screenY - this.panY) / this.scale,
      pressure: e.pressure || 0.5
    };
  }

  /**
   * Compute midpoint and distance between first two active touch pointers
   */
  getTwoTouchMetrics() {
    const pts = Array.from(this.activePointers.values());
    if (pts.length < 2) return null;
    const p1 = pts[0];
    const p2 = pts[1];
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    return { midX, midY, dist };
  }

  /**
   * Handle Mouse Wheel:
   * - Ctrl + Wheel (or Meta + Wheel): Smooth Zoom centered at cursor
   * - Wheel without Ctrl: Pan canvas
   */
  handleWheel(e) {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const zoomFactor = Math.exp(-e.deltaY * 0.0025);
      this.zoomAt(zoomFactor, e.clientX, e.clientY);
    } else {
      this.panX -= e.deltaX;
      this.panY -= e.deltaY;
      this.updateGridBackground();
      this.redrawAll();
    }
  }

  handlePointerDown(e) {
    // 1. Desktop Mouse Right-Click (button === 2) or Middle-Click (button === 1) -> Pan Canvas
    if (e.pointerType === 'mouse' && (e.button === 2 || e.button === 1)) {
      e.preventDefault();
      this.isPanning = true;
      this.panPointerId = e.pointerId;
      this.panLastClient = { x: e.clientX, y: e.clientY };
      this.container.classList.add('is-panning');
      try {
        this.canvas.setPointerCapture(e.pointerId);
      } catch (_) {}
      return;
    }

    // 2. Smartphone / Tablet Touch Tracking (1 finger = draw, 2 fingers = pan + pinch zoom)
    if (e.pointerType === 'touch') {
      this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      try {
        this.canvas.setPointerCapture(e.pointerId);
      } catch (_) {}

      if (this.activePointers.size >= 2) {
        // Cancel an accidental 1-finger stroke that just started right before the 2nd finger touched down
        if (this.isDrawing) {
          this.isDrawing = false;
          if (this.currentStroke && this.currentStroke.points.length <= 6) {
            this.currentStroke = null;
            this.redrawAll();
          } else if (this.currentStroke && this.currentStroke.points.length > 6) {
            this.commitCurrentStroke();
          }
        }
        this.isTouchGesturing = true;
        const metrics = this.getTwoTouchMetrics();
        if (metrics) {
          this.lastGestureMid = { x: metrics.midX, y: metrics.midY };
          this.lastGestureDist = metrics.dist;
        }
        return;
      }
    }

    // Ignore non-left mouse clicks
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    try {
      this.canvas.setPointerCapture(e.pointerId);
    } catch (_) {}

    const pos = this.getPointerPos(e);
    this.isDrawing = true;

    this.currentStroke = {
      id: 's_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      tool: this.currentTool,
      colorKey: this.currentColorKey,
      customColor: this.currentColorKey === 'custom' ? this.currentCustomColor : null,
      width: this.currentTool === 'eraser' ? Math.max(12, this.currentWidth * 2.5) : this.currentWidth,
      points: [pos]
    };

    this.renderStrokeLive(this.currentStroke);
  }

  handlePointerMove(e) {
    // 1. Desktop Right-Click / Middle-Click Panning
    if (this.isPanning && e.pointerId === this.panPointerId) {
      const dx = e.clientX - this.panLastClient.x;
      const dy = e.clientY - this.panLastClient.y;
      this.panLastClient = { x: e.clientX, y: e.clientY };
      this.panX += dx;
      this.panY += dy;
      this.updateGridBackground();
      this.redrawAll();
      return;
    }

    // 2. Smartphone 2-Finger Pan & Pinch-to-Zoom
    if (e.pointerType === 'touch' && this.activePointers.has(e.pointerId)) {
      this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (this.isTouchGesturing && this.activePointers.size >= 2) {
        const metrics = this.getTwoTouchMetrics();
        if (metrics && this.lastGestureMid) {
          const rect = this.canvas.getBoundingClientRect();
          const midCanvasX = metrics.midX - rect.left;
          const midCanvasY = metrics.midY - rect.top;

          // Pan by midpoint delta
          const dx = metrics.midX - this.lastGestureMid.x;
          const dy = metrics.midY - this.lastGestureMid.y;
          this.panX += dx;
          this.panY += dy;

          // Pinch-to-zoom around midpoint
          if (this.lastGestureDist > 8 && metrics.dist > 8) {
            const factor = metrics.dist / this.lastGestureDist;
            const nextScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * factor));
            const worldX = (midCanvasX - this.panX) / this.scale;
            const worldY = (midCanvasY - this.panY) / this.scale;
            this.scale = nextScale;
            this.panX = midCanvasX - worldX * this.scale;
            this.panY = midCanvasY - worldY * this.scale;
          }

          this.lastGestureMid = { x: metrics.midX, y: metrics.midY };
          this.lastGestureDist = metrics.dist;
          this.updateGridBackground();
          this.redrawAll();
        }
        return;
      }
    }

    // 3. Standard Drawing (Pen / Eraser)
    if (!this.isDrawing || !this.currentStroke) return;
    const pos = this.getPointerPos(e);
    this.currentStroke.points.push(pos);
    this.renderStrokeIncremental(this.currentStroke);
  }

  commitCurrentStroke() {
    if (this.currentStroke && this.currentStroke.points.length > 0) {
      this.undoStack.push([...this.strokes]);
      if (this.undoStack.length > 50) this.undoStack.shift();
      this.redoStack = [];

      this.strokes.push(this.currentStroke);
      this.redrawAll();
      this.notifyStateChange({ isBoardLoad: false });
    }
    this.currentStroke = null;
  }

  handlePointerUp(e) {
    if (e && this.isPanning && e.pointerId === this.panPointerId) {
      this.isPanning = false;
      this.panPointerId = null;
      this.container.classList.remove('is-panning');
      return;
    }

    if (e && e.pointerType === 'touch') {
      this.activePointers.delete(e.pointerId);
      if (this.activePointers.size < 2) {
        this.lastGestureMid = null;
        this.lastGestureDist = 0;
      }
      if (this.activePointers.size === 0) {
        this.isTouchGesturing = false;
      }
    }

    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.commitCurrentStroke();
  }

  /**
   * Draw a full single stroke path with smooth Bézier curve interpolation
   * (Assumes caller has already applied world transform panX/panY/scale to ctx)
   */
  drawSingleStroke(ctx, stroke) {
    if (!stroke || !stroke.points || stroke.points.length === 0) return;

    ctx.save();

    if (stroke.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = this.resolveColor(stroke);
    }

    ctx.lineWidth = stroke.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const points = stroke.points;

    if (points.length === 1) {
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, stroke.width / 2, 0, Math.PI * 2);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    if (points.length === 2) {
      ctx.lineTo(points[1].x, points[1].y);
    } else {
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    }

    ctx.stroke();
    ctx.restore();
  }

  /**
   * Render incremental segment during live drawing for zero-latency feedback
   */
  renderStrokeIncremental(stroke) {
    const pts = stroke.points;
    const len = pts.length;
    if (len < 2) return;

    if (stroke.tool === 'eraser') {
      this.redrawAll();
      return;
    }

    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.strokeStyle = this.resolveColor(stroke);
    this.ctx.lineWidth = stroke.width;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    if (len === 2) {
      this.ctx.moveTo(pts[0].x, pts[0].y);
      this.ctx.lineTo(pts[1].x, pts[1].y);
    } else {
      const pPrevPrev = pts[len - 3];
      const pPrev = pts[len - 2];
      const pCurr = pts[len - 1];

      const startX = (pPrevPrev.x + pPrev.x) / 2;
      const startY = (pPrevPrev.y + pPrev.y) / 2;
      const endX = (pPrev.x + pCurr.x) / 2;
      const endY = (pPrev.y + pCurr.y) / 2;

      this.ctx.moveTo(startX, startY);
      this.ctx.quadraticCurveTo(pPrev.x, pPrev.y, endX, endY);
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  renderStrokeLive(stroke) {
    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.scale, this.scale);
    this.drawSingleStroke(this.ctx, stroke);
    this.ctx.restore();
  }

  /**
   * Redraw all committed strokes on the canvas with current viewport pan & scale
   */
  redrawAll() {
    if (!this.width || !this.height) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.scale, this.scale);

    for (const stroke of this.strokes) {
      this.drawSingleStroke(this.ctx, stroke);
    }

    if (this.isDrawing && this.currentStroke) {
      this.drawSingleStroke(this.ctx, this.currentStroke);
    }

    this.ctx.restore();
  }

  /**
   * Undo action
   */
  undo() {
    if (this.strokes.length === 0 && this.undoStack.length === 0) return;
    this.redoStack.push([...this.strokes]);
    this.strokes = this.undoStack.pop() || [];
    this.redrawAll();
    this.notifyStateChange({ isBoardLoad: false });
  }

  /**
   * Redo action
   */
  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push([...this.strokes]);
    this.strokes = this.redoStack.pop() || [];
    this.redrawAll();
    this.notifyStateChange({ isBoardLoad: false });
  }

  /**
   * Clear all strokes
   */
  clear() {
    if (this.strokes.length > 0) {
      this.undoStack.push([...this.strokes]);
    }
    this.redoStack = [];
    this.strokes = [];
    this.redrawAll();
    this.notifyStateChange({ isBoardLoad: false });
  }

  canUndo() {
    return this.strokes.length > 0 || this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  notifyStateChange(meta = {}) {
    this.onStateChange({
      strokes: this.strokes,
      undoStack: this.undoStack,
      redoStack: this.redoStack,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      isBoardLoad: Boolean(meta.isBoardLoad)
    });
  }

  /**
   * Export current canvas view as PNG image Blob
   */
  exportAsPngBlob() {
    const offscreen = document.createElement('canvas');
    offscreen.width = this.width * this.dpr;
    offscreen.height = this.height * this.dpr;
    const offCtx = offscreen.getContext('2d');

    offCtx.scale(this.dpr, this.dpr);

    const computedBg = getComputedStyle(document.documentElement)
      .getPropertyValue('--md-sys-color-surface-container-lowest')
      .trim();
    offCtx.fillStyle = computedBg || (this.theme === 'dark' ? '#0f131a' : '#ffffff');
    offCtx.fillRect(0, 0, this.width, this.height);

    offCtx.save();
    offCtx.translate(this.panX, this.panY);
    offCtx.scale(this.scale, this.scale);
    for (const stroke of this.strokes) {
      this.drawSingleStroke(offCtx, stroke);
    }
    offCtx.restore();

    return new Promise((resolve) => {
      offscreen.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  }
}
