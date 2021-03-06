
import _ from 'lodash'
import ready from 'domready'
import barracks from 'barracks'

window.ready = ready

import visualization from './visualization'
import api from './api'
import parse from './parse'
import { domain } from './url'
import { format, sort } from './date'
import { EXCLUDED_DOMAINS, FAVORITE_COUNT } from './constants'

const dispatcher = barracks()
const state = {
	id: '',
	connected: false,
	progress: 0.0,
	loaded: false,
	files: [],
	file: null,
	favorites: [],
	dayCount: -1,
	pageCount: -1,
	uploadPanelOpen: false,
	updatedAt: Date.now()
}

let db = {}
let vis = null

dispatcher.on('error', err => console.error(err))
dispatcher.on('sync', data => {
	state.connected = true
	state.id = data.id
	state.files = data.files.sort(sort)
	state.file = 0
	state.updatedAt = Date.now()
	vis = visualization()
	console.log('State:', state)
})

/**
 * New DB added on server
 */
dispatcher.on('file:new', data => {
	state.files.push(data)
})

dispatcher.on('db:load', file => {
	state.progress = 0.0
	state.loaded = false
	if (vis) {
		vis.clear()
	}
	// TODO: add memoizing
	api.get(file.path)
		.on('progress', e => dispatch('db:progress', e.loaded / file.size))
		.then(res => parse.chrome(res.body))
		.then(res => dispatch('db:loaded', res))
		.catch(err => console.error(err))
})

/**
 * Progress in loading db
 */
dispatcher.on('db:progress', data => {
	state.progress = data
})

/**
 * db has been fully loaded
 */
dispatcher.on('db:loaded', data => {
	db = data.urls
	state.favorites = _(db)
		.sort((a, b) => b.visit_count - a.visit_count)
		.unique(d => domain(d.url))
		.filter(d => /^http(s)?/g.test(d.url))
		.filter(d => !EXCLUDED_DOMAINS.includes(domain(d.url)))
		.take(FAVORITE_COUNT).value()
	state.dayCount = _(db)
		.countBy(row => format.yearMonthDay(row.last_visit_time))
		.keys().value().length
	state.pageCount = db.length
	state.loaded = true
	// NOTE: We're current using the date as the unique identifier, which
	// has obvious issues. We should add the `session` key that's present in
	// state.files to incoming databases
	state.file = state.files.findIndex(file => file.date === data.date)
	dispatch('visualization:update', db)
})

dispatcher.on('visualization:update', data => {
	vis.clear()
	vis.configure(data)
	vis.render()
})

export const dispatch = dispatcher
export const getState = () => state
