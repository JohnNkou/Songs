const { createStore }  =  require('redux'),
{ Reducer} = require('./newReducer.cjs'),
{ appState } = require('./constant.cjs');

const store = createStore(Reducer, appState);

module.exports = store;