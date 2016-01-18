var React = require('react');
var ReactDOM = require('react-dom');
var ReactSlider = require('react-slider');

var _ = require('lodash');
var moment = require('moment');

global.jQuery = require('jquery');

// Export the TweetsApp component
module.exports = MapRangeSelector = React.createClass({
  // Set the initial component state
  getInitialState: function(){
    // Set initial application state using props
    return {
      startDate: Date.parse(new Date("2015-01-01")),
      endDate: Date.parse(new Date()),
      minDate: Date.parse(new Date("2015-10-01")),
      maxDate: Date.parse(new Date())
    };
  },

  // Called directly after component rendering, only on client
  componentDidMount: function(){
    self = this;

    var bootstrap = require('bootstrap');
    (function($){
        $('.dateIndicator').popover();
    })(jQuery);
  },

  formatDate: function(msDate){
    parsedDate = moment(msDate);
    //console.log(msDate);
    //console.log(parsedDate);
    //console.log(parsedDate.format("YYYY-MM-DD") + " (" +  parsedDate.fromNow() + ")");
    if(parsedDate.isBetween(moment().subtract('days',1), moment())){
        return [parsedDate.format("YYYY-MM-DD"), "Realtime"];
    }
    return [parsedDate.format("YYYY-MM-DD"), parsedDate.fromNow()];
  },

  play: function(event){
    event.preventDefault();
    var initStartDate = this.state.minDate;
    var initEndDate = this.state.maxDate;
    var self = this;
    _.forEach(
      _.range(initStartDate,initEndDate+(initEndDate-initStartDate)/20,(initEndDate-initStartDate)/20)
      , function(key,it){
        _.delay(
          function(time){
            console.log(time);
            console.log(moment(time).fromNow());
            self.handleRangeChangedNonDiscrete([initStartDate,time]);
          }
          ,it*500,
          key
        )
      }
    );
    return false;
  },

  handleRangeChanged: function(value){
    this.setDateRange(value);
    this.props.handleTimeChange({min:value[0],max:value[1]});
  },

  handleRangeChangedNonDiscrete: function(value){
    this.setDateRange(value);
    this.props.handleTimeChangeNonDiscrete({min:value[0],max:value[1]});
  },

  setDateRange: function(value){
    this.setState({
      minDate: value[0],
      maxDate: value[1]
    });
  },

  // Render the component
  render: function(){
    return (
      <div
        data-intro="Change the slider values if you want to view a different time period."
        data-step="3"
        id="time-range">
        <p>
          <a href="#" className="label label-info" onClick={this.play}>Play</a>
          <span> Entries from </span>
          <label
            title="" data-original-title=""
            className="dateIndicator label label-info"
            data-container="body"
            data-toggle="popover"
            data-trigger="hover"
            data-placement="top"
            data-content={this.formatDate(this.state.minDate)[0]}>
              {this.formatDate(this.state.minDate)[1]}
          </label>
          <span> until </span>
          <label
            title="" data-original-title=""
            type="button"
            className="dateIndicator label label-info"
            data-container="body"
            data-trigger="hover"
            data-toggle="popover"
            data-placement="top"
            data-content={this.formatDate(this.state.maxDate)[0]}>
              {this.formatDate(this.state.maxDate)[1]}
          </label>
        </p>
        <ReactSlider
          className='horizontal-slider'
          value={[this.state.minDate, this.state.maxDate]}
          onChange={this.handleRangeChanged}
          withBars
          min={this.state.startDate}
          max={this.state.endDate}
        />
      </div>
    )
  }
});
