
import url from 'url'

export function domain (str) {
	return url.parse(str).host
		.replace(/^www\./, '')
}
