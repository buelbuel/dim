/**
 * BaseElement is a base class for custom elements that provides reactive properties and lifecycle methods.
 * @extends HTMLElement
 */
export class BaseElement extends HTMLElement {
	/**
	 * Creates an instance of BaseElement.
	 */
	constructor() {
		super()
		/**
		 * @private
		 * @type {boolean}
		 */
		this._updateRequested = false
		/**
		 * @private
		 * @type {Array<{element: Element, event: string, handler: Function}>}
		 */
		this._eventListeners = []
	}

	/**
	 * Invoked when the element is added to the DOM.
	 */
	connectedCallback() {
		this.update()
		this.addEventListeners()
		document.addEventListener('language-changed', () => this.update())
	}

	/**
	 * Invoked when the element is removed from the DOM.
	 */
	disconnectedCallback() {
		this.removeEventListeners()
	}

	/**
	 * Updates the element's content.
	 */
	update() {
		const oldContent = this.innerHTML
		const newContent = this.render()

		if (oldContent !== newContent) {
			this.innerHTML = newContent
			this.addEventListeners()
		}
	}

	/**
	 * Requests an update to be performed on the next animation frame.
	 */
	requestUpdate() {
		if (!this._updateRequested) {
			this._updateRequested = true
			Promise.resolve().then(() => {
				this._updateRequested = false
				this.update()
			})
		}
	}

	/**
	 * Defines a reactive property on the element.
	 * @param {string} propertyKey - The name of the property.
	 * @param {*} initialValue - The initial value of the property.
	 */
	defineReactiveProperty(propertyKey, initialValue) {
		defineReactiveProperty(this, propertyKey, initialValue)
	}

	/**
	 * Adds an event listener with cleanup.
	 * @param {string} selector - The CSS selector for the target element.
	 * @param {string} event - The name of the event.
	 * @param {Function} handler - The event handler function.
	 */
	addEventListenerWithCleanup(selector, event, handler) {
		const element = this.querySelector(selector)
		if (element) {
			const existingListener = this._eventListeners.find(
				(listener) => listener.element === element && listener.event === event
			)

			if (existingListener) {
				element.removeEventListener(event, existingListener.handler)
				this._eventListeners = this._eventListeners.filter(
					(listener) => listener !== existingListener
				)
			}

			element.addEventListener(event, handler)
			this._eventListeners.push({ element, event, handler })
		}
	}

	/**
	 * Adds event listeners to the element.
	 */
	addEventListeners() {}

	/**
	 * Removes all event listeners from the element.
	 */
	removeEventListeners() {
		this._eventListeners.forEach(({ element, event, handler }) => {
			element.removeEventListener(event, handler)
		})
		this._eventListeners = []
	}

	/**
	 * Translates a key to the current language.
	 * @param {string} key - The translation key.
	 * @returns {string} The translated string.
	 */
	t(key) {
		return i18n.t(key)
	}

	/**
	 * Renders the element's content.
	 * @returns {string} The HTML content to be rendered.
	 */
	render() {}

	/**
	 * Defines the custom element.
	 * @param {string} name - The name for the custom element.
	 * @returns {typeof BaseElement} The class constructor.
	 */
	static define(name) {
		customElements.define(name, this)
		return this
	}
}
