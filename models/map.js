var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    active     : Boolean
  , author     : String
  , avatar     : String
  , body       : String
  , activity   : String
  , date       : Date
  , sentiment  : {
      score: Number
    , comparative: Number
    , tokens: [ String ]
    , words: [ String ]
    , positive: [ String ]
    , negative: [ String ]
  }
  , location: {
    type: [Number],
    index: '2dsphere'
  }
});

// Create a static getTweets method to return tweet data from the db
schema.statics.getMapData = function(page, skip, callback) {
  var tweets = [];
  Map.find({active : {$eq: true}}).exec(function(err,docs){
    if(!err) {
      tweets = docs;  // We got tweets
      tweets.forEach(function(tweet){
        tweet.active = true; // Set them to active
      });
    }
    callback(tweets);
  });
};

schema.statics.getMapDataByDate = function(dateBegin, dateEnd, callback){
  var tweets = [];

  Map.find({ date: { $gte: dateBegin, $lte: dateEnd },active : {$eq: true} }).exec(function(err,docs){
    if(!err) {
      tweets = docs;  // We got tweets
      tweets.forEach(function(tweet){
        tweet.active = true; // Set them to active
      });
    }
    callback(tweets);
  });
};

schema.statics.getByQuery = function(query, callback){
  var tweets = [];
  query.active = {$eq: true};

  Map.find(query).exec(function(err,docs){
    if(!err) {
      tweets = docs;  // We got tweets
      tweets.forEach(function(tweet){
        tweet.active = true; // Set them to active
      });
    }
    callback(tweets);
  });
};

// Return a Tweet model based upon the defined schema
module.exports = Map = mongoose.model('Map', schema);
