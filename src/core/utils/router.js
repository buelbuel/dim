/**
 * Defines the router of the application.
 *
 * @module router
 * @param {Object} routes - The routes of the application.
 * @param {Object} app - The application container.
 */
import { routes } from '../../routes.js'

const app = document.querySelector('#app')

/**
 * Initializes the router of the application.
 *
 * @param {Function} initRouter - The router of the application.
 */
export function initRouter() {
	window.addEventListener('navigate', (event) => {
		const { path } = event.detail
		navigate(path)
	})

	window.addEventListener('popstate', () => {
		renderContent(window.location.pathname)
	})

	renderContent(window.location.pathname)
}

/**
 * Renders the content of the application.
 *
 * @param {Function} renderContent - The content rendering function of the application.
 * @param {Object} route - The route of the application.
 */
async function renderContent(route) {
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
			} else {
				console.error('Invalid component or layout:', Component, layoutTemplate)
				app.innerHTML = '<div>Error: Invalid component or layout</div>'
			}
		} catch (error) {
			console.error('Error loading module:', error)
			app.innerHTML = '<div>Error loading page</div>'
		}
	} else {
		app.innerHTML = '<div>Page not found</div>'
	}
}

/**
 * Navigates to the path of the application.
 *
 * @param {Function} navigate - The navigation function of the application.
 * @param {String} path - The path of the application.
 */
function navigate(path) {
	window.history.pushState({}, '', path)
	renderContent(path)
}
