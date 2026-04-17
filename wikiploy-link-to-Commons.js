/**
 * Dev/staging deploy.
 */
import {DeployConfig, Wikiploy } from 'wikiploy';

import * as botpass from './bot.config.mjs';
const ployBot = new Wikiploy(botpass);

// default site
ployBot.site = "pl.wikipedia.org"; 

(async () => {
	// edit summary
	ployBot.summary = () => {
		return 'fix encoded NS';
	};

	// deploy
	let file = `src/Gadget-Direct-link-to-Commons.js`;
	console.log('\nDeploy:', file);
	const configs = [];
	configs.push(new DeployConfig({
		src: file,
		dst: 'MediaWiki:Gadget-Direct-link-to-Commons.js',
	}));
	configs.push(new DeployConfig({
		site: "meta.wikimedia.org",
		src: file,
		dst: 'MediaWiki:Gadget-Direct-link-to-Commons.js',
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});