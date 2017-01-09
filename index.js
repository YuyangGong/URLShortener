var express = require('express'),
	fs = require('fs'),
	app = new express(),
	port = process.env.PORT || 4000,
	mongo = require('mongodb').MongoClient,
	data_url = 'mongodb://localhost:27017/my_database_name';


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
	console.log(url);
	if(/^https?:\/\/([a-z]+\.)?[a-z]+\.[a-z]+$/i.test(url)) {
		mongo.connect(data_url, function(err, db) {
			let match_url, num;
			if(err) return console.log(err);
			else {
				var collection = db.collection('url');
				collection.find().toArray(function(err, urls) {
					if(err) return console.error(err);
					num = urls.length;
					match_url = urls.filter(v => v["original_url"] === url);
					if(match_url.length) {
						res.json({"original_url":url,"short_url":match_url[0]["short_url"]});
						db.close();
					}
					else {
						collection.insert({ "original_url": url, "short_url":"https://little-url-yuyang.herokuapp.com/" + num, "order":num}, function(err, data) {
							if(err) return console.log(err);
							else {
								res.json({ "original_url": url, "short_url":"https://little-url-yuyang.herokuapp.com/" + num });
								db.close();
							}
						});
					}
				});
			}
		});
	}
	else {
		res.json({"error":"Wrong url format, make sure you have a valid protocol and real site."});
	}
})

app.get('/:num', function(req, res) {
	var num = req.params.num;
	if(/^\d+$/.test(num)) {
		mongo.connect(data_url, function(err, db) {
			if(err) return console.log(err);
			else {
				let collection = db.collection('url');
				collection.find().toArray(function(err, urls) {
					if(err) return console.log(err);
					let match_url = urls.filter(v => v.order == num);
					if(match_url.length) {
						console.log(match_url[0]["original_url"])
						res.redirect(match_url[0]["original_url"]);
					}
					else {
						res.json({"error":"no match url"})
					}
					db.close();
				});
			}
		});
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