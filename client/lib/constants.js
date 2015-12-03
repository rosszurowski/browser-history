
/**
 * General constants
 */
export const TWO_PI = Math.PI * 2

/**
 * Data constants
 */

export const EXCLUDED_DOMAINS = [
	'docs.google.com' // it triggers way too many history events
]
export const FAVORITE_COUNT = 5

/**
 * Graphic constants
 */
export const PADDING = 40

export const DEFAULT_FILL_STYLE = 'rgba(246, 138, 103, 0.05)'
export const DOMAIN_FILL_STYLES = {
	'localhost:8080': 'rgba(232, 241, 134, 0.2)',
	'docs.google.com': 'rgba(232, 241, 134, 0.2)',
	'facebook.com': 'rgba(134, 151, 241, 0.2)',
	'youtube.com': 'rgba(247, 59, 59, 0.2)',
	'mail.google.com': 'rgba(232, 241, 134, 0.2)',
	'reddit.com': 'rgba(232, 241, 134, 0.2)'
}
