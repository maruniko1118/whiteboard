import 'package:flutter/foundation.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:whiteboard_app/main.dart';
import 'package:whiteboard_app/services/app_updater.dart';
import 'package:whiteboard_app/services/board_storage.dart';
import 'package:whiteboard_app/services/storage_backend_io.dart';

class _FakeAppUpdater implements AppUpdater {
  _FakeAppUpdater({
    required this.currentVersion,
    this.remoteRelease,
    this.errorMessage,
    this.sha256Valid = true,
    this.installSequence = const [ApkInstallResult.launched],
  });

  final AppVersionInfo currentVersion;
  final ReleaseUpdateInfo? remoteRelease;
  final String? errorMessage;
  final bool sha256Valid;
  final List<ApkInstallResult> installSequence;

  final ValueNotifier<UpdateCheckResult?> _latestResult =
      ValueNotifier<UpdateCheckResult?>(null);

  int checkCount = 0;
  int downloadCount = 0;
  int verifyCount = 0;
  int installCount = 0;
  bool openedPermissionSettings = false;
  String? lastOpenedUrl;

  @override
  bool get isSupported => true;

  @override
  ValueListenable<UpdateCheckResult?> get latestCheckResult => _latestResult;

  @override
  Future<AppVersionInfo> getCurrentVersion() async => currentVersion;

  @override
  Future<UpdateCheckResult> checkForUpdate() async {
    checkCount++;
    await Future<void>.delayed(Duration.zero);
    if (errorMessage != null) {
      final res = UpdateCheckResult(
        currentVersion: currentVersion,
        hasUpdate: false,
        errorMessage: errorMessage,
      );
      _latestResult.value = res;
      return res;
    }
    final release = remoteRelease;
    final hasUpdate = release != null &&
        AppUpdater.isNewerVersion(current: currentVersion, remote: release);
    final res = UpdateCheckResult(
      currentVersion: currentVersion,
      latestRelease: release,
      hasUpdate: hasUpdate,
    );
    _latestResult.value = res;
    return res;
  }

  @override
  Future<String> downloadApk(
    ReleaseUpdateInfo release, {
    void Function(int received, int total)? onProgress,
    bool Function()? isCancelled,
  }) async {
    downloadCount++;
    final total = release.sizeBytes ?? 1000;
    onProgress?.call(total ~/ 2, total);
    await Future<void>.delayed(const Duration(milliseconds: 10));
    if (isCancelled?.call() == true) {
      throw const UpdateCancelledException();
    }
    onProgress?.call(total, total);
    return '/tmp/whiteboard.apk';
  }

  @override
  Future<bool> verifyApkSha256(String filePath, String expectedSha256) async {
    verifyCount++;
    return sha256Valid;
  }

  @override
  Future<bool> canInstallPackages() async => true;

  @override
  Future<void> openInstallPermissionSettings() async {
    openedPermissionSettings = true;
  }

  @override
  Future<ApkInstallResult> installApk(String filePath) async {
    final idx = installCount < installSequence.length
        ? installCount
        : installSequence.length - 1;
    installCount++;
    return installSequence[idx];
  }

  @override
  Future<void> openExternalUrl(String url) async {
    lastOpenedUrl = url;
  }
}

void main() {
  group('AppUpdater version & metadata logic', () {
    test('compares semantic versions properly', () {
      expect(AppUpdater.compareSemVer('1.0.4', '1.0.3'), greaterThan(0));
      expect(AppUpdater.compareSemVer('v1.0.10', 'v1.0.2'), greaterThan(0));
      expect(AppUpdater.compareSemVer('1.0.3', '1.0.3'), 0);
      expect(AppUpdater.compareSemVer('1.0.2', '1.0.3'), lessThan(0));
    });

    test('determines newer version across build numbers and semver', () {
      const release4 = ReleaseUpdateInfo(
        version: '1.0.4',
        buildNumber: 4,
        tag: 'v1.0.4',
        apkUrl: 'https://github.com/example/whiteboard.apk',
      );

      expect(
        AppUpdater.isNewerVersion(
          current: const AppVersionInfo(version: '1.0.0', buildNumber: 1),
          remote: release4,
        ),
        isTrue,
      );
      expect(
        AppUpdater.isNewerVersion(
          current: const AppVersionInfo(version: '1.0.4', buildNumber: 3),
          remote: release4,
        ),
        isTrue,
      );
      expect(
        AppUpdater.isNewerVersion(
          current: const AppVersionInfo(version: '1.0.4', buildNumber: 4),
          remote: release4,
        ),
        isFalse,
      );
      expect(
        AppUpdater.isNewerVersion(
          current: const AppVersionInfo(version: '1.0.5', buildNumber: 1),
          remote: release4,
        ),
        isFalse,
      );
    });

    test('parses version.json payload and rejects non-https URLs', () {
      final parsed = ReleaseUpdateInfo.tryFromVersionJson({
        'version': '1.0.4',
        'buildNumber': 4,
        'tag': 'v1.0.4',
        'apkUrl':
            'https://github.com/maruniko1118/whiteboard/releases/download/v1.0.4/whiteboard.apk',
        'releaseUrl':
            'https://github.com/maruniko1118/whiteboard/releases/tag/v1.0.4',
        'sha256': 'abcd1234',
        'sizeBytes': 49199255,
        'notes': 'feat: auto update',
      });
      expect(parsed, isNotNull);
      expect(parsed!.version, '1.0.4');
      expect(parsed.buildNumber, 4);
      expect(parsed.tag, 'v1.0.4');
      expect(parsed.sha256, 'abcd1234');
      expect(parsed.sizeBytes, 49199255);
      expect(parsed.notes, 'feat: auto update');

      expect(
        ReleaseUpdateInfo.tryFromVersionJson({
          'version': '1.0.4',
          'apkUrl': 'http://insecure.example.com/whiteboard.apk',
        }),
        isNull,
      );
    });

    test('parses GitHub release API JSON and extracts whiteboard.apk asset', () {
      final parsed = ReleaseUpdateInfo.tryFromGitHubReleaseJson({
        'tag_name': 'v1.0.5',
        'html_url':
            'https://github.com/maruniko1118/whiteboard/releases/tag/v1.0.5',
        'body': 'Release notes',
        'assets': [
          {
            'name': 'whiteboard.apk',
            'browser_download_url':
                'https://github.com/maruniko1118/whiteboard/releases/download/v1.0.5/whiteboard.apk',
            'size': 48000000,
            'digest': 'sha256:deadbeef',
          },
        ],
      });
      expect(parsed, isNotNull);
      expect(parsed!.version, '1.0.5');
      expect(parsed.buildNumber, 5);
      expect(parsed.sha256, 'deadbeef');
      expect(parsed.sizeBytes, 48000000);
    });
  });

  group('Android auto-update UI flow', () {
    testWidgets(
      'prompts automatically on startup when update is available and handles permission + install',
      (tester) async {
        tester.view.physicalSize = const Size(412, 915);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.resetPhysicalSize);

        final storage = BoardStorage(
          backend: IoStorageBackend(useFileSystem: false),
        );
        await storage.init();

        final updater = _FakeAppUpdater(
          currentVersion: const AppVersionInfo(version: '1.0.3', buildNumber: 3),
          remoteRelease: const ReleaseUpdateInfo(
            version: '1.0.4',
            buildNumber: 4,
            tag: 'v1.0.4',
            apkUrl:
                'https://github.com/maruniko1118/whiteboard/releases/download/v1.0.4/whiteboard.apk',
            sha256: 'abcd',
            sizeBytes: 2048000,
            notes: '自動アップデート対応',
          ),
          installSequence: const [
            ApkInstallResult.permissionRequired,
            ApkInstallResult.launched,
          ],
        );

        await tester.pumpWidget(
          WhiteboardApp(
            storage: storage,
            showApkDownload: false,
            appUpdater: updater,
          ),
        );
        await tester.pumpAndSettle();

        expect(updater.checkCount, 1);
        expect(find.text('新しいアップデートがあります'), findsOneWidget);
        expect(find.text('v1.0.4'), findsOneWidget);

        await tester.tap(find.text('今すぐアップデート'));
        await tester.pumpAndSettle();

        expect(updater.downloadCount, 1);
        expect(updater.verifyCount, 1);
        expect(updater.installCount, 1);
        expect(find.text('インストールの許可が必要です'), findsOneWidget);

        await tester.tap(find.text('設定を開く'));
        await tester.pump();
        expect(updater.openedPermissionSettings, isTrue);

        await tester.tap(find.text('インストールを再試行'));
        await tester.pumpAndSettle();

        expect(updater.installCount, 2);
        expect(find.text('インストーラーを起動しました'), findsOneWidget);
      },
    );

    testWidgets(
      'shows up-to-date status when manual check button is tapped on Android',
      (tester) async {
        tester.view.physicalSize = const Size(412, 915);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.resetPhysicalSize);

        final storage = BoardStorage(
          backend: IoStorageBackend(useFileSystem: false),
        );
        await storage.init();

        final updater = _FakeAppUpdater(
          currentVersion: const AppVersionInfo(version: '1.0.4', buildNumber: 4),
          remoteRelease: const ReleaseUpdateInfo(
            version: '1.0.4',
            buildNumber: 4,
            tag: 'v1.0.4',
            apkUrl:
                'https://github.com/maruniko1118/whiteboard/releases/download/v1.0.4/whiteboard.apk',
          ),
        );

        await tester.pumpWidget(
          WhiteboardApp(
            storage: storage,
            showApkDownload: false,
            appUpdater: updater,
          ),
        );
        await tester.pumpAndSettle();

        // No automatic dialog when already up to date
        expect(find.text('新しいアップデートがあります'), findsNothing);

        await tester.tap(find.byTooltip('アプリのアップデートを確認'));
        await tester.pumpAndSettle();

        expect(find.text('最新バージョンです'), findsOneWidget);
      },
    );

    testWidgets(
      'displays SHA-256 verification error when APK checksum mismatches',
      (tester) async {
        tester.view.physicalSize = const Size(412, 915);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.resetPhysicalSize);

        final storage = BoardStorage(
          backend: IoStorageBackend(useFileSystem: false),
        );
        await storage.init();

        final updater = _FakeAppUpdater(
          currentVersion: const AppVersionInfo(version: '1.0.3', buildNumber: 3),
          remoteRelease: const ReleaseUpdateInfo(
            version: '1.0.4',
            buildNumber: 4,
            tag: 'v1.0.4',
            apkUrl:
                'https://github.com/maruniko1118/whiteboard/releases/download/v1.0.4/whiteboard.apk',
            sha256: 'expected-hash',
          ),
          sha256Valid: false,
        );

        await tester.pumpWidget(
          WhiteboardApp(
            storage: storage,
            showApkDownload: false,
            appUpdater: updater,
          ),
        );
        await tester.pumpAndSettle();

        await tester.tap(find.text('今すぐアップデート'));
        await tester.pumpAndSettle();

        expect(find.text('アップデートエラー'), findsOneWidget);
        expect(
          find.text('ダウンロードした APK の整合性検証 (SHA-256) に失敗しました。'),
          findsOneWidget,
        );
      },
    );

    testWidgets(
      'displays error message when manual update check fails',
      (tester) async {
        tester.view.physicalSize = const Size(412, 915);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.resetPhysicalSize);

        final storage = BoardStorage(
          backend: IoStorageBackend(useFileSystem: false),
        );
        await storage.init();

        final updater = _FakeAppUpdater(
          currentVersion: const AppVersionInfo(version: '1.0.3', buildNumber: 3),
          errorMessage: 'ネットワーク接続エラー',
        );

        await tester.pumpWidget(
          WhiteboardApp(
            storage: storage,
            showApkDownload: false,
            appUpdater: updater,
          ),
        );
        await tester.pumpAndSettle();

        await tester.tap(find.byTooltip('アプリのアップデートを確認'));
        await tester.pumpAndSettle();

        expect(find.text('アップデートエラー'), findsOneWidget);
        expect(find.text('ネットワーク接続エラー'), findsOneWidget);
      },
    );
  });
}
