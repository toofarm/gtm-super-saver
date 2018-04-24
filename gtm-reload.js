(function() {
			var debugDiv = document.getElementsByTagName('div');
			var gtmConfirmed = debugDiv[debugDiv.length - 1].children[0].alt;
			console.log(gtmConfirmed);

			if ( gtmConfirmed === 'GTM Logo' ) {
				chrome.runtime.sendMessage({order: "refresh-me"}, function(response) {
					console.log(response);
				})
			}
		}());