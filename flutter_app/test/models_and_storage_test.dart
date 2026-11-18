import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:whiteboard_app/models/whiteboard_models.dart';
import 'package:whiteboard_app/services/board_storage.dart';
import 'package:whiteboard_app/services/storage_backend_io.dart';

void main() {
  group('JSON backup compatibility', () {
    test('parses legacy JS backup JSON schema accurately', () {
      const legacyJson = '''
      {
        "activeBoardId": "board_2",
        "boards": [
          {
            "id": "board_1",
            "title": "メインボード",
            "strokes": [
              {
                "id": "s_1",
                "tool": "pen",
                "colorKey": "black",
                "customColor": null,
                "width": 5,
                "points": [{"x": 10.5, "y": 20.25}, {"x": 30.0, "y": 40.5}]
              },
              {
                "id": "s_2",
                "tool": "eraser",
                "colorKey": "black",
                "customColor": null,
                "width": 12.5,
                "points": [{"x": 15.0, "y": 25.0}]
              }
            ],
            "createdAt": 1700000000000,
            "updatedAt": 1700000001000
          },
          {
            "id": "board_2",
            "title": "アイデアメモ",
            "strokes": [],
            "createdAt": 1700000002000,
            "updatedAt": 1700000003000
          }
        ],
        "theme": "dark",
        "seedColor": "#0061A4",
        "customColors": ["#06b6d4", "#ff00aa"]
      }
      ''';

      final decoded = jsonDecode(legacyJson) as Map<String, dynamic>;
      final parsed = AppStateData.tryFromBackupJson(decoded);
      expect(parsed, isNotNull);
      expect(parsed!.activeBoardId, 'board_2');
      expect(parsed.boards.length, 2);
      expect(parsed.boards[0].strokes.length, 2);
      expect(parsed.boards[0].strokes[0].tool, ToolType.pen);
      expect(parsed.boards[0].strokes[1].tool, ToolType.eraser);
      expect(parsed.boards[0].strokes[0].points[1].x, 30.0);
      expect(parsed.theme, 'dark');
      expect(parsed.seedColor, '#0061A4');
      expect(parsed.customColors, ['#06b6d4', '#ff00aa']);

      // Re-serialize and verify schema parity
      final reEncoded = parsed.toJson();
      expect(reEncoded['activeBoardId'], 'board_2');
      expect((reEncoded['boards'] as List).length, 2);
      expect(reEncoded['theme'], 'dark');
    });

    test('rejects invalid or empty backup JSON', () {
      expect(AppStateData.tryFromBackupJson({'boards': []}), isNull);
      expect(AppStateData.tryFromBackupJson({'foo': 'bar'}), isNull);
    });
  });

  group('BoardStorage lifecycle', () {
    test('creates, renames, duplicates, deletes, and imports boards', () async {
      final backend = IoStorageBackend(useFileSystem: false);
      final storage = BoardStorage(backend: backend);
      await storage.init();

      expect(storage.state.boards.length, 1);
      final firstId = storage.state.boards.first.id;

      // Rename
      expect(storage.renameBoard(firstId, '設計ボード'), isTrue);
      expect(storage.getActiveBoard().title, '設計ボード');

      // Create & switch
      final second = storage.createBoard('サブボード');
      expect(storage.state.boards.length, 2);
      expect(storage.state.activeBoardId, second.id);

      // Duplicate
      final copy = storage.duplicateBoard(second.id);
      expect(copy, isNotNull);
      expect(copy!.title, 'サブボード (コピー)');
      expect(storage.state.boards.length, 3);

      // Delete
      final delRes = storage.deleteBoard(copy.id);
      expect(delRes.deleted, isTrue);
      expect(storage.state.boards.length, 2);

      // Delete until 1 remains -> resets instead of deleting last board
      storage.deleteBoard(second.id);
      expect(storage.state.boards.length, 1);
      final resetRes = storage.deleteBoard(firstId);
      expect(resetRes.deleted, isFalse);
      expect(resetRes.reset, isTrue);
      expect(storage.state.boards.length, 1);

      // Custom colors dedupe & cap at 12
      for (var i = 0; i < 15; i++) {
        final hex = '#${(0x100000 + i * 1111).toRadixString(16).padLeft(6, '0')}';
        storage.addCustomColor(hex);
      }
      expect(storage.state.customColors.length, 12);

      // Export & re-import round trip
      await storage.exportJson();
      expect(backend.lastDownloadedText, isNotNull);
      final ok = await storage.importJson(backend.lastDownloadedText!);
      expect(ok, isTrue);
      expect(storage.getActiveBoard().title, '設計ボード');
    });
  });
}
