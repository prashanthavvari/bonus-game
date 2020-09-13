import React from 'react';
import { connect } from 'react-redux';

class Playerlist extends React.Component {
  componentDidMount(){
    //whenever a new player added to the lobby
    this.props.socket.on('playerAdded', (data) => {
      console.log(data.players, 'printing player added');
      this.props.dispatch({
        type: 'playersList',
        players: data.players
      })
      if (this.props.players.length >= 3 && this.props.isCreator && this.props.canShowStartButton !== true) {
        this.setState({canShowStartButton: true});
      }
    });
    console.log('next turn', this.props.nextTurn);
  }
  render() {
    if (this.props.players && this.props.players.length !== 0) {
      let startButton = this.props.canShowStartButton ? <button className="start-button" onClick={()=>this.props.startGame()}>Start Game</button> : '';
      return (
        <div className="sidebar">
          <ul>
            <li className="list-of-players">Players in Room<br/><span className="turn-help-text">The orange background indicates next player turn</span></li>
            {this.props.players.map((player, i) => <li className={ player.id === this.props.nextTurn ? 'orange-bg' : ''} key={i}>{ player.id === this.props.currentPlayer ? 'You' : player.name}</li>)}
            {startButton}
          </ul>
        </div>
      )
    } else {
      return <p>Players List</p>
    }
  }
}

const mapStateToProps = (state) => state;
export default connect(
  mapStateToProps
)(Playerlist);