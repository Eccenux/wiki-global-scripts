/**
 * Dev/staging deploy.
 */
import {DeployConfig, Wikiploy} from 'wikiploy';

const ployBot = new Wikiploy();

// custom summary
ployBot.summary = () => {
	return 'wikiploy test';
}
// default site
ployBot.site = "meta.wikimedia.org"; 

(async () => {
	const configs = [];
	configs.push(new DeployConfig({
		src: 'dist/global.js',
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