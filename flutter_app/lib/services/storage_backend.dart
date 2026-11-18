import 'dart:typed_data';

import 'storage_backend_io.dart'
    if (dart.library.js_interop) 'storage_backend_web.dart';

abstract class StorageBackend {
  Future<Map<String, String?>> readPrefs();
  Future<void> writePrefs({required String theme, required String seedColor});

  Future<Map<String, dynamic>?> loadFromDb();
  Future<void> saveAllToDb({
    required Map<String, dynamic> meta,
    required List<Map<String, dynamic>> boards,
  });
  Future<void> flushDbChanges({
    Map<String, dynamic>? meta,
    required List<Map<String, dynamic>> boardsToWrite,
    required List<String> boardIdsToDelete,
  });

  String? readLegacyLocalStorage();
  void writeLegacyLocalStorage(String json);
  void removeLegacyLocalStorage();

  Future<void> downloadTextFile({
    required String filename,
    required String content,
    required String mimeType,
  });
  Future<void> downloadBinaryFile({
    required String filename,
    required Uint8List bytes,
    required String mimeType,
  });
  Future<String?> pickJsonTextFile();
  void openExternalUrl(String url);
}

StorageBackend createStorageBackend() => createPlatformStorageBackend();
