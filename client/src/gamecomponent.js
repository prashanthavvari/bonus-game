import React, { Component } from 'react';
import { connect } from 'react-redux';
import Createroom from './lib/createroom';
import Boardcomponent from './lib/boardcomponent';
import Joinroom from './lib/joinroom';

class Gamecomponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: '',
      canShowStartButton: false
    }
    this.startGame = this.startGame.bind(this);
  }
  componentDidMount() {
    console.log(this.props, 'top');
    //whenever a new player added to the lobby
    this.props.socket.on('playerAdded', (data) => {
      console.log(data.players, 'printing player added');
      this.props.dispatch({
        type: 'playersList',
        players: data.players
      })
      if (this.props.players.length >= 2 && this.props.isCreator && this.state.canShowStartButton !== true) {
        this.setState({canShowStartButton: true});
      }
    });

    //at the start of the game
    this.props.socket.on('gamestarted', (data) => {
      console.log(data.message);
      this.getPlayerCards();
    });
    //whenever a card is added to the lobby
    this.props.socket.on('lobbycards', (data) => {
      this.props.dispatch ({
        type: 'lobbycards',
        lobbyCards: data.lobbyCards,
        nextTurn: data.nextTurn
      })
    });

    //new game emitWinnerSocket
    this.props.socket.on('roundwinner', (data) => {
      console.log(data);
      this.props.dispatch({
        type: 'addRoundwinner',
        winner: data.winner
      });
      document.getElementById('round-winner').innerHTML = 'Previous round winner: '+ data.winner.name;
    });
    //reset cards after a round
    this.props.socket.on('resetplayercards', (data)=> {
      console.log('getting player cards');
      this.getPlayerCards();
    });

    //display gameover
    this.props.socket.on('gamefinish', (data) => {
      this.setState({gameOver: true, winner: data.winner});
    })
  }
  showCreaeteRoom() {
    this.setState({ createRoom: true });
  }
  showJoinRoom(){
    this.setState({ joinRoom: true });
  }
  startGame() {
    this.props.socket.emit('startgame', {
      code: this.props.code
    });
    this.setState({canShowStartButton: false});
  }
  async getPlayerCards() {
    let data = await fetch(`/getcards?code=${this.props.code}&playerid=${this.props.currentPlayer}`);
    data = await data.json();
    this.props.dispatch({
      type: 'addCards',
      cards: data.cards,
      trump: data.trump
    });
    this.props.dispatch({
      type: 'updateround',
      round: data.round,
      setRound: data.setRound
    });
    this.props.dispatch({
      type: 'betPlaced',
      isBetPlaced: false
    })
  }
  render() {
    if(this.state.gameOver) {
      let flowers = [];
      let i = 1;
      while (i !== 10) {
        flowers.push(<div className="flower"><img src="/ribbon.png" alt="ribbon"/></div>);
        i+=1;
      }
      return (
        <div className="App">
          <div className="winner">
            <div className="winner-text">
              <h3>Game Over!</h3>
              <h2> Winner </h2>
              {this.state.winner.name}
            </div>
            {flowers}
          </div>
        </div>);
    }
    if (this.props.cards.length !== 0 || this.props.lobbyCards.length !== 0 || this.props.trump !== '') {
      return <Boardcomponent/>;
    }
    if (this.state.createRoom) {
      return <Createroom startGame={this.startGame} canShowStartButton={this.state.canShowStartButton}/>;
    } else if(this.state.joinRoom) {
      return <Joinroom startGame={this.startGame} canShowStartButton={this.state.canShowStartButton}/>;
    } else if (this.state.player === '') {
      return(
        <div className="App">
          <div className="create-room-class">
            <button className="create-button" onClick={()=> this.showCreaeteRoom()}>Create Game</button>
          </div>
          <div className="join-room-class">
            <button className="join-button" onClick={()=> this.showJoinRoom()}>Join Game</button>
          </div>
        </div>
      )
    }
  }
}
const mapStateToProps = (state) => state;
export default connect(
  mapStateToProps
)(Gamecomponent);