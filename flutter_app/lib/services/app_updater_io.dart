import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import 'app_updater.dart';

class IoAppUpdater implements AppUpdater {
  IoAppUpdater({this.isSupportedOverride});

  static const MethodChannel _channel = MethodChannel(
    'net.maruniko.whiteboard/updater',
  );

  final bool? isSupportedOverride;
  final ValueNotifier<UpdateCheckResult?> _latestCheckResult =
      ValueNotifier<UpdateCheckResult?>(null);

  @override
  bool get isSupported => isSupportedOverride ?? Platform.isAndroid;

  @override
  ValueListenable<UpdateCheckResult?> get latestCheckResult =>
      _latestCheckResult;

  @override
  Future<AppVersionInfo> getCurrentVersion() async {
    try {
      final info = await _channel.invokeMapMethod<String, dynamic>('getAppInfo');
      if (info != null) {
        final version = (info['versionName'] as String?)?.trim() ?? '1.0.0';
        final rawBuild = info['buildNumber'];
        final buildNumber = rawBuild is num ? rawBuild.toInt() : 1;
        return AppVersionInfo(version: version, buildNumber: buildNumber);
      }
    } catch (_) {}
    return const AppVersionInfo(version: '1.0.0', buildNumber: 1);
  }

  @override
  Future<UpdateCheckResult> checkForUpdate() async {
    final current = await getCurrentVersion();
    final client = HttpClient()
      ..connectionTimeout = const Duration(seconds: 10);

    try {
      var release = await _fetchFromVersionJson(client);
      release ??= await _fetchFromGitHubApi(client);

      if (release == null) {
        final res = UpdateCheckResult(
          currentVersion: current,
          hasUpdate: false,
          errorMessage: 'リリース情報を取得できませんでした。',
        );
        _latestCheckResult.value = res;
        return res;
      }

      final hasUpdate = AppUpdater.isNewerVersion(
        current: current,
        remote: release,
      );
      final res = UpdateCheckResult(
        currentVersion: current,
        latestRelease: release,
        hasUpdate: hasUpdate,
      );
      _latestCheckResult.value = res;
      return res;
    } catch (e) {
      final res = UpdateCheckResult(
        currentVersion: current,
        hasUpdate: false,
        errorMessage: 'アップデートの確認に失敗しました ($e)',
      );
      _latestCheckResult.value = res;
      return res;
    } finally {
      client.close(force: true);
    }
  }

  Future<ReleaseUpdateInfo?> _fetchFromVersionJson(HttpClient client) async {
    try {
      final request = await client.getUrl(
        Uri.parse(AppUpdater.latestVersionJsonUrl),
      );
      request.followRedirects = true;
      request.maxRedirects = 5;
      request.headers.set(HttpHeaders.acceptHeader, 'application/json');
      request.headers.set(
        HttpHeaders.userAgentHeader,
        'Whiteboard-Android-Updater',
      );
      final response = await request.close().timeout(
        const Duration(seconds: 12),
      );
      if (response.statusCode != HttpStatus.ok) {
        await response.drain<void>();
        return null;
      }
      final body = await response.transform(utf8.decoder).join();
      final decoded = jsonDecode(body);
      if (decoded is Map) {
        return ReleaseUpdateInfo.tryFromVersionJson(
          Map<String, dynamic>.from(decoded),
        );
      }
    } catch (_) {}
    return null;
  }

  Future<ReleaseUpdateInfo?> _fetchFromGitHubApi(HttpClient client) async {
    final request = await client.getUrl(
      Uri.parse(AppUpdater.latestReleaseApiUrl),
    );
    request.followRedirects = true;
    request.maxRedirects = 5;
    request.headers.set(
      HttpHeaders.acceptHeader,
      'application/vnd.github+json',
    );
    request.headers.set(
      HttpHeaders.userAgentHeader,
      'Whiteboard-Android-Updater',
    );
    final response = await request.close().timeout(
      const Duration(seconds: 12),
    );
    if (response.statusCode != HttpStatus.ok) {
      await response.drain<void>();
      return null;
    }
    final body = await response.transform(utf8.decoder).join();
    final decoded = jsonDecode(body);
    if (decoded is Map) {
      return ReleaseUpdateInfo.tryFromGitHubReleaseJson(
        Map<String, dynamic>.from(decoded),
      );
    }
    return null;
  }

  @override
  Future<bool> openExternalUrl(String url) async {
    try {
      final opened = await _channel.invokeMethod<bool>('openUrl', {'url': url});
      return opened ?? false;
    } catch (_) {
      return false;
    }
  }
}

AppUpdater createPlatformAppUpdater() => IoAppUpdater();
