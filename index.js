
import _ from 'lodash'
import d3 from 'd3'

import * as parse from './lib/parse'
import * as date from './lib/date'
import * as number from './lib/number'

var body = d3.select('body')
var padding = 40

function init (data) {

	var days = d3.nest()
		.key(d => date.format.yearMonthDay(d.last_visit_time))
		.entries(data)

	var svg = body.append('svg')
		.classed('canvas', true)

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
		.range([padding, svg.node().clientWidth - padding])
	// y is by time of day
	var y = d3.time.scale()
		.range([padding, svg.node().clientHeight - padding])

	var columns = svg.selectAll('g')
			.data(days)
		.enter().append('g')
			.attr('class', 'column')
			.attr('transform', (d, i) => `translate(${x(i)}, 0)`)

	columns.selectAll('circle')
			.data(day => day.values)
		.enter().append('circle')
			.attr('class', 'node')
			.attr('cy', d => {
				y.domain(date.extentOfDay(d.last_visit_time))
				return y(d.last_visit_time)
			})



	setTimeout(() => body.classed('loading', false), 500)
}

/**
 * Kick it offf
 */
fetch('db/ross.json')
	.then(res => res.json())
	.then(parse.chrome)
	.then(init)
