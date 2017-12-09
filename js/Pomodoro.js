export default class Pomodoro {
	constructor({
		duration   = 25,
		shortBreak = 5,
		longBreak  = 15,
	} = {}) {
		this.duration = duration;
		this.shortBreak = shortBreak;
		this.longBreak = longBreak;
		this.passed = 0;
	}

	get remaining() {
		return this.duration - this.passed;
	}

	start() {
		//
	}

	pause() {
		//
	}

	stop() {
		//
	}
}
