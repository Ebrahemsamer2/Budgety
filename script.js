var budgetController = (function() {




})();



var UIController = (function() {

	var DOMinputs = {
		type: '.add__type',
		description : '.add__description',
		value: '.add__value',
		addBtn: '.add__btn'
	}

	return {
		getInputs: function() {
			return {
				type : document.querySelector(DOMinputs.type).value,
				description : document.querySelector(DOMinputs.description).value,
				value : document.querySelector(DOMinputs.value).value
			}
		},
		getDOMstrings: function() {
			return DOMinputs;
		}
	}
})();



// to connect budgetController with UIController
var controller = (function(budgetCtrl , UICtrl){

	var DOM = UICtrl.getDOMstrings();
	
	var setupEventListeners = function() {
		document.querySelector(DOM.addBtn).addEventListener('click' , addItemClick);
		document.addEventListener('keypress' , function(event) {
			if(event.keyCode === 13) {
				addItemClick();
			}
		});
	};

	var addItemClick = function() {
		var inputs = UICtrl.getInputs();
	};

	return {
		init: function() {
			console.log('Application is started');
			setupEventListeners();
		}
	};


})(budgetController, UIController);

controller.init();