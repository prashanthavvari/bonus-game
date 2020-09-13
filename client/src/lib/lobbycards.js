import React from 'react';
import { connect } from 'react-redux';

class Lobbycards extends React.Component {
  constructor() {
    super();
    this.state = { bet: 0};
  }

  render() {
  return (
    <div className="inline-block lobby">
    <div className="red p-10">Cards in Lobby</div>
    {this.props.lobbyCards.map((item, i) =>
      <div className="lobby-cards" key={i}>
        <p>
          {item.playerName}:
          <img src={'/cards/' + item.card.key + '.svg'} alt={item.card.value}/>
        </p>
        </div>
      )}
    </div>)
  }
}

const mapStateToProps = (state) => state;
export default connect(
  mapStateToProps
)(Lobbycards);