
const http = require('http')

module.exports = function * (next) {
	try {
		yield next
	} catch (err) {
		this.status = err.status || 500
		this.app.emit('error', err, this)
		if (this.accepts('json', 'text') === 'text') {
			this.type = 'text/plain'
			throw err
			return
		}
		this.type = 'application/json'
		this.body = {
			code: err.code || http.STATUS_CODES[this.status],
			status: this.status,
			message: err.message,
		}
	}
}
