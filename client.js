function app(app_term, echonest) {
	var socket = io.connect('http://localhost/'),
		tweet_count = 0, tweet_lim = $('#tweet_limit').val();	
	$(document).ready(function() {
		$('#lim_button').click(function() {
			tweet_lim = $('#tweet_limit').val();
			while(tweet_count>tweet_lim){
				$("#tweets li:first").remove();
				tweet_count--;
			}
		});
	});
	// sends url routing info to the server						
	socket.emit('page_load', { topic: app_term });	
	// listens to tweets, adds them to the list
	socket.on('tweet', function (data) {	
		tweet_count++;
		// limiting function, removes first tweet from list
		// when new tweet added
		if(tweet_count>tweet_lim) {
			$("#tweets li.normal:first").remove();
			tweet_count--;
		}									
		console.log(data); 
		$('#tweets').append('<li class="normal">'+data.data.text+'</li>');												
	});
	socket.on('artist_tweet', function(data) {
		console.log('artist tweets received!');
	  console.log(data);
	  $('#artist_tweet_box').show();
	  $.each(data.artist_data, function(k,val){
	  	$('#artist_tweets').append('<li class="artist_tweet_text">'+val.text+'</li>');			
	  });
  });
}

