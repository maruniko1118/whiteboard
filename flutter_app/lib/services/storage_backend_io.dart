import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:path_provider/path_provider.dart';

import 'storage_backend.dart';

/// Native (Android/iOS/Desktop) file-backed storage with in-memory fallback for VM unit tests.
class IoStorageBackend implements StorageBackend {
  IoStorageBackend({this.useFileSystem = true});

  final bool useFileSystem;

  String? _theme;
  String? _seedColor;
  Map<String, dynamic>? _meta;
  final Map<String, Map<String, dynamic>> _boards = {};
  String? _legacyJson;

  String? lastDownloadedFilename;
  String? lastDownloadedText;
  Uint8List? lastDownloadedBytes;
  String? lastOpenedUrl;

  Future<Directory?> _resolveDocsDir() async {
    if (!useFileSystem) return null;
    try {
      return await getApplicationDocumentsDirectory();
    } catch (_) {
      return null;
    }
  }

  Future<void> _persistToDisk() async {
    final dir = await _resolveDocsDir();
    if (dir == null) return;
    try {
      final file = File('${dir.path}/whiteboard_app_db.json');
      await file.writeAsString(
        jsonEncode({
          'meta': _meta,
          'boards': _boards.values.toList(),
        }),
      );
    } catch (_) {}
  }

  @override
  Future<Map<String, String?>> readPrefs() async {
    final dir = await _resolveDocsDir();
    if (dir != null) {
      try {
        final file = File('${dir.path}/whiteboard_prefs_v1.json');
        if (await file.exists()) {
          final parsed = jsonDecode(await file.readAsString());
          if (parsed is Map) {
            _theme = parsed['theme'] as String?;
            _seedColor = parsed['seedColor'] as String?;
          }
        }
      } catch (_) {}
    }
    return {'theme': _theme, 'seedColor': _seedColor};
  }

  @override
  Future<void> writePrefs({
    required String theme,
    required String seedColor,
  }) async {
    _theme = theme;
    _seedColor = seedColor;
    final dir = await _resolveDocsDir();
    if (dir != null) {
      try {
        final file = File('${dir.path}/whiteboard_prefs_v1.json');
        await file.writeAsString(
          jsonEncode({'theme': theme, 'seedColor': seedColor}),
        );
      } catch (_) {}
    }
  }

  @override
  Future<Map<String, dynamic>?> loadFromDb() async {
    final dir = await _resolveDocsDir();
    if (dir != null) {
      try {
        final file = File('${dir.path}/whiteboard_app_db.json');
        if (await file.exists()) {
          final decoded = jsonDecode(await file.readAsString());
          if (decoded is Map) {
            final metaRaw = decoded['meta'];
            final boardsRaw = decoded['boards'];
            if (metaRaw is Map && boardsRaw is List && boardsRaw.isNotEmpty) {
              _meta = Map<String, dynamic>.from(metaRaw);
              _boards.clear();
              for (final b in boardsRaw.whereType<Map>()) {
                final mapped = Map<String, dynamic>.from(b);
                final id = mapped['id'] as String?;
                if (id != null) _boards[id] = mapped;
              }
            }
          }
        }
      } catch (_) {}
    }
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
    await _persistToDisk();
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
    await _persistToDisk();
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
    final dir = await _resolveDocsDir();
    if (dir != null) {
      try {
        await File('${dir.path}/$filename').writeAsString(content);
      } catch (_) {}
    }
  }

  @override
  Future<void> downloadBinaryFile({
    required String filename,
    required Uint8List bytes,
    required String mimeType,
  }) async {
    lastDownloadedFilename = filename;
    lastDownloadedBytes = bytes;
    final dir = await _resolveDocsDir();
    if (dir != null) {
      try {
        await File('${dir.path}/$filename').writeAsBytes(bytes);
      } catch (_) {}
    }
  }

  @override
  Future<String?> pickJsonTextFile() async => null;

  @override
  void openExternalUrl(String url) {
    lastOpenedUrl = url;
  }
}

StorageBackend createPlatformStorageBackend() => IoStorageBackend();
