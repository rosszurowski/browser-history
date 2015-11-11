
import d3 from 'd3'

Date.from = d => new Date(d)

export var clone = d => Date.from(d.getTime())
export var beginningOfDay = d => clone(d).setHours(0, 0, 0, 0)
export var endOfDay = d => clone(d).setHours(23, 59, 59, 999)
export var extentOfDay = d => [Date.from(beginningOfDay(d)), Date.from(endOfDay(d))]

export const format = {
	yearMonthDay: d3.time.format('%Y-%m-%d')
}
