import React  from 'react'
import Text  from '../utilis/Text.cjs'
import { Provider } from 'react-redux'
import { createStore } from 'redux';
import { appState, documentTree} from '../utilis/BrowserDb.cjs'
import { Reducer } from '../utilis/newReducer.cjs'
//import { First,Second }  from './components.jsx'
import { HTML } from './components.jsx'

let store = createStore(Reducer,appState);
const started = (props)=>{
	//let catNames = Object.keys(store.Categories);
	return (
		<Provider store={store}>
			<HTML {...documentTree} {...props} data={store.getState()} />
		</Provider>
		)
	/*
	return (
		<div id='react-container' className="wrapper">
			<First { ...store1(store)}/>
			<Second { ...store2(store)}/>
		</div> 
		)

	*/
}

export default started;
