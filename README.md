# dim

dim is a highly opinionated web component boilerplate, designed as a sane alternative to the node madness of todays web. It focuses on simplicity and adherence to web standards only, offering some of the quality-of-life features found in lit, but with zero dependencies.

## Why?

dim provides a lightweight alternative to complex web component libraries, focusing on:

- Simplicity: No build step, no dependencies
- Standards: Leveraging web standards and custom elements
- Flexibility: Easy to extend and customize
- Performance: Minimal overhead and efficient updates

By using dim, you can create modern web applications with a familiar component-based architecture while staying as close to the metal as humanly possible (not literally).

## Features

- Web standards only
- Zero dependencies
- Local development through devcontainer with nginx (no additional servers or dependencies)
- Simple router
- Abstracted HTML and Shadow Element components for less boilerplate
- Easy layouts
- Environment variable loading
- Deploying is as simple as `git push` and `sudo nginx`

## Project Structure

src/
├── assets/
│   ├── static/
│   └── styles/
├── components/
├── core/
│   ├── base/
│   └── utils/
└── pages/

## Example

```javascript
import { BaseElement } from '../../core/base/BaseElement.js'
import { html, styleMap } from '../../core/utils/html.js'

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

export default LayoutAltPage.define('layout-alt-page')
```

## Getting Started

1. Clone the repository
2. Open the project in VS Code with the Remote - Containers extension
3. The devcontainer will automatically set up the environment
4. Access the application at `http://localhost:8080`

## Key Concepts

### Router

dim includes a simple router that allows for easy navigation and layout switching SPA-style. Define your routes in `src/routes.js`.

### Components

Create reusable components by extending either `BaseElement` or `ShadowElement`:

```javascript
import { BaseElement } from '../core/base/BaseElement.js'
import { html } from '../core/utils/html.js'

class MyComponent extends BaseElement {
	render() {
		return html<div>My Component</div>
	}
}

customElements.define('my-component', MyComponent)
```

### Layouts

Define different layouts in `index.html` using `<template>` tags and specify the layout in your routes.

### Styling

Use the `styleMap` utility for inline styles or include CSS in your component's render method.