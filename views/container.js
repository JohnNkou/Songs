import { connect }  from 'react-redux'
import { First, Second }  from './components.jsx'
import * as Action  from '../utilis/aCreator.js'
import { store1, store2, Action1, Action2 } from '../utilis/BrowserDb.cjs'

export const CCatList = connect((state)=>{
	return {
		...store1(state)
	}
	/*let catNames = Object.keys(state.Categories);
	if(!state.currentCat.name || !state.Categories[state.currentCat.name])
		state.currentCat = {name:catNames[0],songs:state.Categories[catNames[0]].songs};
	return { 
		catNames,
		songs:state.Categories[state.currentCat.name].songs,
		currentSong: state.currentSong,
		currentCat: state.currentCat,
		searchResult:state.searchResult,
		catListView:state.ui.show.catList,
		createStreamView: state.ui.show.createStreamDiv,
		resultView: state.ui.show.resultList,
		direction: state.ui.direction,
		to: state.ui.navigation.to,
		addCatView: state.ui.show.addCatDiv,
		addSongView: state.ui.show.addSongDiv,
		VerseIndex: state.ui.navigation.VerseIndex,
		createStreamView: state.ui.show.createStreamDiv,
		message: state.message,
		language:state.language,
		nightMode: state.ui.nightMode,
		catDivText:state.Text.catDiv,
		songListText:state.Text.songList,
		addCatDivText:state.Text.addCatDiv,
		addSongDivText:state.Text.addSongDiv,
		createStreamText: state.Text.createStreamDiv,
		VersesDiv: state.ui.addSongDiv.Verses,
		controls: state.keys.alt 
	} */
},{/*changeStreamCreateView:Action.changeStreamCreateView,updateCategorie:Action.updateCategorie,setControl:Action.setControl,addSong:Action.addSong,removeSong:Action.removeSong,updateSong:Action.updateSong,changeVerseDivNumber:Action.changeVerseDivNumber,changeAddSongView:Action.changeAddSongView,setMessage:Action.setMessage,addCategorie:Action.addCategorie,removeCategorie:Action.removeCategorie,changeCatView:Action.changeCatView,searchSong:Action.searchSong,updateSongList:Action.updateSongList,changeIndex:Action.changeIndex,setCurrentSong: Action.setCurrentSong,setCurrentCat:Action.setCurrentCat,changeResultListView:Action.changeResultListView, changeCatListView:Action.changeCatListView */ ...Action1(Action)})(First)

export const CSongList = connect((state)=>{
	return { ...store2(state)};
	/*let song = state.Categories[state.currentCat.name].songs.filter((song)=> song.name == state.currentSong.name).pop() || {name:"",Verses:[{Text:"Found Nothing"}]};
	let countFav = 0;
	for(var catName in state.favorites){
		for(var songName in state.favorites[catName])
			countFav++;
	}
	return {
	song,
	favListView:state.ui.show.favList,
	streamListView: state.ui.show.streamList,
	VerseIndex: state.ui.navigation.VerseIndex,
	currentCat:state.currentCat,
	favorites: state.favorites,
	language: state.language,
	nightMode: state.ui.nightMode,
	direction: state.ui.direction,
	isFavorite: (state.favorites[state.currentCat] && state.favorites[state.currentCat][song.name] && true ) || false,
	countFav
	} */
},{ ...Action2(Action)/*changeStreamCreateView:Action.changeStreamCreateView,changeLanguage:Action.changeLanguage,changeNightMode:Action.changeNightMode,changeDirection:Action.changeDirection,removeFromFavorite:Action.removeFromFavorite,setCurrentSong: Action.setCurrentSong,setCurrentCat:Action.setCurrentCat,addToFavorite:Action.addToFavorite,changeIndex:Action.changeIndex,changeFavListView:Action.changeFavListView, changeStreamListView:Action.changeStreamListView,changeResultListView:Action.changeResultListView, changeCatListView:Action.changeCatListView */})(Second)