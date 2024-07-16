import { ShadowElement } from '../core/base/ShadowElement.js'
import { html } from '../core/utils/html.js'

class AppHeader extends ShadowElement {
	render() {
		return html`
			<header class="app-header">
				<nav class="app-header__nav">
					<a class="app-header__link" href="/">Start</a>
					<a class="app-header__link" href="/layout-alt">Layout Alt</a>
					<a class="app-header__link" href="https://github.com/buelbuel/dim">GitHub</a>
				</nav>
			</header>

			<style>
				.app-header {
					display: grid;
					height: 6rem;
				}

				.app-header__nav {
					display: flex;
					flex-direction: column;
					align-items: center;
					align-self: center;

					@media (min-width: 768px) {
						flex-direction: row;
						justify-content: center;
						gap: 1rem;
					}
				}

				.app-header__link {
					font-weight: var(--font-weight-bold);
					color: var(--color-gray-300);
					text-decoration: inherit;

					&:hover {
						color: var(--color-white);
						background-color: var(--color-gray-800);
					}

					@media (prefers-color-scheme: light) {
						color: var(--color-gray-800);
					}
				}
			</style>
		`
	}

	addEventListeners() {
		this.shadowRoot.querySelectorAll('a').forEach((link) => {
			link.addEventListener('click', this.debounce(this.handleLinkClick, 300))
		})
	}

	removeEventListeners() {
		this.shadowRoot.querySelectorAll('a').forEach((link) => {
			link.removeEventListener('click', this.handleLinkClick)
		})
	}

	handleLinkClick(event) {
		event.preventDefault()
		const anchor = event.target.closest('a')
		if (anchor && anchor.href) {
			const path = new URL(anchor.href).pathname
			window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }))
		}
	}

	debounce(func, wait) {
		let timeout
		return function (...args) {
			const later = () => {
				clearTimeout(timeout)
				func(...args)
			}
			clearTimeout(timeout)
			timeout = setTimeout(later, wait)
		}
	}
}

export default AppHeader.define('app-header')
