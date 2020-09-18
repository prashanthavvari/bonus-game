import socketio from 'socket.io-client';
const socket = socketio.connect('/');
const initialState = {
  socket,
  code: '1',
  players: [],
  currentPlayer: 0,
  isCreator: false,
  currentRound: 0,
  nextTurn: 1,
  cards: [],
  betPlaced: false,
  setRound: 5,
  lobbyCards: [],
  trump: '',
  roundwinner: ''
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'roomcode':
    return {
      ...state,
      ...{
        code: action.code
      }
    }
    case 'playersList':
    return {
      ...state,
      ...{
        players: action.players
      }
    };
    case 'addPlayer':
    return {
      ...state,
      ...{
        currentPlayer: action.currentPlayerId,
        isCreator: action.isCreator
      }
    }
    case 'addCards':
    return {
      ...state,
      ...{
        cards: action.cards,
        trump: action.trump? action.trump : state.trump
      }
    }
    case 'lobbycards':
    return {
      ...state,
      ...{
        lobbyCards: action.lobbyCards,
        nextTurn: action.nextTurn
      }
    }
    case 'addRoundwinner':
    return {
      ...state,
      ...{
        winner: action.winner
      }
    }
    case 'updateround':
    return {
      ...state,
      ...{
        currentRound: action.round,
        setRound: action.setRound
      }
    }
    case 'betPlaced':
      return {
        ...state,
        ...{
          isBetPlaced: action.isBetPlaced
        }
      }
      case 'refreshgame':
      return {
        ...state,
        ...{
          cards: action.cards,
          nextTurn: action.nextTurn,
          lobbyCards: action.lobbyCards
        }
      }
    default:
    return state;
  }
}