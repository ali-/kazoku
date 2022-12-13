const bcrypt = require('bcrypt');
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


// Login user
router.post('/login', (request, response, next) => {
	const { email, password } = request.body
	if (email == null || password == null) {
		response.json({ status: "null-error" });
	}
	try {
		const query = `SELECT * FROM users WHERE email = ${email}`;
		const data = db.query(query);
		if (data.rows.length === 0) {
			response.json({ status: "user-not-found" });
		}
		const user = data.rows[0];
		const matches = bcrypt.compareSync(password, user.password);
		if (!matches) { response.json({ status: "password-error" }); }
		request.session.user = {
			id: user.id,
			email: user.email
		};
		response.json({ user: request.session.user });
	}
	catch (error) {
		console.error(error);
        response.json({ status: "error" });
	}
});


// Logout user
router.post('/logout', async(request, response) => {
	try {
		await request.session.destroy();
		response.json({ status: "ok" });
	}
	catch (error) {
		console.error(error);
		response.json({ status: "error" });
	}
});


// Register new user
router.post('/register', (request, response, next) => {
	// TODO: Verify email doesn't already exist and password meets requirements
	const { email, firstname, lastname, password } = request.body
	if (email == null || firstname == null || lastname == null || password == null) {
		response.json({ status: "null-error" });
	}
	try {
		const passwordHashed = bcrypt.hashSync(password, 10);
		console.log(passwordHashed);
		const query = `INSERT INTO users(email, firstname, lastname, password) VALUES('${email}', '${firstname}', '${lastname}', '${passwordHashed}') RETURNING *`;
		db.query(query)
			.then(users => {
				const user = users.rows[0];
				request.session.user = {
		            id: user.id,
		            email: user.email
		        };
			})
			.finally(() => {
				response.json({ status: "ok" });
			})
	}
	catch (error) {
		console.log(error);
		response.json({ status: "db-error" });
	}
});


// Update user account
router.put('/:id', (request, response, next) => {
	// TODO: Verify email doesn't already exist and password meets requirements
	const { email, firstname, lastname, password } = request.body

});


module.exports = router;
