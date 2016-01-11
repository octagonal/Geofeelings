var express = require('express');
var router = express.Router();
Tweet = require('../models/map');

router.get('/byDate/:dateBegin/:dateEnd', function(req, res, next) {
  Tweet.getMapDataByDate(new Date(parseInt(req.params.dateBegin)), new Date(parseInt(req.params.dateEnd)), function(tweets) {
    res.send(tweets);
  });
});

router.get('/:dateRange/:locationPoint/:distanceRange/:authorName', function(req, res, next){

});

router.get('/:lat/:lng/:dist', function(req, res, next) {
      // Render React to a string, passing in our fetched tweets
      diste = {lat: req.params.lat,lng: req.params.lng,dist: req.params.dist};
      res.send(diste);
});

router.get('/:lat/:lng/:dist/:date', function(req, res, next) {
      // Render React to a string, passing in our fetched tweets
      diste = {lat: req.params.lat,lng: req.params.lng,dist: req.params.dist};
      res.send(diste);
});

router.get('/', function(req, res, next) {
  Tweet.getMapData(req.params.page, req.params.skip, function(tweets) {
  // Render as JSON
    res.send(tweets);
  });
});

router.get('/addSingle', function(req, res, next) {
      // Render React to a string, passing in our fetched tweets

    var tweet = {
      active     : true
    , author     : "Anthony"
    , avatar     : null
    , body       : "Yay"
    , date       : new Date()
    , sentiment  : {
        score: 5
      , comparative: 2
      , tokens: [ "Hello" ]
      , words: [ "Hi" ]
      , positive: [ "S" ]
      , negative: [ "String" ]
    }
    , location: [ 59.938043, 30.337157 ]
  }

      // Create a new model instance with our object
      var tweetEntry = new Map(tweet);

      // Save 'er to the database
      tweetEntry.save(function(err) {
        if (!err) {
          var socketio = req.app.get('socketio');
          socketio.emit('news', tweet );

          res.status(200);
          res.send({success: true});
        } else {
          res.status(400);
          res.send({success: false});
        }
      });
});

module.exports = router;
