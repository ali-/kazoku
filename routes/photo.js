const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');

// ----------------------------------------------------------------------
// Photos
// id: int, user_id: int, album_id: int, caption: text
// date: datetime, created_at: datetime, updated_at: datetime
// ----------------------------------------------------------------------
// Photo_Favorites
// id: int, user_id: int, photo_id: int
// created_at: datetime, updated_at: datetime
// ----------------------------------------------------------------------


router.get('/:id', (request, response, next) => {
	response.json({ status: "ok" });
});


module.exports = router;
