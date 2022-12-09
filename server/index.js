const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api", (request, response) => {
	response.json({message: "Hello from server!"});
});

app.get('*', (request, response) => {
	response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
