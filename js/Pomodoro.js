function* cycleState(breaksPerPomodoro = 4) {
	let i = 0;
	let breaks = 0;
	yield 'work';

	while(true) {
		i++;

		if (i % 2 === 0) {
			yield 'work';
		} else {
			breaks++;

			if (breaks % breaksPerPomodoro === 0) {
				yield 'longBreak';
			} else {
				yield 'break';
			}
		}
	}
}

export default class Pomodoro {
	constructor({
		duration   = 25,
		shortBreak = 5,
		longBreak  = 15,
	} = {}) {
		this.work = duration * 60;
		this.break = shortBreak * 60;
		this.longBreak = longBreak * 60;
		this.passed = 0;
		this._timerID = null;
		this.states = cycleState(1);
		this.state = this.states.next().value;
	}

	get remaining() {
		return this[this.state] - this.passed;
	}

	get paused() {
		return this._timerID !== null;
	}

	set paused(paused) {
		if (paused == true) {
			this.start();
		} else {
			this.pause();
		}
	}

	tick(callback = null) {
		this.passed++;

		if (this.remaining <= 0) {
			this.nextState();
			this.reset();
		}

		if (callback instanceof Function) {
			callback();
		}
	}

	start(callback = null) {
		this._timerID = setInterval(() => this.tick(callback), 1000);
	}

	pause() {
		clearTimeout(this._timerID);
		this._timerID = null;
	}

	reset() {
		this.passed = 0;
	}

	stop() {
		this.pause();
		this.reset();
	}

	nextState() {
		this.state = this.states.next().value;
	}
}
