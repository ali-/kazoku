const Pool = require('pg').Pool;
const pool = new Pool({
	user: 'Ali',
	host: 'localhost',
	database: 'kazoku',
	password: '',
	port: 5432,
});


module.exports = pool;
