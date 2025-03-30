/**
 * WikiData copy-to-clipboard.
 * 
 * Add a button to copy WD item id (Q) for the current article.
 * The button is shown beside the "Wikidata item" link.
 * 
 * Repository (issues, pull requests):
 * https://github.com/Eccenux/wiki-global-scripts
 * 
 * Author(s):
 * Maciej Nux Jaros
 * 
 * Deployed with love using Wikiploy: [[Wikipedia:Wikiploy]]
 */
function addWdCopyButton(o) {
	// Find the #t-wikibase container
	const container = document.querySelector("#t-wikibase");
	if (!container) return; // Exit if container not found
	container.style.cssText = `
		display:flex;
		gap: .5em;
	`;

	// Create the button
	const button = document.createElement("button");
	button.innerText = o.label;
	button.title = o.title;
	button.style.cssText = `
		padding: .1em .3em;
		font-size: 75%;
	`;

	// Add onclick event
	button.onclick = () => {
		// Find the link inside the container
		const link = container.querySelector("a[href]");
		if (link) {
			const match = link.href.match(/.+\/(Q\d+)/); // Extract Q-ID
			if (match) {
				const qid = match[1];
				o.action(qid, showToast);
			}
		}
	};

	// Append the button to the container
	container.appendChild(button);

	// Toast notification function
	function showToast(message, isError = false) {
		const toast = document.createElement("div");
		toast.textContent = message;
		toast.style.position = "fixed";
		toast.style.bottom = "10px";
		toast.style.right = "10px";
		toast.style.padding = "10px 20px";
		toast.style.backgroundColor = isError ? "#f44336" : "#4CAF50"; // Red for error, green for success
		toast.style.color = "white";
		toast.style.borderRadius = "5px";
		toast.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
		toast.style.zIndex = "1000";
		toast.style.transition = "opacity 0.5s";

		let removed = false;
		toast.onclick = () => {
			toast.remove();
			removed = true;
		};

		document.body.appendChild(toast);

		setTimeout(() => {
			if (removed) {
				return;
			}
			toast.style.opacity = "0";
			setTimeout(() => {
				if (!removed) toast.remove()
			}, 500);
		}, 2000); // Show for 2 seconds
	}
}

/**
 * WikiData ID copy-to-clipboard.
 */
function addWdIdCopyButton() {
	let options = {
		label: "📋Q",
		title: "Copy Q",
		action: (qid, showToast) => {
			navigator.clipboard.writeText(qid) // Copy to clipboard
				.then(() => showToast(`Copied: ${qid}`))
				.catch(err => {alert("Copy failed!"); console.error(err);})
			;
		}
	};
	addWdCopyButton(options);
}
/**
 * Create and copy {{link-interwiki}} to clipboard.
 */
function addWdLinkInterwikiCopyButton() {
	let tpl = (art, tekst, qid) => `{{link-interwiki|${art}|tekst=${tekst}|Q=${qid}}}`;

	let options = {
		label: "📋{LI}",
		title: "Copy {{link-interwiki}}",
		action: (qid, showToast) => {
			let art = mw.config.get('wgTitle');
			let tekst = art.replace(/ \(.+\)$/, '');
			let wikitext = tpl(art, tekst, qid);
			navigator.clipboard.writeText(wikitext) // Copy to clipboard
				.then(() => showToast(`Copied: ${wikitext}`))
				.catch(err => {alert("Copy failed!"); console.error(err);})
			;
		}
	};
	addWdCopyButton(options);
}

// if/when ready
$(() => {
	addWdIdCopyButton();
	addWdLinkInterwikiCopyButton();
});
