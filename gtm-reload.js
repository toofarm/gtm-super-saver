	(function() {
		var images = document.getElementsByTagName('img');
		for ( var i = 0; i < images.length; i++ ) {
			var gtmConfirmed = images[i].src;
			if (gtmConfirmed.includes('ic_tag_manager.svg')) {
				chrome.runtime.sendMessage({order: "refresh-me"})
			}
		}
	}());