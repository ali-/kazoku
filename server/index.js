const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

const indexRouter = require('../routes/index');
app.use('/', indexRouter);
const userRouter = require('../routes/user');
app.use('/user', userRouter);

app.listen(PORT, function() {
	console.log(`Server is running on port ${PORT}:`);
});
