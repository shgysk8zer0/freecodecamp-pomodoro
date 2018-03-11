import './std-js/shims.js';
import './std-js/deprefixer.js';
import {$, ready} from './std-js/functions.js';
import * as Mutations from './std-js/mutations.js';
import {facebook, twitter, linkedIn, googlePlus, reddit} from './share-config.js';
import WebShareAPI from './std-js/webShareApi.js';
import Pomodoro from './Pomodoro.js';

const pomodoro = new Pomodoro({
	duration: 25,
	shortBreak: 5,
	// longBreak: 1,
});
window.pomodoro = pomodoro;

WebShareAPI(facebook, twitter, linkedIn, googlePlus, reddit);

ready().then(() => {
	const $doc = $(document.documentElement);
	const pause = $('[data-action="pause"]');
	const start = $('[data-action="start"]');
	const stop = $('[data-action="stop"]');
	const reset = $('[data-action="reset"]');
	const remainingOutput = document.getElementById('remaining');

	remainingOutput.textContent = `${pomodoro}`;

	Mutations.init();

	$doc.replaceClass('no-js','js');

	pomodoro.addEventListener('stateChange', event => {
		document.body.dataset.pomodoroState = event.detail.state;
		new Notification(event.detail.state, {
			body: 'What do I use for the body?',
		});
	});

	pomodoro.addEventListener('pause', () => {
		pause.hide();
		start.unhide();
		stop.unhide();
		reset.unhide();
	});

	pomodoro.addEventListener('start', () => {
		pause.unhide();
		start.hide();
		stop.unhide();
		reset.unhide();
	});

	pomodoro.addEventListener('stop', () => {
		pause.hide();
		start.unhide();
		stop.hide();
		reset.hide();
	});

	pomodoro.addEventListener('tick', event => {
		remainingOutput.textContent = event.detail.remainingString;
	});

	pause.click(() => pomodoro.pause());
	stop.click(() => pomodoro.stop());
	start.click(() => pomodoro.start());
	reset.click(() => pomodoro.reset());

	$(document.forms).submit(async event => {
		event.preventDefault();
		const form = new FormData(event.target);
		const el = $('#pomodoro');

		pomodoro.stop();
		pomodoro.work = form.get('session');
		pomodoro.break = form.get('break');
		el.unhide();
		el.addClass('bounceInUp', 'flex');
		pomodoro.start();

		[...form.entries()].forEach(entry => {
			const [key, value] = entry;
			console.log({key, value});
		});
	});

	$('[data-increment]').click(event => {
		const target = event.target.closest('[data-increment]');
		document.querySelector(target.dataset.increment).stepUp();
	});

	$('[data-decrement]').click(event => {
		const target = event.target.closest('[data-decrement]');
		document.querySelector(target.dataset.decrement).stepDown();
	});
});
