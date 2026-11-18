import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:flutter/services.dart';
import 'package:material_ui/material_ui.dart';

import 'whiteboard_controller.dart';
import 'whiteboard_painter.dart';

class CanvasGestureLayer extends StatefulWidget {
  const CanvasGestureLayer({
    super.key,
    required this.controller,
    required this.backgroundColor,
    required this.brightness,
  });

  final WhiteboardController controller;
  final Color backgroundColor;
  final Brightness brightness;

  @override
  State<CanvasGestureLayer> createState() => _CanvasGestureLayerState();
}

class _CanvasGestureLayerState extends State<CanvasGestureLayer> {
  final Map<int, Offset> _activeTouchPointers = {};
  bool _isTouchGesturing = false;
  Offset? _lastGestureMid;
  double _lastGestureDist = 0;
  double _gestureStartDist = 0;
  bool _isPinchZooming = false;
  bool _isRightOrMidPanning = false;

  ({Offset mid, double dist})? _twoTouchMetrics() {
    if (_activeTouchPointers.length < 2) return null;
    final pts = _activeTouchPointers.values.take(2).toList();
    final p1 = pts[0];
    final p2 = pts[1];
    final mid = Offset((p1.dx + p2.dx) / 2, (p1.dy + p2.dy) / 2);
    final dist = (p2 - p1).distance;
    return (mid: mid, dist: dist);
  }

  bool _isCtrlOrMetaPressed() {
    final keys = HardwareKeyboard.instance.logicalKeysPressed;
    return keys.contains(LogicalKeyboardKey.controlLeft) ||
        keys.contains(LogicalKeyboardKey.controlRight) ||
        keys.contains(LogicalKeyboardKey.metaLeft) ||
        keys.contains(LogicalKeyboardKey.metaRight);
  }

  void _handlePointerDown(PointerDownEvent event) {
    final ctrl = widget.controller;

    // 1. Desktop Mouse Right-Click or Middle-Click -> Pan
    if (event.kind == PointerDeviceKind.mouse &&
        (event.buttons & kSecondaryMouseButton != 0 ||
            event.buttons & kMiddleMouseButton != 0)) {
      ctrl.isPanning = true;
      ctrl.panPointerId = event.pointer;
      ctrl.panLastLocal = event.localPosition;
      setState(() => _isRightOrMidPanning = true);
      return;
    }

    // 2. Touch tracking (1 finger = draw, 2+ fingers = pan + pinch zoom)
    if (event.kind == PointerDeviceKind.touch) {
      _activeTouchPointers[event.pointer] = event.localPosition;
      if (_activeTouchPointers.length >= 2) {
        if (ctrl.isDrawing) {
          ctrl.cancelAccidentalShortStroke();
        }
        _isTouchGesturing = true;
        final metrics = _twoTouchMetrics();
        if (metrics != null) {
          _lastGestureMid = metrics.mid;
          _lastGestureDist = metrics.dist;
          _gestureStartDist = metrics.dist;
          _isPinchZooming = false;
        }
        return;
      }
      if (_isTouchGesturing) return;
    }

    // Ignore non-primary mouse buttons
    if (event.kind == PointerDeviceKind.mouse &&
        (event.buttons & kPrimaryMouseButton) == 0) {
      return;
    }

    ctrl.startStroke(event.localPosition, event.pointer);
  }

  void _handlePointerMove(PointerMoveEvent event) {
    final ctrl = widget.controller;

    // 1. Desktop Right/Middle Panning
    if (ctrl.isPanning && event.pointer == ctrl.panPointerId) {
      final delta = event.localPosition - ctrl.panLastLocal;
      ctrl.panLastLocal = event.localPosition;
      ctrl.panBy(delta.dx, delta.dy);
      return;
    }

    // 2. Two-finger Pan & Pinch-to-Zoom
    if (event.kind == PointerDeviceKind.touch &&
        _activeTouchPointers.containsKey(event.pointer)) {
      _activeTouchPointers[event.pointer] = event.localPosition;
      if (_isTouchGesturing && _activeTouchPointers.length >= 2) {
        _applyTwoTouchGesture();
        return;
      }
    }

    // 3. Standard Drawing
    if (ctrl.isDrawing && event.pointer == ctrl.drawPointerId) {
      ctrl.appendStrokePoint(event.localPosition);
    }
  }

  void _applyTwoTouchGesture() {
    final metrics = _twoTouchMetrics();
    final lastMid = _lastGestureMid;
    if (metrics == null || lastMid == null) return;

    final ctrl = widget.controller;
    final delta = metrics.mid - lastMid;
    ctrl.panBy(delta.dx, delta.dy);

    if (!_isPinchZooming) {
      if (_gestureStartDist > 20 &&
          metrics.dist > 20 &&
          (metrics.dist - _gestureStartDist).abs() >= 24 &&
          (metrics.dist / _gestureStartDist - 1).abs() >= 0.18) {
        _isPinchZooming = true;
        _lastGestureDist = metrics.dist;
      }
    } else if (_lastGestureDist > 16 && metrics.dist > 16) {
      final factor = metrics.dist / _lastGestureDist;
      ctrl.zoomAt(factor, metrics.mid);
      _lastGestureDist = metrics.dist;
    }

    _lastGestureMid = metrics.mid;
  }

  void _handlePointerUpOrCancel(PointerEvent event) {
    final ctrl = widget.controller;

    if (ctrl.isPanning && event.pointer == ctrl.panPointerId) {
      ctrl.isPanning = false;
      ctrl.panPointerId = null;
      setState(() => _isRightOrMidPanning = false);
      return;
    }

    if (event.kind == PointerDeviceKind.touch) {
      _activeTouchPointers.remove(event.pointer);
      if (_activeTouchPointers.length >= 2) {
        final metrics = _twoTouchMetrics();
        if (metrics != null) {
          _lastGestureMid = metrics.mid;
          _lastGestureDist = metrics.dist;
          _gestureStartDist = metrics.dist;
          _isPinchZooming = false;
        }
      } else {
        _lastGestureMid = null;
        _lastGestureDist = 0;
        _gestureStartDist = 0;
        _isPinchZooming = false;
      }
      if (_activeTouchPointers.isEmpty) {
        _isTouchGesturing = false;
      }
    }

    if (ctrl.isDrawing && event.pointer == ctrl.drawPointerId) {
      ctrl.finishStroke(
        finalLocalPos: event is PointerUpEvent ? event.localPosition : null,
      );
    }
  }

  void _handlePointerSignal(PointerSignalEvent event) {
    final ctrl = widget.controller;
    if (event is PointerScrollEvent) {
      if (_isCtrlOrMetaPressed()) {
        final zoomFactor = math.exp(-event.scrollDelta.dy * 0.0025);
        ctrl.zoomAt(zoomFactor, event.localPosition);
      } else {
        ctrl.panBy(-event.scrollDelta.dx, -event.scrollDelta.dy);
      }
    } else if (event is PointerScaleEvent) {
      ctrl.zoomAt(event.scale, event.localPosition);
    }
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: _isRightOrMidPanning
          ? SystemMouseCursors.grabbing
          : SystemMouseCursors.precise,
      child: Listener(
        behavior: HitTestBehavior.opaque,
        onPointerDown: _handlePointerDown,
        onPointerMove: _handlePointerMove,
        onPointerUp: _handlePointerUpOrCancel,
        onPointerCancel: _handlePointerUpOrCancel,
        onPointerSignal: _handlePointerSignal,
        child: ListenableBuilder(
          listenable: widget.controller,
          builder: (context, _) {
            return CustomPaint(
              size: Size.infinite,
              painter: WhiteboardPainter(
                controller: widget.controller,
                brightness: widget.brightness,
                backgroundColor: widget.backgroundColor,
                paintVersion: widget.controller.paintVersion,
              ),
            );
          },
        ),
      ),
    );
  }
}
