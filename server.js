const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


const { gameLoop, getUpdatedVel, initGame } = require('./Server/game');
const { FRAME_RATE } = require('./Server/constans');
const { makeid } = require('./Server/utils');
const { emit } = require('process');
const { start } = require('repl');

const state = {};
const clientRooms = {};


app.get('/', (req, res) => {
    app.use(express.static('Client'));
    res.sendFile('Client/index.html', { root: __dirname });
});



io.on("connection", client=>{
    

    client.on('keydown', handleKeyDown);
    client.on('newGame', handleNewGame);
    client.on('joinGame', handleJoinGame);
    
    function handleJoinGame(roomName) {
      const room = io.sockets.adapter.rooms.get(`${roomName}`);
      console.log(room);
  
  
      let numClients = 0;
      if (room) {
        numClients = room ? room.size : 0;
        console.log(numClients);
      }
      console.log(numClients);
  
      if (numClients === 0) {
        client.emit('unknownCode');
        return;
      } else if (numClients > 1) {
        client.emit('tooManyPlayers');
        return;
      }
  
      clientRooms[client.id] = roomName;
  
      client.join(roomName);
      client.number = 2;
      client.emit('init', 2);
      console.log("Player 2 Joined");
      startGameInterval(roomName);
    }
    
    function handleNewGame(){
      let roomName= makeid(5);
      clientRooms[client.id] = roomName;
      client.emit('gameCode', roomName);

      state[roomName]= initGame();

      client.join(roomName);
      client.number= 1;
      client.emit("init", 1);
      console.log("Player 1 Joined");
    }

    function handleKeyDown(key){
      const roomName = clientRooms[client.id];
      if (!roomName) return;

      const vel = getUpdatedVel(key, client.number);
      if (vel) {
        state[roomName].players[client.number - 1].vel = vel;
      }
    }

    
});

function startGameInterval(roomName){
  const intervalID = setInterval(()=>{
    const winner= gameLoop(state[roomName]);
    if (!winner) {
      emitGameState(roomName, state[roomName]);
    } else {
      emitGameOver(roomName, winner);
      state[roomName]= null;
      clearInterval(intervalID);
    }
  }, 1000/FRAME_RATE);
}


function emitGameState(roomName, state) {
  io.sockets.in(roomName).emit('gameState', JSON.stringify(state));
}

function emitGameOver(roomName, winner) {
  io.sockets.in(roomName).emit('gameOver', JSON.stringify({ winner }));
}


const port = process.env.PORT || 5500;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});