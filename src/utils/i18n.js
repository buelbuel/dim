/**
 * Internationalization (i18n) module.
 *
 * @param {currentLanguage} - The current language of the application.
 * @param {Function} t - The translation function.
 * @param {Function} setLanguage - The function to set the current language.
 * @param {Function} addTranslations - The function to add translations.
 * @param {Object} translations - The translations of the application.
 * @param {String} currentLanguage - The current language of the application.
 * @param {Object} defaultTranslations - The default translations of the application.
 * @param {Function} init - The initialization function.
 * @returns {Object} The i18n module.
 */
export const i18n = {
	translations: {},

	get currentLanguage() {
		const storedLanguage = localStorage.getItem('currentLanguage')
		if (storedLanguage && this.translations[storedLanguage]) {
			return storedLanguage
		} else {
			localStorage.removeItem('currentLanguage')
			return 'en'
		}
	},

	set currentLanguage(lang) {
		if (this.translations[lang]) {
			localStorage.setItem('currentLanguage', lang)
		} else {
			localStorage.setItem('currentLanguage', 'en')
		}
	},

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

	setLanguage(lang) {
		this.currentLanguage = lang
		document.dispatchEvent(new CustomEvent('language-changed'))
	},

	addTranslations(lang, translations) {
		this.translations[lang] = { ...this.translations[lang], ...translations }
	},

	defaultTranslations: {
		en: {
			error: 'Error',
			error_invalid_component_or_layout: 'Invalid component or layout',
			error_loading_page: 'Error loading page',
			page_not_found: 'Page Not Found',
			page_not_found_description: 'The requested page could not be found.',
		},
	},

	init() {
		Object.entries(this.defaultTranslations).forEach(([lang, translations]) => {
			this.addTranslations(lang, translations)
		})
	},
}

i18n.init()

export const t = i18n.t.bind(i18n)
