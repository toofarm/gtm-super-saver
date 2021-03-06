// The fireControl variable acts as a fail-safe in case the event listener on the body won't unseat itself
var fireControl = '';

// Insert dummy 'Save' button if we're making changes in edit mode
function insertMyBtn(e) {

	var refreshContainer = document.getElementsByClassName('notification-action')[0];

	if ( fireControl == 'activate' && e.target.classList.contains('gtm-veditor-section-overlay') && refreshContainer ) {

		var saveBtnAll = document.getElementsByClassName('btn-action');

		for ( var i = 0; i < saveBtnAll.length; i++ ) {
			if ( saveBtnAll[i].innerText == 'SAVE' || saveBtnAll[i].innerText == ' Save ' ) {
				saveBtn = saveBtnAll[i];
			}
		}

		saveBtn.style.display = "none";

		var saveHolders = document.getElementsByClassName('gtm-sheet-header__actions');
		var saveHolder = saveHolders[saveHolders.length - 1];

		var newSaveBtn = document.createElement('div');
		var newSaveBtnInner = document.createElement('span');
		newSaveBtnInner.className = 'new-save-btn-txt';
		newSaveBtn.className = 'new-save-btn';
		newSaveBtnInner.innerText = 'Save';
		newSaveBtn.prepend(newSaveBtnInner);

		if ( saveHolders[saveHolders.length - 1].getElementsByClassName('new-save-btn').length == 0 ) {
			saveHolder.prepend(newSaveBtn);
		}

			// On save button click, save the changes, then check if we're previewing; if so, send refresh order
			newSaveBtn.addEventListener('click', function() {
				//Check if changes have been made, if so save them, otherwise, close the panel
				let closeBtns = document.getElementsByClassName('gtm-sheet-header__close')
				let closeBtn = closeBtns[closeBtns.length - 1]

				var saveBtnAll = document.getElementsByClassName('btn-action');

				for ( var i = 0; i < saveBtnAll.length; i++ ) {
					if ( saveBtnAll[i].innerText == 'SAVE' || saveBtnAll[i].innerText == ' Save ' ) {
						saveBtn = saveBtnAll[i];
					}
				}

				if (!saveBtn.disabled) {
					saveBtn.click();
				} else {
					closeBtn.click()
				}
				if ( refreshContainer != undefined ) {
					var refresh = refreshContainer.children[0];
					setTimeout(function() {
						refresh.click();
						setTimeout(function() {
							chrome.runtime.sendMessage({order: "refresh"});
						}, 500);	
					}, 1500);
				}
			})
		}
	}

// Deactivate listneing functions
function removeDomListeners() {
	var bod = document.getElementsByTagName('body')[0];

	var saveBtn = document.getElementsByClassName('btn-action')[1];
	var newSaveBtn = document.querySelector('.new-save-btn');

	bod.removeEventListener("click", insertMyBtn, true);

	if ( newSaveBtn != null ) {
		newSaveBtn.parentNode.removeChild(newSaveBtn);	
	}

	if ( saveBtn != null ) {
		saveBtn.style.display = "block";
	}

}

// Activate listening functions
function addDomListeners() {
	var bod = document.getElementsByTagName('body')[0];
	bod.addEventListener("click", insertMyBtn, true);		
}

// Listen for orders from extension scripts
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.order == "deactivate") {
			sendResponse({farewell: "received order " + request.order});
			fireControl = request.order;
			removeDomListeners();
		} else if (request.order == "activate") {
			sendResponse({farewell: "received order " + request.order});
			fireControl = request.order;
			addDomListeners();
		}
	}
	);