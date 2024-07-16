/**
 * Defines the routes of the application.
 *
 * @module routes
 * @param {Object} routes - The routes of the application.
 * @returns {Object} The routes of the application.
 */
export const routes = {
	'/': {
		component: () => import('./pages/index.js'),
		layout: 'main-layout',
	},
	'/layout-alt': {
		component: () => import('./pages/layout-alt/index.js'),
		layout: 'alternate-layout',
	},
}
