const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./queries')

//app.use(express.static(path.resolve(__dirname, '../client/build')));

//
// TODO: Routes
// Index : Login, Register (enabled, invite-only, admin-approved-only)
// Home : Display bulletin board, latest photos/albums, manage profile
// User : View, Create, Edit, Deactivate
// Albums : View, Create, Edit, Post, Delete
// Board : View, Create, Edit, Post, Delete
// Calendar : View, Create, Edit, Post, Delete
// Photos : View, Post, Edit, Post, Delete
//

// 
app.get('/', (request, response) => {

})

app.get("/api", (request, response) => {
	response.json({message: "Hello from server!"});
});

app.get('*', (request, response) => {
	response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
