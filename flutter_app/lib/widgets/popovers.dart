import 'package:material_ui/material_ui.dart';

import '../models/whiteboard_models.dart';
import '../theme/app_theme.dart';

Future<void> showSeedPickerDialog(
  BuildContext context, {
  required String currentSeedHex,
  required ValueChanged<String> onSelectSeed,
}) async {
  await showDialog<void>(
    context: context,
    builder: (ctx) {
      final colorScheme = Theme.of(ctx).colorScheme;
      final isCompactHeight = MediaQuery.sizeOf(ctx).height <= 520;
      return AlertDialog(
        insetPadding: isCompactHeight
            ? const EdgeInsets.symmetric(horizontal: 16, vertical: 10)
            : const EdgeInsets.symmetric(horizontal: 40, vertical: 24),
        title: const Text(
          'M3 Expressive テーマカラー',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        ),
        content: SingleChildScrollView(
          child: Wrap(
            spacing: 12,
            runSpacing: 12,
            alignment: WrapAlignment.center,
            children: [
              for (final preset in AppTheme.seedPresets)
                Tooltip(
                  message: preset.label,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(24),
                    onTap: () {
                      onSelectSeed(preset.hex);
                      Navigator.of(ctx).pop();
                    },
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: preset.color,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: currentSeedHex.toUpperCase() ==
                                  preset.hex.toUpperCase()
                              ? colorScheme.onSurface
                              : Colors.transparent,
                          width: 3,
                        ),
                      ),
                      child: currentSeedHex.toUpperCase() ==
                              preset.hex.toUpperCase()
                          ? const Icon(Icons.check_rounded, color: Colors.white)
                          : null,
                    ),
                  ),
                ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('閉じる'),
          ),
        ],
      );
    },
  );
}

Future<void> showBackupMenuDialog(
  BuildContext context, {
  required VoidCallback onExportJson,
  required VoidCallback onImportJson,
}) async {
  await showDialog<void>(
    context: context,
    builder: (ctx) {
      final colorScheme = Theme.of(ctx).colorScheme;
      final isCompactHeight = MediaQuery.sizeOf(ctx).height <= 520;
      return AlertDialog(
        insetPadding: isCompactHeight
            ? const EdgeInsets.symmetric(horizontal: 16, vertical: 10)
            : const EdgeInsets.symmetric(horizontal: 40, vertical: 24),
        title: const Text(
          'ボードデータ管理',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        ),
        content: SizedBox(
          width: 280,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                  leading: Icon(
                    Icons.download_rounded,
                    color: colorScheme.primary,
                  ),
                  title: const Text(
                    '全ボードをJSON保存',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                  ),
                  onTap: () {
                    Navigator.of(ctx).pop();
                    onExportJson();
                  },
                ),
                const SizedBox(height: 6),
                ListTile(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                  leading: Icon(
                    Icons.upload_rounded,
                    color: colorScheme.primary,
                  ),
                  title: const Text(
                    'JSONバックアップから復元',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                  ),
                  onTap: () {
                    Navigator.of(ctx).pop();
                    onImportJson();
                  },
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('閉じる'),
          ),
        ],
      );
    },
  );
}

Future<void> showWidthSliderDialog(
  BuildContext context, {
  required double initialWidth,
  required ValueChanged<double> onChanged,
}) async {
  await showDialog<void>(
    context: context,
    builder: (ctx) {
      var widthVal = initialWidth;
      return StatefulBuilder(
        builder: (ctx, setState) {
          final colorScheme = Theme.of(ctx).colorScheme;
          final isCompactHeight = MediaQuery.sizeOf(ctx).height <= 520;
          final presets = [
            (label: '細 2px', value: 2.0),
            (label: '中 5px', value: 5.0),
            (label: '太 12px', value: 12.0),
            (label: '極太 24px', value: 24.0),
          ];

          return AlertDialog(
            insetPadding: isCompactHeight
                ? const EdgeInsets.symmetric(horizontal: 16, vertical: 10)
                : const EdgeInsets.symmetric(horizontal: 40, vertical: 24),
            title: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  '線の太さ',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: colorScheme.primaryContainer,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${widthVal.round()} px',
                    style: TextStyle(
                      fontFamily: 'JetBrains Mono',
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: colorScheme.onPrimaryContainer,
                    ),
                  ),
                ),
              ],
            ),
            content: SizedBox(
              width: 300,
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      height: isCompactHeight ? 42 : 64,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: colorScheme.surfaceContainerLowest,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: colorScheme.outlineVariant),
                      ),
                      alignment: Alignment.center,
                      child: Container(
                        width: widthVal.clamp(1.0, isCompactHeight ? 34.0 : 48.0),
                        height: widthVal.clamp(1.0, isCompactHeight ? 34.0 : 48.0),
                        decoration: BoxDecoration(
                          color: colorScheme.onSurface,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                    SizedBox(height: isCompactHeight ? 8 : 14),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: [
                        for (final p in presets)
                          ChoiceChip(
                            label: Text(p.label),
                            selected: widthVal.round() == p.value.round(),
                            onSelected: (_) {
                              setState(() => widthVal = p.value);
                              onChanged(p.value);
                            },
                          ),
                      ],
                    ),
                    SizedBox(height: isCompactHeight ? 4 : 10),
                    Slider(
                      value: widthVal,
                      min: 1,
                      max: 48,
                      divisions: 47,
                      label: '${widthVal.round()}px',
                      onChanged: (v) {
                        final rounded = v.roundToDouble();
                        setState(() => widthVal = rounded);
                        onChanged(rounded);
                      },
                    ),
                  ],
                ),
              ),
            ),
            actions: [
              FilledButton(
                onPressed: () => Navigator.of(ctx).pop(),
                child: const Text('閉じる'),
              ),
            ],
          );
        },
      );
    },
  );
}

Future<void> showColorStudioDialog(
  BuildContext context, {
  required String initialHex,
  required List<String> savedColors,
  required ValueChanged<String> onSaveCustomColor,
  required ValueChanged<String> onApplyCustomColor,
}) async {
  var hsv = HSVColor.fromColor(AppTheme.colorFromHex(initialHex));
  var hexController = TextEditingController(text: initialHex.toUpperCase());
  var localSaved = List<String>.from(savedColors);

  await showDialog<void>(
    context: context,
    builder: (ctx) {
      return StatefulBuilder(
        builder: (ctx, setState) {
          final colorScheme = Theme.of(ctx).colorScheme;
          final isCompactHeight = MediaQuery.sizeOf(ctx).height <= 520;
          final currentColor = hsv.toColor();
          final currentHex = AppTheme.colorToHex(currentColor);

          void updateFromHsv(HSVColor next) {
            hsv = next;
            final nextHex = AppTheme.colorToHex(hsv.toColor());
            hexController.text = nextHex;
            setState(() {});
          }

          return AlertDialog(
            insetPadding: isCompactHeight
                ? const EdgeInsets.symmetric(horizontal: 16, vertical: 10)
                : const EdgeInsets.symmetric(horizontal: 40, vertical: 24),
            title: const Text(
              'カラーピッカー',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
            content: SizedBox(
              width: 280,
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // 2D Saturation / Value Spectrum
                    SizedBox(
                      height: isCompactHeight ? 96 : 140,
                      child: LayoutBuilder(
                        builder: (context, constraints) {
                          void pickAt(Offset local) {
                            final s = (local.dx / constraints.maxWidth)
                                .clamp(0.0, 1.0);
                            final v = (1.0 - local.dy / constraints.maxHeight)
                                .clamp(0.0, 1.0);
                            updateFromHsv(
                              hsv.withSaturation(s).withValue(v),
                            );
                          }

                          return GestureDetector(
                            onPanDown: (d) => pickAt(d.localPosition),
                            onPanUpdate: (d) => pickAt(d.localPosition),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(14),
                              child: Stack(
                                children: [
                                  CustomPaint(
                                    size: Size(
                                      constraints.maxWidth,
                                      constraints.maxHeight,
                                    ),
                                    painter: _HsvSpectrumPainter(hsv.hue),
                                  ),
                                  Positioned(
                                    left: hsv.saturation * constraints.maxWidth - 8,
                                    top: (1 - hsv.value) * constraints.maxHeight - 8,
                                    child: Container(
                                      width: 16,
                                      height: 16,
                                      decoration: BoxDecoration(
                                        color: currentColor,
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                          color: Colors.white,
                                          width: 2.5,
                                        ),
                                        boxShadow: const [
                                          BoxShadow(
                                            color: Colors.black38,
                                            blurRadius: 4,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 12),
                    // Hue Slider
                    SliderTheme(
                      data: SliderTheme.of(ctx).copyWith(
                        trackHeight: 10,
                        thumbShape: const RoundSliderThumbShape(
                          enabledThumbRadius: 9,
                        ),
                      ),
                      child: Slider(
                        value: hsv.hue,
                        min: 0,
                        max: 360,
                        activeColor: HSVColor.fromAHSV(1, hsv.hue, 1, 1).toColor(),
                        onChanged: (h) {
                          updateFromHsv(hsv.withHue(h));
                        },
                      ),
                    ),
                    const SizedBox(height: 8),
                    // Preview + HEX Input + Save to My Colors
                    Row(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: currentColor,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: colorScheme.outlineVariant),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: TextField(
                            controller: hexController,
                            maxLength: 7,
                            style: const TextStyle(
                              fontFamily: 'JetBrains Mono',
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                            decoration: InputDecoration(
                              isDense: true,
                              counterText: '',
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 10,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            onChanged: (raw) {
                              var val = raw.trim();
                              if (!val.startsWith('#')) val = '#$val';
                              if (AppStateData.hexPattern.hasMatch(val)) {
                                setState(() {
                                  hsv = HSVColor.fromColor(
                                    AppTheme.colorFromHex(val),
                                  );
                                });
                              }
                            },
                          ),
                        ),
                        const SizedBox(width: 8),
                        FilledButton.tonalIcon(
                          onPressed: () {
                            onSaveCustomColor(currentHex);
                            final norm = currentHex.toLowerCase();
                            localSaved.removeWhere(
                              (c) => c.toLowerCase() == norm,
                            );
                            localSaved.insert(0, norm);
                            if (localSaved.length > 12) {
                              localSaved = localSaved.take(12).toList();
                            }
                            setState(() {});
                          },
                          icon: const Icon(Icons.add_rounded, size: 18),
                          label: const Text('保存'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Text(
                      'マイカラー (タップで選択)',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final hex in localSaved)
                          InkWell(
                            borderRadius: BorderRadius.circular(14),
                            onTap: () {
                              updateFromHsv(
                                HSVColor.fromColor(AppTheme.colorFromHex(hex)),
                              );
                            },
                            child: Container(
                              width: 28,
                              height: 28,
                              decoration: BoxDecoration(
                                color: AppTheme.colorFromHex(hex),
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: currentHex.toLowerCase() ==
                                          hex.toLowerCase()
                                      ? colorScheme.primary
                                      : colorScheme.outlineVariant,
                                  width: currentHex.toLowerCase() ==
                                          hex.toLowerCase()
                                      ? 2.5
                                      : 1.5,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: () {
                        onApplyCustomColor(currentHex);
                        Navigator.of(ctx).pop();
                      },
                      child: const Text('この色を選択して閉じる'),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      );
    },
  );

  hexController.dispose();
}

class _HsvSpectrumPainter extends CustomPainter {
  _HsvSpectrumPainter(this.hue);

  final double hue;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final pureColor = HSVColor.fromAHSV(1.0, hue, 1.0, 1.0).toColor();

    canvas.drawRect(rect, Paint()..color = pureColor);

    final whiteGrad = LinearGradient(
      begin: Alignment.centerLeft,
      end: Alignment.centerRight,
      colors: [Colors.white, Colors.white.withValues(alpha: 0)],
    );
    canvas.drawRect(
      rect,
      Paint()..shader = whiteGrad.createShader(rect),
    );

    final blackGrad = LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [Colors.black.withValues(alpha: 0), Colors.black],
    );
    canvas.drawRect(
      rect,
      Paint()..shader = blackGrad.createShader(rect),
    );
  }

  @override
  bool shouldRepaint(covariant _HsvSpectrumPainter oldDelegate) {
    return oldDelegate.hue != hue;
  }
}
