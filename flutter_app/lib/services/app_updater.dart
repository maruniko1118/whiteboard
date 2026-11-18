import 'package:flutter/foundation.dart';

import 'app_updater_io.dart'
    if (dart.library.js_interop) 'app_updater_web.dart';

class AppVersionInfo {
  const AppVersionInfo({
    required this.version,
    required this.buildNumber,
  });

  final String version;
  final int buildNumber;

  String get displayLabel =>
      buildNumber > 0 ? 'v$version ($buildNumber)' : 'v$version';
}

class ReleaseUpdateInfo {
  const ReleaseUpdateInfo({
    required this.version,
    required this.buildNumber,
    required this.tag,
    required this.apkUrl,
    this.releaseUrl,
    this.sha256,
    this.sizeBytes,
    this.notes,
    this.publishedAt,
  });

  final String version;
  final int buildNumber;
  final String tag;
  final String apkUrl;
  final String? releaseUrl;
  final String? sha256;
  final int? sizeBytes;
  final String? notes;
  final String? publishedAt;

  static ReleaseUpdateInfo? tryFromVersionJson(Map<String, dynamic> json) {
    final apkUrl = (json['apkUrl'] as String?)?.trim();
    if (apkUrl == null || !apkUrl.startsWith('https://')) {
      return null;
    }
    final rawTag = (json['tag'] as String?)?.trim() ?? '';
    final rawVersion = (json['version'] as String?)?.trim() ?? '';
    final normalizedVersion = _stripTagPrefix(
      rawVersion.isNotEmpty ? rawVersion : rawTag,
    );
    if (normalizedVersion.isEmpty) {
      return null;
    }

    final tag = rawTag.isNotEmpty ? rawTag : 'v$normalizedVersion';
    final rawBuild = json['buildNumber'];
    final buildNumber = rawBuild is num
        ? rawBuild.toInt()
        : int.tryParse(rawBuild?.toString() ?? '') ??
            _extractBuildNumberFromVersion(normalizedVersion);

    final rawSize = json['sizeBytes'];
    final sizeBytes = rawSize is num ? rawSize.toInt() : null;

    return ReleaseUpdateInfo(
      version: normalizedVersion,
      buildNumber: buildNumber,
      tag: tag,
      apkUrl: apkUrl,
      releaseUrl: (json['releaseUrl'] as String?)?.trim(),
      sha256: (json['sha256'] as String?)?.trim(),
      sizeBytes: sizeBytes,
      notes: (json['notes'] as String?)?.trim(),
      publishedAt: (json['publishedAt'] as String?)?.trim(),
    );
  }

  static ReleaseUpdateInfo? tryFromGitHubReleaseJson(
    Map<String, dynamic> json,
  ) {
    final tag = (json['tag_name'] as String?)?.trim();
    if (tag == null || tag.isEmpty) {
      return null;
    }
    final version = _stripTagPrefix(tag);
    if (version.isEmpty) {
      return null;
    }

    final assetsRaw = json['assets'];
    if (assetsRaw is! List) {
      return null;
    }

    Map<String, dynamic>? apkAsset;
    for (final item in assetsRaw.whereType<Map>()) {
      final mapped = Map<String, dynamic>.from(item);
      final name = (mapped['name'] as String?)?.toLowerCase() ?? '';
      if (name == 'whiteboard.apk') {
        apkAsset = mapped;
        break;
      }
      if (apkAsset == null && name.endsWith('.apk')) {
        apkAsset = mapped;
      }
    }

    final apkUrl = (apkAsset?['browser_download_url'] as String?)?.trim();
    if (apkUrl == null || !apkUrl.startsWith('https://')) {
      return null;
    }

    String? sha256;
    final digest = (apkAsset?['digest'] as String?)?.trim();
    if (digest != null && digest.isNotEmpty) {
      sha256 = digest.startsWith('sha256:')
          ? digest.substring('sha256:'.length)
          : digest;
    }

    final rawSize = apkAsset?['size'];
    final sizeBytes = rawSize is num ? rawSize.toInt() : null;

    return ReleaseUpdateInfo(
      version: version,
      buildNumber: _extractBuildNumberFromVersion(version),
      tag: tag,
      apkUrl: apkUrl,
      releaseUrl: (json['html_url'] as String?)?.trim(),
      sha256: sha256,
      sizeBytes: sizeBytes,
      notes: (json['body'] as String?)?.trim(),
      publishedAt: (json['published_at'] as String?)?.trim(),
    );
  }

  static String _stripTagPrefix(String raw) {
    var clean = raw.trim();
    if (clean.startsWith('v') || clean.startsWith('V')) {
      clean = clean.substring(1);
    }
    return clean;
  }

  static int _extractBuildNumberFromVersion(String version) {
    final match = RegExp(r'^\d+\.\d+\.(\d+)').firstMatch(version.trim());
    if (match == null) return 0;
    return int.tryParse(match.group(1)!) ?? 0;
  }
}

class UpdateCheckResult {
  const UpdateCheckResult({
    required this.currentVersion,
    this.latestRelease,
    required this.hasUpdate,
    this.errorMessage,
  });

  final AppVersionInfo currentVersion;
  final ReleaseUpdateInfo? latestRelease;
  final bool hasUpdate;
  final String? errorMessage;
}

enum ApkInstallResult {
  launched,
  permissionRequired,
  failed,
}

class UpdateCancelledException implements Exception {
  const UpdateCancelledException();

  @override
  String toString() => 'Update download was cancelled.';
}

abstract class AppUpdater {
  static const String latestVersionJsonUrl =
      'https://github.com/maruniko1118/whiteboard/releases/latest/download/version.json';
  static const String latestReleaseApiUrl =
      'https://api.github.com/repos/maruniko1118/whiteboard/releases/latest';
  static const String releasesPageUrl =
      'https://github.com/maruniko1118/whiteboard/releases';

  bool get isSupported;

  ValueListenable<UpdateCheckResult?> get latestCheckResult;

  Future<AppVersionInfo> getCurrentVersion();

  Future<UpdateCheckResult> checkForUpdate();

  Future<String> downloadApk(
    ReleaseUpdateInfo release, {
    void Function(int received, int total)? onProgress,
    bool Function()? isCancelled,
  });

  Future<bool> verifyApkSha256(String filePath, String expectedSha256);

  Future<bool> canInstallPackages();

  Future<void> openInstallPermissionSettings();

  Future<ApkInstallResult> installApk(String filePath);

  Future<void> openExternalUrl(String url);

  static int compareSemVer(String a, String b) {
    List<int> parse(String raw) {
      var clean = raw.trim();
      if (clean.startsWith('v') || clean.startsWith('V')) {
        clean = clean.substring(1);
      }
      clean = clean.split('+').first.split('-').first;
      if (clean.isEmpty) return [0];
      return clean
          .split('.')
          .map((part) => int.tryParse(part.trim()) ?? 0)
          .toList();
    }

    final pa = parse(a);
    final pb = parse(b);
    final len = pa.length > pb.length ? pa.length : pb.length;
    for (var i = 0; i < len; i++) {
      final va = i < pa.length ? pa[i] : 0;
      final vb = i < pb.length ? pb[i] : 0;
      if (va != vb) return va.compareTo(vb);
    }
    return 0;
  }

  static bool isNewerVersion({
    required AppVersionInfo current,
    required ReleaseUpdateInfo remote,
  }) {
    final semverCmp = compareSemVer(remote.version, current.version);
    if (semverCmp != 0) {
      return semverCmp > 0;
    }
    if (remote.buildNumber > 0 && current.buildNumber > 0) {
      return remote.buildNumber > current.buildNumber;
    }
    return false;
  }
}

AppUpdater createAppUpdater() => createPlatformAppUpdater();
