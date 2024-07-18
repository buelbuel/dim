/**
 * Utility functions for adding event listeners
 *
 * @param {HTMLElement} element - The element to add the event listener to.
 * @param {string} event - The event to listen for.
 * @param {Function} handler - The event handler function.
 */
export function addEventListenerOnce(element, event, handler) {
	const eventKey = `__${event}_handler__`

	if (element[eventKey]) {
		element.removeEventListener(event, element[eventKey])
	}
	element[eventKey] = handler
	element.addEventListener(event, handler)
}

/**
 * Utility functions for removing event listeners
 *
 * @param {HTMLElement} element - The element to add the event listener to.
 * @param {string} event - The event to listen for.
 * @param {Function} handler - The event handler function.
 */
export function removeEventListener(element, event, handler) {
	element.removeEventListener(event, handler)
}
