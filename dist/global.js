/* @sa [[User:Nux/global.css]] */
/* @sa [[User:Nux/vector.js]] */
/* @sa [[User:Nux/vector.css]] */
/* @sa [[User:Nux/common.js]] */
/* @sa [[User:Nux/common.css]] */

// if: edit
if ( mw.config.get('wgAction') === 'edit' || mw.config.get('wgAction') === 'submit' ) {
	mw.loader.load( 'https://meta.wikimedia.org/wiki/User:Nux/editToolsCollapse.js?action=raw&ctype=text/javascript' );
}

// [[View_it!_Tool]]
mw.loader.load( '//meta.wikimedia.org/w/index.php?title=User:SuperHamster/view-it-full.js&action=raw&ctype=text/javascript' ); // Backlink: [[meta:User:SuperHamster/view-it-full.js]]