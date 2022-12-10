const Pool = require('pg').Pool
const pool = new Pool({
	user: 'Ali',
	host: 'localhost',
	database: 'kazoku',
	password: 'password',
	port: 5432,
})

module.exports = pool
