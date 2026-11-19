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
  Future<bool> openExternalUrl(String url) async => false;
}

AppUpdater createPlatformAppUpdater() => WebAppUpdater();
