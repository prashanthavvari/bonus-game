import React from 'react';
import { connect } from 'react-redux';
import BetComponent from './betcomponent';
import ScoreBoardComponent from './scoreboard';
import Lobbycards from './lobbycards';
import Playerslist from './playerlist';
class Boardcomponent extends React.Component {
  constructor() {
    super();
    this.state = { bet: 0 };
  }
  handleTextChange(e) {
    this.setState({bet : e.target.value });
  }
  async submitBet() {
    if (Number(this.state.bet) > (5 - Number(this.props.currentRound)) || String(this.state).length > 1 || isNaN(this.state.bet)) {
      alert('invalid bet chosse less than' + (5 - Number(this.props.currentRound)));
    } else if(Number(this.state.bet) < 0) {
      alert('Please choose a bet > 0');
    } else {
      this.props.dispatch({
        type: 'betPlaced',
        isBetPlaced: true
      })
      this.props.socket.emit('placebet', {
        bet: this.state.bet,
        code: this.props.code,
        round: this.props.currentRound,
        playerid: this.props.currentPlayer
      });
    }
  }
  async joinRoom() {
    this.props.socket.on('connect', function(){
      console.log('connected socket');
    })
    this.props.socket.emit('room', {
      code: this.state.code
    })
    let message = await fetch('/joinroom',{
      method: 'POST',
      headers: {
          'Access-Control-Allow-Headers': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.state.name,
          code: this.state.code
        })
    });
    let response = await message.json();
    this.props.dispatch({
      type: 'roomcode',
      code: this.state.code
    })
    this.props.dispatch({
      type: 'addPlayer',
      currentPlayerId: response.playerId,
      isCreator: false
    });
  }
  showCard(cardKey) {
    let cardsLeft = this.props.cards.filter((card) => card.key !== cardKey.key);
    this.props.socket.emit('submitlobbycard', {
      card: cardKey,
      code: this.props.code,
      player: this.props.currentPlayer
    });
    this.props.dispatch({
      type: 'addCards',
      cards: cardsLeft
    })
  }
  render() {
    let cards = '';
    let canDisableCards = this.props.currentPlayer !== this.props.nextTurn;
    if (this.props.cards.length !== 0) {
        cards = (<div className='inline-block middle-align'>{this.props.cards.map((card, i) => <button disabled={canDisableCards} key={i} onClick={()=> this.showCard(card)}><img alt={card.value} src={'/cards/' + card.key + '.svg'}/></button>)}</div>)
    }
    let lobby = '';
    if (this.props.lobbyCards && this.props.lobbyCards.length !== 0) {
      lobby = <Lobbycards/>
    }
  return (
      <div className="App">
        <Playerslist />
        <p className="trum-card-position">TrumpCard<br/><img src={ '/cards/' + this.props.trump.key + '.svg'} alt={this.props.trump.value}/><br/><i id="round-winner"></i></p>
        <div className="game-section">
          <div className="cards-section">
            {cards}
            <div className="place-bet-box">
              <input className="red-input" type="text" placeholder="declare your bet" onChange={(e)=> this.handleTextChange(e)}/>
              <button className="red-back-button" disabled={this.props.isBetPlaced} onClick={()=>this.submitBet()}>Place Bet</button>
            </div>
          </div>
        </div>
        {lobby}
        <div className="scores">
          <BetComponent/>
          <ScoreBoardComponent/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => state;
export default connect(
  mapStateToProps
)(Boardcomponent);