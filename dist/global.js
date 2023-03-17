/* @sa [[User:Nux/global.css]] */
/* @sa [[User:Nux/vector.js]] */
/* @sa [[User:Nux/vector.css]] */
/* @sa [[User:Nux/common.js]] */
/* @sa [[User:Nux/common.css]] */

/*
	Cache
	smaxage = proxy[s]
	maxage  = browser[s]
	
	06h = 21600
	12h = 43200
	24h = 86400
	2d = 172800
	3d = 259200
	5d = 432000
*/

// if: edit
var is_edit = mw.config.get("wgAction") == "edit" || mw.config.get("wgAction") == "submit";
var is_mobileSkin = mw.config.get('skin') == 'minerva';

// sync notification over tabs
mw.loader.load( 'https://meta.wikimedia.org/w/index.php?action=raw&ctype=text/javascript&smaxage=21600&maxage=86404&title=User:Nux/notificationsSync.js' );
mw.hook('userjs.NuxNotificationSync.init').add(function(nns, version) {console.log('[notificationSync] init hook', {nns:nns, v:version})});

// collapse edit tools section
if (is_edit) {
	mw.loader.load( 'https://meta.wikimedia.org/w/index.php?action=raw&ctype=text/javascript&smaxage=21600&maxage=86400&title=User:Nux/editToolsCollapse.js' );
}

// [[View_it!_Tool]]
if (!is_mobileSkin) {	// brakes on mobile (TypeError)
	mw.loader.using([ 'mediawiki.api' ]).then( function() {
		mw.loader.load( 'https://meta.wikimedia.org/w/index.php?action=raw&ctype=text/javascript&smaxage=21600&maxage=86400&title=User:SuperHamster/view-it-full.js' );
	});
}

// popups options
window.popupDisableReferencePreview=true;

/* [[Wikipedysta:Nux/personalizacja.js]] - top links and stuff */
if (mw.config.get("skin") ===  "vector-2022")
{
	mw.loader.load("https://pl.wikipedia.org/w/index.php?action=raw&ctype=text/css&smaxage=86400&maxage=259201&title=Wikipedysta:Nux/personalizacja.css", "text/css");
	mw.loader.load("https://pl.wikipedia.org/w/index.php?action=raw&ctype=text/javascript&smaxage=21600&maxage=86401&title=Wikipedysta:Nux/personalizacja.js");
}

/* MSz sources links */
mw.loader.load("https://pl.wikipedia.org/w/index.php?action=raw&ctype=text/css&smaxage=86400&maxage=259200&title=Wikipedysta:Msz2001/sourcecode-links.css", "text/css");
mw.loader.load("https://pl.wikipedia.org/w/index.php?action=raw&ctype=text/javascript&smaxage=21600&maxage=86400&title=Wikipedysta:Msz2001/sourcecode-links.js");

/* wikiEditor-ui-toolbar: ref, redir, template */
if (is_edit)
{
	mw.loader.load("https://pl.wikipedia.org/w/index.php?action=raw&ctype=text/css&smaxage=86400&maxage=259200&title=Wikipedysta:Nux/editor-toolbar-icons.css", "text/css");
}

// WikiDane i interwiki
if (mw.config.get("wgSiteName") === "Wikipedia") {
	mw.loader.load("https://pl.wikipedia.org/w/index.php?action=raw&ctype=text/javascript&smaxage=21600&maxage=86400&title=Wikipedysta:Msz2001/wstaw-interwiki.js");
}

// debug mw.config.get(key)
mw.loader.load("https://pl.wikipedia.org/w/index.php?action=raw&ctype=text/javascript&smaxage=21600&maxage=86400&title=Wikipedysta:Nux/wgVars.js");

// [[Wikipedia:pl:Wikipedia:Narzędzia/Wyszukiwanie i zamiana]]
if (is_edit)
{
	mw.loader.load("https://pl.wikipedia.org/w/index.php?action=raw&ctype=text/css&smaxage=86400&maxage=259200&title=Wikipedysta:Nux/SearchBox.css", "text/css");
	//mw.loader.load("https://pl.wikipedia.org/w/index.php?action=raw&ctype=text/javascript&smaxage=21600&maxage=86400&title=Wikipedysta:Nux/SearchBox.js");
	mw.loader.load("https://pl.wikipedia.org/w/index.php?action=raw&ctype=text/javascript&smaxage=21600&maxage=86400&title=Wikipedysta:Nux/SearchBox.dev.js");
}