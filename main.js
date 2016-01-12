var React = require('react');
var ReactDOM = require('react-dom');
var MapApp = require('./components/MapApp.react');

// Snag the initial state that was passed from the server side
var initialState = JSON.parse(document.getElementById('initialState').innerHTML)
console.log(initialState);
// Render the components, picking up where react left off on the server
ReactDOM.render(
  <MapApp username={initialState.username} loggedIn={initialState.loggedIn}/>,
  document.getElementById('react-app')
);
