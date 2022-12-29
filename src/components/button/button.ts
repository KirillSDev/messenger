import template from 'button.hbs';
import './button.css';
const button = document.querySelector('.button');

button?.addEventListener('click', () => {
	console.log('Hello');
});

export default button;
