/**
 * Defines custom elements to reduce boilerplate code.
 *
 * @module defineElement
 * @param {string} name - The name of the element.
 * @param {Object} ElementClass - The class
 * @returns {Object} The class
 */
export function defineElement(name, ElementClass) {
	customElements.define(name, ElementClass)
	return ElementClass
}
