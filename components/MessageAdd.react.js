var React = require('react');
var ReactDOM = require('react-dom');
var lodash = require('lodash');
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

  makeGradientColor: function(color1, color2, percent) {
    var newColor = {};

    function makeChannel(a, b) {
        return(a + Math.round((b-a)*(percent/100)));
    }

    function makeColorPiece(num) {
        num = Math.min(num, 255);   // not more than 255
        num = Math.max(num, 0);     // not less than 0
        var str = num.toString(16);
        if (str.length < 2) {
            str = "0" + str;
        }
        return(str);
    }

    newColor.r = makeChannel(color1.r, color2.r);
    newColor.g = makeChannel(color1.g, color2.g);
    newColor.b = makeChannel(color1.b, color2.b);
    newColor.cssColor = "#" +
                        makeColorPiece(newColor.r) +
                        makeColorPiece(newColor.g) +
                        makeColorPiece(newColor.b);
    return(newColor);
  },

  handleTextChange: function(e) {
    var messageRating = sentiment(e.target.value);
    var comparativeRating = messageRating.comparative;
    console.log(comparativeRating);
    var happy = {r:0, g:188, b:140}; //Very happy
    var sad = {r:231, g:76, b:60}; //Very sad
    var interpVal = (comparativeRating +5)*(255/10);
    console.log(interpVal);
    var newColor = this.makeGradientColor(sad, happy, interpVal );
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
    return (

      <div className="panel panel-default message">
        <div className="panel-heading" style={{backgroundColor: this.state.feelingColor}}>What's up?</div>
        <div className="panel-body">
          <form onSubmit={this.handleMessageAdd} className="form-horizontal">
            <div className="form-group">
            <div className="row">
              <div className="col-lg-5">
                <input type="text" className="form-control" id="messageContents" placeholder="How are you feeling?" onChange={this.handleTextChange}/>
              </div>
              <div className="col-lg-4">
                <input type="text" className="form-control" id="activityContents" placeholder="#activity" onChange={this.handleActivityChange} />
              </div>
              <div className="col-lg-3">
                <input type="submit" className="form-control" id="activityContents" placeholder="#activity" onChange={this.handleActivityChange} />
              </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
});
