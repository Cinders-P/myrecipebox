Storage.prototype.setObject = function (key, value) {
	this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
	const value = this.getItem(key);
	return value && JSON.parse(value);
};

const BoardComponent = React.createClass({
	displayName: 'BoardComponent',

	saveChange(index, newIngredients, newTitle) {
		const arr = this.state.recipes;
		arr[index] = newTitle;
		newIngredients = newIngredients.split(/\r?\n/g);
		const arr3 = this.state.ingredients;
		arr3[index] = newIngredients;
		const arr2 = this.state.editState;
		arr2[index] = false;
		this.setState({
			recipes: arr,
			ingredients: arr3,
			editState: arr2
		});
		window.setTimeout(() => {
			localStorage.setObject('myrecipebox_recipes', this.state.recipes);
			for (let i = 0; i < this.state.ingredients.length; i++) {
				localStorage.setObject('myrecipebox_ingredients' + i, this.state.ingredients[i]);
			}
		}, 100);
	},
	editView(index) {
		const arr2 = this.state.editState;
		arr2[index] = true;
		this.setState({
			editState: arr2
		});
	},
	changeView(index) {
		const arr = this.state.viewState;
		arr[index] = !this.state.viewState[index];
		const arr2 = this.state.editState;
		arr2[index] = false;
		this.setState({
			viewState: arr,
			editState: arr2
		});
	},
	deleteRecipe(index) {
		this.setState({
			recipes: React.addons.update(this.state.recipes, { $splice: [[index, 1]] }),
			ingredients: React.addons.update(this.state.ingredients, { $splice: [[index, 1]] }),
			viewState: React.addons.update(this.state.viewState, { $splice: [[index, 1]] }),
			editState: React.addons.update(this.state.editState, { $splice: [[index, 1]] })
		});
		window.setTimeout(() => {
			localStorage.removeItem('myrecipebox_ingredients' + index);
			localStorage.removeItem('myrecipebox_ingredients' + this.state.ingredients.length);
			localStorage.setObject('myrecipebox_recipes', this.state.recipes);
			for (let i = 0; i < this.state.ingredients.length; i++) {
				localStorage.setObject('myrecipebox_ingredients' + i, this.state.ingredients[i]);
			}
		}, 100);
	},
	newRecipe() {
		this.setState({
			recipes: React.addons.update(this.state.recipes, { $push: ['New Recipe'] }),
			ingredients: React.addons.update(this.state.ingredients, { $push: [['']] }),
			viewState: React.addons.update(this.state.viewState, { $push: [false] }),
			editState: React.addons.update(this.state.editState, { $push: [false] })
		});
		window.setTimeout(() => {
			localStorage.setObject('myrecipebox_recipes', this.state.recipes);
			for (let i = 0; i < this.state.ingredients.length; i++) {
				localStorage.setObject('myrecipebox_ingredients' + i, this.state.ingredients[i]);
			}
		}, 100);
	},
	getInitialState() {
		if (localStorage.getItem('myrecipebox_recipes') && localStorage.getItem('myrecipebox_recipes').length !== 2) {
			// saved as a string; length = 2 means it is [ ] empty
			const views = [];
			const edits = [];
			for (let i = 0; i < localStorage.getItem('myrecipebox_recipes').length; i++) {
				views.push(false);
				edits.push(false);
			}
			const iArr = [];
			let i = 0;
			while (localStorage.getObject('myrecipebox_ingredients' + i) !== null) {
				iArr.push(localStorage.getObject('myrecipebox_ingredients' + i++));
			}
			return {
				recipes: localStorage.getObject('myrecipebox_recipes'),
				ingredients: iArr,
				viewState: views,
				editState: edits
			};
		} else {
			return {
				recipes: ['Mom\'s Spaghetti', 'Triple Fudge Ice Cream Cake', 'Cheeseless Pizza'],
				ingredients: [['- Spaghetti', '- Tomato sauce', '- A hint of disappointment'], ['- chocolate', '- CHOCOLATE', '- CHOCOLAAAAATE'], ['-  A platter of your finest artisan bread']],
				viewState: [false, false, false],
				editState: [false, false, false]
			};
		}
	},
	render() {
		return React.createElement(
			'div',
			null,
			' ',
			React.createElement(
				'button',
				{ onClick: this.newRecipe, className: 'btn btn-info' },
				'Add new recipe'
			),
			this.state.recipes.map((item, i) => {
				if (i === this.state.recipes.length - 1) {
					return React.createElement(RecipeComponent, { saveChange: this.saveChange, editState: this.state.editState[i], ed: this.editView, changeView: this.changeView, viewState: this.state.viewState[i], 'delete': this.deleteRecipe, lastOne: true, recipe: item, key: i, index: i, ingredients: this.state.ingredients[i] });
				} else {
					return React.createElement(RecipeComponent, { saveChange: this.saveChange, editState: this.state.editState[i], ed: this.editView, changeView: this.changeView, viewState: this.state.viewState[i], 'delete': this.deleteRecipe, recipe: item, key: i, index: i, ingredients: this.state.ingredients[i] });
				}
			})
		);
	}
});