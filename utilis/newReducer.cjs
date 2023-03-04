const { C } = require('./constant.cjs');
const { is } = require('./BrowserDb.cjs');


function isUndefined(s){
	return s == null || s == undefined;
}
function rSong(state,action){
	let { type, id, name, verses } = action;
	switch(action.type){
		case C.ADD_SONG:
			return {id,name:name.toUpperCase(), verses};
		case C.UPDATE_SONG:
			if(state.id != action.id)
				return state;
			return {id,name:name.toUpperCase(),verses};
		default:
			return state;
	}
}

function rSongs(states, action){
	switch(action.type){

		case C.ADD_SONG:
			states.push(rSong({},action));
			return states;

		case C.ADD_SONGS:
			states = states.concat(action.songs);
			
			return states;

		case C.UPDATE_SONG:
			return states.map((song)=> rSong(song,action));

		default:
			return states;
	}
}

function rCat(state,action){
	if(action.type != C.ADD_CATEGORIE)
		return state;
	else{
		let {type,name} = action;
		return {name,songs:[]};
	}
}

function rCats(states,action){
	let { type, id, name, oldName, newName } = action,
	index = 0;

	if(name){
		index = states.indexOf(name);
	}
	else if(id){
		if(!states[id])
			return states;
	}

	switch(type){
		case C.ADD_CATEGORIE:
			if(states.indexOf(name) != -1)
				return states;
			return [...states,name.toLowerCase()];

		case C.REMOVE_CATEGORIE:
			if(isUndefined(id))
				return states;
			states.splice(id,1);

			return [...states];

		case C.UPDATE_CAT:
			if(isUndefined(id))
				return states;

			states[id] = newName;

			return [...states];

		default:
			return states;
	}
}

const SRed = (states,action,location='online')=>{
	let { type, catId, id, name, verses, songs } = action,
	aLocation = action.location, storedSongs = states[`${location}Songs`],
	songsCat = (catId != undefined)? storedSongs[catId]: storedSongs[states.Categories.indexOf(name)],
	currentCat = states.Categories[catId];

	if(aLocation && aLocation != location)
		return storedSongs;

	if(!currentCat && type != C.ADD_CATEGORIE)
		return storedSongs;
	switch(type){
		case C.ADD_SONG:
			if(!songsCat)
				return storedSongs;

			storedSongs[catId] = rSongs(songsCat,action);
			return {...storedSongs };

		case C.ADD_SONGS:
			if(!songsCat)
				return storedSongs;

			storedSongs[catId] = rSongs(songsCat,action);
			return {...storedSongs};
		case C.REMOVE_SONG:
			if(!songsCat || !songsCat[id])
				return storedSongs;

			songsCat.splice(id,1);

			return {...storedSongs};

		case C.UPDATE_SONGS:
			let songToUpdate = songsCat[id];
			if(!songsCat || !songToUpdate)
				return storedSongs;

			songToUpdate.name = name;
			songToUpdate.verses = verses;

			return { ...storedSongs };

		case C.ADD_CATEGORIE:

			storedSongs[catId] = [];

			return {...storedSongs};

		case C.REMOVE_CATEGORIE:
			let Exist = storedSongs[id];

			if(Exist){
				delete storedSongs[id];
				return {...storedSongs};
			}
			else
				return storedSongs;

		case C.SET_LOCAL_CAT:
			if(location == 'offline')
				states.offlineSongs = songs;
		default:
			return storedSongs;
	}
}

const CRed = (states,action,location='offline')=>{
	switch(action.type){
		case C.ADD_CATEGORIE:
		case C.REMOVE_CATEGORIE:
		case C.UPDATE_CAT:
			return rCats(states,action);

		case C.SET_LOCAL_CAT:
			if(location == 'online' || isUndefined(action.cat))
				return states

			return action.cat

		case C.CLEAR_ONLINE_CAT:
			if(location == 'offline' || isUndefined(action.name) || !states[action.name])
				return states;

			states[action.name] = {songs:[]};
			return states;


		default:
			return states;
	}
}

function curCat(states,action){
	let { type, name, id, oldName }  = action;

	switch(type){
		case C.SET_CURRENT_CAT:
			let catName = states.Categories[id];
			if(!catName)
				return states.currentCat;
			else{
				return { name:catName, id };
			}
		case C.UPDATE_CAT:
			let currentCat = states.currentCat;
			let currentCatName = currentCat.name;
			let isCurrentCat = currentCatName == oldName;

			if(isCurrentCat)
				return { name: newName, id: currentCat.id}

			return states.currentCat; 

		default:
			return states.currentCat;
	}

}

function curSong(states,action){
	let { type, name, catId, location, id } = action, 
	storeSongs = (location == 'online')? states.onlineSongs : states.offlineSongs, 
	catSongs = storeSongs[catId], 
	song = catSongs && catSongs[id];

	if(type != C.SET_CURRENT_SONG || !catSongs || !song)
		return states.currentSong;

	return { ...song, id, location };
}

function uiR(states,action){
	switch(action.type){
		case C.CATLIST_VIEW:
			if(isUndefined(action.view))
				return states;
			return {
				...states,
				show:{
					...states.show,
					catList: action.view
				}
			}

		case C.FAVLIST_VIEW:
			if(isUndefined(action.view))
				return states;

			return {
				...states,
				show:{
					...states.show,
					favList: action.view
				}
			}

		case C.STREAMLIST_VIEW:
			if(isUndefined(action.view))
				return states;

			return {
				...states,
				show:{
					...states.show,
					streamList: action.view
				}
			}
		case C.SETTINGLIST_VIEW:
			if(isUndefined(action.view))
				return states;

			return {
				...states,
				show:{
					...states.show,
					settingList: action.view
				}
			}

		case C.CREATESTREAM_VIEW:
			if(isUndefined(action.view))
				return states;

			return {
				...states,
				show:{
					...states.show,
					createStreamDiv: action.view
				}
			}
		case C.CHANGE_DEVTOOL_VIEW:
			if(isUndefined(action.newView))
				return states;
			return {
				...states,
				show:{
					...states.show,
					devTool: action.newView
				}
			}

		case C.CHANGE_INDEX:
		case C.SET_CURRENT_SONG:
			if(!(/^\d+$/.test(action.index)))
				return states;
			return {
				...states,
				navigation:{
					...states.navigation,
					verseIndex: action.index
				}
			}

		case C.CHANGE_RESULT_VIEW:
			if(isUndefined(action.view))
				return states;

			return {
				...states,
				show:{
					...states.show,
					resultList: action.view
				}
			}

		case C.CHANGE_ADD_CAT_VIEW:
			if(isUndefined(action.view))
				return states;

			return {
				...states,
				show:{
					...states.show,
					addCatDiv: action.view
				}
			}

		case C.CHANGE_VERSEDIV_NUMBER:
			if(!(/^\d+$/.test(action.number)))
				return states;

			return {
				...states,
				addSongDiv:{
					verses: action.number
				}
			}

		case C.CHANGE_NIGHTMODE:
		
			return {
				...states,
				nightMode: !!action.mode
			}

		case C.CHANGE_ADD_SONG_VIEW:
			if(isUndefined(action.view))
				return states;

			return {
				...states,
				show:{
					...states.show,
					addSongDiv: action.view
				}
			}

		case C.CHANGE_DIRECTION:
			return {
				...states,
				direction: action.direction
			}

		case C.UPDATE_SONG_LIST:
			if(!(/^\d+$/.test(action.to)))
				return states;
			return {
				...states,
				navigation:{
					...states.navigation,
					to: action.to
				}
			}

		default:
			return states;
	}
}

function subR(state,action){
	if(action.type != C.SUBSCRIBE_TO_STREAM)
		return state;

	return !!action.state
}

function keyR(state,action){
	if(action.type != C.SET_CONTROLS)
		return state;

	state.alt = !!action.control;
	return state;
}

function updateFR(states,action){
	if(action.type != C.SET_FORCEUPDATE || isUndefined(states[action.node]))
		return states;
	states[action.node] = action.value;
	return states;
}

function languageR(state,action){
	if(action.type != C.CHANGE_LANGUAGE || !(/^[a-z]+$/i.test(action.lang)))
		return state;

	return action.lang

}

function favR(states,action){
	let { songName, type, location, catName, catId, songId, favorites } = action;
	switch(type){
		case C.ADD_TO_FAVORITE:
			if(!catName || !songName || !location)
				return states;

			if(!states[catName])
				states[catName] = {};
			
			states[catName][songName] = {location,catId, songId }
			return { ...states };

		case C.REMOVE_FROM_FAVORITE:
			if(!catName || !states[catName])
				return states;
			else{
				if(!songName){
					delete states[catName];
				}
				else if(states[catName][songName]){
					delete states[catName][songName];
				}
			}

			return { ...states };

		case C.INITIALIZE_FAVORITE:
			return favorites;
			
		default:
			return states;
	}
}

function searchR(states,action){
	let { type, songName } = action;
	
	if(type != C.SEARCH_SONG)
		return states.searchResult;

	if(!songName){
		console.error("searchR error: action doesn't have a songName",action);
		return [];
	}
	let result = [],
	Reg = new RegExp(`.*${action.songName}.*`,"i"),
	length = 0,
	songs;

	states.Categories.forEach((catName,catId)=>{
		songs = states.onlineSongs[catId];
		length = songs.length;
		for(let i=0; i < length; i++){
			let song = songs[i];
			if(Reg.test(song.name)){
				result.push({catName,catId,...song, songId:i, name:song.name.toLowerCase(), location:'online'});
			}
		}

		songs = states.offlineSongs[catId];
		length = songs.length;

		for(let i=0; i < length; i++){
			let song = songs[i];
			if(Reg.test(song.name)){
				result.push({catName,catId,...song, songId:i, name:song.name.toLowerCase(), location:'offline'});
			}
		}

	});

	return result;
}

function selectorR(states,action){
	if(action.type != C.SET_SELECTOR || !action.selector || isUndefined(action.value) || isUndefined(states[action.selector]))
		return states;

	states[action.selector] = action.value;
	return states;
}

function songIncR(state,action){
	if(action.type != C.SET_INCREMENT || !(/^\d+$/.test(action.inc)))
		return state;

	return action.inc
}

function isStreamingR(state,action){
	switch(action.type){
		case C.START_STREAM:
			return true;
		case C.STOP_STREAM:
			return false;

		default:
			return state;
	}
}

function appReachR(state,action){
	switch(action.type){
		case C.APP_REACHABLE:
			return true;
		case C.APP_UNREACHABLE:
			return false;
		default:
			return state;
	}
}
const Reducer = (states,action)=>{

	return {
		Categories: CRed(states.Categories,action),
		onlineSongs: SRed(states,action,'online'),
		offlineSongs: SRed(states,action,'offline'),
		currentCat: curCat(states,action),
		currentSong: curSong(states,action),
		ui: uiR(states.ui,action),
		images: states.images,
		subscribedToStream: subR(states.subscribedToStream,action),
		keys: keyR(states.keys,action),
		updateForced: updateFR(states.updateForced,action),
		language: languageR(states.language,action),
		favorites: favR(states.favorites,action),
		searchResult: searchR(states,action),
		selector: selectorR(states.selector,action),
		songIncrement: songIncR(states.songIncrement,action),
		isStreaming: isStreamingR(states.isStreaming,action),
		appReachable: appReachR(states.appReachable,action),
	}
}

exports.Reducer = Reducer; 