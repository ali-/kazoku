const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');

//
// TODO: Routes
// Index : Login, Register (enabled, invite-only, admin-approved-only)
// Home : Display bulletin board, latest photos/albums, manage profile
// User : View, Create, Edit, Deactivate
// Albums : View, Create, Edit, Post, Delete
// Board : View, Create, Edit, Post, Delete
// Calendar : View, Create, Edit, Post, Delete
// Photos : View, Post, Edit, Post, Delete
//

router.get('/:id', (request, response, next) => {
	const id = request.params.id;
	const query = `SELECT * FROM users WHERE id = ${id}`;
	db.query(query, (error, results) => {
		response.json(results.rows)
	});
});

router.put('/create', (request, response, next) => {
	const query = `INSERT INTO users(firstname, lastname, email, password)
					VALUES(${firstname}, ${lastname}, ${email}, ${password})`;
	db.query(query, (error, results) => {
		response.json({status: "ok"})
	});
});

module.exports = router;
