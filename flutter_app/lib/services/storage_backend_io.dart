import 'dart:typed_data';

import 'storage_backend.dart';

/// In-memory / VM fallback backend for unit tests and non-web targets.
class IoStorageBackend implements StorageBackend {
  String? _theme;
  String? _seedColor;
  Map<String, dynamic>? _meta;
  final Map<String, Map<String, dynamic>> _boards = {};
  String? _legacyJson;

  String? lastDownloadedFilename;
  String? lastDownloadedText;
  Uint8List? lastDownloadedBytes;

  @override
  Future<Map<String, String?>> readPrefs() async {
    return {'theme': _theme, 'seedColor': _seedColor};
  }

  @override
  Future<void> writePrefs({
    required String theme,
    required String seedColor,
  }) async {
    _theme = theme;
    _seedColor = seedColor;
  }

  @override
  Future<Map<String, dynamic>?> loadFromDb() async {
    if (_meta == null || _boards.isEmpty) return null;
    return {
      'meta': Map<String, dynamic>.from(_meta!),
      'boards': _boards.values.map((b) => Map<String, dynamic>.from(b)).toList(),
    };
  }

  @override
  Future<void> saveAllToDb({
    required Map<String, dynamic> meta,
    required List<Map<String, dynamic>> boards,
  }) async {
    _meta = Map<String, dynamic>.from(meta);
    _boards.clear();
    for (final b in boards) {
      final id = b['id'] as String?;
      if (id != null) {
        _boards[id] = Map<String, dynamic>.from(b);
      }
    }
  }

  @override
  Future<void> flushDbChanges({
    Map<String, dynamic>? meta,
    required List<Map<String, dynamic>> boardsToWrite,
    required List<String> boardIdsToDelete,
  }) async {
    if (meta != null) {
      _meta = Map<String, dynamic>.from(meta);
    }
    for (final id in boardIdsToDelete) {
      _boards.remove(id);
    }
    for (final b in boardsToWrite) {
      final id = b['id'] as String?;
      if (id != null) {
        _boards[id] = Map<String, dynamic>.from(b);
      }
    }
  }

  @override
  String? readLegacyLocalStorage() => _legacyJson;

  @override
  void writeLegacyLocalStorage(String json) {
    _legacyJson = json;
  }

  @override
  void removeLegacyLocalStorage() {
    _legacyJson = null;
  }

  @override
  Future<void> downloadTextFile({
    required String filename,
    required String content,
    required String mimeType,
  }) async {
    lastDownloadedFilename = filename;
    lastDownloadedText = content;
  }

  @override
  Future<void> downloadBinaryFile({
    required String filename,
    required Uint8List bytes,
    required String mimeType,
  }) async {
    lastDownloadedFilename = filename;
    lastDownloadedBytes = bytes;
  }

  @override
  Future<String?> pickJsonTextFile() async => null;
}

StorageBackend createPlatformStorageBackend() => IoStorageBackend();
