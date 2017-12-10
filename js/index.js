import './std-js/shims.js';
import deprefix from './std-js/deprefixer.js';
import {$} from './std-js/functions.js';
import * as Mutations from './std-js/mutations.js';
import {facebook, twitter, linkedIn, googlePlus, reddit} from './share-config.js';
import WebShareAPI from './std-js/webShareApi.js';
import Pomodoro from './Pomodoro.js';

const pomodoro = new Pomodoro({
	duration: 1,
	shortBreak: 1,
	longBreak: 1,
});

pomodoro.addEventListener('stateChange', console.log);

deprefix();
WebShareAPI(facebook, twitter, linkedIn, googlePlus, reddit);

function readyHandler() {
	pomodoro.start(() => {
		console.log({pomodoro, remaining: pomodoro.remaining});
		if (pomodoro.remaining === 0) {
			new Notification(`State: ${pomodoro.state}`);
		}
	});
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

$(self).ready(readyHandler, {once: true});
