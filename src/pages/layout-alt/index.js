import { BaseElement } from '../../core/base/BaseElement.js'
import { html, styleMap } from '../../core/utils/html.js'

class LayoutAltPage extends BaseElement {
	connectedCallback() {
		super.connectedCallback()
		this.setSidebarContent()
	}

	setSidebarContent() {
		const styles = {
			'text-align': 'center',
			'color': 'var(--color-gray-100)',
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

customElements.define('layout-alt-page', LayoutAltPage)

export default LayoutAltPage
