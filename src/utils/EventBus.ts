export type Listeners = Record<string, CallableFunction[]>;
class EventBus {
	readonly listeners: Listeners;

	constructor() {
		this.listeners = {};
	}

	public on(event: string, callback: () => void) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}

		this.listeners[event].push(callback);
	}

	public off(event: string, callback: () => void) {
		if (!this.listeners[event]) {
			throw new Error(`No event: ${event}`);
		}

		this.listeners[event] = this.listeners[event].filter(
			(listener) => listener !== callback
		);
	}

	public emit(event: string, ...args: string[]) {
		if (!this.listeners[event]) {
			throw new Error(`No event: ${event}`);
		}

		this.listeners[event].forEach((listener) => {
			listener(...args);
		});
	}
}

export default EventBus;
