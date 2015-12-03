
'use strict'

const sqlite = require('co-sqlite3')

const identity = obj => obj

module.exports = function * (path) {

	const db = yield sqlite(path)

	let tables = ['urls', 'visits', 'meta', 'keyword_search_terms']
	let json = {}

	for (let table of tables) {
		let values = yield db.all(`SELECT * FROM ${table}`)
		let parser = parsers[table] || identity
		json[table] = values.map(parser)
	}

	return json

}

/**
 * Parsers for the different database tables
 */
const parsers = {
	urls: row => {
		row['last_visit_time'] = parseDate(row['last_visit_time'])
		return row
	},
	visits: row => {
		row['visit_time'] = parseDate(row['visit_time'])
		return row
	},
}

/**
 * Parses a date from a January 1, 1601 UTC microsecond timestamp to a UNIX timestamp
 * @see http://www.forensicswiki.org/wiki/Google_Chrome#History
 */
function parseDate (timestamp) {
	let v = (timestamp / 1000000) - 11644473600
	return Math.floor(v * 1000)
}
