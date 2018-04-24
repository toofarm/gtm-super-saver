function domListeners() {

	console.log('NEW gtm-actions script hitting');

	var bod = document.getElementsByTagName('body')[0];

	bod.onclick = function(e) {
			e.preventDefault();
			e.stopPropagation();
			console.log(e.srcElement.innerHTML);
			// var saveBtn = document.getElementsByClassName('btn-action')[0];
			if ( e.srcElement.innerHTML == " Save " ) {
				var refresh = document.getElementsByClassName('notification-action')[0].children[0];
				console.log('clicking refresh');
				refresh.click();
			}
		}

}

domListeners();