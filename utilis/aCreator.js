const { C } = require('./constant');

exports.addSong = (id,name,cat,Verses)=>({
	type: C.ADD_SONG,
	id,
	name,
	cat,
	Verses
})
exports.addSongs = (songs,cat)=>({
	type: C.ADD_SONGS,
	songs,
	cat
})
exports.removeSong = (cat,name)=>({
	type: C.REMOVE_SONG,
	cat,
	name
})
exports.updateSong = (cat,id,name,Verses)=>({
	type: C.UPDATE_SONG,
	id,
	cat,
	name,
	Verses
})
exports.addCategorie = (name)=>({
	type: C.ADD_CATEGORIE,
	name
})
exports.removeCategorie = (name)=>({
	type: C.REMOVE_CATEGORIE,
	name
})
exports.updateCategorie = (oldName,name)=>({
	type: C.UPDATE_CAT,
	oldName,
	name
})
exports.setCurrentCat = (name)=>({
	type: C.SET_CURRENT_CAT,
	name
})
exports.setCurrentSong = (name,index=0)=>({
	type: C.SET_CURRENT_SONG,
	name,
	index
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
exports.changeStreamCreateView = (view)=>({
	type: C.CREATESTREAM_VIEW,
	view
})
exports.changeIndex = (index)=>({
	type: C.CHANGE_INDEX,
	index
})
exports.addToFavorite = (catName,songName,Verses)=>({
	type: C.ADD_TO_FAVORITE,
	catName,
	songName,
	Verses
})
exports.removeFromFavorite = (catName,songName)=>({
	type: C.REMOVE_FROM_FAVORITE,
	catName,
	songName
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
exports.setMessage = (message)=>({
	type: C.SET_MESSAGE,
	message
})