/**
 * The main application container element.
 * @type {HTMLElement}
 */
const app = document.querySelector('#app')

/**
 * Initializes the router of the application.
 *
 * @param {Object.<string, {component: Function, layout: string, titleKey?: string, descriptionKey?: string}>} routes - The routes configuration object.
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
 *
 * @param {string} route - The current route path.
 * @param {Object.<string, {component: Function, layout: string, titleKey?: string, descriptionKey?: string}>} routes - The routes configuration object.
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
 *
 * @param {string} path - The path to navigate to.
 * @param {Object.<string, {component: Function, layout: string, titleKey?: string, descriptionKey?: string}>} routes - The routes configuration object.
 */
function navigate(path, routes) {
	window.history.pushState({}, '', path)
	renderContent(path, routes)
}

/**
 * Sets the title of the page.
 *
 * @param {string} pageTitle - The title of the page.
 */
function setTitle(pageTitle) {
	const baseTitle = window.APP_TITLE || 'dim'
	document.title = `${pageTitle} | ${baseTitle}`
}

/**
 * Sets the description of the page.
 *
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
