const express = require('express');
var path = require('path');
const port = process.env.PORT ||8080;
const app = express();

app.use(express.static(path.join(__dirname, 'dist/rigk-sg-web')));

/*app.get('*', function(req, res) {
	//res.sendFile(pathJoin(__dirname, 'dist/rigk-sg-web/index.html'));
	res.sendFile(path.join(__dirname, 'dist/rigk-sg-web/index.html'));
});*/

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, '.well-known/pki-validation/57316E1F4F0485951DBE2DD31DAB7757.txt'));
});

app.listen(port, () => {
	console.log('Servidor iniciado');
	console.log(port);
})

