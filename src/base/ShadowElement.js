/**
 * ShadowElement is the base class for elements with shadow DOM.
 *
 * @module ShadowElement
 * @extends BaseElement
 */
export class ShadowElement extends BaseElement {
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
	}

	update() {
		this.shadowRoot.innerHTML = this.render()
	}

	render() {}
}
