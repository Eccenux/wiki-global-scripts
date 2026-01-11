/**
 * Extra actions menu.
 * 
 * Adds a menu for all/most wiki pages.
 * 
 * Repository (issues, pull requests):
 * https://github.com/Eccenux/wiki-global-scripts
 * 
 * Author(s):
 * Maciej Nux Jaros
 * 
 * Deployed with love using Wikiploy: [[:en:Wikipedia:Wikiploy]]
 */
class CustomExtrasDropdown {
	constructor() {
		this.portletId = 'p-mytest';

		this.rightsCacheTtl = 2 * 24 * 60 * 60; // [in seconds]
		
		this.defaultConfig = {
			changeContentModel: '⚙️ Zmień model treści',
			authors: {
				icon: '🧑‍🤝‍🧑',
				label: 'Info-autorzy↗️',
				title: 'Autorzy i inne stats (otwiera się w nowym tabie)',
			},
			purge: {
				icon: '🌀',
				label: 'Odśwież',
				title: 'Wyczyść pamięć podręczną dla tej strony\n(Shift: przeładuj tablice linków, Ctrl: przeładuj rekursywnie)',
			},
			diffLast: {
				icon: '🔀',
				label: 'Ost. zmiana',
				title: 'Link do ostatniej zmiany (diff).',
			},
		};
	}

	/** Something that you can override. */
	getConfig() {
		return this.defaultConfig;
	}

	/** Main init. */
	init () {
		const inMenu = '#right-navigation';

		// create a dropdown menu in Vector legacy and Vector
		const p = mw.util.addPortlet( this.portletId, 'Extras', '#p-cactions' );

		// append menu
		if ( mw.config.get("skin") === 'vector-2022' ) {
			$( '#' + this.portletId + '-dropdown' ).appendTo( inMenu );
		} else {
			$( p ).appendTo( inMenu );
		}

		let config = this.getConfig();
		this.addItems(config);
	}

	/** Items. */
	async addItems (config) {
		const pageTitle = mw.config.get('wgPageName');
		const pageTitleE = encodeURIComponent( pageTitle );
		const websiteE = encodeURIComponent( mw.config.get('wgServerName') )

		if (config.purge) {
			this.addPurge(config.purge);
		}

		if (config.authors) {
			let c = config.authors;
			let label = c.icon + ' ' + c.label;
			let url = 'https://xtools.wmcloud.org/articleinfo/' + websiteE + '/' + pageTitleE;
			let link = mw.util.addPortletLink( this.portletId, url, label, 'author-stats-link' );
			this.anchorAttrs(link, '_blank', c.title);
		}

		// console.time('getRights');
		let rights = await this.getCachedUserRights();
		// console.timeEnd('getRights');

		if (config.changeContentModel && rights.includes('editcontentmodel')) {
			mw.util.addPortletLink( this.portletId, `/wiki/Special:ChangeContentModel/${pageTitle}`, config.changeContentModel );
		}

		if (config.diffLast && mw.config.get('wgRevisionId') > 0) {
			let c = config.diffLast;
			let label = c.icon + ' ' + c.label;
			mw.util.addPortletLink( this.portletId, `/w/index.php?title=${pageTitleE}&diff=cur&oldid=prev`, label, null, c.title );
		}
	}

	anchorAttrs (link, target, title) {
		if (!link) return;
		if (link.nodeName !== 'A') {
			link = link.querySelector('a');
		}
		link.setAttribute( 'target', target );
		link.setAttribute( 'title', title );
	}

	/**
	 * Purge action by [[User:Msz2001]]
	 */
	addPurge(c) {
		// Zwykły link do ?action=purge
		let purgeHref = mw.util.getUrl( null, { action: 'purge' } );
		let purgeTab = mw.util.addPortletLink(
			this.portletId,
			purgeHref,
			c.icon + ' ' + c.label,
			'ca-purge',
			c.title
		);

		$(purgeTab).click(function (e) {
			// Nie przechodź po linku, odświeżymy stronę przez API
			e.preventDefault();

			let purgeParams = {
				action: 'purge',
				titles: mw.config.get('wgPageName'),
			};

			// Shift: Przeładuj tablice linkujących
			purgeParams.forcelinkupdate = !!e.shiftKey;
			// Ctrl: Przeładuj strony rekursywnie (zawiera w sobie powyższe)
			purgeParams.forcerecursivelinkupdate = !!e.ctrlKey;

			new mw.Api({ userAgent: 'Gadget-purge' })
				.post(purgeParams)
				.then(function () {
					// Wyświetl odświeżoną stronę
					window.location.reload();
				}).fail(function () {
					// Nie udało się, przejdź do ?action=purge
					window.location = purgeHref;
				})
			;
		});
	}

	/** Reads and caches user rights per domain. */
	async getCachedUserRights() {
		const cacheKey = `userjs.CustomExtrasDropdown.userRights`;
		const cacheTtl = this.rightsCacheTtl * 1000;
		const cached = localStorage.getItem(cacheKey);

		if (cached) {
			try {
				const { rights, timestamp } = JSON.parse(cached);
				if (Date.now() - timestamp < cacheTtl) {
					if (Array.isArray(rights)) {
						return rights;
					} else {
						console.warn('[ced]', 'invalid value in cache', rights);
					}
				}
			} catch (e) {
				// ignore broken cache
				console.warn('[ced]', 'unable to read cache', e);
			}
		}

		const rights = await mw.user.getRights();
		localStorage.setItem(cacheKey, JSON.stringify({
			rights,
			timestamp: Date.now()
		}));
		if (Array.isArray(rights)) {
			return rights;
		} else {
			console.warn('[ced]', 'got invalid value from mw.user.getRights', rights);
			return [];
		}
	}

}

(function(){
	let ced = new CustomExtrasDropdown();
	mw.hook('userjs.CustomExtrasDropdown.loaded').fire(ced);
	
	mw.loader.using(["mediawiki.util"]).then( function() {
		$(function() {
			ced.init();
			mw.hook('userjs.CustomExtrasDropdown.ready').fire(ced);
		});
	});
})();
