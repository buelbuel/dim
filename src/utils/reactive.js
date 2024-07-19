/**
 * Defines a reactive property on a target object.
 * @param {Object} target - The target object on which to define the reactive property.
 * @param {string} propertyKey - The name of the property to be defined.
 * @param {*} initialValue - The initial value of the property.
 * @returns {void}
 * @description
 * This function creates a property on the target object that, when set,
 * automatically triggers an update request on the target. It uses
 * Object.defineProperty to create a getter and setter for the property.
 * @example
 * const myComponent = new MyComponent();
 * defineReactiveProperty(myComponent, 'count', 0);
 * myComponent.count = 5; // This will automatically trigger an update
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
