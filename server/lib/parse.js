
const chrome = require('./parsers/chrome')

module.exports = function * (db) {
	// TODO: add check to see which browser it is
	return yield chrome(db)
}
