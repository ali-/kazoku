const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');
const { v4: generate_uuid } = require('uuid');


router.get('/:uuid', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query = `SELECT * FROM albums WHERE uuid = '${uuid}'`;
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


router.post('/:uuid/delete', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query_check = `SELECT * FROM albums WHERE uuid = '${uuid}' AND user_id = '${user_id}'`;
	db.query(query_check)
		.then(albums => {
			if (albums.rows.length == 0) { return response.json({ status: "error", error: "album,unavailable" }); }
			const album = albums.rows[0];
			const query_delete = `DELETE albums WHERE id = '${album.id}' AND user_id = '${user_id}'`;
			db.query(query_delete)
				.then(() => {
					// TODO: Delete all photos inside
					console.log(`Album ${album.id} deleted`);
					return response.json({ status: "ok" });
				});
		})
		.catch(error => {
			console.error(error.stack);
			return response.json({ status: "error", error: "database" });
		});
});


router.post('/:uuid/update', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { caption, private, title } = request.body;
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query_check = `SELECT * FROM albums WHERE uuid = '${uuid}' AND user_id = '${user_id}'`;
	db.query(query_check)
		.then(albums => {
			if (albums.rows.length == 0) { return response.json({ status: "error", error: "album,unavailable" }); }
			const album = albums.rows[0];
			const query_update = `UPDATE albums SET albums.title = '${title}', albums.caption = '${caption}', albums.private = '${private}' WHERE id = '${album.id}' AND user_id = '${user_id}'`;
			db.query(query_update).then(() => { return response.json({ status: "ok" }); });
		})
		.catch(error => {
			console.error(error.stack);
			return response.json({ status: "error", error: "database" });
		});
});


router.post('/create', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { caption, private, title } = request.body;
	const user_id = request.session.user.id;
	const uuid = generate_uuid();
	const query = `INSERT INTO albums(uuid, user_id, title, caption, private) VALUES('${uuid}', '${user_id}', '${title}', '${caption}', '${private}') RETURNING *`;
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
