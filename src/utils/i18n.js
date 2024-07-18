/**
 * Internationalization module
 * 
 */
export const i18n = {
	translations: {},

	get currentLanguage() {
		return localStorage.getItem('currentLanguage') || 'en'
	},

	set currentLanguage(lang) {
		localStorage.setItem('currentLanguage', lang)
	},

	t(key) {
		return this.translations[this.currentLanguage][key] || key
	},

	setLanguage(lang) {
		this.currentLanguage = lang
		document.dispatchEvent(new CustomEvent('language-changed'))
	},

	addTranslations(lang, translations) {
		this.translations[lang] = { ...this.translations[lang], ...translations }
	},
}
