var ReactDOMServer = require('react-dom/server');
var React = require('react'); //,
require("babel-polyfill");
require("babel-register")({
  only: /components/,
  presets: ["react"]
})

var express = require('express');
var router = express.Router();

MapApp = React.createFactory(require('../components/MapApp.react'));
// Map = require('../models/Map');

var express = require('express');
var router = express.Router();

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/login');
}

module.exports = function(passport) {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    // Render React to a string, passing in our fetched tweets
    var markup = ReactDOMServer.renderToString(
      MapApp({})
    );

    var username = "";
    if(req.user != null){
      username = (req.user.username || "");
    }
    // Render our 'home' template
    console.log("rendering");
    res.render('index', {
      markup: markup,
      state: JSON.stringify({username: username, loggedIn: req.isAuthenticated()})
    });
  });

  router.get('/signup', function(req, res) {
    res.render('register', {
      message: req.flash('message')
    });
  });

  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  router.get('/login', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('login', {
      message: req.flash('message')
    });
  });

  router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
}
