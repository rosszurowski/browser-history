
'use strict'

export default {
	chrome: db => Promise.resolve(chrome(db)),
	safari: db => Promise.resolve(safari(db))
}

const chrome = db => {
	db.urls = db.urls
		.map(parse)
		.filter(filter)
	return db
}

const safari = db => {
	return db
}

const parse = row => {
	row.last_visit_time = new Date(row.last_visit_time)
	return row
}

const filter = row => {
	if (row.last_visit_time < new Date(2000, 1, 1)) return false
	return true
}
