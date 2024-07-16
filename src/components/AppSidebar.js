import { ShadowElement } from '../core/base/ShadowElement.js'
import { html } from '../core/utils/html.js'

class AppSidebar extends ShadowElement {
	render() {
		return html`
			<aside class="app-sidebar">
				<slot></slot>
			</aside>
		`
	}

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('set-sidebar-content', this.handleSetContent.bind(this))
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		window.removeEventListener('set-sidebar-content', this.handleSetContent.bind(this))
	}

	handleSetContent(event) {
		const content = event.detail.content
		const slot = this.shadowRoot.querySelector('slot')
		if (slot) {
			slot.innerHTML = content
		}
	}
}

export default AppSidebar.define('app-sidebar')
