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


export default function Index(props){
	let pan = { Text, store },
	state;

	if(props.store){
		pan.store = props.store;
		state = props.store.getState();

	}
	return (
		<Custom.Provider value={pan}>
			<HTML {...documentTree} {...props} data={store.getState()}>
				{(state && state.currentSong.name && state.currentCat.name)? <script type='text/javascript' dangerouslySetInnerHTML={{__html:`
					window.appState = ${JSON.stringify(state)}
				`}}></script> : null}
			</HTML>
		</Custom.Provider>
		)
}
