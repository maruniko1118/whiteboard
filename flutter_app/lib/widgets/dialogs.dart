import 'package:material_ui/material_ui.dart';

Future<String?> showRenameBoardDialog(
  BuildContext context, {
  required String currentTitle,
}) async {
  final controller = TextEditingController(text: currentTitle);
  controller.selection = TextSelection(
    baseOffset: 0,
    extentOffset: currentTitle.length,
  );

  final result = await showDialog<String>(
    context: context,
    builder: (ctx) {
      final colorScheme = Theme.of(ctx).colorScheme;
      return AlertDialog(
        icon: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: colorScheme.primaryContainer,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(
            Icons.edit_outlined,
            color: colorScheme.onPrimaryContainer,
          ),
        ),
        title: const Text(
          'ボード名の変更',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
        ),
        content: TextField(
          controller: controller,
          autofocus: true,
          maxLength: 60,
          decoration: InputDecoration(
            hintText: 'ボード名を入力...',
            counterText: '',
            filled: true,
            fillColor: colorScheme.surfaceContainerLowest,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
            ),
          ),
          onSubmitted: (value) => Navigator.of(ctx).pop(value.trim()),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('キャンセル'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(ctx).pop(controller.text.trim()),
            child: const Text('変更を保存'),
          ),
        ],
      );
    },
  );

  controller.dispose();
  return result;
}

Future<bool> showConfirmActionDialog(
  BuildContext context, {
  required String title,
  required String message,
  required String confirmLabel,
}) async {
  final result = await showDialog<bool>(
    context: context,
    builder: (ctx) {
      final colorScheme = Theme.of(ctx).colorScheme;
      return AlertDialog(
        icon: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: colorScheme.errorContainer,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(
            Icons.delete_outline_rounded,
            color: colorScheme.onErrorContainer,
          ),
        ),
        title: Text(
          title,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
        ),
        content: Text(
          message,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 13.5,
            color: colorScheme.onSurfaceVariant,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('キャンセル'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            style: FilledButton.styleFrom(
              backgroundColor: colorScheme.error,
              foregroundColor: colorScheme.onError,
            ),
            child: Text(confirmLabel),
          ),
        ],
      );
    },
  );

  return result ?? false;
}
