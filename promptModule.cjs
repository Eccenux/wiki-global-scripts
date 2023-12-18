const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const userPrompt = (prompt) => {
	const rl = readline.createInterface({ input, output });
	
	return new Promise((resolve) => {
		rl.question(prompt, (summary) => {
			rl.close();

			resolve(summary);
		});
	});
};

module.exports = { userPrompt };
