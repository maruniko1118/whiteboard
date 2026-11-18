import 'package:material_ui/material_ui.dart';

import 'services/board_storage.dart';
import 'theme/app_theme.dart';
import 'widgets/whiteboard_home.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final storage = BoardStorage();
  await storage.init();
  runApp(WhiteboardApp(storage: storage));
}

class WhiteboardApp extends StatefulWidget {
  const WhiteboardApp({super.key, required this.storage});

  final BoardStorage storage;

  @override
  State<WhiteboardApp> createState() => _WhiteboardAppState();
}

class _WhiteboardAppState extends State<WhiteboardApp> {
  late String _themeMode;
  late String _seedHex;

  @override
  void initState() {
    super.initState();
    _themeMode = widget.storage.state.theme;
    _seedHex = widget.storage.state.seedColor;
  }

  void _handleThemeChanged(String theme, String seedColor) {
    setState(() {
      _themeMode = theme;
      _seedHex = seedColor;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = _themeMode == 'dark';
    return MaterialApp(
      title: 'Whiteboard — Material 3 Expressive',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.buildTheme(
        seedHex: _seedHex,
        brightness: Brightness.light,
      ),
      darkTheme: AppTheme.buildTheme(
        seedHex: _seedHex,
        brightness: Brightness.dark,
      ),
      themeMode: isDark ? ThemeMode.dark : ThemeMode.light,
      home: WhiteboardHome(
        storage: widget.storage,
        onThemeChanged: _handleThemeChanged,
      ),
    );
  }
}
