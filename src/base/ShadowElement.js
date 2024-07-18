/**
 * ShadowElement is the base class for elements with shadow DOM.
 *
 * @extends BaseElement
 * @method update - The update method.
 * @method render - Render HTML content.
 * @method static define - Define custom names for components.
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
