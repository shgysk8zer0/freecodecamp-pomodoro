const containers = new WeakMap();

export default class PrivateDate {
	constructor(data = {}) {
		containers.set(this, {});
		Object.entries(data).forEach(entry => {
			const [key, value] = entry;
			this.set(key, value);
		});
	}

	has(key) {
		return containers.get(this).hasOwnProperty(key);
	}

	set(key, value) {
		containers.get(this)[key] = value;
	}

	get(key) {
		return containers.get(this)[key];
	}

	*keys() {
		for (let key of Object.keys(containers.get(this))) {
			yield key;
		}
	}

	*values() {
		for (let value of Object.values(containers.get(this))) {
			yield value;
		}
	}

	*entries() {
		for (let entry of Object.entries(containers.get(this))) {
			yield entry;
		}
	}
}
