import React from 'react';
import CodeEditor from '@/core/CodeEditor';

const textContent = `function run() {
  const text = 'hello, world!';
  console.log(text);
}
`;

function App() {
	return (
		<div id="app">
			<CodeEditor language="javascript" textContent={textContent} />
		</div>
	);
}

export default App;
