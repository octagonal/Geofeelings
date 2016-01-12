// Browserify:
var If = require('react-if');
var Then = If.Then;
var Else = If.Else;
var React = require('react');
var ReactDOM = require('react-dom');
var io = require('socket.io-client');


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

    componentDidMount: function(){
      console.log("removing listeners");
      var socket = io.connect();
      socket.removeAllListeners(this.props.user);

        var socket = io.connect();
          socket.on(this.props.user, function(msg){
            console.log("lel");
            console.log('New message from ' + msg.from);
            console.log(msg.text);

            var node = document.createElement("LI");
            var textnode = document.createTextNode(msg.from + ": " + msg.text);
            node.appendChild(textnode);
            document.getElementById("messages").appendChild(node)
          });
    },

    handleMessageAdd: function(event){
      event.preventDefault();
      var socket = io.connect();
      console.log("sending chat");
      socket.emit('chat message', {
        user: this.props.user,
        from: this.props.username,
        text: document.getElementById("chatMessage").value
      });
      return false;
    },

    renderBody: function() {
      var disabled = true;
      console.log("username: " + this.props.loggedIn);
     if(this.props.username != null){
       disabled = false;
     }
     return (this.props.enabled == true)
        ?
        <div className="panel panel-default message">
          <div className="panel-heading"><p>Chat about '{this.props.user}'</p>
            <form onSubmit={this.handleMessageAdd} className="">
                  <input disabled={!this.props.loggedIn} autoComplete="off" type="text" className="form-control" id="chatMessage" placeholder="Say hi!"/>
            </form>
          </div>
          <div className="panel-body">
            <ul id="messages"></ul>
          </div>
        </div>
        : ""
    }
});
