const eventHandlers = new Map();

export default class EventHander {
	constructor() {
		eventHandlers.set(this, {});
	}

	addEventListener(event, callback) {
		const system = eventHandlers.get(this);
		if (! system.hasOwnProperty(event)) {
			system[event] = new Set([callback]);
		} else {
			system[event].add(callback);
		}
	}

	removeEventListener(event, callback) {
		const system = eventHandlers.get(this);
		if (system.hasOwnProperty(event)) {
			system[event].remove(callback);
		}
	}

	dispatchEvent(event) {
		const system = eventHandlers.get(this);
		if (system.hasOwnProperty(event.type)) {
			system[event.type].forEach(callback => callback(event));
		}
	}
}
