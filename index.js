
import _ from 'lodash'
import d3 from 'd3'

import * as parse from './lib/parse'
import * as date from './lib/date'
import * as number from './lib/number'

var body = d3.select('body')
var padding = 40

var TWO_PI = Math.PI * 2

function init (data) {

	var days = d3.nest()
		.key(d => date.format.yearMonthDay(d.last_visit_time))
		.entries(data)

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

	d3.select('.labels').selectAll('.label')
			.data(['12am', '12pm', '12am'])
		.enter().append('div')
			.attr('class', 'label')
			.style('top', (d, i) => `${ly(i)}%`)
			.text(d => d)

	// x is columns by day
	var x = d3.scale.linear()
		.domain([0, d3.keys(days).length])
		.range([padding, canvas.node().clientWidth - padding])
	// y is by time of day
	var y = d3.time.scale()
		.range([padding, canvas.node().clientHeight - padding])

	render()
	// d3.timer(render)
	d3.select(window).on('resize', _.throttle(resize, 200))

	function render () {
		clear(ctx, canvas.node())
		ctx.fillStyle = 'rgba(246, 138, 103, 0.05)'
		days.forEach((day, i) => {
			var left = x(i)
			y.domain(date.extentOfDay(day.values[0].last_visit_time))
			day.values.forEach((d, i) => {
				var top = y(d.last_visit_time)
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
