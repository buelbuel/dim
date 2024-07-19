/**
 * ShadowElement is the base class for elements with shadow DOM.
 * @extends BaseElement
 */
export class ShadowElement extends BaseElement {
	/**
	 * Creates an instance of ShadowElement and attaches a shadow root.
	 */
	constructor() {
		super()
		/**
		 * @type {ShadowRoot}
		 */
		this.shadowRoot = this.attachShadow({ mode: 'open' })
	}

	/**
	 * Updates the element's shadow DOM content.
	 * @override
	 */
	update() {
		this.shadowRoot.innerHTML = this.render()
	}

	/**
	 * Renders the element's shadow DOM content.
	 * @returns {string} The HTML content to be rendered in the shadow DOM.
	 * @override
	 */
	render() {}
}
