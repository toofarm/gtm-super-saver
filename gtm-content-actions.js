// This variable acts as a fail-safe in case the event listener on the body won't unseat itself
var fireControl = '';

// Insert dummy 'Save' button if we're making changes in edit mode
function insertMyBtn(e) {

	var editSheet = document.getElementsByClassName('gtm-veditor-section-overlay')[0];

	if ( fireControl == 'activate' && e.target == editSheet ) {

		var saveBtn = document.getElementsByClassName('btn-action')[1];

		// console.log('inserting new save button');
		
			// console.log(saveBtn);

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

			var refreshContainer = document.getElementsByClassName('notification-action')[0];

			newSaveBtn.addEventListener('click', function() {
				saveBtn.click();

				if ( refreshContainer != undefined ) {
					var refresh = refreshContainer.children[0];
					setTimeout(function() {
						// console.log('clicking refresh');
						refresh.click();
						setTimeout(function() {
							chrome.runtime.sendMessage({order: "refresh"}, function(response) {
								// console.log(response);
									})
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

	// console.log('removing DOM listeners');

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

	// console.log("adding DOM listeners");

	bod.addEventListener("click", insertMyBtn, true);		
}

// Listen for orders from extension scripts
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log("Request order is " + request.order);
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