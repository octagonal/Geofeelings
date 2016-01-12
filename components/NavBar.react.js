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

    renderBody: function() {
     return (this.props.loggedIn != false)
        ? <p className="">
            <span className="label label-default">Logged in as u/{this.props.username}</span>
            <a href="/signout" className="label label-danger">Logout</a>
          </p>
        : <p className="">
            <a href="/login" className="btn btn-primary btn-xs">Sign In</a>
            <a href="/signup" className="btn btn-primary btn-xs">register</a>
          </p>
    }
});
