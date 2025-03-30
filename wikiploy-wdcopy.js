/**
 * Dev/staging deploy.
 */
import {DeployConfig, Wikiploy } from 'wikiploy';

import * as botpass from './bot.config.mjs';
const ployBot = new Wikiploy(botpass);

// default site
ployBot.site = "meta.wikimedia.org"; 

(async () => {
	// edit summary
	ployBot.summary = () => {
		return 'WDcopy with {link-interwiki}';
	};

	// deploy
	console.log('\nDeploy WDcopy JS');
	const configs = [];
	configs.push(new DeployConfig({
		src: 'src/WDcopy.js',
		dst: '~/WDcopy.js',
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});