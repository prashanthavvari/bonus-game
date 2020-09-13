import React from 'react';
import { connect } from 'react-redux';
class BetComponent extends React.Component {
  constructor() {
    super();
    this.state = { bet: 0 };
  }
  componentDidMount() {
    this.props.socket.on('betupdate', (data) => {
      this.setState({playerBets: data.playerBets, round: data.round});
    })
  }
  render() {
    if (this.state.playerBets !== undefined && this.state.round !== undefined) {
      console.log(this.state.round, this.props.setRound, this.props);
      let rounds = [];
      let i = 0;
      while (i < this.props.setRound) {
        rounds.push(<th key={i}>'Round- ' {i}</th>);
        i+=1;
      }
    return (
        <div className="inline-block">
        <h4>Bets</h4>
          <table border='1'>
          <thead>
            <tr>
              <th>Players</th>
              {rounds}
            </tr>
            </thead>
            <tbody>
            {this.state.playerBets.map((player, i)=>
              <tr key={i}>
              <td key={player.id}>{player.name}</td>
              {player.bets.map((bet, i) =>
                <td key={bet+i}>{bet.bet}/{bet.win}</td>
              )}
              </tr>
            )}
            </tbody>
          </table>
        </div>
      )
    } else {
      return '';
    }
  }
}

const mapStateToProps = (state) => state;
export default connect(
  mapStateToProps
)(BetComponent);