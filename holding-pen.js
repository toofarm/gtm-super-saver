e.preventDefault();
e.stopPropagation();
			var saveBtn = document.getElementsByClassName('btn-action')[1];
			if ( e.srcElement.innerHTML == " Save " ) {
				var refresh = document.getElementsByClassName('notification-action')[0].children[0];
				console.log('clicking save');
				saveBtn.click();
				console.log('clicking refresh');
				refresh.click();
			}
		}