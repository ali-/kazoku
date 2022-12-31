const bcrypt = require('bcrypt');
const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');
const { empty } = require('../server/functions');
const { v4: generate_uuid } = require('uuid');


router.get('/logout', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	request.session.destroy((error) => {
		if (error == null) { return response.json({ status: "ok" }); }
		return response.json({ status: "error", error: "session,destruction" });
	});
});


router.get('/session', (request, response) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	return response.json({ status: "ok" });
});


router.get('/:uuid', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const uuid = request.params.uuid;
	const user_id = request.session.user.id;
	const query = `SELECT email, firstname, lastname FROM users WHERE uuid = '${uuid}'`;
	db.query(query)
		.then(users => {
			if (users.rows.length === 0) { return response.json({ status: "error", error: "empty" }); }
			const user = users.rows[0];
			return response.json({ user: user, status: "ok" });
		})
		.catch(error => {
			console.error(error.stack);
			return response.json({ status: "error", error: "database" });
		});
});


router.post('/:uuid/update', (request, response, next) => {
	if (request.session.user == null) { return response.json({ status: "error", error: "session,invalid" }); }
	const { email, firstname, lastname, passconf, password } = request.body;
	const id = request.session.user.id;
	var update_email = '';
	var update_password = '';
	if (empty(email) || empty(firstname) || empty(lastname)) { return response.json({ status: "error", error: "empty" }); }
	if (!empty(password)) {
		if (password != passconf) { return response.json({ status: "error", error: "password,mismatch" }); }
		const password_hashed = bcrypt.hashSync(password, 10);
		update_password = `, users.password = '${password_hashed}'`;
	}
	if (email != request.session.user.email) { update_email = `, users.email = '${email}'`; }
	// TODO: Check password requirements
	const query_check = `SELECT id, email FROM users WHERE email = '${email}'`;
	db.query(query_check)
		.then(users => {
			const user = users.rows[0];
			if (users.rows.length > 0) { return response.json({ status: "error", error: "email,taken" }); }
			const query_update = `UPDATE users SET users.firstname = '${firstname}', users.lastname = '${lastname}'${update_email}${update_password} WHERE id = '${id}'`;
			db.query(query_update)
				.then(() => {
					request.session.destroy();
					request.session.user = {
						id: user.id,
						email: email
					};
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
	if (empty(email) || empty(password)) { return response.json({ status: "error", error: "input" }); }
	const query = `SELECT id, email, password FROM users WHERE email = '${email}'`;
	db.query(query)
		.then(users => {
			if (users.rows.length === 0) { return response.json({ status: "error", error: "user,none" }); }
			const user = users.rows[0];
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


router.post('/register', (request, response, next) => {
	const { email, firstname, lastname, password } = request.body;
	if (empty(email) || empty(firstname) || empty(lastname) || empty(password)) { return response.json({ status: "error", error: "null" }); }
	// TODO: Check password requirements
	const password_hashed = bcrypt.hashSync(password, 10);
	const query_check = `SELECT email FROM users WHERE email = '${email}'`
	db.query(query_check)
		.then(users => {
			if (users.rows.length > 0) { return response.json({ status: "error", error: "email" }); }
			const uuid = generate_uuid();
			const query_insert = `INSERT INTO users(uuid, email, firstname, lastname, password) VALUES('${uuid}', '${email}', '${firstname}', '${lastname}', '${password_hashed}') RETURNING *`;
			console.log(query_insert);
			db.query(query_insert)
				.then(results => {
					const user = results.rows[0];
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


module.exports = router;
