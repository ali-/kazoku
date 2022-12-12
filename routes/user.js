const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');

// View user profile
router.get('/:id', (request, response, next) => {
	const id = request.params.id;
	const query = `SELECT * FROM users WHERE id = ${id}`;
	db.query(query, (error, results) => {
		response.json(results.rows)
		console.log('here')
	});
});

// Register new user
router.post('/register', (request, response, next) => {
	// TODO: Verify email doesn't already exist and password meets requirements
	const email = request.body.email
	const firstname = request.body.firstname
	const lastname = request.body.lastname
	const password = request.body.password
	const query = `INSERT INTO users(firstname, lastname, email, password) VALUES('${firstname}', '${lastname}', '${email}', '${password}')`;
	db.query(query, (error, results) => {
		response.json({status: "ok"});
		console.log(query);
	});
});

// Update user account
router.put('/:id', (request, response, next) => {
	// TODO: Verify email doesn't already exist and password meets requirements
	const email = request.body.email
	const firstname = request.body.firstname
	const lastname = request.body.lastname
	const password = request.body.password
	
});

module.exports = router;
