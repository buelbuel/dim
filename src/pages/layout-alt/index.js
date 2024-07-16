import { BaseElement } from '../../core/base/BaseElement.js'
import { html, styleMap } from '../../core/utils/html.js'
import { defineElement } from '../../core/utils/defineElement.js'

class LayoutAltPage extends BaseElement {
	constructor() {
		super()
		this.setAttribute('title', 'Alternative Layout')
		this.setAttribute('description', 'Alternative layout of the application.')
	}

	connectedCallback() {
		super.connectedCallback()
		this.setSidebarContent()
	}

	setSidebarContent() {
		const styles = {
			'text-align': 'center',
			color: 'var(--color-gray-100)',
		}

		const sidebarContent = html` <p style="${styleMap(styles)}">Sidebar Content.</p> `

		window.dispatchEvent(
			new CustomEvent('set-sidebar-content', {
				detail: { content: sidebarContent },
			})
		)
	}

	render() {
		return html`
			<section class="layout-b-page container">
				<h1>Alternative Layout.</h1>
				<p>Define different layouts in index.html using &lt;template&gt;.</p>
			</section>
		`
	}
}

export default defineElement('layout-alt-page', LayoutAltPage)
