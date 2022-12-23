const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');

router.get('/', (request, response, next) => {
	// TODO: Verify session
	const query = `SELECT * FROM threads ORDER BY id ASC`;
	db.query(query)
		.then(results => {
			response.json({ results: results.rows, status: "ok" });
		})
		.catch(error => {
			console.error(error.stack);
			response.json({ status: "error-db" });
		});
});

router.get('/thread/:id', (request, response, next) => {
	// TODO: Verify session
	const query = `SELECT * FROM threads WHERE id = ${id}`;
	db.query(query)
		.then(results => {
			if (results.rows.length === 0) { response.json({ status: "error-empty" }); }
			else {
				response.json({ results: results.rows, status: "ok" });
			}
		})
		.catch(error => {
			console.error(error.stack);
			response.json({ status: "error-db" });
		});
});

router.delete('/thread/:id/delete', (request, response, next) => {
	// TODO: Delete thread by ID
});

router.put('/thread/:id/edit', (request, response, next) => {
	// TODO: Edit thread by ID
});

router.post('/thread/:id/post', (request, response, next) => {
	// TODO: Post to thread by ID
});

router.post('/thread/create', (request, response, next) => {
	// TODO: Create a new thread
});

router.delete('/post/:id/delete', (request, response, next) => {
	// TODO: Delete post by ID
});

module.exports = router;
