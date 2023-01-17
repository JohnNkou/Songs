import React  from 'react'
import  Text from '../utilis/Text.cjs'
import { render }  from 'react-dom'
import { Provider }  from 'react-redux'
import { createStore, applyMiddleware }  from 'redux'
import { Reducer }  from '../utilis/newReducer.cjs';
import Action from '../utilis/aCreator.cjs'
import songLoader  from '../utilis/songLoader.js';
import {appState, dbChooser, getLocalData, getRemoteData, getStoreData, fetcher, streamer, storageHandler, curry, loadFromLocalStorage, saveToLocalStorage } from '../utilis/BrowserDb.cjs';
import { App  } from '../views/components.jsx'
import { stepManager } from '../utilis/guider.js'
import { System } from '../utilis/constant.cjs'
import { saveUiInfo, checkReachability, timeAction, logAction, myThunk, ManageFastAccess } from '../middleware/index.js'


window.mountNotifier = {};
window.onerror = (e)=>{
	console.error("window error",e);
}

let localStorageData = loadFromLocalStorage(System.LOCALSTORAGE);
let save = curry(saveToLocalStorage)(System.LOCALSTORAGE);
let saveUiInfoCurried = curry(saveUiInfo)(save);
let timeWithFunction = curry(timeAction)((x,action)=>{
	if(x > 1000)
		alert(`action ${action.type} taked ${x} ms to pass`);

})

let serverData =  getStoreData(appState);
let storeData = serverData;
let fAccess = {};
let ManageFastAccessCurried = curry(ManageFastAccess)(fAccess);

let store = createStore(Reducer,storeData,applyMiddleware(myThunk,ManageFastAccessCurried,timeWithFunction,checkReachability,saveUiInfoCurried,logAction));

let localData = getLocalData(dbChooser,store,Action);

let fastAccess = getRemoteData(store,songLoader,localData);
fastAccess.then(()=>{
	console.log("Okay fastAccess");
}).Oups((e)=>{
	console.error("fastAccess catch Error",e);
})

let Msteps;
let streamManager = new streamer(fetcher,store);

Promise.all([localData,fastAccess]).then(()=>{
	let state = store.getState(),
	categories = state.Categories,
	{ favorites, nightMode, currentCat, currentSong } = localStorageData,
	index = null,
	catSongs,
	catName,
	songName,
	song;

	if(nightMode != undefined)
		store.dispatch(Action.changeNightMode(nightMode));
	if(currentCat &&  (index = categories.indexOf(currentCat.name)) != -1){
		store.dispatch(Action.setCurrentCat(currentCat.name, index));
		store.dispatch(Action.setCurrentSong(currentSong.id, index, currentSong.location, currentSong.index));
	}
	if(favorites){
		for(catName in favorites){
			if(categories.indexOf(catName) != -1){
				catSongs = favorites[catName];
				for(songName in catSongs){
					song = catSongs[songName];
					store.dispatch(Action.addToFavorite(catName,song.catId, songName, song.songId, song.location));
				}
			}
		}
	}
})

	if(window.innerWidth > 500)
		Msteps = stepManager(store,Text);

window.store = store;

localData.then(({data})=>{

	setTimeout(()=>{
		let local = storageHandler().getItems(JSON.parse, System.LOCALSTORAGE, 'stream');

		let cLocalStorage = local[System.cLocalStorage];
		let stream = local['stream'];

		if(cLocalStorage && cLocalStorage.favorites)
			store.dispatch(Action.initializeFavorite(cLocalStorage.favorites));

		if(stream){
			if(Date.now() - stream.time < 120000){	
				let { startStreamFromLocal, startStream } = Action,
				streamName = stream.name;

				store.dispatch(startStreamFromLocal(streamName,fetcher)).then((r)=>{
					if(r){
						store.dispatch(startStream());
						streamManager.setName(streamName)
					}
					else
						localStorage.removeItem('stream');
				})
			}
			else
				localStorage.removeItem('stream');
		}

	},15);


	render(
		<Provider store={store}>
			<App lang={data.language} direction={data.ui.direction} step={Msteps} fAccess={fAccess} fastAccess={fastAccess} streamManager={streamManager} />
		</Provider>,
		document.getElementById('react-container')
		)
}).Oups((e)=>{
	console.error("localData catch Error: ",e);
})
