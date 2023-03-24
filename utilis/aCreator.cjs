const { C } = require('./constant.cjs');

exports.setLocalCategorie = (cat,songs)=>({
	type: C.SET_LOCAL_CAT,
	cat,
	songs
})
exports.clearOnlineCat = (name)=>({
	type: C.CLEAR_ONLINE_CAT,
	name
})
exports.addSong = (id,name,catId,verses,location='offline')=>({
	type: C.ADD_SONG,
	id,
	name,
	catId,
	verses,
	location
})
exports.addSongs = (songs,catId,location='online')=>({
	type: C.ADD_SONGS,
	songs,
	catId,
	location
})
exports.removeSong = (id,catId,name,location='online')=>({
	type: C.REMOVE_SONG,
	id,
	catId,
	name,
	location
})
exports.startStreamFromLocal = (name,fetcher)=>{
	return ()=> new Promise((resolve,reject)=>{
		fetcher({
			url:`/stream?name=${name}&action=checkExist`,
			s:(response)=>{
				resolve(true);
			},
			e:(error)=>{
				resolve(false);
			}
		})
	})
}
exports.updateSong = (id,catId,name,verses,location='offline',oldName)=>({
	type: C.UPDATE_SONG,
	id,
	catId,
	name,
	verses,
	location,
	oldName
})
exports.addCategorie = (name,catId,location='offline')=>({
	type: C.ADD_CATEGORIE,
	name,
	catId,
	location
})
exports.removeCategorie = (name,id,location='offline')=>({
	type: C.REMOVE_CATEGORIE,
	name,
	id,
	location
})
exports.updateCategorie = (oldName,newName,id,location='offline')=>({
	type: C.UPDATE_CAT,
	oldName,
	newName,
	id,
	location
})
exports.setCurrentCat = (name,id)=>({
	type: C.SET_CURRENT_CAT,
	name,
	id
})
exports.setCurrentSong = (id,catId,location='online',index=0,commandFrom='internal')=>({
	type: C.SET_CURRENT_SONG,
	catId,
	id,
	location,
	index,
	commandFrom
})
exports.changeCatListView = (view)=>({
	type: C.CATLIST_VIEW,
	view
})
exports.changeFavListView = (view)=>({
	type: C.FAVLIST_VIEW,
	view
})
exports.changeStreamListView = (view)=>({
	type: C.STREAMLIST_VIEW,
	view
})
exports.changeSettingListView = (view)=>({
	type: C.SETTINGLIST_VIEW,
	view
})
exports.changeStreamCreateView = (view)=>({
	type: C.CREATESTREAM_VIEW,
	view
})
exports.changeIndex = (index)=>({
	type: C.CHANGE_INDEX,
	index
})
exports.addToFavorite = (catName,catId,songName,songId,location='offline')=>({
	type: C.ADD_TO_FAVORITE,
	catName,
	songName,
	location,
	catId,
	songId
})
exports.removeFromFavorite = (catName,catId,songName,songId)=>({
	type: C.REMOVE_FROM_FAVORITE,
	catName,
	songName,
	catId,
	songId
})
exports.initializeFavorite = (favorites)=>({
	type: C.INITIALIZE_FAVORITE,
	favorites
})
exports.changeDirection = (direction)=>({
	type: C.CHANGE_DIRECTION,
	direction
})
exports.updateSongList = (to)=>({
	type: C.UPDATE_SONG_LIST,
	to
})
exports.searchSong = (songName)=>({
	type: C.SEARCH_SONG,
	songName
})
exports.changeResultListView = (view)=>({
	type: C.CHANGE_RESULT_VIEW,
	view
})
exports.changeCatView= (view)=>({
	type: C.CHANGE_ADD_CAT_VIEW,
	view
})
exports.changeAddSongView = (view)=>({
	type: C.CHANGE_ADD_SONG_VIEW,
	view
})
exports.changeVerseDivNumber = (number)=>({
	type: C.CHANGE_VERSEDIV_NUMBER,
	number
})
exports.setControl = (control)=>({
	type: C.SET_CONTROLS,
	control
})
exports.changeLanguage = (lang)=>({
	type: C.CHANGE_LANGUAGE,
	lang
})
exports.changeNightMode = (mode)=>({
	type: C.CHANGE_NIGHTMODE,
	mode
})
exports.changeDevToolView = (newView)=>({
	type: C.CHANGE_DEVTOOL_VIEW,
	newView
})
exports.setMessage = (message)=>({
	type: C.SET_MESSAGE,
	message
})
exports.changeSongIncrement = (inc)=>({
	type: C.SET_INCREMENT,
	inc
})
exports.setForceUpdate = ({ node,value })=>({
	type: C.SET_FORCEUPDATE,
	node,
	value
})
exports.setSelector = ({selector,value})=>({
	type: C.SET_SELECTOR,
	selector,
	value
})
exports.subscribeToStream = (state)=>({
	type: C.SUBSCRIBE_TO_STREAM,
	state
})
exports.startStream = ()=>({
	type: C.START_STREAM
})
exports.stopStream = ()=>({
	type: C.STOP_STREAM
})
exports.setAppReachable = ()=>({
	type: C.APP_REACHABLE
})
exports.setAppUnreachable = ()=>({
	type: C.APP_UNREACHABLE
})