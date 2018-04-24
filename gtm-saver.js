// document.addEventListener('DOMContentLoaded', function() {

	var btn = document.getElementById('gtm-toggle');

	var toggleState = 'inactive';

	btn.addEventListener("click", gtmToggle);

	function gtmToggle(e) {

			e.preventDefault();
			e.stopPropagation();

			if ( toggleState === 'inactive' ) {
				btn.innerHTML = 'deactivate';
				toggleState = 'active';
				btn.style.backgroundColor = '#888'
				gtmInit();
			} else {
				btn.innerHTML = 'activate';
				toggleState = 'inactive';
				btn.style.backgroundColor = "#4285F4"
			}


		}

	function gtmInit() {

		console.log('gtmInit firing');
		

		if ( toggleState === 'active' ) {

			chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

				if ( tabs[0].url.includes('tagmanager.google.com') ) {
					console.log(tabs[0]);
					chrome.tabs.executeScript(null, {file: "gtm-actions.js"});
				}
			});
		}

	}


// })







