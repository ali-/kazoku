const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');

router.get('/', (request, response, next) => {
	response.send("ok")
});

module.exports = router;
