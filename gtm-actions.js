function domListeners() {

	console.log('NEW gtm-actions script hitting');

	var bod = document.getElementsByTagName('body')[0];

	bod.onchange = function(e) {
			var saveBtn = document.getElementsByClassName('btn-action')[1];
			if ( saveBtn != undefined ) {

				saveBtn.style.display = "none";

				var newSaveBtn = document.createElement('div');
				var newSaveBtnInner = document.createElement('span');
				var saveHolder = document.getElementsByClassName('gtm-sheet-header__actions')[0];
				newSaveBtnInner.className = 'new-save-btn-txt';
				newSaveBtn.className = 'new-save-btn';
				newSaveBtnInner.innerText = 'Save';
				newSaveBtn.prepend(newSaveBtnInner);

				if ( document.getElementsByClassName('new-save-btn').length === 0 ) {
					saveHolder.prepend(newSaveBtn);
				}

				var refresh = document.getElementsByClassName('notification-action')[0].children[0];

				newSaveBtn.addEventListener('click', function() {
					console.log('clicking save');
					saveBtn.click();

					setTimeout(function() {
						console.log('clicking refresh');
						refresh.click();
						setTimeout(function() {
							chrome.runtime.sendMessage({order: "refresh"}, function(response) {
								console.log(response);
							})
						}, 500);	
					}, 1500);


				})
	
			}
		}

}

domListeners();