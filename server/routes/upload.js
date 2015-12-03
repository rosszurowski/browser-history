
const os = require('os')
const fs = require('mz/fs')
const cp = require('fs-cp')
const rm = require('rimraf-then')
const mkdir = require('mkdirp-then')
const join = require('path').join

const md5 = require('md5')
const io = require('socket.io-client')

const parse = require('../lib/parse')
const config = require('../lib/config')

const server = require('..')
const socket = io(`http://localhost:${config.port}`)

const random = () => Math.floor(Math.random() * 1000000)

/**
 * File upload route
 */
server.post('/upload', function * (next) {
	if (this.method !== 'POST') return yield next

	const ip = this.request.header["x-forwarded-for"] || this.request.ips
	const session = md5(ip)
	const username = this.get('X-User-Name') || ip

	// IDEA: if a DB from the same IP address already exists, add the new records onto it

	const path = `${os.tmpdir()}/${random()}.sqlite`
	yield cp(this.req, path)
	const db = yield parse(path)

	const output = {
		user: username,
		ip_address: ip,
		date: new Date(),
		urls: db.urls
	}

	const filepath = `${config.uploads}`
	const filename = `${session}.json`
	const metaFilename = `${session}.meta.json`
	const outputPath = `${filepath}/${filename}`
	const metaPath = `${filepath}/${metaFilename}`
	const contents = JSON.stringify(output)
	const size = Buffer.byteLength(contents, 'utf8')

	const meta = {
		session,
		ip_address: output.ip_address,
		user: output.user,
		date: output.date,
		path: filename,
		size
	}

	yield mkdir(filepath)
	yield fs.writeFile(outputPath, contents)
	yield fs.writeFile(metaPath, JSON.stringify(meta))
	yield rm(path)

	socket.emit('db:new', meta)

	this.body = { status: 200, message: 'ok' }
})
