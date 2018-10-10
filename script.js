var budgetController = (function() {




})();



var UIController = (function() {

})();



// to connect budgetController with UIController
var controller = (function(budgetCtrl , UICtrl){

	function addItemClick() {

	}

	document.querySelector('.add__btn').addEventListener('click' , addItemClick());
	document.addEventListener('keypress' , function(event) {
		if(event.keyCode === 13) {
			addItemClick();
		}
	});


})(budgetController, UIController);