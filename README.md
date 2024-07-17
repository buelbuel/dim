# dim

dim is a web component helper library, designed as a sane alternative to the node madness of todays web. It focuses on simplicity and adherence to web standards only, offering some of the quality-of-life features found in lit, but with zero dependencies.

## Why?

dim provides a lightweight alternative to complex web component libraries, focusing on:

- Simplicity: No build step, no dependencies
- Standards: Leveraging web standards and custom elements
- Flexibility: Easy to extend and customize
- Performance: Minimal overhead and efficient updates

By using dim, you can create modern web applications with a familiar component-based architecture while staying as close to the metal as humanly possible (not literally).

## Features
- Zero dependencies
- Web standards-based
- Simple router
- Abstracted HTML and Shadow Element components for less boilerplate
- Utility functions for HTML templating and styling

## Installation

Copy the distributed files or just add to your index.html:

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/buelbuel/dim/dist/dim.min.js"></script>
```

## Usage

### BaseElement

```js
import { BaseElement } from 'dim-core/base';
import { html } from 'dim-core/utils';

class MyComponent extends BaseElement {
  render() {
    return html`<div>My Component</div>`;
  }
}

export default MyComponent.define('my-component');
```

### ShadowElement

```js
import { ShadowElement } from 'dim-core/base';
import { html } from 'dim-core/utils';

class MyShadowComponent extends ShadowElement {
  render() {
    return html`<div>My Shadow DOM Component</div>`;
  }
}

export default MyShadowComponent.define('my-shadow-component');
```

### HTML and Style Utilities

```js
import { html, styleMap } from 'dim-core/utils';

const styles = {
  color: 'red',
  fontSize: '16px',
};

const template = html`
  <div style="${styleMap(styles)}">
    Styled content
  </div>
`;
```

### Router

```js
import { initRouter } from 'dim-core/utils';

const routes = {
  '/': { component: () => import('./pages/Home.js'), layout: 'default-layout' },
  '/about': { component: () => import('./pages/About.js'), layout: 'default-layout' },
};

initRouter(routes);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.