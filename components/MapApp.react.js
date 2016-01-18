var React = require('react');
var GoogleMap = require('google-map-react');
var MessageAdd = require('./MessageAdd.react.js');
var MapRangeSelector = require('./MapRangeSelector.react.js');
var UserModal = require('./UserModal.react.js');
var NavBar = require('./NavBar.react.js');
var ActivityModal = require('./ActivityModal.react.js');
var ReactDOM = require('react-dom');
global.jQuery = require('jquery');
global.$ = require('jquery');
var _ = require('lodash');
var io = require('socket.io-client');
var moment = require('moment');
var colorMapper = require('../util/colorMapper');

var qs = require('qs');

var ReactD3 = require("react-d3-components");

var style = {

}

// Export the TweetsApp component
module.exports = MapApp = React.createClass({
  // Set the initial component state
  getInitialState: function(props){

    props = props || this.props;

    // Set initial application state using props
    return {
      markers: [
      ],
      center: [50.87906276698436, 4.053740251953059],
      zoom:9,
      minDate: new moment().subtract("months",3).toDate(),
      maxDate: new Date(),
      query: {},
      author: "",
      activity: ""
    };

  },

  // Called directly after component rendering, only on client
  componentDidMount: function(){

    var cookies = {};
      document.cookie.split(';').forEach(function(cookie){
      var key = cookie.split('=')[0];
      var val = cookie.split('=')[1];
      var obj = {};
      cookies[key.replace(/ /g,'')] = val;
    })
    if(cookies.firstTime == null) {
      var introJs = require('intro.js').introJs;
      console.log(introJs);
      introJs().start();
      document.cookie="firstTime=false";
    }
    // Preserve self reference
    this.queryMap("/map");
    // Initialize socket.io
    var _this = this;
    var socket = io.connect();
      socket.on('news', function (el) {
        socket.emit('my other event', { my: 'data' });
        console.log("New item");
        if(moment(_this.state.maxDate).isBetween(moment().subtract('days',1),moment())){
          console.log("maxTime within realtime bounds, should add to map");
          newSet = _this.state.markers;
          newSet.push({
            lat:el.location[0],
            lng:el.location[1],
            text:el.body,
            user: el.author,
            activity:el.activity,
            key:el.location.join(""),
            date: new Date(el.date),
            feeling: el.sentiment.comparative
          })

        _this.setState({markers: newSet})
        }
      });
  },

  componentDidUpdate: function(){
    var _this = this;

    window.requestAnimationFrame(function() {
      var node = ReactDOM.findDOMNode(_this);
      if (node !== undefined) {
        $(ReactDOM.findDOMNode(_this)).find('[data-toggle="popover"]').popover();
        $(ReactDOM.findDOMNode(_this)).find("a[href='#map']").on('shown.bs.tab', function(){
            google.maps.event.trigger(map, 'resize');
        });
        setInterval(function(){
          $(ReactDOM.findDOMNode(_this)).find('.marker').parent().css({width:"auto"});
          $(ReactDOM.findDOMNode(_this)).find('.marker').parent().css({height:"auto"});
        }, 1);
      }
    });
    //console.log($('[data-toggle="popover"]').popover());
      //$('[data-toggle="popover"]').popover();
  },

  boundsChanged: function(center, zoom, bounds, marginBounds) {
    console.log("bounds props");
    console.log(center);
    console.log(zoom);
    this.setState({
      center: center,
      zoom: zoom
    });
  },

  happinessToString: function(value){
    suffix = "unhappy";
    prefix = "";

    if(value == 0){
      return "Neutral";
    }
    if(value > 0){
      suffix = "happy";
    }

    switch(Math.abs(value)) {
      case 5:
          prefix = "Extremely";
          break;
      case 4:
          prefix = "Deeply";
          break;
      case 3:
          prefix = "Very";
          break;
      case 2:
          prefix = "Quite";
          break;
      case 1:
          prefix = "Just";
          break;
      default:
          prefix = "";
    }

    return prefix + " " + suffix;
  },

  handleTimeChange: function(event) {
    var maxTime = event.max;

    if(moment(event.max).isBetween(moment().subtract('days',1),moment())){
      maxTime = moment().valueOf();
      console.log("Realtime, padding to full day");
    }

    this.setState({
      minDate: event.min,
      maxDate: event.max
    });
    var currentQ = this.state.query;
    currentQ.dateRange = {begin: new Date(event.min), end: new Date(maxTime)};
    this.setState({
      query: currentQ
    });
    console.log(qs.stringify(this.state.query, {encode: false}));
    this.queryMap("/map/?" + qs.stringify(this.state.query, {encode: false}) );
  },

  setAuthor: function(event){
    if(event == null){
      this.setState({
        author: ""
      });
      var currentQ = this.state.query;
      delete currentQ.author;
      this.setState({
        query: currentQ
      });
      this.queryMap("/map/?" + qs.stringify(this.state.query, {encode: false}) );
      return;
    }
    console.log(event.currentTarget.textContent);
    this.setState({
      author: event.currentTarget.textContent
    });
    var currentQ = this.state.query;
    currentQ.author = event.currentTarget.textContent;
    this.setState({
      query: currentQ
    });
    console.log(qs.stringify(this.state.query, {encode: false}));
    this.queryMap("/map/?" + qs.stringify(this.state.query, {encode: false}) );
  },

  createMapOptions: function (maps) {
    return {
      panControl: true,
      mapTypeControl: true,
      scrollwheel: true,
      styles: [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}]
    }
  },

  setActivity: function(event) {
    if(event == null){
      this.setState({
        activity: ""
      });
      var currentQ = this.state.query;
      delete currentQ.activity;
      this.setState({
        query: currentQ
      });
      this.queryMap("/map/?" + qs.stringify(this.state.query, {encode: false}) );
      return;
    }
    console.log(event.currentTarget.textContent);
    console.log(event.currentTarget.textContent);
    this.setState({
      activity: event.currentTarget.textContent
    });
    var currentQ = this.state.query;
    currentQ.activity = event.currentTarget.textContent;
    this.setState({
      query: currentQ
    });
    console.log(qs.stringify(this.state.query, {encode: false}));
    this.queryMap("/map/?" + qs.stringify(this.state.query, {encode: false}) );
  },

  queryMap: function(url){
    var self = this;
      tmpMarkers = []
      var bootstrap = require('bootstrap');
      $.get(url, function(data) {
        data.reverse().forEach(function(el){
          console.log(el.date);
          tmpMarkers.push({
            lat:el.location[0],
            lng:el.location[1],
            text:el.body,
            user: el.author,
            activity:el.activity,
            key:el.location[0].toFixed(2) + el.location[1].toFixed(2),
            date: new Date(el.date),
            feeling: el.sentiment.comparative
          })
        })

        this.setState({markers:
          _.uniq(tmpMarkers, function(marker){
            return marker.key;
          })
        });
        console.log(this.state.markers);
      }.bind(this));
  },

  // Render the component
  render: function(){
    var d3 = require('d3');
    var _this = this;
    var lineChartData = [{x:0, y:0}];

    console.log(this.state.markers);
    if(this.state.markers.length != 0){ lineChartData = _.map(
        _.groupBy(this.state.markers, function(n){
          console.log(moment(n.date).hours());
          return moment(n.date).startOf('day').unix();
        }),
        function(n){
          console.log(n);
          return {x: moment(n[0].date).startOf('day').toDate(), y: n.length }
        }
      )
    }

    console.log(lineChartData);

    return (

      <div className="maps-app">
        <NavBar loggedIn={this.props.loggedIn} username={this.props.username}/>
        <MessageAdd loggedIn={this.props.loggedIn} />
        <ul className="nav nav-tabs">
          <li className="active"><a href="#map" data-toggle="tab">Map</a></li>
          <li><a href="#stats" data-toggle="tab">Statistics</a></li>
        </ul>
        <div id="myTabContent" className="tab-content">
          <div className="tab-pane active" id="map">
          <div className="panel panel-default">
          <div
            className="panel panel-body"
            data-intro="This map shows you how people feel all around the world. Click on a marker if you want to filter on a certain user or activity."
            data-step="2">
          <div className="map-container">
          <GoogleMap
            className="map"
            key={1}
            options={this.createMapOptions}
            onBoundsChange={this.boundsChanged}
            center={this.state.center}
            zoom={this.state.zoom}>
            {this.state.markers.map(function(marker){
              return <div
                href="#"
                data-toggle="popover"
                data-trigger="hover"
                data-content={marker.text}
                lat={marker.lat}
                key={marker.key}
                lng={marker.lng}
                className="marker panel panel-default clearfix"
                style={{width:"100%"}, {height: "100%"}, {backgroundColor: colorMapper.makeGradientColor(marker.feeling).cssColor}}
              >
                <div className="panel-heading">
                <span
                  className="">"{marker.text.substring(20, length)+".."}"
                </span>
                </div>
                <div className="panel-body">
                <span
                  onClick={function(event){_this.setActivity(event); event.stopPropagation()}}
                  className="label label-default">{marker.activity}
                </span>
                <span
                  onClick={function(event){_this.setAuthor(event); event.stopPropagation()}}
                  className="label label-default label-activity">{marker.user}
                </span>
                </div>
              </div>;
            })}
          </GoogleMap>
          </div>
          </div>
          </div>
          </div>
          <div className="tab-pane" id="stats">
          <div className="panel panel-default">
          <div className="panel panel-body">
            <div className="row">
              <div className="col-md-6">
                <p>Entries by happiness</p>
                <ReactD3.PieChart
                        data={{
                          label: 'Happiness rating',
                          values: _.map(
                            _.groupBy(this.state.markers, function(n){
                              return Math.ceil(n.feeling);
                            }),
                            function(n){
                              return {x: _this.happinessToString(Math.ceil(n[0].feeling)), y: n.length }
                              }
                            )
                        }}
                        width={600}
                        height={400}
                        margin={{top: 10, bottom: 10, left: 100, right: 100}}
                        sort={null}
                        />
              </div>
              <div className="col-md-6">
                <p>Entries by date</p>
                <ReactD3.LineChart
                    data={{
                      label: 'test',
                      values: lineChartData
                    }}
                    width={600}
                    height={400}
                    margin={{top: 10, bottom: 50, left: 50, right: 10}}
                    xScale={d3.time.scale().domain([this.state.minDate, this.state.maxDate]).range([0, 600-50])}
                    xScaleBrush={d3.time.scale().domain([this.state.minDate, this.state.maxDate]).range([0, 600-50])}
                />
              </div>
            </div>
          </div>
          </div>
          </div>
        </div>
        <UserModal setField={this.setAuthor} name={this.state.author} />
        <ActivityModal loggedIn={this.props.loggedIn} username={this.props.username} setField={this.setActivity} name={this.state.activity} />
        <MapRangeSelector handleTimeChange={_.debounce(this.handleTimeChange,700)} handleTimeChangeNonDiscrete={this.handleTimeChange} />
      </div>
    )
  }
});
