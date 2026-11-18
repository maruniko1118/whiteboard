import 'package:material_ui/material_ui.dart';

import '../services/app_updater.dart';

Future<void> showAppUpdateDialog(
  BuildContext context, {
  required AppUpdater updater,
  UpdateCheckResult? initialResult,
}) async {
  await showDialog<void>(
    context: context,
    barrierDismissible: false,
    builder: (ctx) => _AppUpdateDialog(
      updater: updater,
      initialResult: initialResult,
    ),
  );
}

enum _UpdateStage {
  checking,
  upToDate,
  available,
  downloading,
  verifying,
  permissionRequired,
  launched,
  error,
}

class _AppUpdateDialog extends StatefulWidget {
  const _AppUpdateDialog({
    required this.updater,
    this.initialResult,
  });

  final AppUpdater updater;
  final UpdateCheckResult? initialResult;

  @override
  State<_AppUpdateDialog> createState() => _AppUpdateDialogState();
}

class _AppUpdateDialogState extends State<_AppUpdateDialog> {
  _UpdateStage _stage = _UpdateStage.checking;
  AppVersionInfo _currentVersion = const AppVersionInfo(
    version: '1.0.0',
    buildNumber: 1,
  );
  ReleaseUpdateInfo? _release;
  String? _downloadedApkPath;
  String? _errorMessage;
  int _receivedBytes = 0;
  int _totalBytes = 0;
  bool _cancelled = false;

  @override
  void initState() {
    super.initState();
    final initial = widget.initialResult;
    if (initial != null && initial.hasUpdate && initial.latestRelease != null) {
      _currentVersion = initial.currentVersion;
      _release = initial.latestRelease;
      _stage = _UpdateStage.available;
    } else {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) {
          _runCheck(emitCheckingState: false);
        }
      });
    }
  }

  @override
  void dispose() {
    _cancelled = true;
    super.dispose();
  }

  bool get _isBusy =>
      _stage == _UpdateStage.checking ||
      _stage == _UpdateStage.downloading ||
      _stage == _UpdateStage.verifying;

  Future<void> _runCheck({bool emitCheckingState = true}) async {
    if (emitCheckingState) {
      setState(() {
        _stage = _UpdateStage.checking;
        _errorMessage = null;
      });
    }

    final result = await widget.updater.checkForUpdate();
    if (!mounted) return;

    setState(() {
      _currentVersion = result.currentVersion;
      _release = result.latestRelease;
      if (result.errorMessage != null) {
        _stage = _UpdateStage.error;
        _errorMessage = result.errorMessage;
      } else if (result.hasUpdate && result.latestRelease != null) {
        _stage = _UpdateStage.available;
      } else {
        _stage = _UpdateStage.upToDate;
      }
    });
  }

  Future<void> _startDownloadAndInstall() async {
    final release = _release;
    if (release == null) return;

    _cancelled = false;
    setState(() {
      _stage = _UpdateStage.downloading;
      _receivedBytes = 0;
      _totalBytes = release.sizeBytes ?? 0;
      _errorMessage = null;
    });

    try {
      final path = await widget.updater.downloadApk(
        release,
        onProgress: (received, total) {
          if (!mounted) return;
          setState(() {
            _receivedBytes = received;
            if (total > 0) {
              _totalBytes = total;
            }
          });
        },
        isCancelled: () => _cancelled || !mounted,
      );
      if (!mounted) return;
      _downloadedApkPath = path;

      final expectedSha = release.sha256;
      if (expectedSha != null && expectedSha.isNotEmpty) {
        setState(() {
          _stage = _UpdateStage.verifying;
        });
        final verified = await widget.updater.verifyApkSha256(path, expectedSha);
        if (!mounted) return;
        if (!verified) {
          setState(() {
            _stage = _UpdateStage.error;
            _errorMessage = 'ダウンロードした APK の整合性検証 (SHA-256) に失敗しました。';
          });
          return;
        }
      }

      await _installDownloadedApk();
    } on UpdateCancelledException {
      if (!mounted) return;
      setState(() {
        _stage = _UpdateStage.available;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _stage = _UpdateStage.error;
        _errorMessage = 'アップデートのダウンロードに失敗しました ($e)';
      });
    }
  }

  Future<void> _installDownloadedApk() async {
    final path = _downloadedApkPath;
    if (path == null) {
      await _startDownloadAndInstall();
      return;
    }

    final installResult = await widget.updater.installApk(path);
    if (!mounted) return;

    switch (installResult) {
      case ApkInstallResult.launched:
        setState(() {
          _stage = _UpdateStage.launched;
        });
      case ApkInstallResult.permissionRequired:
        setState(() {
          _stage = _UpdateStage.permissionRequired;
        });
      case ApkInstallResult.failed:
        setState(() {
          _stage = _UpdateStage.error;
          _errorMessage = 'Android インストーラーの起動に失敗しました。';
        });
    }
  }

  String _formatBytes(int bytes) {
    if (bytes <= 0) return '0 B';
    const mb = 1024 * 1024;
    if (bytes >= mb) {
      return '${(bytes / mb).toStringAsFixed(1)} MB';
    }
    return '${(bytes / 1024).toStringAsFixed(0)} KB';
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return PopScope(
      canPop: !_isBusy,
      child: AlertDialog(
        icon: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: _stage == _UpdateStage.error
                ? colorScheme.errorContainer
                : colorScheme.primaryContainer,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(
            switch (_stage) {
              _UpdateStage.upToDate => Icons.check_circle_outline_rounded,
              _UpdateStage.error => Icons.error_outline_rounded,
              _UpdateStage.permissionRequired =>
                Icons.admin_panel_settings_outlined,
              _ => Icons.system_update_rounded,
            },
            size: 26,
            color: _stage == _UpdateStage.error
                ? colorScheme.onErrorContainer
                : colorScheme.onPrimaryContainer,
          ),
        ),
        title: Text(
          switch (_stage) {
            _UpdateStage.checking => 'アップデートを確認中',
            _UpdateStage.upToDate => '最新バージョンです',
            _UpdateStage.available => '新しいアップデートがあります',
            _UpdateStage.downloading => 'アップデートをダウンロード中',
            _UpdateStage.verifying => 'ファイルを検証中',
            _UpdateStage.permissionRequired => 'インストールの許可が必要です',
            _UpdateStage.launched => 'インストーラーを起動しました',
            _UpdateStage.error => 'アップデートエラー',
          },
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
        ),
        content: SizedBox(
          width: 320,
          child: _buildBody(colorScheme),
        ),
        actionsAlignment: MainAxisAlignment.end,
        actions: _buildActions(),
      ),
    );
  }

  Widget _buildBody(ColorScheme colorScheme) {
    switch (_stage) {
      case _UpdateStage.checking:
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            const LinearProgressIndicator(),
            const SizedBox(height: 14),
            Text(
              '現在のバージョン: ${_currentVersion.displayLabel}',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                color: colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        );

      case _UpdateStage.upToDate:
        return Text(
          '現在のバージョン (${_currentVersion.displayLabel}) は最新です。',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 13.5,
            color: colorScheme.onSurfaceVariant,
          ),
        );

      case _UpdateStage.available:
        final release = _release!;
        return Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: colorScheme.surfaceContainerLow,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: colorScheme.outlineVariant),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _currentVersion.displayLabel,
                    style: TextStyle(
                      fontSize: 13,
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                  Icon(
                    Icons.arrow_forward_rounded,
                    size: 16,
                    color: colorScheme.primary,
                  ),
                  Text(
                    release.tag,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: colorScheme.primary,
                    ),
                  ),
                ],
              ),
            ),
            if (release.sizeBytes != null && release.sizeBytes! > 0) ...[
              const SizedBox(height: 8),
              Text(
                'ダウンロードサイズ: ${_formatBytes(release.sizeBytes!)}',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 12,
                  color: colorScheme.onSurfaceVariant,
                ),
              ),
            ],
            if (release.notes != null && release.notes!.isNotEmpty) ...[
              const SizedBox(height: 10),
              Container(
                constraints: const BoxConstraints(maxHeight: 120),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: colorScheme.surfaceContainerLowest,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: colorScheme.outlineVariant),
                ),
                child: SingleChildScrollView(
                  child: Text(
                    release.notes!,
                    style: TextStyle(
                      fontSize: 12.5,
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                ),
              ),
            ],
          ],
        );

      case _UpdateStage.downloading:
        final hasTotal = _totalBytes > 0;
        final progress = hasTotal
            ? (_receivedBytes / _totalBytes).clamp(0.0, 1.0)
            : null;
        final percentText = hasTotal
            ? '${(progress! * 100).round()}%'
            : _formatBytes(_receivedBytes);
        final sizeText = hasTotal
            ? '${_formatBytes(_receivedBytes)} / ${_formatBytes(_totalBytes)}'
            : _formatBytes(_receivedBytes);

        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 6),
            LinearProgressIndicator(value: progress),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  sizeText,
                  style: TextStyle(
                    fontSize: 12.5,
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
                Text(
                  percentText,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: colorScheme.primary,
                  ),
                ),
              ],
            ),
          ],
        );

      case _UpdateStage.verifying:
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            const LinearProgressIndicator(),
            const SizedBox(height: 12),
            Text(
              'ダウンロードした APK の整合性 (SHA-256) を確認しています...',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                color: colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        );

      case _UpdateStage.permissionRequired:
        return Text(
          'アップデートをインストールするには、「設定を開く」からこのアプリの「不明なアプリのインストール」を許可し、戻ってから「インストールを再試行」を押してください。',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 13.5,
            color: colorScheme.onSurfaceVariant,
          ),
        );

      case _UpdateStage.launched:
        return Text(
          'Android のインストーラーを開きました。画面の案内に従ってアップデートを完了してください。',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 13.5,
            color: colorScheme.onSurfaceVariant,
          ),
        );

      case _UpdateStage.error:
        return Text(
          _errorMessage ?? '不明なエラーが発生しました。',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 13.5,
            color: colorScheme.onSurfaceVariant,
          ),
        );
    }
  }

  List<Widget> _buildActions() {
    switch (_stage) {
      case _UpdateStage.checking:
      case _UpdateStage.verifying:
        return const [
          TextButton(
            onPressed: null,
            child: Text('処理中...'),
          ),
        ];

      case _UpdateStage.upToDate:
        return [
          TextButton(
            onPressed: _runCheck,
            child: const Text('再確認'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('閉じる'),
          ),
        ];

      case _UpdateStage.available:
        return [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('あとで'),
          ),
          FilledButton.icon(
            onPressed: _startDownloadAndInstall,
            icon: const Icon(Icons.download_rounded, size: 18),
            label: const Text('今すぐアップデート'),
          ),
        ];

      case _UpdateStage.downloading:
        return [
          TextButton(
            onPressed: () {
              _cancelled = true;
            },
            child: const Text('キャンセル'),
          ),
        ];

      case _UpdateStage.permissionRequired:
        return [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('閉じる'),
          ),
          OutlinedButton(
            onPressed: () => widget.updater.openInstallPermissionSettings(),
            child: const Text('設定を開く'),
          ),
          FilledButton(
            onPressed: _installDownloadedApk,
            child: const Text('インストールを再試行'),
          ),
        ];

      case _UpdateStage.launched:
        return [
          TextButton(
            onPressed: _installDownloadedApk,
            child: const Text('再度開く'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('閉じる'),
          ),
        ];

      case _UpdateStage.error:
        return [
          TextButton(
            onPressed: () {
              final url = _release?.releaseUrl ?? AppUpdater.releasesPageUrl;
              widget.updater.openExternalUrl(url);
            },
            child: const Text('GitHub を開く'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('閉じる'),
          ),
          FilledButton(
            onPressed: _release != null ? _startDownloadAndInstall : _runCheck,
            child: const Text('再試行'),
          ),
        ];
    }
  }
}
