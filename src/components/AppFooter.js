import { ShadowElement } from '../core/base/ShadowElement.js'
import { html } from '../core/utils/html.js'

class AppFooter extends ShadowElement {
	render() {
		return html`
			<footer class="app-footer">
				<p class="app-footer__p container">There is a 🥄.</p>
			</footer>

			<style>
				.app-footer {
					padding: 6rem 0;
					background-color: var(--color-gray-800);
				}

				.app-footer__p {
					color: var(--color-gray-100);
					text-align: center;
				}
			</style>
		`
	}
}

export default AppFooter.define('app-footer')