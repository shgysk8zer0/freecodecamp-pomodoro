import './std-js/shims.js';
import './std-js/deprefixer.js';
import {$, ready} from './std-js/functions.js';
import * as Mutations from './std-js/mutations.js';
import {facebook, twitter, linkedIn, googlePlus, reddit} from './share-config.js';
import WebShareAPI from './std-js/webShareApi.js';
import Pomodoro from './Pomodoro.js';

const pomodoro = new Pomodoro({
	// duration: 1,
	// shortBreak: 1,
	// longBreak: 1,
});

WebShareAPI(facebook, twitter, linkedIn, googlePlus, reddit);

function readyHandler() {
	const remainingOutput = document.getElementById('remaining');
	pomodoro.addEventListener('start', console.log);
	pomodoro.addEventListener('stateChange', event => {
		document.body.dataset.pomodoroState = event.detail.state;
		new Notification(event.detail.state, {
			body: 'What do I use for the body?',
		});
	});

	pomodoro.addEventListener('tick', event => {
		remainingOutput.textContent = event.detail.remainingString;
	});
	pomodoro.start();
	Mutations.init();
	const $doc = $(document.documentElement);
	$doc.replaceClass('no-js','js');

	$('form').submit(event => {
		event.preventDefault();
		const form = new FormData(event.target);

		[...form.entries()].forEach(entry => {
			const [key, value] = entry;
			console.log({key, value});
		});
	});
}

ready().then(readyHandler);
