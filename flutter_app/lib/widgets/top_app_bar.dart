import 'dart:math' as math;

import 'package:material_ui/material_ui.dart';

import '../models/whiteboard_models.dart';
import 'responsive_layout.dart';

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
    this.onToggleFocusMode,
    this.onDownloadApk,
    this.onCheckAppUpdate,
    this.hasAppUpdate = false,
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
  final VoidCallback? onToggleFocusMode;
  final VoidCallback? onDownloadApk;
  final VoidCallback? onCheckAppUpdate;
  final bool hasAppUpdate;

  String _saveTooltip() {
    if (lastSavedAt == null) {
      return 'ローカルストレージに自動保存済み';
    }
    final h = lastSavedAt!.hour.toString().padLeft(2, '0');
    final m = lastSavedAt!.minute.toString().padLeft(2, '0');
    final s = lastSavedAt!.second.toString().padLeft(2, '0');
    return 'ローカルストレージに自動保存済み (最終保存: $h:$m:$s)';
  }

  void _openBoardManager(BuildContext context) {
    showBoardManagerSheet(
      context,
      boards: boards,
      activeBoardId: activeBoardId,
      saveSummary: _saveTooltip(),
      onSelectBoard: onSelectBoard,
      onCreateBoard: onCreateBoard,
      onRenameBoard: onRenameBoard,
      onDuplicateBoard: onDuplicateBoard,
      onDeleteBoard: onDeleteBoard,
    );
  }

  void _openMoreMenu(BuildContext context) {
    showMobileMoreMenuSheet(
      context,
      isDark: isDark,
      saveSummary: _saveTooltip(),
      onExportPng: onExportPng,
      onToggleTheme: onToggleTheme,
      onOpenSeedPicker: onOpenSeedPicker,
      onOpenBackupMenu: onOpenBackupMenu,
      onDownloadApk: onDownloadApk,
      onCheckAppUpdate: onCheckAppUpdate,
      hasAppUpdate: hasAppUpdate,
    );
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final layout = WhiteboardLayout.of(context);
    final isCompactActions = layout.isCompactActions;
    final activeBoard = boards.where((b) => b.id == activeBoardId).firstOrNull ??
        boards.first;

    if (!layout.isDesktop) {
      return Container(
        decoration: BoxDecoration(
          color: colorScheme.surfaceContainer,
          border: Border(
            bottom: BorderSide(color: colorScheme.outlineVariant),
          ),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        child: Row(
          children: [
            Expanded(
              child: _BoardSelectorPill(
                title: activeBoard.title,
                boardCount: boards.length,
                compact: false,
                onTap: () => _openBoardManager(context),
              ),
            ),
            const SizedBox(width: 8),
            if (onCheckAppUpdate != null) ...[
              _HeaderIconButton(
                icon: Icons.system_update_rounded,
                tooltip: hasAppUpdate
                    ? '新しいアップデートが利用可能です'
                    : 'アプリのアップデートを確認',
                size: 36,
                showBadge: hasAppUpdate,
                onPressed: onCheckAppUpdate!,
              ),
              const SizedBox(width: 6),
            ],
            if (onToggleFocusMode != null) ...[
              _HeaderIconButton(
                icon: Icons.fullscreen_rounded,
                tooltip: 'キャンバスを最大化 (UIを隠す)',
                size: 36,
                onPressed: onToggleFocusMode!,
              ),
              const SizedBox(width: 6),
            ],
            _HeaderIconButton(
              icon: Icons.more_vert_rounded,
              tooltip: 'メニュー (保存・テーマ・設定)',
              size: 36,
              showBadge: onCheckAppUpdate == null && hasAppUpdate,
              onPressed: () => _openMoreMenu(context),
            ),
          ],
        ),
      );
    }

    return Container(
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainer,
        border: Border(
          bottom: BorderSide(color: colorScheme.outlineVariant),
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      child: Row(
        children: [
          const _BrandMark(size: 40, radius: 14),
          const SizedBox(width: 10),
          Expanded(child: _buildTabsSection(context)),
          const SizedBox(width: 12),
          _buildActionsRow(
            context,
            isCompact: isCompactActions,
          ),
        ],
      ),
    );
  }

  Widget _buildTabsSection(BuildContext context) {
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
                onPressed: onCreateBoard,
              ),
              const SizedBox(width: 4),
              _TabControlButton(
                icon: Icons.edit_outlined,
                tooltip: '現在のボード名を変更',
                onPressed: () => onRenameBoard(activeBoard),
              ),
              const SizedBox(width: 4),
              _TabControlButton(
                icon: Icons.content_copy_rounded,
                tooltip: '現在のボードを複製',
                onPressed: onDuplicateBoard,
              ),
              const SizedBox(width: 4),
              _TabControlButton(
                icon: Icons.delete_outline_rounded,
                tooltip: boards.length > 1 ? '現在のボードを削除' : '現在のボードをリセット',
                isDangerHover: true,
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
    required bool isCompact,
  }) {
    final colorScheme = Theme.of(context).colorScheme;
    const btnSize = 38.0;

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
        const SizedBox(width: 8),
        _HeaderIconButton(
          icon: Icons.palette_outlined,
          tooltip: 'UIテーマカラー (M3 Expressive)',
          size: btnSize,
          onPressed: onOpenSeedPicker,
        ),
        const SizedBox(width: 8),
        _HeaderIconButton(
          icon: Icons.folder_copy_outlined,
          tooltip: 'バックアップと復元 (JSON)',
          size: btnSize,
          onPressed: onOpenBackupMenu,
        ),
        const SizedBox(width: 8),
        Tooltip(
          message: '現在のボードを透過画像として保存 (PNG)',
          child: FilledButton.tonal(
            onPressed: onExportPng,
            style: FilledButton.styleFrom(
              minimumSize: const Size(btnSize, btnSize),
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
          const SizedBox(width: 8),
          _HeaderIconButton(
            icon: Icons.android_rounded,
            tooltip: 'Androidアプリ (.apk) をダウンロード',
            size: btnSize,
            onPressed: onDownloadApk!,
          ),
        ],
        if (onCheckAppUpdate != null) ...[
          const SizedBox(width: 8),
          _HeaderIconButton(
            icon: Icons.system_update_rounded,
            tooltip: hasAppUpdate
                ? '新しいアップデートが利用可能です'
                : 'アプリのアップデートを確認',
            size: btnSize,
            showBadge: hasAppUpdate,
            onPressed: onCheckAppUpdate!,
          ),
        ],
        const SizedBox(width: 8),
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

class WhiteboardLandscapeHeaderPill extends StatelessWidget {
  const WhiteboardLandscapeHeaderPill({
    super.key,
    required this.boards,
    required this.activeBoardId,
    required this.isDark,
    required this.lastSavedAt,
    required this.onSelectBoard,
    required this.onRenameBoard,
    required this.onCreateBoard,
    required this.onDuplicateBoard,
    required this.onDeleteBoard,
    required this.onOpenSeedPicker,
    required this.onOpenBackupMenu,
    required this.onExportPng,
    required this.onToggleTheme,
    required this.onToggleFocusMode,
    this.onDownloadApk,
    this.onCheckAppUpdate,
    this.hasAppUpdate = false,
  });

  final List<BoardData> boards;
  final String activeBoardId;
  final bool isDark;
  final DateTime? lastSavedAt;

  final ValueChanged<String> onSelectBoard;
  final ValueChanged<BoardData> onRenameBoard;
  final VoidCallback onCreateBoard;
  final VoidCallback onDuplicateBoard;
  final VoidCallback onDeleteBoard;
  final VoidCallback onOpenSeedPicker;
  final VoidCallback onOpenBackupMenu;
  final VoidCallback onExportPng;
  final VoidCallback onToggleTheme;
  final VoidCallback onToggleFocusMode;
  final VoidCallback? onDownloadApk;
  final VoidCallback? onCheckAppUpdate;
  final bool hasAppUpdate;

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
    final activeBoard = boards.where((b) => b.id == activeBoardId).firstOrNull ??
        boards.first;

    return Material(
      elevation: 4,
      shadowColor: Colors.black.withValues(alpha: 0.2),
      color: colorScheme.surfaceContainerHigh.withValues(alpha: 0.94),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: colorScheme.outlineVariant),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 3),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 168),
              child: _BoardSelectorPill(
                title: activeBoard.title,
                boardCount: boards.length,
                compact: true,
                onTap: () => showBoardManagerSheet(
                  context,
                  boards: boards,
                  activeBoardId: activeBoardId,
                  saveSummary: _saveTooltip(),
                  onSelectBoard: onSelectBoard,
                  onCreateBoard: onCreateBoard,
                  onRenameBoard: onRenameBoard,
                  onDuplicateBoard: onDuplicateBoard,
                  onDeleteBoard: onDeleteBoard,
                ),
              ),
            ),
            Container(
              width: 1,
              height: 18,
              margin: const EdgeInsets.symmetric(horizontal: 4),
              color: colorScheme.outlineVariant,
            ),
            if (onCheckAppUpdate != null) ...[
              _HeaderIconButton(
                icon: Icons.system_update_rounded,
                tooltip: hasAppUpdate
                    ? '新しいアップデートが利用可能です'
                    : 'アプリのアップデートを確認',
                size: 32,
                iconSize: 18,
                showBadge: hasAppUpdate,
                transparent: true,
                onPressed: onCheckAppUpdate!,
              ),
              const SizedBox(width: 2),
            ],
            _HeaderIconButton(
              icon: Icons.fullscreen_rounded,
              tooltip: 'キャンバスを最大化 (UIを隠す)',
              size: 32,
              iconSize: 18,
              transparent: true,
              onPressed: onToggleFocusMode,
            ),
            const SizedBox(width: 2),
            _HeaderIconButton(
              icon: Icons.more_vert_rounded,
              tooltip: 'メニュー (保存・テーマ・設定)',
              size: 32,
              iconSize: 18,
              showBadge: onCheckAppUpdate == null && hasAppUpdate,
              transparent: true,
              onPressed: () => showMobileMoreMenuSheet(
                context,
                isDark: isDark,
                saveSummary: _saveTooltip(),
                onExportPng: onExportPng,
                onToggleTheme: onToggleTheme,
                onOpenSeedPicker: onOpenSeedPicker,
                onOpenBackupMenu: onOpenBackupMenu,
                onDownloadApk: onDownloadApk,
                onCheckAppUpdate: onCheckAppUpdate,
                hasAppUpdate: hasAppUpdate,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

Future<void> showBoardManagerSheet(
  BuildContext context, {
  required List<BoardData> boards,
  required String activeBoardId,
  required String saveSummary,
  required ValueChanged<String> onSelectBoard,
  required VoidCallback onCreateBoard,
  required ValueChanged<BoardData> onRenameBoard,
  required VoidCallback onDuplicateBoard,
  required VoidCallback onDeleteBoard,
}) async {
  final screenSize = MediaQuery.sizeOf(context);
  await showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    constraints: BoxConstraints(
      maxWidth: 480,
      maxHeight: math.max(240.0, screenSize.height * 0.85),
    ),
    builder: (sheetCtx) {
      final colorScheme = Theme.of(sheetCtx).colorScheme;
      final isCompactHeight = MediaQuery.sizeOf(sheetCtx).height <= 520;
      return Padding(
        padding: EdgeInsets.fromLTRB(
          16,
          isCompactHeight ? 12 : 16,
          16,
          isCompactHeight ? 12 : 16,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'ボード管理',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        saveSummary,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 11.5,
                          color: colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton.tonalIcon(
                  onPressed: () {
                    Navigator.of(sheetCtx).pop();
                    onCreateBoard();
                  },
                  icon: const Icon(Icons.add_rounded, size: 18),
                  label: const Text('新規作成'),
                ),
              ],
            ),
            SizedBox(height: isCompactHeight ? 8 : 12),
            Flexible(
              child: ListView.separated(
                shrinkWrap: true,
                itemCount: boards.length,
                separatorBuilder: (context, index) => const SizedBox(height: 6),
                itemBuilder: (ctx, index) {
                  final board = boards[index];
                  final isActive = board.id == activeBoardId;
                  return Material(
                    color: isActive
                        ? colorScheme.primaryContainer
                        : colorScheme.surfaceContainerLow,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                      side: BorderSide(
                        color: isActive
                            ? colorScheme.primary
                            : colorScheme.outlineVariant,
                      ),
                    ),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(14),
                      onTap: () {
                        if (!isActive) {
                          onSelectBoard(board.id);
                        }
                        Navigator.of(sheetCtx).pop();
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        child: Row(
                          children: [
                            Icon(
                              isActive
                                  ? Icons.dashboard_rounded
                                  : Icons.dashboard_outlined,
                              size: 18,
                              color: isActive
                                  ? colorScheme.onPrimaryContainer
                                  : colorScheme.onSurfaceVariant,
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    board.title,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontSize: 13.5,
                                      fontWeight: FontWeight.w600,
                                      color: isActive
                                          ? colorScheme.onPrimaryContainer
                                          : colorScheme.onSurface,
                                    ),
                                  ),
                                  Text(
                                    '${board.strokes.length} ストローク',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: isActive
                                          ? colorScheme.onPrimaryContainer
                                              .withValues(alpha: 0.78)
                                          : colorScheme.onSurfaceVariant,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            _SheetActionIconButton(
                              icon: Icons.edit_outlined,
                              tooltip: 'ボード名を変更',
                              color: isActive
                                  ? colorScheme.onPrimaryContainer
                                  : colorScheme.onSurfaceVariant,
                              onPressed: () {
                                Navigator.of(sheetCtx).pop();
                                onRenameBoard(board);
                              },
                            ),
                            _SheetActionIconButton(
                              icon: Icons.content_copy_rounded,
                              tooltip: 'ボードを複製',
                              color: isActive
                                  ? colorScheme.onPrimaryContainer
                                  : colorScheme.onSurfaceVariant,
                              onPressed: () {
                                if (!isActive) {
                                  onSelectBoard(board.id);
                                }
                                Navigator.of(sheetCtx).pop();
                                onDuplicateBoard();
                              },
                            ),
                            _SheetActionIconButton(
                              icon: Icons.delete_outline_rounded,
                              tooltip: boards.length > 1
                                  ? 'ボードを削除'
                                  : 'ボードをリセット',
                              color: isActive
                                  ? colorScheme.onPrimaryContainer
                                  : colorScheme.onSurfaceVariant,
                              onPressed: () {
                                if (!isActive) {
                                  onSelectBoard(board.id);
                                }
                                Navigator.of(sheetCtx).pop();
                                onDeleteBoard();
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      );
    },
  );
}

Future<void> showMobileMoreMenuSheet(
  BuildContext context, {
  required bool isDark,
  required String saveSummary,
  required VoidCallback onExportPng,
  required VoidCallback onToggleTheme,
  required VoidCallback onOpenSeedPicker,
  required VoidCallback onOpenBackupMenu,
  VoidCallback? onDownloadApk,
  VoidCallback? onCheckAppUpdate,
  bool hasAppUpdate = false,
}) async {
  final screenSize = MediaQuery.sizeOf(context);
  await showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    constraints: BoxConstraints(
      maxWidth: 440,
      maxHeight: math.max(240.0, screenSize.height * 0.85),
    ),
    builder: (sheetCtx) {
      final colorScheme = Theme.of(sheetCtx).colorScheme;
      final isCompactHeight = MediaQuery.sizeOf(sheetCtx).height <= 520;
      return SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.fromLTRB(
            12,
            isCompactHeight ? 10 : 14,
            12,
            isCompactHeight ? 10 : 16,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: colorScheme.surfaceContainerLow,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: colorScheme.outlineVariant),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.cloud_done_outlined,
                      size: 16,
                      color: colorScheme.primary,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        saveSummary,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 6),
              _MenuActionTile(
                icon: Icons.download_rounded,
                title: 'PNG画像として保存',
                compact: isCompactHeight,
                onTap: () {
                  Navigator.of(sheetCtx).pop();
                  onExportPng();
                },
              ),
              _MenuActionTile(
                icon: isDark
                    ? Icons.light_mode_outlined
                    : Icons.dark_mode_outlined,
                title: isDark ? 'ライトテーマに切り替え' : 'ダークテーマに切り替え',
                compact: isCompactHeight,
                onTap: () {
                  Navigator.of(sheetCtx).pop();
                  onToggleTheme();
                },
              ),
              _MenuActionTile(
                icon: Icons.palette_outlined,
                title: 'UIテーマカラー (M3 Expressive)',
                compact: isCompactHeight,
                onTap: () {
                  Navigator.of(sheetCtx).pop();
                  onOpenSeedPicker();
                },
              ),
              _MenuActionTile(
                icon: Icons.folder_copy_outlined,
                title: 'バックアップと復元 (JSON)',
                compact: isCompactHeight,
                onTap: () {
                  Navigator.of(sheetCtx).pop();
                  onOpenBackupMenu();
                },
              ),
              if (onDownloadApk != null)
                _MenuActionTile(
                  icon: Icons.android_rounded,
                  title: 'Androidアプリ (.apk) をダウンロード',
                  compact: isCompactHeight,
                  onTap: () {
                    Navigator.of(sheetCtx).pop();
                    onDownloadApk();
                  },
                ),
              if (onCheckAppUpdate != null)
                _MenuActionTile(
                  icon: Icons.system_update_rounded,
                  title: hasAppUpdate
                      ? '新しいアップデートが利用可能です'
                      : 'アプリのアップデートを確認',
                  badgeText: hasAppUpdate ? 'NEW' : null,
                  compact: isCompactHeight,
                  onTap: () {
                    Navigator.of(sheetCtx).pop();
                    onCheckAppUpdate();
                  },
                ),
            ],
          ),
        ),
      );
    },
  );
}

class _BoardSelectorPill extends StatelessWidget {
  const _BoardSelectorPill({
    required this.title,
    required this.boardCount,
    required this.compact,
    required this.onTap,
  });

  final String title;
  final int boardCount;
  final bool compact;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Tooltip(
      message: 'ボードを切り替え・管理',
      child: Material(
        color: compact
            ? Colors.transparent
            : colorScheme.surfaceContainerHigh,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: compact
              ? BorderSide.none
              : BorderSide(color: colorScheme.outlineVariant),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: onTap,
          child: SizedBox(
            height: compact ? 32 : 36,
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: compact ? 8 : 12),
              child: Row(
                mainAxisSize: compact ? MainAxisSize.min : MainAxisSize.max,
                children: [
                  Icon(
                    Icons.dashboard_rounded,
                    size: 16,
                    color: colorScheme.primary,
                  ),
                  const SizedBox(width: 7),
                  Flexible(
                    child: Text(
                      title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: compact ? 12.5 : 13,
                        fontWeight: FontWeight.w600,
                        color: colorScheme.onSurface,
                      ),
                    ),
                  ),
                  if (boardCount > 1) ...[
                    const SizedBox(width: 5),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 5,
                        vertical: 1,
                      ),
                      decoration: BoxDecoration(
                        color: colorScheme.primaryContainer,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '$boardCount',
                        style: TextStyle(
                          fontSize: 10.5,
                          fontWeight: FontWeight.w700,
                          color: colorScheme.onPrimaryContainer,
                        ),
                      ),
                    ),
                  ],
                  const SizedBox(width: 3),
                  Icon(
                    Icons.keyboard_arrow_down_rounded,
                    size: 18,
                    color: colorScheme.onSurfaceVariant,
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

class _SheetActionIconButton extends StatelessWidget {
  const _SheetActionIconButton({
    required this.icon,
    required this.tooltip,
    required this.color,
    required this.onPressed,
  });

  final IconData icon;
  final String tooltip;
  final Color color;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: tooltip,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onPressed,
        child: SizedBox(
          width: 32,
          height: 32,
          child: Icon(icon, size: 18, color: color),
        ),
      ),
    );
  }
}

class _MenuActionTile extends StatelessWidget {
  const _MenuActionTile({
    required this.icon,
    required this.title,
    required this.compact,
    required this.onTap,
    this.badgeText,
  });

  final IconData icon;
  final String title;
  final bool compact;
  final VoidCallback onTap;
  final String? badgeText;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return ListTile(
      dense: compact,
      visualDensity: compact ? VisualDensity.compact : VisualDensity.standard,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      leading: Icon(icon, size: 20, color: colorScheme.onSurfaceVariant),
      title: Text(
        title,
        style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600),
      ),
      trailing: badgeText != null
          ? Container(
              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
              decoration: BoxDecoration(
                color: colorScheme.primary,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                badgeText!,
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w700,
                  color: colorScheme.onPrimary,
                ),
              ),
            )
          : null,
      onTap: onTap,
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
      message: 'ホワイトボード',
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
    required this.onTap,
    required this.onDoubleTap,
  });

  final BoardData board;
  final bool isActive;
  final VoidCallback onTap;
  final VoidCallback onDoubleTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final radius = isActive ? 12.0 : 20.0;

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
              height: 40,
              padding: const EdgeInsets.symmetric(horizontal: 16),
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
                      fontSize: 13.5,
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
  });

  final IconData icon;
  final String tooltip;
  final VoidCallback onPressed;
  final bool isTonal;
  final bool isDangerHover;

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
            width: 36,
            height: 36,
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
    this.iconSize = 20,
    this.showBadge = false,
    this.transparent = false,
  });

  final IconData icon;
  final String tooltip;
  final double size;
  final VoidCallback onPressed;
  final double iconSize;
  final bool showBadge;
  final bool transparent;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Tooltip(
      message: tooltip,
      child: Material(
        color: transparent ? Colors.transparent : colorScheme.surfaceContainerLow,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(size / 2),
          side: transparent
              ? BorderSide.none
              : BorderSide(color: colorScheme.outlineVariant),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(size / 2),
          onTap: onPressed,
          child: SizedBox(
            width: size,
            height: size,
            child: Stack(
              alignment: Alignment.center,
              children: [
                Icon(
                  icon,
                  size: iconSize,
                  color: colorScheme.onSurfaceVariant,
                ),
                if (showBadge)
                  Positioned(
                    top: 5,
                    right: 5,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: colorScheme.primary,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: colorScheme.surfaceContainerLow,
                          width: 1.5,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
