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

app.get('/', function (req, res) {
  res.send('Welcome to Twitter Server!<br />By Jason Schapiro');
});

app.get('/stream/:term', function(req, res) {
// This is the code served by the page. It emits an event when it loads to 
// send the search term parsed out of the url address to the node server
// to use in the twitter streaming API
  res.send("																			\
   <script src='/socket.io/socket.io.js'></script>							\
   <script src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'></script>						\
	<script>																				\
	  var socket = io.connect('http://localhost/');							\
	  socket.emit('page_load', { topic: '" + req.params.term + "' });	\
	  socket.on('tweet', function (data) {										\
	  console.log(data.data.text); \
	  $('#tweets').append('<li>'+data.data.text+'</li>');												\
	  });																					\
	</script>																			\
	<h3>Incoming Tweets about "+req.params.term+"</h3> 					\
	<ul id='tweets'></ul>");
});


  io.sockets.on('connection', function (socket) {
    socket.on('page_load', function(url_data){
	   twit.stream('statuses/filter', {'track': url_data.topic}, function(stream) {
		   stream.on('data', function (twit_data) {
		     socket.emit('tweet', { data: twit_data });
	//	     console.log(data.text);
		   });
	   });
	 }); 
  });

    
    
