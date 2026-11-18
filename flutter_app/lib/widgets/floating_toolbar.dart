import 'package:material_ui/material_ui.dart';

import '../models/whiteboard_models.dart';
import '../theme/app_theme.dart';

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
    final screenWidth = MediaQuery.sizeOf(context).width;
    final isMobile = screenWidth <= 768;
    final hideToolLabels = screenWidth <= 960;

    return Material(
      elevation: 8,
      shadowColor: Colors.black.withValues(alpha: isDark ? 0.55 : 0.18),
      color: colorScheme.surfaceContainerHigh,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(isMobile ? 22 : 28),
        side: BorderSide(color: colorScheme.outlineVariant),
      ),
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: isMobile ? 396 : screenWidth - 24,
        ),
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: isMobile ? 12 : 14,
            vertical: isMobile ? 8 : 8,
          ),
          child: isMobile
              ? Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _buildMainRow(
                      context,
                      isMobile: true,
                      hideToolLabels: true,
                    ),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.only(top: 6),
                      decoration: BoxDecoration(
                        border: Border(
                          top: BorderSide(color: colorScheme.outlineVariant),
                        ),
                      ),
                      child: _buildColorsRow(context, isMobile: true),
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
                        isMobile: false,
                        hideToolLabels: hideToolLabels,
                      ),
                      _ToolbarDivider(),
                      _buildColorsRow(context, isMobile: false),
                    ],
                  ),
                ),
        ),
      ),
    );
  }

  Widget _buildMainRow(
    BuildContext context, {
    required bool isMobile,
    required bool hideToolLabels,
  }) {
    final colorScheme = Theme.of(context).colorScheme;
    final widthInt = currentWidth.round();

    return Row(
      mainAxisSize: isMobile ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment:
          isMobile ? MainAxisAlignment.spaceBetween : MainAxisAlignment.start,
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
              isMobile: isMobile,
              onTap: () => onSelectTool(ToolType.pen),
            ),
            const SizedBox(width: 4),
            _ToolToggleBtn(
              icon: Icons.auto_fix_normal_rounded,
              label: '消しゴム',
              tooltip: '消しゴム (E)',
              isActive: currentTool == ToolType.eraser,
              hideLabel: hideToolLabels,
              isMobile: isMobile,
              onTap: () => onSelectTool(ToolType.eraser),
            ),
          ],
        ),
        _ToolbarDivider(),
        // Width presets + slider pill
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (!isMobile) ...[
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
                    height: isMobile ? 34 : 36,
                    constraints: BoxConstraints(minWidth: isMobile ? 58 : 62),
                    padding: EdgeInsets.symmetric(
                      horizontal: isMobile ? 10 : 12,
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
                        const SizedBox(width: 6),
                        Text(
                          '${widthInt}px',
                          style: TextStyle(
                            fontFamily: 'JetBrains Mono',
                            fontSize: isMobile ? 11.5 : 12,
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
        _ToolbarDivider(),
        // Undo / Redo / Clear
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _ActionIconBtn(
              icon: Icons.undo_rounded,
              tooltip: '元に戻す (Ctrl+Z)',
              enabled: canUndo,
              isMobile: isMobile,
              onTap: onUndo,
            ),
            const SizedBox(width: 4),
            _ActionIconBtn(
              icon: Icons.redo_rounded,
              tooltip: 'やり直す (Ctrl+Y)',
              enabled: canRedo,
              isMobile: isMobile,
              onTap: onRedo,
            ),
            const SizedBox(width: 4),
            _ActionIconBtn(
              icon: Icons.delete_sweep_outlined,
              tooltip: 'ボードを全消去',
              enabled: true,
              isDanger: true,
              isMobile: isMobile,
              onTap: onClear,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildColorsRow(BuildContext context, {required bool isMobile}) {
    final colorScheme = Theme.of(context).colorScheme;
    final btnSize = isMobile ? 32.0 : 36.0;
    final swatchSize = isMobile ? 21.0 : 24.0;

    return Row(
      mainAxisSize: isMobile ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment:
          isMobile ? MainAxisAlignment.spaceBetween : MainAxisAlignment.start,
      children: [
        for (var i = 0; i < AppTheme.penPresets.length; i++) ...[
          if (!isMobile && i > 0) const SizedBox(width: 4),
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
        if (!isMobile) const SizedBox(width: 4),
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
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 1,
      height: 24,
      margin: const EdgeInsets.symmetric(horizontal: 8),
      color: Theme.of(context).colorScheme.outlineVariant,
    );
  }
}

class _ToolToggleBtn extends StatelessWidget {
  const _ToolToggleBtn({
    required this.icon,
    required this.label,
    required this.tooltip,
    required this.isActive,
    required this.hideLabel,
    required this.isMobile,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final String tooltip;
  final bool isActive;
  final bool hideLabel;
  final bool isMobile;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
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
            height: isMobile ? 36 : 38,
            width: isMobile ? 38 : null,
            padding: isMobile
                ? EdgeInsets.zero
                : EdgeInsets.symmetric(horizontal: hideLabel ? 10 : 12),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  icon,
                  size: 20,
                  color: isActive
                      ? colorScheme.onPrimaryContainer
                      : colorScheme.onSurfaceVariant,
                ),
                if (!hideLabel) ...[
                  const SizedBox(width: 6),
                  Text(
                    label,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: isActive
                          ? colorScheme.onPrimaryContainer
                          : colorScheme.onSurfaceVariant,
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
    required this.isMobile,
    required this.onTap,
    this.isDanger = false,
  });

  final IconData icon;
  final String tooltip;
  final bool enabled;
  final bool isMobile;
  final bool isDanger;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final size = isMobile ? 36.0 : 38.0;
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
            size: 20,
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
                    size: 13,
                    color: isLightInk ? Colors.black : Colors.white,
                  )
                : null,
          ),
        ),
      ),
    );
  }
}
