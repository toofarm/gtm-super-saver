var tgl = '';

chrome.storage.sync.get(['toggleState'], function(result) {
	if (result.toggleState == 'inactive' || result.toggleState == undefined ) {
		chrome.browserAction.setIcon({path:"imgs/gtm-saver-icon-inactive38.png"});	
	} else if (result.toggleState == 'active') {
		chrome.browserAction.setIcon({path:"imgs/gtm-saver-icon38.png"}, function() {
			tgl = result.toggleState;
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				pageChecker(tabs[0].url);
			})	
		});		
	}
}) 

// Initialize content scripts if plugin is activated
function gtmInit() {

	if ( tgl === 'active' ) {
		chrome.browserAction.setIcon({path:"imgs/gtm-saver-icon38.png"});
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.executeScript(tabs[0].id, {file: "gtm-content-actions.js"}, function() {
				chrome.tabs.sendMessage(tabs[0].id, {order: "activate"});
			})
		});
	}
}

function pageChecker(url) {
	if ( url.includes('://tagmanager.google.com') ) {
      		// Check initial state of plugin activation, run scripts if active
      		chrome.storage.sync.get(['toggleState'], function(result) {
      			tgl = result.toggleState;
      			if ( tgl == undefined || tgl == '' ) {

      				chrome.storage.sync.set({toggleState: 'inactive'}, function() {
      					tgl = 'inactive';
      				});

      			} else if ( tgl === 'active' ) {
      				gtmInit();
      			} 
      		});
      	}
      }

// Check if we're visiting GTM - if so, activate content scripts
chrome.webNavigation.onCompleted.addListener(function(details) { 
	pageChecker(details.url);
});


chrome.tabs.onActivated.addListener(function(tab) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		pageChecker(tabs[0].url);
	})	
});

// Listen for save action and trigger reload
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.order == "refresh") {    	
				chrome.tabs.query({currentWindow: true}, function(tabs) {
					for ( var i = 0; i < tabs.length; i++ ) {
						if ( tabs[i].url.includes('chrome://') == false ) {
							chrome.tabs.executeScript(tabs[i].id, {file: "gtm-reload.js"});
						}
					}
				}) 	
		} else if (request.order == 'refresh-me') {
			sendResponse({farewell:sender.url});
			chrome.tabs.query({url: sender.url}, function(tabs) {
				for ( var i = 0; i < tabs.length; i++ ) {
					var r = tabs[i].id;
					chrome.tabs.reload(r);
				}
			})
		} else if (request.order == "toggleOn") {
			console.log('Toggle on order received');
			tgl = "active";
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				pageChecker(tabs[0].url);
			})	
		} else if (request.order == "toggleOff") {
			console.log('Toggle off order recieved');
			tgl = "inactive";
			chrome.browserAction.setIcon({path:"imgs/gtm-saver-icon-inactive38.png"});
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {order: "deactivate"});
			});
		}
	});
