import 'package:flutter/services.dart';
import 'package:material_ui/material_ui.dart';

import '../canvas/canvas_gesture_layer.dart';
import '../canvas/whiteboard_controller.dart';
import '../models/whiteboard_models.dart';
import '../services/board_storage.dart';
import 'dialogs.dart';
import 'floating_toolbar.dart';
import 'popovers.dart';
import 'top_app_bar.dart';
import 'zoom_hud.dart';

class WhiteboardHome extends StatefulWidget {
  const WhiteboardHome({
    super.key,
    required this.storage,
    required this.onThemeChanged,
  });

  final BoardStorage storage;
  final void Function(String theme, String seedColor) onThemeChanged;

  @override
  State<WhiteboardHome> createState() => _WhiteboardHomeState();
}

class _WhiteboardHomeState extends State<WhiteboardHome> {
  late final WhiteboardController _canvasController;
  final ScrollController _tabScrollController = ScrollController();
  final GlobalKey _canvasKey = GlobalKey();
  late final AppLifecycleListener _lifecycleListener;

  String _customHex = '#6750A4';

  @override
  void initState() {
    super.initState();
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
  }

  @override
  void dispose() {
    _lifecycleListener.dispose();
    _tabScrollController.dispose();
    _canvasController.dispose();
    super.dispose();
  }

  bool get _isDark => widget.storage.state.theme == 'dark';

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
    final colorScheme = Theme.of(context).colorScheme;
    final brightness = Theme.of(context).brightness;
    final dpr = MediaQuery.devicePixelRatioOf(context);

    final bytes = await _canvasController.exportAsPng(
      logicalSize: size,
      backgroundColor: colorScheme.surfaceContainerLowest,
      brightness: brightness,
      pixelRatio: dpr.clamp(1.0, 3.0),
    );
    if (bytes == null) {
      _showToast('画像の保存に失敗しました');
      return;
    }
    final active = widget.storage.getActiveBoard();
    await widget.storage.exportPngBytes(bytes, active.title);
    _showToast('PNG画像をダウンロードしました');
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

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final screenWidth = MediaQuery.sizeOf(context).width;
    final isMobile = screenWidth <= 768;
    final isNarrowDesktop = screenWidth <= 1120;

    return Focus(
      autofocus: true,
      onKeyEvent: _handleKeyEvent,
      child: Scaffold(
        body: SafeArea(
          bottom: false,
          child: Column(
            children: [
              ValueListenableBuilder<DateTime?>(
                valueListenable: widget.storage.lastSavedAt,
                builder: (context, savedAt, _) {
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
                    onOpenSeedPicker: () => showSeedPickerDialog(
                      context,
                      currentSeedHex: widget.storage.state.seedColor,
                      onSelectSeed: _setSeedColor,
                    ),
                    onOpenBackupMenu: () => showBackupMenuDialog(
                      context,
                      onExportJson: _exportJson,
                      onImportJson: _importJson,
                    ),
                    onExportPng: _exportPng,
                    onToggleTheme: _toggleTheme,
                  );
                },
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
                    // Zoom & Pan HUD
                    ListenableBuilder(
                      listenable: _canvasController,
                      builder: (context, _) {
                        return Positioned(
                          top: isMobile ? 10 : null,
                          right: isMobile ? 10 : (isNarrowDesktop ? 12 : 16),
                          bottom: isMobile
                              ? null
                              : (isNarrowDesktop ? 84 : 18),
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
                      left: 8,
                      right: 8,
                      bottom: isMobile
                          ? MediaQuery.paddingOf(context).bottom + 10
                          : 16,
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
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
