import React  from 'react'
import Text  from '../utilis/Text.cjs'
import { Provider } from 'react-redux'
import { createStore } from 'redux';
import { appState } from '../utilis/constant.cjs'
import { documentTree } from '../utilis/bData.cjs'
import { Reducer } from '../utilis/newReducer.cjs'
//import { First,Second }  from './components.jsx'
import { HTML } from './components.jsx'
import Custom from '../utilis/context.cjs';
import  store from '../utilis/serverStore.cjs';

const pan = { Text, store },
started = (props)=>{
	//let catNames = Object.keys(store.Categories);
	return (
		<Custom.Provider value={pan}>
			<HTML {...documentTree} {...props} data={store.getState()} />
		</Custom.Provider>
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
