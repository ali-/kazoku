const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');
const { v4: generate_uuid } = require('uuid');


router.get('/:uuid', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query = `SELECT uuid, title, caption, private, created_at, updated_at FROM albums WHERE uuid = '${uuid}'`;
	db.query(query)
		.then(albums => {
			if (albums.rows.length === 0) { return response.json({ status: "error", error: "album,unavailable" }); }
			const album = albums.rows[0];
			if (album.private === true && album.user_id != user_id) { return response.json({ status: "error", error: "album,private" }); }
			return response.json({ albums: albums.rows, status: "ok" });
		})
		.catch(error => { return response.json({ status: "error", error: "database" }); });
});


router.post('/:uuid/delete', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query_check = `SELECT id, uuid, user_id FROM albums WHERE uuid = '${uuid}' AND user_id = '${user_id}'`;
	db.query(query_check)
		.then(albums => {
			if (albums.rows.length == 0) { return response.json({ status: "error", error: "album,unavailable" }); }
			const album = albums.rows[0];
			const query_delete = `DELETE albums WHERE id = '${album.id}' AND user_id = '${user_id}'`;
			return db.query(query_delete);
		})
		// TODO: Delete all photos inside
		.then(() => { return response.json({ status: "ok" }); })
		.catch(error => { return response.json({ status: "error", error: "database" }); });
});


router.post('/:uuid/update', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { private, title } = request.body;
	if (empty(title)) { return response.json({ status: "error", error: "title,empty" }); }
	const date = new Date();
	const ts_now = date.getTime()/1000;
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query_check = `SELECT id, uuid, user_id FROM albums WHERE uuid = '${uuid}' AND user_id = '${user_id}'`;
	db.query(query_check)
		.then(albums => {
			if (albums.rows.length == 0) { return response.json({ status: "error", error: "album,unavailable" }); }
			const album = albums.rows[0];
			const query_update =
				`UPDATE albums SET albums.title = '${title}', albums.private = '${private}', albums.updated_at = to_timestamp(${ts_now})
				WHERE id = '${album.id}' AND user_id = '${user_id}'`;
			return db.query(query_update);
		})
		.then(() => { return response.json({ status: "ok" }); })
		.catch(error => { return response.json({ status: "error", error: "database" }); });
});


router.post('/create', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { private, title } = request.body;
	if (empty(title)) { return response.json({ status: "error", error: "title,empty" }); }
	const date = new Date();
	const ts_now = date.getTime()/1000;
	const user_id = request.session.user.id;
	const uuid = generate_uuid();
	const query =
		`INSERT INTO albums(uuid, user_id, title, private, created_at, updated_at)
		VALUES('${uuid}', '${user_id}', '${title}', '${private}', to_timestamp(${ts_now}), to_timestamp(${ts_now}))
		RETURNING *`;
	db.query(query)
		.then(albums => {
			const album = albums.rows[0];
			return response.json({ album_uuid: album.uuid, status: "ok" });
		})
		.catch(error => { return response.json({ status: "error", error: "database" }); });
});


module.exports = router;
