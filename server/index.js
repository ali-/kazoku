const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

const pool = require('../server/database');
const store = new pgSession({ pool: pool, createTableIfMissing: false });
app.use(
	session({
		store: store,
		cookie: { maxAge: 1000 * 60 * 60 * 24 },
		secret: 'secret',
		resave: false,
		saveUninitialized: false
	})
);

const indexRouter = require('../routes/index');
const userRouter = require('../routes/user');
app.use('/api', indexRouter);
app.use('/api/user', userRouter);

app.listen(PORT, function() {
	console.log(`Server is running on port ${PORT}:`);
});
