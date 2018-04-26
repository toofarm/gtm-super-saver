var tgl = '';

// Initialize content scripts if plugin is activated
function gtmInit() {

		console.log('calling gtmInit. Toggle state is ' + tgl);

		if ( tgl === 'active' ) {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {order: "activate"}, function(response) {
					console.log(response.farewell);
					});
				});
		}
	}

// Check if we're visiting GTM - if so, activate content scripts
chrome.webNavigation.onCompleted.addListener(function(details) {
      
      if ( details.url.includes('://tagmanager.google.com') ) {
      		// console.log(details.url);	
      		// Check initial state of plugin activation, run scripts if active
			chrome.storage.sync.get(['toggleState'], function(result) {
				tgl = result.toggleState;
				console.log('Toggle state is initially set to ' + tgl);
				if ( tgl == undefined || tgl == '' ) {

			    	chrome.storage.sync.set({toggleState: 'inactive'}, function() {
						tgl = 'inactive';
						console.log('Toggle state is initially set to ' + tgl);
				    });

		    	} else if ( tgl === 'active' ) {
					gtmInit();
		    	} 
		    });
      }

  });

// Listen for save action and trigger reload
chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
	    if (request.order == "refresh") {    	
	    	chrome.tabs.query({}, function(tabs) {
				for ( var i = 0; i < tabs.length; i++ ) {
					// console.log(tabs[i].id);
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
					console.log(r);
			 		chrome.tabs.reload(r);
				}
			})
		} else if (request.order == "toggleOn") {
			// console.log('Toggle on order received');
			tgl = "active";
			gtmInit();
		} else if (request.order == "toggleOff") {
			// console.log('Toggle off order recieved');
			tgl = "inactive";
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {order: "deactivate"}, function(response) {
					console.log(response.farewell);
				});
			});
		}
	});






