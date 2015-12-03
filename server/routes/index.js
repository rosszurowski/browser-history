
'use strict'

const fs = require('mz/fs')

const server = require('..')
const config = require('../lib/config')
const readdir = require('../lib/readdir')

server.get('/', function * (next) {
	this.body = yield readdir(config.uploads)
})

server.get('/ping', function * (next) {
	this.body = { pong: true }
})
