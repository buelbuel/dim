/**
 * A tagged template literal function for creating HTML templates.
 * @param {TemplateStringsArray} strings - The static parts of the template.
 * @param {...any} values - The dynamic values to be interpolated into the template.
 * @returns {string} The final HTML string with interpolated values.
 * @example
 * const name = 'World'
 * const greeting = html`<h1>Hello, ${name}!</h1>`
 * // Returns: "<h1>Hello, World!</h1>"
 */
export const html = (strings, ...values) => {
	return strings.reduce((result, string, i) => {
		const value = values[i - 1]
		return result + (value !== undefined ? value : '') + string
	})
}

/**
 * Converts a JavaScript object of styles into a CSS string.
 * @param {Object.<string, string|number>} styles - An object where keys are CSS property names and values are CSS values.
 * @returns {string} A semicolon-separated string of CSS property-value pairs.
 * @example
 * const styles = { color: 'red', fontSize: '14px' }
 * const cssString = styleMap(styles)
 * // Returns: "color: red; fontSize: 14px"
 */
export const styleMap = (styles) => {
	return Object.entries(styles)
		.map(([key, value]) => `${key}: ${value}`)
		.join('; ')
}
