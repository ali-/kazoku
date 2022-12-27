const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');
const { v4: generate_uuid } = require("uuid");

// -----------------------------------------------------------------------------
// Photos
// id: int, uuid: uuid, user_id: int, album_id: int, caption: text
// private: boolean, date: datetime, created_at: datetime, updated_at: datetime
// -----------------------------------------------------------------------------
// Photo_Comments
// id: int, user_id: int, photo_id: int, comment: text
// created_at: datetime, updated_at: datetime
// -----------------------------------------------------------------------------
// Photo_Favorites
// id: int, user_id: int, photo_id: int
// created_at: datetime, updated_at: datetime
// -----------------------------------------------------------------------------


// TODO: Image uploading


router.get('/:uuid', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query_photo = `SELECT * FROM photos WHERE uuid = '${uuid}'`;
	db.query(query_photo)
		.then(photos => {
			if (photos.rows.length == 0) { return response.json({ status: "error", error: "unavailable" }); }
			const photo = photos.rows[0];
			const query_album = `SELECT * FROM albums WHERE id = '${photo.album_id}'`;
			db.query(query_album)
				.then(albums => {
					const album = albums.rows[0];
					if ((album.private === true || photo.private === true) && album.user_id != user_id) { return response.json({ status: "error", error: "denied" }); }
					return response.json({ photo: photo, status: "ok" });
				});
		})
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


router.post('/:uuid/comment', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { album, comment } = request.body;
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query_album = `SELECT * FROM albums WHERE uuid = '${album}'`;
	const query_photo = `SELECT * FROM photos WHERE uuid = '${uuid}'`;
	db.query(query_album)
		.then(albums => {
			return Promise.all([albums, db.query(query_photo)]);
		})
		.then(([albums, photos]) => {
			if (albums.rows.length == 0 || photos.rows.length == 0) { return response.json({ status: "error", error: "unavailable" }); }
			const album = albums.rows[0];
			const photo = photos.rows[0];
			if ((album.private === true && album.user_id != user_id) || (photo.private === true && photo.user_id != user_id)) {
				return response.json({ status: "error", error: "photo,private" });
			}
			const query_insert = `INSERT INTO photo_comments(user_id, photo_id, comment) VALUES('${user_id}', '${photo.id}', '${comment}') RETURNING *`;
			db.query(query_insert)
				.then(() => {
					console.log(`Commented on photo ${photo.id}`);
					return response.json({ status: "ok" });
				});
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
	const query_check = `SELECT * FROM photos WHERE uuid = '${uuid}' AND user_id = '${user_id}'`;
	db.query(query_check)
		.then(photos => {
			if (photos.rows.length == 0) { return response.json({ status: "error", error: "photo,unavailable" }); }
			const photo = photos.rows[0];
			const query_delete = `DELETE photos WHERE id = '${photo.id}' AND user_id = '${user_id}'`;
			db.query(query_delete)
				.then(() => {
					console.log(`Photo ${photo.id} deleted`);
					return response.json({ status: "ok" });
				});
		})
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


router.post('/:uuid/favorite', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { album } = request.body;
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query_album = `SELECT * FROM albums WHERE id = '${album}'`;
	const query_photo = `SELECT * FROM photos WHERE uuid = '${uuid}'`;
	db.query(query_album)
		.then(albums => {
			return Promise.all([albums, db.query(query_photo)]);
		})
		.then(([albums, photos]) => {
			if (albums.rows.length == 0 || photos.rows.length == 0) { return response.json({ status: "error", error: "unavailable" }); }
			const album = albums.rows[0];
			const photo = photos.rows[0];
			if ((album.private === true && album.user_id != user_id) || (photo.private === true && photo.user_id != user_id)) {
				return response.json({ status: "error", error: "photo,private" });
			}
			const query_insert = `INSERT INTO photo_favorites(user_id, photo_id) VALUES('${user_id}', '${photo.id}')`;
			db.query(query_insert)
				.then(() => {
					console.log(`Favorited photo ${photo.id}`);
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
	const { caption, private } = request.body;
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query_check = `SELECT * FROM photos WHERE uuid = '${uuid}' AND user_id = '${user_id}'`;
	db.query(query_check)
		.then(photos => {
			if (photos.rows.length == 0) { return response.json({ status: "error", error: "unavailable" }); }
			const photo = photos.rows[0];
			const query_update = `UPDATE photos SET photos.caption = '${caption}', photos.private = '${private}' WHERE id = '${photo.id}' AND user_id = '${user_id}'`;
			db.query(query_update).then(() => { return response.json({ status: "ok" }); });
		})
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


router.post('/create', (request, response, next) => {
	// TODO: In the case where no album ID is provided, should be uploaded to users misc. uploads
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { album, caption, private, title } = request.body;
	const user_id = request.session.user.id;
	const query_album = `SELECT * FROM albums WHERE id = '${album}' AND user_id = '${user_id}'`;
	db.query(query_album)
		.then(albums => {
			// Check here if album id != 0?
			if (albums.rows.length == 0) { return response.json({ status: "error", error: "unavailable" }); }
			const uuid = generate_uuid();
			const query_insert = `INSERT INTO photos(user_id, album_id, caption, private) VALUES('${user_id}', '${album}', '${caption}', '${private}') RETURNING *`;
			db.query(query_insert)
				.then(photos => {
					const photo = photos.rows[0];
					return response.json({ photo_id: photo.id, status: "ok" });
				});
		})
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


module.exports = router;
