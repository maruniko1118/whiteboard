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
  openedBrowser,
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
  AppVersionInfo? _currentVersion;
  ReleaseUpdateInfo? _release;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    final initial = widget.initialResult;
    _currentVersion =
        initial?.currentVersion ?? widget.updater.latestCheckResult.value?.currentVersion;
    if (initial != null && initial.hasUpdate && initial.latestRelease != null) {
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

  bool get _isBusy => _stage == _UpdateStage.checking;

  Future<void> _runCheck({bool emitCheckingState = true}) async {
    if (emitCheckingState) {
      setState(() {
        _stage = _UpdateStage.checking;
        _errorMessage = null;
      });
    }

    if (_currentVersion == null) {
      final current = await widget.updater.getCurrentVersion();
      if (!mounted) return;
      setState(() {
        _currentVersion = current;
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

  Future<void> _openDownloadInBrowser() async {
    final release = _release;
    if (release == null) return;

    final opened = await widget.updater.openExternalUrl(release.apkUrl);
    if (!mounted) return;

    if (opened) {
      setState(() {
        _stage = _UpdateStage.openedBrowser;
      });
    } else {
      setState(() {
        _stage = _UpdateStage.error;
        _errorMessage = 'ブラウザでダウンロードページを開けませんでした。';
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
              _UpdateStage.openedBrowser => Icons.open_in_browser_rounded,
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
            _UpdateStage.openedBrowser => 'ブラウザでダウンロードを開始しました',
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
    final versionLabel = _currentVersion?.displayLabel;
    switch (_stage) {
      case _UpdateStage.checking:
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            const LinearProgressIndicator(),
            if (versionLabel != null) ...[
              const SizedBox(height: 14),
              Text(
                '現在のバージョン: $versionLabel',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 13,
                  color: colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ],
        );

      case _UpdateStage.upToDate:
        return Text(
          versionLabel != null
              ? '現在のバージョン ($versionLabel) は最新です。'
              : '現在のバージョンは最新です。',
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
              child: Wrap(
                alignment: WrapAlignment.center,
                crossAxisAlignment: WrapCrossAlignment.center,
                spacing: 10,
                runSpacing: 4,
                children: [
                  if (versionLabel != null) ...[
                    Text(
                      versionLabel,
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
                  ],
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

      case _UpdateStage.openedBrowser:
        return Text(
          'ブラウザで最新版の APK (${_release?.tag ?? ''}) のダウンロードを開きました。ダウンロード完了後、通知またはファイルアプリから開いて上書きインストールしてください。',
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
        return const [
          TextButton(
            onPressed: null,
            child: Text('確認中...'),
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
            onPressed: _openDownloadInBrowser,
            icon: const Icon(Icons.open_in_browser_rounded, size: 18),
            label: const Text('ダウンロード'),
          ),
        ];

      case _UpdateStage.openedBrowser:
        return [
          if (_release?.releaseUrl != null)
            TextButton(
              onPressed: () =>
                  widget.updater.openExternalUrl(_release!.releaseUrl!),
              child: const Text('GitHub を開く'),
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
            onPressed: _runCheck,
            child: const Text('再試行'),
          ),
        ];
    }
  }
}
