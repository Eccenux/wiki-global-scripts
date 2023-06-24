/**
 * Dev/staging deploy.
 */
import {DeployConfig, Wikiploy} from 'wikiploy';
import {build_less} from './build.js';

const ployBot = new Wikiploy();

// custom summary
ployBot.summary = () => {
	return 'less build';
}
// default site
ployBot.site = "meta.wikimedia.org"; 

(async () => {
	// awaiting build
	await build_less();

	// deploy
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