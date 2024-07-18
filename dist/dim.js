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
/**
 * Utility functions for adding event listeners
 *
 * @param {HTMLElement} element - The element to add the event listener to.
 * @param {string} event - The event to listen for.
 * @param {Function} handler - The event handler function.
 */
export function addEventListenerOnce(element, event, handler) {
	const eventKey = `__${event}_handler__`

	if (element[eventKey]) {
		element.removeEventListener(event, element[eventKey])
	}
	element[eventKey] = handler
	element.addEventListener(event, handler)
}

/**
 * Utility functions for removing event listeners
 *
 * @param {HTMLElement} element - The element to add the event listener to.
 * @param {string} event - The event to listen for.
 * @param {Function} handler - The event handler function.
 */
export function removeEventListener(element, event, handler) {
	element.removeEventListener(event, handler)
}
/**
 * A tagged template literal function for creating HTML templates.
 *
 * @param {TemplateStringsArray} strings - The template strings.
 * @param {...any} values - The values to be interpolated into the template.
 * @returns {string} The final HTML string.
 */
export const html = (strings, ...values) => {
	return strings.reduce((result, string, i) => {
		const value = values[i - 1]
		return result + (value !== undefined ? value : '') + string
	})
}

/**
 * Converts a JavaScript object of styles into a CSS string.
 *
 * @param {Object} styles - The styles object.
 * @returns {string} The CSS string.
 */
export const styleMap = (styles) => {
	return Object.entries(styles)
		.map(([key, value]) => `${key}: ${value}`)
		.join('; ')
}
/**
 * Internationalization module
 * 
 */
export const i18n = {
	translations: {},

	get currentLanguage() {
		return localStorage.getItem('currentLanguage') || 'en'
	},

	set currentLanguage(lang) {
		localStorage.setItem('currentLanguage', lang)
	},

	t(key) {
		return this.translations[this.currentLanguage][key] || key
	},

	setLanguage(lang) {
		this.currentLanguage = lang
		document.dispatchEvent(new CustomEvent('language-changed'))
	},

	addTranslations(lang, translations) {
		this.translations[lang] = { ...this.translations[lang], ...translations }
	},
}
/**
 * Define a reactive property on a target object.
 *
 * @param {Object} target - The target object.
 * @param {string} propertyKey - The key of the property.
 * @param {any} initialValue - The initial value of the property.
 */
export function defineReactiveProperty(target, propertyKey, initialValue) {
	let value = initialValue

	Object.defineProperty(target, propertyKey, {
		get() {
			return value
		},

		set(newValue) {
			value = newValue
			target.requestUpdate()
		},

		configurable: true,
		enumerable: true,
	})
}
/**
 * Defines the router of the application.
 *
 * @param {Object} routes - The routes of the application.
 * @param {Object} app - The application container.
 */
const app = document.querySelector('#app')

/**
 * Initializes the router of the application.
 *
 * @param {Function} initRouter - The router of the application.
 */
export function initRouter(routes) {
	window.addEventListener('navigate', (event) => {
		const { path } = event.detail
		navigate(path, routes)
	})

	window.addEventListener('popstate', () => {
		renderContent(window.location.pathname, routes)
	})

	renderContent(window.location.pathname, routes)
}

/**
 * Renders the content of the application.
 *
 * @param {Function} renderContent - The content rendering function of the application.
 * @param {Object} route - The route of the application.
 */
async function renderContent(route, routes) {
	const routeInfo = routes[route]

	if (routeInfo) {
		try {
			const module = await routeInfo.component()
			const Component = module.default
			const layoutTemplate = document.getElementById(routeInfo.layout)

			if (Component && Component.prototype instanceof HTMLElement && layoutTemplate) {
				const layoutContent = layoutTemplate.content.cloneNode(true)
				const componentInstance = new Component()

				app.innerHTML = ''
				app.appendChild(layoutContent)
				app.querySelector('#app-content').appendChild(componentInstance)
				app.className = routeInfo.layout
				setTitle(routeInfo.title || componentInstance.constructor.name)
			} else {
				console.error('Invalid component or layout:', Component, layoutTemplate)
				app.innerHTML = '<div>Error: Invalid component or layout</div>'
				setTitle('Error')
			}
		} catch (error) {
			console.error('Error loading module:', error)
			app.innerHTML = '<div>Error loading page</div>'
			setTitle('Error')
		}
	} else {
		app.innerHTML = '<div>Page not found</div>'
		setTitle('Page Not Found')
	}
}

/**
 * Navigates to the path of the application.
 *
 * @param {Function} navigate - The navigation function of the application.
 * @param {String} path - The path of the application.
 */
function navigate(path, routes) {
	window.history.pushState({}, '', path)
	renderContent(path, routes)
}

/**
 * Sets the title of the page.
 *
 * @param {String} pageTitle - The title of the page.
 */
function setTitle(pageTitle) {
	const baseTitle = window.APP_TITLE || 'dim'
	document.title = `${pageTitle} | ${baseTitle}`
}
