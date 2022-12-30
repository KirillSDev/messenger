import type Block from './Block';

export function renderDom(query: string, component: Block) {
	const root = document.querySelector(query);
	root?.appendChild(component.getContent()!);
}
