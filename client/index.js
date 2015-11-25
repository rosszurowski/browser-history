
import _ from 'lodash'
import d3 from 'd3'

import * as parse from './lib/parse'
import * as date from './lib/date'
import * as number from './lib/number'
import * as url from './lib/url'

const TWO_PI = Math.PI * 2

const body = d3.select('body')
const padding = 40

const colors = {
	'localhost:8080': 'rgba(232, 241, 134, 0.2)',
	'docs.google.com': 'rgba(232, 241, 134, 0.2)',
	'facebook.com': 'rgba(134, 151, 241, 0.2)',
	'mail.google.com': 'rgba(232, 241, 134, 0.2)',
	'reddit.com': 'rgba(232, 241, 134, 0.2)'
}

const excluded = [
	'docs.google.com' // it triggers way too many history events
]

function init (data) {

	var days = d3.nest()
		.key(d => date.format.yearMonthDay(d.last_visit_time))
		.entries(data)

	var favourites = _(data)
		.sort((a, b) => b.visit_count - a.visit_count)
		.unique(d => url.domain(d.url))
		.filter(d => /^http(s)?/g.test(d.url))
		.filter(d => !excluded.includes(url.domain(d.url)))
		.take(5)
		.value()

	var canvas = body.append('canvas')
		.classed('canvas', true)
	canvas
		.attr('width', canvas.node().clientWidth)
		.attr('height', canvas.node().clientHeight)
	var ctx = canvas.node().getContext('2d')
	ctx.imageSmoothingEnabled = false

	body.select('[data-bind="pages"]').text(number.withThousandsComma(data.length))
	body.select('[data-bind="days"]').text(days.length)

	var ly = d3.scale.linear()
		.domain([0, 2])
		.range([0, 100])

	d3.select('.header-sites-list').selectAll('.header-site')
			.data(favourites)
		.enter().append('a')
			.attr('class', 'header-site')
			.attr('target', '_blank')
			.attr('href', d => d.url)
			.text(d => url.domain(d.url))

	d3.select('.labels').selectAll('.label')
			.data(['12am', '12pm', '12am'])
		.enter().append('div')
			.attr('class', 'label')
			.style('top', (d, i) => `${ly(i)}%`)
			.text(d => d)

	var x = d3.scale.linear()
		.domain([0, d3.keys(days).length])
		.range([padding, canvas.node().clientWidth - padding])
	var y = d3.time.scale()
		.range([padding, canvas.node().clientHeight - padding])

	render()
	d3.select(window).on('resize', _.throttle(resize, 200))

	function render () {
		var fillStyle = 'rgba(246, 138, 103, 0.05)'
		clear(ctx, canvas.node())
		days.forEach((day, i) => {
			var left = x(i)
			y.domain(date.extentOfDay(day.values[0].last_visit_time))
			day.values.forEach((d, i) => {
				var top = y(d.last_visit_time)
				if (colors[url.domain(d.url)]) {
					ctx.fillStyle = colors[url.domain(d.url)]
				} else {
					ctx.fillStyle = fillStyle
				}
				ctx.beginPath()
				ctx.arc(Math.round(left), top, 2, 0, TWO_PI, true)
				ctx.closePath()
				ctx.fill()
			})
		})
	}

	function clear (ctx, canvas) {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	}

	function resize () {
		canvas
			.attr('width', canvas.node().clientWidth)
			.attr('height', canvas.node().clientHeight)
		x.range([padding, canvas.node().clientWidth - padding])
		y.range([padding, canvas.node().clientHeight - padding])
		render()
	}

	setTimeout(() => body.classed('loading', false), 25)
}

/**
 * Kick it offf
 */
fetch('db/ross.json')
	.then(res => res.json())
	.then(parse.chrome)
	.then(init)
