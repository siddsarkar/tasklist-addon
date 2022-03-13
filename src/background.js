/* eslint-disable no-undef */

const isMv3 = chrome.runtime.getManifest().manifest_version === 3;
const api = {
	...chrome,
	browserAction: {
		setBadgeText(...args) {
			if (isMv3) {
				return chrome.action.setBadgeText(...args);
			}

			return chrome.browserAction.setBadgeText(...args);
		},
	},
};

let slate = [];
function updateBadgeText() {
	api.browserAction.setBadgeText(
		{
			text: `${slate.length}`,
		},
	);
}

api.storage.onChanged.addListener(
	(changes, _area) => {
		slate = JSON.parse(changes.slate.newValue);
		updateBadgeText();
	},
);

api.storage.local.get('slate', ls => {
	if (ls.slate) {
		slate = JSON.parse(ls.slate);
	}

	updateBadgeText();
});

