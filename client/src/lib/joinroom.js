import React from 'react';
import { connect } from 'react-redux';
import Playerslist from './playerlist';
import RulesComponent from './rulescomponent';

class Joinroom extends React.Component {
  constructor() {
    super();
    this.state = { name: ''};
  }
  handleTextChange(e, key) {
    this.setState({[key] : e.target.value});
  }
  async joinRoom() {
    this.setState({ disableJoin: true });
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
    })
  }
  render() {
    let joinRoomState = (<div>
      <input className="red-input" placeholder="Name" type="text" name="name" onChange={(e) => this.handleTextChange(e, 'name')}/>
      <input className="input-text red-input" type="text" name="Code" placeholder="code" onChange={(e) => this.handleTextChange(e, 'code')}/>
      <button className="red-back-button" disabled={this.state.disableJoin} onClick={()=> this.joinRoom()}>Join Room</button>
      </div>);
    if (this.props.players.length !== 0) {
      joinRoomState = <Playerslist startGame = {this.props.startGame} canShowStartButton={this.props.canShowStartButton}/>;
    }
  return (
      <div className="App">
        <div className="create-room-class orange">
          <RulesComponent/>
        </div>
        <div className="join-room-class indigo red">
          {joinRoomState}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => state;
export default connect(
  mapStateToProps
)(Joinroom);