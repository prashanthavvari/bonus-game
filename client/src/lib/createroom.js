import React from 'react';
import { connect } from 'react-redux';
import Playerslist from './playerlist';
import RulesComponent from './rulescomponent';
class Createroom extends React.Component {
  constructor() {
    super();
    this.state = { name: '', code: ''};
  }
  handleTextChange(e) {
    this.setState({name : e.target.value});
  }
  async createRoom() {
    this.props.socket.on('connect', function(){
      console.log('connected socket');
    });
    let code = await fetch('/createroom',{
      method: 'POST',
      headers: {
          'Access-Control-Allow-Headers': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.state.name
        })
    });
    code = await code.json();
    console.log(code, 'initializing socket', this.props);
    this.props.socket.emit('room', {
      code: code.roomCode,
      playerId: 1
    });
    this.props.dispatch({
      type: 'roomcode',
      code: code.roomCode
    });
    this.props.dispatch({
      type: 'addPlayer',
      currentPlayerId: 1,
      isCreator: true
    });
    this.setState({code: code.roomCode});
    console.log(this.props.isCreator, this.props);
  }
  render() {
    let createRoomState = (<div className="top-45">
      <input className="green-input" type="text" placeholder="Name" name="name" onChange={(e) => this.handleTextChange(e)}/>
      <button className="green-back-button" onClick={()=> this.createRoom()}>Create Room</button>
      </div>);
    if (this.props.players.length !== 0) {
      createRoomState = <Playerslist startGame={this.props.startGame} canShowStartButton={this.props.canShowStartButton}/>;
    }
    let code = this.state.code ? <p>Use this code to invite: <span className="red">{this.state.code}</span></p>: '';
    return (
      <div className="App">
        <div className="create-room-class indigo">
          <RulesComponent/>
        </div>
        <div className="join-room-class indigo green">
          {createRoomState}
          {code}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => state;
export default connect(
  mapStateToProps
)(Createroom);