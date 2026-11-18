import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:material_ui/material_ui.dart';

import '../models/whiteboard_models.dart';
import '../theme/app_theme.dart';

class WhiteboardController extends ChangeNotifier {
  WhiteboardController({
    this.onStateChange,
    this.onDrawStart,
  });

  static const double minScale = 0.2;
  static const double maxScale = 5.0;
  static const int maxUndoHistory = 50;

  final void Function({required bool isBoardLoad})? onStateChange;
  final VoidCallback? onDrawStart;

  ToolType currentTool = ToolType.pen;
  String currentColorKey = 'black';
  String currentCustomColor = '#6750A4';
  double currentWidth = 5.0;

  double panX = 0.0;
  double panY = 0.0;
  double scale = 1.0;

  bool isDrawing = false;
  bool isPanning = false;
  int? drawPointerId;
  int? panPointerId;
  Offset panLastLocal = Offset.zero;

  Stroke? currentStroke;
  List<Stroke> strokes = [];
  List<List<Stroke>> undoStack = [];
  List<List<Stroke>> redoStack = [];

  ui.Picture? _committedPicture;
  Size _cachedSize = Size.zero;
  Brightness? _cachedBrightness;
  double _cachedPanX = double.nan;
  double _cachedPanY = double.nan;
  double _cachedScale = double.nan;
  bool _committedDirty = true;

  int _paintVersion = 0;
  int get paintVersion => _paintVersion;

  bool get canUndo => undoStack.isNotEmpty;
  bool get canRedo => redoStack.isNotEmpty;

  void setTool(ToolType tool) {
    if (currentTool == tool) return;
    currentTool = tool;
    notifyListeners();
  }

  void setPresetColor(String colorKey) {
    currentTool = ToolType.pen;
    currentColorKey = colorKey;
    notifyListeners();
  }

  void setCustomColor(String hex) {
    currentTool = ToolType.pen;
    currentColorKey = 'custom';
    currentCustomColor = hex.toUpperCase();
    notifyListeners();
  }

  void setWidth(double width) {
    final clamped = width.clamp(1.0, 48.0).roundToDouble();
    if (currentWidth == clamped) return;
    currentWidth = clamped;
    notifyListeners();
  }

  void invalidateCommittedCache() {
    _committedDirty = true;
    _paintVersion++;
  }

  void loadBoard(BoardData board) {
    isDrawing = false;
    drawPointerId = null;
    currentStroke = null;
    strokes = board.strokes;
    undoStack = board.undoStack;
    redoStack = board.redoStack;
    panX = 0.0;
    panY = 0.0;
    scale = 1.0;
    invalidateCommittedCache();
    notifyListeners();
    onStateChange?.call(isBoardLoad: true);
  }

  StrokePoint screenToWorld(Offset localPos) {
    final wx = ((localPos.dx - panX) / scale * 100).roundToDouble() / 100;
    final wy = ((localPos.dy - panY) / scale * 100).roundToDouble() / 100;
    return StrokePoint(wx, wy);
  }

  void startStroke(Offset localPos, int pointerId) {
    onDrawStart?.call();
    isDrawing = true;
    drawPointerId = pointerId;
    final pos = screenToWorld(localPos);
    final effectiveWidth = currentTool == ToolType.eraser
        ? math.max(12.0, currentWidth * 2.5)
        : currentWidth;
    final now = DateTime.now().millisecondsSinceEpoch;
    currentStroke = Stroke(
      id: 's_${now}_${strokes.length}',
      tool: currentTool,
      colorKey: currentColorKey,
      customColor: currentColorKey == 'custom' ? currentCustomColor : null,
      width: effectiveWidth,
      points: [pos],
    );
    _paintVersion++;
    notifyListeners();
  }

  void appendStrokePoint(Offset localPos) {
    final stroke = currentStroke;
    if (!isDrawing || stroke == null) return;
    final pos = screenToWorld(localPos);
    final last = stroke.points.last;
    final minStep = 1.2 / scale;
    final dx = pos.x - last.x;
    final dy = pos.y - last.y;
    if (dx * dx + dy * dy >= minStep * minStep) {
      stroke.points.add(pos);
      stroke.invalidateCache();
      _paintVersion++;
      notifyListeners();
    }
  }

  void finishStroke({Offset? finalLocalPos}) {
    if (!isDrawing) return;
    final stroke = currentStroke;
    if (stroke != null && finalLocalPos != null) {
      final pos = screenToWorld(finalLocalPos);
      final last = stroke.points.last;
      final minFinalStep = 0.25 / scale;
      final dx = pos.x - last.x;
      final dy = pos.y - last.y;
      if (dx * dx + dy * dy >= minFinalStep * minFinalStep) {
        stroke.points.add(pos);
        stroke.invalidateCache();
      }
    }
    isDrawing = false;
    drawPointerId = null;
    commitCurrentStroke();
  }

  void cancelAccidentalShortStroke() {
    if (!isDrawing) return;
    isDrawing = false;
    drawPointerId = null;
    final stroke = currentStroke;
    if (stroke != null && stroke.points.length <= 6) {
      currentStroke = null;
      _paintVersion++;
      notifyListeners();
    } else {
      commitCurrentStroke();
    }
  }

  void commitCurrentStroke() {
    final stroke = currentStroke;
    currentStroke = null;
    if (stroke != null && stroke.points.isNotEmpty) {
      undoStack.add(List<Stroke>.from(strokes));
      if (undoStack.length > maxUndoHistory) {
        undoStack.removeAt(0);
      }
      redoStack = [];
      // Pre-compute bounding box and path before committing
      stroke.boundingBox;
      stroke.bezierPath;
      strokes = [...strokes, stroke];
      invalidateCommittedCache();
      notifyListeners();
      onStateChange?.call(isBoardLoad: false);
    } else {
      _paintVersion++;
      notifyListeners();
    }
  }

  void panBy(double dx, double dy) {
    if (dx == 0 && dy == 0) return;
    panX += dx;
    panY += dy;
    invalidateCommittedCache();
    notifyListeners();
  }

  void zoomAt(double factor, [Offset? focalPoint, Size? viewportSize]) {
    final cx = focalPoint?.dx ?? (viewportSize != null ? viewportSize.width / 2 : 0.0);
    final cy = focalPoint?.dy ?? (viewportSize != null ? viewportSize.height / 2 : 0.0);
    final nextScale = (scale * factor).clamp(minScale, maxScale);
    if ((nextScale - scale).abs() < 0.0001) return;

    final worldX = (cx - panX) / scale;
    final worldY = (cy - panY) / scale;
    scale = nextScale;
    panX = cx - worldX * scale;
    panY = cy - worldY * scale;

    invalidateCommittedCache();
    notifyListeners();
  }

  void resetViewport() {
    panX = 0.0;
    panY = 0.0;
    scale = 1.0;
    invalidateCommittedCache();
    notifyListeners();
  }

  void undo() {
    if (undoStack.isEmpty) return;
    redoStack.add(List<Stroke>.from(strokes));
    strokes = undoStack.removeLast();
    invalidateCommittedCache();
    notifyListeners();
    onStateChange?.call(isBoardLoad: false);
  }

  void redo() {
    if (redoStack.isEmpty) return;
    undoStack.add(List<Stroke>.from(strokes));
    strokes = redoStack.removeLast();
    invalidateCommittedCache();
    notifyListeners();
    onStateChange?.call(isBoardLoad: false);
  }

  void clear() {
    if (strokes.isNotEmpty) {
      undoStack.add(List<Stroke>.from(strokes));
      if (undoStack.length > maxUndoHistory) {
        undoStack.removeAt(0);
      }
    }
    redoStack = [];
    strokes = [];
    invalidateCommittedCache();
    notifyListeners();
    onStateChange?.call(isBoardLoad: false);
  }

  void _ensureCommittedPicture(Size size, Brightness brightness) {
    final needsRebuild = _committedDirty ||
        _committedPicture == null ||
        _cachedSize != size ||
        _cachedBrightness != brightness ||
        _cachedPanX != panX ||
        _cachedPanY != panY ||
        _cachedScale != scale;

    if (!needsRebuild) return;

    _committedPicture?.dispose();
    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder, Offset.zero & size);

    canvas.save();
    canvas.translate(panX, panY);
    canvas.scale(scale, scale);

    final viewRect = Rect.fromLTRB(
      -panX / scale,
      -panY / scale,
      (size.width - panX) / scale,
      (size.height - panY) / scale,
    );

    for (final stroke in strokes) {
      if (!stroke.boundingBox.overlaps(viewRect)) {
        continue;
      }
      drawSingleStroke(canvas, stroke, brightness);
    }
    canvas.restore();

    _committedPicture = recorder.endRecording();
    _cachedSize = size;
    _cachedBrightness = brightness;
    _cachedPanX = panX;
    _cachedPanY = panY;
    _cachedScale = scale;
    _committedDirty = false;
  }

  void paintStrokes(Canvas canvas, Size size, Brightness brightness) {
    _ensureCommittedPicture(size, brightness);

    final bounds = Offset.zero & size;
    // Isolate strokes into a transparent layer so BlendMode.dstOut eraser
    // only erases strokes without punching holes into the background/dot grid.
    canvas.saveLayer(bounds, Paint());
    if (_committedPicture != null) {
      canvas.drawPicture(_committedPicture!);
    }
    final live = currentStroke;
    if (live != null && live.points.isNotEmpty) {
      canvas.save();
      canvas.translate(panX, panY);
      canvas.scale(scale, scale);
      drawSingleStroke(canvas, live, brightness);
      canvas.restore();
    }
    canvas.restore();
  }

  static void drawSingleStroke(
    Canvas canvas,
    Stroke stroke,
    Brightness brightness,
  ) {
    if (stroke.points.isEmpty) return;

    final paint = Paint()
      ..strokeWidth = stroke.width
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    if (stroke.tool == ToolType.eraser) {
      paint
        ..blendMode = BlendMode.dstOut
        ..color = const Color(0xFF000000);
    } else {
      paint
        ..blendMode = BlendMode.srcOver
        ..color = AppTheme.resolveStrokeColor(stroke, brightness);
    }

    if (stroke.points.length == 1) {
      paint.style = PaintingStyle.fill;
      final pt = stroke.points[0];
      canvas.drawCircle(Offset(pt.x, pt.y), stroke.width / 2.0, paint);
      return;
    }

    paint.style = PaintingStyle.stroke;
    canvas.drawPath(stroke.bezierPath, paint);
  }

  Future<Uint8List?> exportAsPng({
    required Size logicalSize,
    Color? backgroundColor,
    required Brightness brightness,
    double pixelRatio = 2.0,
  }) async {
    if (logicalSize.width <= 0 || logicalSize.height <= 0) return null;
    final recorder = ui.PictureRecorder();
    final pixelW = (logicalSize.width * pixelRatio).round();
    final pixelH = (logicalSize.height * pixelRatio).round();
    if (pixelW <= 0 || pixelH <= 0) return null;
    final canvas = Canvas(
      recorder,
      Rect.fromLTWH(0, 0, pixelW.toDouble(), pixelH.toDouble()),
    );

    canvas.scale(pixelRatio, pixelRatio);
    if (backgroundColor != null) {
      canvas.drawRect(
        Offset.zero & logicalSize,
        Paint()..color = backgroundColor,
      );
    }

    canvas.saveLayer(Offset.zero & logicalSize, Paint());
    canvas.translate(panX, panY);
    canvas.scale(scale, scale);
    for (final stroke in strokes) {
      drawSingleStroke(canvas, stroke, brightness);
    }
    canvas.restore();

    final picture = recorder.endRecording();
    final image = await picture.toImage(pixelW, pixelH);
    final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
    picture.dispose();
    image.dispose();
    return byteData?.buffer.asUint8List();
  }

  @override
  void dispose() {
    _committedPicture?.dispose();
    super.dispose();
  }
}
