const bcrypt = require('bcrypt');
const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');

// ----------------------------------------------------------------------
// User
// id: int, email: varchar, firstname: varchar, lastname: varchar
// password: varchar, created_at: datetime, updated_at: datetime
// ----------------------------------------------------------------------


// View user profile
router.get('/:id', (request, response, next) => {
	const id = request.params.id;
	const query = `SELECT * FROM users WHERE id = ${id}`;
	db.query(query, (error, results) => {
		response.json({ results: results.rows, status: "ok" });
	});
});


// Update user account
router.post('/:id/update', (request, response, next) => {
	// TODO: Verify email doesn't already exist and password meets requirements
	const { email, firstname, lastname, password } = request.body;
	//
});


// Login user
router.post('/login', (request, response, next) => {
	const { email, password } = request.body;
	if (email == null || password == null) {
		response.json({ status: "error-null" });
	}
	else {
		const query = `SELECT * FROM users WHERE email = '${email}'`;
		db.query(query)
			.then(results => {
				if (results.rows.length === 0) { response.json({ status: "error-empty" }); }
				else {
					const user = results.rows[0];
					const matches = bcrypt.compareSync(password, user.password);
					if (!matches) { response.json({ status: "error-password" }); }
					else {
						request.session.user = {
							id: user.id,
							email: user.email
						};
						console.log(request.session.user);
						response.json({ status: "ok" });
					}
				}
			})
			.catch(error => {
				console.error(error.stack);
		        response.json({ status: "error-db" });
			});
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
	// TODO: Verify password requirements
	const { email, firstname, lastname, password } = request.body;
	const passwordHashed = bcrypt.hashSync(password, 10);
	const query_check = `SELECT * FROM users WHERE email = '${email}'`
	const query_insert = `INSERT INTO users(email, firstname, lastname, password) VALUES('${email}', '${firstname}', '${lastname}', '${passwordHashed}') RETURNING *`;
	if (email == null || firstname == null || lastname == null || password == null) {
		response.json({ status: "error-null" });
	}
	db.query(query_check)
		.then(users => {
			if (users.rows.length > 0) { response.json({ status: "error-email" }); }
			else {
				db.query(query_insert)
					.then(users => {
						const user = users.rows[0];
						request.session.user = {
				            id: user.id,
				            email: user.email
				        };
						console.log(request.session.user);
						response.json({ status: "ok" });
					});
			}
		})
		.catch(error => {
			console.error(error.stack);
			response.json({ status: "error-db" });
		});
});


router.get('/settings', (request, response, next) => {
	response.json({ status: "ok" });
});


module.exports = router;
