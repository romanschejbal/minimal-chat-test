import express from 'express';
import socketio from 'socket.io';
import Http from 'http';

const APP_PORT = process.env.PORT || 3000;

const app = express();
const http = Http.Server(app);
const io = socketio(http);

app.use('/', express.static('./public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const history = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  let name;

  socket.on('message', (message) => {
    message = {
      date: new Date(),
      name,
      message
    };
    history.push(message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    const message = {
      date: new Date(),
      name: 'server',
      message: `${name} disconnected`
    };
    history.push(message);
    io.emit('message', message);
    console.log('user disconnected');
  });


  socket.on('name', (newName) => {
    // save name
    name = newName;

    // send notification
    const message = {
      date: new Date(),
      name: 'server',
      message: `${name} connected`
    };
    history.push(message);
    io.emit('message', message);

    // send history
    socket.emit('history', history);
  });
});

http.listen(APP_PORT, () => {
  console.log(`server listening on ${APP_PORT}`);
});
