	(function() {
			var images = document.getElementsByTagName('img');
			var gtmConfirmed = images[images.length - 1].alt;

			if ( gtmConfirmed === 'Up Arrow' ) {
				chrome.runtime.sendMessage({order: "refresh-me"}, function(response) {
					console.log(response);
				})
			}
		}());