
'use strict'

const md5 = require('md5')
const server = require('..')

let clients = []

/**
 * Socket rules
 */
server.io.use(function * (next) {
	yield* next
	let index = clients.indexOf(this.id)
	if (index !== -1) {
		clients.splice(index)
	}
})

server.io.route('client:join', function * (next) {
	this.id = md5(this.request.ip)
	clients.push(id)
	this.emit('client:session', {
		id: id,
		count: clients.length
	})
	this.broadcast.emit('client:joined', {
		count: clients.length
	})
})

server.io.route('db:new', function * (next) {

	this.broadcast.emit('new message', {
		message
	})
})
