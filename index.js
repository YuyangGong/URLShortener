var express = require('express'),
	fs = require('fs'),
	app = new express(),
	port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.writeHeader(200, {'Content-Type': 'text/html'});
	fs.readFile('./view/pages/index.html', function(err, data) {
		if(err) throw err;
		res.end(data);
	});
});

app.get('/new/:url', function(req, res) {
	var url = req.params.url;
	if(/^https?:\/\/([a-z]+\.)?[a-z]+\.[a-z]+$/i.test(url)) {

	}
	else {
		res.json({"error":"Wrong url format, make sure you have a valid protocol and real site."});
	}
})

app.get('/:num', function(req, res) {
	var url = req.params.num;
	if(/^\d+$/.test(url)) {

	}
	else {
		res.json({"error":"Wrong format, make sure you have a valid order or site."});
	}
})

app.get('*', function(req, res) {
	res.send('404 not found!');
})

app.listen(port);


console.log('run at port ' + port);