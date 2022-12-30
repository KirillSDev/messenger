export class EventBus {
	// eslint-disable-next-line @typescript-eslint/ban-types
	listeners: Record<string, Function[]> = {};

	constructor() {
		this.listeners = {};
	}

	on(event: string, callback: (...args: unknown[]) => void) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}

		this.listeners[event].push(callback);
	}

	emit(event: string, ...args: unknown[]) {
		if (!this.listeners[event]) {
			// eslint-disable-next-line @typescript-eslint/no-throw-literal
			throw new Event(`Not event: ${event}`);
		}

		this.listeners[event].forEach((listener) => {
			listener(...args);
		});
	}

	off(event: string, callback: (...args: unknown[]) => void) {
		if (!this.listeners[event]) {
			throw new Error(`Not event: ${event}`);
		}

		this.listeners[event] = this.listeners[event].filter(
			(listener) => listener !== callback
		);
	}
}
