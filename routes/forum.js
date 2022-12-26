const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');

// ----------------------------------------------------------------------
// Threads
// id: int, user_id: int, title: varchar, content: text, locked: boolean
// created_at: datetime, updated_at: datetime
// ----------------------------------------------------------------------
// Thread_Favorites
// id: int, user_id: int, thread_id: int
// created_at: datetime, updated_at: datetime
// ----------------------------------------------------------------------
// Thread_Posts
// id: int, user_id: int, thread_id: int, content: text
// created_at: datetime, updated_at: datetime
// ----------------------------------------------------------------------


router.get('/', (request, response, next) => {
	const user_id = request.session.user.id;
	const query = `SELECT * FROM threads`;
	if (user_id == null) { return response.json({ status: "error", error: "session,invalid" }); }
	db.query(query)
		.then(threads => {
			if (threads.rows.length == 0) { return response.json({ status: "error", error: "empty" }) }
			return response.json({ status: "ok", threads: threads.rows });
		})
		.catch(error => {
			console.error(error.stack);
			return response.json({ status: "error", error: "database" });
		});
});


router.get('/thread/:id', (request, response, next) => {
	// TODO: Pagination
	const id = request.params.id;
	const user_id = request.session.user.id;
	const query_thread = `SELECT * FROM threads WHERE id = '${id}'`;
	const query_posts = `SELECT * FROM thread_posts WHERE thread_id = '${id}' ORDER BY id ASC`;
	if (user_id == null) { return response.json({ status: "error", error: "session,invalid" }); }
	db.query(query_thread)
		.then(threads => {
			if (threads.rows.length == 0) { return response.json({ status: "error", error: "empty" }) }
			return Promise.all([threads, db.query(query_posts)]);
		})
		.then(([threads, posts]) => {
			return response.json({ status: "ok", threads: threads.rows, posts: posts.rows });
		})
		.catch(error => {
			console.error(error.stack);
			return response.json({ status: "error", error: "database" });
		});
});


router.delete('/thread/:id', (request, response, next) => {
	// TODO: Delete thread by ID
});


router.post('/thread/:id', (request, response, next) => {
	// TODO: Reply to thread by ID
});


router.put('/thread/:id', (request, response, next) => {
	// TODO: Update thread by ID
});


router.post('/thread/:id/favorite', (request, response, next) => {
	// TODO: Favorite thread by ID
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
