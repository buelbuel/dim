/**
 * Entry point of the application
 *
 * @module index
 * @param {Object} initRouter - The router utility of the application.
 * @param {Object} loadEnv - The environment variables loader of the application.
 * @param {Object} AppHeader - The header component of the application.
 * @param {Object} AppFooter - The footer component of the application.
 */
import { initRouter } from './core/utils/router.js'
import { loadEnv } from './core/utils/loadEnv.js'
import './components/AppHeader.js'
import './components/AppFooter.js'
import './components/AppSidebar.js'

/**
 * Initializes the application
 *
 * @param {Function} initRouter - The router utility of the application.
 * @param {Object} document - The document with the DOM of the application.
 * @returns {Object} The routes of the application.
 */
document.addEventListener('DOMContentLoaded', () => {
	initRouter()
})

/**
 * Load the environment variables of the application.
 *
 * @param {Function} loadEnv - The environment variables loader of the application.
 * @returns {Promise} The environment variables of the application.
 */
loadEnv().then((env) => {
	if (env.APP_TITLE) document.title = env.APP_TITLE
	if (env.APP_DESCRIPTION)
		document
			.querySelector('meta[name="description"]')
			.setAttribute('content', env.APP_DESCRIPTION)
})
