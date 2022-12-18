const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../server/database');

router.get('/', (request, response, next) => {
	// TODO: Return all threads
});

router.get('/thread/:id', (request, response, next) => {
	// TODO: Return thread by ID
});

router.delete('/thread/:id/delete', (request, response, next) => {
	// TODO: Delete thread by ID
});

router.put('/thread/:id/edit', (request, response, next) => {
	// TODO: Edit thread by ID
});

router.post('/thread/:id/post', (request, response, next) => {
	// TODO: Post to thread by ID
});

router.post('/thread/create', (request, response, next) => {
	// TODO: Create a new thread
});

router.delete('/post/:id/delete', (request, response, next) => {
	// TODO: Delete post by ID
});

module.exports = router;
