var app = require('express').createServer(),
	 twitter = require('ntwitter'), http= require('http'),
   io = require('socket.io').listen(app),
   config = require('./lib/config');
  
var twit = new twitter({
   consumer_key: config.tw_consumer_key,
   consumer_secret: config.tw_consumer_secret,
   access_token_key: config.tw_access_token_key,
   access_token_secret: config.tw_access_token_secret
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
  console.log("PAGE LOADED +++++++++++++++++++++++++++++++++++ "+url_data.topic);
  
  if (config.use_echonest){
  	var topic_term = url_data.topic.replace(/\s/g, '+');
  	console.log('topic term: '+topic_term);
  	echonest(topic_term, config, socket);
  }
  
  // this opens up a tracking stream on the twitter API
   twit.stream('statuses/filter', {'track': url_data.topic}, function(stream) {
	   stream.on('data', function (twit_data) {
	   		// the custom 'tweet' event is emitted to the client when a new tweet comes in
	     socket.emit('tweet', { data: twit_data });
	   });
   });
 }); 
});

// echonest: Calls the echonest API to get the verified twitter account of the musician in the search term, if
// the twitter account exists.
// Term must be in the form "word" or "word+word+word"
function echonest(term, config, socket){
	var options = {
		host: 'developer.echonest.com',
		port: 80,
		path: '/api/v4/artist/profile?api_key='+config.echo_key+'&name='+term+'&bucket=id:twitter&format=json'
	};

	http.get(options, function(res) {
		var body = "";
		console.log('STATUS: ' + res.statusCode);
		res.on('data', function (chunk) {
		  body += chunk;
		});
		res.on('end', function(){
		// parse the response when it finishes
		  body = JSON.parse(body)
			// if a twitter username is returned
			if (typeof(body.response.artist.foreign_ids) != "undefined"){
			//	console.log(body.response.artist.foreign_ids[0].foreign_id);
				// slice out the username from the json
				name = body.response.artist.foreign_ids[0].foreign_id.split(':').slice(-1)[0];
				console.log("twitter username:" + name);
				twitter_status(name, config, socket);
			}
		});
	});
}

// twitter_status: pulls in the statuses of the user_name passed into the function
// default tweet limit is 5, set in the config.js file
function twitter_status(user_name, config, socket) {

	// I'm fairly certain the count option isn't working
  var twit_options = {
  	count: config.seed_tweet_limit,
  	screen_name: user_name,
  	trim_user: true
  }
  twit.get('/statuses/user_timeline.json', twit_options, function(stuff, data){
	if (typeof(socket) != undefined){
	  socket.emit('artist_tweet', {artist_data: data});
	}
	else console.log('Socket error!');
  });
}

    
    
