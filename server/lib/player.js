class Player {
  constructor(name, id) {
    this.id = id;
    this.cards = [];
    this.name = name;
    this.score = 0;
    this.currentCard = '';
    this.bets = [];
  }
  addCards(card) {
    this.cards.push(card);
  }
  setScore(score) {
    this.score+=score;
  }
  getPlayerName() {
    return this.name;
  }
  getCardsFromPlayer(){
    return this.cards;
  }
  addBet(bet, round, win = 0) {
    // console.log(bet, round, 'trying to what is the round');
    if(this.bets.length >= round) {
      this.bets[round] = { bet, win };
    } else {
    this.bets.push( { bet, win });
    }
  }
  getBet() {
    return this.bets;
  }
  updateBetWin(round) {
    this.bets[round].win+=1;
  }
  removeCard(cardKey) {
    let indexOfCard = this.cards.findIndex((card) => card.key === cardKey.key );
    this.cards.splice(indexOfCard, 1);
  }
  setCurrentCard(card) {
    this.currentCard = card;
  }
  getCurrentCard() {
    return this.currentCard;
  }
}
module.exports = Player;