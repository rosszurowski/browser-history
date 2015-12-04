
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
export const DATASET_COUNT = 6
export const FAVORITE_COUNT = 5

/**
 * Graphic constants
 */
export const PADDING = 40

export const DEFAULT_FILL_STYLE = 'rgba(127, 127, 127, 0.05)'
export const DOMAIN_FILL_STYLES = {
	// Local
	'localhost:8080': 'rgba(232, 241, 134, 0.2)',
	// Google Services
	'google.com': 'rgba(245, 249, 255, 0.2)',
	'docs.google.com': 'rgba(245, 249, 255, 0.2)',
	'mail.google.com': 'rgba(245, 249, 255, 0.2)',
	// Popular Sites
	'youtube.com': 'rgba(247, 59, 59, 0.2)',
	'facebook.com': 'rgba(59, 89, 152, 0.2)',
	'instagram.com': 'rgba(63, 114, 156, 0.2)',
	'reddit.com': 'rgba(255, 69, 0, 0.2)',
	// Developer Sites
	'news.ycombinator.com': 'rgba(255, 102, 0, 0.2)',
	'stackoverflow.com': 'rgba(242, 131, 0, 0.2)',
}
