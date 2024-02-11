/**
 * Dev/staging deploy.
 */
import {DeployConfig, WikiployLite} from 'wikiploy';

import * as botpass from './bot.config.mjs';
const ployBot = new WikiployLite(botpass);

// default site
ployBot.site = "meta.wikimedia.org"; 

import { userPrompt } from './promptModule.cjs';

(async () => {
	// custom summary from a prompt
	const summary = await userPrompt('Please enter a summary of changes (empty for default summary):');
	if (typeof summary === 'string' && summary.length) {
		ployBot.summary = () => {
			return summary;
		}
	}

	// deploy
	console.log('\nDeploy CSS & JS');
	const configs = [];
	configs.push(new DeployConfig({
		src: 'src/main.js',
		dst: '~/global.js',
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