/**
 * Direct imagelinks to Commons
 *
 * Similar: https://www.mediawiki.org/wiki/Snippets/Direct_imagelinks_to_Commons
 * 
 *
 * @author Maciej Nux
 * @author Krinkle
 * @version 2026-04-16
 */
if ( mw.config.get( 'wgNamespaceNumber', 0 ) >= 0 ) {
	let localSlashDomain = `//${location.host}/`;
	let localFileNSString = mw.config.get( 'wgFormattedNamespaces' )['6'] + ':';
	localFileNSString = encodeURI(localFileNSString); // encode e.g. for ru.wiki
	/*
		Notice the difference.
		src for Commons file:
		//upload.wikimedia.org/wikipedia/commons/thumb/7/79/Operation_Upshot-Knothole_-_Badger_001.jpg/60px-Operation_Upshot-Knothole_-_Badger_001.jpg
		src for a local file:
		//upload.wikimedia.org/wikipedia/pl/thumb/7/70/Stworek_na_p%C5%82ocie.jpg/330px-Stworek_na_p%C5%82ocie.jpg
	*/
	let commonsSrcCheck = (src) => (
		src.includes('//upload.wikimedia.org/')
		&& src.includes('/commons/')
	);
	mw.hook( 'wikipage.content' ).add( function ( $content ) {
		$content.find('a.image, a.mw-file-description').each(function() {
			let currVal = this.href;
			// href=//lang.wikipedia.org/ or similar
			if (currVal.includes(localSlashDomain)
				&& commonsSrcCheck($(this).find('img').attr('src'))
			) {
				let nextVal = currVal
					.replace(localSlashDomain, '//commons.wikimedia.org/')
					.replace(localFileNSString, 'File:') // for ru.wiki where NS is encoded
				;
				// console.debug({currVal, nextVal});
				this.href = nextVal
			// href=/wiki/Ns: or href=/w/index.php?title=Ns
			} else if (currVal.startsWith('/w')
				&& commonsSrcCheck($(this).find('img').attr('src'))
			) {
				let nextVal = currVal
					.replace(localFileNSString, 'File:')
				;
				nextVal = '//commons.wikimedia.org' + nextVal;
				// console.debug({currVal, nextVal});
				this.href = nextVal
			}
		});
	});
}
