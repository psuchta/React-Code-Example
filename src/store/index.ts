import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { promiseMiddleware } from 'redux-saga-promise-actions';

import rootReducer from './reducers';
import rootSaga from './sagas';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const middlewares = [promiseMiddleware, sagaMiddleware];

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));

export default store;

sagaMiddleware.run(rootSaga);
