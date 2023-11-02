import React  from 'react'
import  Text from '../utilis/Text.cjs'
import { Provider } from 'react-redux'
import { render }  from 'react-dom'
import { Reducer }  from '../utilis/newReducer.cjs';
import Action from '../utilis/aCreator.cjs'
import songLoader  from '../utilis/songLoader.js';
import {dbChooser, getLocalData, getRemoteData, fetcher, streamer, storageHandler, curry, loadFromLocalStorage, saveToLocalStorage, seq, safeOp, errorLogger } from '../utilis/BrowserDb.cjs';
import { App  } from '../views/components.jsx'
import { System } from '../utilis/constant.cjs'
import config from '../utilis/db.config.cjs';
import Custom from '../utilis/context.cjs';
import { store, fAccess } from '../utilis/store.js';
import { validator, note } from '../utilis/utilities.cjs'
import lazyGuider from '../utilis/guiderLazy.cjs';

window.mountNotifier = {};
window.onerror = (e)=>{
	console.error("window error",e);
}
console.error = errorLogger();

const dbLoader = dbChooser({name:'Test', safeOp, seq});
lazyGuider();

let localStorageData = loadFromLocalStorage(System.LOCALSTORAGE),
localData = getLocalData(dbLoader,store,Action),
streamManager = new streamer(fetcher,store,config.table),
Msteps,
MStepLoader;


Promise.all([localData]).then(()=>{
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
		if(state.onlineSongs[currentCat.id] || state.offlineSongs[currentCat.id]){
			store.dispatch(Action.setCurrentCat(currentCat.name, currentCat.id));	
		}
		if(currentSong.name){
			if(state[`${currentSong.location}Songs`][currentCat.id]){
				store.dispatch(Action.setCurrentSong(currentSong.id, currentCat.id, currentSong.location));
			}
		}
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
}).catch((e)=>{
	console.error("RACH",e.name, e.message, e.stack);
})

	if(window.innerWidth > 500){
		MStepLoader = lazyGuider();
	}
	else{
		MStepLoader = Promise.resolve(undefined);
	}

window.store = store;

Promise.all([localData,MStepLoader]).then((r)=>{
	let { data, db } = r[0],
	stepManager = r[1];
	Msteps = null; // stepManager;

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
		<Provider store={store}>
			<Custom.Provider value={pan}>
				<App  step={Msteps} fAccess={fAccess} streamManager={streamManager} {...Action} validator={validator} note={note} seq={seq} db={db} />
			</Custom.Provider>
		</Provider>,
		document.getElementById('react-container')
	)
}).catch((e)=>{
	console.error("localData catch Error: ",e.name, e.message, e.stack);
})