const express = require('express');
var path = require('path');
const port = process.env.PORT ||8080;
const app = express();

app.use(express.static(path.join(__dirname, 'dist/rigk-sg-web')));

app.get('*', function(req, res) {
	res.sendFile(pathJoin(__dirname, 'dist/rigk-sg-web/index.html'));
});

app.listen(port, () => {
	console.log('Servidor iniciado');
	console.log(port);
})

