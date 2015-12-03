
const fs = require('mz/fs')
const join = require('path').join

var Promise = require('bluebird')

const noHiddenFiles = name => !name.startsWith('.')
const onlyMetaFiles = name => name.endsWith('.meta.json')

module.exports = function * (dir) {
	const files = yield fs.readdir(dir)
		.filter(noHiddenFiles)
		.filter(onlyMetaFiles)
	const meta = yield Promise.map(files, file => fs.readFile(join(dir, file), 'utf8'))
	return meta.map(JSON.parse)
}
