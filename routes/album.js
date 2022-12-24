const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');

// ----------------------------------------------------------------------
// Albums
// id: int, user_id: int, title: varchar, caption: text
// created_at: datetime, updated_at: datetime
// ----------------------------------------------------------------------


router.delete('/:id', (request, response, next) => {
	// TODO: Delete album by ID and all photos inside
});


router.get('/:id', (request, response, next) => {
	// TODO: View album by ID
});


router.put('/:id', (request, response, next) => {
	// TODO: Update an album by ID
});


router.post('/create', (request, response, next) => {
	// TODO: Create an album
});


module.exports = router;
