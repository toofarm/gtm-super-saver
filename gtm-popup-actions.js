var tgl = '';

function toggle(e) {

	e.preventDefault();
	e.stopPropagation();
	var btn = document.getElementById('gtm-toggle');

	if ( tgl === 'inactive' ) {
		btn.innerHTML = 'deactivate';
		btn.style.backgroundColor = '#888';
		chrome.storage.sync.set({toggleState: 'active'}, function() {
			tgl = 'active';
			chrome.runtime.sendMessage({order: "toggleOn"})
		});
	} else if ( tgl === 'active' ) {
		btn.innerHTML = 'activate';				
		btn.style.backgroundColor = "#4285F4";
		chrome.storage.sync.set({toggleState: 'inactive'}, function() {
			tgl = 'inactive';
			chrome.runtime.sendMessage({order: "toggleOff"})
		});
	}

}


document.addEventListener('DOMContentLoaded', function() {
	var btn = document.getElementById('gtm-toggle');

	chrome.storage.sync.get(['toggleState'], function (result) {
		tgl = result.toggleState;
		btn.addEventListener("click", toggle);
		if ( tgl === 'active' ) {
			btn.innerHTML = 'deactivate';
			btn.style.backgroundColor = '#888';
		}
	}) 
});