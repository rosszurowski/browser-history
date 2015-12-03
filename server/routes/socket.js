
'use strict'

const fs = require('mz/fs')
const md5 = require('md5')
const ss = require('socket.io-stream')
const server = require('..')
const config = require('../lib/config')
const readdir = require('../lib/readdir')

let clients = {}
let db = {}

/**
 * Before/After Socket Middleware
 * @see https://github.com/koajs/koa.io/
 */
server.io.use(function * (next) {
	yield* next
	// remove client
	if (clients[this.id]) {
		delete clients[this.id]
	}
})

/**
 * When a new client joins
 */
server.io.route('session:new', function * (next) {
	clients[this.id] = this
	const id = this.id
	const count = Object.keys(clients).length
	const files = yield readdir(config.uploads)
	this.emit('session:ready', { id, count, files })
})

/**
 * When a new database is submitted, broadcast it to everyone
 */
server.io.route('db:new', function * (next, data) {
	this.broadcast.emit('db:saved', data)
})
