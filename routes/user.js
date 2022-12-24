const bcrypt = require('bcrypt');
const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');
const fn = require('../server/functions');

// ----------------------------------------------------------------------
// User
// id: int, email: varchar, firstname: varchar, lastname: varchar
// password: varchar, created_at: datetime, updated_at: datetime
// ----------------------------------------------------------------------


router.get('/:id', (request, response, next) => {
	const id = request.params.id;
	const user_id = request.session.user.id;
	if (user_id == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const query = `SELECT email, firstname, lastname FROM users WHERE id = ${id}`;
	db.query(query_check)
		.then(results => { return response.json({ results: results.rows, status: "ok" }); })
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


router.put('/update', (request, response, next) => {
	const { email, firstname, lastname, passconf, password } = request.body;
	const id = request.session.user.id;
	var update_email = '';
	var update_password = '';
	if (id == null) { return response.json({ status: "error", error: "session,invalid" }); }
	if (fn.isEmpty(email) || fn.isEmpty(firstname) || fn.isEmpty(lastname)) { return response.json({ status: "error", error: "empty" }); }
	if (!fn.isEmpty(password)) {
		if (password != passconf) { return response.json({ status: "error", error: "password,mismatch" }); }
		const password_hashed = bcrypt.hashSync(password, 10);
		update_password = `, users.password = '${password_hashed}'`;
	}
	if (email != request.session.user.email) { update_email = `, users.email = '${email}'`; }
	// TODO: Check password requirements
	const query_check = `SELECT * FROM users WHERE email = '${email}'`;
	const query_update = `UPDATE users SET users.firstname = '${firstname}', users.lastname = '${lastname}'${update_email}${update_password} WHERE id = '${id}'`;
	db.query(query_check)
		.then(results => {
			if (results.rows.length > 0) { return response.json({ status: "error", error: "email,taken" }); }
			db.query(query_update)
				.then(() => {
					// TODO: Destroy old session
					return response.json({ status: "ok" });
				});
		})
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


router.post('/login', (request, response, next) => {
	const { email, password } = request.body;
	if (email == null || password == "") { return response.json({ status: "error", error: "input" }); }

	const query = `SELECT * FROM users WHERE email = '${email}'`;
	db.query(query)
		.then(results => {
			if (results.rows.length === 0) { return response.json({ status: "error", error: "user,none" }); }
			const user = results.rows[0];
			const matches = bcrypt.compareSync(password, user.password);
			if (!matches) { return response.json({ status: "error", error: "password" }); }
			request.session.user = {
				id: user.id,
				email: user.email
			};
			console.log(request.session.user);
			return response.json({ status: "ok" });
		})
		.catch(error => {
			console.error(error.stack);
	        return response.json({ status: "error", error: "database" });
		});
});


router.post('/logout', async(request, response) => {
	try {
		await request.session.destroy();
		return response.json({ status: "ok" });
	}
	catch (error) {
		console.error(error);
		return response.json({ status: "error", error: "session,destruction" });
	}
});


router.post('/register', (request, response, next) => {
	const { email, firstname, lastname, password } = request.body;
	if (email == null || firstname == null || lastname == null || password == null) { return response.json({ status: "error", error: "null" }); }
	// TODO: Check password requirements
	const password_hashed = bcrypt.hashSync(password, 10);
	const query_check = `SELECT * FROM users WHERE email = '${email}'`
	const query_insert = `INSERT INTO users(email, firstname, lastname, password) VALUES('${email}', '${firstname}', '${lastname}', '${password_hashed}') RETURNING *`;
	db.query(query_check)
		.then(users => {
			if (users.rows.length > 0) { return response.json({ status: "error", error: "email" }); }
			db.query(query_insert)
				.then(users => {
					const user = users.rows[0];
					request.session.user = {
			            id: user.id,
			            email: user.email
			        };
					console.log(request.session.user);
					return response.json({ status: "ok" });
				});
		})
		.catch(error => {
			console.error(error.stack);
			return response.json({ status: "error", error: "database" });
		});
});


router.get('/settings', (request, response, next) => {
	return response.json({ status: "ok" });
});


module.exports = router;
