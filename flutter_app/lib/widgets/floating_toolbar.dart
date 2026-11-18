import 'dart:math' as math;

import 'package:material_ui/material_ui.dart';

import '../models/whiteboard_models.dart';
import '../theme/app_theme.dart';
import 'responsive_layout.dart';

enum _ToolbarCompactMode {
  desktop,
  portrait,
  landscape,
}

class FloatingToolbar extends StatelessWidget {
  const FloatingToolbar({
    super.key,
    required this.currentTool,
    required this.currentColorKey,
    required this.customHex,
    required this.currentWidth,
    required this.isDark,
    required this.canUndo,
    required this.canRedo,
    required this.onSelectTool,
    required this.onSelectPresetColor,
    required this.onOpenCustomColorPicker,
    required this.onSelectWidth,
    required this.onOpenWidthPopover,
    required this.onUndo,
    required this.onRedo,
    required this.onClear,
  });

  final ToolType currentTool;
  final String currentColorKey;
  final String customHex;
  final double currentWidth;
  final bool isDark;
  final bool canUndo;
  final bool canRedo;

  final ValueChanged<ToolType> onSelectTool;
  final ValueChanged<String> onSelectPresetColor;
  final VoidCallback onOpenCustomColorPicker;
  final ValueChanged<double> onSelectWidth;
  final VoidCallback onOpenWidthPopover;
  final VoidCallback onUndo;
  final VoidCallback onRedo;
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final layout = WhiteboardLayout.of(context);
    final compactMode = switch (layout.mode) {
      WhiteboardLayoutMode.desktop => _ToolbarCompactMode.desktop,
      WhiteboardLayoutMode.mobilePortrait => _ToolbarCompactMode.portrait,
      WhiteboardLayoutMode.mobileLandscape => _ToolbarCompactMode.landscape,
    };
    final hideToolLabels = layout.isCompactActions || layout.isMobile;
    final availableWidth = math.max(
      240.0,
      layout.size.width - layout.padding.horizontal - 16,
    );

    return Material(
      elevation: 8,
      shadowColor: Colors.black.withValues(alpha: isDark ? 0.55 : 0.18),
      color: colorScheme.surfaceContainerHigh.withValues(
        alpha: compactMode == _ToolbarCompactMode.landscape ? 0.95 : 1.0,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(
          compactMode == _ToolbarCompactMode.desktop ? 28 : 20,
        ),
        side: BorderSide(color: colorScheme.outlineVariant),
      ),
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: compactMode == _ToolbarCompactMode.portrait
              ? math.min(396.0, availableWidth)
              : availableWidth,
        ),
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: compactMode == _ToolbarCompactMode.desktop ? 14 : 10,
            vertical: switch (compactMode) {
              _ToolbarCompactMode.desktop => 8,
              _ToolbarCompactMode.portrait => 6,
              _ToolbarCompactMode.landscape => 5,
            },
          ),
          child: compactMode == _ToolbarCompactMode.portrait
              ? Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _buildMainRow(
                      context,
                      compactMode: compactMode,
                      hideToolLabels: true,
                    ),
                    const SizedBox(height: 5),
                    Container(
                      padding: const EdgeInsets.only(top: 5),
                      decoration: BoxDecoration(
                        border: Border(
                          top: BorderSide(color: colorScheme.outlineVariant),
                        ),
                      ),
                      child: _buildColorsRow(
                        context,
                        compactMode: compactMode,
                      ),
                    ),
                  ],
                )
              : SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _buildMainRow(
                        context,
                        compactMode: compactMode,
                        hideToolLabels: hideToolLabels,
                      ),
                      _ToolbarDivider(
                        compact: compactMode == _ToolbarCompactMode.landscape,
                      ),
                      _buildColorsRow(
                        context,
                        compactMode: compactMode,
                      ),
                    ],
                  ),
                ),
        ),
      ),
    );
  }

  Widget _buildMainRow(
    BuildContext context, {
    required _ToolbarCompactMode compactMode,
    required bool hideToolLabels,
  }) {
    final colorScheme = Theme.of(context).colorScheme;
    final widthInt = currentWidth.round();
    final isPortrait = compactMode == _ToolbarCompactMode.portrait;
    final isLandscape = compactMode == _ToolbarCompactMode.landscape;
    final isDesktop = compactMode == _ToolbarCompactMode.desktop;

    return Row(
      mainAxisSize: isPortrait ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment:
          isPortrait ? MainAxisAlignment.spaceBetween : MainAxisAlignment.start,
      children: [
        // Pen & Eraser
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _ToolToggleBtn(
              icon: currentTool == ToolType.pen
                  ? Icons.edit_rounded
                  : Icons.edit_outlined,
              label: 'ペン',
              tooltip: 'ペンツール (P)',
              isActive: currentTool == ToolType.pen,
              hideLabel: hideToolLabels,
              compactMode: compactMode,
              onTap: () => onSelectTool(ToolType.pen),
            ),
            SizedBox(width: isLandscape ? 2 : 4),
            _ToolToggleBtn(
              iconBuilder: (color) => EraserIcon(
                color: color,
                size: isLandscape ? 18 : 20,
                filled: currentTool == ToolType.eraser,
              ),
              label: '消しゴム',
              tooltip: '消しゴム (E)',
              isActive: currentTool == ToolType.eraser,
              hideLabel: hideToolLabels,
              compactMode: compactMode,
              onTap: () => onSelectTool(ToolType.eraser),
            ),
          ],
        ),
        _ToolbarDivider(compact: !isDesktop),
        // Width presets + slider pill
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (isDesktop) ...[
              _WidthDotBtn(
                widthValue: 2,
                dotSize: 4,
                tooltip: '細い (2px) [',
                isActive: widthInt == 2,
                onTap: () => onSelectWidth(2),
              ),
              const SizedBox(width: 4),
              _WidthDotBtn(
                widthValue: 5,
                dotSize: 8,
                tooltip: '普通 (5px)',
                isActive: widthInt == 5,
                onTap: () => onSelectWidth(5),
              ),
              const SizedBox(width: 4),
              _WidthDotBtn(
                widthValue: 12,
                dotSize: 14,
                tooltip: '太い (12px) ]',
                isActive: widthInt == 12,
                onTap: () => onSelectWidth(12),
              ),
              const SizedBox(width: 4),
            ],
            Tooltip(
              message: '線の太さを調整 (1px〜48px)',
              child: Material(
                color: colorScheme.secondaryContainer,
                borderRadius: BorderRadius.circular(18),
                child: InkWell(
                  borderRadius: BorderRadius.circular(18),
                  onTap: onOpenWidthPopover,
                  child: Container(
                    height: isDesktop ? 36 : 32,
                    constraints: BoxConstraints(
                      minWidth: isDesktop ? 62 : (isLandscape ? 50 : 54),
                    ),
                    padding: EdgeInsets.symmetric(
                      horizontal: isDesktop ? 12 : 9,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 7,
                          height: 7,
                          decoration: BoxDecoration(
                            color: colorScheme.onSecondaryContainer,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 5),
                        Text(
                          '${widthInt}px',
                          style: TextStyle(
                            fontFamily: 'JetBrains Mono',
                            fontSize: isDesktop ? 12 : 11.5,
                            fontWeight: FontWeight.w600,
                            color: colorScheme.onSecondaryContainer,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
        _ToolbarDivider(compact: !isDesktop),
        // Undo / Redo / Clear
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _ActionIconBtn(
              icon: Icons.undo_rounded,
              tooltip: '元に戻す (Ctrl+Z)',
              enabled: canUndo,
              compactMode: compactMode,
              onTap: onUndo,
            ),
            SizedBox(width: isLandscape ? 2 : 4),
            _ActionIconBtn(
              icon: Icons.redo_rounded,
              tooltip: 'やり直す (Ctrl+Y)',
              enabled: canRedo,
              compactMode: compactMode,
              onTap: onRedo,
            ),
            SizedBox(width: isLandscape ? 2 : 4),
            _ActionIconBtn(
              icon: Icons.delete_sweep_outlined,
              tooltip: 'ボードを全消去',
              enabled: true,
              isDanger: true,
              compactMode: compactMode,
              onTap: onClear,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildColorsRow(
    BuildContext context, {
    required _ToolbarCompactMode compactMode,
  }) {
    final colorScheme = Theme.of(context).colorScheme;
    final isPortrait = compactMode == _ToolbarCompactMode.portrait;
    final isLandscape = compactMode == _ToolbarCompactMode.landscape;
    final btnSize = switch (compactMode) {
      _ToolbarCompactMode.desktop => 36.0,
      _ToolbarCompactMode.portrait => 30.0,
      _ToolbarCompactMode.landscape => 28.0,
    };
    final swatchSize = switch (compactMode) {
      _ToolbarCompactMode.desktop => 24.0,
      _ToolbarCompactMode.portrait => 20.0,
      _ToolbarCompactMode.landscape => 19.0,
    };

    return Row(
      mainAxisSize: isPortrait ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment:
          isPortrait ? MainAxisAlignment.spaceBetween : MainAxisAlignment.start,
      children: [
        for (var i = 0; i < AppTheme.penPresets.length; i++) ...[
          if (!isPortrait && i > 0) SizedBox(width: isLandscape ? 2 : 4),
          _ColorSwatchBtn(
            color: AppTheme.penPresets[i].key == 'black' && isDark
                ? AppTheme.penPresets[i].darkStroke
                : AppTheme.penPresets[i].lightSwatch,
            tooltip: AppTheme.penPresets[i].key == 'black' && isDark
                ? '白 (ライト時は黒) [1]'
                : '${AppTheme.penPresets[i].label} [${AppTheme.penPresets[i].shortcut}]',
            isActive: currentTool == ToolType.pen &&
                currentColorKey == AppTheme.penPresets[i].key,
            btnSize: btnSize,
            swatchSize: swatchSize,
            isLightInk: AppTheme.penPresets[i].key == 'black' && isDark,
            onTap: () => onSelectPresetColor(AppTheme.penPresets[i].key),
          ),
        ],
        if (!isPortrait) SizedBox(width: isLandscape ? 2 : 4),
        // Custom Color Wheel Trigger
        Tooltip(
          message: '自由な色を選択 (カスタムカラーピッカー)',
          child: InkWell(
            borderRadius: BorderRadius.circular(btnSize / 2),
            onTap: onOpenCustomColorPicker,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 160),
              width: btnSize,
              height: btnSize,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: currentTool == ToolType.pen &&
                        currentColorKey == 'custom'
                    ? Border.all(color: colorScheme.primary, width: 2.2)
                    : null,
              ),
              alignment: Alignment.center,
              child: Container(
                width: swatchSize,
                height: swatchSize,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: SweepGradient(
                    colors: [
                      Colors.red,
                      Colors.yellow,
                      Colors.green,
                      Colors.cyan,
                      Colors.blue,
                      Colors.purple,
                      Colors.red,
                    ],
                  ),
                ),
                alignment: Alignment.center,
                child: Container(
                  width: swatchSize * 0.5,
                  height: swatchSize * 0.5,
                  decoration: BoxDecoration(
                    color: AppTheme.colorFromHex(customHex),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 1.5),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _ToolbarDivider extends StatelessWidget {
  const _ToolbarDivider({this.compact = false});

  final bool compact;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 1,
      height: compact ? 18 : 24,
      margin: EdgeInsets.symmetric(horizontal: compact ? 6 : 8),
      color: Theme.of(context).colorScheme.outlineVariant,
    );
  }
}

class EraserIcon extends StatelessWidget {
  const EraserIcon({
    super.key,
    required this.color,
    this.size = 20.0,
    this.filled = false,
  });

  final Color color;
  final double size;
  final bool filled;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _EraserIconPainter(color: color, filled: filled),
      ),
    );
  }
}

class _EraserIconPainter extends CustomPainter {
  const _EraserIconPainter({
    required this.color,
    required this.filled,
  });

  final Color color;
  final bool filled;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();
    canvas.scale(size.width / 24.0, size.height / 24.0);

    if (filled) {
      final fillPaint = Paint()
        ..color = color
        ..style = PaintingStyle.fill;

      final path = Path()..fillType = PathFillType.evenOdd;
      // Outer tilted eraser body
      path
        ..moveTo(16.24, 3.56)
        ..relativeLineTo(4.95, 4.94)
        ..relativeCubicTo(0.78, 0.79, 0.78, 2.05, 0, 2.84)
        ..lineTo(12, 20.53)
        ..relativeArcToPoint(
          const Offset(-5.66, 0),
          radius: const Radius.circular(4.008),
          largeArc: false,
          clockwise: true,
        )
        ..lineTo(2.81, 17)
        ..relativeCubicTo(-0.78, -0.79, -0.78, -2.05, 0, -2.84)
        ..relativeLineTo(10.6, -10.6)
        ..relativeCubicTo(0.79, -0.78, 2.05, -0.78, 2.83, 0)
        ..close();

      // Inner tip cutout
      path
        ..moveTo(4.22, 15.58)
        ..relativeLineTo(3.54, 3.53)
        ..relativeCubicTo(0.78, 0.79, 2.04, 0.79, 2.83, 0)
        ..relativeLineTo(1.41, -1.41)
        ..relativeLineTo(-6.36, -6.36)
        ..relativeLineTo(-1.42, 1.41)
        ..relativeCubicTo(-0.78, 0.79, -0.78, 2.05, 0, 2.83)
        ..close();

      // Baseline bar
      path
        ..moveTo(20.0, 19.0)
        ..relativeLineTo(-6.0, 0)
        ..relativeLineTo(-2.0, 2.0)
        ..relativeLineTo(8.0, 0)
        ..relativeCubicTo(0.55, 0, 1, -0.45, 1, -1)
        ..relativeCubicTo(0, -0.55, -0.45, -1, -1, -1)
        ..close();

      canvas.drawPath(path, fillPaint);
    } else {
      final strokePaint = Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.0
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round;

      final bodyPath = Path()
        ..moveTo(7, 21)
        ..relativeLineTo(-4.3, -4.3)
        ..relativeCubicTo(-1, -1, -1, -2.5, 0, -3.4)
        ..relativeLineTo(9.6, -9.6)
        ..relativeCubicTo(1, -1, 2.5, -1, 3.4, 0)
        ..relativeLineTo(5.6, 5.6)
        ..relativeCubicTo(1, 1, 1, 2.5, 0, 3.4)
        ..lineTo(13, 21);

      final baselinePath = Path()
        ..moveTo(22, 21)
        ..lineTo(7, 21);

      final dividerPath = Path()
        ..moveTo(5, 11)
        ..relativeLineTo(9, 9);

      canvas.drawPath(bodyPath, strokePaint);
      canvas.drawPath(baselinePath, strokePaint);
      canvas.drawPath(dividerPath, strokePaint);
    }

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _EraserIconPainter oldDelegate) {
    return oldDelegate.color != color || oldDelegate.filled != filled;
  }
}

class _ToolToggleBtn extends StatelessWidget {
  const _ToolToggleBtn({
    this.icon,
    this.iconBuilder,
    required this.label,
    required this.tooltip,
    required this.isActive,
    required this.hideLabel,
    required this.compactMode,
    required this.onTap,
  }) : assert(icon != null || iconBuilder != null);

  final IconData? icon;
  final Widget Function(Color color)? iconBuilder;
  final String label;
  final String tooltip;
  final bool isActive;
  final bool hideLabel;
  final _ToolbarCompactMode compactMode;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final foregroundColor = isActive
        ? colorScheme.onPrimaryContainer
        : colorScheme.onSurfaceVariant;
    final isDesktop = compactMode == _ToolbarCompactMode.desktop;
    final isLandscape = compactMode == _ToolbarCompactMode.landscape;

    return Tooltip(
      message: tooltip,
      child: Material(
        color: isActive ? colorScheme.primaryContainer : Colors.transparent,
        borderRadius: BorderRadius.circular(isActive ? 14 : 19),
        child: InkWell(
          borderRadius: BorderRadius.circular(isActive ? 14 : 19),
          onTap: onTap,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            height: isDesktop ? 38 : (isLandscape ? 32 : 34),
            width: isDesktop ? null : (isLandscape ? 34 : 36),
            padding: isDesktop
                ? EdgeInsets.symmetric(horizontal: hideLabel ? 10 : 12)
                : EdgeInsets.zero,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (iconBuilder != null)
                  iconBuilder!(foregroundColor)
                else
                  Icon(
                    icon,
                    size: isLandscape ? 18 : 20,
                    color: foregroundColor,
                  ),
                if (!hideLabel) ...[
                  const SizedBox(width: 6),
                  Text(
                    label,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: foregroundColor,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _WidthDotBtn extends StatelessWidget {
  const _WidthDotBtn({
    required this.widthValue,
    required this.dotSize,
    required this.tooltip,
    required this.isActive,
    required this.onTap,
  });

  final double widthValue;
  final double dotSize;
  final String tooltip;
  final bool isActive;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Tooltip(
      message: tooltip,
      child: Material(
        color: isActive ? colorScheme.primaryContainer : Colors.transparent,
        shape: const CircleBorder(),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: onTap,
          child: SizedBox(
            width: 34,
            height: 34,
            child: Center(
              child: Container(
                width: dotSize,
                height: dotSize,
                decoration: BoxDecoration(
                  color: isActive
                      ? colorScheme.onPrimaryContainer
                      : colorScheme.onSurfaceVariant,
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _ActionIconBtn extends StatelessWidget {
  const _ActionIconBtn({
    required this.icon,
    required this.tooltip,
    required this.enabled,
    required this.compactMode,
    required this.onTap,
    this.isDanger = false,
  });

  final IconData icon;
  final String tooltip;
  final bool enabled;
  final _ToolbarCompactMode compactMode;
  final bool isDanger;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final size = switch (compactMode) {
      _ToolbarCompactMode.desktop => 38.0,
      _ToolbarCompactMode.portrait => 34.0,
      _ToolbarCompactMode.landscape => 32.0,
    };
    final iconSize = compactMode == _ToolbarCompactMode.landscape ? 18.0 : 20.0;
    return Tooltip(
      message: tooltip,
      child: InkWell(
        borderRadius: BorderRadius.circular(size / 2),
        hoverColor: isDanger
            ? colorScheme.errorContainer.withValues(alpha: 0.65)
            : null,
        onTap: enabled ? onTap : null,
        child: SizedBox(
          width: size,
          height: size,
          child: Icon(
            icon,
            size: iconSize,
            color: enabled
                ? colorScheme.onSurfaceVariant
                : colorScheme.onSurfaceVariant.withValues(alpha: 0.35),
          ),
        ),
      ),
    );
  }
}

class _ColorSwatchBtn extends StatelessWidget {
  const _ColorSwatchBtn({
    required this.color,
    required this.tooltip,
    required this.isActive,
    required this.btnSize,
    required this.swatchSize,
    required this.isLightInk,
    required this.onTap,
  });

  final Color color;
  final String tooltip;
  final bool isActive;
  final double btnSize;
  final double swatchSize;
  final bool isLightInk;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Tooltip(
      message: tooltip,
      child: InkWell(
        borderRadius: BorderRadius.circular(btnSize / 2),
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 160),
          width: btnSize,
          height: btnSize,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: isActive
                ? Border.all(color: colorScheme.primary, width: 2.2)
                : null,
          ),
          alignment: Alignment.center,
          child: Container(
            width: swatchSize,
            height: swatchSize,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
              border: Border.all(
                color: isLightInk
                    ? colorScheme.outline
                    : Colors.white.withValues(alpha: 0.3),
                width: 1.5,
              ),
            ),
            child: isActive
                ? Icon(
                    Icons.check_rounded,
                    size: 12,
                    color: isLightInk ? Colors.black : Colors.white,
                  )
                : null,
          ),
        ),
      ),
    );
  }
}
