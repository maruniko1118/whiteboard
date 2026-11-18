import 'dart:math' as math;

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:material_ui/material_ui.dart';

import '../canvas/canvas_gesture_layer.dart';
import '../canvas/whiteboard_controller.dart';
import '../models/whiteboard_models.dart';
import '../services/app_updater.dart';
import '../services/board_storage.dart';
import '../theme/app_theme.dart';
import 'dialogs.dart';
import 'floating_toolbar.dart';
import 'popovers.dart';
import 'responsive_layout.dart';
import 'top_app_bar.dart';
import 'update_dialog.dart';
import 'zoom_hud.dart';

class WhiteboardHome extends StatefulWidget {
  const WhiteboardHome({
    super.key,
    required this.storage,
    required this.onThemeChanged,
    this.showApkDownload = kIsWeb,
    this.appUpdater,
  });

  static const String apkDownloadUrl =
      'https://github.com/maruniko1118/whiteboard/releases/latest/download/whiteboard.apk';
  static const String releasesPageUrl =
      'https://github.com/maruniko1118/whiteboard/releases';

  final BoardStorage storage;
  final void Function(String theme, String seedColor) onThemeChanged;
  final bool showApkDownload;
  final AppUpdater? appUpdater;

  @override
  State<WhiteboardHome> createState() => _WhiteboardHomeState();
}

class _WhiteboardHomeState extends State<WhiteboardHome> {
  late final WhiteboardController _canvasController;
  late final AppUpdater _appUpdater;
  final ScrollController _tabScrollController = ScrollController();
  final GlobalKey _canvasKey = GlobalKey();
  late final AppLifecycleListener _lifecycleListener;

  String _customHex = '#6750A4';
  bool _hasShownAutoUpdatePrompt = false;
  bool _isFocusMode = false;

  @override
  void initState() {
    super.initState();
    _appUpdater = widget.appUpdater ?? createAppUpdater();
    _canvasController = WhiteboardController(
      onDrawStart: () => widget.storage.clearPendingSaveTimers(),
      onStateChange: ({required bool isBoardLoad}) {
        if (!isBoardLoad) {
          widget.storage.updateActiveBoardStrokes(
            _canvasController.strokes,
            _canvasController.undoStack,
            _canvasController.redoStack,
          );
        }
        if (mounted) setState(() {});
      },
    );

    _lifecycleListener = AppLifecycleListener(
      onHide: () => widget.storage.flushSave(),
      onPause: () => widget.storage.flushSave(),
      onDetach: () => widget.storage.flushSave(),
    );

    final activeBoard = widget.storage.getActiveBoard();
    _canvasController.loadBoard(activeBoard);

    if (_appUpdater.isSupported) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _checkForUpdatesOnStartup();
      });
    }
  }

  @override
  void dispose() {
    _lifecycleListener.dispose();
    _tabScrollController.dispose();
    _canvasController.dispose();
    super.dispose();
  }

  bool get _isDark => widget.storage.state.theme == 'dark';

  void _toggleFocusMode() {
    setState(() => _isFocusMode = !_isFocusMode);
  }

  void _showToast(String message) {
    if (!mounted) return;
    final messenger = ScaffoldMessenger.maybeOf(context);
    if (messenger == null) return;
    messenger.clearSnackBars();
    messenger.showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
        ),
        duration: const Duration(milliseconds: 2200),
      ),
    );
  }

  void _toggleTheme() {
    final nextTheme = _isDark ? 'light' : 'dark';
    widget.storage.setTheme(nextTheme);
    _canvasController.invalidateCommittedCache();
    widget.onThemeChanged(nextTheme, widget.storage.state.seedColor);
    setState(() {});
    _showToast(
      nextTheme == 'dark' ? 'ダークテーマに切り替えました' : 'ライトテーマに切り替えました',
    );
  }

  void _setSeedColor(String hex) {
    widget.storage.setSeedColor(hex);
    widget.onThemeChanged(widget.storage.state.theme, hex);
    setState(() {});
    _showToast('M3 Expressive テーマカラーを更新しました');
  }

  void _switchBoard(String boardId) {
    final board = widget.storage.switchBoard(boardId);
    if (board != null) {
      _canvasController.loadBoard(board);
      setState(() {});
    }
  }

  void _createBoard() {
    final newBoard = widget.storage.createBoard();
    _canvasController.loadBoard(newBoard);
    setState(() {});
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_tabScrollController.hasClients) {
        _tabScrollController.animateTo(
          _tabScrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
    _showToast('「${newBoard.title}」を作成しました');
  }

  Future<void> _renameBoard(BoardData board) async {
    final nextTitle = await showRenameBoardDialog(
      context,
      currentTitle: board.title,
    );
    if (nextTitle != null && nextTitle.isNotEmpty && nextTitle != board.title) {
      widget.storage.renameBoard(board.id, nextTitle);
      setState(() {});
      _showToast('ボード名を「$nextTitle」に変更しました');
    }
  }

  void _duplicateActiveBoard() {
    final active = widget.storage.getActiveBoard();
    final copy = widget.storage.duplicateBoard(active.id);
    if (copy != null) {
      _canvasController.loadBoard(copy);
      setState(() {});
      _showToast('「${copy.title}」を複製しました');
    }
  }

  Future<void> _deleteActiveBoard() async {
    final boards = widget.storage.state.boards;
    final active = widget.storage.getActiveBoard();
    final isLast = boards.length <= 1;
    final confirmed = await showConfirmActionDialog(
      context,
      title: isLast ? 'ボードのリセット' : 'ボードの削除',
      message: isLast
          ? '「${active.title}」の描画内容をすべてクリアしますか？'
          : 'ボード「${active.title}」を削除しますか？',
      confirmLabel: isLast ? 'リセットする' : '削除する',
    );
    if (!confirmed) return;

    final res = widget.storage.deleteBoard(active.id);
    if (res.activeBoard != null) {
      _canvasController.loadBoard(res.activeBoard!);
    }
    setState(() {});
    _showToast(
      res.deleted ? '「${active.title}」を削除しました' : 'ボードをリセットしました',
    );
  }

  Future<void> _clearCanvas() async {
    final confirmed = await showConfirmActionDialog(
      context,
      title: 'ボードの全消去',
      message: '現在のボードの描画内容をすべて消去しますか？',
      confirmLabel: 'すべて消去',
    );
    if (!confirmed) return;
    _canvasController.clear();
    _showToast('ボードを消去しました');
  }

  Future<void> _exportPng() async {
    final renderBox =
        _canvasKey.currentContext?.findRenderObject() as RenderBox?;
    final size = renderBox?.size ?? MediaQuery.sizeOf(context);
    final brightness = Theme.of(context).brightness;
    final dpr = MediaQuery.devicePixelRatioOf(context);

    final bytes = await _canvasController.exportAsPng(
      logicalSize: size,
      brightness: brightness,
      pixelRatio: dpr.clamp(1.0, 3.0),
    );
    if (bytes == null) {
      _showToast('画像の保存に失敗しました');
      return;
    }
    final active = widget.storage.getActiveBoard();
    await widget.storage.exportPngBytes(bytes, active.title);
    _showToast('透過PNG画像をダウンロードしました');
  }

  Future<void> _exportJson() async {
    await widget.storage.exportJson();
    _showToast('全ボードのJSONバックアップを保存しました');
  }

  Future<void> _importJson() async {
    final ok = await widget.storage.pickAndImportJson();
    if (ok == null) return;
    if (ok) {
      _canvasController.loadBoard(widget.storage.getActiveBoard());
      widget.onThemeChanged(
        widget.storage.state.theme,
        widget.storage.state.seedColor,
      );
      setState(() {});
      _showToast('バックアップからボードを復元しました');
    } else {
      _showToast('無効なバックアップファイルです');
    }
  }

  Future<void> _openApkDownloadDialog() async {
    await showApkDownloadDialog(
      context,
      onDownloadLatestApk: () {
        widget.storage.openExternalUrl(WhiteboardHome.apkDownloadUrl);
        _showToast('Android APK のダウンロードページを開きました');
      },
      onOpenReleasesPage: () {
        widget.storage.openExternalUrl(WhiteboardHome.releasesPageUrl);
      },
    );
  }

  Future<void> _checkForUpdatesOnStartup() async {
    final result = await _appUpdater.checkForUpdate();
    if (!mounted) return;
    if (result.hasUpdate &&
        result.latestRelease != null &&
        !_hasShownAutoUpdatePrompt) {
      _hasShownAutoUpdatePrompt = true;
      await showAppUpdateDialog(
        context,
        updater: _appUpdater,
        initialResult: result,
      );
    }
  }

  Future<void> _openAppUpdateDialog() async {
    final cached = _appUpdater.latestCheckResult.value;
    await showAppUpdateDialog(
      context,
      updater: _appUpdater,
      initialResult: (cached != null && cached.hasUpdate) ? cached : null,
    );
  }

  Size _canvasViewportSize() {
    final box = _canvasKey.currentContext?.findRenderObject() as RenderBox?;
    return box?.size ?? MediaQuery.sizeOf(context);
  }

  KeyEventResult _handleKeyEvent(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;

    // Ignore shortcuts when a text field or modal dialog has focus
    final primary = FocusManager.instance.primaryFocus;
    if (primary?.context?.widget is EditableText) {
      return KeyEventResult.ignored;
    }
    if (ModalRoute.of(context)?.isCurrent == false) {
      return KeyEventResult.ignored;
    }

    final keys = HardwareKeyboard.instance.logicalKeysPressed;
    final isCtrlOrMeta = keys.contains(LogicalKeyboardKey.controlLeft) ||
        keys.contains(LogicalKeyboardKey.controlRight) ||
        keys.contains(LogicalKeyboardKey.metaLeft) ||
        keys.contains(LogicalKeyboardKey.metaRight);
    final isShift = keys.contains(LogicalKeyboardKey.shiftLeft) ||
        keys.contains(LogicalKeyboardKey.shiftRight);

    final key = event.logicalKey;

    if (isCtrlOrMeta) {
      if (key == LogicalKeyboardKey.keyZ) {
        if (isShift) {
          _canvasController.redo();
        } else {
          _canvasController.undo();
        }
        return KeyEventResult.handled;
      }
      if (key == LogicalKeyboardKey.keyY) {
        _canvasController.redo();
        return KeyEventResult.handled;
      }
      if (key == LogicalKeyboardKey.equal ||
          key == LogicalKeyboardKey.add ||
          key == LogicalKeyboardKey.numpadAdd) {
        _canvasController.zoomAt(1.25, null, _canvasViewportSize());
        return KeyEventResult.handled;
      }
      if (key == LogicalKeyboardKey.minus ||
          key == LogicalKeyboardKey.numpadSubtract) {
        _canvasController.zoomAt(0.8, null, _canvasViewportSize());
        return KeyEventResult.handled;
      }
      if (key == LogicalKeyboardKey.digit0 ||
          key == LogicalKeyboardKey.numpad0) {
        _canvasController.resetViewport();
        return KeyEventResult.handled;
      }
      return KeyEventResult.ignored;
    }

    final colorKeys = {
      LogicalKeyboardKey.digit1: 'black',
      LogicalKeyboardKey.digit2: 'red',
      LogicalKeyboardKey.digit3: 'orange',
      LogicalKeyboardKey.digit4: 'yellow',
      LogicalKeyboardKey.digit5: 'green',
      LogicalKeyboardKey.digit6: 'blue',
      LogicalKeyboardKey.digit7: 'purple',
    };

    if (colorKeys.containsKey(key)) {
      _canvasController.setPresetColor(colorKeys[key]!);
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.keyP) {
      _canvasController.setTool(ToolType.pen);
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.keyE) {
      _canvasController.setTool(ToolType.eraser);
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.keyT) {
      _toggleTheme();
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.bracketLeft) {
      _canvasController.setWidth(_canvasController.currentWidth - 2);
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.bracketRight) {
      _canvasController.setWidth(_canvasController.currentWidth + 2);
      return KeyEventResult.handled;
    }

    return KeyEventResult.ignored;
  }

  void _openSeedPicker() {
    showSeedPickerDialog(
      context,
      currentSeedHex: widget.storage.state.seedColor,
      onSelectSeed: _setSeedColor,
    );
  }

  void _openBackupMenu() {
    showBackupMenuDialog(
      context,
      onExportJson: _exportJson,
      onImportJson: _importJson,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final layout = WhiteboardLayout.of(context);
    final showFullTopBar = !_isFocusMode && !layout.isMobileLandscape;

    return Focus(
      autofocus: true,
      onKeyEvent: _handleKeyEvent,
      child: Scaffold(
        body: Column(
          children: [
            if (showFullTopBar)
              ColoredBox(
                color: colorScheme.surfaceContainer,
                child: SafeArea(
                  bottom: false,
                  child: ValueListenableBuilder<DateTime?>(
                    valueListenable: widget.storage.lastSavedAt,
                    builder: (context, savedAt, _) {
                      return ValueListenableBuilder<UpdateCheckResult?>(
                        valueListenable: _appUpdater.latestCheckResult,
                        builder: (context, updateResult, _) {
                          return WhiteboardTopAppBar(
                            boards: widget.storage.state.boards,
                            activeBoardId: widget.storage.state.activeBoardId,
                            isDark: _isDark,
                            lastSavedAt: savedAt,
                            tabScrollController: _tabScrollController,
                            onSelectBoard: _switchBoard,
                            onRenameBoard: _renameBoard,
                            onCreateBoard: _createBoard,
                            onDuplicateBoard: _duplicateActiveBoard,
                            onDeleteBoard: _deleteActiveBoard,
                            onOpenSeedPicker: _openSeedPicker,
                            onOpenBackupMenu: _openBackupMenu,
                            onExportPng: _exportPng,
                            onToggleTheme: _toggleTheme,
                            onToggleFocusMode: _toggleFocusMode,
                            onDownloadApk: widget.showApkDownload
                                ? _openApkDownloadDialog
                                : null,
                            onCheckAppUpdate: _appUpdater.isSupported
                                ? _openAppUpdateDialog
                                : null,
                            hasAppUpdate: updateResult?.hasUpdate ?? false,
                          );
                        },
                      );
                    },
                  ),
                ),
              ),
            Expanded(
              child: Stack(
                children: [
                  // Main Drawing Canvas
                  Positioned.fill(
                    key: _canvasKey,
                    child: CanvasGestureLayer(
                      controller: _canvasController,
                      backgroundColor: colorScheme.surfaceContainerLowest,
                      brightness: theme.brightness,
                    ),
                  ),
                  if (!_isFocusMode && layout.isMobileLandscape)
                    Positioned(
                      top: math.max(8.0, layout.padding.top + 4),
                      left: math.max(8.0, layout.padding.left + 8),
                      child: ValueListenableBuilder<DateTime?>(
                        valueListenable: widget.storage.lastSavedAt,
                        builder: (context, savedAt, _) {
                          return ValueListenableBuilder<UpdateCheckResult?>(
                            valueListenable: _appUpdater.latestCheckResult,
                            builder: (context, updateResult, _) {
                              return WhiteboardLandscapeHeaderPill(
                                boards: widget.storage.state.boards,
                                activeBoardId:
                                    widget.storage.state.activeBoardId,
                                isDark: _isDark,
                                lastSavedAt: savedAt,
                                onSelectBoard: _switchBoard,
                                onRenameBoard: _renameBoard,
                                onCreateBoard: _createBoard,
                                onDuplicateBoard: _duplicateActiveBoard,
                                onDeleteBoard: _deleteActiveBoard,
                                onOpenSeedPicker: _openSeedPicker,
                                onOpenBackupMenu: _openBackupMenu,
                                onExportPng: _exportPng,
                                onToggleTheme: _toggleTheme,
                                onToggleFocusMode: _toggleFocusMode,
                                onDownloadApk: widget.showApkDownload
                                    ? _openApkDownloadDialog
                                    : null,
                                onCheckAppUpdate: _appUpdater.isSupported
                                    ? _openAppUpdateDialog
                                    : null,
                                hasAppUpdate: updateResult?.hasUpdate ?? false,
                              );
                            },
                          );
                        },
                      ),
                    ),
                  if (!_isFocusMode) ...[
                    // Zoom & Pan HUD
                    ListenableBuilder(
                      listenable: _canvasController,
                      builder: (context, _) {
                        return Positioned(
                          top: layout.isMobileLandscape
                              ? math.max(8.0, layout.padding.top + 4)
                              : (layout.isMobilePortrait ? 8.0 : null),
                          right: layout.isMobile
                              ? math.max(8.0, layout.padding.right + 8)
                              : (layout.isNarrowDesktop ? 12.0 : 16.0),
                          bottom: layout.isMobile
                              ? null
                              : (layout.isNarrowDesktop ? 84.0 : 18.0),
                          child: ZoomHud(
                            scale: _canvasController.scale,
                            onZoomOut: () => _canvasController.zoomAt(
                              0.8,
                              null,
                              _canvasViewportSize(),
                            ),
                            onReset: () {
                              _canvasController.resetViewport();
                              _showToast('表示倍率・位置をリセットしました (100%)');
                            },
                            onZoomIn: () => _canvasController.zoomAt(
                              1.25,
                              null,
                              _canvasViewportSize(),
                            ),
                          ),
                        );
                      },
                    ),
                    // Floating Toolbar Dock
                    Positioned(
                      left: math.max(8.0, layout.padding.left + 8),
                      right: math.max(8.0, layout.padding.right + 8),
                      bottom: layout.isDesktop
                          ? 16.0
                          : (layout.isMobileLandscape
                              ? math.max(6.0, layout.padding.bottom)
                              : math.max(10.0, layout.padding.bottom + 8)),
                      child: Center(
                        child: ListenableBuilder(
                          listenable: _canvasController,
                          builder: (context, _) {
                            return FloatingToolbar(
                              currentTool: _canvasController.currentTool,
                              currentColorKey:
                                  _canvasController.currentColorKey,
                              customHex: _customHex,
                              currentWidth: _canvasController.currentWidth,
                              isDark: _isDark,
                              canUndo: _canvasController.canUndo,
                              canRedo: _canvasController.canRedo,
                              onSelectTool: _canvasController.setTool,
                              onSelectPresetColor:
                                  _canvasController.setPresetColor,
                              onOpenCustomColorPicker: () =>
                                  showColorStudioDialog(
                                context,
                                initialHex: _customHex,
                                savedColors:
                                    widget.storage.state.customColors,
                                onSaveCustomColor: (hex) {
                                  widget.storage.addCustomColor(hex);
                                  setState(() {});
                                  _showToast('マイカラー ($hex) を保存しました');
                                },
                                onApplyCustomColor: (hex) {
                                  _customHex = hex;
                                  _canvasController.setCustomColor(hex);
                                  _showToast('カラー $hex を選択しました');
                                },
                              ),
                              onSelectWidth: _canvasController.setWidth,
                              onOpenWidthPopover: () => showWidthSliderDialog(
                                context,
                                initialWidth: _canvasController.currentWidth,
                                onChanged: _canvasController.setWidth,
                              ),
                              onUndo: _canvasController.undo,
                              onRedo: _canvasController.redo,
                              onClear: _clearCanvas,
                            );
                          },
                        ),
                      ),
                    ),
                  ],
                  if (_isFocusMode)
                    Positioned(
                      right: math.max(10.0, layout.padding.right + 8),
                      bottom: math.max(10.0, layout.padding.bottom + 6),
                      child: ListenableBuilder(
                        listenable: _canvasController,
                        builder: (context, _) {
                          final inkColor = AppTheme.resolveStrokeColor(
                            Stroke(
                              id: 'preview',
                              tool: ToolType.pen,
                              colorKey: _canvasController.currentColorKey,
                              customColor: _customHex,
                              width: 1,
                              points: const [],
                            ),
                            theme.brightness,
                          );
                          return _FocusModePill(
                            currentTool: _canvasController.currentTool,
                            inkColor: inkColor,
                            canUndo: _canvasController.canUndo,
                            onUndo: _canvasController.undo,
                            onToggleTool: () => _canvasController.setTool(
                              _canvasController.currentTool == ToolType.pen
                                  ? ToolType.eraser
                                  : ToolType.pen,
                            ),
                            onExitFocusMode: _toggleFocusMode,
                          );
                        },
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FocusModePill extends StatelessWidget {
  const _FocusModePill({
    required this.currentTool,
    required this.inkColor,
    required this.canUndo,
    required this.onUndo,
    required this.onToggleTool,
    required this.onExitFocusMode,
  });

  final ToolType currentTool;
  final Color inkColor;
  final bool canUndo;
  final VoidCallback onUndo;
  final VoidCallback onToggleTool;
  final VoidCallback onExitFocusMode;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final isLightInk = inkColor.computeLuminance() > 0.7;

    return Material(
      elevation: 6,
      shadowColor: Colors.black.withValues(alpha: 0.25),
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
            Tooltip(
              message: '元に戻す',
              child: InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: canUndo ? onUndo : null,
                child: SizedBox(
                  width: 34,
                  height: 34,
                  child: Icon(
                    Icons.undo_rounded,
                    size: 18,
                    color: canUndo
                        ? colorScheme.onSurfaceVariant
                        : colorScheme.onSurfaceVariant.withValues(alpha: 0.35),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 2),
            Tooltip(
              message: currentTool == ToolType.pen
                  ? '消しゴムに切り替え'
                  : 'ペンに切り替え',
              child: InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: onToggleTool,
                child: SizedBox(
                  width: 34,
                  height: 34,
                  child: Center(
                    child: currentTool == ToolType.pen
                        ? Container(
                            width: 18,
                            height: 18,
                            decoration: BoxDecoration(
                              color: inkColor,
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: isLightInk
                                    ? colorScheme.outline
                                    : Colors.white.withValues(alpha: 0.4),
                                width: 1.5,
                              ),
                            ),
                          )
                        : EraserIcon(
                            color: colorScheme.primary,
                            size: 18,
                            filled: true,
                          ),
                  ),
                ),
              ),
            ),
            Container(
              width: 1,
              height: 18,
              margin: const EdgeInsets.symmetric(horizontal: 3),
              color: colorScheme.outlineVariant,
            ),
            Tooltip(
              message: 'ツールバーを表示',
              child: InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: onExitFocusMode,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 7,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.fullscreen_exit_rounded,
                        size: 18,
                        color: colorScheme.primary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'UI表示',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: colorScheme.primary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
