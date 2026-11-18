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
  Future<String> downloadApk(
    ReleaseUpdateInfo release, {
    void Function(int received, int total)? onProgress,
    bool Function()? isCancelled,
  }) async {
    final cacheDir = await _channel.invokeMethod<String>('getUpdateCacheDir');
    if (cacheDir == null || cacheDir.isEmpty) {
      throw StateError('アップデート保存先ディレクトリを取得できませんでした。');
    }

    final finalFile = File('$cacheDir/whiteboard.apk');
    final partFile = File('$cacheDir/whiteboard.apk.part');
    if (await finalFile.exists()) {
      await finalFile.delete();
    }
    if (await partFile.exists()) {
      await partFile.delete();
    }

    final client = HttpClient()
      ..connectionTimeout = const Duration(seconds: 15);
    IOSink? sink;
    try {
      final request = await client.getUrl(Uri.parse(release.apkUrl));
      request.followRedirects = true;
      request.maxRedirects = 8;
      request.headers.set(
        HttpHeaders.userAgentHeader,
        'Whiteboard-Android-Updater',
      );

      final response = await request.close();
      if (response.statusCode != HttpStatus.ok) {
        await response.drain<void>();
        throw HttpException(
          'APKのダウンロードに失敗しました (HTTP ${response.statusCode})',
          uri: Uri.parse(release.apkUrl),
        );
      }

      final contentLength = response.contentLength > 0
          ? response.contentLength
          : (release.sizeBytes ?? 0);

      sink = partFile.openWrite();
      var received = 0;

      await for (final chunk in response) {
        if (isCancelled?.call() == true) {
          throw const UpdateCancelledException();
        }
        sink.add(chunk);
        received += chunk.length;
        onProgress?.call(received, contentLength);
      }

      if (isCancelled?.call() == true) {
        throw const UpdateCancelledException();
      }

      await sink.flush();
      await sink.close();
      sink = null;

      await partFile.rename(finalFile.path);
      return finalFile.path;
    } catch (_) {
      await sink?.close();
      if (await partFile.exists()) {
        await partFile.delete();
      }
      rethrow;
    } finally {
      client.close(force: true);
    }
  }

  @override
  Future<bool> verifyApkSha256(String filePath, String expectedSha256) async {
    try {
      final ok = await _channel.invokeMethod<bool>('verifySha256', {
        'filePath': filePath,
        'expectedSha256': expectedSha256,
      });
      return ok ?? false;
    } catch (_) {
      return false;
    }
  }

  @override
  Future<bool> canInstallPackages() async {
    try {
      final allowed = await _channel.invokeMethod<bool>(
        'canRequestPackageInstalls',
      );
      return allowed ?? false;
    } catch (_) {
      return false;
    }
  }

  @override
  Future<void> openInstallPermissionSettings() async {
    try {
      await _channel.invokeMethod<bool>('openInstallPermissionSettings');
    } catch (_) {}
  }

  @override
  Future<ApkInstallResult> installApk(String filePath) async {
    try {
      final res = await _channel.invokeMethod<String>('installApk', {
        'filePath': filePath,
      });
      return switch (res) {
        'launched' => ApkInstallResult.launched,
        'permission_required' => ApkInstallResult.permissionRequired,
        _ => ApkInstallResult.failed,
      };
    } catch (_) {
      return ApkInstallResult.failed;
    }
  }

  @override
  Future<void> openExternalUrl(String url) async {
    try {
      await _channel.invokeMethod<bool>('openUrl', {'url': url});
    } catch (_) {}
  }
}

AppUpdater createPlatformAppUpdater() => IoAppUpdater();
