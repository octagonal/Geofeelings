var React = require('react');
var ReactDOM = require('react-dom');
var ReactSlider = require('react-slider');

var lodash = require('lodash');
var moment = require('moment');

global.jQuery = require('jquery');

// Export the TweetsApp component
module.exports = MapRangeSelector = React.createClass({
  // Set the initial component state
  getInitialState: function(props){

    props = props || this.props;

    // Set initial application state using props
    return {
      startDate: Date.parse(new Date("2015-01-01")),
      endDate: Date.parse(new Date()),
      minDate: Date.parse(new Date("2015-10-01")),
      maxDate: Date.parse(new Date())
    };

  },

  componentWillReceiveProps: function(newProps, oldProps){
    this.setState(this.getInitialState(newProps));
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
    return [parsedDate.format("YYYY-MM-DD"), parsedDate.fromNow()];
  },

  handleRangeChanged: function(value){
    this.setState({
      minDate: value[0],
      maxDate: value[1]}
    );
  },

  // Render the component
  render: function(){
    return (
      <div id="time-range">
        <p>
          <span>Entries from </span>
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
          value={this.state.value}
          onChange={this.handleRangeChanged}
          defaultValue={[this.state.minDate, this.state.maxDate]}
          withBars
          min={this.state.startDate}
          max={this.state.endDate}
        />
      </div>
    )
  }
});
