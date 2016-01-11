var React = require('react');
var GoogleMap = require('google-map-react');
var MessageAdd = require('./MessageAdd.react.js');
var MapRangeSelector = require('./MapRangeSelector.react.js');
var ReactDOM = require('react-dom');
global.jQuery = require('jquery');
global.$ = require('jquery');
var _ = require('lodash');
var io = require('socket.io-client');

var style = {
  height: 40,
  left: -40 / 2,
  top: -40 / 2,
  textAlign: 'center',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4
}

// Export the TweetsApp component
module.exports = MapApp = React.createClass({
  // Set the initial component state
  getInitialState: function(props){

    props = props || this.props;

    // Set initial application state using props
    return {
      markers: [
      ]
    };

  },

  // Called directly after component rendering, only on client
  componentDidMount: function(){

    // Preserve self reference
    var self = this;

      tmpMarkers = []
      $.get("/map", function(data) {
        data.forEach(function(el){
          tmpMarkers.push({lat:el.location[0], lng:el.location[1],text:el.body, key:el.location.join("")})
        })
        this.setState({markers: tmpMarkers});
        console.log(this.state.markers);
      }.bind(this));

    // Initialize socket.io
    var socket = io.connect();
      socket.on('news', function (data) {
        socket.emit('my other event', { my: 'data' });
      });

    //google.maps.event.addDomListener(window, "load", initializeMap);
  },

  handleTimeChange: function(event) {
    tmpMarkers = []
    $.get("/map/byDate/" + event.min +"/" + event.max , function(data) {
      data.forEach(function(el){
        tmpMarkers.push({lat:el.location[0], lng:el.location[1],text:el.body, key:el.location.join("")})
      })
      this.setState({markers: tmpMarkers});
      console.log(this.state.markers);
    }.bind(this));
  },

  // Render the component
  render: function(){
    return (
      <div className="maps-app">
        <GoogleMap
          className="map"
          key={1}
          center={[59.938043, 30.337157]}
          zoom={5}>
          {this.state.markers.map(function(marker){
            return <span className="label label-info" lat={marker.lat} key={marker.key} lng={marker.lng} style={this.style}>{marker.text}</span>;
          })}
        </GoogleMap>
        <MessageAdd/>
        <MapRangeSelector handleTimeChange={_.debounce(this.handleTimeChange,700)} />
      </div>
    )
  }
});
