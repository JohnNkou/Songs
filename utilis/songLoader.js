import { addSongs } from './aCreator.cjs';

let totalReceived = 0;

function songLoader(cat,songNumber,store,local){
	let state = store.getState(),
	currentCat = cat,
	catId = state.Categories.indexOf(currentCat),
	rSongs = 0;
	return new Promise((resolve,reject)=>{
		let xml = new XMLHttpRequest();
		xml.open('GET',`songAdder.js?c=${cat}&l=${songNumber}`);
		xml.onload = ()=>{
			if(xml.status < 100){
				resolve({status:xml.status, error:'No internet connection', message: xml.response});
			}
			else if(xml.status >= 300){
				let txt = "A problem occured while trying to add Additionnal songs";
				alert(txt);
				alert(xml.status);
				resolve({success:false,status:xml.status,message:xml.response,data:store.getState().Categories});
			}
			else{
				let response = JSON.parse(xml.responseText);
				rSongs = response.songs;
				if(!response.full){
					totalReceived += response.songs.length;
					getNotInLocalStore(local,cat,rSongs).then((songs)=>{
						dispatchSong(store,cat,catId,songs,local);
					})
				}
				else{
					if(response.songs){
						getNotInLocalStore(local,cat,rSongs).then((songs)=>{
							store.dispatch(addSongs(songs,catId));
							resolve({success:true, data: store.getState()});
						})	
					}
					else
						resolve({success:true,data: store.getState()});
				}
			}
		}
		xml.onerror = (e)=>{
			resolve({success:false,status:0, error:e,data: xml.response });
		}
		xml.send();
	})
}

function getNotInLocalStore(local,cat,songs){
	cat = cat.toLowerCase();
	return local.then(({data,fastLookUp})=>{
		let catId = data.Categories.indexOf(cat);
		let storedSongs = data.offlineSongs[catId];
		let localSongs = fastLookUp[cat.toLowerCase()];
		if(catId == -1)
			throw Error("categorie not in Store");

		if(!storedSongs.length)
			return songs;

		return songs.filter((song)=>{
			let truth = !localSongs[song.name.toUpperCase()]; 
			return truth;
		})
	})
}

function dispatchSong(store,cat,catId,songs,local){
	store.dispatch(addSongs(songs,catId));
	console.log("New length", store.getState().onlineSongs[catId].length);
	songLoader(cat,totalReceived,store,local)
}

export default songLoader
