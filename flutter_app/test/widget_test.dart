import 'dart:ui' as ui;

import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:whiteboard_app/canvas/canvas_gesture_layer.dart';
import 'package:whiteboard_app/canvas/whiteboard_controller.dart';
import 'package:whiteboard_app/main.dart';
import 'package:whiteboard_app/models/whiteboard_models.dart';
import 'package:whiteboard_app/services/board_storage.dart';
import 'package:whiteboard_app/services/storage_backend_io.dart';
import 'package:whiteboard_app/theme/app_theme.dart';
import 'package:whiteboard_app/widgets/floating_toolbar.dart';
import 'package:whiteboard_app/widgets/top_app_bar.dart';
import 'package:whiteboard_app/widgets/whiteboard_home.dart';

void main() {
  group('WhiteboardController', () {
    test('records strokes, supports undo/redo up to 50 steps, and clears', () {
      final ctrl = WhiteboardController();
      ctrl.startStroke(const Offset(10, 10), 1);
      ctrl.appendStrokePoint(const Offset(30, 30));
      ctrl.finishStroke(finalLocalPos: const Offset(50, 50));

      expect(ctrl.strokes.length, 1);
      expect(ctrl.canUndo, isTrue);
      expect(ctrl.canRedo, isFalse);

      ctrl.undo();
      expect(ctrl.strokes, isEmpty);
      expect(ctrl.canRedo, isTrue);

      ctrl.redo();
      expect(ctrl.strokes.length, 1);

      ctrl.clear();
      expect(ctrl.strokes, isEmpty);
      ctrl.undo();
      expect(ctrl.strokes.length, 1);

      // Verify max 50 undo stack bound
      for (var i = 0; i < 60; i++) {
        ctrl.startStroke(Offset(i * 5.0, 0), 1);
        ctrl.finishStroke(finalLocalPos: Offset(i * 5.0 + 10, 10));
      }
      expect(ctrl.undoStack.length, WhiteboardController.maxUndoHistory);
      ctrl.dispose();
    });

    test('cancels accidental short 1-finger stroke during multi-touch', () {
      final ctrl = WhiteboardController();
      ctrl.startStroke(const Offset(0, 0), 1);
      ctrl.appendStrokePoint(const Offset(5, 5));
      ctrl.cancelAccidentalShortStroke();
      expect(ctrl.strokes, isEmpty);
      expect(ctrl.isDrawing, isFalse);
      ctrl.dispose();
    });

    test('clamps zoom and preserves focal world coordinates', () {
      final ctrl = WhiteboardController();
      const focal = Offset(200, 150);
      final beforeWorld = ctrl.screenToWorld(focal);
      ctrl.zoomAt(2.0, focal);
      expect(ctrl.scale, 2.0);
      final afterWorld = ctrl.screenToWorld(focal);
      expect((afterWorld.x - beforeWorld.x).abs() < 0.05, isTrue);
      expect((afterWorld.y - beforeWorld.y).abs() < 0.05, isTrue);

      ctrl.zoomAt(100.0, focal);
      expect(ctrl.scale, WhiteboardController.maxScale);

      ctrl.zoomAt(0.001, focal);
      expect(ctrl.scale, WhiteboardController.minScale);

      ctrl.resetViewport();
      expect(ctrl.scale, 1.0);
      expect(ctrl.panX, 0.0);
      expect(ctrl.panY, 0.0);
      ctrl.dispose();
    });

    test('adapts black ink to white in dark theme', () {
      final stroke = Stroke(
        id: 's1',
        tool: ToolType.pen,
        colorKey: 'black',
        width: 5,
        points: const [StrokePoint(0, 0)],
      );
      expect(
        AppTheme.resolveStrokeColor(stroke, Brightness.light),
        const Color(0xFF0F172A),
      );
      expect(
        AppTheme.resolveStrokeColor(stroke, Brightness.dark),
        const Color(0xFFFFFFFF),
      );
    });
  });

  group('WhiteboardApp widget tests', () {
    testWidgets('renders initial board, creates board, and toggles theme', (
      tester,
    ) async {
      tester.view.physicalSize = const Size(1280, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final storage = BoardStorage(
        backend: IoStorageBackend(useFileSystem: false),
      );
      await storage.init();

      await tester.pumpWidget(WhiteboardApp(storage: storage));
      await tester.pumpAndSettle();

      expect(find.text('メインボード'), findsOneWidget);
      expect(find.text('100%'), findsOneWidget);
      expect(find.text('自動保存済み'), findsOneWidget);

      // Create new board via '+' button
      await tester.tap(find.byTooltip('新しいボードを作成'));
      await tester.pumpAndSettle();
      expect(find.text('ボード 2'), findsOneWidget);

      // Toggle dark theme
      await tester.tap(find.byTooltip('テーマ切り替え (ライト / ダーク) [T]'));
      await tester.pumpAndSettle();
      expect(storage.state.theme, 'dark');
    });

    testWidgets('opens APK download dialog and triggers GitHub release URL', (
      tester,
    ) async {
      tester.view.physicalSize = const Size(1280, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final backend = IoStorageBackend(useFileSystem: false);
      final storage = BoardStorage(backend: backend);
      await storage.init();

      await tester.pumpWidget(
        WhiteboardApp(storage: storage, showApkDownload: true),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byTooltip('Androidアプリ (.apk) をダウンロード'));
      await tester.pumpAndSettle();
      expect(find.text('Android アプリ (.apk)'), findsOneWidget);

      await tester.tap(find.text('APK をダウンロード'));
      await tester.pumpAndSettle();
      expect(backend.lastOpenedUrl, WhiteboardHome.apkDownloadUrl);
    });

    testWidgets('renders custom EraserIcon and toggles filled state', (
      tester,
    ) async {
      tester.view.physicalSize = const Size(1280, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final storage = BoardStorage(
        backend: IoStorageBackend(useFileSystem: false),
      );
      await storage.init();

      await tester.pumpWidget(WhiteboardApp(storage: storage));
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.auto_fix_normal_rounded), findsNothing);
      expect(find.byType(EraserIcon), findsOneWidget);
      expect(tester.widget<EraserIcon>(find.byType(EraserIcon)).filled, isFalse);

      await tester.tap(find.byTooltip('消しゴム (E)'));
      await tester.pumpAndSettle();

      expect(tester.widget<EraserIcon>(find.byType(EraserIcon)).filled, isTrue);
    });

    testWidgets('exports transparent PNG and preserves erased transparency', (
      tester,
    ) async {
      final ctrl = WhiteboardController();
      addTearDown(ctrl.dispose);

      // Draw a horizontal pen stroke across (50, 50)
      ctrl.startStroke(const Offset(10, 50), 1);
      ctrl.appendStrokePoint(const Offset(90, 50));
      ctrl.finishStroke(finalLocalPos: const Offset(90, 50));

      // Erase over the middle at (50, 50)
      ctrl.setTool(ToolType.eraser);
      ctrl.startStroke(const Offset(50, 50), 2);
      ctrl.finishStroke(finalLocalPos: const Offset(50, 50));

      final pngBytes = await tester.runAsync(
        () => ctrl.exportAsPng(
          logicalSize: const Size(100, 100),
          brightness: Brightness.light,
          pixelRatio: 1.0,
        ),
      );
      expect(pngBytes, isNotNull);

      final rgba = await tester.runAsync(() async {
        final codec = await ui.instantiateImageCodec(pngBytes!);
        final frame = await codec.getNextFrame();
        final data = await frame.image.toByteData(
          format: ui.ImageByteFormat.rawRgba,
        );
        frame.image.dispose();
        codec.dispose();
        return data;
      });
      expect(rgba, isNotNull);

      int alphaAt(int x, int y) => rgba!.getUint8((y * 100 + x) * 4 + 3);

      expect(alphaAt(5, 5), 0);
      expect(alphaAt(20, 50), greaterThan(200));
      expect(alphaAt(50, 50), 0);
    });

    testWidgets(
      'uses streamlined single-row header, board sheet, and expandable zoom HUD on mobile portrait',
      (tester) async {
        tester.view.physicalSize = const Size(390, 844);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.resetPhysicalSize);

        final storage = BoardStorage(
          backend: IoStorageBackend(useFileSystem: false),
        );
        await storage.init();

        await tester.pumpWidget(WhiteboardApp(storage: storage));
        await tester.pumpAndSettle();

        expect(find.byType(WhiteboardTopAppBar), findsOneWidget);
        expect(find.text('メインボード'), findsOneWidget);
        expect(find.text('自動保存済み'), findsNothing);
        expect(find.byTooltip('新しいボードを作成'), findsNothing);

        // Open Board Manager sheet and create a new board
        await tester.tap(find.byTooltip('ボードを切り替え・管理'));
        await tester.pumpAndSettle();
        expect(find.text('ボード管理'), findsOneWidget);

        await tester.tap(find.text('新規作成'));
        await tester.pumpAndSettle();
        expect(find.text('ボード 2'), findsOneWidget);

        // Expand and collapse compact ZoomHud
        await tester.tap(find.byTooltip('ズーム操作を表示 (2本指で移動・ピンチ拡大縮小)'));
        await tester.pumpAndSettle();
        expect(find.byTooltip('拡大'), findsOneWidget);
        await tester.tap(find.byTooltip('ズーム操作を閉じる'));
        await tester.pumpAndSettle();
        expect(find.byTooltip('拡大'), findsNothing);

        // Open More Menu sheet and toggle theme
        await tester.tap(find.byTooltip('メニュー (保存・テーマ・設定)'));
        await tester.pumpAndSettle();
        expect(find.text('PNG画像として保存'), findsOneWidget);
        await tester.tap(find.text('ダークテーマに切り替え'));
        await tester.pumpAndSettle();
        expect(storage.state.theme, 'dark');
      },
    );

    testWidgets(
      'maximizes canvas in mobile landscape with floating pills, single-row toolbar, and focus mode',
      (tester) async {
        tester.view.physicalSize = const Size(844, 390);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.resetPhysicalSize);

        final storage = BoardStorage(
          backend: IoStorageBackend(useFileSystem: false),
        );
        await storage.init();

        await tester.pumpWidget(WhiteboardApp(storage: storage));
        await tester.pumpAndSettle();

        expect(find.byType(WhiteboardTopAppBar), findsNothing);
        expect(find.byType(WhiteboardLandscapeHeaderPill), findsOneWidget);
        expect(
          tester.getSize(find.byType(CanvasGestureLayer)).height,
          equals(390.0),
        );
        expect(
          tester.getSize(find.byType(FloatingToolbar)).height,
          lessThanOrEqualTo(52.0),
        );

        // Enter focus mode to collapse floating overlays
        await tester.tap(find.byTooltip('キャンバスを最大化 (UIを隠す)'));
        await tester.pumpAndSettle();
        expect(find.byType(WhiteboardLandscapeHeaderPill), findsNothing);
        expect(find.byType(FloatingToolbar), findsNothing);
        expect(find.text('UI表示'), findsOneWidget);

        // Exit focus mode back to landscape controls
        await tester.tap(find.byTooltip('ツールバーを表示'));
        await tester.pumpAndSettle();
        expect(find.byType(WhiteboardLandscapeHeaderPill), findsOneWidget);
        expect(find.byType(FloatingToolbar), findsOneWidget);
      },
    );

    testWidgets(
      'opens width and color dialogs without overflow on short landscape screens',
      (tester) async {
        tester.view.physicalSize = const Size(667, 375);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.resetPhysicalSize);

        final storage = BoardStorage(
          backend: IoStorageBackend(useFileSystem: false),
        );
        await storage.init();

        await tester.pumpWidget(WhiteboardApp(storage: storage));
        await tester.pumpAndSettle();

        await tester.tap(find.byTooltip('線の太さを調整 (1px〜48px)'));
        await tester.pumpAndSettle();
        expect(find.text('線の太さ'), findsOneWidget);
        await tester.tap(find.text('閉じる'));
        await tester.pumpAndSettle();

        await tester.tap(find.byTooltip('自由な色を選択 (カスタムカラーピッカー)'));
        await tester.pumpAndSettle();
        expect(find.text('カラーピッカー'), findsOneWidget);
        await tester.tap(find.text('この色を選択して閉じる'));
        await tester.pumpAndSettle();
      },
    );
  });
}
