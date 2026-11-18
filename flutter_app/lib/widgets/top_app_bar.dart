import 'package:material_ui/material_ui.dart';

import '../models/whiteboard_models.dart';

class WhiteboardTopAppBar extends StatelessWidget {
  const WhiteboardTopAppBar({
    super.key,
    required this.boards,
    required this.activeBoardId,
    required this.isDark,
    required this.lastSavedAt,
    required this.tabScrollController,
    required this.onSelectBoard,
    required this.onRenameBoard,
    required this.onCreateBoard,
    required this.onDuplicateBoard,
    required this.onDeleteBoard,
    required this.onOpenSeedPicker,
    required this.onOpenBackupMenu,
    required this.onExportPng,
    required this.onToggleTheme,
    this.onDownloadApk,
  });

  final List<BoardData> boards;
  final String activeBoardId;
  final bool isDark;
  final DateTime? lastSavedAt;
  final ScrollController tabScrollController;

  final ValueChanged<String> onSelectBoard;
  final ValueChanged<BoardData> onRenameBoard;
  final VoidCallback onCreateBoard;
  final VoidCallback onDuplicateBoard;
  final VoidCallback onDeleteBoard;
  final VoidCallback onOpenSeedPicker;
  final VoidCallback onOpenBackupMenu;
  final VoidCallback onExportPng;
  final VoidCallback onToggleTheme;
  final VoidCallback? onDownloadApk;

  String _saveTooltip() {
    if (lastSavedAt == null) {
      return 'ローカルストレージに自動保存済み';
    }
    final h = lastSavedAt!.hour.toString().padLeft(2, '0');
    final m = lastSavedAt!.minute.toString().padLeft(2, '0');
    final s = lastSavedAt!.second.toString().padLeft(2, '0');
    return 'ローカルストレージに自動保存済み (最終保存: $h:$m:$s)';
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final width = MediaQuery.sizeOf(context).width;
    final isMobile = width <= 768;
    final isCompactActions = width <= 960;

    return Container(
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainer,
        border: Border(
          bottom: BorderSide(color: colorScheme.outlineVariant),
        ),
      ),
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 10 : 14,
        vertical: isMobile ? 8 : 10,
      ),
      child: isMobile
          ? Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    _BrandMark(size: 36, radius: 12),
                    const Spacer(),
                    _buildActionsRow(
                      context,
                      isMobile: true,
                      isCompact: true,
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.only(top: 6),
                  decoration: BoxDecoration(
                    border: Border(
                      top: BorderSide(color: colorScheme.outlineVariant),
                    ),
                  ),
                  child: _buildTabsSection(context, isMobile: true),
                ),
              ],
            )
          : Row(
              children: [
                _BrandMark(size: 40, radius: 14),
                const SizedBox(width: 10),
                Expanded(child: _buildTabsSection(context, isMobile: false)),
                const SizedBox(width: 12),
                _buildActionsRow(
                  context,
                  isMobile: false,
                  isCompact: isCompactActions,
                ),
              ],
            ),
    );
  }

  Widget _buildTabsSection(BuildContext context, {required bool isMobile}) {
    final colorScheme = Theme.of(context).colorScheme;
    final activeBoard = boards.where((b) => b.id == activeBoardId).firstOrNull ??
        boards.first;

    return Row(
      children: [
        Expanded(
          child: SingleChildScrollView(
            controller: tabScrollController,
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                for (var i = 0; i < boards.length; i++) ...[
                  if (i > 0) const SizedBox(width: 6),
                  _BoardTabChip(
                    board: boards[i],
                    isActive: boards[i].id == activeBoardId,
                    isMobile: isMobile,
                    onTap: () {
                      if (boards[i].id != activeBoardId) {
                        onSelectBoard(boards[i].id);
                      }
                    },
                    onDoubleTap: () => onRenameBoard(boards[i]),
                  ),
                ],
              ],
            ),
          ),
        ),
        const SizedBox(width: 6),
        Container(
          padding: const EdgeInsets.only(left: 6),
          decoration: BoxDecoration(
            border: Border(
              left: BorderSide(color: colorScheme.outlineVariant, width: 1.5),
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _TabControlButton(
                icon: Icons.add_rounded,
                tooltip: '新しいボードを作成',
                isTonal: true,
                size: isMobile ? 34 : 36,
                onPressed: onCreateBoard,
              ),
              const SizedBox(width: 4),
              _TabControlButton(
                icon: Icons.edit_outlined,
                tooltip: '現在のボード名を変更',
                size: isMobile ? 34 : 36,
                onPressed: () => onRenameBoard(activeBoard),
              ),
              const SizedBox(width: 4),
              _TabControlButton(
                icon: Icons.content_copy_rounded,
                tooltip: '現在のボードを複製',
                size: isMobile ? 34 : 36,
                onPressed: onDuplicateBoard,
              ),
              const SizedBox(width: 4),
              _TabControlButton(
                icon: Icons.delete_outline_rounded,
                tooltip: boards.length > 1 ? '現在のボードを削除' : '現在のボードをリセット',
                isDangerHover: true,
                size: isMobile ? 34 : 36,
                onPressed: onDeleteBoard,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildActionsRow(
    BuildContext context, {
    required bool isMobile,
    required bool isCompact,
  }) {
    final colorScheme = Theme.of(context).colorScheme;
    final btnSize = isMobile ? 36.0 : 38.0;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Calm Save Status Chip
        Tooltip(
          message: _saveTooltip(),
          child: Container(
            height: btnSize,
            padding: EdgeInsets.symmetric(horizontal: isCompact ? 0 : 12),
            constraints: BoxConstraints(minWidth: isCompact ? btnSize : 118),
            decoration: BoxDecoration(
              color: colorScheme.surfaceContainerLow,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: colorScheme.outlineVariant),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.cloud_done_outlined,
                  size: 16,
                  color: colorScheme.primary,
                ),
                if (!isCompact) ...[
                  const SizedBox(width: 6),
                  Text(
                    '自動保存済み',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
        SizedBox(width: isMobile ? 5 : 8),
        _HeaderIconButton(
          icon: Icons.palette_outlined,
          tooltip: 'UIテーマカラー (M3 Expressive)',
          size: btnSize,
          onPressed: onOpenSeedPicker,
        ),
        SizedBox(width: isMobile ? 5 : 8),
        _HeaderIconButton(
          icon: Icons.folder_copy_outlined,
          tooltip: 'バックアップと復元 (JSON)',
          size: btnSize,
          onPressed: onOpenBackupMenu,
        ),
        SizedBox(width: isMobile ? 5 : 8),
        Tooltip(
          message: '現在のボードを透過画像として保存 (PNG)',
          child: FilledButton.tonal(
            onPressed: onExportPng,
            style: FilledButton.styleFrom(
              minimumSize: Size(btnSize, btnSize),
              padding: EdgeInsets.symmetric(horizontal: isCompact ? 0 : 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(19),
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.download_rounded, size: 18),
                if (!isCompact) ...[
                  const SizedBox(width: 7),
                  const Text(
                    'PNG保存',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                  ),
                ],
              ],
            ),
          ),
        ),
        if (onDownloadApk != null) ...[
          SizedBox(width: isMobile ? 5 : 8),
          _HeaderIconButton(
            icon: Icons.android_rounded,
            tooltip: 'Androidアプリ (.apk) をダウンロード',
            size: btnSize,
            onPressed: onDownloadApk!,
          ),
        ],
        SizedBox(width: isMobile ? 5 : 8),
        _HeaderIconButton(
          icon: isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
          tooltip: 'テーマ切り替え (ライト / ダーク) [T]',
          size: btnSize,
          onPressed: onToggleTheme,
        ),
      ],
    );
  }
}

class _BrandMark extends StatelessWidget {
  const _BrandMark({required this.size, required this.radius});

  final double size;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Tooltip(
      message: 'Whiteboard (Material 3 Expressive)',
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: colorScheme.primary,
          borderRadius: BorderRadius.circular(radius),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.12),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Icon(
          Icons.draw_rounded,
          color: colorScheme.onPrimary,
          size: 22,
        ),
      ),
    );
  }
}

class _BoardTabChip extends StatelessWidget {
  const _BoardTabChip({
    required this.board,
    required this.isActive,
    required this.isMobile,
    required this.onTap,
    required this.onDoubleTap,
  });

  final BoardData board;
  final bool isActive;
  final bool isMobile;
  final VoidCallback onTap;
  final VoidCallback onDoubleTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final radius = isActive ? 12.0 : (isMobile ? 18.0 : 20.0);

    return Tooltip(
      message: '${board.title} (ダブルクリックで名前変更)',
      child: GestureDetector(
        onDoubleTap: onDoubleTap,
        child: Material(
          color: isActive
              ? colorScheme.primaryContainer
              : colorScheme.surfaceContainerHigh,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radius),
            side: BorderSide(
              color: isActive ? colorScheme.primary : colorScheme.outlineVariant,
              width: 1.5,
            ),
          ),
          child: InkWell(
            borderRadius: BorderRadius.circular(radius),
            onTap: onTap,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 220),
              curve: Curves.easeOutCubic,
              height: isMobile ? 36 : 40,
              padding: EdgeInsets.symmetric(horizontal: isMobile ? 13 : 16),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    isActive
                        ? Icons.dashboard_rounded
                        : Icons.dashboard_outlined,
                    size: 17,
                    color: isActive
                        ? colorScheme.onPrimaryContainer
                        : colorScheme.onSurfaceVariant,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    board.title,
                    style: TextStyle(
                      fontSize: isMobile ? 13 : 13.5,
                      fontWeight: FontWeight.w600,
                      color: isActive
                          ? colorScheme.onPrimaryContainer
                          : colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _TabControlButton extends StatelessWidget {
  const _TabControlButton({
    required this.icon,
    required this.tooltip,
    required this.onPressed,
    this.isTonal = false,
    this.isDangerHover = false,
    this.size = 36,
  });

  final IconData icon;
  final String tooltip;
  final VoidCallback onPressed;
  final bool isTonal;
  final bool isDangerHover;
  final double size;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Tooltip(
      message: tooltip,
      child: Material(
        color: isTonal
            ? colorScheme.secondaryContainer
            : colorScheme.surfaceContainerLow,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: isTonal
              ? BorderSide.none
              : BorderSide(color: colorScheme.outlineVariant),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          hoverColor: isDangerHover
              ? colorScheme.errorContainer.withValues(alpha: 0.65)
              : null,
          onTap: onPressed,
          child: SizedBox(
            width: size,
            height: size,
            child: Icon(
              icon,
              size: 17,
              color: isTonal
                  ? colorScheme.onSecondaryContainer
                  : colorScheme.onSurfaceVariant,
            ),
          ),
        ),
      ),
    );
  }
}

class _HeaderIconButton extends StatelessWidget {
  const _HeaderIconButton({
    required this.icon,
    required this.tooltip,
    required this.size,
    required this.onPressed,
  });

  final IconData icon;
  final String tooltip;
  final double size;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Tooltip(
      message: tooltip,
      child: Material(
        color: colorScheme.surfaceContainerLow,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(size / 2),
          side: BorderSide(color: colorScheme.outlineVariant),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(size / 2),
          onTap: onPressed,
          child: SizedBox(
            width: size,
            height: size,
            child: Icon(
              icon,
              size: 20,
              color: colorScheme.onSurfaceVariant,
            ),
          ),
        ),
      ),
    );
  }
}
