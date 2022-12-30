import Button from './components/button/button';
import { renderDom } from './utils/renderDOM';

const button = new Button({
	name: 'my-class',
	text: 'Click me',
	class: 'class',
});
renderDom('#root', button);
