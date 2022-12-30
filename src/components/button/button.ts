import template from './button.template';
import Block from '../../utils/Block';
import './button.css';

export default class Button extends Block {
	constructor(props) {
		super({ ...props });
	}

	render() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return this.compile(template, { ...this.props });
	}
}
