import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, Plugin, Modal } from 'obsidian';
import CodeEditor from './CodeEditor';
import './index.less';

class CodeEditorModal extends Modal {
	plugin: Plugin;

	constructor(plugin: Plugin) {
		super(plugin.app);
		this.plugin = plugin;
	}

	// 调用 Modal 的 open 方法是触发的回调函数
	onOpen() {
		const obsidianEditor = this.plugin.app.workspace.activeEditor?.editor!;
		const [startLine, endLine, language] = getBoundaryLines(obsidianEditor, '```');
		const textContent = getEditorContent(obsidianEditor, startLine + 1, endLine - 1);

		// 设置 Modal 的宽高
		this.modalEl.setCssProps({
			'--dialog-width': '80vw',
			'--dialog-height': '80vh',
		});
		// 将 CodeEditor 组件挂载到 Modal 的 contentEl

		ReactDOM.render(<CodeEditor language={language} textContent={textContent} onUnmount={(editorValue) => {
			const obsidianEditor = this.plugin.app.workspace.activeEditor?.editor!;
			const [startLine, endLine] = getBoundaryLines(obsidianEditor, '```');
			obsidianEditor?.replaceRange(
				`${editorValue}\n`,
				{ line: startLine + 1, ch: 0 }, // 替换代码块内容的起始位置
				{ line: endLine, ch: 0 }, // 替换代码块内容的结束位置
			);
		}}/>, this.contentEl);
	}
	// 调用 Modal 的 close 方法是触发的回调函数
	onClose() {
		ReactDOM.unmountComponentAtNode(this.contentEl);
		this.contentEl.empty();
	}
}

export default CodeEditorModal;

function getBoundaryLines(editor: Editor, target: string): [number, number, string] {
	const cursor = editor.getCursor();
	let startLine = cursor.line;
	let endLine = cursor.line;

	// Find the upper boundary line
	for (let i = startLine; i >= 0; i--) {
		if (editor.getLine(i).includes(target)) {
			startLine = i;
			break;
		}
	}

	// Find the lower boundary line
	const lineCount = editor.lineCount();
	for (let i = endLine; i < lineCount; i++) {
		if (editor.getLine(i).includes(target)) {
			endLine = i;
			break;
		}
	}

	const languageKey = editor.getLine(startLine).split('```')[1].trim();
	const language = matchLanguage(languageKey)!;

	return [startLine, endLine, language];
}


function matchLanguage(languageKey: string) {
	switch (languageKey) {
		case 'js':
		case 'es6':
		case 'jsx':
		case 'cjs':
		case 'mjs':
			return 'javascript';
		case 'ts':
		case 'tsx':
		case 'cts':
		case 'mts':
			return 'typescript';
		case 'css':
			return 'css';
		case 'html':
		case 'htm':
		case 'shtml':
		case 'xhtml':
		case 'mdoc':
		case 'jsp':
		case 'asp':
		case 'aspx':
		case 'jshtm':
			return 'html';
		case 'json':
			return 'json';
	}
}

function getEditorContent(editor: Editor, startLine: number, endLine: number): string {
	const editorContent = editor.getRange({ line: startLine, ch: 0 }, { line: endLine + 1, ch: 0 });
	return editorContent.trimEnd();
	// 优化以下的代码
	// const lines = [];
	// for (let i = startLine; i <= endLine; i++) {
	// 	lines.push(editor.getLine(i));
	// }
	// return lines.join('\n');
}
