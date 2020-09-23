const express = require('express');
const process = require('process');
const path = require('path');
const Game = require('./lib/game');
const createRoom = require('./lib/createroom');
const bodyParser = require('body-parser');
const app = express();
const socket = require('socket.io');
const httpserve = require('http').Server(app);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.post('/createroom', function (req, res) {
  res.header("Content-Type", "application/json");
  var roomCode = createRoom(req.body.name);
  createSocketRoom(roomCode, req.body.name);
  emitPlayerAddedSocket(roomCode, 1);
  res.send({roomCode});
});
app.post('/joinroom', function(req, res) {
  let { name, code } = req.body;
  res.header("Content-Type", "application/json");
  let id = joinRoom(name, code);
  emitPlayerAddedSocket(code, id);
  res.send({playerId: id});
});
app.get('/', function (req, res) {
  res.header("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.use(express.static(path.join(__dirname, '../client/build')));
let port = process.env.PORT || 4000;
let server = httpserve.listen(port, ()=>{
	console.log('server started at ', port);
});
app.get('/getcards', (req, res) => {
  let { code, playerid } = req.query;
  // console.log(code, playerid);
  res.header("Content-Type", "application/json");
  let data = getPlayerCards(code, playerid);
  res.send({cards: data.cards, trump: data.trump, round: data.round, setRound: data.setRound });
})
app.get('/gamestatus', (req, res) => {
  let { code, playerid } = req.query;
  let { cards, lobbyCards, nextTurn } = getGameStatus(code, playerid);
  // console.log('printing refresh status',cards, lobbyCards, nextTurn);
  res.header('Content-Type', "application/json");
  res.send({ cards, lobbyCards, nextTurn});
})

//sockets
let socketio = socket(server, {'pingInterval': 60000 * 15});
let socketsList = [];
socketio.sockets.on('connection', (socket)=> {
  console.log('initializing sockets');
  socket.on('room', function(data) {
    console.log(data.code, 'from socket');
    socket.join(data.code); // need to join room other wise it wont be connected to same socket
    if (data.playerId === 1) {
      emitPlayerAddedSocket(data.code, 1); //emit players since the socket wont be connected before code generation in create mode
    }
  });
  socket.on('startgame', (code) => {
    startGame(code.code);
  });
  socket.on('placebet', (data) => {
    placeBet(data);
  });
  socket.on('submitlobbycard', (data) => {
    // console.log('received card', data);
    let cardData = putCardsInLobby(data);
    socketio.sockets.in(data.code).emit('lobbycards', {
      message: 'card placed is' + data.card + data.player,
      lobbyCards: cardData.cards,
      nextTurn: cardData.nextTurn
    })
  })
});
function emitGameStarted(code) {
  socketio.sockets.in(code).emit('gamestarted', {
    message: 'game started'
  });
}
function emitBetTable(data, code, round) {
  socketio.sockets.in(code).emit('betupdate', {
    playerBets: data,
    round: round
  });
}
function emitResetplayercards(code) {
  socketio.sockets.in(code).emit('resetplayercards', {
    message: 'resetting player cards'
  });
}
function emitScoreBoard(code, scores) {
  socketio.sockets.in(code).emit('emitscoreboard', {
    scores: scores
  });
}
function emitWinnerSocket(winner, code) {
  console.log('emitting winner socket');
  socketio.sockets.in(code).emit('roundwinner', {
    winner: winner
  })
}
function emitGameFinish(code, winner) {
  socketio.sockets.in(code).emit('gamefinish', {
    message: 'game over',
    winner
  })
}

function emitPlayerAddedSocket(code, id) {
  let gameSocket = socketsList.find((socket) => socket.code === code);
  socketio.sockets.in(code).emit('playerAdded', {
    players: gameSocket.game.players
  })
}
//end of sockets
function getGameSocket(code) {
  return socketsList.find((socket) => socket.code === code).game;
}
function createSocketRoom(code, name) {
  let game = new Game();
  game.code = code;
  socketsList.push({ code, game });
  joinRoom(name, code, true);
}
function joinRoom(name, code, isOrigin = false) {
  let gameSocket = getGameSocket(code);
  gameSocket.addPlayer(name);
  return gameSocket.players[gameSocket.players.length - 1].id;
}
function startGame(code) {
  // console.log(code);
  let gameSocket = getGameSocket(code);
  gameSocket.startGame();
  emitGameStarted(code);
}
function getPlayerCards(code, playerid) {
  let gameSocket = getGameSocket(code);
  return { cards: gameSocket.getPlayerCards(playerid), trump: gameSocket.getTrump(), round: (gameSocket.totalRounds - gameSocket.getRound()), setRound: gameSocket.totalRounds };
}

function placeBet(data) {
  let { code, bet, playerid, round } = data;
  let gameSocket = getGameSocket(code);
  gameSocket.addBet(playerid, bet, round);
  emitBetTable(gameSocket.getBetTable(), code, gameSocket.getRound());
}
function putCardsInLobby(data) {
  let { code, player, card } = data;
  let gameSocket = getGameSocket(code);
  gameSocket.addCardInLobby(card, player);
  let nextTurn = (Number(player) + 1)% (Number(gameSocket.players.length)+1);
  nextTurn = nextTurn === 0 ? 1 : nextTurn;
  gameSocket.nextTurn = nextTurn;
  // console.log(gameSocket.canShowWinner());
  if (gameSocket.canShowWinner()) { //checking for last insetion of card
    let winner = gameSocket.getRoundWinner();
    nextTurn = winner.id;
    gameSocket.nextTurn = nextTurn;
    emitWinnerSocket(winner, code);
    emitBetTable(gameSocket.getBetTable(), code, gameSocket.getRound());
    if (gameSocket.gameFinish) {
      winner = gameSocket.getGameWinner();
      emitGameFinish(code, winner);
    } else if (gameSocket.cardReset) {
      gameSocket.distributeCards();
      let scores = gameSocket.getScoreBoard();
      emitScoreBoard(code, scores);
      // console.log('came inside reset cards');
      emitResetplayercards(code);
    }
  }
  // console.log(nextTurn);
  return { cards: gameSocket.getLobbyCards(), nextTurn };
}

function getGameStatus(code, playerId) {
  let gameSocket = getGameSocket(code);
  let cards = gameSocket.getPlayerCards(playerId);
  let lobbyCards = gameSocket.getLobbyCards();
  let nextTurn = gameSocket.nextTurn || 1;
  return { cards, lobbyCards, nextTurn };
}
//App js should be present
