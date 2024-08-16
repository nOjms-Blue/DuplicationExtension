import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('duplicateshortcut.duplicate', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const position = editor.selection.active;
			const line = editor.document.lineAt(position.line);
			if (!editor.selection.isEmpty) {
				const text = editor.document.getText(editor.selection);

				editor.edit(builder => {
					builder.insert(position, text);
				})
					.then((resp) => {
						if (resp) {
							if (editor.document.getText(editor.selection) == text + text) {
								const newEnd = (editor.selection.end.character - text.length) > editor.selection.start.character ? editor.selection.end.translate(0, -1 * text.length) : editor.selection.end;
								editor.selection = new vscode.Selection(editor.selection.start, newEnd);
							}
						}
					});
			} else {
				editor.edit(builder => {
					builder.insert(line.range.end, `\n${line.text}`);
				});
			}
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
