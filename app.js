var app = require('express').createServer(),
	 twitter = require('ntwitter'),
   io = require('socket.io').listen(app);
  
var twit = new twitter({
   consumer_key: 'TPI5elAnP0abdruouDCO7w',
   consumer_secret: 'g2EMLDqsX2yrJE3lx496UkuD2W9AtV0BaipjlYzw2o',
   access_token_key: '45428056-FV7jnxzkSL2hdn9Vk6f73b2Xc2Btr15tli10By1jo',
   access_token_secret: 'nUNYO4uhQCU5v9WQ48VjLESSvyvohomtz46aKZfH8'
 });

app.listen(8888);

// homepage pageholder
app.get('/', function (req, res) {
  res.send('Welcome to Twitter Server!<br />By Jason Schapiro');
});

// required so I don't get an error from express when rendering
app.set('view options', {
  layout: false
});

app.get('/client.js', function(req, res){
	res.sendfile('client.js');
});

app.get('/stream/:term', function(req, res) {
// This is the code served by the page. It emits an event when it loads to 
// send the search term parsed out of the url address to the node server
// to use in the twitter streaming API
  res.render('index.jade', {term: req.params.term});
  console.log(req.params.term);
});

// this opens up a socket between the server and the client when they connect
io.sockets.on('connection', function (socket) {
	// the custom 'page_load' event reads in the search term from the client's URL
  socket.on('page_load', function(url_data){
  console.log("PAGE LOADED ++++++++++++++++++++++++++++++++++++");
  console.log(url_data.topic);
  // this opens up a tracking stream on the twitter API
   twit.stream('statuses/filter', {'track': url_data.topic}, function(stream) {
	   stream.on('data', function (twit_data) {
	   		// the custom 'tweet' event is emitted to the client when a new tweet comes in
	     socket.emit('tweet', { data: twit_data });
	   });
   });
 }); 
});

    
    
