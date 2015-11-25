
'use strict'

const fs = require('fs')
const os = require('os')
const cp = require('fs-cp')
const rm = require('rimraf-then')
const join = require('path').join

const koa = require('koa.io')
const cors = require('koa-cors')
const serve = require('koa-static')
const helmet = require('koa-helmet')
const router = require('koa-trie-router')
const compress = require('koa-compress')

const md5 = require('md5')
const sqlite = require('co-sqlite3')
const parse = require('./lib/parse')

const random = () => Math.floor(Math.random() * 1000)

const server = koa()
module.exports = server

let cache = {}

/**
 * Middleware
 */
server.use(compress())
server.use(helmet())
server.use(cors({ origin: true }))
server.use(router(server))

server.use(require('./lib/middleware/error'))
server.use(require('./lib/middleware/notfound'))

require('./routes/upload')
require('./routes/socket')
