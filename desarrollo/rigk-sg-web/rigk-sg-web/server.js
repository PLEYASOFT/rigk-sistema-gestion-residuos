const express = require('express');
var path = require('path');
const port = process.env.PORT ||8080;
const app = express();

app.use(express.static(path.join(__dirname, 'dist/rigk-sg-web')));

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'dist/rigk-sg-web/index.html'));
});
/*
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'dist/rigk-sg-web/.well-known/pki-validation/B0CCF1FEBB5053430E95BD6F3DCB7166.txt'));
});*/

app.listen(port, () => {
	console.log('Servidor iniciado');
	console.log(port);
})

