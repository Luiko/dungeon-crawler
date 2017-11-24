import './index.html';
import './style.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { AppContainer } from 'react-hot-loader';
import App from './containers/index';
import reducer from './reducers';
import maps from './lib/maps';
import weapons from './weapons';

const initialState = {
  hero: maps[0].getHero(),
  dungeon: 1,
  whiteSpaces: maps[0].getEmptySpaces(),
  cave: maps[0].getCave(),
  weapon: {
    point: maps[0].getWeapon(),
    name: weapons[0],
    index: 0
  },
  attack: 10,
  health: {
    quantity: 100,
    point: maps[0].getHealth()
  },
  enemies: maps[0].getEnemies().map((point, index) => ({
    id: 'enemy#' + index + 1,
    health: 40 * 1 + 10 * Math.ceil(Math.random() * 3),
    point
  })),
  experience: {
    level: 1,
    levelup: 80,
    current: 0
  },
  game_over: false
};

const store = createStore(
  reducer, initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function render(Component) {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component/>
      </Provider>
    </AppContainer>,
    document.getElementById('App')
  );
} 

render(App);

if (module.hot) {
  module.hot.accept('./containers/index', () => {
    render(App);
  });
}
