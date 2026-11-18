import 'package:material_ui/material_ui.dart';

enum WhiteboardLayoutMode {
  desktop,
  mobilePortrait,
  mobileLandscape,
}

class WhiteboardLayout {
  const WhiteboardLayout._({
    required this.mode,
    required this.size,
    required this.padding,
  });

  factory WhiteboardLayout.of(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final padding = MediaQuery.paddingOf(context);
    final isLandscape = size.width > size.height;

    final WhiteboardLayoutMode mode;
    if (isLandscape && size.height <= 520) {
      mode = WhiteboardLayoutMode.mobileLandscape;
    } else if (size.width <= 768) {
      mode = WhiteboardLayoutMode.mobilePortrait;
    } else {
      mode = WhiteboardLayoutMode.desktop;
    }

    return WhiteboardLayout._(
      mode: mode,
      size: size,
      padding: padding,
    );
  }

  final WhiteboardLayoutMode mode;
  final Size size;
  final EdgeInsets padding;

  bool get isDesktop => mode == WhiteboardLayoutMode.desktop;
  bool get isMobilePortrait => mode == WhiteboardLayoutMode.mobilePortrait;
  bool get isMobileLandscape => mode == WhiteboardLayoutMode.mobileLandscape;
  bool get isMobile => mode != WhiteboardLayoutMode.desktop;
  bool get isCompactHeight => size.height <= 520;
  bool get isCompactActions => size.width <= 960;
  bool get isNarrowDesktop => size.width <= 1120;
}
