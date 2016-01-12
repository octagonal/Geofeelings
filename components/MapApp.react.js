var React = require('react');
var GoogleMap = require('google-map-react');
var MessageAdd = require('./MessageAdd.react.js');
var MapRangeSelector = require('./MapRangeSelector.react.js');
var UserModal = require('./UserModal.react.js');
var ActivityModal = require('./ActivityModal.react.js');
var ReactDOM = require('react-dom');
global.jQuery = require('jquery');
global.$ = require('jquery');
var _ = require('lodash');
var io = require('socket.io-client');
var moment = require('moment');

var If = require('react-if');
var Then = If.Then;
var Else = If.Else;

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
      center: [59.938043, 30.337157],
      zoom:5,
      minDate: new moment().subtract("months",3).toDate(),
      maxDate: new Date(),
      query: {},
      author: "",
      activity: ""
    };

  },

  // Called directly after component rendering, only on client
  componentDidMount: function(){

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
            key:el.location.join("")+el.body,
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
      }
    });
    //console.log($('[data-toggle="popover"]').popover());
      //$('[data-toggle="popover"]').popover();
  },

  boundsChanged: function(center, zoom, bounds, marginBounds) {
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
        data.forEach(function(el){
          console.log(el.date);
          tmpMarkers.push({
            lat:el.location[0],
            lng:el.location[1],
            text:el.body,
            user: el.author,
            activity:el.activity,
            key:el.location.join("")+el.body,
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
        <ul className="nav nav-tabs">
          <li className="active"><a href="#map" data-toggle="tab">Map</a></li>
          <li><a href="#stats" data-toggle="tab">Statistics</a></li>
        </ul>
        <div id="myTabContent" className="tab-content">
          <div className="tab-pane active map-container" id="map">
          <GoogleMap
            className="map"
            key={1}
            onBoundsChange={this.boundsChanged}
            center={this.state.center}
            zoom={this.state.zoom}>
            {this.state.markers.map(function(marker){
              return <div
                href="#"
                lat={marker.lat}
                key={marker.key}
                lng={marker.lng}
                className="marker"
                style={this.style}
              >
                <span
                  className="label label-info">"{marker.text}"
                </span>
                <span
                  onClick={function(event){_this.setActivity(event); event.stopPropagation()}}
                  className="label label-info">{marker.activity}
                </span>
                <span
                  onClick={function(event){_this.setAuthor(event); event.stopPropagation()}}
                  className="label label-info">{marker.user}
                </span>
              </div>;
            })}
          </GoogleMap>
          </div>
          <div className="tab-pane" id="stats">
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
                    fill={"white"}
                    margin={{top: 10, bottom: 50, left: 50, right: 10}}
                    xScale={d3.time.scale().domain([this.state.minDate, this.state.maxDate]).range([0, 600-50])}
                    xScaleBrush={d3.time.scale().domain([this.state.minDate, this.state.maxDate]).range([0, 600-50])}
                />
              </div>
            </div>
          </div>
        </div>
        <UserModal setField={this.setAuthor} name={this.state.author} />
        <ActivityModal setField={this.setActivity} name={this.state.activity} />
        <MessageAdd />
        <MapRangeSelector handleTimeChange={_.debounce(this.handleTimeChange,700)} />
      </div>
    )
  }
});
