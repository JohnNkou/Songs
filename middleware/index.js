import { fetcher } from '../utilis/BrowserDb.cjs';
import { C } from '../utilis/constant.cjs'
import { setAppReachable } from '../utilis/aCreator.cjs';

const subConstant = {
	[C.SET_CURRENT_CAT]: 	true,
	[C.SET_CURRENT_SONG]: 	true,
	[C.CHANGE_LANGUAGE]: 	true,
	[C.CHANGE_NIGHTMODE]: 	true,
	[C.REMOVE_SONG]:		true,
	[C.REMOVE_CATEGORIE]:	true,
	[C.ADD_TO_FAVORITE]: 	true,
	[C.REMOVE_FROM_FAVORITE]: 	true
}

const fastAccessAction = (
	function(){

		function addS(action,fastAccess,state){
			let { catId, location, type } = action,
			catName,
			cat,
			categorie,
			length = state.Categories.length;

			for(let i=0; i < length; i++){
				if(state.Categories[i].id == catId){
					categorie = state.Categories[i];
					break;
				}
			}


			if(!categorie){
				return null;
			}

			catName = categorie.name;

			if(!fastAccess[catName])
				fastAccess[catName] = {online:{},offline:{}, id:catId};

			cat = fastAccess[catName][location];

			state[`${location}Songs`][catId].forEach((song,i)=>{
				let songName = song.name.toUpperCase();
				if(!cat[songName]){
					cat[songName] = i;
				}
			})
		}
		function upS(action,fastAccess,state){
			let { catId,id,location,name } = action,
			oldName = action.oldName.toUpperCase(),
			catName = state.currentCat.name,
			old;

			if(!catName){
				console.error('no categorie name',catName,'not found');
				return;
			}

			old = fastAccess[catName][location][oldName];

			delete fastAccess[catName][location][oldName];
			fastAccess[catName][location][name] = old;
		}
		function rmS(action,fastAccess,state){
			let { id,catId,name,location } = action,
			catName = state.currentCat.name,
			songName = name;

			delete fastAccess[catName][location][name];

		}
		function addC(action,fastAccess,state){
			let { name, catId } = action;

			fastAccess[name] = {online:{},offline:{}, id:catId};
		}
		function rmC(action,fastAccess,state){
			let { name, id } = action;

			delete fastAccess[name];
		}
		function upC(action,fastAccess,state){
			let { oldName,newName } = action,
			old = fastAccess[oldName];

			delete fastAccess[oldName];
			fastAccess[newName] = old;
		}

		return {
			[C.ADD_SONG]: 			addS,
			[C.ADD_SONGS]: 			addS,
			[C.UPDATE_SONG]: 		upS,
			[C.REMOVE_SONG]: 		rmS,
			[C.ADD_CATEGORIE]: 		addC,
			[C.REMOVE_CATEGORIE]: 	rmC,
			[C.UPDATE_CAT]: 		upC
		}
	}
)()

export function ManageFastAccess(fastAccess,{getState,dispatch}){
	return next => action =>{
		next(action);

		let fAction = fastAccessAction[action.type];

		if(fAction){
			fAction(action,fastAccess,getState());
		}
	}
}

export function checkReachability({getState,dispatch}){
	return next => action =>{
		if(!getState().appReachable || action.type != C.APP_UNREACHABLE)
			return next(action);

		let counter = setInterval(()=>{
			fetcher({
				url:'/connect',
				s:(response)=>{
					dispatch(setAppReachable());
					clearInterval(counter);
				},
				e:({status,error})=>{
					if(status)
						console.error("createStoreMiddlware got an error",status,error);
					else
						console.log("createStoreMiddlware. Still not connected");
				}
			})
		},4000)
		next(action);
	}
}

function pickElementFromStore(store){
	return JSON.stringify({
		nightMode: 		store.ui.nightMode,
		language: 		store.language,
		currentCat: 	store.currentCat,
		currentSong: 	store.currentSong,
		favorites: 		store.favorites
	})
}

export function timeAction(f,{getState,dispatch}){
	return next => action =>{
		var now = Date.now(), elapsedTime = 0;
		next(action);
		elapsedTime = Date.now() - now;
		f(elapsedTime,action);
	}
}

function timeThis(f){
	var lastNow = Date.now(), elapsedTime = 0;

	f();
	elapsedTime = Date.now() - lastNow;


	alert(f.name + " Take "+elapsedTime+" To complete ");
}

export function saveUiInfo(save,{getState,dispatch}){
	return next => action =>{
		next(action);
		if(subConstant[action.type]){
			setTimeout(function(){
				let dataJSON = pickElementFromStore(getState());
				save(dataJSON);
			},1)
		}
	}
}

export function myThunk({getState,dispatch}){
	return next => action =>{
		try{
			if(typeof action == typeof eval){
				console.log("We have a action here");
				 return action(dispatch);
			}
			else
				next(action);
		}
		catch(e){
			console.log("Odd action",action,e);
		}
	}
}

export function logAction({getState,dispatch}){
	return next => action =>{
		next(action);
	}
}