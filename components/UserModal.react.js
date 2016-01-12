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
     return (this.props.name != "")
        ? <p className="tag">
            <span className="btn btn-primary btn-xs">u/{this.props.name}</span>
            <a href="#" onClick={this.onRemove} className="btn btn-primary btn-xs">X</a>
            <a href="#" onClick={this.onChat} className="btn btn-primary btn-xs">Chat</a>
          </p>
        : ""
    }
});
