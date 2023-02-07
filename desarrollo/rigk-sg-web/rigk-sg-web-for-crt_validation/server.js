const express = require('express');
var path = require('path');
const port = process.env.PORT ||8080;
const app = express();

app.use(express.static(path.join(__dirname, 'dist/rigk-sg-web')));

/*
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'dist/rigk-sg-web/index.html'));
});
*/

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'dist/rigk-sg-web/.well-known/pki-validation/6C61F70A00A365D5629B2D8DCBA9A21D.txt'));
});

app.listen(port, () => {
	console.log('Servidor iniciado');
	console.log(port);
})

