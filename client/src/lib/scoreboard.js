import React from 'react';
import { connect } from 'react-redux';
class ScoreBoardComponent extends React.Component {
  constructor() {
    super();
    this.state = { bet: 0 };
  }
  componentDidMount() {
    this.props.socket.on('emitscoreboard', (data) => {
      this.setState({scores: data.scores});
    })
  }
  render() {
    if (this.state.scores!== undefined) {
      // console.log(this.state.scores);
    return (
        <div className="inline-block d-block">
        <h4>Scores</h4>
          <table border='1'>
          <thead>
            <tr>
              <th>Players</th>
              <th>Scores</th>
            </tr>
            </thead>
            <tbody>
            {this.state.scores.map((player, i)=>
              <tr key={i}>
                <td key={player.id}>{player.name}</td>
                <td key={i}>{player.score}</td>
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
)(ScoreBoardComponent);