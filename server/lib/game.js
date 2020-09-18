const Player = require('./player');
const Cards = require('./cards');

class Game {
  constructor(code) {
    this.code = code;
    this.players = [];
    this.totalRounds = 5; //total rounds for the game
    this.currentSetRounds = 5; // max no.rounds in a set, should decrease once currentRound goes to 0
    this.currentRound = 5; // max no.of cards, should decrease after each round evaluation
    this.trumpcard = '';
    this.lobbyCards = [];
    this.roundWinner;
    this.cardReset = false;
  }
  addPlayer(name) {
    let id = this.players.length + 1;
    let player = new Player(name, id);
    this.players.push(player);
  }
  distributeCards() {
    this.cardReset = false;
    let cardsObj = new Cards();
    let cards = cardsObj.getCardSets();
    cards = cardsObj.shuffleCards(cards);
    this.trumpcard = cards[0];
    let n = 0;
    let i = 1;
    while (n < this.currentSetRounds) {
      this.players.forEach((player, index) => {
        player.addCards(cards[i+index]);
      });
      n+=1;
      i=i+this.players.length
    }
    this.cardsLeft = this.currentSetRounds;
    this.initializeScoreBoard();
  }
  getRound() {
    return this.currentSetRounds;
  }
  getTrump() {
    return this.trumpcard;
  }
  getPlayerCards(id) {
    let player = this.players.find((player) => String(player.id) === String(id));
    return player.getCardsFromPlayer();
  }
  addBet(playerId, bet, round) {
    // console.log('adding bet for the round', round);
    let player = this.players.find((player)=> String(player.id) === String(playerId));
    player.addBet(bet, round);
  }
  getBetTable() {
    let table = [];
    this.players.forEach((player) => {
      // console.log(player.bets);
      table.push({id: player.id, name: player.name, bets: player.bets });
    });
    return table;
  }
  addCardInLobby(card, playerId) {
    if (this.shouldResetLobbyCards) {
      this.shouldResetLobbyCards = false;
      this.lobbyCards = [];
    }
    let player = this.players.find((player) => player.id === playerId);
    player.removeCard(card);
    this.lobbyCards.push({card, playerId, playerName: this.getPlayerName(playerId)});
    if (this.lobbyCards.length === this.players.length) {
      this.evaluateRound();
    }
  }
  getLobbyCards() {
    return this.lobbyCards;
  }
  getPlayerName(playerId) {
    return this.players.find((player) => player.id === playerId).name;
  }
  initializeScoreBoard() {
    let i = this.totalRounds - this.currentRound;
    while(i < this.currentSetRounds) {
      this.players.forEach((player) => {
        // console.log(this.totalRounds - (this.currentRound - i), 'printing value');
        player.addBet(0, (this.totalRounds - (this.currentRound - i)));
      });
      i+=1;
    }
  }
  startGame() {
    this.distributeCards();
  }
  evaluateRound() {
    let maxSoFar = this.lobbyCards[0];
    let cards = new Cards();
    let isTrumpPresent = false;
    // console.log('printing max before', maxSoFar.card.key);
    this.lobbyCards.forEach((item) => {
      let isTrump = cards.isAMatch(this.trumpcard.key, item.card.key);
      if (isTrump) {
        isTrumpPresent = true;
        if (cards.isAMatch(this.trumpcard.key, maxSoFar.card.key)) {
          if (cards.aLessThanB(maxSoFar.card.key, item.card.key)) {
            maxSoFar = item;
          }
        } else {
          maxSoFar = item;
        }
      } else if (!isTrumpPresent && cards.isAMatch(maxSoFar.card.key, item.card.key) && cards.aLessThanB(maxSoFar.card.key, item.card.key)) {
        maxSoFar = item;
      }
      // console.log('printing max each time', maxSoFar.card.key);
    });
    let winner = this.players.find((player) => player.id === maxSoFar.playerId);
    winner.updateBetWin(this.totalRounds - this.currentSetRounds);
    this.roundWinner = winner;
    // console.log(winner);
    this.currentRound -=1;
    if (this.currentRound === 0) { //when all players put their cards in lobby
      this.cardReset = true;
      this.currentSetRounds-=1;
      this.currentRound = this.currentSetRounds;
      this.calculateScores();
    }
    if (this.currentSetRounds === 0) { // when there no cards in hand
      this.gameFinish = true;
      //game finish
    }
    this.shouldResetLobbyCards = true;
  }
  calculateScores() {
    this.players.forEach((player, i) => {
      let score = 0;
      for (var j = 0; j < (this.totalRounds - this.currentSetRounds); j ++) {
        let betObj = player.bets[j];
        // console.log('betobj', betObj);
        if (Number(betObj.win) === Number(betObj.bet)) {
          score = score + 10 + Number(betObj.bet);
        } else {
          score = score + Number(betObj.win);
        }
      }
      player.score = score;
      // console.log('pl', player);
    });
  }
  getScoreBoard() {
    let scores = this.players.map((player) => { return { playerId: player.id, name: player.name, score: player.score} });
    // console.log(scores);
    return scores;

  }
  canShowWinner() {
    return this.roundWinner !== undefined;
  }
  getRoundWinner() {
    let winner = this.roundWinner;
    this.roundWinner = undefined;
    return winner;
  }
  getGameWinner() {
    let scoreBoard = this.getScoreBoard();
    let winner = scoreBoard.reduce((prev, cur) => {
      if (prev.score > cur.score) {
        return prev;
      }
      return cur;
    });
    return winner;
  }
}
module.exports = Game;