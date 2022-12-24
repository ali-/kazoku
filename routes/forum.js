const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');

// ----------------------------------------------------------------------
// Threads
// id: int, user_id: int, title: varchar, content: text
// created_at: datetime, updated_at: datetime
// ----------------------------------------------------------------------
// Thread_Favorites
// id: int, user_id: int, thread_id: int
// created_at: datetime, updated_at: datetime
// ----------------------------------------------------------------------
// Posts
// id: int, user_id: int, thread_id: int, content: text
// created_at: datetime, updated_at: datetime
// ----------------------------------------------------------------------


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


router.delete('/thread/:id', (request, response, next) => {
	// TODO: Delete thread by ID
});


router.post('/thread/:id/favorite', (request, response, next) => {
	// TODO: Favorite thread by ID
});


router.post('/thread/:id/reply', (request, response, next) => {
	// TODO: Reply to thread by ID
});


router.put('/thread/:id', (request, response, next) => {
	// TODO: Update thread by ID
});


router.post('/thread/create', (request, response, next) => {
	// TODO: Create a new thread
});


router.delete('/post/:id', (request, response, next) => {
	// TODO: Delete post by ID
});


router.put('/post/:id', (request, response, next) => {
	// TODO: Update post by ID
});


module.exports = router;
