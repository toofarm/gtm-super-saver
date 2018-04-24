document.addEventListener('DOMContentLoaded', function() {

	var btn = document.getElementById('gtm-toggle');

	var toggleState = 'inactive';

	btn.addEventListener("click", gtmToggle);

	function gtmToggle(e) {

			e.preventDefault();
			e.stopPropagation();

			if ( toggleState === 'inactive' ) {
				btn.innerHTML = 'deactivate';
				toggleState = 'active';
				btn.style.backgroundColor = '#888';
				gtmInit();
			} else {
				btn.innerHTML = 'activate';
				toggleState = 'inactive';
				btn.style.backgroundColor = "#4285F4";
			}


		}

	function gtmInit() {

		if ( toggleState === 'active' ) {

			chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
				console.log(tabs[0]);
				if ( tabs[0].url.includes('tagmanager.google.com') ) {
					console.log(tabs[0]);
					chrome.tabs.executeScript(null, {file: "gtm-actions.js"});
				}

			});
		}

	}


})

	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    console.log(sender.tab ?
	                "from a content script:" + sender.tab.url :
	                "from the extension");
	    if (request.order == "refresh") {    	
	    	sendResponse({farewell:"We're getting there"});
	    	chrome.tabs.query({}, function(tabs) {

				for ( var i = 0; i < tabs.length; i++ ) {
					console.log(tabs[i].id);
					chrome.tabs.executeScript(tabs[i].id, {file: "gtm-reload.js"});
				}
		})
	   		
		} else if (request.order == 'refresh-me') {
			sendResponse({farewell:sender.url});
			chrome.tabs.query({url: sender.url}, function(tabs) {
			 		var r = tabs[0].id;
			 		console.log(tabs[0].id);
			 		chrome.tabs.reload(r);
			})
		}
	});






