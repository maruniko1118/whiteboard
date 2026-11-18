import 'package:material_ui/material_ui.dart';

import '../theme/app_theme.dart';
import 'whiteboard_controller.dart';

class WhiteboardPainter extends CustomPainter {
  WhiteboardPainter({
    required this.controller,
    required this.brightness,
    required this.backgroundColor,
    required this.paintVersion,
  }) : super(repaint: controller);

  final WhiteboardController controller;
  final Brightness brightness;
  final Color backgroundColor;
  final int paintVersion;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.clipRect(Offset.zero & size);

    // 1. Canvas Background
    canvas.drawRect(
      Offset.zero & size,
      Paint()..color = backgroundColor,
    );

    // 2. Synchronized Dot Grid Background (24px * scale)
    _paintDotGrid(canvas, size);

    // 3. Committed + Live Strokes inside isolated saveLayer
    controller.paintStrokes(canvas, size, brightness);
  }

  void _paintDotGrid(Canvas canvas, Size size) {
    final spacing = 24.0 * controller.scale;
    if (spacing < 4.0) return;

    final dotPaint = Paint()
      ..color = AppTheme.dotGridColor(brightness)
      ..style = PaintingStyle.fill;

    var startX = controller.panX % spacing;
    if (startX < 0) startX += spacing;
    var startY = controller.panY % spacing;
    if (startY < 0) startY += spacing;

    final radius = (1.15 * controller.scale).clamp(0.7, 2.0);

    for (var x = startX; x <= size.width; x += spacing) {
      for (var y = startY; y <= size.height; y += spacing) {
        canvas.drawCircle(Offset(x, y), radius, dotPaint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant WhiteboardPainter oldDelegate) {
    return oldDelegate.brightness != brightness ||
        oldDelegate.backgroundColor != backgroundColor ||
        oldDelegate.paintVersion != paintVersion ||
        oldDelegate.controller != controller;
  }
}
