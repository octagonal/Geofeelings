var ReactDOMServer = require('react-dom/server');
var React = require('react');//,
require("babel-polyfill");
require("babel-register")({
   only: /components/,
   presets: ["react"]
})

MapApp = React.createFactory(require('../components/MapApp.react'));
  // Map = require('../models/Map');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
      // Render React to a string, passing in our fetched tweets
      var markup = ReactDOMServer.renderToString(
        MapApp({
          // tweets: tweets
        })
      );

      // Render our 'home' template
      console.log("rendering");
      res.render('index', { markup: markup, state: "lol" });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

module.exports = router;
