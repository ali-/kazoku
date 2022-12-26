const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');

// ----------------------------------------------------------------------
// Albums
// id: int, user_id: int, title: varchar, caption: text, private: boolean
// created_at: datetime, updated_at: datetime
// ----------------------------------------------------------------------


router.delete('/:id', (request, response, next) => {
	const id = request.params.id;
	const user_id = request.session.user.id;
	const query_check = `SELECT * FROM albums WHERE id = '${id}' AND user_id = '${user_id}'`;
	if (user_id == null) { return response.json({ status: "error", error: "session,invalid" }); }
	db.query(query_check)
		.then(albums => {
			if (albums.rows.length == 0) { return response.json({ status: "error", error: "album,unavailable" }); }
			const album = albums.rows[0];
			const query_delete = `DELETE albums WHERE id = '${id}' AND user_id = '${user_id}'`;
			db.query(query_delete)
				.then(() => {
					// TODO: Delete all photos inside
					console.log(`Album ${album.id} deleted`);
					return response.json({ status: "ok" });
				});
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


router.get('/:id', (request, response, next) => {
	const id = request.params.id;
	const user_id = request.session.user.id;
	const query = `SELECT * FROM albums WHERE id = '${id}'`;
	if (user_id == null) { return response.json({ status: "error", error: "session,invalid" }); }
	db.query(query)
		.then(albums => {
			if (albums.rows.length == 0) { return response.json({ status: "error", error: "album,unavailable" }); }
			const album = albums.rows[0];
			if (album.private === true && album.user_id != user_id) { return response.json({ status: "error", error: "album,private" }); }
			return response.json({ albums: albums.rows, status: "ok" });
		})
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


router.put('/:id', (request, response, next) => {
	const { caption, private, title } = request.body;
	const id = request.params.id;
	const user_id = request.session.user.id;
	const query_check = `SELECT * FROM albums WHERE id = '${id}' AND user_id = '${user_id}'`;
	if (user_id == null) { return response.json({ status: "error", error: "session,invalid" }); }
	db.query(query_check)
		.then(albums => {
			if (albums.rows.length == 0) { return response.json({ status: "error", error: "album,unavailable" }); }
			const query_update = `UPDATE albums SET albums.title = '${title}', albums.caption = '${caption}', albums.private = '${private}' WHERE id = '${id}' AND user_id = '${user_id}'`;
			db.query(query_update).then(() => { return response.json({ status: "ok" }); });
		})
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


router.post('/create', (request, response, next) => {
	const { caption, private, title } = request.body;
	const user_id = request.session.user.id;
	const query = `INSERT INTO albums(user_id, title, caption, private) VALUES('${user_id}', '${title}', '${caption}', '${private}') RETURNING *`;
	if (user_id == null) { return response.json({ status: "error", error: "session,invalid" }); }
	db.query(query)
		.then(albums => {
			const album = albums.rows[0];
			return response.json({ album_id: album.id, status: "ok" });
		})
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


module.exports = router;
