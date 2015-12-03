
'use strict'

const koa = require('koa.io')
const cors = require('koa-cors')
const helmet = require('koa-helmet')
const router = require('koa-trie-router')
const compress = require('koa-compress')
const serve = require('koa-static')

const server = koa()
module.exports = server

/**
 * Middleware
 */
server.use(compress())
server.use(helmet())
server.use(cors({ origin: true }))
server.use(router(server))

server.use(require('./lib/middleware/error'))
server.use(require('./lib/middleware/notfound'))

require('./routes/socket')
require('./routes/upload')
require('./routes/index')

// TODO: move to S3
server.use(serve('db'))
