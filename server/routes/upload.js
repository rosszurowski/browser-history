
const server = require('..')

/**
 * File upload route
 */
server.use(function * (next) {
	if (this.method !== 'POST') return yield next

	const path = `${__dirname}/tmp/${random()}.sqlite`
	yield cp(this.req, path)
	const db = yield sqlite(path)
	const result = yield parse(db)
	yield rm(path)

	this.body = { status: 200, message: 'ok' }
})
