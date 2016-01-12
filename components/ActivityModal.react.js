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

    getInitialState: function(props){

      // Set initial application state using props
      return {
        chat: false
      };

    },

    onChat: function(event){
      event.preventDefault();
      if(this.state.chat == true){
        this.setState({
          chat: false
        })
      } else {
        this.setState({
          chat: true
        })
      }
      return false;
    },

    onRemove: function(event){
      event.preventDefault();
      this.props.setField(null);
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
              <span className="btn btn-primary btn-xs">#{this.props.name}</span>
              <a href="#" onClick={this.onRemove} className="btn btn-primary btn-xs">X</a>
              <a href="#" onClick={this.onChat} className="btn btn-primary btn-xs">Send Message</a>
            </p>
            <Chat loggedIn={this.props.loggedIn} username={this.props.username} enabled={this.state.chat} user={this.props.name}/>
          </div>
        : ""
    }
});
