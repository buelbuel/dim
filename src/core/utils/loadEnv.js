/**
 * Get the environment variables of the application.
 *
 * @module loadEnv
 * @param {function} loadEnv - The environment variables loader of the application.
 * @returns {Promise} The environment variables of the application.
 */
export async function loadEnv() {
	const response = await fetch('/.env')
	const text = await response.text()
	const env = {}

	text.split('\n').forEach((line) => {
		const [key, value] = line.split('=')
		if (key && value) {
			env[key.trim()] = value.trim()
		}
	})
	return env
}
