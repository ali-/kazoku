const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');

// -----------------------------------------------------------------------------
// Threads
// id: int, user_id: int, title: varchar, content: text, locked: boolean
// created_at: datetime, updated_at: datetime
// -----------------------------------------------------------------------------
// Thread_Favorites
// id: int, user_id: int, thread_id: int
// created_at: datetime, updated_at: datetime
// -----------------------------------------------------------------------------
// Thread_Posts
// id: int, user_id: int, thread_id: int, content: text
// created_at: datetime, updated_at: datetime
// -----------------------------------------------------------------------------


router.get('/', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const query = `SELECT * FROM threads`;
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
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { page } = request.query;
	const id = request.params.id;
	const query_thread = `SELECT * FROM threads WHERE id = '${id}'`;
	const query_posts = `SELECT * FROM thread_posts WHERE thread_id = '${id}' ORDER BY id ASC`;
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


router.post('/thread/:id/delete', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const id = request.params.id;
	const user_id = request.session.user.id;
	const query_thread = `SELECT * FROM threads WHERE id = '${id}' AND user_id = '${user_id}'`;
	db.query(query_thread)
		.then(threads => {
			if (threads.rows.length == 0) { return response.json({ status: "error", error: "empty" }) }
			const thread = threads.rows[0];
			const query_delete = `DELETE threads WHERE id = '${id}' AND user_id = '${user_id}'`;
			db.query(query_delete)
				.then(() => {
					console.log(`Thread ${thread.id} deleted`);
					return response.json({ status: "ok" });
				});
		})
		.catch(error => {
			console.error(error.stack);
			return response.json({ status: "error", error: "database" });
		});
});


router.post('/thread/:id/favorite', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const id = request.params.id;
	const user_id = request.session.user.id;
	const query_threads = `SELECT * FROM threads WHERE id = '${id}'`;
	db.query(query_threads)
		.then(threads => {
			if (threads.rows.length == 0) { return response.json({ status: "error", error: "unavailable" }); }
			const query_insert = `INSERT INTO thread_favorites(user_id, thread_id) VALUES('${user_id}', '${id}')`;
			db.query(query_insert)
				.then(() => {
					console.log(`Favorited thread ${id}`);
					return response.json({ status: "ok" });
				});
		})
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


router.post('/thread/:id/reply', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { content } = request.body;
	const id = request.params.id;
	const user_id = request.session.user.id;
	const query = `INSERT INTO thread_posts(user_id, thread_id, content) VALUES('${user_id}', '${id}', '${content}')`;
	db.query(query)
		.then(() => {
			console.log(`Replied to thread ${id}`);
			return response.json({ status: "ok" });
		})
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


router.put('/thread/:id/update', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { title, content } = request.body;
	const id = request.params.id;
	const user_id = request.session.user.id;
	const query_check = `SELECT * FROM threads WHERE id = '${id}' AND user_id = '${user_id}'`;
	db.query(query_check)
		.then(threads => {
			if (threads.rows.length == 0) { return response.json({ status: "error", error: "unavailable" }); }
			const query_update = `UPDATE threads SET threads.title = '${title}', threads.content = '${content}' WHERE id = '${id}' AND user_id = '${user_id}'`;
			db.query(query_update).then(() => { return response.json({ status: "ok" }); });
		})
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


router.post('/thread/create', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { title, content } = request.body;
	const id = request.params.id;
	const user_id = request.session.user.id;
	const query = `INSERT INTO threads(user_id, title, content) VALUES('${user_id}', '${id}', '${content}')`;
	db.query(query)
		.then(() => {
			console.log(`Replied to thread ${id}`);
			return response.json({ status: "ok" });
		})
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


router.post('/post/:id/delete', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const id = request.params.id;
	const user_id = request.session.user.id;
	const query_post = `SELECT * FROM thread_posts WHERE id = '${id}' AND user_id = '${user_id}'`;
	db.query(query_thread)
		.then(posts => {
			if (posts.rows.length == 0) { return response.json({ status: "error", error: "empty" }) }
			const post = posts.rows[0];
			const query_delete = `DELETE thread_posts WHERE id = '${id}' AND user_id = '${user_id}'`;
			db.query(query_delete)
				.then(() => {
					console.log(`Post ${post.id} deleted`);
					return response.json({ status: "ok" });
				});
		})
		.catch(error => {
			console.error(error.stack);
			return response.json({ status: "error", error: "database" });
		});
});


router.post('/post/:id/update', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { content } = request.body;
	const id = request.params.id;
	const user_id = request.session.user.id;
	const query_check = `SELECT * FROM posts WHERE id = '${id}' AND user_id = '${user_id}'`;
	db.query(query_check)
		.then(posts => {
			if (posts.rows.length == 0) { return response.json({ status: "error", error: "unavailable" }); }
			const query_update = `UPDATE posts SET posts.content = '${content}' WHERE id = '${id}' AND user_id = '${user_id}'`;
			db.query(query_update).then(() => { return response.json({ status: "ok" }); });
		})
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


module.exports = router;
