/**
 * Adds an event listener to an element that will be removed after its first invocation.
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
 * Removes an event listener from an element.
 * @param {HTMLElement} element - The element to remove the event listener from.
 * @param {string} event - The event to stop listening for.
 * @param {Function} handler - The event handler function to remove.
 */
export function removeEventListener(element, event, handler) {
	element.removeEventListener(event, handler)
}
