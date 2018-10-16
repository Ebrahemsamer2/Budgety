var budgetController = (function() {

	var Income = function(id , description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Expense = function(id , description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	Expense.prototype.calcPercentage = function(total_income) {

		if(total_income > 0){
			this.percentage = Math.round((this.value / total_income) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	};

	var calculateTotel = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur) {
			sum = sum + parseFloat(cur.value);
		});
		data.totals[type] = sum;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc:0
		},
		budget: 0,
		percentege: -1
	};

	return {

		addItem: function(type, desc, val) {
			var Item, ID;

			if (data.allItems[type].length > 0){ // may problem happen here if length = 0 id = 0 twice
				ID = data.allItems[type][data.allItems[type].length-1].id + 1;
			}else {
				ID = 0;
			}
			
			if(type === "inc"){
				Item = new Income(ID, desc, val);
			}else {
				Item = new Expense(ID, desc, val);
			}
			data.allItems[type].push(Item);
			return Item;
		},

		deleteItem: function(type, id) {
			var ids, index;
			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);

			// delete index 
			if(index !== -1 ) {
				data.allItems[type].splice(index,1);
			} 

		},

		calculateBudget: function() {

			// Calculate total income and expenses
			calculateTotel('inc');
			calculateTotel('exp');
			// Calculate the total Budget income - expenses

			data.budget = data.totals.inc - data.totals.exp ;
			// Calculate in percentege

			if ( data.totals.inc > 0 ){
				data.percentege = Math.round((data.totals.exp / data.totals.inc) * 100);
			}else {
				data.percentege = -1;
			}
		},
		calculatePercentages: function() {
			data.allItems['exp'].forEach(function(cur) {
				cur.calcPercentage(data.totals.inc);
			});
		},
		getPercentages: function() {
			var allPercentages = data.allItems.exp.map(function(cur) {
				return cur.getPercentage();
			});
			return allPercentages;
		},
		getBudget: function() {
			return {
				budget: data.budget,
				totalIncome: data.totals.inc,
				totalExpenses: data.totals.exp,
				percentege: data.percentege
			}
		}
	}

})();



var UIController = (function() {

	var DOMinputs = {
		type: '.add__type',
		description : '.add__description',
		value: '.add__value',
		addBtn: '.add__btn',
		income_container:'.income__list',
		expense_container:'.expenses__list',
		budget_income_val: '.budget__income--value',

		budget_value: '.budget__value',

		item_val : '.item__value',
		item_val_percentege: '.item__percentage',

		total_income_val: '.budget__income--value',
		total_income_percetege: '.budget__income--percentage',

		total_expenses_val: '.budget__expenses--value',
		total_expenses_percetege: '.budget__expenses--percentage',

		exp_percentage: '.item__percentage'
	};

	return {
		getInputs: function() {
			return {
				type : document.querySelector(DOMinputs.type).value, // String may exp or inc
				description : document.querySelector(DOMinputs.description).value,
				value : document.querySelector(DOMinputs.value).value
			}
		},

		addListItem: function(obj , type) {
			var html , newHTML , element;
			// putting random data
			if(type == 'inc') {
				element = DOMinputs.income_container;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';	
			}else {
				element = DOMinputs.expense_container;
				html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
				}
			// putting some actual data 

			newHTML = html.replace('%id%',obj.id);
			newHTML = newHTML.replace('%description%',obj.description);
			newHTML = newHTML.replace('%value%',obj.value);

			// enter data to html

			document.querySelector(element).insertAdjacentHTML('beforeend' ,newHTML);

		},

		deleteListItem: function(selectedID) {
			var el = document.getElementById(selectedID);
			el.parentNode.removeChild(el);


		},
		clearFields: function() {
			var fields;

			fields = document.querySelectorAll(DOMinputs.description +', '+DOMinputs.value);

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(field) {
				field.value = "";
			});
			fieldsArr[0].focus();
		},

		displayBudget:function(obj) {
			document.querySelector(DOMinputs.budget_value).textContent = obj.budget ;
			document.querySelector(DOMinputs.total_income_val).textContent = obj.totalIncome ;
			document.querySelector(DOMinputs.total_expenses_val).textContent = obj.totalExpenses ;

			if(obj.percentege > 0 ){
				document.querySelector(DOMinputs.total_expenses_percetege).textContent = obj.percentege +'%';
			}else {
				document.querySelector(DOMinputs.total_expenses_percetege).textContent = '---';
			}
		},
		displayPercentage: function(perc) {

			var fields = document.querySelectorAll(DOMinputs.exp_percentage);

			var nodeLostForEach = function(list, callback) {
				for (var i = 0; i< list.length; i++) {
					callback(list[i],i);
				}
			};

			nodeLostForEach(fields, function(current, index) {
				if(perc[index] > 0 ){
					current.textContent = perc[index]+"%";
				}else {
					current.textContent ="---";
				}
			});

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

		document.querySelector('.container').addEventListener('click' , addDelegationItem);
	};

	var updateBudget = function() {
		// Calculate the Budget
		budgetCtrl.calculateBudget();

		// Return the Budget
		var budget = budgetCtrl.getBudget();

		// show the result on the interface	 
		UICtrl.displayBudget(budget);

	};

	var calculatePercentages = function() {
		// calculate Percentage
		budgetCtrl.calculatePercentages();
		
		// get  Percentages
		var perc = budgetCtrl.getPercentages();
		// Update UI
		UICtrl.displayPercentage(perc);
	};

	var addItemClick = function() {
		var inputs, item ;

		// get inputs from user
		inputs = UICtrl.getInputs();

		if (inputs.description !== "" && ! isNaN(inputs.value) && inputs.value > 0 ){
			// Add item
			item = budgetCtrl.addItem(inputs.type,inputs.description,inputs.value);

			// show the item
			UICtrl.addListItem(item,inputs.type);

			// Clear Fields
			UICtrl.clearFields();
		
			// Updating Budget
			updateBudget();

			// Update Percentage
			calculatePercentages();
		}
	};

	var addDelegationItem = function(event) {

		var itemID, splitID, type, ID ;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id ;

		if(itemID) {

			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// delete item
			budgetCtrl.deleteItem(type, ID);

			// delete item from UI
			UICtrl.deleteListItem(itemID);
			// Update Budget	
			updateBudget();

			// Update Percentage
			calculatePercentages();
		}

	};
	return {
		init: function() {
			console.log('Application is started');
			UICtrl.displayBudget({
				budget: 0,
				totalIncome: 0,
				totalExpenses: 0,
				percentege: -1
			});
			setupEventListeners();
		}
	};


})(budgetController, UIController);

controller.init();