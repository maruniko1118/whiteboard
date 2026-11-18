import 'package:material_ui/material_ui.dart';

class ZoomHud extends StatelessWidget {
  const ZoomHud({
    super.key,
    required this.scale,
    required this.onZoomOut,
    required this.onReset,
    required this.onZoomIn,
  });

  final double scale;
  final VoidCallback onZoomOut;
  final VoidCallback onReset;
  final VoidCallback onZoomIn;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final width = MediaQuery.sizeOf(context).width;
    final isMobile = width <= 768;
    final pct = '${(scale * 100).round()}%';

    return Material(
      elevation: 4,
      shadowColor: Colors.black.withValues(alpha: 0.2),
      color: colorScheme.surfaceContainerHigh,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: colorScheme.outlineVariant),
      ),
      child: SizedBox(
        height: isMobile ? 34 : 38,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _ZoomIconBtn(
              icon: Icons.remove_rounded,
              tooltip: '縮小 (Ctrl + ホイール下)',
              size: isMobile ? 28 : 32,
              onTap: onZoomOut,
            ),
            Tooltip(
              message: '100%・初期位置にリセット (右クリックドラッグ / 2本指で移動)',
              child: InkWell(
                borderRadius: BorderRadius.circular(14),
                onTap: onReset,
                child: Container(
                  constraints: BoxConstraints(minWidth: isMobile ? 46 : 54),
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                  alignment: Alignment.center,
                  child: Text(
                    pct,
                    style: TextStyle(
                      fontFamily: 'JetBrains Mono',
                      fontSize: isMobile ? 11 : 12,
                      fontWeight: FontWeight.w600,
                      color: colorScheme.onSurface,
                    ),
                  ),
                ),
              ),
            ),
            _ZoomIconBtn(
              icon: Icons.add_rounded,
              tooltip: '拡大 (Ctrl + ホイール上)',
              size: isMobile ? 28 : 32,
              onTap: onZoomIn,
            ),
          ],
        ),
      ),
    );
  }
}

class _ZoomIconBtn extends StatelessWidget {
  const _ZoomIconBtn({
    required this.icon,
    required this.tooltip,
    required this.size,
    required this.onTap,
  });

  final IconData icon;
  final String tooltip;
  final double size;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Tooltip(
      message: tooltip,
      child: InkWell(
        borderRadius: BorderRadius.circular(size / 2),
        onTap: onTap,
        child: SizedBox(
          width: size,
          height: size,
          child: Icon(
            icon,
            size: 16,
            color: colorScheme.onSurfaceVariant,
          ),
        ),
      ),
    );
  }
}
