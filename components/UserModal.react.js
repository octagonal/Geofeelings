// Browserify:
var If = require('react-if');
var Then = If.Then;
var Else = If.Else;
var React = require('react');
var ReactDOM = require('react-dom');

var Chat = require('./Chat.react.js');

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

    onChat: function(event){
      this.setState({
        chat: true
      })
    },

    render: function() {
        return (
            <div>
                {this.renderBody()}
            </div>
        );
    },

    renderBody: function() {
     return (this.props.name != "")
        ? <div>
            <p className="tag">
              <span className="btn btn-primary btn-xs">u/{this.props.name}</span>
              <a href="#" onClick={this.onRemove} className="btn btn-primary btn-xs">X</a>
            </p>
          </div>
        : ""
    }
});
