import 'package:material_ui/material_ui.dart';

import 'responsive_layout.dart';

class ZoomHud extends StatefulWidget {
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
  State<ZoomHud> createState() => _ZoomHudState();
}

class _ZoomHudState extends State<ZoomHud> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final layout = WhiteboardLayout.of(context);
    final isMobile = layout.isMobile;
    final pct = '${(widget.scale * 100).round()}%';

    if (!isMobile) {
      return Material(
        elevation: 4,
        shadowColor: Colors.black.withValues(alpha: 0.2),
        color: colorScheme.surfaceContainerHigh,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(color: colorScheme.outlineVariant),
        ),
        child: SizedBox(
          height: 38,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _ZoomIconBtn(
                icon: Icons.remove_rounded,
                tooltip: '縮小 (Ctrl + ホイール下)',
                size: 32,
                onTap: widget.onZoomOut,
              ),
              Tooltip(
                message: '100%・初期位置にリセット (右クリックドラッグ / 2本指で移動)',
                child: InkWell(
                  borderRadius: BorderRadius.circular(14),
                  onTap: widget.onReset,
                  child: Container(
                    constraints: const BoxConstraints(minWidth: 54),
                    padding: const EdgeInsets.symmetric(horizontal: 6),
                    alignment: Alignment.center,
                    child: Text(
                      pct,
                      style: TextStyle(
                        fontFamily: 'JetBrains Mono',
                        fontSize: 12,
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
                size: 32,
                onTap: widget.onZoomIn,
              ),
            ],
          ),
        ),
      );
    }

    return Material(
      elevation: 4,
      shadowColor: Colors.black.withValues(alpha: 0.2),
      color: colorScheme.surfaceContainerHigh.withValues(alpha: 0.92),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: BorderSide(color: colorScheme.outlineVariant),
      ),
      child: AnimatedSize(
        duration: const Duration(milliseconds: 180),
        curve: Curves.easeOutCubic,
        child: SizedBox(
          height: _expanded ? 32 : 30,
          child: _expanded
              ? Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _ZoomIconBtn(
                      icon: Icons.remove_rounded,
                      tooltip: '縮小',
                      size: 28,
                      onTap: widget.onZoomOut,
                    ),
                    Tooltip(
                      message: '100%・初期位置にリセット',
                      child: InkWell(
                        borderRadius: BorderRadius.circular(12),
                        onTap: widget.onReset,
                        child: Container(
                          constraints: const BoxConstraints(minWidth: 44),
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          alignment: Alignment.center,
                          child: Text(
                            pct,
                            style: TextStyle(
                              fontFamily: 'JetBrains Mono',
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: colorScheme.onSurface,
                            ),
                          ),
                        ),
                      ),
                    ),
                    _ZoomIconBtn(
                      icon: Icons.add_rounded,
                      tooltip: '拡大',
                      size: 28,
                      onTap: widget.onZoomIn,
                    ),
                    _ZoomIconBtn(
                      icon: Icons.close_rounded,
                      tooltip: 'ズーム操作を閉じる',
                      size: 26,
                      iconSize: 14,
                      onTap: () => setState(() => _expanded = false),
                    ),
                  ],
                )
              : Tooltip(
                  message: 'ズーム操作を表示 (2本指で移動・ピンチ拡大縮小)',
                  child: InkWell(
                    borderRadius: BorderRadius.circular(15),
                    onTap: () => setState(() => _expanded = true),
                    child: Container(
                      constraints: const BoxConstraints(minWidth: 48),
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      alignment: Alignment.center,
                      child: Text(
                        pct,
                        style: TextStyle(
                          fontFamily: 'JetBrains Mono',
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: colorScheme.onSurface,
                        ),
                      ),
                    ),
                  ),
                ),
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
    this.iconSize = 16,
  });

  final IconData icon;
  final String tooltip;
  final double size;
  final VoidCallback onTap;
  final double iconSize;

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
            size: iconSize,
            color: colorScheme.onSurfaceVariant,
          ),
        ),
      ),
    );
  }
}
