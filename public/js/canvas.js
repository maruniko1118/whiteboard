/**
 * canvas.js - High-performance HTML5 Canvas Vector Engine
 * Handles smooth bezier curves, multi-color rendering, Retina scaling, and theme adaptation
 */

// Color definition map
const PALETTE_COLORS = {
  light: {
    black: '#0f172a',
    red: '#ef4444',
    yellow: '#d97706', // Slightly deeper yellow on white for strong contrast
    blue: '#2563eb'
  },
  dark: {
    black: '#ffffff', // In dark theme, black is rendered as pure white!
    red: '#f87171',
    yellow: '#facc15',
    blue: '#60a5fa'
  }
};

export class WhiteboardCanvas {
  constructor(canvasElement, containerElement, options = {}) {
    this.canvas = canvasElement;
    this.container = containerElement;
    this.ctx = this.canvas.getContext('2d');

    // Current Drawing Config
    this.currentTool = 'pen'; // 'pen' | 'eraser'
    this.currentColorKey = 'black'; // 'black' | 'red' | 'yellow' | 'blue'
    this.currentWidth = 5; // 2 | 5 | 12
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
    this.dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = Math.floor(rect.width * this.dpr);
    this.canvas.height = Math.floor(rect.height * this.dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

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
   * Resolve stroke color based on current theme
   */
  resolveColor(stroke) {
    if (stroke.tool === 'eraser') {
      return null;
    }
    const colorKey = stroke.colorKey || 'black';
    const palette = PALETTE_COLORS[this.theme] || PALETTE_COLORS.light;
    return palette[colorKey] || palette.black;
  }

  /**
   * Load board data into canvas
   */
  loadBoard(boardData) {
    this.strokes = boardData.strokes || [];
    this.undoStack = boardData.undoStack || [];
    this.redoStack = boardData.redoStack || [];
    this.redrawAll();
    this.notifyStateChange();
  }

  /**
   * Attach Pointer and Touch events
   */
  attachEventListeners() {
    // Window Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      this.setupCanvasSize();
    });
    resizeObserver.observe(this.container);

    // Pointer Events (supports Mouse, Touch, Stylus seamlessly)
    this.canvas.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    this.canvas.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    window.addEventListener('pointercancel', (e) => this.handlePointerUp(e));

    // Prevent default touch gestures (scrolling/pinch-zoom) on canvas
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
    if (e.button !== 0 && e.pointerType === 'mouse') return; // Left-click only
    this.canvas.setPointerCapture(e.pointerId);

    const pos = this.getPointerPos(e);
    this.isDrawing = true;

    this.currentStroke = {
      id: 's_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      tool: this.currentTool,
      colorKey: this.currentColorKey,
      width: this.currentTool === 'eraser' ? this.currentWidth * 2.5 : this.currentWidth,
      points: [pos]
    };

    // Render initial dot
    this.renderStrokeLive(this.currentStroke);
  }

  handlePointerMove(e) {
    if (!this.isDrawing || !this.currentStroke) return;
    const pos = this.getPointerPos(e);
    
    // Add point to stroke
    this.currentStroke.points.push(pos);

    // Render incremental stroke
    this.renderStrokeIncremental(this.currentStroke);
  }

  handlePointerUp(e) {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    if (this.currentStroke && this.currentStroke.points.length > 0) {
      // Push copy to undo stack before committing new stroke
      this.undoStack.push([...this.strokes]);
      if (this.undoStack.length > 50) this.undoStack.shift(); // Max 50 undo steps
      this.redoStack = []; // Clear redo stack on new action

      this.strokes.push(this.currentStroke);
      this.redrawAll();
      this.notifyStateChange();
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
      // Single point dot
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
      // Quadratic Bézier curve through midpoints for ultra smooth freehand lines
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
      // For eraser, full redraw of active state ensures smooth masking
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
    this.notifyStateChange();
  }

  /**
   * Redo action
   */
  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push([...this.strokes]);
    this.strokes = this.redoStack.pop() || [];
    this.redrawAll();
    this.notifyStateChange();
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
    this.notifyStateChange();
  }

  /**
   * Check undo / redo availability
   */
  canUndo() {
    return this.strokes.length > 0 || this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  /**
   * Notify state change callback
   */
  notifyStateChange() {
    this.onStateChange({
      strokes: this.strokes,
      undoStack: this.undoStack,
      redoStack: this.redoStack,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    });
  }

  /**
   * Export current canvas as PNG image Blob / Data URL
   */
  exportAsPngBlob() {
    const offscreen = document.createElement('canvas');
    offscreen.width = this.width * this.dpr;
    offscreen.height = this.height * this.dpr;
    const offCtx = offscreen.getContext('2d');

    // Scale
    offCtx.scale(this.dpr, this.dpr);

    // Draw background according to theme
    offCtx.fillStyle = this.theme === 'dark' ? '#12161f' : '#ffffff';
    offCtx.fillRect(0, 0, this.width, this.height);

    // Draw all strokes
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

