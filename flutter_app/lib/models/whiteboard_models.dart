import 'dart:ui';

enum ToolType {
  pen,
  eraser;

  String toJson() => name;

  static ToolType fromJson(Object? value) {
    if (value == 'eraser') return ToolType.eraser;
    return ToolType.pen;
  }
}

class StrokePoint {
  const StrokePoint(this.x, this.y);

  final double x;
  final double y;

  factory StrokePoint.fromJson(Map<String, dynamic> json) {
    return StrokePoint(
      (json['x'] as num?)?.toDouble() ?? 0.0,
      (json['y'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() => {'x': x, 'y': y};

  Offset toOffset() => Offset(x, y);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is StrokePoint && x == other.x && y == other.y;

  @override
  int get hashCode => Object.hash(x, y);
}

class Stroke {
  Stroke({
    required this.id,
    required this.tool,
    required this.colorKey,
    this.customColor,
    required this.width,
    required List<StrokePoint> points,
  }) : points = List<StrokePoint>.from(points);

  final String id;
  final ToolType tool;
  final String colorKey;
  final String? customColor;
  final double width;
  final List<StrokePoint> points;

  Rect? _cachedBBox;
  Path? _cachedPath;
  int _cachedPathPointCount = -1;

  /// World-space bounding box for viewport culling.
  Rect get boundingBox {
    if (_cachedBBox != null && _cachedPathPointCount == points.length) {
      return _cachedBBox!;
    }
    if (points.isEmpty) {
      return Rect.zero;
    }
    var minX = double.infinity;
    var minY = double.infinity;
    var maxX = double.negativeInfinity;
    var maxY = double.negativeInfinity;
    for (final p in points) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
    final pad = width / 2.0 + 2.0;
    final box = Rect.fromLTRB(minX - pad, minY - pad, maxX + pad, maxY + pad);
    _cachedBBox = box;
    return box;
  }

  /// Cached smooth quadratic Bezier path matching HTML5 Canvas midpoint interpolation.
  Path get bezierPath {
    if (_cachedPath != null && _cachedPathPointCount == points.length) {
      return _cachedPath!;
    }
    final path = buildQuadraticPath(points);
    _cachedPath = path;
    _cachedPathPointCount = points.length;
    return path;
  }

  void invalidateCache() {
    _cachedBBox = null;
    _cachedPath = null;
    _cachedPathPointCount = -1;
  }

  static Path buildQuadraticPath(List<StrokePoint> pts) {
    final path = Path();
    if (pts.isEmpty) return path;
    path.moveTo(pts[0].x, pts[0].y);
    if (pts.length == 1) {
      return path;
    }
    if (pts.length == 2) {
      path.lineTo(pts[1].x, pts[1].y);
      return path;
    }
    path.lineTo((pts[0].x + pts[1].x) / 2.0, (pts[0].y + pts[1].y) / 2.0);
    for (var i = 1; i < pts.length - 1; i++) {
      final xc = (pts[i].x + pts[i + 1].x) / 2.0;
      final yc = (pts[i].y + pts[i + 1].y) / 2.0;
      path.quadraticBezierTo(pts[i].x, pts[i].y, xc, yc);
    }
    path.lineTo(pts.last.x, pts.last.y);
    return path;
  }

  Stroke clone() {
    return Stroke(
      id: id,
      tool: tool,
      colorKey: colorKey,
      customColor: customColor,
      width: width,
      points: points,
    );
  }

  factory Stroke.fromJson(Map<String, dynamic> json) {
    final rawPoints = (json['points'] as List<dynamic>?) ?? const [];
    final parsedPoints = <StrokePoint>[];
    for (final p in rawPoints) {
      if (p is Map) {
        parsedPoints.add(StrokePoint.fromJson(Map<String, dynamic>.from(p)));
      }
    }
    return Stroke(
      id: (json['id'] as String?) ??
          's_${DateTime.now().millisecondsSinceEpoch}',
      tool: ToolType.fromJson(json['tool']),
      colorKey: (json['colorKey'] as String?) ?? 'black',
      customColor: json['customColor'] as String?,
      width: (json['width'] as num?)?.toDouble() ?? 5.0,
      points: parsedPoints,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tool': tool.toJson(),
      'colorKey': colorKey,
      'customColor': customColor,
      'width': width,
      'points': points.map((p) => p.toJson()).toList(),
    };
  }
}

class BoardData {
  BoardData({
    required this.id,
    required this.title,
    List<Stroke>? strokes,
    List<List<Stroke>>? undoStack,
    List<List<Stroke>>? redoStack,
    int? createdAt,
    int? updatedAt,
  })  : strokes = strokes ?? [],
        undoStack = undoStack ?? [],
        redoStack = redoStack ?? [],
        createdAt = createdAt ?? DateTime.now().millisecondsSinceEpoch,
        updatedAt = updatedAt ?? DateTime.now().millisecondsSinceEpoch;

  final String id;
  String title;
  List<Stroke> strokes;
  List<List<Stroke>> undoStack;
  List<List<Stroke>> redoStack;
  final int createdAt;
  int updatedAt;

  factory BoardData.fromJson(Map<String, dynamic> json) {
    final rawStrokes = (json['strokes'] as List<dynamic>?) ?? const [];
    final parsedStrokes = <Stroke>[];
    for (final s in rawStrokes) {
      if (s is Map) {
        parsedStrokes.add(Stroke.fromJson(Map<String, dynamic>.from(s)));
      }
    }
    final now = DateTime.now().millisecondsSinceEpoch;
    return BoardData(
      id: (json['id'] as String?) ?? 'board_$now',
      title: ((json['title'] as String?)?.trim().isNotEmpty ?? false)
          ? (json['title'] as String)
          : '無題ボード',
      strokes: parsedStrokes,
      createdAt: (json['createdAt'] as num?)?.toInt() ?? now,
      updatedAt: (json['updatedAt'] as num?)?.toInt() ?? now,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'strokes': strokes.map((s) => s.toJson()).toList(),
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }
}

class AppStateData {
  AppStateData({
    required this.activeBoardId,
    required this.boards,
    required this.theme,
    required this.seedColor,
    required this.customColors,
  });

  String activeBoardId;
  List<BoardData> boards;
  String theme; // 'light' | 'dark'
  String seedColor; // '#6750A4'
  List<String> customColors;

  static const List<String> defaultCustomColors = [
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f43f5e', // Rose
    '#a855f7', // Purple
    '#14b8a6', // Teal
    '#6366f1', // Indigo
  ];

  static final RegExp hexPattern = RegExp(r'^#[0-9A-Fa-f]{6}$');

  static String normalizeSeed(String? value) {
    if (value != null && hexPattern.hasMatch(value)) {
      return value.toUpperCase();
    }
    return '#6750A4';
  }

  Map<String, dynamic> toJson() {
    return {
      'activeBoardId': activeBoardId,
      'boards': boards.map((b) => b.toJson()).toList(),
      'theme': theme,
      'seedColor': seedColor,
      'customColors': customColors,
    };
  }

  static AppStateData? tryFromBackupJson(Map<String, dynamic> json) {
    final rawBoards = json['boards'];
    if (rawBoards is! List || rawBoards.isEmpty) return null;
    final boards = <BoardData>[];
    for (final b in rawBoards) {
      if (b is Map) {
        boards.add(BoardData.fromJson(Map<String, dynamic>.from(b)));
      }
    }
    if (boards.isEmpty) return null;
    final requestedActive = json['activeBoardId'] as String?;
    final activeId = boards.any((b) => b.id == requestedActive)
        ? requestedActive!
        : boards.first.id;
    final rawColors = json['customColors'];
    final customColors = rawColors is List
        ? rawColors
            .whereType<String>()
            .where((c) => hexPattern.hasMatch(c.trim()))
            .take(12)
            .toList()
        : List<String>.from(defaultCustomColors);
    return AppStateData(
      activeBoardId: activeId,
      boards: boards,
      theme: json['theme'] == 'dark' ? 'dark' : 'light',
      seedColor: normalizeSeed(json['seedColor'] as String?),
      customColors: customColors,
    );
  }
}
