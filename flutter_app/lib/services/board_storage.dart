import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/foundation.dart';

import '../models/whiteboard_models.dart';
import 'storage_backend.dart';

class SaveStatusEvent {
  const SaveStatusEvent({
    required this.isSaved,
    this.timestamp,
    this.error,
  });

  final bool isSaved;
  final DateTime? timestamp;
  final Object? error;
}

class BoardStorage {
  BoardStorage({
    StorageBackend? backend,
    this.isDrawingCheck,
    this.onSaveStatusChange,
  }) : _backend = backend ?? createStorageBackend() {
    final initialBoard = createNewBoardObject('メインボード');
    state = AppStateData(
      activeBoardId: initialBoard.id,
      boards: [initialBoard],
      theme: 'light',
      seedColor: '#6750A4',
      customColors: List<String>.from(AppStateData.defaultCustomColors),
    );
  }

  static const Duration saveDebounceDuration = Duration(milliseconds: 600);

  final StorageBackend _backend;
  final bool Function()? isDrawingCheck;
  final void Function(SaveStatusEvent event)? onSaveStatusChange;

  late AppStateData state;
  final ValueNotifier<DateTime?> lastSavedAt = ValueNotifier<DateTime?>(null);
  bool _useLocalStorageFallback = false;
  Timer? _debounceTimer;
  final Set<String> _dirtyBoardIds = <String>{};
  final Set<String> _deletedBoardIds = <String>{};
  bool _dirtyMeta = false;
  bool _isFlushing = false;
  bool _pendingFlush = false;
  final Random _random = Random();

  Future<AppStateData> init() async {
    final prefs = await _backend.readPrefs();
    final prefTheme = prefs['theme'] == 'dark' ? 'dark' : 'light';
    final prefSeed = AppStateData.normalizeSeed(prefs['seedColor']);

    try {
      final dbData = await _backend.loadFromDb();
      if (dbData != null) {
        final meta = dbData['meta'] as Map<String, dynamic>;
        final rawBoards = dbData['boards'] as List<Map<String, dynamic>>;
        final boardMap = <String, BoardData>{
          for (final b in rawBoards)
            if (b['id'] is String) b['id'] as String: BoardData.fromJson(b),
        };
        final orderedBoards = <BoardData>[];
        final order = meta['boardOrder'];
        if (order is List) {
          for (final id in order.whereType<String>()) {
            final board = boardMap.remove(id);
            if (board != null) orderedBoards.add(board);
          }
        }
        orderedBoards.addAll(boardMap.values);

        if (orderedBoards.isNotEmpty) {
          final reqActive = meta['activeBoardId'] as String?;
          final activeId = orderedBoards.any((b) => b.id == reqActive)
              ? reqActive!
              : orderedBoards.first.id;
          final rawColors = meta['customColors'];
          final customColors = rawColors is List
              ? rawColors
                  .whereType<String>()
                  .where((c) => AppStateData.hexPattern.hasMatch(c.trim()))
                  .take(12)
                  .toList()
              : List<String>.from(AppStateData.defaultCustomColors);
          state = AppStateData(
            activeBoardId: activeId,
            boards: orderedBoards,
            theme: meta['theme'] == 'dark' ? 'dark' : 'light',
            seedColor: AppStateData.normalizeSeed(meta['seedColor'] as String?),
            customColors: customColors,
          );
          await _savePrefs();
          return state;
        }
      }

      // Migrate legacy localStorage data if present, or persist initial board
      final legacy = _loadFromLegacyOrDefault(prefTheme, prefSeed);
      state = legacy;
      try {
        await _backend.saveAllToDb(
          meta: _buildMetaObject(),
          boards: state.boards.map((b) => b.toJson()).toList(),
        );
        _backend.removeLegacyLocalStorage();
      } catch (_) {
        _useLocalStorageFallback = true;
      }
    } catch (_) {
      _useLocalStorageFallback = true;
      state = _loadFromLegacyOrDefault(prefTheme, prefSeed);
    }

    await _savePrefs();
    return state;
  }

  AppStateData _loadFromLegacyOrDefault(String prefTheme, String prefSeed) {
    final raw = _backend.readLegacyLocalStorage();
    if (raw != null && raw.isNotEmpty) {
      try {
        final decoded = jsonDecode(raw);
        if (decoded is Map<String, dynamic>) {
          final parsed = AppStateData.tryFromBackupJson(decoded);
          if (parsed != null) return parsed;
        }
      } catch (_) {}
    }
    final defaultBoard = createNewBoardObject('メインボード');
    return AppStateData(
      activeBoardId: defaultBoard.id,
      boards: [defaultBoard],
      theme: prefTheme,
      seedColor: prefSeed,
      customColors: List<String>.from(AppStateData.defaultCustomColors),
    );
  }

  Future<void> _savePrefs() {
    return _backend.writePrefs(
      theme: state.theme,
      seedColor: state.seedColor,
    );
  }

  Map<String, dynamic> _buildMetaObject() {
    return {
      'activeBoardId': state.activeBoardId,
      'boardOrder': state.boards.map((b) => b.id).toList(),
      'theme': state.theme,
      'seedColor': state.seedColor,
      'customColors': state.customColors,
    };
  }

  void clearPendingSaveTimers() {
    _debounceTimer?.cancel();
    _debounceTimer = null;
  }

  void scheduleSave() {
    clearPendingSaveTimers();
    _debounceTimer = Timer(saveDebounceDuration, () {
      _debounceTimer = null;
      if (isDrawingCheck?.call() ?? false) {
        scheduleSave();
        return;
      }
      flushSave();
    });
  }

  Future<void> flushSave() async {
    clearPendingSaveTimers();
    if (!_dirtyMeta && _dirtyBoardIds.isEmpty && _deletedBoardIds.isEmpty) {
      return;
    }

    if (_useLocalStorageFallback) {
      try {
        _backend.writeLegacyLocalStorage(jsonEncode(state.toJson()));
        _dirtyMeta = false;
        _dirtyBoardIds.clear();
        _deletedBoardIds.clear();
        final now = DateTime.now();
        lastSavedAt.value = now;
        onSaveStatusChange?.call(
          SaveStatusEvent(isSaved: true, timestamp: now),
        );
      } catch (e) {
        onSaveStatusChange?.call(SaveStatusEvent(isSaved: false, error: e));
      }
      return;
    }

    if (_isFlushing) {
      _pendingFlush = true;
      return;
    }

    final writeMeta = _dirtyMeta;
    final boardIdsToWrite = _dirtyBoardIds.toList();
    final boardIdsToDelete = _deletedBoardIds.toList();

    _dirtyMeta = false;
    _dirtyBoardIds.clear();
    _deletedBoardIds.clear();
    _isFlushing = true;

    try {
      final boardsToWrite = <Map<String, dynamic>>[];
      for (final id in boardIdsToWrite) {
        final board = state.boards.where((b) => b.id == id).firstOrNull;
        if (board != null) {
          boardsToWrite.add(board.toJson());
        }
      }
      await _backend.flushDbChanges(
        meta: writeMeta ? _buildMetaObject() : null,
        boardsToWrite: boardsToWrite,
        boardIdsToDelete: boardIdsToDelete,
      );
      _isFlushing = false;
      final now = DateTime.now();
      lastSavedAt.value = now;
      onSaveStatusChange?.call(
        SaveStatusEvent(isSaved: true, timestamp: now),
      );
    } catch (e) {
      _isFlushing = false;
      onSaveStatusChange?.call(SaveStatusEvent(isSaved: false, error: e));
    }

    if (_pendingFlush) {
      _pendingFlush = false;
      await flushSave();
    }
  }

  BoardData createNewBoardObject([String title = '新規ボード']) {
    final now = DateTime.now().millisecondsSinceEpoch;
    final suffix = _random.nextInt(0xFFFFFF).toRadixString(36).padLeft(5, '0');
    return BoardData(
      id: 'board_${now}_$suffix',
      title: title,
      createdAt: now,
      updatedAt: now,
    );
  }

  BoardData getActiveBoard() {
    final found = state.boards.where((b) => b.id == state.activeBoardId).firstOrNull;
    if (found != null) return found;

    if (state.boards.isNotEmpty) {
      state.activeBoardId = state.boards.first.id;
      _dirtyMeta = true;
      flushSave();
      return state.boards.first;
    }

    final newBoard = createNewBoardObject('メインボード');
    state.boards.add(newBoard);
    state.activeBoardId = newBoard.id;
    _dirtyBoardIds.add(newBoard.id);
    _dirtyMeta = true;
    flushSave();
    return newBoard;
  }

  BoardData? switchBoard(String id) {
    final exists = state.boards.any((b) => b.id == id);
    if (!exists) return null;
    state.activeBoardId = id;
    _dirtyMeta = true;
    flushSave();
    return getActiveBoard();
  }

  BoardData createBoard([String? title]) {
    final name = (title?.trim().isNotEmpty ?? false)
        ? title!.trim()
        : 'ボード ${state.boards.length + 1}';
    final newBoard = createNewBoardObject(name);
    state.boards.add(newBoard);
    state.activeBoardId = newBoard.id;
    _dirtyBoardIds.add(newBoard.id);
    _dirtyMeta = true;
    flushSave();
    return newBoard;
  }

  bool renameBoard(String id, String newTitle) {
    final trimmed = newTitle.trim();
    if (trimmed.isEmpty) return false;
    final board = state.boards.where((b) => b.id == id).firstOrNull;
    if (board == null) return false;
    board.title = trimmed;
    board.updatedAt = DateTime.now().millisecondsSinceEpoch;
    _dirtyBoardIds.add(board.id);
    flushSave();
    return true;
  }

  BoardData? duplicateBoard(String id) {
    final source = state.boards.where((b) => b.id == id).firstOrNull;
    if (source == null) return null;
    final now = DateTime.now().millisecondsSinceEpoch;
    final suffix = _random.nextInt(0xFFFFFF).toRadixString(36).padLeft(5, '0');
    final copy = BoardData(
      id: 'board_${now}_$suffix',
      title: '${source.title} (コピー)',
      strokes: source.strokes.map((s) => s.clone()).toList(),
      createdAt: now,
      updatedAt: now,
    );
    state.boards.add(copy);
    state.activeBoardId = copy.id;
    _dirtyBoardIds.add(copy.id);
    _dirtyMeta = true;
    flushSave();
    return copy;
  }

  ({bool deleted, bool reset, BoardData? activeBoard}) deleteBoard(String id) {
    if (state.boards.length <= 1) {
      final board = getActiveBoard();
      board.strokes = [];
      board.undoStack = [];
      board.redoStack = [];
      board.updatedAt = DateTime.now().millisecondsSinceEpoch;
      _dirtyBoardIds.add(board.id);
      flushSave();
      return (deleted: false, reset: true, activeBoard: board);
    }

    final index = state.boards.indexWhere((b) => b.id == id);
    if (index == -1) return (deleted: false, reset: false, activeBoard: null);

    state.boards.removeAt(index);
    _dirtyBoardIds.remove(id);
    _deletedBoardIds.add(id);
    if (state.activeBoardId == id) {
      final nextIndex = min(index, state.boards.length - 1);
      state.activeBoardId = state.boards[nextIndex].id;
    }
    _dirtyMeta = true;
    flushSave();
    return (deleted: true, reset: false, activeBoard: getActiveBoard());
  }

  void updateActiveBoardStrokes(
    List<Stroke> strokes,
    List<List<Stroke>> undoStack,
    List<List<Stroke>> redoStack,
  ) {
    final board = getActiveBoard();
    board.strokes = strokes;
    board.undoStack = undoStack;
    board.redoStack = redoStack;
    board.updatedAt = DateTime.now().millisecondsSinceEpoch;
    _dirtyBoardIds.add(board.id);
    scheduleSave();
  }

  void setTheme(String theme) {
    state.theme = theme == 'dark' ? 'dark' : 'light';
    _savePrefs();
    _dirtyMeta = true;
    flushSave();
  }

  void setSeedColor(String hex) {
    if (AppStateData.hexPattern.hasMatch(hex)) {
      state.seedColor = hex.toUpperCase();
      _savePrefs();
      _dirtyMeta = true;
      flushSave();
    }
  }

  List<String> addCustomColor(String hex) {
    final normalized = hex.trim().toLowerCase();
    if (!AppStateData.hexPattern.hasMatch(normalized)) {
      return state.customColors;
    }
    final list = state.customColors
        .where((c) => c.toLowerCase() != normalized)
        .toList();
    list.insert(0, normalized);
    state.customColors = list.take(12).toList();
    _dirtyMeta = true;
    flushSave();
    return state.customColors;
  }

  String buildExportJsonString() {
    return const JsonEncoder.withIndent('  ').convert(state.toJson());
  }

  Future<void> exportJson() async {
    await flushSave();
    final dateStr = DateTime.now().toIso8601String().substring(0, 10);
    await _backend.downloadTextFile(
      filename: 'whiteboard_backup_$dateStr.json',
      content: buildExportJsonString(),
      mimeType: 'application/json',
    );
  }

  Future<void> exportPngBytes(Uint8List bytes, String boardTitle) async {
    final safeTitle = boardTitle.trim().isNotEmpty ? boardTitle.trim() : 'whiteboard';
    final dateStr = DateTime.now().toIso8601String().substring(0, 10);
    await _backend.downloadBinaryFile(
      filename: '${safeTitle}_$dateStr.png',
      bytes: bytes,
      mimeType: 'image/png',
    );
  }

  Future<bool?> pickAndImportJson() async {
    final content = await _backend.pickJsonTextFile();
    if (content == null) return null;
    return importJson(content);
  }

  Future<bool> importJson(String jsonString) async {
    try {
      final decoded = jsonDecode(jsonString);
      if (decoded is! Map<String, dynamic>) return false;
      final parsed = AppStateData.tryFromBackupJson(decoded);
      if (parsed == null) return false;

      final previousIds = state.boards.map((b) => b.id).toSet();
      state = AppStateData(
        activeBoardId: parsed.activeBoardId,
        boards: parsed.boards,
        theme: parsed.theme,
        seedColor: parsed.seedColor,
        customColors: parsed.customColors.isNotEmpty
            ? parsed.customColors
            : state.customColors,
      );

      await _savePrefs();
      for (final oldId in previousIds) {
        if (!state.boards.any((b) => b.id == oldId)) {
          _deletedBoardIds.add(oldId);
        }
      }
      for (final b in state.boards) {
        _dirtyBoardIds.add(b.id);
      }
      _dirtyMeta = true;
      await flushSave();
      return true;
    } catch (_) {
      return false;
    }
  }
}
