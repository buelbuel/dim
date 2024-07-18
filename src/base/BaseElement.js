/**
 * BaseElement is a base class for custom elements that provides reactive properties and lifecycle methods.
 *
 * @extends HTMLElement
 * @property {boolean} _updateRequested - The flag to indicate if an update has been requested.
 * @property {Array} _eventListeners - The array of event listeners.
 * @method connectedCallback - The connected callback method.
 * @method disconnectedCallback - The disconnected callback method.
 * @method update - The update method.
 * @method requestUpdate - The request update method.
 * @method defineReactiveProperty - The define reactive property method.
 * @method addEventListenerWithCleanup - The add event listener with cleanup method.
 * @method addEventListeners - The add event listeners method.
 * @method removeEventListeners - The remove event listeners method.
 * @method t - The translation method.
 * @method render - Render HTML content.
 * @method static define - Define custom names for components.
 *
 */
export class BaseElement extends HTMLElement {
	constructor() {
		super()
		this._updateRequested = false
		this._eventListeners = []
	}

	connectedCallback() {
		this.update()
		this.addEventListeners()
		document.addEventListener('language-changed', () => this.update())
	}

	disconnectedCallback() {
		this.removeEventListeners()
	}

	update() {
		const oldContent = this.innerHTML
		const newContent = this.render()

		if (oldContent !== newContent) {
			this.innerHTML = newContent
			this.addEventListeners()
		}
	}

	requestUpdate() {
		if (!this._updateRequested) {
			this._updateRequested = true
			Promise.resolve().then(() => {
				this._updateRequested = false
				this.update()
			})
		}
	}

	defineReactiveProperty(propertyKey, initialValue) {
		defineReactiveProperty(this, propertyKey, initialValue)
	}

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

	addEventListeners() {}

	removeEventListeners() {
		this._eventListeners.forEach(({ element, event, handler }) => {
			element.removeEventListener(event, handler)
		})
		this._eventListeners = []
	}

	t(key) {
		return i18n.t(key)
	}

	render() {}

	static define(name) {
		customElements.define(name, this)
		return this
	}
}
