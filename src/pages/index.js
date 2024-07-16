import { BaseElement } from '../core/base/BaseElement.js'
import { html } from '../core/utils/html.js'
import { defineElement } from '../core/utils/defineElement.js'

class StartPage extends BaseElement {
	constructor() {
		super()
		this.setAttribute('title', 'Start')
		this.setAttribute('description', 'Description of the Start page.')
	}

	render() {
		return html`
			<section class="start-page container">
				<h1>Edit me</h1>
				<p>Change the content of this page in <code>src/pages/index.js</code>.</p>
			</section>
		`
	}
}

export default defineElement('start-page', StartPage)
