const RecipeComponent = React.createClass({
	displayName: 'RecipeComponent',

	saveChange() {
		this.props.saveChange(this.props.index, this.refs.newIngredients.value, this.refs.newTitle.value);
	},
	editView() {
		this.props.ed(this.props.index);
	},
	changeView() {
		this.props.changeView(this.props.index);
	},
	render() {
		if (this.props.lastOne === true || this.props.viewState) {
			if (this.props.editState) {
				return React.createElement(
					'div',
					{ className: 'recipeBox' },
					React.createElement('input', { ref: 'newTitle', type: 'text', className: 'form-control', defaultValue: this.props.recipe }),
					React.createElement('textarea', { ref: 'newIngredients', className: 'form-control', defaultValue: this.props.ingredients }),
					React.createElement(
						'div',
						{ className: 'buttons' },
						React.createElement(
							'button',
							{ onClick: this.saveChange, className: 'btn btn-success' },
							'Save'
						)
					)
				);
			} else {
				return React.createElement(
					'div',
					{ className: 'recipeBox' },
					React.createElement(
						'h5',
						{ onClick: this.changeView },
						this.props.recipe
					),
					React.createElement(
						'div',
						{ className: 'no-space' },
						this.props.ingredients.map(item => {
							return React.createElement(
								'p',
								null,
								item
							);
						})
					),
					React.createElement(
						'div',
						{ className: 'buttons' },
						React.createElement(
							'button',
							{ onClick: this.editView, className: 'btn' },
							'Edit'
						),
						React.createElement(
							'button',
							{ onClick: this.props.delete.bind(null, this.props.index), className: 'btn btn-danger' },
							'Delete'
						)
					)
				);
			}
		} else {
			return React.createElement(
				'div',
				{ className: 'recipeBox' },
				React.createElement(
					'h5',
					{ onClick: this.changeView },
					this.props.recipe
				)
			);
		}
	}
});