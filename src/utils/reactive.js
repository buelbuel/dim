/**
 * Defines a reactive property on a target object.
 * @param {Object} target - The target object on which to define the reactive property.
 * @param {string} propertyKey - The name of the property to be defined.
 * @param {*} initialValue - The initial value of the property.
 * @returns {void}
 */
export function defineReactiveProperty(target, propertyKey, initialValue) {
    let value = initialValue;

    Object.defineProperty(target, propertyKey, {
        get() {
            return value;
        },
        set(newValue) {
            value = newValue;
            target.requestUpdate();
        },
        configurable: true,
        enumerable: true,
    });
}