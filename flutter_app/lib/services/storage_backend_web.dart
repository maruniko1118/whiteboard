import 'dart:async';
import 'dart:convert';
import 'dart:js_interop';
import 'dart:typed_data';

import 'package:web/web.dart' as web;

import 'storage_backend.dart';

class WebStorageBackend implements StorageBackend {
  static const String _prefsStorageKey = 'whiteboard_prefs_v1';
  static const String _legacyStorageKey = 'whiteboard_app_state_v2';
  static const String _idbName = 'whiteboard_app_db';
  static const int _idbVersion = 1;
  static const String _storeMeta = 'meta';
  static const String _storeBoards = 'boards';
  static const String _metaKey = 'app';

  web.IDBDatabase? _db;

  Future<web.IDBDatabase?> _ensureDb() async {
    if (_db != null) return _db;
    final idb = web.window.indexedDB;
    final completer = Completer<web.IDBDatabase?>();
    try {
      final request = idb.open(_idbName, _idbVersion);
      request.onupgradeneeded = ((web.IDBVersionChangeEvent event) {
        final db = request.result as web.IDBDatabase;
        if (!db.objectStoreNames.contains(_storeMeta)) {
          db.createObjectStore(_storeMeta);
        }
        if (!db.objectStoreNames.contains(_storeBoards)) {
          db.createObjectStore(
            _storeBoards,
            web.IDBObjectStoreParameters(keyPath: 'id'.toJS),
          );
        }
      }).toJS;
      request.onsuccess = ((web.Event _) {
        _db = request.result as web.IDBDatabase;
        if (!completer.isCompleted) completer.complete(_db);
      }).toJS;
      request.onerror = ((web.Event _) {
        if (!completer.isCompleted) completer.complete(null);
      }).toJS;
      request.onblocked = ((web.Event _) {
        if (!completer.isCompleted) completer.complete(null);
      }).toJS;
    } catch (_) {
      if (!completer.isCompleted) completer.complete(null);
    }
    return completer.future;
  }

  @override
  Future<Map<String, String?>> readPrefs() async {
    try {
      final raw = web.window.localStorage.getItem(_prefsStorageKey);
      if (raw != null && raw.isNotEmpty) {
        final parsed = jsonDecode(raw);
        if (parsed is Map) {
          return {
            'theme': parsed['theme'] as String?,
            'seedColor': parsed['seedColor'] as String?,
          };
        }
      }
      final legacyRaw = web.window.localStorage.getItem(_legacyStorageKey);
      if (legacyRaw != null && legacyRaw.isNotEmpty) {
        final legacy = jsonDecode(legacyRaw);
        if (legacy is Map) {
          return {
            'theme': legacy['theme'] as String?,
            'seedColor': legacy['seedColor'] as String?,
          };
        }
      }
    } catch (_) {}
    return {'theme': null, 'seedColor': null};
  }

  @override
  Future<void> writePrefs({
    required String theme,
    required String seedColor,
  }) async {
    try {
      web.window.localStorage.setItem(
        _prefsStorageKey,
        jsonEncode({'theme': theme, 'seedColor': seedColor}),
      );
    } catch (_) {}
  }

  @override
  Future<Map<String, dynamic>?> loadFromDb() async {
    final db = await _ensureDb();
    if (db == null) return null;

    final completer = Completer<Map<String, dynamic>?>();
    try {
      final tx = db.transaction([_storeMeta.toJS, _storeBoards.toJS].toJS, 'readonly');
      final metaReq = tx.objectStore(_storeMeta).get(_metaKey.toJS);
      final boardsReq = tx.objectStore(_storeBoards).getAll();

      tx.oncomplete = ((web.Event _) {
        final metaRaw = metaReq.result.dartify();
        final boardsRaw = boardsReq.result.dartify();
        if (metaRaw is! Map || boardsRaw is! List || boardsRaw.isEmpty) {
          if (!completer.isCompleted) completer.complete(null);
          return;
        }
        final meta = _deepMap(metaRaw);
        final boards = boardsRaw
            .whereType<Map>()
            .map(_deepMap)
            .toList();
        if (!completer.isCompleted) {
          completer.complete({'meta': meta, 'boards': boards});
        }
      }).toJS;

      tx.onerror = ((web.Event _) {
        if (!completer.isCompleted) completer.complete(null);
      }).toJS;
    } catch (_) {
      if (!completer.isCompleted) completer.complete(null);
    }
    return completer.future;
  }

  @override
  Future<void> saveAllToDb({
    required Map<String, dynamic> meta,
    required List<Map<String, dynamic>> boards,
  }) async {
    final db = await _ensureDb();
    if (db == null) {
      throw StateError('IndexedDB unavailable');
    }

    final completer = Completer<void>();
    final tx = db.transaction([_storeMeta.toJS, _storeBoards.toJS].toJS, 'readwrite');
    tx.objectStore(_storeMeta).put(meta.jsify(), _metaKey.toJS);
    final boardStore = tx.objectStore(_storeBoards);
    for (final board in boards) {
      boardStore.put(board.jsify());
    }
    tx.oncomplete = ((web.Event _) {
      if (!completer.isCompleted) completer.complete();
    }).toJS;
    tx.onerror = ((web.Event _) {
      if (!completer.isCompleted) completer.completeError(StateError('IDB save failed'));
    }).toJS;
    return completer.future;
  }

  @override
  Future<void> flushDbChanges({
    Map<String, dynamic>? meta,
    required List<Map<String, dynamic>> boardsToWrite,
    required List<String> boardIdsToDelete,
  }) async {
    final db = await _ensureDb();
    if (db == null) {
      throw StateError('IndexedDB unavailable');
    }

    final writeMeta = meta != null;
    final hasBoardChanges = boardsToWrite.isNotEmpty || boardIdsToDelete.isNotEmpty;
    if (!writeMeta && !hasBoardChanges) return;

    final stores = <JSString>[
      if (writeMeta) _storeMeta.toJS,
      if (hasBoardChanges) _storeBoards.toJS,
    ];

    final completer = Completer<void>();
    final tx = db.transaction(stores.toJS, 'readwrite');
    if (writeMeta) {
      tx.objectStore(_storeMeta).put(meta.jsify(), _metaKey.toJS);
    }
    if (hasBoardChanges) {
      final boardStore = tx.objectStore(_storeBoards);
      for (final id in boardIdsToDelete) {
        boardStore.delete(id.toJS);
      }
      for (final board in boardsToWrite) {
        boardStore.put(board.jsify());
      }
    }
    tx.oncomplete = ((web.Event _) {
      if (!completer.isCompleted) completer.complete();
    }).toJS;
    tx.onerror = ((web.Event _) {
      if (!completer.isCompleted) completer.completeError(StateError('IDB flush failed'));
    }).toJS;
    return completer.future;
  }

  @override
  String? readLegacyLocalStorage() {
    try {
      return web.window.localStorage.getItem(_legacyStorageKey);
    } catch (_) {
      return null;
    }
  }

  @override
  void writeLegacyLocalStorage(String json) {
    try {
      web.window.localStorage.setItem(_legacyStorageKey, json);
    } catch (_) {}
  }

  @override
  void removeLegacyLocalStorage() {
    try {
      web.window.localStorage.removeItem(_legacyStorageKey);
    } catch (_) {}
  }

  @override
  Future<void> downloadTextFile({
    required String filename,
    required String content,
    required String mimeType,
  }) async {
    final blob = web.Blob(
      [content.toJS].toJS,
      web.BlobPropertyBag(type: mimeType),
    );
    _triggerDownload(filename, blob);
  }

  @override
  Future<void> downloadBinaryFile({
    required String filename,
    required Uint8List bytes,
    required String mimeType,
  }) async {
    final blob = web.Blob(
      [bytes.toJS].toJS,
      web.BlobPropertyBag(type: mimeType),
    );
    _triggerDownload(filename, blob);
  }

  void _triggerDownload(String filename, web.Blob blob) {
    final url = web.URL.createObjectURL(blob);
    final anchor = web.document.createElement('a') as web.HTMLAnchorElement;
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    web.URL.revokeObjectURL(url);
  }

  @override
  Future<String?> pickJsonTextFile() async {
    final input = web.document.createElement('input') as web.HTMLInputElement;
    input.type = 'file';
    input.accept = '.json,application/json';

    final completer = Completer<String?>();
    input.onchange = ((web.Event _) async {
      try {
        final file = input.files?.item(0);
        if (file == null) {
          if (!completer.isCompleted) completer.complete(null);
          return;
        }
        final text = (await file.text().toDart).toDart;
        if (!completer.isCompleted) completer.complete(text);
      } catch (_) {
        if (!completer.isCompleted) completer.complete(null);
      }
    }).toJS;

    input.oncancel = ((web.Event _) {
      if (!completer.isCompleted) completer.complete(null);
    }).toJS;

    input.click();
    return completer.future;
  }

  @override
  void openExternalUrl(String url) {
    final anchor = web.document.createElement('a') as web.HTMLAnchorElement;
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.click();
  }

  Map<String, dynamic> _deepMap(Map<Object?, Object?> raw) {
    final result = <String, dynamic>{};
    raw.forEach((key, value) {
      if (key != null) {
        result[key.toString()] = _deepValue(value);
      }
    });
    return result;
  }

  dynamic _deepValue(Object? value) {
    if (value is Map) {
      return _deepMap(value);
    }
    if (value is List) {
      return value.map(_deepValue).toList();
    }
    return value;
  }
}

StorageBackend createPlatformStorageBackend() => WebStorageBackend();
