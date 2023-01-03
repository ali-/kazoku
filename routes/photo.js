const { response } = require('express');
const { dirname } = require('path');
const express = require('express');
const exif_reader = require('exif-reader');
const fs = require('fs');
const multer = require('multer');
const { parse_date } = require('../server/functions');
const router = express.Router();
const sharp = require('sharp');
const db = require('../server/database');
const { v4: generate_uuid } = require('uuid');
const upload = multer({
	limits: { fileSize: 10000000 }, // 10MB
	fileFilter(request, file, cb) {
		if (!file.originalname.match(/\.(JPG|JPEG|jpg|jpeg)$/)) {
			return cb( new Error('Please upload a valid image file') );
		}
		cb(undefined, true);
	}
});


router.get('/:uuid', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query_photo = `SELECT uuid, user_id, album_id, date, created_at, updated_at FROM photos WHERE uuid = '${uuid}'`;
	db.query(query_photo)
		.then(photos => {
			if (photos.rows.length == 0) { return response.json({ status: "error", error: "unavailable" }); }
			const photo = photos.rows[0];
			const query_album = `SELECT id, uuid, user_id, private FROM albums WHERE id = '${photo.album_id}'`;
			db.query(query_album)
				.then(albums => {
					if (albums.rows.length === 0 && photo.album_id != 0) { return response.json({ status: "error", error: "unavailable" }); }
					const album = albums.rows[0];
					if (album.private === true && album.user_id != user_id) { return response.json({ status: "error", error: "denied" }); }
					return response.json({ album: { uuid: album.uuid }, photo: photo, status: "ok" });
				});
		})
		.catch(error => { return response.json({ status: "error", error: "database" }); });
});


router.post('/:uuid/comment', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { album_uuid, comment } = request.body;
	if (empty(album) || empty(comment)) { return response.json({ status: "error", error: "field,empty" }); }
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query_album = `SELECT user_id, uuid, private FROM albums WHERE uuid = '${album_uuid}'`;
	const query_photo = `SELECT id, user_id, uuid FROM photos WHERE uuid = '${uuid}'`;
	db.query(query_album)
		.then(albums => { return Promise.all([albums, db.query(query_photo)]); })
		.then(([albums, photos]) => {
			if ((albums.rows.length === 0 && album_uuid != 0) || photos.rows.length == 0) { return response.json({ status: "error", error: "unavailable" }); }
			const album = albums.rows[0];
			const photo = photos.rows[0];
			if (album.private === true && album.user_id != user_id) { return response.json({ status: "error", error: "photo,private" }); }
			const query_insert = `INSERT INTO photo_comments(user_id, photo_id, comment) VALUES('${user_id}', '${photo.id}', '${comment}') RETURNING *`;
			db.query(query_insert).then(() => { return response.json({ status: "ok" }); });
		})
		.catch(error => { return response.json({ status: "error", error: "database" }); });
});


router.post('/:uuid/delete', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query_check = `SELECT id, user_id, uuid FROM photos WHERE uuid = '${uuid}' AND user_id = '${user_id}'`;
	db.query(query_check)
		.then(photos => {
			if (photos.rows.length == 0) { return response.json({ status: "error", error: "photo,unavailable" }); }
			const photo = photos.rows[0];
			const query_delete = `DELETE photos WHERE id = '${photo.id}' AND user_id = '${user_id}'`;
			db.query(query_delete).then(() => { return response.json({ status: "ok" }); });
		})
		.catch(error => { return response.json({ status: "error", error: "database" }); });
});


router.post('/:uuid/favorite', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { album_uuid } = request.body;
	if (empty(album) || empty(comment)) { return response.json({ status: "error", error: "field,empty" }); }
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query_album = `SELECT user_id, uuid, private FROM albums WHERE uuid = '${album_uuid}'`;
	const query_photo = `SELECT id, user_id, uuid FROM photos WHERE uuid = '${uuid}'`;
	db.query(query_album)
		.then(albums => { return Promise.all([albums, db.query(query_photo)]); })
		.then(([albums, photos]) => {
			if ((albums.rows.length === 0 && album_uuid != 0) || photos.rows.length == 0) { return response.json({ status: "error", error: "unavailable" }); }
			const album = albums.rows[0];
			const photo = photos.rows[0];
			if (album.private === true && album.user_id != user_id) { return response.json({ status: "error", error: "photo,private" }); }
			const query_insert = `INSERT INTO photo_favorites(user_id, photo_id) VALUES('${user_id}', '${photo.id}')`;
			db.query(query_insert).then(() => { return response.json({ status: "ok" }); });
		})
		.catch(error => { return response.json({ status: "error", error: "database" }); });
});


router.post('/create', upload.single('upload'), (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { album_id } = request.body;
	const user_id = request.session.user.id;
	const query_album = `SELECT id, user_id FROM albums WHERE id = '${album_id}' AND user_id = '${user_id}'`;
	db.query(query_album)
		.then(albums => {
			if (album_id != 0 && albums.rows.length == 0) { return response.json({ status: "error", error: "unavailable" }); }
			const uuid = generate_uuid();
			const image = sharp(request.file.buffer);
			image
				.metadata()
				.then(({ exif }) => {
					const date_exif = new Date(exif_reader(exif).exif.DateTimeOriginal);
					const date_upload = new Date();
					const ts_exif = date_exif.getTime()/1000;
					const ts_now = date_upload.getTime()/1000;
					const query_insert =
						`INSERT INTO photos(uuid, user_id, album_id, date, created_at, updated_at)
						VALUES('${uuid}', '${user_id}', '${album_id}', to_timestamp(${ts_exif}), to_timestamp(${ts_now}), to_timestamp(${ts_now}))
						RETURNING *`;
					const upload_directory = `${dirname(require.main.filename).replace('/server','')}/images/${date_upload.getFullYear()}/${date_upload.getMonth()+1}/${date_upload.getDate()}`;
					if (!fs.existsSync(upload_directory)){ fs.mkdirSync(upload_directory, { recursive: true }); }
					return Promise.all(	[image.jpeg({ quality: 80 }).resize(4000, 3000, { fit: 'inside', withoutEnlargement: true }).toFile(`${upload_directory}/${uuid}_o.jpg`),
										image.jpeg({ quality: 75 }).resize(400, 300, { fit: 'cover', withoutEnlargement: true }).toFile(`${upload_directory}/${uuid}_t.jpg`),
										db.query(query_insert)]);
				})
				.then(([original, thumb, photos]) => {
					const photo = photos.rows[0];
					return response.json({ photo_id: photo.id, status: "ok" });
				});
		})
		.catch(error => { return response.json({ status: "error", error: "database" }); });
});


module.exports = router;
