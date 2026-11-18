import 'package:flutter/foundation.dart';

import 'app_updater.dart';

class WebAppUpdater implements AppUpdater {
  final ValueNotifier<UpdateCheckResult?> _latestCheckResult =
      ValueNotifier<UpdateCheckResult?>(null);

  @override
  bool get isSupported => false;

  @override
  ValueListenable<UpdateCheckResult?> get latestCheckResult =>
      _latestCheckResult;

  @override
  Future<AppVersionInfo> getCurrentVersion() async {
    return const AppVersionInfo(version: '1.0.0', buildNumber: 1);
  }

  @override
  Future<UpdateCheckResult> checkForUpdate() async {
    return const UpdateCheckResult(
      currentVersion: AppVersionInfo(version: '1.0.0', buildNumber: 1),
      hasUpdate: false,
    );
  }

  @override
  Future<String> downloadApk(
    ReleaseUpdateInfo release, {
    void Function(int received, int total)? onProgress,
    bool Function()? isCancelled,
  }) {
    throw UnsupportedError('Web does not support APK self-update.');
  }

  @override
  Future<bool> verifyApkSha256(String filePath, String expectedSha256) async {
    return false;
  }

  @override
  Future<bool> canInstallPackages() async => false;

  @override
  Future<void> openInstallPermissionSettings() async {}

  @override
  Future<ApkInstallResult> installApk(String filePath) async {
    return ApkInstallResult.failed;
  }

  @override
  Future<void> openExternalUrl(String url) async {}
}

AppUpdater createPlatformAppUpdater() => WebAppUpdater();
