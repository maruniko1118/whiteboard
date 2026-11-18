import 'package:material_ui/material_ui.dart';
import '../models/whiteboard_models.dart';

class SeedPreset {
  const SeedPreset({
    required this.hex,
    required this.label,
    required this.color,
  });

  final String hex;
  final String label;
  final Color color;
}

class PenPresetColor {
  const PenPresetColor({
    required this.key,
    required this.label,
    required this.shortcut,
    required this.lightSwatch,
    required this.lightStroke,
    required this.darkStroke,
  });

  final String key;
  final String label;
  final String shortcut;
  final Color lightSwatch;
  final Color lightStroke;
  final Color darkStroke;
}

class AppTheme {
  static const List<SeedPreset> seedPresets = [
    SeedPreset(
      hex: '#6750A4',
      label: 'Expressive Violet',
      color: Color(0xFF6750A4),
    ),
    SeedPreset(
      hex: '#0061A4',
      label: 'Ocean Blue',
      color: Color(0xFF0061A4),
    ),
    SeedPreset(
      hex: '#006C4C',
      label: 'Emerald Green',
      color: Color(0xFF006C4C),
    ),
    SeedPreset(
      hex: '#984061',
      label: 'Expressive Rose',
      color: Color(0xFF984061),
    ),
    SeedPreset(
      hex: '#8B5000',
      label: 'Warm Amber',
      color: Color(0xFF8B5000),
    ),
  ];

  static const List<PenPresetColor> penPresets = [
    PenPresetColor(
      key: 'black',
      label: '黒 (ダーク時は白)',
      shortcut: '1',
      lightSwatch: Color(0xFF0F172A),
      lightStroke: Color(0xFF0F172A),
      darkStroke: Color(0xFFFFFFFF),
    ),
    PenPresetColor(
      key: 'red',
      label: 'レッド',
      shortcut: '2',
      lightSwatch: Color(0xFFEF4444),
      lightStroke: Color(0xFFEF4444),
      darkStroke: Color(0xFFF87171),
    ),
    PenPresetColor(
      key: 'orange',
      label: 'オレンジ',
      shortcut: '3',
      lightSwatch: Color(0xFFF97316),
      lightStroke: Color(0xFFF97316),
      darkStroke: Color(0xFFFB923C),
    ),
    PenPresetColor(
      key: 'yellow',
      label: 'イエロー',
      shortcut: '4',
      lightSwatch: Color(0xFFEAB308),
      lightStroke: Color(0xFFD97706),
      darkStroke: Color(0xFFFACC15),
    ),
    PenPresetColor(
      key: 'green',
      label: 'エメラルド',
      shortcut: '5',
      lightSwatch: Color(0xFF10B981),
      lightStroke: Color(0xFF10B981),
      darkStroke: Color(0xFF34D399),
    ),
    PenPresetColor(
      key: 'blue',
      label: 'ブルー',
      shortcut: '6',
      lightSwatch: Color(0xFF3B82F6),
      lightStroke: Color(0xFF2563EB),
      darkStroke: Color(0xFF60A5FA),
    ),
    PenPresetColor(
      key: 'purple',
      label: 'バイオレット',
      shortcut: '7',
      lightSwatch: Color(0xFF8B5CF6),
      lightStroke: Color(0xFF8B5CF6),
      darkStroke: Color(0xFFA78BFA),
    ),
  ];

  static const Map<String, Color> _lightExtra = {
    'pink': Color(0xFFEC4899),
  };
  static const Map<String, Color> _darkExtra = {
    'pink': Color(0xFFF472B6),
  };

  static Color colorFromHex(String hex, {Color fallback = const Color(0xFF6750A4)}) {
    var clean = hex.trim().replaceFirst('#', '');
    if (clean.length == 6) {
      clean = 'FF$clean';
    }
    final parsed = int.tryParse(clean, radix: 16);
    if (parsed == null) return fallback;
    return Color(parsed);
  }

  static String colorToHex(Color color) {
    final r = (color.r * 255).round().toRadixString(16).padLeft(2, '0');
    final g = (color.g * 255).round().toRadixString(16).padLeft(2, '0');
    final b = (color.b * 255).round().toRadixString(16).padLeft(2, '0');
    return '#$r$g$b'.toUpperCase();
  }

  static Color resolveStrokeColor(Stroke stroke, Brightness brightness) {
    if (stroke.colorKey == 'custom' && stroke.customColor != null) {
      return colorFromHex(stroke.customColor!);
    }
    if (stroke.colorKey.startsWith('#')) {
      return colorFromHex(stroke.colorKey);
    }
    final isDark = brightness == Brightness.dark;
    for (final preset in penPresets) {
      if (preset.key == stroke.colorKey) {
        return isDark ? preset.darkStroke : preset.lightStroke;
      }
    }
    final extra = isDark ? _darkExtra[stroke.colorKey] : _lightExtra[stroke.colorKey];
    if (extra != null) return extra;
    if (stroke.customColor != null) {
      return colorFromHex(stroke.customColor!);
    }
    return isDark ? const Color(0xFFFFFFFF) : const Color(0xFF0F172A);
  }

  static Color dotGridColor(Brightness brightness) {
    return brightness == Brightness.dark
        ? const Color.fromRGBO(202, 196, 208, 0.16)
        : const Color.fromRGBO(121, 116, 126, 0.24);
  }

  static ThemeData buildTheme({
    required String seedHex,
    required Brightness brightness,
  }) {
    final seedColor = colorFromHex(seedHex);
    final colorScheme = ColorScheme.fromSeed(
      seedColor: seedColor,
      brightness: brightness,
      dynamicSchemeVariant: DynamicSchemeVariant.expressive,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      fontFamily: 'Plus Jakarta Sans',
      fontFamilyFallback: const ['Noto Sans JP', 'sans-serif'],
      scaffoldBackgroundColor: colorScheme.surfaceContainer,
      dialogTheme: DialogThemeData(
        backgroundColor: colorScheme.surfaceContainerHigh,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }
}
