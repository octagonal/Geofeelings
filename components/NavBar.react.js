// Browserify:
var If = require('react-if');
var Then = If.Then;
var Else = If.Else;
var React = require('react');
var ReactDOM = require('react-dom');

module.exports = UserModal = React.createClass({

    getDefaultProps: function() {
        return {
        };
    },

    onRemove: function(event){
      event.preventDefault();
      this.props.setField(null);
      return false;
    },

    render: function() {
        return (
          <div>
              {this.renderBody()}
          </div>
        );
    },

    showIntro: function(event){
      event.preventDefault();
      var introJs = require('intro.js').introJs;
      introJs().start();
      return false;
    },

    renderBody: function() {
     return (this.props.loggedIn != false)
        ? <p
            className=""
          >
            <span className="label label-default">Logged in as u/{this.props.username}</span>
            <a href="/signout" className="label label-danger">Logout</a>
            <a href="/user/prefs" className="label label-info">Preferences</a>
            <a href="" onClick={this.showIntro} className="label label-info">Help</a>
          </p>
        : <p
            >
            <a href="/login" className="label label-info">Sign In</a>
            <a href="/signup"
              className="label label-info"
              data-intro="Be sure to register if you want to give it a try."
              data-step="5">
              Register</a>
              <a href="" onClick={this.showIntro} className="label label-info">Help</a>
          </p>
    }
});
