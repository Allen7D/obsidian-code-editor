import React from 'react';
import MonacoEditor from 'react-monaco-editor';

import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import 'monaco-editor/esm/vs/basic-languages/html/html.contribution';
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution';

interface CodeEditorProps {
	language: string;
	textContent: string;
	onUnmount?: (editorValue: string) => void;
}

const options = {
	selectOnLineNumbers: true, // 显示行号（默认true）
	roundedSelection: false, //
	readOnly: false, // 是否切换只读（默认false）
	// cursorStyle: 'line', // 光标样式
	automaticLayout: true, // 自适应布局（默认为true）
	fontSize: 14, // 字体大小
	tabSize: 2, // tab 缩进长度(包括回车换行后的自动缩进)
	scrollBeyondLastLine: false, // 取消代码后面一大段空白（为true时，editor的高度会大于父容器）
	contextmenu: true, // 编辑器原生的右键菜单
};

const CodeEditor = (props: CodeEditorProps) => {
	const { language, textContent, onUnmount = (monacoEditor) => {} } = props;
	const [value, setValue] = React.useState<string>('');

	return (
		<MonacoEditor
			options={options}
			width="100%"
			height="600"
			language={language}
			theme="vs-dark"
			value={value}
			editorDidMount={() => {
				setValue(textContent);
			}}
			editorWillUnmount={(monacoEditor) => {
				const editorValue = monacoEditor.getValue();
				onUnmount(editorValue);
				monacoEditor.dispose();
			}}
		/>
	);
};

export default CodeEditor;
