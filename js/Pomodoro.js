import EventHander from './EventHandler.js';

const states = [
	'work',
	'break',
];

function* cycleState() {
	/*eslint no-constant-condition: "off"*/
	while(true) {
		for (const state of states) {
			yield state;
		}
	}
}

function createEvent(name, pomodoro) {
	return new CustomEvent(name, {
		detail: {
			state: pomodoro.state,
			passed: pomodoro.passed,
			remaining: pomodoro.remaining,
			remainingString: pomodoro.toString(),
		}
	});
}

function calculateTime(remaining) {
	const time = {
		hours: 0,
		minutes: 0,
		seconds: 0,
	};

	while (remaining >= 3600) {
		time.hours++;
		remaining -= 3600;
	}

	while (remaining >= 60) {
		time.minutes++;
		remaining -= 60;
	}

	time.seconds = remaining;
	return time;
}

export default class Pomodoro extends EventHander {
	constructor({
		workLength  = 25,
		breakLength = 5,
	} = {}) {
		super();
		this.work = workLength;
		this.break = breakLength;
		this.passed = 0;
		this._timerID = null;
		this.states = cycleState(1);
		this.state = null;
	}

	get remaining() {
		if (this.state === 'work') {
			return calculateTime(this._work - this.passed);
		} else {
			return calculateTime(this._break - this.passed);
		}
	}

	get paused() {
		return this._timerID !== null;
	}

	set break(minutes) {
		this.stop();
		this._break = minutes * 60;
	}

	get break() {
		return this._break;
	}

	set work(minutes) {
		this.stop();
		this._work = minutes * 60;
	}

	set paused(paused) {
		if (paused == true) {
			this.start();
		} else {
			this.pause();
		}
	}

	toString() {
		const remaining = this.remaining;
		let str = '';
		if (remaining.hours > 0) {
			str = `${remaining.hours}:`;
		}

		str += `${remaining.minutes}:${remaining.seconds < 10 ? 0 : ''}${remaining.seconds}`;
		return str;
	}

	tick() {
		this.passed++;

		if ((this.state === 'work' && this.passed >= this._work) || (this.passed >= this._break)) {
			this.nextState();
			this.reset();
		}

		this.dispatchEvent(createEvent('tick', this));
	}

	start() {
		if (this._timerID === null) {
			this._timerID = setInterval(() => this.tick(), 1000);
			this.dispatchEvent(createEvent('start', this));
			if (this.state === null) {
				this.nextState();
			}
		}
	}

	pause() {
		if (this._timerID) {
			clearTimeout(this._timerID);
			this._timerID = null;
			this.dispatchEvent(createEvent('pause', this));
		}
	}

	reset() {
		this.passed = 0;
		this.dispatchEvent(createEvent('reset', this));
	}

	stop() {
		if (this._timerID) {
			this.pause();
		}
		this.reset();
		this.dispatchEvent(createEvent('tick', this));
		this.dispatchEvent(createEvent('stop', this));
	}

	nextState() {
		this.state = this.states.next().value;
		this.dispatchEvent(createEvent(this.state, this));
		this.dispatchEvent(createEvent('stateChange', this));
	}
}
