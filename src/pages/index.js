import { BaseElement } from '../core/base/BaseElement.js'
import { html } from '../core/utils/html.js'

class StartPage extends BaseElement {
	render() {
		return html`
			<section class="start-page container">
				<h1>Edit me</h1>
				<p>Change the content of this page in <code>src/pages/index.js</code>.</p>
			</section>
		`
	}
}

customElements.define('start-page', StartPage)

export default StartPage
