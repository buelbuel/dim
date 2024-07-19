/**
 * Internationalization (i18n) module.
 */
export const i18n = {
	/**
	 * Object containing translations for different languages.
	 * @type {Object.<string, Object>}
	 */
	translations: {},

	/**
	 * Get the current language of the application.
	 * @returns {string} The current language code.
	 */
	get currentLanguage() {
		const storedLanguage = localStorage.getItem('currentLanguage')
		if (storedLanguage && this.translations[storedLanguage]) {
			return storedLanguage
		} else {
			localStorage.removeItem('currentLanguage')
			return 'en'
		}
	},

	/**
	 * Set the current language of the application.
	 * @param {string} lang - The language code to set.
	 */
	set currentLanguage(lang) {
		if (this.translations[lang]) {
			localStorage.setItem('currentLanguage', lang)
		} else {
			localStorage.setItem('currentLanguage', 'en')
		}
	},

	/**
	 * Translate a key to the current language.
	 * @param {string} key - The translation key.
	 * @returns {string} The translated string or the key if not found.
	 */
	t(key) {
		const keys = key.split('.')
		let translation = this.translations[this.currentLanguage]

		for (const k of keys) {
			if (translation && translation[k] !== undefined) {
				translation = translation[k]
			} else {
				return key
			}
		}
		return translation
	},

	/**
	 * Set the current language and dispatch a language change event.
	 * @param {string} lang - The language code to set.
	 */
	setLanguage(lang) {
		this.currentLanguage = lang
		document.dispatchEvent(new CustomEvent('language-changed'))
	},

	/**
	 * Add translations for a specific language.
	 * @param {string} lang - The language code.
	 * @param {Object} translations - The translations to add.
	 */
	addTranslations(lang, translations) {
		this.translations[lang] = { ...this.translations[lang], ...translations }
	},

	/**
	 * Default translations for the application.
	 * @type {Object.<string, Object>}
	 */
	defaultTranslations: {
		en: {
			error: 'Error',
			error_invalid_component_or_layout: 'Invalid component or layout',
			error_loading_page: 'Error loading page',
			page_not_found: 'Page Not Found',
			page_not_found_description: 'The requested page could not be found.',
		},
	},

	/**
	 * Initialize the i18n module with default translations.
	 */
	init() {
		Object.entries(this.defaultTranslations).forEach(([lang, translations]) => {
			this.addTranslations(lang, translations)
		})
	},
}

i18n.init()

/**
 * Shorthand function for translation.
 * @type {function(string): string}
 */
export const t = i18n.t.bind(i18n)
