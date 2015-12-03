
import request from 'superagent-bluebird-promise'
import config from './config'

export default {
	get: (path) => request(`${config.api}/${path}`)
}
