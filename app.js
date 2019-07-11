const express = require('express');
const app = express();
const http = require('http').Server(app);


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res, next) => {
   res.sendFile(__dirname + '/Public/chat.html')
});

http.listen(3000, () => {
   console.log(`Server run on port 3000...`);
});

const io = require('socket.io')(http, {
   pingTimeout: 30000,
   pingInterval: 60000,
});

io.on('connection', (socket) => {

   socket.on('setname', (data) => {
      socket.username = data;
      socket.emit('client-connected')
      console.log(socket.username + ' connected')
   });

   socket.on('message', (data) => {
      io.emit('message', {
         username: socket.username,
         message: data
      })
   });

   socket.on('disconnect', () => {
      console.log(socket.username + ' disconnected')
   });

});

