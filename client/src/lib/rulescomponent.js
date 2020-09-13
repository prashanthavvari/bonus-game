import React from 'react';
function RulesComponent() {
  return(
  <ul className="rules">Rules:
    <li>1) You need atlease 3 players to start the game.</li>
    <li>2) Only the room creator can start the game.</li>
    <li>3) Once you start the game, cards will be distributed among the others.</li>
    <li>4) You need to place your bets first for each round.</li>
    <li>5) You can't edit the bets once placed.</li>
    <li>6) After everyone placed their bets, you can start card selection to put it in lobby</li>
    <li>7) You can't take back the card from lobby, so choose carefully.</li>
    <li>8) The round will be finished when you utilized all of your cards. So you have to place the bet again.</li>
    <li>9) The bet table at the bottom indicates the placed bets vs wins</li>
    <li>10) Scores will be calculated based on your bet/win ratio.</li>
    <li>11) Player will be awarded 1 point for each win along with additional 10 points if bet/win matches.</li>
    <li>12) The maximum idle time is set to 1 minute</li>
    <li>13) <b>Important:</b> You will be disconnected from the game if you reload after joining.</li>
  </ul>);
}
export default RulesComponent;