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

	static define(name) {
		customElements.define(name, this)
		return this
	}
}

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

/**
 * A tagged template literal function for creating HTML templates.
 *
 * @module html
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
 * @module styleMap
 * @param {Object} styles - The styles object.
 * @returns {string} The CSS string.
 */
export const styleMap = (styles) => {
	return Object.entries(styles)
		.map(([key, value]) => `${key}: ${value}`)
		.join('; ')
}

/**
 * Defines the router of the application.
 *
 * @module router
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

