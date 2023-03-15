import React  from 'react'
import  Text from '../utilis/Text.cjs'
import { render }  from 'react-dom'
import { Provider }  from 'react-redux'
import { createStore, applyMiddleware }  from 'redux'
import { Reducer }  from '../utilis/newReducer.cjs';
import Action from '../utilis/aCreator.cjs'
import songLoader  from '../utilis/songLoader.js';
import {appState, dbChooser, getLocalData, getRemoteData, fetcher, streamer, storageHandler, curry, loadFromLocalStorage, saveToLocalStorage } from '../utilis/BrowserDb.cjs';
import { App  } from '../views/components.jsx'
import { stepManager } from '../utilis/guider.js'
import { System } from '../utilis/constant.cjs'
import { saveUiInfo, checkReachability, timeAction, logAction, myThunk, ManageFastAccess } from '../middleware/index.js';
import config from '../utilis/db.config.cjs';
import Custom from '../utilis/context.cjs';
import { store, fAccess } from '../utilis/store.js';

window.mountNotifier = {};
window.onerror = (e)=>{
	console.error("window error",e);
}

let localStorageData = loadFromLocalStorage(System.LOCALSTORAGE),
localData = getLocalData(dbChooser,store,Action),
fastAccess = getRemoteData(store,songLoader,localData),
streamManager = new streamer(fetcher,store,config.table),
Msteps;

fastAccess.then(()=>{
	console.log("Okay fastAccess");
}).Oups((e)=>{
	console.error("fastAccess catch Error",e);
})

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
	if(currentCat){
		store.dispatch(Action.setCurrentCat(currentCat.name, currentCat.id));
		store.dispatch(Action.setCurrentSong(currentSong.id, currentCat.id, currentSong.location));
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

	categories.forEach((cat)=>{
		let catName = cat.name,
		catId = cat.id,
		onlineSongs = state.onlineSongs[catId],
		offlineSongs = state.offlineSongs[catId];

		fAccess[catName] = { online:{}, offline:{}, id:catId };

		if(onlineSongs && onlineSongs.length){
			onlineSongs.forEach((song,i)=>{
				fAccess[catName].online[song.name.toUpperCase()] = i;
			})
		}
		if(offlineSongs && offlineSongs.length){
			offlineSongs.forEach((song,i)=>{
				fAccess[catName].offline[song.name.toUpperCase()] = i;
			})
		}
	})
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

	let pan = { store, Text };
	render(
		<Custom.Provider value={pan}>
			<App  step={Msteps} fAccess={fAccess} fastAccess={fastAccess} streamManager={streamManager} {...Action} />
		</Custom.Provider>,
		document.getElementById('react-container')
		)
}).Oups((e)=>{
	console.error("localData catch Error: ",e);
})
