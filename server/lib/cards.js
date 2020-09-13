const cardColors = ['Spade', 'Club', 'Heart', 'Diamond'];
const cardSet = { 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: 'J', 12: 'Q', 13: 'K', 14: 'A'};
const cardSetRev = {'A': '14', 'K': '13', 'Q': '12', 'J': '11'};
class Cards {
  getCardSetBasedOnColorAndType(type, smallSet) {
    if (smallSet) {
      return this.createSet(type).slice(0,6);
    }
    return this.createSet(type).slice(6,);
  }
  aLessThanB(a, b) {
    if (a.length === b.length) {
      if (a.length === 2) {
        return Number(a[1]) < Number(b[1]);
      }
      return Number(a[1]+a[2]) < Number (b[1] + b[2])
    } else if (a.length < b.length) {
      return true;
    }
    return false;
  }
  isAMatch(a, b) {
    return a[0] === b[0];
    // if (a[0] === b[0]) {
    //   if (this.smallSet(a[1]) && this.smallSet(b[1])) {
    //     return true;
    //   } else {
    //     return this.bigSet(a[1]) && this.bigSet(b[1]);
    //   }
    // }
    // return false;
  }
  shuffleCards(cards, n=2) {
    while( n!==0 ) {
      for (var i = 51; i >=0 ; i--) {
        let rand = Math.floor(Math.random() * i);
        [cards[i], cards[rand]] = [cards[rand], cards[i]];
      }
      n-=1;
    }
    return cards;
  }
  createSet(type){
    let set = [];
    Object.keys(cardSet).forEach((card) => {
      let key = type[0]+card;
      let value = cardSet[card].concat(type);
      set.push({ key, value });
    });
    return set;
  }
  getCardSets() {
    let sets = []
    cardColors.forEach((type) =>{
      sets.push(this.createSet(type));
    });
    sets = sets.reduce((arr, arr1) => arr.concat(arr1));
    return sets;
  }
  checkCardExistance(cardArray, cardToRelate) {
    let match = cardArray.some((card) => {
      return this.isAMatch(card.key, cardToRelate);
    });
    return match !== null || match !== undefined;
  }
  checkIfCardIsPresent(cardsArray, type, cardName) {
    let card = cardSetRev[cardName] || cardName;
    let cardKey = `${type[0]}${card}`;
    // console.log(cardName, cardSetRev[cardName], 'before');
    let matchedCard = cardsArray.find((card) => (card.key).toString() === cardKey);
    // console.log('problem in matched card method', matchedCard, cardKey, cardsArray);
    return matchedCard !== undefined && matchedCard.length !== 0;
  }
  getFilteredCards(cardsArray, type, cardName) {
    let card = cardSetRev[cardName] || cardName;
    let cardKey = `${type[0]}${card}`;
    let filteredCards = cardsArray.filter((card) => (card.key).toString() !== cardKey);
    return filteredCards;
  }
  getCardObjFromType(type, cardName) {
    let card = cardSetRev[cardName] || cardName;
    let cardKey = `${type[0]}${card}`;
    let cardValue = `${cardName}${type}`;
    return {key: cardKey, value: cardValue};
  }
}
module.exports = Cards;