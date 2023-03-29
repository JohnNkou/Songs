exports.C = {
	ADD_SONG: "ADD SONG",
	ADD_SONGS:"ADD_SONGS",
	UPDATE_SONG: "UPDATE SONG",
	REMOVE_SONG: "REMOVE SONG",
	ADD_CATEGORIE: "ADD CATEGORIE",
	UPDATE_CAT: "UPDATE CAT",
	REMOVE_CATEGORIE: "REMOVE CATEGORIE",
	SET_CURRENT_CAT: "SET CURRENT CAT",
	SET_CURRENT_SONG: "SET CURRENT SONG",
	CATLIST_VIEW: "CATLIST VIEW",
	FAVLIST_VIEW: "FAVLIST VIEW",
	STREAMLIST_VIEW: "STREAMLIST VIEW",
	SETTINGLIST_VIEW: "SETTINGLIST VIEW",
	CREATESTREAM_VIEW: "CREATESTREAM VIEW",
	CHANGE_INDEX: "CHANGE INDEX",
	ADD_TO_FAVORITE: "ADD TO FAVORITE",
	REMOVE_FROM_FAVORITE: "REMOVE FROM FAVORITE",
	CHANGE_DIRECTION: "CHANGE DIRECTION",
	UPDATE_SONG_LIST: "UPDATE SONG LIST",
	SEARCH_SONG: "SEARCH SONG",
	CHANGE_RESULT_VIEW: "CHANGE RESULT VIEW",
	CHANGE_ADD_CAT_VIEW: "CHANGE ADD CAT VIEW",
	CHANGE_ADD_SONG_VIEW: "CHANGE ADD SONG VIEW",
	CHANGE_VERSEDIV_NUMBER: "CHANGE_VERSEDIV_NUMBER",
	CHANGE_LANGUAGE: "CHANGE LANGUAGE",
	CHANGE_NIGHTMODE: "CHANGE NIGHT MODE",
	CHANGE_DEVTOOL_VIEW: "CHANGE DEVTOOL VIEW",
	SET_CONTROLS: "SET CONTROLS",
	SET_MESSAGE: "SET MESSAGE",
	SET_INCREMENT: "SET INCREMENT",
	SET_FORCEUPDATE: "SET FORCE UPDATE",
	SET_SELECTOR: "SET SELECTOR",
	SET_LOCAL_CAT: "SET LOCAL CAT",
	CLEAR_ONLINE_CAT: "CLEAR_ONLINE_CAT",
	SUBSCRIBE_TO_STREAM: "SUBSCRIBE TO STREAM",
	START_STREAM: "START STREAM",
	STOP_STREAM: "STOP STREAM",
	APP_REACHABLE: "APP REACHABLE",
	APP_UNREACHABLE: "APP UNREACHABLE",
	INITIALIZE_FAVORITE: "INITIALIZE FAVORITE"
}
exports.SUB = {
	UPDATE: "UPDATE",
	DELETE: "DELETE",
	UNSUBSCRIBE: "UNSUBSCRIBE",
	ADD: "ADD",
	NOTHING: "NOTHING",
	UPLOADVERSES: "UPLOADVERSES",
	STREAMDELETED: "STREAMDELETED",
	CHANGED_SONG: "CHANGED SONG",
	REGISTRATION_STARTING: " REGISTRATION STARTING",
	REGISTRATION_INSTALLING: "REGISTRATION INSTALLING",
	REGISTRATION_DONE: "REGISTRATION DONE",
	REGISTRATION_ACTIVE: "REGISTRATION ACTIVE"
}
exports.appState = {
	Categories:[],
	onlineSongs:{},
	offlineSongs:{},
	currentCat:{name:""},
	currentSong:{name:"", verses:[]},
	ui:{
		show:{
			catList:false,
			favList:false,
			streamList:false,
			settingList:false,
			resultList:false,
			addCatDiv:false,
			addSongDiv:false,
			createStreamDiv:false,
			devTool:false
		},
		navigation:{
			verseIndex:0,
			to:20
		},
		addSongDiv:{
			verses:0
		},
		direction:"Right",
		nightMode: false
	},
	images:{
		download: "download.png",
		streamCreate: {
			start: "streamStart.png",
			stop: "streamStop.png"
		},
		categorie:"cat.png",
		favorite:{
			start:"favorite.png",
			love:"love.png",
			unlove:"unlove.png"
		},
		streamList:{
			banner:"stream.png",
			open:"openStream.png",
			showed:""
		},
		arrows:{
			next: "next.png",
			prev: "prev.png"
		}
	},
	subscribedToStream:false,
	keys:{
		alt:false
	},
	updateForced:{
		songList:false,
		content:false,
		catNames:false,
		settings: false,
	},
	language:"Fr",
	favorites:{},
	searchTerm:"",
	message:"",
	selector:{
		withVerse:false
	},
	songIncrement:100,
	isStreaming:false,
	appReachable:true,
}
exports.System = {
	LOCALSTORAGE: 'LOCAL'
}
exports.dev = {
	START_SQL_FILE: '/Users/flashbell/Node/Songs/utilis/startSql.js',
	LOG_FILE: 		'/var/log/Songs/modain.log',
	ERROR_LOG_FILE: '/var/log/Songs/error.log'
}
exports.insertStatus = {
	FAILED:0,
	SUCCESS:1,
	DUPLICATE:2,
	COMPLETE:3,
	FAIL_ALL:4
}
exports.signal = {
	system: "mSystem",
	success:"mSuccess",
	error:  "mError"
}
exports.displayTime = { fast:50, normal:1500, medium:3000, long:20000}