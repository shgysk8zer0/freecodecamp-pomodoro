import './std-js/shims.js';
import './std-js/deprefixer.js';
import {$, ready, notify} from './std-js/functions.js';
import {confirm} from './std-js/asyncDialog.js';
import * as Mutations from './std-js/mutations.js';
import {facebook, twitter, linkedIn, googlePlus, reddit} from './std-js/share-config.js';
import WebShareAPI from './std-js/webShareApi.js';
import Pomodoro from './Pomodoro.js';

WebShareAPI(facebook, twitter, linkedIn, googlePlus, reddit);

ready().then(async () => {
	const $doc = $(document.documentElement);
	const pause = $('[data-action="pause"]');
	const start = $('[data-action="start"]');
	const stop = $('[data-action="stop"]');
	const reset = $('[data-action="reset"]');
	const pomodoroState = document.getElementById('pomodoro-state');
	const remainingOutput = document.getElementById('remaining');
	const icon = await $('link[rel="icon"]').find(icon => icon.sizes.contains('32x32'));
	const messages = {
		work: 'Focus on your task',
		break: 'Take a break',
	};
	const pomodoro = new Pomodoro();

	remainingOutput.textContent = `${pomodoro}`;

	Mutations.init();

	$doc.replaceClass('no-js','js');

	pomodoro.addEventListener('work', () => {
		notify(document.title, {
			body: messages.work,
			icon: icon.href,
		});
		pomodoroState.textContent = 'Work';
	});

	pomodoro.addEventListener('break', () => {
		notify(document.title, {
			body: messages.break,
			icon: icon.href,
		});
		pomodoroState.textContent = 'Break';
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

		if (! pomodoro.paused || await confirm('Are you sure you want to reset?')) {
			const form = new FormData(event.target);
			const $el = $('#pomodoro');

			pomodoro.stop();
			pomodoro.work = form.get('session');
			pomodoro.break = form.get('break');
			$el.removeClass('hidden');
			$el.addClass('flex', 'bounceInUp');
			pomodoro.start();
		}
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
