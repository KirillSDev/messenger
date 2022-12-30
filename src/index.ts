import * as Handlebars from 'handlebars';
import template from './components/button/button.template';
const data = {
	class: 'button__cre',
	link: '#',
	text: 'hello',
};
const compiledTemplate = Handlebars.compile(template);
const frag = new DocumentFragment();
const temp = document.createElement('div');
temp.innerHTML = compiledTemplate(data);
frag.append(temp);
const base = document.querySelector('.base');
base?.appendChild(frag);
console.log(frag.children);
