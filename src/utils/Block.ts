/* eslint-disable @typescript-eslint/class-literal-property-style */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
import { EventBus } from './event-bus';
import { v4 as uuidv4 } from 'uuid';
import * as Handlebars from 'handlebars';

export type Props = Record<string, any>;

class Block {
	static EVENTS = {
		INIT: 'init',
		FLOW_CDM: 'flow:component-did-mount',
		FLOW_CDU: 'flow:component-did-update',
		FLOW_RENDER: 'flow:render',
	};

	public id = uuidv4();
	private _element: HTMLElement;
	private readonly _meta = null;
	private readonly eventBus: EventBus;
	protected props: Props;
	protected children: any;

	constructor(propsAndChildren: any = {}) {
		const { props, children } = this.getChildren(propsAndChildren);
		this.children = children;
		this.initChildrenComponents();
		this._meta = { props };
		this.props = this._makePropsProxy(props);
		this.eventBus = new EventBus();
		this._registerEvents(this.eventBus);
		this.eventBus.emit(Block.EVENTS.INIT);
	}

	getChildren(propsAndChildren: any) {
		const children = {};
		const props = {};

		Object.entries(propsAndChildren).map(([key, value]) => {
			if (value instanceof Block) {
				children[key] = value;
			} else if (Array.isArray(value) && value.every((v) => v instanceof Block)) {
				children[key] = value;
			} else {
				props[key] = value;
			}
		});

		return { props, children };
	}

	private _registerEvents(eventBus: EventBus) {
		eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
		eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
		eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
	}

	init() {
		this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
	}

	private _componentDidMount() {
		this.componentDidMount();
	}

	componentDidMount() {}

	dispatchComponentDidMount() {
		this.eventBus.emit(Block.EVENTS.FLOW_CDM);
	}

	private _componentDidUpdate(oldProps: any, newProps: any) {
		if (this.componentDidUpdate(oldProps, newProps)) {
			this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
		}
	}

	componentDidUpdate(oldProps, newProps) {
		return true;
	}

	setProps = (nextProps) => {
		if (!nextProps) {
			return;
		}

		Object.assign(this.props, nextProps);
	};

	get element() {
		return this._element;
	}

	getInnerHtml(): string {
		const container = document.createElement('div');
		container.appendChild(this._element);

		return container.innerHTML;
	}

	private _render() {
		const block = this.render();
		const firstChild = block.firstElementChild as HTMLElement;

		if (this._element) {
			this._removeEventListeners();
			this._element.replaceWith(firstChild);
		}

		this._element = firstChild;
		this._addEventListeners();
	}

	protected render(): DocumentFragment {
		return new DocumentFragment();
	}

	compile(template: string, props: any) {
		const fragment = this._createDocumentElement('template');

		Object.entries(this.children).forEach(([key, child]) => {
			if (Array.isArray(child)) {
				props[key] = child.map((ch) => `<div data-id="id-${ch.id}"></div>`);
				return;
			}

			props[key] = `<div data-id="id-${child.id}"></div>`;
		});

		const htmlString = Handlebars.compile(template)(props);
		fragment.innerHTML = htmlString;

		Object.entries(this.children).forEach(([key, child]) => {
			if (Array.isArray(child)) {
				child.forEach((ch) => {
					const stub = fragment.content.querySelector(`[data-id="id-${ch.id}"]`);
					if (!stub) {
						return;
					}

					stub.replaceWith(ch.getContent()!);
				});
			}

			const stub = fragment.content.querySelector(`[data-id="id-${child.id}"]`);

			if (!stub) {
				return;
			}

			stub.replaceWith(child.getContent()!);
		});

		return fragment.content;
	}

	protected initChildrenComponents() {}

	_addEventListeners() {
		const { events } = this.props;

		if (!events) {
			return;
		}

		Object.keys(events).forEach((eventName) => {
			this._element.addEventListener(eventName, events[eventName]);
		});
	}

	_removeEventListeners() {
		const { events } = this.props;
		if (!events) {
			return;
		}

		if (events) {
			Object.keys(events).forEach((eventName) => {
				this._element.removeEventListener(eventName, events[eventName]);
			});
		}
	}

	getContent(): HTMLElement | undefined {
		return this.element;
	}

	_makePropsProxy(props: any) {
		const self = this;

		return new Proxy(props as unknown as object, {
			get(target: Record<string, unknown>, prop: string) {
				const value = target[prop];
				return typeof value === 'function' ? value.bind(target) : value;
			},
			set(target: Record<string, unknown>, prop: string, value: unknown) {
				const oldProps = { ...target };
				target[prop] = value;
				self.eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target);
				return true;
			},

			deleteProperty() {
				throw new Error('Отказано в доступе');
			},
		});
	}

	_createDocumentElement(tagName) {
		return document.createElement(tagName);
	}

	show() {
		this.getContent()!.style.display = 'block';
	}

	hide() {
		this.getContent()!.style.display = 'none';
	}
}

export default Block;
