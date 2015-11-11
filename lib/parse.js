

export function chrome (database) {
	database.map(row => {
		row.last_visit_time = new Date(row.last_visit_time)
		return row
	})
	return Promise.resolve(database)
}
