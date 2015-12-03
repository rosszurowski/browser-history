
const path = require('path')
const resolve = (dir) => path.resolve(__dirname, dir)

module.exports = {
	port: process.env.PORT || 8081,
	env: process.env.NODE_ENV || 'development',

	// paths
	root: resolve('..'),
	public: resolve('../public'),
	uploads: resolve('../db')
}
