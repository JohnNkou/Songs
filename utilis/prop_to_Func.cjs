const OnlineSongs = ({ subscribeToStream, onlineSongs, setCurrentSong, changeIndex, setMessage, controls, changeAddSongView, removeSong, addSong, location, images, updateForced, lang, currentCat, to,increment, updateSongList})=>({
	 subscribeToStream,
	 songs: onlineSongs,
	 setCurrentSong,
	 changeIndex,
	 setMessage,
	 controls,
	 changeAddSongView,
	 removeSong,
	 addSong,
	 updateForced,
	 setCurrentSong,
	 lang,
	 songLength: onlineSongs.length,
	 currentCat,
	 to,
	 increment,
	 updateSongList,
	 location:'online',
	 downloadImage:images.download
})

const OfflineSongs = ({ offlineSongs, updateForced, controls, to, lang, currentCat, setCurrentSong, removeSong, addSong, setMessage, changeIndex, changeAddSongView, subscribedToStream, subscribeToStream, downloadImage,increment, updateSongList})=>({
	 songs: offlineSongs,
	 updateForced,
	 setCurrentSong,
	 lang,
	 controls,
	 to,
	 increment,
	 updateSongList,
	 currentCat,
	 location:'offline',
	 setCurrentSong,
	 removeSong,
	 addSong,
	 setMessage,
	 changeIndex,
	 changeAddSongView,
	 subscribedToStream,
	 subscribeToStream,
	 downloadImage
})

const CatNames = ({updateForced,images, changeIndex, lang, setMessage, updateCategorie, removeCategorie, controls, updateSongList, changeCatView, catNames, setCurrentCat, catListView})=>({
	 changeIndex,
	 lang,
	 setMessage,
	 wipe: removeCategorie,
	 controls,
	 updateSongList,
	 changeCatView,
	 catNames,
	 setCurrentCat,
	 view:catListView,
	 image: images.download,
	 updateForced: updateForced.catNames
})

const Notification = ({direction,nightMode})=>{
	let night = (nightMode && 'night') || '';
	return {
	 parent:'first',
	 direction: (direction && direction == "Right")? "il TRR "+night:"il TLL "+night
	}
}

const AddCatDiv = ({ forceUpdate, lang, updateCategorie, controls, currentCat, updateSongList, catNames, setMessage, addCategorie, changeCatView})=>({
	 forceUpdate,
	 lang,
	 updateCategorie,
	 controls: (currentCat.name)? controls:false,
	 current: currentCat,
	 updateSongList,
	 catNames,
	 addCategorie,
	 changeCatView
})

const AddSongDiv = ({ forceUpdate, lang, setCurrentSong, updateSong, controls, currentSong, VersesDiv, changeVerseDivNumber, currentCat, changeAddSongView, addSong, setMessage})=>({
	 forceUpdate,
	 location: currentSong.location,
	 lang,
	 setCurrentSong,
	 updateSong,
	 controls: (currentSong.name)? controls: false,
	 current: currentSong,
	 VersesDiv,
	 changeVerseDiv: changeVerseDivNumber,
	 currentCatName: currentCat.name,
	 catId: currentCat.id,
	 changeAddSongView,
	 addSong,
	 setMessage
})

const CreateStream = ({ isStreaming, appReachable, setAppUnreachable, subscribedToStream, lang, VerseIndex, currentCat, currentSong, changeStreamCreateView})=>({
	 appReachable,
	 setAppUnreachable,
	 subscribedToStream,
	 lang,
	 isStreaming,
	 index: VerseIndex,
	 catName: currentCat.name,
	 songName: currentSong.name,
	 changeView: changeStreamCreateView,
})

const Input = ({ changeResultListView, resultView, searchSong})=>({
	 changeResultListView,
	 view: resultView,
	 searchSong
})

const SongList = ({ List, report, includeAdder, downloadImage, updateForced, setCurrentSong, lang, currentCat})=>({
	 List,
	 report,
	 includeAdder,
	 downloadImage,
	 updateForced,
	 setCurrentSong,
	 lang,
	 currentCat
})

const StreamCreation = ({images, changeStreamCreateView, lang, appReachable})=>({
	images: images.streamCreate,
	changeStreamCreateView,
	lang,
	appReachable,
})

const StreamList = ({ streamListView, appReachable, setAppUnreachable, addCategorie, addSong, setCurrentCat, setCurrentSong, lang, subscribeToStream, images, online, changeStreamListView })=>({
 view: streamListView,
 lang,
 image: images.streamList,
 appReachable,
 setAppUnreachable,
 addCategorie,
 addSong,
 setCurrentCat,
 setCurrentSong,
 subscribeToStream,
 online,
 changeStreamListView
})

const SongContent = ({updateForced,lang,changeCatListView,changeResultListView,changeStreamListView,changeFavListView,removeFromFavorite,isFavorite,currentCat,addToFavorite,song,VerseIndex,changeIndex,favorites})=>({
	contentUpdate: updateForced.content,
	lang,
	changeCatListView,
	changeResultListView,
	changeStreamListView,
	changeFavListView,
	removeFromFavorite,
	isFavorite,
	currentCat,
	addToFavorite,
	song,
	VerseIndex,
	changeIndex,
	favorites
})


const Content = ({images, updateForced, lang, removeFromFavorite, currentCat, addToFavorite, favorite, song, VerseIndex, changeIndex, isFavorite})=>({
	 contentUpdate: updateForced.content,
	 lang,
	 removeFromFavorite,
	 currentCat,
	 addToFavorite,
	 isFavorite,
	 song,
	 VerseIndex,
	 changeIndex,
	 images: images
})

const ArrowNav = ({images,  song, currentCat, VerseIndex, changeIndex})=>({
	 total: song.verses.length -1,
	 catName: currentCat.name,
	 songName: song.name,
	 current: VerseIndex,
	 changeIndex,
	 images: images.arrows
})

const Settings = ({nightMode,updateForced, setControl, controls, lang, changeLanguage, changeNightMode, settingListView, changeSettingListView})=>({
	 setControl,
	 controls,
	 lang,
	 changeLanguage,
	 changeMode: changeNightMode,
	 updateForced: updateForced.settings,
	 view: settingListView,
	 changeView: changeSettingListView,
	 nightMode
})

const Head1 = ({lang, changeIndex, setMessage, removeCategorie, controls, updateSongList, changeCatView, changeResultListView, resultView, setCurrentSong, searchSong, searchResult, catNames, setCurrentCat, catListView, changeCatListView, images})=>({
	 lang,
	 changeIndex, 
	 setMessage,
	 removeCategorie,
	 controls,
	 updateSongList,
	 changeCatView,
	 changeResultListView,
	 resultView,
	 setCurrentSong,
	 searchSong,
	 searchResult,
	 catNames,
	 setCurrentCat,
	 catListView,
	 changeCatListView,
	 images
})

const Toggler = ({ changeDirection, direction})=>({
	 changeDirection,
	 direction
})

const ResultList = ({ resultView, setCurrentCat, setCurrentSong, searchResult})=>({
	 resultView,
	 setCurrentCat,
	 setCurrentSong,
	 songs:searchResult
})

const Item = ({ hide, i, args, item, action, action2, controls, src, wipe, modif, updateMyCat, song, downloadAll, download})=>({
	 hide,
	 i,
	 args,
	 item,
	 action,
	 action2,
	 controls,
	 src,
	 wipe,
	 modif,
	 updateMyCat,
	 song,
	 downloadAll,
	 download
})

const Head2 = ({})=>({

})

const Favorite = ({favListView, images, countFav, setCurrentSong, setCurrentCat, currentCat, favorites, changeFavListView, removeFromFavorite})=>({
 	view: favListView,
 	image: images.favorite.start,
 	countFav,
 	setCurrentSong,
 	setCurrentCat,
 	currentCat,
 	favorites,
 	changeFavListView,
 	removeFromFavorite
})

const NavHelper = ({ changeIndex, song, VerseIndex, currentCat})=>({
	 changeIndex,
	 verses: (song.name && song.verses.length) || 0,
	 current: VerseIndex,
	 catName: currentCat.name,
	 songName: song.name
})

const Control = ({ controls, setControl})=>({
	 controls,
	 setControl
})

exports.control = Control;
exports.navHelper = NavHelper;
exports.favorite = Favorite;
exports.item = Item;
exports.resultList = ResultList;
exports.toggler = Toggler;
exports.head1 = Head1;
exports.settings = Settings;
exports.arrowNav = ArrowNav;
exports.content = Content;
exports.songContetnt = SongContent;
exports.streamList = StreamList;
exports.streamCreation = StreamCreation;
exports.songList = SongList;
exports.input = Input;
exports.createStream = CreateStream;
exports.addSongDiv = AddSongDiv;
exports.addCatDiv = AddCatDiv;
exports.notification = Notification;
exports.offlineSongs = OfflineSongs;
exports.onlineSongs = OnlineSongs;
exports.catNames = CatNames;