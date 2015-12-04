
import _ from 'lodash'
import d3 from 'd3'
import raf from 'component-raf'
import Vue from 'vue'

import * as date from './date'
import * as number from './number'
import * as url from './url'

import {
	TWO_PI,
	PADDING,
	DEFAULT_FILL_STYLE,
	DOMAIN_FILL_STYLES
} from './constants'

import { dispatch, getState } from './store'

let width
let height

const body = d3.select('body')
const canvas = body.select('.canvas')
const ctx = canvas.node().getContext('2d')
const clear = ctx => ctx.clearRect(0, 0, width, height)

const ly = d3.scale.linear()
	.domain([0, 2])
	.range([0, 100])

/**
 * Data visualization
 */


export default function (data) {
	const days = d3.nest()
		.key(d => date.format.yearMonthDay(d.last_visit_time))
		.entries(data)
	const x = d3.scale.linear()
		.domain([0, d3.keys(days).length])
		.range([PADDING, width - PADDING])
	const y = d3.time.scale()
		.range([PADDING, height - PADDING])
	const resizer = _.throttle(resize, 200)

	d3.select('.labels').selectAll('.label')
			.data(['12am', '12pm', '12am'])
		.enter().append('div')
			.attr('class', 'label')
			.style('top', (d, i) => `${ly(i)}%`)
			.text(d => d)

	d3.select(window).on('resize', resizer)

	function render () {
		clear(ctx)
		days.forEach((day, i) => {
			setTimeout(() => {
				const left = x(i)
				const firstVisit = day.values[0]
				y.domain(date.extentOfDay(firstVisit.last_visit_time))
				console.log('rendering day ' + i)
				day.values.forEach((site, j) => {
					const top = y(site.last_visit_time)
					const fill = getFillColor(site.url)
					raf(() => dot(ctx, top, left, fill))
				})
			}, i * 5)
		})
	}

	function resize () {
		width = canvas.node().clientWidth
		height = canvas.node().clientHeight
		canvas
			.attr('width', width)
			.attr('height', height)
		x.range([PADDING, width - PADDING])
		y.range([PADDING, height - PADDING])
		render()
	}

	clear(ctx)
	resize()

	return {
		destroy () {
			clear(ctx)
		}
	}
}


/**
 * Get dot color
 */
function getFillColor (u) {
	const domain = url.domain(u)
	const color = DOMAIN_FILL_STYLES[domain]
	return typeof color !== 'undefined' ? color : DEFAULT_FILL_STYLE
}

/**
 * Draw dot to canvas
 */
function dot (ctx, top, left, fill) {
	ctx.fillStyle = fill
	ctx.beginPath()
	ctx.arc(Math.round(left), top, 2, 0, TWO_PI, true)
	ctx.fill()
}
