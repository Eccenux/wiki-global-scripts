/**
 * WikiData ID copy-to-clipboard.
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
function addWdIdCopyButton() {
	// Find the #t-wikibase container
	const container = document.querySelector("#t-wikibase");
	if (!container) return; // Exit if container not found
	container.style.cssText = `
		display:flex;
		gap: .5em;
	`;

	// Create the button
	const button = document.createElement("button");
	button.innerText = "📋Q";
	button.title = "Copy Q";
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
				navigator.clipboard.writeText(qid) // Copy to clipboard
					.then(() => showToast(`Copied: ${qid}`))
					.catch(err => {alert("Copy failed!"); console.error(err);});
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

// if/when ready
$(() => {
	addWdIdCopyButton();
});
