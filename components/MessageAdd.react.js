var React = require('react');
var ReactDOM = require('react-dom');
var lodash = require('lodash');
var colorMapper = require('../util/colorMapper');
var sentiment = require('sentiment');

// Export the TweetsApp component
module.exports = MessageAdd = React.createClass({
  // Set the initial component state
  getInitialState: function(props){

    props = props || this.props;

    // Set initial application state using props
    return {
      feelingColor: "#00BC8C",
      activity: ""
    };

  },

  componentWillReceiveProps: function(newProps, oldProps){
    this.setState(this.getInitialState(newProps));
  },

  // Called directly after component rendering, only on client
  componentDidMount: function(){

    // Preserve self reference
    var self = this;

  },

  handleTextChange: function(e) {
    var messageRating = sentiment(e.target.value);
    var comparativeRating = messageRating.comparative;
    var newColor = colorMapper.makeGradientColor(comparativeRating);
    console.log(newColor);
    this.setState({
      feelingColor : newColor.cssColor,
      sentiment : messageRating,
      message : e.target.value
    });
  },

  handleActivityChange: function(e){
    this.setState({
      activity: e.target.value
    });
  },

  handleMessageAdd: function(event){
    event.preventDefault();
    var _this = this;
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position.coords);
      if(_this.state.sentiment == null || _this.state.message == ""){
        return false;
      }
      var tweet = {
        active     : true
      , author     : "Anthony"
      , avatar     : null
      , body       : _this.state.message
      , date       : new Date()
      , sentiment  : _this.state.sentiment
      , activity   : _this.state.activity
      , location :  [ position.coords.latitude, position.coords.longitude ]
    };
    console.log(tweet);
    //console.log(JSON.stringify(tweet));
        $.post( "map/addSingle", tweet)
          .done(function( data ) {
          });
    });

    return false;
  },

  // Render the component
  render: function(){
    console.log("messageadd: " + this.props.loggedIn);
    return (

      <div className="panel panel-default message">
        <div className="panel-heading" style={{backgroundColor: this.state.feelingColor}}>What's up?</div>
        <div className="panel-body">
          <form onSubmit={this.handleMessageAdd} className="form-horizontal">
            <div className="form-group row">
              <div className="col-lg-5">
                <input type="text" className="form-control" id="messageContents" placeholder="How are you feeling?" onChange={this.handleTextChange}/>
              </div>
              <div className="col-lg-4">
                <input type="text" className="form-control" id="activityContents" placeholder="#activity" onChange={this.handleActivityChange} />
              </div>
              <div className="col-lg-3">
                <input disabled={!this.props.loggedIn} type="submit" className="form-control" id="activityContents" placeholder="#activity" onChange={this.handleActivityChange} />
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
});
