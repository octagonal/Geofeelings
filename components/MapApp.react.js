var React = require('react');
var GoogleMap = require('google-map-react');
var MessageAdd = require('./MessageAdd.react.js');
var ReactDOM = require('react-dom');
var jQuery = require('jquery');
var lodash = require('lodash');
var io = require('socket.io-client');

var style = {
  position: 'absolute',
  //width: 40,
  height: 40,
  left: -40 / 2,
  top: -40 / 2,

  border: '5px solid #f44336',
  borderRadius: 40,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
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
    };

  },

  componentWillReceiveProps: function(newProps, oldProps){
    this.setState(this.getInitialState(newProps));
  },

  // Called directly after component rendering, only on client
  componentDidMount: function(){

    // Preserve self reference
    var self = this;

    // Initialize socket.io
    var socket = io.connect();
      socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
      });

    //google.maps.event.addDomListener(window, "load", initializeMap);
  },

  // Render the component
  render: function(){
    return (
      <div className="maps-app">
        <GoogleMap
          className="map"
          center={[59.938043, 30.337157]}
          zoom={5}>
          <div className="marker" lat={59.955413} lng={30.337844} style={style}>Hallo</div>
        </GoogleMap>
        <MessageAdd>
        </MessageAdd>
      </div>
    )
  }
});
