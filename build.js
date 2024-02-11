import fsa from 'fs/promises'

/** Just a copy */
export async function build_js() {
	let srcJs = 'src/global.js';
	let dstJs = 'dist/global.js';
	const data = await fsa.readFile(srcJs, 'utf8');
	await fsa.writeFile(dstJs, data);
}

/**
(async () => {
	console.log(new Date().toISOString(), 'start');
	await build_less();
	console.log(new Date().toISOString(), 'done');
})();
/**/
