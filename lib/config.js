var config = {};

   config.tw_consumer_key = 'Twitter Consumer Key';
   config.tw_consumer_secret = 'Twitter Consumer Secret';
   config.tw_access_token_secret = 'Twitter Access Token Secret';
   config.echo_key = 'Echonest API Key';
  // allows you to access echonest to get seed tweets
  // requires echonest API key; false = off (default)
   config.use_echonest = false;
  // limits the number of seed tweets read from the artist's twitter feed
   config.seed_tweet_limit = 5;

module.exports = config;
