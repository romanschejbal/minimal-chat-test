import React from 'react';
import io from 'socket.io-client';
import moment from 'moment';

const colors = [
  'gray',
  'lime',
  'yellow',
  'magenta',
  'aqua',
  'pink',
  'steelblue',
];

const names = [];

export default class App extends React.Component {

  state = {
    message: '',
    connected: false,
    history: []
  }

  componentDidMount() {
    this._socket = io();
    this._socket.on('connect', ::this.handleConnection);
    this._socket.on('history', ::this.handleHistoryPayload);
    this._socket.on('message', ::this.handleNewMessage);
    this._socket.on('disconnect', ::this.handleDisconnection);
  }

  handleConnection() {
    while(this.state.name === undefined || this.state.name === '' || this.state.name === null) {
      this.state.name = prompt('what is your name?');
    }
    this._socket.emit('name', this.state.name);
    this.setState({ connected: true });
    this._input.focus();
  }

  handleDisconnection() {
    this.setState({ connected: false });
  }

  handleHistoryPayload(history) {
    this.setState({
      history: history
    });
    this.scrollToBottom();
  }

  handleNewMessage(message) {
    this.state.history.push(message);
    this.forceUpdate();
    this.scrollToBottom();
  }

  scrollToBottom() {
    this._chatMessages.scrollTop = this._chatMessages.scrollHeight;
  }

  handleInputChange(e) {
    this.setState({ message: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.message.length === 0)
      return;

    this._socket.emit('message', this.state.message);
    this.setState({ message: '' });
  }

  render() {
    if (!this.state.connected) {
      return (
        <div className="chat">
          <div className="chat-messages">
            <div className="record">Not connected</div>
          </div>
        </div>
      );
    }

    this.state.history.forEach(record => {
      if (names.indexOf(record.name) === -1) {
        names.push(record.name);
      }
    });
    const mappedColors = {};
    names.forEach((name, i) => {
      if (i < colors.length) {
        mappedColors[name] = colors[i];
      } else {
        mappedColors[name] = 'white';
      }
    });

    return (
      <div>
        <form onSubmit={::this.handleSubmit}>
          <input style={{ color: mappedColors[this.state.name] }} type="text" value={this.state.message} onChange={::this.handleInputChange} ref={input => this._input = input} />
          <button type="submit">send</button>
        </form>
        <div className="chat">
          <div className="chat-messages" ref={div => this._chatMessages = div}>
            {this.state.history.map((record, i) => (
              <div key={i} className="record">
                <small>{moment(record.date).format('DD/MM/YY HH:mm:ss')}</small>
                <strong style={{ color: mappedColors[record.name] }}>{record.name}:</strong>
                <p>{record.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
