/**
 * A tagged template literal function for creating HTML templates.
 *
 * @module html
 * @param {TemplateStringsArray} strings - The template strings.
 * @param {...any} values - The values to be interpolated into the template.
 * @returns {string} The final HTML string.
 */
export const html = (strings, ...values) => {
	return strings.reduce((result, string, i) => {
		const value = values[i - 1]
		return result + (value !== undefined ? value : '') + string
	})
}

/**
 * Converts a JavaScript object of styles into a CSS string.
 *
 * @module styleMap
 * @param {Object} styles - The styles object.
 * @returns {string} The CSS string.
 */
export const styleMap = (styles) => {
	return Object.entries(styles)
		.map(([key, value]) => `${key}: ${value}`)
		.join('; ')
}
