/**
 * Define a reactive property on a target object.
 *
 * @param {Object} target - The target object.
 * @param {string} propertyKey - The key of the property.
 * @param {any} initialValue - The initial value of the property.
 */
export function defineReactiveProperty(target, propertyKey, initialValue) {
	let value = initialValue

	Object.defineProperty(target, propertyKey, {
		get() {
			return value
		},

		set(newValue) {
			value = newValue
			target.requestUpdate()
		},

		configurable: true,
		enumerable: true,
	})
}
