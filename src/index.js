import './index.html';
import './style.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { AppContainer } from 'react-hot-loader';
import App from './containers/index';
import reducer from './reducers';
import initialState from './initial_state';

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
