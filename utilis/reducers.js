import { C }  from './constant.cjs';

const rSong = (state,action)=>{
	let {type,id,name,Verses} = action;
	switch(type){
		case C.ADD_SONG:
			return {name:name.toUpperCase(),Verses};
		case C.UPDATE_SONG:
			if(state.id != action.id)
				return state;
			return {id,name,Verses}
		case C.SET_CURRENT_SONG:
			return (state.name == action.name)? true:false;
		default:
			return state
	}
}

const rSongs = (states,action)=>{
	switch(action.type){
		case C.ADD_SONG:
			return [...states,rSong({},action)]
		case C.ADD_SONGS:
			return [...states,...action.songs];
		case C.REMOVE_SONG:
			return states.filter((state)=> state.name != action.name)
		case C.UPDATE_SONG:
			return states.map((state,i)=> rSong({id:i,...state},action));
		case C.SET_CURRENT_SONG:
			let id;
			let filtered = states.filter((state,i)=> {
				let r = rSong(state,action);
				if(r)
					id = i;
				return r;
			}).pop();
			
			if(!filtered)
				return action.oldCurrent;
			return {id,...filtered,location:action.location};

		default:
			return states
	}
}

const rCat = (state,action)=>{
	let {type,name} = action;

	switch(type){
		case C.ADD_CATEGORIE:
			let newC = {};
			return {name,songs:[]}
		case C.SET_CURRENT_CAT:
			return name
		default:
			return state
	}
}

const rCats = (states,action)=>{
	switch(action.type){
		case C.ADD_CATEGORIE:
			if(states[action.name])
				return states;
			
			let newCat = rCat({},action)
			states[newCat.name.toLowerCase()] = {songs:newCat.songs}
			return {...states }
		case C.REMOVE_CATEGORIE:
			if(states[action.name]){
				delete states[action.name]
				return {...states}
			}
			return states
		case C.UPDATE_CAT:
			let Exist = states[action.oldName];
			if(Exist){
				delete states[action.oldName]
				states[action.name] = Exist;
				return states;
			}
			return states;
		case C.SET_CURRENT_CAT:
			return rCat({},action);
		default:
			return states
	}
}

export const Reducer = (states,action)=>{
	console.log("action",action);
	alert(action.type);
	switch(action.type){
		case C.ADD_SONG:
		case C.ADD_SONGS:
		case C.REMOVE_SONG:
		case C.UPDATE_SONG:
		let chosenCategorie = states[(action.location == 'online')? 'Categories':'localCategories'][action.cat]
			if(!chosenCategorie)
				return states
			else{
				let currentCat = chosenCategorie;
				currentCat.songs = rSongs(currentCat.songs,action)
				return {...states};
			}
		case C.ADD_CATEGORIE:
		case C.REMOVE_CATEGORIE:
			return {
				...states,
				Categories:rCats(states.Categories,action),
				localCategories:rCats(states.localCategories,action)
			}
		case C.SET_CURRENT_CAT:
			let currentCat = states.Categories[action.name] || states.localCategories[action.name];
			if(!currentCat)
				return states;
			states.currentCat = {name:action.name,songs:currentCat.songs};
			return {...states}
		case C.SET_CURRENT_SONG:
			states.ui.navigation.VerseIndex = action.index;
			if(!action.name)
				return {...states, currentSong:{name:"",Verses:[]}};

			states['currentSong'] = rSongs(states[(action.location == 'online')? 'Categories':'localCategories'][states.currentCat.name].songs,action);
			return { ...states }
		case C.CATLIST_VIEW:
			states.ui.show.catList = action.view
			return {...states}
		case C.FAVLIST_VIEW:
			states.ui.show.favList = action.view
			return {...states}
		case C.STREAMLIST_VIEW:
			states.ui.show.streamList = action.view
			return {...states}
		case C.CREATESTREAM_VIEW:
			states.ui.show.createStreamDiv = action.view
			return {...states};
		case C.CHANGE_INDEX:
			states.ui.navigation.VerseIndex = action.index;
			return {...states}
		case C.ADD_TO_FAVORITE:
			states.favorites[action.catName] = states.favorites[action.catName] || {}
			states.favorites[action.catName][action.songName] = {Verses:action.Verses,location:action.location}
			return {...states}
		case C.REMOVE_FROM_FAVORITE:
			if(!states.favorites[action.catName] || !states.favorites[action.catName][action.songName]){
				return states
			}
			delete states.favorites[action.catName][action.songName];
			return {...states}
		case C.UPDATE_CAT:
			let newC = rCats(states.Categories,action);
			states.Categories = newC;
			return {...states};
		case C.CHANGE_DIRECTION:
			states.ui.direction = action.direction;
			return {...states};
		case C.UPDATE_SONG_LIST:
			states.ui.navigation.to = action.to;
			return {...states}
		case C.SEARCH_SONG:
			let result = [];
			let Reg = new RegExp(`.*${action.songName}.*`,"i");
			for(var catName in states.Categories){
				let filtered = states.Categories[catName].songs.filter((song)=> Reg.test(song.name)).map((song)=>({ catName,...song,name:song.name.toLowerCase()}));
				let filtered2 = states.localCategories[catName].songs.filter((song)=> Reg.test(song.name)).map((song)=>({ catName,...song,name:song.name.toLowerCase(), location:'offline'}));
				result = result.concat(filtered,filtered2);
			}
			states.searchResult = result;
			return {...states};
		case C.CHANGE_RESULT_VIEW:
			states.ui.show.resultList = action.view
			return {...states}
		case C.CHANGE_ADD_CAT_VIEW:
			states.ui.show.addCatDiv = action.view
			return {...states}
		case C.CHANGE_ADD_SONG_VIEW:
			states.ui.show.addSongDiv = action.view
			return {...states}
		case C.CHANGE_VERSEDIV_NUMBER:
			states.ui.addSongDiv.Verses = action.number
			return {...states}
		case C.SET_CONTROLS:
			states.keys.alt = action.control
			return {...states}
		case C.CHANGE_LANGUAGE:
			if(["en","fr"].indexOf(action.lang.toLowerCase()) == -1)
				return states;
			else{
				states.language = action.lang;
				return {...states};
			}
		case C.CHANGE_NIGHTMODE:
			states.ui.nightMode = action.mode;
			return {...states};
		case C.SET_MESSAGE:
			states.message = action.message;
			return {...states}
		case C.SET_INCREMENT:
			if(Number.isInteger(action.inc)){
				states.songIncrement = action.inc;
				return { ...states };
			}
			else
				return states;
		case C.SET_FORCEUPDATE:
			states.updateForced[action.node] = action.value;
			return {...states}
		case C.SET_SELECTOR:
			states.selector[action.selector] = action.value;
			return {...states};
		case C.SET_LOCAL_CAT:
			states.localCategories = action.cat;
			return {...states};
		case C.CLEAR_ONLINE_CAT:
			states.Categories[action.name] = {songs:[]};
			return {...states};
		case C.SUBSCRIBE_TO_STREAM:
			if(action.state != undefined){
				states.subscribedToStream = action.state;
				return {...states};
			}
			return states;
		case C.START_STREAM:
			states.isStreaming = true;
			return { ...states };
		case C.STOP_STREAM:
			states.isStreaming = false;
			return { ... states };

		case C.APP_REACHABLE:
			states.appReachable = true;
			return {...states};
		case C.APP_UNREACHABLE:
			states.appReachable  = false;
			return {...states}
		default:
			console.log("Action type",action.type,"matched nothing",C);
			return states
	}
}
