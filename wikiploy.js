/**
 * Dev/staging deploy.
 */
import {DeployConfig, Wikiploy, setupSummary } from 'wikiploy';

import * as botpass from './bot.config.mjs';
const ployBot = new Wikiploy(botpass);

// default site
ployBot.site = "meta.wikimedia.org"; 

(async () => {
	// custom summary from a prompt
	await setupSummary(ployBot);

	// deploy
	console.log('\nDeploy CSS & JS');
	const configs = [];
	configs.push(new DeployConfig({
		src: 'src/main.js',
		dst: '~/global.js',
	}));
	configs.push(new DeployConfig({
		src: 'src/WDcopy.js',
		dst: '~/WDcopy.js',
	}));
	configs.push(new DeployConfig({
		src: 'dist/global.css',
		dst: '~/global.css',
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});