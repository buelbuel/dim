/**
 * BaseElement offers some abstract methods for custom elements to reduce boilerplate code.
 *
 * @module BaseElement
 * @extends HTMLElement
 */
export class BaseElement extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		this.update()
		this.addEventListeners()
	}

	disconnectedCallback() {
		this.removeEventListeners()
	}

	update() {
		this.innerHTML = this.render()
	}

	render() {}

	addEventListeners() {}

	removeEventListeners() {}
}
