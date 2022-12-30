const cors = require('cors');
const db = require('./database');
const express = require('express');
const session = require('express-session');
const pg_session = require('express-pg-session')(session);
const path = require('path');
const PORT = process.env.SERVER_PORT || 3001;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	cors({
		origin: process.env.ORIGIN_URL,
		methods: ["POST", "GET"],
		credentials: true
	})
);


const pool = require('../server/database');
const store = new pg_session({ pool: pool, createTableIfMissing: false });
app.use(
	session({
		store: store,
		cookie: {
			httpOnly: false,
			maxAge: 1000 * 60 * 60 * 24,
			sameSite: false,
			secure: false
		},
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	})
);


const album_router = require('../routes/album');
const forum_router = require('../routes/forum');
const photo_router = require('../routes/photo');
const user_router = require('../routes/user');
app.use('/api/album', album_router);
app.use('/api/forum', forum_router);
app.use('/api/photo', photo_router);
app.use('/api/user', user_router);


app.listen(PORT, function() {
	console.log(`Server is running on port ${PORT}:`);
});
