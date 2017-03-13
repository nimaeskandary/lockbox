var express = require('express');
var app = express();

app.get('/', function (req, res) {
	res.sendFile('index.html', { root : '../html/'});
})

app.get('/text', function (req, res) {
	res.send('<textarea name="textarea" rows="10" cols="50">Write something here</textarea>');
});

app.get('/image', function (req, res) {
	res.send('(insert image upload area here)');
});

app.get('/file', function (req, res) {
	res.send('(insert file upload area here)');
})

app.get('/upload', function (req, res) {
	res.send(req.query.text);
})

app.listen(8080, function() {
	console.log('LockBox running on port 8080');
})