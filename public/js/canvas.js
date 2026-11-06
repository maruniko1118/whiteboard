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

    // State
    this.isDrawing = false;
    this.currentStroke = null;
    this.strokes = [];
    this.undoStack = [];
    this.redoStack = [];

    // Callbacks
    this.onStateChange = options.onStateChange || (() => {});

    // Init Canvas & Listeners
    this.setupCanvasSize();
    this.attachEventListeners();
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
    this.redrawAll();
    this.notifyStateChange({ isBoardLoad: true });
  }

  /**
   * Attach Pointer and Touch events
   */
  attachEventListeners() {
    const resizeObserver = new ResizeObserver(() => {
      this.setupCanvasSize();
    });
    resizeObserver.observe(this.container);

    this.canvas.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    this.canvas.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    window.addEventListener('pointercancel', (e) => this.handlePointerUp(e));

    this.canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure || 0.5
    };
  }

  handlePointerDown(e) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    this.canvas.setPointerCapture(e.pointerId);

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
    if (!this.isDrawing || !this.currentStroke) return;
    const pos = this.getPointerPos(e);
    this.currentStroke.points.push(pos);
    this.renderStrokeIncremental(this.currentStroke);
  }

  handlePointerUp() {
    if (!this.isDrawing) return;
    this.isDrawing = false;

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

  /**
   * Draw a full single stroke path with smooth Bézier curve interpolation
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
      this.drawSingleStroke(this.ctx, stroke);
      return;
    }

    this.ctx.save();
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
    this.drawSingleStroke(this.ctx, stroke);
  }

  /**
   * Redraw all committed strokes on the canvas
   */
  redrawAll() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const stroke of this.strokes) {
      this.drawSingleStroke(this.ctx, stroke);
    }

    if (this.isDrawing && this.currentStroke) {
      this.drawSingleStroke(this.ctx, this.currentStroke);
    }
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
    if (this.strokes.length === 0) return;
    this.undoStack.push([...this.strokes]);
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
   * Export current canvas as PNG image Blob
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

    for (const stroke of this.strokes) {
      this.drawSingleStroke(offCtx, stroke);
    }

    return new Promise((resolve) => {
      offscreen.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  }
}
