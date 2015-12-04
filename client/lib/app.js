
import _ from 'lodash'
import Vue from 'vue'
import clone from 'clone'

import { domain } from './url'
import { format } from './date'
import { DATASET_COUNT } from './constants'
import { withThousandsComma } from './number'
import { getState, dispatch } from './store'

Vue.config.debug = true

Vue.filter('date', date)
Vue.filter('number', number)
Vue.filter('domain', domain)
Vue.filter('limit', limit)

export default function (el) {
	return new Vue({
		el,
		data: () => getState(),
		computed: {
			progressPercentage: function () {
				return this.progress * 100 + '%'
			},
			datasetCount: function () {
				return DATASET_COUNT
			}
		},
		methods: {
			selectFile: function (path) {
				dispatch('db:load', path)
			},
			selectCode: function () {
				const el = this.$els.code
				select(el)
			},
			toggleUploadPanel: function (e) {
				e.preventDefault()
				e.stopPropagation()
				this.uploadPanelOpen = !this.uploadPanelOpen
				if (this.uploadPanelOpen) {
					window.addEventListener('click', this.toggleUploadPanel)
				} else {
					window.removeEventListener('click', this.toggleUploadPanel)
				}
			}
		}
	})
}

function date (input) {
	const date = format.iso.parse(input)
	return format.yearMonthDay(date)
}

function number (input) {
	return withThousandsComma(input)
}

function limit (input, count) {
	if (!Array.isArray(input)) return
	return input.filter((v, i) => i < count)
}

function select (el) {
	if (document.selection) {
		var range = document.body.createTextRange()
		range.moveToElementText(el)
		range.select()
	} else if (window.getSelection) {
		var range = document.createRange()
		range.selectNode(el)
		window.getSelection().addRange(range)
	}
}
