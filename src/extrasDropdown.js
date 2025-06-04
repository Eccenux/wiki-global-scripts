/**
 * Extra actions menu.
 */
class CustomExtrasDropdown {
	constructor() {
		this.portletId = 'p-mytest';
		
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

		let config = this.getConfig();
		this.addItems(config);

		// append menu
		if ( mw.config.get("skin") === 'vector-2022' ) {
			$( '#' + this.portletId + '-dropdown' ).appendTo( inMenu );
		} else {
			$( p ).appendTo( inMenu );
		}
	}

	/** Items. */
	addItems (config) {
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

		if (config.changeContentModel) {
			mw.util.addPortletLink( this.portletId, `/wiki/Special:ChangeContentModel/${pageTitle}`, config.changeContentModel );
		}
	}

	anchorAttrs (link, target, title) {
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
}

(function(){
	let ced = new CustomExtrasDropdown();
	mw.hook('userjs.CustomExtrasDropdown.loaded').fire(ced);
	$(function() {
		ced.init();
		mw.hook('userjs.CustomExtrasDropdown.ready').fire(ced);
	});
})();
