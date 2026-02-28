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
			constUrl: {
				icon: '🕑',
				label: 'Trwały link',
				copiedLabel: '✅ Skopiowano do schowka.',
				errorLabel: '❌ Błąd kopiowania (sprawdź log).',
				title: 'Skopiuj trwały link do schowka; działa również dla diff=cur.',
			},
			pageLink: {
				icon: '[[§]]',
				label: 'Link do strony',
				copiedLabel: '✅ Skopiowano do schowka.',
				errorLabel: '❌ Błąd kopiowania (sprawdź log).',
				title: 'Skopiuj link bieżącej strony do schowka (zachowuje kotwicę).',
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
			this.addPurgeAction(config.purge);
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

		// if (config.diffLast && mw.config.get('wgRevisionId') > 0) { // no need to check, menu is not added on special pages anyway... and wgRevisionId=0 on action=history
		if (config.diffLast) {
			let c = config.diffLast;
			let label = c.icon + ' ' + c.label;
			mw.util.addPortletLink( this.portletId, `/w/index.php?title=${pageTitleE}&diff=cur&oldid=prev`, label, null, c.title );
		}

		if (config.constUrl) {
			this.addConstUrlAction(config.constUrl);
		}
		if (config.pageLink) {
			this.addPageLinkAction(config.pageLink);
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
	 * Purge action.
	 * Inspired by [[User:Msz2001]]
	 */
	addPurgeAction(c) {
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

	/**
	 * Action to copy const URL.
	 */
	addConstUrlAction(c) {
		let actionHref = this.getPermalink();
		let fullLabel = c.icon + ' ' + c.label;
		let actionTab = mw.util.addPortletLink(
			this.portletId,
			actionHref,
			fullLabel,
			null,
			c.title
		);

		const me = this;
		$(actionTab).click(function (e) {
			e.preventDefault();

			let x = e.pageX;
			let y = e.pageY;
			actionHref = me.getPermalink(); // might have changed (e.g. anchor, but also history push)
			navigator.clipboard.writeText(actionHref)
				.then(function() {
					me.showToast(c.copiedLabel, x, y);
				})
				.catch(function(err) {
					console.error('[ced] Copy failed', err);
					me.showToast(c.errorLabel, x, y);
				})
			;
		});
	}

	/**
	 * Get constant link of the current page (if possible).
	 * 
	 * @see Borrowed from: https://pl.wikipedia.org/wiki/Wikipedysta:Nux/replylinks.dev.js#:~:text=hrefPermalink
	 * 
	 * @private
	 * @returns {string} permanent URL.
	 */
	getPermalink()	{
		let currentUrl = document.location.href; //.replace(/#.+/, '');
		let currentId = mw.config.get('wgCurRevisionId');

		let hrefPermalink = '';
		// means it is a permalink (comparing versions, showing one specific version or a diff.)
		if (/[?&]oldid=/.test(currentUrl))
		{
			// diff=cur is fluid, replace to static
			if (currentUrl.includes('diff=cur'))
			{
				currentUrl = currentUrl.replace(/([?&])diff=cur(?=[&]|$)/, `$1diff=${currentId}`);
			}
			hrefPermalink = currentUrl;
		}
		// get latest
		else
		{
			let pageTitle = mw.config.get('wgPageName');
			hrefPermalink =  document.location.origin + mw.util.getUrl(pageTitle, { oldid: currentId });
		}
		return hrefPermalink;
	}

	/**
	 * Action to copy a link to current/relevant page (with anchor).
	 */
	addPageLinkAction(c) {
		let fullLabel = c.icon + ' ' + c.label;
		let actionTab = mw.util.addPortletLink(
			this.portletId,
			'#',
			fullLabel,
			null,
			c.title
		);

		const me = this;
		$(actionTab).click(function (e) {
			e.preventDefault();

			let x = e.pageX;
			let y = e.pageY;
			let pageLink = me.getPageLink();
			navigator.clipboard.writeText(pageLink)
				.then(function() {
					me.showToast(c.copiedLabel, x, y);
				})
				.catch(function(err) {
					console.error('[ced] Copy failed', err);
					me.showToast(c.errorLabel, x, y);
				})
			;
		});
	}

	/**
	 * Get a link of the current page (if possible).
	 * 
	 * @private
	 * @returns {string} e.g. [[Zażółć gęślą jaźń#Zobacz też|Zażółć gęślą jaźń § Zobacz też]].
	 */
	getPageLink() {
		let hash = decodeURIComponent(document.location.hash).replaceAll(/_/g, ' ');
		let page = mw.config.get('wgRelevantPageName').replaceAll(/_/g, ' ');
		let hashText = hash.replace(/^#/, '').trim();

		let full = `${page}${hash}`;

		// If page has namespace → use part after first colon
		let colonIndex = page.indexOf(':');
		if (colonIndex !== -1) {
			page = page.substring(colonIndex + 1);
		}
		let label = (hashText) ? `${page} § ${hashText}` : page;

		return label !== full ? `[[${full}|${label}]]` : `[[${full}]]`;
	}


	/**
	 * Show a quick message.
	 * @param {string} message Non HTML message.
	 * @param {number} x Where to roughly show the toast.
	 * @param {number} y Where to roughly show the toast.
	 */
	showToast(message, x, y) {
		const $toast = $('<div class="estrasDD-click-toast"/>')
			.text(message)
			.css({
				position: 'absolute',
				left: x + 'px',
				top: y + 'px',
				transform: 'translate(-50%, -120%)',
				padding: '6px 10px',
				background: '#333',
				color: '#fff',
				borderRadius: '4px',
				fontSize: '12px',
				opacity: 0,
				pointerEvents: 'none',
				zIndex: 9999
			});

		$('body').append($toast);

		$toast.animate({ opacity: 1 }, 100)
			.delay(2000)
			.animate({ opacity: 0 }, 200, function() {
				$toast.remove();
			})
		;
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
