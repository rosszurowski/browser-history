
import io from 'socket.io-client'
import request from 'superagent-bluebird-promise'
import ready from 'domready'

import config from './lib/config'
import api from './lib/api'
import parse from './lib/parse'
import { dispatch, getState } from './lib/store'

import view from './lib/app'

const socket = io(config.socket)

socket.on('session:ready', res => {
	dispatch('sync', res)
	const state = getState()
	const file = state.files[state.file]
	dispatch('db:load', file)
})

socket.on('db:saved', res => dispatch('file:new', res))
socket.on('error', err => console.error('Error:', err))

/**
 * Kick it off
 */
socket.emit('session:new')

ready(() => {
	view('.app')
	document.body.classList.remove('loading')
})
