import React, { Component } from 'react';
import './App.css';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Gamecomponent from './gamecomponent';
import reducers from './redux/reducers';
const store = createStore(reducers);
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Gamecomponent/>
      </Provider>
    )
  }
}
/*commnet*/
export default App;
