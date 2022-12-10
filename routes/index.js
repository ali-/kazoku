const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');

router.get('/', (request, response, next) => {
	response.json({status: "ok"})
});

module.exports = router;
