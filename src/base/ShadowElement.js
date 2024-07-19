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
		 * The shadow root or fallback to the element itself.
		 * @type {ShadowRoot|HTMLElement}
		 * @private
		 */
		this._shadowRoot = this.attachShadow ? this.attachShadow({ mode: 'open' }) : this

		if (this._shadowRoot === this) {
			console.warn(
				'ShadowDOM is not supported in this environment. Falling back to light DOM.'
			)
		}
	}

	/**
	 * Gets the shadow root or the element itself if Shadow DOM is not supported.
	 * @returns {ShadowRoot|HTMLElement}
	 */
	get shadowRoot() {
		return this._shadowRoot
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
	render() {
		return ''
	}
}
