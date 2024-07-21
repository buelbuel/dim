/**
 * BaseElement is a base class for custom elements that provides reactive properties and lifecycle methods.
 * @extends HTMLElement
 */
export class BaseElement extends HTMLElement {
	/** Creates an instance of BaseElement. */
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

	/** Invoked when the element is added to the DOM. */
	connectedCallback() {
		this.update()
		this.addEventListeners()
		document.addEventListener('language-changed', () => this.update())
	}

	/** Invoked when the element is removed from the DOM. */
	disconnectedCallback() {
		this.removeEventListeners()
	}

	/** Updates the element's content. */
	update() {
		const oldContent = this.innerHTML
		const newContent = this.render()

		if (oldContent !== newContent) {
			this.innerHTML = newContent
			this.addEventListeners()
		}
	}

	/** Requests an update to be performed on the next animation frame. */
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

	/** Adds event listeners to the element. */
	addEventListeners() {}

	/** Removes all event listeners from the element. */
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
/**
 * ShadowElement is the base class for elements with shadow DOM.
 * @extends BaseElement
 */
export class ShadowElement extends BaseElement {
	/** Creates an instance of ShadowElement and attaches a shadow root. */
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
/**
 * Adds an event listener to an element that will be removed after its first invocation.
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
 * Removes an event listener from an element.
 * @param {HTMLElement} element - The element to remove the event listener from.
 * @param {string} event - The event to stop listening for.
 * @param {Function} handler - The event handler function to remove.
 */
export function removeEventListener(element, event, handler) {
	element.removeEventListener(event, handler)
}
/**
 * A tagged template literal function for creating HTML templates.
 * @param {TemplateStringsArray} strings - The static parts of the template.
 * @param {...any} values - The dynamic values to be interpolated into the template.
 * @returns {string} The final HTML string with interpolated values.
 * @example
 * const name = 'World'
 * const greeting = html`<h1>Hello, ${name}!</h1>`
 * // Returns: "<h1>Hello, World!</h1>"
 */
export const html = (strings, ...values) => {
	return strings.reduce((result, string, i) => {
		const value = values[i - 1]
		return result + (value !== undefined ? value : '') + string
	})
}

/**
 * Converts a JavaScript object of styles into a CSS string.
 * @param {Object.<string, string|number>} styles - An object where keys are CSS property names and values are CSS values.
 * @returns {string} A semicolon-separated string of CSS property-value pairs.
 * @example
 * const styles = { color: 'red', fontSize: '14px' }
 * const cssString = styleMap(styles)
 * // Returns: "color: red; fontSize: 14px"
 */
export const styleMap = (styles) => {
	return Object.entries(styles)
		.map(([key, value]) => `${key}: ${value}`)
		.join('; ')
}
/** Internationalization (i18n) module. */
export const i18n = {
	/**
	 * Object containing translations for different languages.
	 * @type {Object.<string, Object>}
	 */
	translations: {},

	/**
	 * Get the current language of the application.
	 * @returns {string} The current language code.
	 */
	get currentLanguage() {
		const storedLanguage = localStorage.getItem('currentLanguage')
		if (storedLanguage && this.translations[storedLanguage]) {
			return storedLanguage
		} else {
			localStorage.removeItem('currentLanguage')
			return 'en'
		}
	},

	/**
	 * Set the current language of the application.
	 * @param {string} lang - The language code to set.
	 */
	set currentLanguage(lang) {
		if (this.translations[lang]) {
			localStorage.setItem('currentLanguage', lang)
		} else {
			localStorage.setItem('currentLanguage', 'en')
		}
	},

	/**
	 * Translate a key to the current language.
	 * @param {string} key - The translation key.
	 * @returns {string} The translated string or the key if not found.
	 */
	t(key) {
		const keys = key.split('.')
		let translation = this.translations[this.currentLanguage]

		for (const k of keys) {
			if (translation && translation[k] !== undefined) {
				translation = translation[k]
			} else {
				return key
			}
		}
		return translation
	},

	/**
	 * Set the current language and dispatch a language change event.
	 * @param {string} lang - The language code to set.
	 */
	setLanguage(lang) {
		this.currentLanguage = lang
		document.dispatchEvent(new CustomEvent('language-changed'))
	},

	/**
	 * Add translations for a specific language.
	 * @param {string} lang - The language code.
	 * @param {Object} translations - The translations to add.
	 */
	addTranslations(lang, translations) {
		this.translations[lang] = { ...this.translations[lang], ...translations }
	},

	/**
	 * Default translations for the application.
	 * @type {Object.<string, Object>}
	 */
	defaultTranslations: {
		en: {
			error: 'Error',
			error_invalid_component_or_layout: 'Invalid component or layout',
			error_loading_page: 'Error loading page',
			page_not_found: 'Page Not Found',
			page_not_found_description: 'The requested page could not be found.',
		},
	},

	/** Initialize the i18n module with default translations. */
	init() {
		Object.entries(this.defaultTranslations).forEach(([lang, translations]) => {
			this.addTranslations(lang, translations)
		})
	},
}

i18n.init()

/**
 * Shorthand function for translation.
 * @type {function(string): string}
 */
export const t = i18n.t.bind(i18n)
/**
 * Defines a reactive property on a target object.
 * @param {Object} target - The target object on which to define the reactive property.
 * @param {string} propertyKey - The name of the property to be defined.
 * @param {*} initialValue - The initial value of the property.
 * @returns {void}
 */
export function defineReactiveProperty(target, propertyKey, initialValue) {
    let value = initialValue;

    Object.defineProperty(target, propertyKey, {
        get() {
            return value;
        },
        set(newValue) {
            value = newValue;
            target.requestUpdate();
        },
        configurable: true,
        enumerable: true,
    });
}/**
 * The main application container element.
 * @type {HTMLElement}
 */
const app = document.querySelector('#app')

/**
 * Initializes the router of the application.
 *
 * @function
 * @param {Object.<string, {component: Function, layout: string, titleKey?: string, descriptionKey?: string}>} routes - The routes configuration object.
 * @listens window#navigate
 * @listens window#popstate
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
 * Renders the content of the application based on the current route.
 * @async
 * @function
 * @param {string} route - The current route path.
 * @param {Object.<string, {component: Function, layout: string, titleKey?: string, descriptionKey?: string}>} routes - The routes configuration object.
 * @throws {Error} Throws an error if the module fails to load.
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

				const title = i18n.t(routeInfo.titleKey || componentInstance.constructor.name)
				const description = i18n.t(routeInfo.descriptionKey || '')

				setTitle(title)
				setDescription(description)
			} else {
				console.error('Invalid component or layout:', Component, layoutTemplate)
				app.innerHTML = i18n.t('error_invalid_component_or_layout')
				setTitle(i18n.t('error'))
				setDescription(i18n.t('error_invalid_component_or_layout'))
			}
		} catch (error) {
			console.error('Error loading module:', error)
			app.innerHTML = i18n.t('error_loading_page')
			setTitle(i18n.t('error'))
			setDescription(i18n.t('error_loading_page'))
		}
	} else {
		app.innerHTML = i18n.t('page_not_found')
		setTitle(i18n.t('page_not_found'))
		setDescription(i18n.t('page_not_found_description'))
	}
}

/**
 * Navigates to the specified path and updates the browser history.
 * @function
 * @param {string} path - The path to navigate to.
 * @param {Object.<string, {component: Function, layout: string, titleKey?: string, descriptionKey?: string}>} routes - The routes configuration object.
 */
function navigate(path, routes) {
	window.history.pushState({}, '', path)
	renderContent(path, routes)
}

/**
 * Sets the title of the page.
 * @function
 * @param {string} pageTitle - The title of the page.
 */
function setTitle(pageTitle) {
	const baseTitle = window.APP_TITLE || 'dim'
	document.title = `${pageTitle} | ${baseTitle}`
}

/**
 * Sets the description of the page.
 * @function
 * @param {string} description - The description of the page.
 * @returns {HTMLMetaElement} The meta description element.
 */
function setDescription(description) {
	let metaDescription = document.querySelector('meta[name="description"]')
	if (metaDescription) {
		metaDescription.setAttribute('content', description)
	} else {
		metaDescription = document.createElement('meta')
		metaDescription.name = 'description'
		metaDescription.content = description
		document.head.appendChild(metaDescription)
	}
	return metaDescription
}
