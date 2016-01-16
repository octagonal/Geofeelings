var express = require('express');
var router = express.Router();
var authUtils = require('../passport/authUtils');
var User = require('../models/user');
Tweet = require('../models/map');

module.exports = function(passport){
  /* GET users listing. */
  router.get('/', authUtils.isAuthenticated, authUtils.isUserAdmin, function(req, res) {
    Tweet.getByQuery({active: true}, function(tweets) {
      // Render as JSON
      res.render('entrieslist', {
        entries: tweets
      });
    });
  });

  router.post('/', function(req, res) {
      var allow = true;
      console.log(req.body);
      Tweet.update({ body: { $in: req.body.entry } }, {$set: {active: false}}, {multi: true}, function(err, aff){
      });
      Tweet.getByQuery({ body: { $in: req.body.entry } }, function(el){
      });
      req.flash('message', 'Settings changed successfully');
      res.redirect('admin');
  });

  return router;
};
