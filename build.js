import less from 'less';
import fs from 'fs';

function build_less(callback) {
	return new Promise(function(resolve, reject) {
		fs.readFile('src/_main.less',function(error,data){
			if (!data) {
				console.error('Unable to read main Less.');
				console.error(error);
				reject('main-less-fail');
				return;
			}
			data = data.toString();
			less.render(data, function (lessError, css) {
				if (lessError) {
					console.error('Unable to parse Less.');
					console.error(lessError);
					reject('parse-less-fail');
					return;
				}
				fs.writeFile('dist/global.css', css, function(saveError){
					if (saveError) {
						console.error('Unable to save css.');
						console.error(saveError);
						reject('write-output-css-fail');
						return;
					}
					resolve(callback());
				});
			});
		});
	});
}

(async () => {
	console.log('done', new Date());
	await build_less();
	console.log('done');
})();