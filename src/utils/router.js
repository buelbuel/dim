/**
 * @param {Object} app - The application container.
 */
const app = document.querySelector('#app')

/**
 * Initializes the router of the application.
 *
 * @param {Function} initRouter - The router of the application.
 * @param {Object} routes - The routes of the application.
 * @returns {Function} The router of the application.
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
 * @param {Object} routes - The routes of the application.
 * @returns {Function} The content rendering function of the application.
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
				app.innerHTML = '<div>Error: Invalid component or layout</div>'
				setTitle(i18n.t('error'))
				setDescription(i18n.t('error_invalid_component_or_layout'))
			}
		} catch (error) {
			console.error('Error loading module:', error)
			app.innerHTML = '<div>Error loading page</div>'
			setTitle(i18n.t('error'))
			setDescription(i18n.t('error_loading_page'))
		}
	} else {
		app.innerHTML = '<div>Page not found</div>'
		setTitle(i18n.t('page_not_found'))
		setDescription(i18n.t('page_not_found_description'))
	}
}

/**
 * Navigates to the path of the application.
 *
 * @param {Function} navigate - The navigation function of the application.
 * @param {String} path - The path of the application.
 * @param {Object} routes - The routes of the application.
 * @returns {Function} The navigation function of the application.
 */
function navigate(path, routes) {
	window.history.pushState({}, '', path)
	renderContent(path, routes)
}

/**
 * Sets the title of the page.
 *
 * @param {String} pageTitle - The title of the page.
 * @returns {String} The title of the page.
 */
function setTitle(pageTitle) {
	const baseTitle = window.APP_TITLE || 'dim'
	document.title = `${pageTitle} | ${baseTitle}`
}

/**
 * Sets the description of the page.
 * 
 * @param {String} description - The description of the page.
 * @returns {HTMLElement} The meta description element.
 */
function setDescription(description) {
	const metaDescription = document.querySelector('meta[name="description"]')
	if (metaDescription) {
		metaDescription.setAttribute('content', description)
	} else {
		const newMetaDescription = document.createElement('meta')
		newMetaDescription.name = 'description'
		newMetaDescription.content = description
		document.head.appendChild(newMetaDescription)
	}
}
