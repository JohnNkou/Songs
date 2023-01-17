import React  from 'react';
import { connect } from 'react-redux'
import { storageHandler,dbChooser, compose, relay, getAllReturn, seq, fetcher, abortSubscription,SUB, indexChanger, curry, safeOp, registerWorker, validator, is, timeThis, adjustHeight } from '../utilis/BrowserDb.cjs';
import Text from '../utilis/Text.cjs';
import Action from '../utilis/aCreator.cjs'

const Texts = React.createContext(Text);

const displayTime = { fast:50, normal:1500, medium:3000, long:20000};
const insertStatus = {
	FAILED:0,
	SUCCESS:1,
	DUPLICATE:2,
	COMPLETE:3,
	FAIL_ALL:4
}
const signal={
	system: "mSystem",
	success:"mSuccess",
	error:  "mError"
}
const Validator = new validator();


function scrollHandler(node,event,trackedTouchsArray){
	try{
		var touches = event.touches;

		if(touches.length > 1){
			var length = touches.length - 1;

			node.scrollTop += touches[0].clientY - touches[length].clientY;

			trackedTouchsArray.push(touches[length].clientY);
		}
		else{
			if(trackedTouchsArray.length){
				var pastY = trackedTouchsArray.shift()

				node.scrollTop += pastY - touches[0].clientY;

				trackedTouchsArray.push(touches[0].clientY);
			}
			else
				trackedTouchsArray.push(touches[0].clientY);
		}
	}
	catch(e){
		console.error(e);
	}
}

function note(){
	let jsx;
	let counter;
	let timeout = displayTime.medium;
	let sequence = new seq();
	this.getTimeout = ()=> timeout;
	this.setJsx = (j)=>{
		jsx = j;
		window.kk = this;
	}

	this.addSpeed = (message,progress,t,node,signalMessage)=>{
		t = t || timeout;
		sequence.add(()=>{
			clearTimeout(counter);
			let state = jsx.state;
			let k = {message,progress,node, signal:signalMessage || signal.system,download:""};
			jsx.setState(k);
			counter = setTimeout(()=>{
				this.clear();
			},timeout)
			return Promise.resolve();

		})
	}
	this.add = (message,progress,t,node,signalMessage)=>{
		t = t || timeout;
		sequence.add(()=>{
			return new Promise((resolve,reject)=>{
				let state = jsx.state;
				let k = {message,progress,node, signal:signalMessage || signal.system,download:""}
				jsx.setState(k);
				counter = setTimeout(()=>{
					this.clear();
					resolve(true);
				},t);
			})
		})
	}
	this.post = (message, signal,download)=>{
		sequence.add(()=>{
			clearTimeout(counter);
			let state = jsx.state;
			let k = {message,signal,download};
			jsx.setState(k);
			return Promise.resolve();
		})
	}
	this.clear = ()=>{
		this.addSpeed("",null, displayTime.fast);
	}

}

function meticulus(node,fn){
	window.mountNotifier[node] = [fn];
}

function invoqueAfterMount(selector){
	if(window.mountNotifier[selector]){
		let subscriber;
		let length = window.mountNotifier[selector].length;
		while(length--){
			subscriber = window.mountNotifier[selector].shift();
			subscriber();
		}

		delete window.mountNotifier[selector];
	}
}

function changeStreamCreationImage(img){
	if(!directAccess['streamCreation'])
		setTimeout(()=> changeStreamCreationImage(img),5);
	else
		directAccess['streamCreation'].setState({img});
}

function startStream(name,createdInServer){
	let img = (createdInServer)? startStream.img: stopStream.img
	S.setName(name,()=> changeStreamCreationImage(`img/${img}`));
	if(createdInServer){
		startStream.f();
	}
}

function stopStream(name){
	S.setName("",()=> changeStreamCreationImage(`img/${stopStream.img}`));
	stopStream.f();
}

const notifier = new note();
const notifier2 = new note();
const db = (global.alert)? dbChooser('Test'): null;
const Categories = {};
const Songs = {};
const Pseq = new seq();
const directAccess = {};
let fastAccess = {__exec__:[]};

function n(p,time,u='Update',f=1){
	var j = (f ==1 )? notifier : notifier2;
	j.add(`It Taked ${Date.now() - time} ms to ${u} ${p}`);
}

var S;

class ErrorBoundary extends React.Component{
	constructor(props){
		super(props);

	}

	componentDidCatch(error,errorinfo){
		alert("Oh");
		alert(error);
		alert(errorinfo);
		console.log(error);
		console.log(errorinfo);
	}

	render(){
		return this.props.children;
	}
}

class Setup extends React.Component{
	constructor(props,context){
		super(props);
		this.cachingText = context.caching;
		this.streamText = context.Stream;
		this.handleKeydown = this.handleKeydown.bind(this);
		this.configureStream = this.configureStream.bind(this);
		this.configureStreamManager = this.configureStreamManager.bind(this);
		this.populateFastAccess = this.populateFastAccess.bind(this);
		this.registerGlobalClickHandler = this.registerGlobalClickHandler.bind(this);
		this.globalClickHandler = this.globalClickHandler.bind(this);
		this.handleDirection = this.handleDirection.bind(this);
	}

	componentDidUpdate(prevProps,prevState){
		let { direction } = this.props;
		if(!this.first)
			this.first = document.getElementById("first");
		if(!this.second)
			this.second = document.getElementById("second");

		if(prevProps.direction != direction){
			this.handleDirection(direction);
		}
	}

	populateFastAccess(fAccess){
		for(var n in fastAccess){
			if(fastAccess.hasOwnProperty(n))
				fAccess[n] = fAccess[n];
		}
		fastAccess = fAccess;
	}

	handleDirection(direction){
		let first = this.first,
		second = this.second,
		firstClassName = first.className.split(" "),
		secondClassName = second.className.split(" "),
		addFirstClass = (direction == "Right")? "TRR": "TLL",
		addSecondClass = (direction == "Right")? "TRRR": "Full";

		this.first.className = `${firstClassName[0]} ${addFirstClass} ${firstClassName[2]}`;
		this.second.className = `${secondClassName[0]} ${addSecondClass}`
	}

	registerGlobalClickHandler(handler){
		window.onclick = handler;
	}

	globalClickHandler(event){
		let { changeCatListView, changeResultListView, changeStreamListView, changeFavListView, changeSettingListView, resultView, catListView, streamListView, favListView, settingListView } = this.props;

		if(event.target.inlist)
			event.stopPropagation();
		else{
			if(catListView)
				changeCatListView(false);
			if(resultView)
				changeResultListView(false);
			if(streamListView)
				changeStreamListView(false);
			if(favListView)
				changeFavListView(false);
			if(settingListView)
				changeSettingListView(false);
		}
	}

	configureStream(){
		let { lang, images } = this.props,
		streamText = this.streamText;

		startStream.f = (startStream)? ()=>{
			notifier2.addSpeed(streamText.started(lang), undefined, undefined, undefined, signal.success);
			this.props.startStream();
			setTimeout(()=>{
				localStorage.setItem("stream",JSON.stringify({name:S.getName(), time:Date.now()}));
			},15);

		}: ()=> console.error("First componentDidMount, startStream not defined in props");

		stopStream.f = (stopStream)? ()=>{
			notifier2.addSpeed(streamText.stopped(lang));
			this.props.stopStream();
			setTimeout(()=>{
				localStorage.removeItem("stream");
			},15)
		}: ()=> console.error("First componentDidMount, stopStream not defined in scope");

		startStream.img 	= images.streamCreate.stop;
		stopStream.img 		= images.streamCreate.start; 
	}

	configureStreamManager(fAccess,streamManager,fastAccess){
		S = streamManager;
		S.addFastAccess(fastAccess);
	}

	handleKeydown(event){
		let { setControl } = this.props;

		if(event.target.tagName.indexOf('input') != -1 && event.altKey)
			setControl(this.props.controls);
	}

	componentDidMount(){
		let Text = this.cachingText;
		let streamText = this.streamText;
		let { lang, streamManager, startStream, stopStream, setControl, images } = this.props,
		fAccess = this.props.fastAccess,
		fn = null;

		this.populateFastAccess(this.props.fAccess);
		this.configureStream();
		this.configureStreamManager(fAccess,streamManager,fastAccess);
		this.registerGlobalClickHandler(this.globalClickHandler);

		window.db = db;
		window.ss = S;
		window.fetcher = fetcher;
		window.onkeydown = this.handleKeydown;

	}

	render(){
		return null;
	}
}
Setup.contextType = Texts;

const SetupC = connect((state,ownProps)=>({
	lang: 				state.language,
	images: 			state.images,
	controls: 			state.keys.alt,
	resultView: 		state.ui.show.resultList,
	catListView: 		state.ui.show.catList,
	streamListView: 	state.ui.show.streamList,
	favListView: 		state.ui.show.favList,
	settingListView: 	state.ui.show.settingList,
	direction: 			state.ui.direction,
	...ownProps
}),{
	startStream: 			Action.startStream,
	stopStream:  			Action.stopStream,
	setControl: 			Action.setControl,
	changeCatListView: 		Action.changeCatListView,
	changeResultListView: 	Action.changeResultListView,
	changeStreamListView: 	Action.changeStreamListView,
	changeFavListView: 		Action.changeFavListView,
	changeSettingListView: 	Action.changeSettingListView 	
})(Setup);

class FirstHelper extends React.PureComponent{
	constructor(props){
		super(props);
	}

	componentDidMount(){
		let { firstDirection, direction, setDirection } = this.props;

		if(firstDirection != direction)
			setDirection(direction);
	}

	componentDidUpdate(prevProps,prevState){
		let { direction, setDirection } = this.props;
		if(prevProps.direction != direction)
			setDirection(direction);
	}

	render(){
		return null;
	}
}

const FirstHelperC = connect((state,ownProps)=>({
	direction: 		state.ui.direction,
	...ownProps
}))(FirstHelper);

class First extends React.Component{
	constructor(props,context){
		super(props);
	}
	componentDidMount(){
		this.node = document.getElementById('first');	
	}

	render(){
		let { direction } = this.props;

		return (

		<div id="first" className={((direction && direction == "Right")? "il TRR ":"il TLL ")+"silverBack"}>
			<DownloaderLine />
			<Notification parent="First"/>
			<Head1 />
			<div className="songList">
				<OnlineSongsC />
				<OfflineSongsC />
			</div>
		</div>
		)
	}
}

First.contextType = Texts;

class Counter extends React.PureComponent{
	constructor(props){
		super(props);
		this.state = {number:props.i};
		this.updateNumber = this.updateNumber.bind(this);

		if(props.setUpdater)
			props.setUpdater(this.updateNumber,this);
	}

	componentDidUpdate(prevProps){
		if((prevProps.i != this.props.i) && this.props.i != this.state.number)
			this.setState({number:this.props.i});
	}

	updateNumber(number){

		this.setState({number: this.state.number + number});
	}

	render(){
		let {number} = this.state;
		let { additionalClass } = this.props;
		additionalClass = additionalClass || "";
		return (
			<span className={` counter ${additionalClass}`}>{number}</span>
			)
	}
}

class OnlineSongs extends React.Component{
	constructor(props,context){
		super(props);

		this.state = {show:false,report:false};
		this.initialSongLength = props.songLength;
		this.SavedSongs = 0;
		this.failedToSavedSongs = [];
		this.Text = context.Song;
		this.downloading = {};
		this.manageShowing = this.manageShowing.bind(this);
		this.Notify = curry(this.Notify.bind(this))(this.Text);
		this.throwReport = this.throwReport.bind(this);
		this.traceReport = this.traceReport.bind(this);
		this.setUpdater = this.setUpdater.bind(this);
		this.updateSongStatus = this.updateSongStatus.bind(this);
		this.initTime = Date.now();
		this.handleScroll = this.handleScroll.bind(this);
	}

	componentDidMount(){
		//n('OnlineSongs',this.initTime,'Mount');
		let c = setInterval(()=>{
			this.node = document.querySelector("#online .papa");
			if(this.node)
				clearInterval(c);
		},15)
	}

	shouldComponentUpdate(nextProps,nextState){
		let props = this.props;
		let state = this.state

		if(nextState.show != state.show || props.to != nextProps.to)
			return true;

		if(nextState.report && state.report && nextProps.catName == props.catName)
			return false;
		else if(!nextState.report && !state.report && nextProps.catName == props.catName && nextProps.songLength == props.songLength && nextProps.controls == props.controls)
			return false;

		return true;
	}

	componentDidUpdate(prevProps){
		let props = this.props;
		let state = this.state;
		if(!this.initialSongLength && props.songLength || prevProps.catName != props.catName){
			this.initialSongLength = props.songLength;
		}
		
		if(!props.songLength && state.report){
			this.setState({report:false});
		}

		invoqueAfterMount('online');
	}

	handleScroll(event){
		let { songLength,to, updateSongList } = this.props,
		node = this.node,
		nodeHeight = node.getBoundingClientRect().height,
		scrollTop = node.scrollTop,
		scrollHeight = node.scrollHeight,
		percent = (nodeHeight + scrollTop) / node.scrollHeight * 100;

		if(songLength >= to && percent >= 70 ){
			updateSongList(to+100);
		}
	}

	traceReport(t){		
		let total = this.failedToSavedSongs.length + this.SavedSongs;
		if(total >= this.initialSongLength){
			if(this.SavedSongs == this.initialSongLength){
				this.downloading[this.props.currentCat] = true;
				this.setState({report:false});
				
				return [insertStatus.COMPLETE,null,null];
			}
			else{
				
				return [insertStatus.FAIL_ALL,this.SavedSongs,this.initialSongLength]
			}
		}

	}

	updateSongStatus(status,name){
		if(status == insertStatus.SUCCESS){
			this.SavedSongs++;
		}
		else if(status == insertStatus.FAILED){
			this.failedToSavedSongs.push(name);
		}	
		
	}
	throwReport(full){
		this.downloading[this.props.catName] = true;
		this.setState({report:true});
	} 

	getPercentage(){
		if(!this.SavedSongs)
			return 0;
		if(!this.initialSongLength)
			throw Error("initialSongLength is zero");
		let percent = ((parseFloat(this.SavedSongs / this.initialSongLength).toPrecision(4) ) * 100).toPrecision(4);

		
		return percent;
	}

	Notify(T,lang,status,name,percent){
		let n = notifier[(this.report && this.SavedSongs != this.initialSongLength)?"add":"addSpeed"],
		Text = this.Text;
		if(status == insertStatus.SUCCESS){
			n(Text.insertion.success(lang,name),percent)
		}
		else if(status == insertStatus.DUPLICATE){
			n(Text.insertion.duplicate(lang,name),percent);
		}
		else if(status == insertStatus.FAILED){
			n(Text.insertion.failed(lang,name));
		}
		else if(status == insertStatus.COMPLETE){
			n(Text.insertion.allDone(lang),percent);
		}
		else if(status == insertStatus.FAIL_ALL)
			n(Text.insertion.allNotDone(langs,name,percent));	
	}

	setUpdater(updater,s){
		this.counterUpdater = updater.bind(s);
	}

	manageShowing(event){
		event.preventDefault();
		event.stopPropagation();

		let { show } = this.state;
		this.setState({show:!show});
	}

	render(){
		let { show } = this.state;
		let props = this.props;
		let lang = props.lang;
		let mustReport = this.state.report;
		let report;	
		let additionalClass = (show)? 'heightHelper' : 'online'

		// Report expect to have status, name, parameter
		if(mustReport){
			let composeBinded = compose.bind(this);
			let getAllReturnBinded = getAllReturn.bind(this);
			let relayBinded = relay.bind(this);
			let notify = this.Notify(lang);
			report = composeBinded(this.traceReport,notify,getAllReturnBinded(this.getPercentage,relayBinded(this.updateSongStatus)));
		}

		return (
			<div id="online" className={`il ${additionalClass}`}>
				<div className="onlineHead il blueBack">
					<a className="vmid tagName" id="onLink" href="#" onClick={this.manageShowing}>Online</a>
					<Counter i={props.songLength} setUpdater={this.setUpdater} />{(show && props.songLength)? <Download additionalClass="vmid" src={props.downloadImage} download={()=> Promise.resolve((db.isBogus)? [null]:[])} action={[()=> { return new Promise((resolve)=> { resolve(false); this.throwReport();})}]} additionalClass="vmid" />:''}
					<Liner additionalClass="vmid" />
				</div>
				{(show)? <div onScroll={this.handleScroll} className="papa"><SongList location="online" counterUpdater={this.counterUpdater} report={report} includeAdder={false} {...props} /></div>:''
			}
			</div>
			)
	}
}

OnlineSongs.contextType = Texts;

const OnlineSongsC = connect((state,ownProps)=>({
	songLength: (state.currentCat.name)? state.onlineSongs[state.currentCat.id].length: ([]).length,
	songs: (state.currentCat.name)? state.onlineSongs[state.currentCat.id]: [],
	to: state.ui.navigation.to,
	catName: state.currentCat.name,
	controls: state.keys.alt,
	currentCat: state.currentCat,
	lang: state.language,
	downloadImage: state.images.download,
	songs: (state.currentCat.name)? state.onlineSongs[state.currentCat.id]:[],
	updateForced: state.updateForced,
	increment: state.songIncrement,
	direction: state.ui.direction,
	subscribedToStream: state.subscribedToStream,
	...ownProps
}),{ updateSongList: Action.updateSongList, addSong: Action.addSong, removeSong: Action.removeSong, changeIndex: Action.changeIndex, setCurrentSong: Action.setCurrentSong, changeAddSongView: Action.changeAddSongView, subscribeToStream: Action.subscribeToStream, changeDirection: Action.changeDirection })(OnlineSongs)

class OfflineSongs extends React.Component{
	constructor(props){
		super(props);
		this.state = {show:false};
		this.manageShowing = this.manageShowing.bind(this);
		this.initTime = Date.now();

	}

	componentDidMount(){
		//n('OfflineSong',this.initTime,'Mount');
	}

	componentDidUpdate(){
		invoqueAfterMount('offline')
	}

	manageShowing(event){
		event.preventDefault();
		event.stopPropagation();
		let { show } = this.state;
		this.setState({show:!show});
	}
	
	render(){
		let { show } = this.state;
		let props = this.props;
		let additionalClass = (show)? 'heightHelper':'offline'
		return (
			<div id="offline" className={`il ${additionalClass}`}>
				<div className="offlineHead il open blueBack">
					<a className="vmid tagName" id="offLink" onClick={this.manageShowing} href="#">Offline</a>
					<Counter i={props.songs.length} />
					<Liner additionalClass="vmid" />
				</div>
				{(show)? <div className="papa"><SongList location="offline" includeModify={true} includeAdder={true} {...props}/></div>:''}
			</div>
			)
	}
}

const OfflineSongsC = connect((state, ownProps)=>{
	let songs = (state.currentCat.name)? state.offlineSongs[state.currentCat.id]:[];

	return {
		songs,
		songLength: songs.length,
		updateForced: state.updateForced,
		lang: state.language,
		controls: state.keys.alt,
		to: state.ui.navigation.to,
		increment: state.songIncrement,
		currentCat: state.currentCat,
		direction: state.ui.direction,
		subscribedToStream: state.subscribedToStream,
		...ownProps
	}
},{ setCurrentSong: Action.setCurrentSong, updateSongList: Action.updateSongList, removeSong: Action.removeSong, addSong: Action.addSong, changeIndex: Action.changeIndex, changeAddSongView: Action.changeAddSongView, subscribeToStream: Action.subscribeToStream, changeDirection: Action.changeDirection })(OfflineSongs)

class DownloaderLine extends React.PureComponent{
	render(){
		return (
			<div id="download" className="whoosh">
				<div className="progress mSuccess"> </div>
			</div>
			)
	}
}
class Notification extends React.PureComponent{
	constructor(props){
		super(props);
		this.state = {message:"",node:null, signal:signal.system};
	}
	componentDidMount(){
		if(this.props.parent == "First")
			notifier.setJsx(this);
		else
			notifier2.setJsx(this);
	}
	render(){
		let {message,progress,node, signal, download} = this.state;
		let percent = `${progress}%`;
		let hide = (message)? '':'whoosh'
		return (
			<div className={`Notification AllRound littleBox ${hide} ${signal}`} >
				<div className="il vmid">
					{message}
				</div><div className="tight vmid"></div>
				{(download)? download:''}
			</div>
			)
	}
}
class AddCatDiv extends React.Component{
	constructor(props,context){
		super(props);
		this.submit = this.submit.bind(this);
		this.updateCat = this.updateCat.bind(this);
		this.Text = context.addCatDiv;
		this.formError = context.formError;
		this.formText = context.formError;
		this.state = {message:()=> "",name:"", signal:signal.system};
		this.cleanUp = this.cleanUp.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.checker = this.checker.bind(this);
		this.adjustHeight = this.adjustHeight.bind(this);
		this.badInput = /\W/
	}

	componentDidMount(){
		let { _catName } = this.refs;
		_catName.onchange = ()=>{
			let state = this.state;
			this.setState({...state,name:_catName.value});
		}
		this.node = document.getElementById("addCat");
		this.popUp = document.querySelector(".popUp");
		this.box = 	document.querySelector(".popUp .Box");
		invoqueAfterMount('addCatDiv');
	}

	componentDidUpdate(prevProps){
		let {_catName} = this.refs;
		let { name } = this.state;
		let state = this.state;
		let { lang,current } = this.props;
		let Text = this.Text;

		if(this.props.controls){
			if(this.props.current.name){
				_catName.value = (!prevProps.controls || prevProps.current.name != current.name)? current.name : name || current.name;
				this.refs._add.textContent = Text.modiButtonText(lang);
			}
		}
		else if(!this.props.controls){
			_catName.value = name;
			this.refs._add.textContent = Text.addButtonText(lang);
		}

		this.adjustHeight(this.popUp,this.box);

		invoqueAfterMount('addCatDiv');
	}

	adjustHeight(wrapper,box){
		let wrapperHeight = wrapper.getBoundingClientRect().height,
		boxHeight = box.getBoundingClientRect().height,
		winHeight = window.innerHeight;

		if(wrapperHeight < boxHeight){
			if(winHeight >= boxHeight){
				wrapper.style.height = boxHeight + "px";
			}
			else{
				wrapper.style.height = winHeight + "px";
			}
		}
		else if(wrapperHeight > boxHeight){
			wrapper.style.height = boxHeight + "px";
		}


	}

	checker(e){
		e.preventDefault();

		let { lang } = this.props,
		catNames = this.props.catNames.map((catName)=> catName.toLowerCase()),
		catName = this.refs._catName,
		catNameValue = catName.value,
		action = null, message = "",
		text = this.Text,
		{ formError } = this;

		if(!Validator.hasSomething(catNameValue)){
			action = ()=>{
				this.setState({ message: text.message.nameRequired, signal:signal.error});
			}
		}
		else if(Validator.hasBadCharacter(catNameValue,this.badInput)){
			action = ()=>{
				this.setState({ message:this.formError.badCharacter(text.nameHolder(lang)), signal:signal.error})
			}
		}
		else if(!Validator.isNotIn(catNameValue.toLowerCase(), catNames)){
			action = ()=>{
				this.setState({ message:text.message.alreadyExist, signal:signal.system});
			}
		}
		else if(Validator.isMoreThan(catNameValue.length, 20)){
			action = ()=>{
				this.setState({ message:formError.inputToLong(text.nameHolder(lang),20), signal:signal.error})
			}
		}	

		return { action };
	}
	submit(e){
		let { current, lastCatId, lang } = this.props,
		catName = this.refs._catName.value,
		{ action, message } = this.checker(e); 

		if(action){
			return action();
		}
		else{
			this.props.addCategorie(catName, lastCatId);
			this.setState({ message:this.Text.message.success, signal:signal.success});

			db.insertCategorie(catName)().then((r)=>{
				if(r){
					console.log("categorie",catName,"was inserted");
				}
				else
					console.log("something went wrong while trying to insert categorie ",catName);
			}).Oups((e)=>{
				console.log("Failed to insertCategorie",e);
			})
		}
	}
	updateCat(e){
		let {_catName} = this.refs;
		let props = this.props;
		let oldName = props.current.name;
		let newName = _catName.value;
		let { action } = this.checker(e);
		let current = props.current;
		if(action){
			return action();
		}
		else{
			this.setState({message:this.Text.message.updated, name:_catName.value, signal:signal.success});
			props.updateCategorie(oldName,newName,current.id);
			props.forceUpdate({node:'catNames', value:true});
			meticulus('catNames',()=> props.forceUpdate({node:'catNames', value:false}))
		}
	}
	cleanUp(){
		this.setState({...this.state,message:()=> "",name:"", signal:signal.system});
	}
	handleClick(event){
		let target = event.target, 
		isOfInterest = target.className.indexOf('add') != -1 || target.className.indexOf('close') != -1, className=null, props = this.props;

		if(isOfInterest){
			event.preventDefault();
			event.stopPropagation();

			className = target.className;

			if(className.indexOf('add') != -1){
				if(props.controls && props.current.name)
					this.updateCat(event);
				else
					this.submit(event);
			}
			else if(className.indexOf('close') != -1){
				props.changeCatView(false);
				this.cleanUp();
			}
		}
	}
	render(){
		let {lang,controls,view} = this.props;
		let text = this.Text;
		let { message, signal } = this.state;
		let but1 = (controls)? text.modiButtonText: text.addButtonText;
		let but2 = text.closeButtonText;
		view = (view)? '':'whoosh'; 

		return (
			<div id="addCat" className={view}>
				<p className={`message ${signal}`}><span className="status">{message(lang)}</span></p>
				<div className="catName">
					<p><span className="signal error"></span></p>
					<input ref="_catName" type="text" name="" placeholder={text.nameHolder(lang)}/>
				</div>
				<div onClick={this.handleClick} className="actions il">
					<input ref="_add" className="add blueBack" type="submit" name="" value={but1(lang)} />
					<input ref="_close" className="close blueBack" name="" type="submit" value={but2(lang)} />
				</div>
			</div>
		)
	}
}
AddCatDiv.contextType = Texts; 

const AddCatDivC = connect((state,ownProps)=>{
	let Categories = state.Categories;
	return {
		lang: 		state.language,
		controls: 	state.keys.alt,
		current: 	state.currentCat,
		catNames: 	Categories,
		view: 		state.ui.show.addCatDiv,
		lastCatId:  state.Categories.length,
		catNamesString: Categories.join(' '),
		...ownProps
	}
},{ forceUpdate: Action.setForceUpdate, updateCategorie: Action.updateCategorie, updateSongList: Action.updateSongList, addCategorie: Action.addCategorie, changeCatView: Action.changeCatView })(AddCatDiv);

class AddSongDiv extends React.Component{
	constructor(props,context){
		super(props);
		this.kak = this.kak.bind(this);
		this.changeVerseNumber = this.changeVerseNumber.bind(this);
		this.updateSong = this.updateSong.bind(this);
		this.deleteVerse = this.deleteVerse.bind(this);
		this.hasOverflowed = this.hasOverflowed.bind(this);
		this.scrollHandler = scrollHandler.bind(this);
		this.lastUpdateOverflowed = false;
		this.state = { VerseNumber:"",Verses: [], name:"", lang:this.props.lang,message:"",VersesText:{}, signal:signal.system };
		this.Text = context.addSongDiv;
		this.formError = context.formError;
		this.songText = context.Song;
		this.handleClick = this.handleClick.bind(this);
		this.focusSignal = this.focusSignal.bind(this);
	}

	componentDidMount(){
		invoqueAfterMount('AddSongDiv');
		this.node = document.getElementById("addSong");
		this.listDiv = document.querySelector(".popUp .wrap");

		if(window.innerWidth > 400){
			this.hasOverflowed = ()=> false;
		}
	}
	componentWillUnmount(){

		this.listDiv.ontouchmove = "";
		this.listDiv.ontouchend = "";

		delete this.node;
		delete this.listDiv;
	}

	hasOverflowed(){
		try{
			let nodeHeight = this.node.getBoundingClientRect().height;
			let listDivHeight = this.listDiv.getBoundingClientRect().height;

			return nodeHeight > listDivHeight
		}
		catch(e){
			alert(e);
		}
	}

	componentDidUpdate(prevProps, prevState){

		this.focusSignal();

		try{
			if(this.hasOverflowed()){
				if(!this.lastUpdateOverflowed){
					this.lastUpdateOverflowed = true;

					let trackedTouchs = [];

					this.listDiv.ontouchend = function(){
						trackedTouchs = [];
					}
					this.listDiv.ontouchmove = (event)=>{
						try{
							this.scrollHandler(this.listDiv,event,trackedTouchs);
						}
						catch(e){
							console.error(e);
						}
					}
				}
			}
			else{
				if(this.lastUpdateOverflowed)
					this.lastUpdateOverflowed = false;
			}

			this.props.adjustHeight();


			if(((prevProps.current.name != this.props.current.name) && this.state.Verses.length) || prevProps.lang != this.props.lang){
				this.setState({...this.state,Verses:[],lang:this.props.lang});
			}

			let {_name,_verseNumber} = this.refs;
			if(this.props.controls){
				let { VersesText } = this.state;
				_name.value = this.props.current.name;
				let Verses = (this.state.Verses.length && this.state.Verses) || (this.props.current.Verses);
				for(let i=1;;i++){
					let input = [`_Verse${i}`]
					let Verse = this.refs[input];
					if(!Verse)
						break;
					else{
						Verse.value = VersesText[input] || (Verses[i-1] && Verses[i-1].Text) || '';
						if(!VersesText[input])
							VersesText[input] = Verse.value;
						if(!Verse.onchange){
							Verse.onchange = ()=>{
								let localState = this.state;
								VersesText[input] = Verse.value;
							}
						}
					}
				}
			}
			else{
				let state = this.state;
				for(let input in this.refs){
					if(this.refs.hasOwnProperty(input)){
						if(input != '_name' && input != '_verseNumber' && !this.refs[input].onchange){
							let Verse = this.refs[input];
							Verse.onchange = ()=>{
								let localState = this.state;
								state.VersesText[input] = Verse.value;
								
							}
						}
						if(this.state.VersesText[input]){
							let tem;
							let tam;
							this.refs[input].value = this.state.VersesText[input];
						}
						else{
							this.refs[input].value = "";
						}
					}
				}
				if(this.state.name)
					_name.value = this.state.name;
				if(this.state.VerseNumber)
					_verseNumber.value = this.state.VerseNumber;
			}
		}
		catch(e){
			alert(e);
		}

		this.props.adjustHeight();

		invoqueAfterMount('addSongDiv');
	}
	focusSignal(){
		let signalDiv = document.querySelector(".status");
		signalDiv.scrollIntoView();
	}

	kak(e){
		let { action, Verses, _name } = this.checker(e),
		songName = _name &&  _name.value;

		if(action)
			return action();
		else{
			let { addSong, forceUpdate, currentCatName, lang, catId } = this.props;

			db.insertSong(songName,Verses,currentCatName)().then((r)=>{
				if(r){
					notifier.addSpeed(this.songText.insertion.success(lang,songName),null,null,null,signal.success)
				}
				else
					notifier.addSpeed(this.songText.insertion.failed(lang,songName),null,null,null,signal.error);
			}).Oups((e)=>{
				alert("addCatDiv kak insertSong "+e);
			})
			addSong(0,songName,catId,Verses);
			forceUpdate({node:'songList',value:true});
			this.setState({ name:"",message:this.Text.message.success(lang),VersesText:{},Verses:[], VerseNumber:0, signal:signal.success})
			meticulus('songList',()=>{
				forceUpdate({node:'songList', value:false});
			})
		}
	}
	changeVerseNumber(number){
		let {_verseNumber,_name} = this.refs;
		let n;
		if(!parseInt(number) || !number){
			n = parseInt(_verseNumber.value || 0);
		}
		else{
			n = parseInt(number);
		}
		let vvv = _verseNumber.value;
		let nV = _name.value;
		
		if(!_name.value.length){
			this.setState({ name:"",VerseNumber:vvv || "",message:this.Text.message.nameRequired(this.props.lang), signal:signal.error})
			return ;
		}
		if(is.Number(n)){
			
			if(n <= 0){
				this.setState({ name:nV,VerseNumber:vvv,message:this.Text.message.verseNumberBadNumber(this.props.lang), signal:signal.error});
				return;
			}
			else if(n >= 15){
				this.setState({...this.state, name:nV, VerseNumber:vvv,message:this.Text.message.verseNumberToBig(this.props.lang), signal:signal.error});
				return;
			}
			_verseNumber.value = n;
			this.setState({ message:"",VerseNumber:n,name:nV, Verses: new Array(n), signal:signal.system});
		}
		else{
			this.setState({name:nV,VerseNumber:vvv,message:this.Text.message.verseNumberNotInteger(this.props.lang), signal:signal.error})
			
			return;
		}
	}

	checker(e){
		e.preventDefault();

		let message = "",
		{ _name } = this.refs,
		Verses = [],
		{ VersesText } = this.state,
		subRefs = {...this.refs},
		{ Text, formError } = this,
		{ lang } = this.props;

		delete subRefs['_name'];
		delete subRefs['_verseNumber'];

		if(!Validator.hasSomething(_name.value)){
			return { action: ()=>{
				this.setState({ name:"",message:this.Text.message.nameRequired(this.props.lang), VersesText, signal:signal.error}) ;
			}}
		}
		if(Validator.isAllEmpty(subRefs,'value')){
			message += this.Text.message.verseRequired(this.props.lang);

			return { action: ()=>{
				this.setState({ message,name:_name.value, signal:signal.error});
			}}
		}

		for(let i=1;;i++){
			let Verse = this.refs[`_Verse${i}`];
			if(!Verse)
				break;
			else if(!Validator.hasSomething(Verse.value))
				message += formError.required("Verse")(lang);
			else{
				VersesText[`_Verse${i}`] = Verse.value;
				Verses.push({Text:Verse.value});
			}
		}
		if(message){
			return { action: ()=>{
				this.setState({ message,name:_name.value,VersesText, signal:signal.error}); 
			}}
		}
		return {Verses,_name};
	}

	updateSong(e){
		let { action, Verses, _name } = this.checker(e);

		if(action)
			return action();
		else{
			let { location, updateSong, currentCatName, setCurrentSong, current, lang, catId } = this.props;

			updateSong(current.id,catId,_name.value,Verses,location,current.name)
			setCurrentSong(current.id,catId,location);
			this.setState({ message:this.Text.message.updated(lang), signal:signal.success});
		}
	}

	deleteVerse(id){
		let VersesText = this.state.VersesText;
		let Verses = (this.state.Verses.length)? this.state.Verses: new Array(this.props.current.Verses.length);
		Verses.pop();
		let nextVerse;
		let oldVerse = null;
		let { _verseNumber } = this.refs;
		_verseNumber.value = Verses.length;

		while(nextVerse = this.refs[`_Verse${++id}`]){
			VersesText[`_Verse${id-1}`] = nextVerse.value;
			oldVerse = nextVerse;
		}

		if(oldVerse){
			let deleted = delete VersesText[`_Verse${id -1}`];
		}
		else{
			let deleted = delete VersesText[`_Verse${id -1}`];
		}

		let objectKeys = Object.keys(this.refs);
		this.setState({...this.state, Verses, VerseNumber:Verses.length, VersesText});
	}

	cleanUp(){
		this.setState({...this.state,message:"",VersesText:{},name:"",VerseNumber:"", Verses:[]});
	}
	handleClick(e){
		let target = e.target, isOfInterest = target.className.indexOf("add") != -1 || target.className.indexOf("close") != -1, className = null, props = this.props;

		if(isOfInterest){
			e.preventDefault();
			className = target.className;

			if(className.indexOf('add') != -1){
				if(props.controls)
					this.updateSong(e);
				else
					this.kak(e);
			}
			else{
				props.changeAddSongView(false);
				props.changeVerseDiv(0);
				this.cleanUp();
			}
		}
	}

	render(){
		let props = this.props;
		let { Verses,name, signal } = this.state;
		let l = props.lang;
		let controls = props.controls;
		let text = this.Text;
		let verseNumber = (controls)? (Verses && Verses.length) || (props.current.Verses && props.current.Verses.length) || 0: Verses.length ; 
		let but1 = (controls)? text.modiButtonText: text.addButtonText;
		let but2 = text.closeButtonText;
		let view = (props.view)? '':'whoosh';
		return (
			<div id="addSong" className={`addSong ${view}`}>
				<p><span className={`status ${signal}`}>{this.state.message}</span></p>
				<div className="songName">
					<input ref="_name" type="text" placeholder="Nom de la chanson"/>
				</div>
				<div className="verseChanger">
					<p><span className="signal">{text.verseNumberHolder(l)}</span></p>
					<input className="verseNumber" ref="_verseNumber" type="number" placeholder={verseNumber} />
				</div>
				<div>
					<input className="changeVerse changeSubmit blueBack" type="submit" value="Changer" onClick={this.changeVerseNumber} />
				</div>
				{[...Array(verseNumber)].map((verse,i)=>
					<div className="verseText">
						<textarea cols="50%" rows="5%" ref={`_Verse${i+1}`} className="Verse" ></textarea>
						{(verseNumber-1 == i)? <button className='plus' onClick={()=> this.changeVerseNumber(verseNumber+ 1)}>+</button>:''}
						{(i > 0 )? <button className='minus' onClick={()=> this.deleteVerse(i+1)}>-</button>:''}
					</div>
				)}
				<div onClick = {this.handleClick} className="actions il">
					<input className="add blueBack" type="submit" name="" value={but1(l)} />
					<input className="close blueBack" type="submit" value={but2(l)} />
				</div>
			</div>
			)
	}
}
AddSongDiv.contextType = Texts;

const AddSongDivC = connect((state,ownProps)=>{
	return {
		location: 		state.currentSong.location,
		lang: 			state.language,
		controls: 		state.keys.alt,
		current: 		state.currentSong,
		VersesDiv: 		state.ui.addSongDiv.Verses,
		currentCatName: state.currentCat.name,
		catId: 			state.currentCat.id,
		view: 			state.ui.show.addSongDiv,
		...ownProps
	}
},{ forceUpdate: Action.setForceUpdate, setCurrentSong: Action.setCurrentSong, updateSong: Action.updateSong, changeVerseDiv: Action.changeVerseDivNumber, changeAddSongView: Action.changeAddSongView, addSong: Action.addSong })(AddSongDiv);


class CreateStream extends React.Component{
	constructor(props,context){
		super(props);
		this.save = this.save.bind(this);
		this.formError = context.formError;
		this.cleanUp = this.cleanUp.bind(this);
		this.state = {message:()=> "", disabled:false, lang:props.lang, signal:signal.system};
		this.Text = context.createStreamDiv;
		this.badInput = /\W/;
	}

	componentDidMount(){
		invoqueAfterMount('createStream');
		this.box = document.querySelector(".popUp .Box");
		this.popUp = document.querySelector(".popUp");
	}

	componentDidUpdate(prevProps,prevState){
		invoqueAfterMount('createStream');
		if(prevProps.lang != this.props.lang){
			this.setState({...this.state, lang:this.props.lang});
		}

		if(prevProps.isStreaming && !this.props.isStreaming)
			this.setState({message:()=>""});

		this.props.adjustHeight();
	}

	save(){
		let { appReachable, subscribedToStream, isStreaming,lang } = this.props,
		{ Text,formError } = this.Text;

		if(!appReachable)
			return this.setState({message:Text.message.networkProblem, signal:signal.error});
		if(subscribedToStream)
			return this.setState({message:Text.message.UnsubscribeFirst, signal:signal.system});
		if(isStreaming)
			return this.setState({message:Text.message.isAlreadyStreaming, signal:signal.system});

		let streamName = this.refs['_name'] && this.refs['_name'].value;

		if(!Validator.hasSomething(streamName)){
			return this.setState({ message: Text.message.nameRequired, signal:signal.error});
		}
		else if(Validator.isMoreThan(streamName.length,50)){
			return this.setState({ message:  formError(Text.nameHolder(lang),50) , signal:signal.error})
		}
		else if(this.badInput.test(streamName)){
			return this.setState({message: Text.message.BadCharacter, signal:signal.error})
		}
		
		var counter = 1;
		var c = setInterval(()=>{
			let { message } = this.state;
			this.setState({message:()=> {
				let adder=1;
				let dotNumber=0
				if(/^\.+$/.test(message)){
					dotNumber = message.split("").length;

					if(dotNumber > 5)
						adder=-1;
					else
						adder=1;
				}
				else
					message = "";

				let newDotNumber = dotNumber + adder;

				for(var i=0; i < newDotNumber; i++)
					message +=".";

				return message;
				

			}});
		},500);
		
		startStream(streamName.toLowerCase());
		fetcher({
			url:`/stream/create/${streamName}?s=${this.props.songName}&c=${this.props.catName}&i=${this.props.index || 0}`,
			method:'POST',
			data:JSON.stringify(this.props.Verses),
			s:(s)=>{

				clearInterval(c);
				this.setState({message:Text.message.streamCreated, disabled:true, signal:signal.success})
				startStream(streamName.toLowerCase(),true);
			},
			e:({status,error})=>{
				clearInterval(c);
				if(error && error.code && error.code == 6){
					stopStream(streamName.toLowerCase());
					return this.setState({message:Text.message.nameDuplication, signal:signal.error});
				}
				this.setState({message:Text.message.creationError, signal:signal.error});
				this.props.setAppUnreachable();
				stopStream(streamName.toLowerCase());
			},
			setter:(xml)=>{
				window.bb = xml;
			}
		})

	}
	cleanUp(){
		let {_name} = this.refs;
		let props = this.props;
		if(_name)
			_name.value = "";
		this.setState({...this.state,message:()=> "",disabled:false, signal:signal.system});
		props.changeView(false);
	}
	render(){
		let { message, disabled, signal} = this.state;
		let { lang, isStreaming }  = this.props;
		let text = this.Text;
		let view = (this.props.view)? '':'whoosh';
		let closeButton = <input type="submit" className='close blueBack' onClick={this.cleanUp} value={text.close(lang)}/>
		let createForm = (
			<>
				<input ref="_name" type="text" placeholder={text.nameHolder(lang)}/>
					<div className="actions il">
						<input type="submit" className="add blueBack" onClick={this.save} value={text.create(lang)} />
						{closeButton}
					</div>
			</>
		);
		return (
				<div id="createStream" className={`createStream ${view}`}>
					<p className='message'><span className={`status ${signal}`}>{message(lang)}</span></p>
					{
						(isStreaming)? closeButton:createForm
					}
				</div>
			);
	}
}

CreateStream.contextType = Texts;

const CreateStreamC = connect((state,ownProps)=>{
	return {
		appReachable: 	state.appReachable,
		subscribedToStream: state.subscribedToStream,
		lang: state.language,
		index: 	state.ui.navigation.verseIndex,
		catName: state.currentCat.name,
		songName: state.currentSong.name,
		Verses: state.currentSong.Verses,
		view: state.ui.show.createStreamDiv,
		isStreaming: state.isStreaming,
		...ownProps
	}
},{ setAppUnreachable: Action.setAppUnreachable, changeView: Action.changeStreamCreateView })(CreateStream)

class Second extends React.Component{
	constructor(props){
		super(props);
		this.clickHandler = this.clickHandler.bind(this);
		this.initTime = Date.now();
	}

	componentDidMount(){
		//n('Second',this.initTime,'Mount');
	}

	shouldComponentUpdate(){
		return true;
	}

	componentDidUpdate(){
		invoqueAfterMount('favorite');
	}

	clickHandler(event){
		let { changeCatListView, changeResultListView, changeStreamListView, changeFavListView, resultView, catListView, streamListView, favListView} = this.props;
		if(event.target.inlist)
			event.stopPropagation();
		else{
			if(catListView)
				changeCatListView(false);
			if(resultView)
				changeResultListView(false);
			if(streamListView)
				changeStreamListView(false);
			if(favListView)
				changeFavListView(false);
		}
	}

	render(){
		let props = this.props;
		let className = (props.direction && props.direction == "Right")? 'il TRRR ':'il Full ';
		return (
			<div onClick={this.clickHandler} id="second" className={className}>
				<Notification />
				{
					(props.showGuide)? 
						<Guider end={props.endGuide} step={props.step} showGuide={props.showGuide} />
						:
						''
				}
				<Head2 />
				<SongContent />
			</div>
			)
	}
}

class CatToggler extends React.Component{
	constructor(props){
		super(props);
		this.clickHandler = this.clickHandler.bind(this);
	}

	clickHandler(event){
		let { changeCatListView, catListView } = this.props;
		event.preventDefault();
		event.stopPropagation();
		changeCatListView(!catListView);
	}

	render(){
		let { image } = this.props;

		return <div className="il c1">
				<a href="#" onClick={this.clickHandler}><img src={`img/${image}`}/></a>
		</div>
	}

}

const CatTogglerC = connect((state)=>({
	catListView: state.ui.show.catList,
	image: state.images.categorie
}), { changeCatListView:Action.changeCatListView  })(CatToggler);


const Head1 = (props)=>{

	function clickHandler(event){
		event.preventDefault();
		event.stopPropagation();
		props.changeCatListView(!props.catListView);
	}

	return (
		<div className="head">
			<CatTogglerC />
			<InputC />
			<TogglerC />
			<Liner />
			<CatNamesC />
			<ResultListC />
		</div>
		)
}

class Input extends React.Component{

	constructor(props){
		super(props);
		this.inlet = "Josaphat";
		this.initTime = Date.now();
	}
	componentDidMount(){
		this.node = this.refs['_search'];
		let view = this.props.view;
		if(!this.node){
			console.error("Input componentDidMount this.node is null");
		}
		else{
			this.node.oninput = (event)=>{
				let value = this.node.value;
				if(value.length > 2){
					this.search(value);
					this.changeView(!view);
				}
				else{
					if(this.props.view)
						this.search("");
				}
			}
		}
		//n('Input',this.initTime,'Mount');
	}
	search(term){
		this.props.searchSong(term);
	}
	changeView(view){
		this.props.changeResultListView(view);
	}
	render(){
		let holder = this.props.holder || "Rechercher";
		return (
		<div className="il c2">
			<input ref="_search" type='text' name="" placeholder={holder} />
		</div>
		)
	}
	
}

const InputC = connect((state)=>({
	view: state.ui.show.resultList,
}), { searchSong: Action.searchSong, changeResultListView: Action.changeResultListView })(Input);


class Toggler extends React.Component{
	constructor(props){
		super(props);
		this.mustChangeDirection = this.mustChangeDirection.bind(this);
		this.clickHandler = this.clickHandler.bind(this);
	}

	componentDidMount(){
		if(this.mustChangeDirection()){
			this.props.changeDirection((this.props.direction == "Right")? "Left":"Right");
		}
	}

	mustChangeDirection(){

		let full = document.querySelector(".FULL");

		if(full){
			if(this.props.direction != "Left")
				return true;
			return false;
		}
		else if(this.props.direction == "Left"){
			return true;
		}
		else
			return false;

	}

	clickHandler(event){
		let { changeDirection , direction} = this.props;
		event.preventDefault();
		event.stopPropagation();
		changeDirection(((direction == "Right")? "Left":"Right"));
	}

	render(){
		let { direction } = this.props;
		direction = direction || "Right";

		return (
			<div className="il c3 Toggler">
				<a onClick={this.clickHandler} href="#" ><img src={"img/Toggle"+direction+".png"} /></a>
			</div>
			)	

	}
}

const TogglerC = connect((state)=>({
	direction: state.ui.direction
}), { changeDirection: Action.changeDirection,  })(Toggler)

const Liner = ({additionalClass=''})=> <div className={`tight ${additionalClass}`}> </div>


class CatNames extends React.Component{
	constructor(props,context){
		super(props);
		this.text  = context.Categorie;
		this.clickHandler = this.clickHandler.bind(this);
		this.addCatButton = this.addCatButton.bind(this);
		this.topClass = "wrap";
		this.modif = this.modif.bind(this);
		this.wipe = this.wipe.bind(this);
		this.action1 = this.action1.bind(this);
		this.action2 = this.action2.bind(this);
		this.download = this.download.bind(this);
		this.propagationHandler = this.propagationHandler.bind(this);
	}

	componentDidMount(){
		this.node = document.querySelector(".catNames");
	}

	componentDidUpdate(){
		invoqueAfterMount('catNames');
	}

	clickHandler(event){
		let target = event.target, props = this.props;
		event.preventDefault();
		
		if(target.className == "addCatCliquer" || target.className == "imgCliquer"){
			props.changeCatView(true);
		}
		else
			event.stopPropagation();
	}

	addCatButton(){
		return (
			<div className={this.topClass}>
				<div id="addCatButton" className="il f1">
					<a className="addCatCliquer" onClick={this.clickHandler} href="#"><img className="imgCliquer" src="img/Adder.png" /></a>
				</div>
			</div>
			)
	}

	modif(item,id){
		let { setCurrentCat, changeCatView } = this.props;

		setCurrentCat(item.name || item,id);
		changeCatView(true);
	}
	wipe(item,target,id){
		let { removeCategorie } = this.props;
		removeCategorie(item.name || item,id);
	}
	action1(item,id){
		let { changeIndex, setCurrentCat, updateSongList, changeCatListView } = this.props;

		changeIndex(0);
		setCurrentCat(item.name || item,id);
		updateSongList(100);
		changeCatListView(false);
	}
	action2({name}){
		let text = this.text;
		let { lang } = this.props;
		return db.insertCategorie(name)().then((r)=>{
			if(r){
				notifier.addSpeed(text.insertion.success(lang,name));
				return true;
			}
		}).Oups((e)=>{
			notifier.addSpeed(text.insertion.failed(lang,name));
		})
	}
	download(name){
		return db.getCategorie(name)();
	}
	propagationHandler(event){
		event.stopPropagation();
	}

	render(){
		let { action1, wipe, modif, download } = this;
		let props = this.props;
		let hide = (props.view)? '':'whoosh';
		let lang = props.lang;
		let text = this.text;
		let action2 = [this.action2]
		let action = this.action1;
		let style = {style:" abs abBottom shadowR list catNames BRRad "+hide}
		return (
				<div onClick={this.propagationHandler}>
					<List 
						download={(global.alert)? download : null} 
						args={{}} 
						action2={action2} 
						modif={modif} 
						wipe={wipe}  
						controls={props.controls} 
						first={this.addCatButton} 
						src={props.image}
						action={action} 
						list={props.catNames} 
						abs={style}
						topClass={this.topClass}
						catName={true}
					/>
				</div>
			)
	}
}
CatNames.contextType = Texts;

const CatNamesC = connect((state,ownProps)=>({
	updateForced: state.updateForced.catNames,
	controls: state.keys.alt,
	view: state.ui.show.catList,
	catNames: state.Categories,
	controls: state.keys.alt,
	image: state.images.download,
	...ownProps
}), { changeCatView: Action.changeCatView, setCurrentCat: Action.setCurrentCat, removeCategorie: Action.removeCategorie, changeIndex: Action.changeIndex, updateSongList: Action.updateSongList, changeCatListView: Action.changeCatListView })(CatNames)


class ResultList extends React.Component{
	constructor(prop){
		super(prop);
		this.scrollHandler = scrollHandler;
		this.action = this.action.bind(this);
	}

	componentDidMount(){
		this.node = document.querySelector("#first .head .result");
		let trackedTouchs = [];

		this.node.ontouchmove = (event)=>{
			this.scrollHandler(this.node,event,trackedTouchs);
		}
		this.node.ontouchend = (event)=>{
			trackedTouchs = [];
		}
	}
	componentWillUmount(){
		this.node.ontouchmove = this.node.ontouchend = null;
	}

	action({songId, catId, location,catName}){
		let { setCurrentCat, setCurrentSong } = this.props;

		setCurrentCat(catName,catId);
		setCurrentSong(songId, catId, location);
	}

	render(){
		let {resultView, songs, setCurrentCat, setCurrentSong } = this.props,
		hide = (resultView)? '':'whoosh',
		style = { style:" abs abBottom list result shadowC BLRad BRRad "+hide };
		songs = (songs.length)? songs: ["Aucun resultat"];
		return (
			<List action={this.action} abs={style} list={songs} />
			)

	}
}

const ResultListC = connect((state)=>({
	resultView: state.ui.show.resultList,
	songs: state.searchResult || [],

}), { setCurrentCat: Action.setCurrentCat, setCurrentSong: Action.setCurrentSong })(ResultList)

const List = ({catName,putInLastAccess,hide,updateMyCat,args,song,abs,src,list = [],action,action2,first=()=>{},controls,wipe,modif,download,downloadAll,topClass})=>{

	return (
		<div className={(abs)? abs.style: ""}>
			{first()}
			{list.map((item,i)=>{
				if(item.name) item = {...item,id:i};
						return	(<div className={`${(topClass)? topClass: ''}`+((song)? ` p${i}`:'')} key={i}>
									<Item hide={hide} i={i} args={{...args}} item={item} action={action} action2={action2} controls={controls} src={src} wipe={wipe} modif={modif} updateMyCat={updateMyCat} song={song} downloadAll={downloadAll} download={download} />
								</div>)
							}
				)}
		</div>
		)
}


const Item = ({i,hide,item,action,action2,controls,src,wipe,modif,updateMyCat,song,downloadAll, download,args})=>{
	let name = item.name || item;

	if(args){
		if(item.name)
			args = {...args,...item, index:i};
		else{
			args['name'] = name;
			args['index'] = i;
		}
	}
	return (
		<>
			<div className={`il f1 ${name}`}>
				<a inlist="true" onClick={(action)? (event)=>{ event.preventDefault(); action(item,i) }:'' } href="#">{name}</a>
			</div>
			{
				(src || controls)?
					<>
						<div className='il'>
							{(controls)? <Controls wipe={({target})=> wipe(item,target,i)} modif={()=> modif(item,i)} />: (action2)? <Download hide={()=> hide(i)} args={args} downloadAll={downloadAll} updateMyCat={updateMyCat} name={name} song={song} src={src} download={download} action={action2} />:''}
						</div>
					</>: ''
			}
		</>
		);
}


const Controls = (props)=>{
	
	return (
			<div>
				{(props.modif)? <a className='modif' onClick={(event)=> {event.preventDefault(); props.modif()}} href="#">M</a>:''}
				<a className='wipe' onClick={(event)=>{ event.preventDefault(); props.wipe(event)}} href="#">D</a>
			</div>
		)
}

class Download extends React.Component{
	constructor(props){
		super(props);
		this.doAction = this.doAction.bind(this);
		this.state = {img:true};
		this.save = this.save.bind(this);
		this.name = this.props.name;
		this.checkImageDownload = this.checkImageDownload.bind(this);
	}

	componentDidMount(){
		if(this.props.downloadAll)
			this.save();
		if(!this.props.song)
			this.checkImageDownload();
	}

	componentDidUpdate(){
		if(this.props.downloadAll){
			this.save();
		}
		else if(!this.props.song){
			this.checkImageDownload();
		}
	}

	doAction(action,args,song){
		return new Promise((resolve,reject)=>{

			action[0](args).then((r)=>{
				if(r){
					resolve(true);
				}
				else{
					resolve(false);
				}
			}).Oups(reject);
		})
	}

	checkImageDownload(){
		let {args, action2, download, name} = this.props;
		let { img } = this.state;
		if(!download){
			if(img)
				this.setState({img:!img});
			return false;
		}
		download(name).then((r)=>{
			if(r.length){
				if(img){
					this.setState({img:!img});
				}
			}
			else{
				if(!img)
					this.setState({img:!img});
			}
		}).Oups((e)=>{
			console.error("checkImageDownload Error",e);
		})
	}

	save(e){
		if(e)
			e.preventDefault();

		let { action,args, song, name } = this.props;
		this.doAction(action,args,song).then((r)=>{
			if(r){
				if(song){
					let hide = this.props.hide;
					if(hide)
						hide();
					this.props.updateMyCat();
				}
				else
					this.setState({img:false});
				
			}
			else{
				console.log("Odd thing happened");
			}
		}).Oups((e)=>{
			alert("doAction catch Error");
			alert(e.message);
		});

	}

	render(){
		var show = this.state.img;
		let {additionalClass} = this.props;
		if(!this.props.song && !Categories[this.name] && this.name){
			Categories[this.name] = {img:show, setState:this.setState.bind(this)};
		}
		else if(this.name)
			Songs[this.name] = {img:show, setState:this.setState.bind(this)};

		return (
					(show)? <a className={`downloader ${additionalClass}`} onClick={this.save} href="#" ref='dad'><img src={'img/'+this.props.src} /></a>:''
			
			)
	}
}

class SongList extends React.Component{
	constructor(props,context){
		super(props);
		this.text = context.Song;
		this.scrollHandler = scrollHandler.bind(this);
		this.addMoreSong = this.addMoreSong.bind(this);
		this.shouldAddMoreSong = this.shouldAddMoreSong.bind(this);
		this.reportSuccess = this.reportSuccess.bind(this);
		this.reportError = this.reportError.bind(this);
		this.songInsert = this.songInsert.bind(this);
		this.updateMyCat = this.updateMyCat.bind(this);
		this.download = this.download.bind(this);
		this.action2 = this.action2.bind(this);
		this.modif = this.modif.bind(this);
		this.wipe = this.wipe.bind(this);
		this.action = this.action.bind(this);
		this.saveSequence = new seq();
		this.initTime = Date.now();
		this.insertSong = this.insertSong.bind(this);
		this.insertCategorie = this.insertCategorie.bind(this);
	}

	componentDidMount(){
		let { location } = this.props;

		this.node = document.querySelector(`#${location} .list`);
		if(!this.node){
			alert(`this.node #${location} . list is null`);
			return;
		}
		this.listDiv = document.querySelector(`#${location} .papa`);
		this.second = document.getElementById("second");

		if(window.innerWidth < 400){
			var trackedTouchs = [];
			this.node.ontouchend = function(){
				trackedTouchs = [];
			}
			this.node.ontouchmove = (event)=>{
				this.scrollHandler(this.listDiv,event,trackedTouchs);
			}
		}

		this.listDiv.onscroll = this.addMoreSong;

		n('SongList',this.initTime,'Mount');
	}
	shouldComponentUpdate(nextProps,nextState){
		let props = this.props;

		if(nextProps.report && props.report && props.currentCat.name == nextProps.currentCat.name && props.songs.length == nextProps.songs.length)
			return false;

		if(nextProps.currentCat.name == props.currentCat.name && nextProps.songLength != props.songLength)
			return true;
		
		if(nextProps.updateForced.songList || nextProps.controls != props.controls || nextProps.to != props.to || nextProps.lang != props.lang || nextProps.currentCat.name != props.currentCat.name || (nextProps.report  &&  !props.report) || (props.report && !nextProps.report)){

			if(props.currentCat.name != nextProps.currentCat.name)
				this.saveSequence = new seq();
			return true;
		}

		return false;
	}

	componentWillUmount(){
		if(this.node){
			this.node.ontouchmove = this.node.ontouchend = this.listDiv.onscroll = "";

			delete this.node;
			delete this.onlineDiv;
		}
	}

	shouldAddMoreSong(){
		let { to,songs, updateSongList, increment } = this.props;

		return to < songs.length
	}

	addMoreSong(event){
		try{
			let { to, increment, updateSongList } = this.props;
			if(this.shouldAddMoreSong()){
				let percent = Math.floor(((this.listDiv.clientHeight + this.listDiv.scrollTop) / this.listDiv.scrollHeight) * 100);

				(percent > 65)? updateSongList(to + increment): '';
			}
		}	
		catch(e){
			alert(e);
		}
	}
	
	reportSuccess(name,i,Verses){
		let { report, addSong, removeSong, counterUpdater, currentCat, songs, lang,} = this.props;
		let catName = currentCat.name;
		let catId = currentCat.id;
		if(report){
			report((i == songs.length -1)? insertStatus.COMPLETE: insertStatus.SUCCESS, name);
		}
		else
			notifier.addSpeed(this.text.insertion.success(lang,name),undefined,undefined,undefined,signal.success);

		addSong(0,name,catId, Verses,'offline');
		removeSong(i,catId,name);
		counterUpdater(-1);

		return true;
	}
	reportError(name){
		let { report,lang } = this.props;

		if(report){
			report(insertStatus.FAILED,name);
		}
		else{
			notifier.addSpeed(this.text.insertion.failed(lang,name),undefined,undefined,undefined,signal.error);
		}

		return true;
	}
	songInsert(songs,cat){
		let c = Promise.resolve(true);
		let self = this;
		songs.forEach((song,i)=>{
			let { name, Verses } = song;
			c = c.then(()=>{
				return db.insertSong(name,Verses,cat)().then((r)=>{
					try{
						if(r){
							self.reportSuccess(name,0,Verses);
							return true;
						}
						else{
							self.reportError(name);
							alert("Failed");
							return false;
						}
					}
					catch(e){
						alert("insertSong Error"+c);
						console.log(e);
						return e;
					}
				})
			}).Oups((e)=>{
				if(e.code != 6){
					console.log("db insertSong catch");
					console.log(e);
				}
			})

		})
	}
	updateMyCat(){
		let { currentCat } = this.props;

		if(Categories[currentCat.name].img)
			Categories[currentCat.name].setState({img:false});
	}
	download({name,cat}){
		return db.getSong(name,cat)();
	}

	insertSong(name,Verses,cat,index,tried=0){
		return db.insertSong(name,JSON.stringify(Verses),cat)().then((r)=>{
			if(r){
				this.reportSuccess(name,index,Verses);
				return true;
			}
			else{
				if(tried)
					return false;
				return this.insertCategorie(cat).then((id)=>{
					if(is.Number(id))
						return this.insertSong(name,Verses,id,index,1);
					else
						return false;
				});
			}
		})
	}

	insertCategorie(cat){
		return db.insertCategorie(cat)().then((id)=>{
			if(is.Number(id)){
				return id;
			}
			return false;
		}).Oups((e)=>{
			if(e.code == 6)
				return id;
		})
	}

	action2(sequence,{name,Verses,cat,index}){
		return new Promise((resolve,reject)=>{
			let self = this;
			sequence.subscribe(sequence.add(()=>{
				return self.insertSong(name,Verses,cat,index).then((r)=>{
					if(!r){
						self.reportError(name);
						return false;
					}
					else
						return true;
				}).Oups((e)=>{
					console.log("Error while trying to insert song",name);
					console.log(e);
				})
			}),(f)=>{
				resolve(f);
			},(e)=> reject(e));
		})
	}
	modif(item,id){
		let { changeIndex, setCurrentSong, location, changeAddSongView, currentCat } = this.props;

		changeIndex(0);
		setCurrentSong(id,currentCat.id,item.name,location);
		changeAddSongView(true);
	}
	wipe(item,target,songId){
		let name = item.name || item;
		let { removeSong, currentCat, location, lang } = this.props;
		let catName = currentCat.name,
		parent = target.parentNode,
		catId = currentCat.id;

		db.deleteSong(name,catName)().then((r)=>{
			if(r){
				removeSong(songId,catId,name,location);

				if(catName == name)
					setCurrentSong("");

				notifier.addSpeed(this.text.wiping.success(lang,name),undefined,undefined,undefined,signal.success);

				while(parent && parent.className.indexOf('wrapper') == -1){
					parent = parent.parentNode;
				}

				parent.style.display = "none";
			}
			else{
				notifier.addSpeed(this.text.wiping.error(lang,name),undefined,undefined,undefined,signal.error);
			}
		}).Oups((e)=>{
			notifier.addSpeed(this.text.wiping.error(lang,name),undefined,undefined,undefined,signal.error);
			console.log("Oh oh");
			console.log(e);
		})
				
	}
	action(x,id){
		let { currentCat, setCurrentSong, subscribedToStream, subscribeToStream, location, changeDirection } = this.props;

		abortSubscription(fetcher);
		S.updateStream(currentCat.name, x.name, 0, x.Verses);
		setCurrentSong(id,currentCat.id,location);

		if(window.innerWidth <= 425)
			changeDirection('Left');

		if(subscribedToStream)
			subscribeToStream(false);
	}
	componentDidUpdate(){
		invoqueAfterMount('songList');
	}

	render(){
		let props = this.props,
		location = props.location || 'online',
		songs = props.songs,
		{ lang, to } = props,
		saveSequence = new seq(),
		report = props.report,
		songProps = {
			abs:{
				style:'list il'
			},
			list:[]
		},
		action2Curried = curry(this.action2)(this.saveSequence),
		catName = props.currentCat.name,
		cat = props.currentCat.name,
		text = this.text;

		if(report){

			let Fender = db.insertCategorie(catName)().then((id)=>{
					if(is.Number(id)){
						this.songInsert(songs,id);		
					}
					else{
						console.error("insert Categorie Failed");
						alert("Fender insertCategorie failed");
					}
			}).Oups((e)=>{
				let passableCode = {};
				passableCode[1] = true;
				passableCode[6] = true;
				if(passableCode[e.code]){
					db.getCategorie(cat)().then((r)=>{
						let id = r.pop().id;
						this.songInsert(songs,id);
					})
				}
				else{
					console.error(e);
					alert("Fender Oups");
					alert(e.message);
					alert(e.code);
				}
			})
		
		}
		else{
			songProps = {
					song:(db.isBogus)? false:true,
					updateMyCat:this.updateMyCat,
					download:(global.alert)? this.download:null,
					args:{cat:props.currentCat.name},
					action2:[action2Curried],
					modif:(!props.includeModify)? null: this.modif,
					wipe: this.wipe,
					controls:props.controls,
					first:(props.includeAdder)? (!props.currentCat.name)? ()=> "":()=> <div className="wrapper"><div id="AddSong" className="il f1"><a onClick={(event)=> {event.preventDefault(); props.changeAddSongView(true)}} href="#">{text.adder(lang)}</a></div><div className="il"></div></div>: ()=>{},
					action:this.action,
					src:props.downloadImage,
					downloadAll:(report)? true:false,
					list:(report)? songs : songs.slice(0,to),
					abs:{style:'list il'},
					hide:(index)=>{
						/*let className = `.p${index}`
						let parent = document.querySelector(className);
						if(parent)
							parent.style.display = "none";
						else
							console.log("Couldn't hide p"+index); */
					},
					topClass:"wrapper"
			};
		}

		return <List {...songProps} />;
	}
}
SongList.contextType = Texts

const Head2 = (props)=>{
	let favListView = props.favListView;
	let streamListView = props.streamListView;
	return (
		<div className="head">
			<TogglerC />
			<SettingsC />
			<FavoriteC />
			<StreamCreationC />
			<StreamListC />
			<Liner />
		</div>
		)
}

class Favorite extends React.Component{
	constructor(props){
		super(props);
		this.clickHandler = this.clickHandler.bind(this);
		this.action = this.action.bind(this);
	}

	componentDidMount(){

	}

	clickHandler(event){
		event.preventDefault();
		event.stopPropagation();

		let { changeFavListView, view } = this.props;
		changeFavListView(!view);
	}

	action(item){
		let { setCurrentCat, setCurrentSong } = this.props;

		setCurrentCat(item.catName, item.catId);
		setCurrentSong(item.songId, item.catId, item.location);
	}

	buildFavList(favorites){
		let catName = "", songName = "", Verses = [], location = "", catId, songId, favList = [], song = {}, songs = ""

		for(catName in favorites){
			songs = favorites[catName];
			for(songName in songs){
				song = songs[songName];
				favList.push({catName, songName, location:song.location, Verses:song.Verses, songId:song.songId, catId:song.catId, name:songName});
			}

		}

		return favList;
	}

	render(){
		let { image, favorites, view } = this.props,
		favList = this.buildFavList(favorites),
		hide = (view)? '':'whoosh';
		

		let style = {style:`abs abBottom list shadowC silverBack BLRad BRRad ${hide}`}
		return (
			<div className="fav il c1 tip">
				<div>
					<a id="favLink" onClick={this.clickHandler} href="#"><img className="vmid" src={`img/${image}`}/><Liner additionalClass="vmid" /><span className="counter">{favList.length}</span></a>
				</div>
				<List action={this.action}  abs={style} list={favList} />
			</div>
			) 
	}
}

const FavoriteC = connect((state)=>({
	view: state.ui.show.favList,
	favorites: state.favorites,
	image: state.images.favorite.start,

}), { changeFavListView: Action.changeFavListView, setCurrentCat: Action.setCurrentCat, setCurrentSong: Action.setCurrentSong })(Favorite);

class StreamCreation extends React.PureComponent{
	constructor(props,context){
		super(props);
		this.showCreateStream = this.showCreateStream.bind(this);
		this.stopStream = this.stopStream.bind(this);
		this.text = context;
		this.images = this.props.images;
		this.state = {img:`img/${this.images.start}`};
	}

	componentDidUpdate(prevProps){
		invoqueAfterMount('streamCreation');

		if(prevProps.isStreaming == false && this.props.isStreaming == true){
			let streamName = S.getName();
			this.setState({img:`img/${this.images.stop}`});
		}
	}

	showCreateStream(event){
		event.preventDefault();
		event.stopPropagation();

		if(!S.getName()) 
			return this.props.changeStreamCreateView(true);
		this.stopStream();
		let c = 0;
		this.counter = setInterval(()=>{
			notifier2.addSpeed(this.text.Stream.stopping(this.props.lang,S.getName(),".".repeat(c % 6)));
			c++;
		},100);
	}
	componentDidMount(){
		directAccess["streamCreation"] = this;
		if(S.getName())
			this.setState({img:`img/${this.images.stop}`});
	}

	stopStream(){
		let streamName = S.getName();
		fetcher({
			url:`stream/delete?n=${streamName}`,
			s:(response)=>{
				clearInterval(this.counter);
				notifier2.addSpeed(this.text.Stream.stopped(this.props.lang,streamName));
				
				
				stopStream(streamName);
				this.setState({img:`img/${this.images.start}`});
			},
			e:(e)=>{
				clearInterval(this.counter);
				notifier2.addSpeed(this.text.stopError(this.props.lang,streamName));
				console.log(`Error while trying to stop the stream ${streamName}`,e);
				stopStream(streamName);
				
				this.setState({img:`img/${this.images.start}`});
			}
		})
	}

	render(){
		let props = this.props;
		let { img } = this.state;
		return (
			<div className="streamCreation il c2 tip">
				<div>
					{ 
						(props.appReachable)? 
							<a onClick={this.showCreateStream} href="#">
								<img className="vmid" src={img} /><Liner additionalClass="vmid" /> 
							</a>: ""
					}
				</div>
			</div>
			)
	}
}
StreamCreation.contextType = Texts;

const StreamCreationC = connect((state)=>({
	images: state.images.streamCreate,
	lang: state.language,
	appReachable: state.appReachable,
	isStreaming: state.isStreaming

}),{ changeStreamCreateView: Action.changeStreamCreateView})(StreamCreation);

const Search = ({view})=>{
	let hide = (view)? '':'whoosh';
	return (
		<div className={`search ${hide}`}>
			<input className="vmid" type="text" name="" /><div className="vmid tight"></div>
		</div>
		)
}

class StreamList extends React.Component{
	constructor(props,context){
		super(props);
		this.state = {list:[], showSearch:false, searchResult:[], searchTerm:""}
		this.updateStream = this.updateStream.bind(this);
		this.updateCurrentStreamInfo = this.updateCurrentStreamInfo.bind(this);
		this.downloadSong = this.downloadSong.bind(this);
		this.registerToStream = this.registerToStream.bind(this);
		this.restartUpdateStream = this.restartUpdateStream.bind(this);
		this.downloadSong.inFetch = {};
		this.listText = context.streamList;
		this.streamText = context.Stream;
		this.timer = {normal:5000, error:10000};
		this.lastTimestamp;
		this.hasOverflowed = this.hasOverflowed.bind(this);
		this.handleSearchInput = this.handleSearchInput.bind(this);
		this.scrollHandler = scrollHandler;
		this.createDownloadLink = this.createDownloadLink.bind(this);
	}

	componentDidMount(){
		if(this.props.appReachable)
			this.updateStream();

		this.listDiv = document.querySelector(".streamList .list");
		this.searchInput = document.querySelector(".streamList .list .search");

		this.searchInput.oninput = this.handleSearchInput;

		let trackedTouchs = [];

		this.listDiv.ontouchmove = (event)=>{
			this.scrollHandler(this.listDiv,event,trackedTouchs);
		}
		this.listDiv.ontouchend = (event)=>{
			trackedTouchs = [];
		}
	}

	componentDidUpdate(prevProps){
		let { showSearch, searchTerm } = this.state;
		if(!prevProps.appReachable && this.props.appReachable)
			this.updateStream(this.lastTimestamp || 0);

		let hasOverflowed = this.hasOverflowed();

		if(!searchTerm){
			if(hasOverflowed && !showSearch)
				this.setState({ showSearch: true });

			if(!hasOverflowed && showSearch)
				this.setState({ showSearch: false });
		}

		invoqueAfterMount('streamList');
	}

	handleSearchInput(event){
		let target = event.target,
		{ searchResult, searchTerm, list } = this.state,
		terms = target.value;

		if(terms.length){
			searchResult = list.filter((item)=> item.indexOf(terms) != -1);
			searchTerm = terms;

			this.setState({searchResult, searchTerm});
		}
		else{
			if(searchResult.length || searchTerm.length)
				this.setState({searchResult: [], searchTerm:""});
		}

	}

	hasOverflowed(){
		let listDiv = this.listDiv,
		listDivHeight = listDiv.getBoundingClientRect().height,
		lastElementHeight = listDiv.lastElementChild.getBoundingClientRect().height;

		if(listDivHeight < lastElementHeight)
			return true;
		return false;
	}

	addStream(name){
		this.setState({list:[...this.state.list,name]})
	}
	removeStream(name){
		let list = this.state.list.filter((l)=> l != name);
		this.setState({list});
	}

	restartUpdateStream(t){
		this.updateStream(t);
	}

	updateStream(t){
		let text = this.text;
		let { lang } = this.props;
		fetcher({
			url:`/stream/list${(t)? '?t='+t:''}`,
			s:({action, streams,timestamp,name})=>{
				let myStream = S.getName();
				if(!timestamp && t)
					timestamp = t;
				switch(action){
					case SUB.UPDATE:
						
						if(myStream){
							this.setState({list:streams.filter((stream)=> stream != myStream)});
						}
						else{
							this.setState({list:streams})
						}
						this.restartUpdateStream(timestamp);
						break;
					case SUB.ADD:
						if(!myStream || myStream != name){	
							this.setState({list:[...this.state.list,name]});
						}
						this.restartUpdateStream(timestamp);
						break;
					case SUB.DELETE:
						let isNotIn = (is.Array(name))? (x)=> (name.indexOf(x) == -1):(x)=> x != name, currentStreamName = S.getName(), currentRegistration = this.subscribe.registration;
						let list = this.state.list.filter(isNotIn);

						if(currentStreamName && !isNotIn(currentStreamName)){
							stopStream(S.getName());
						}

						if(currentRegistration && !isNotIn(currentRegistration)){
							notifier2.addSpeed(this.streamText.subscription.end(this.props.lang,currentRegistration));
							delete this.subscribe.registration;
							this.props.subscribeToStream(false);
							this.updateCurrentStreamInfo();
							abortSubscription(fetcher);
						}
						
						this.setState({list:list});

						this.restartUpdateStream(timestamp);
						break;
					case SUB.NOTHING:
						this.restartUpdateStream(timestamp);
						break;
					default:
						console.log("Incomprehensible action",action,streams);
						
						this.restartUpdateStream(timestamp);
				}
				
			},
			e:(e,xml)=>{
				this.props.setAppUnreachable();
				notifier2.addSpeed(this.text.listText.updateStreamError(lang));
				console.log("Error while retriving the stream",e);
			}
		})
	}

	createDownloadLink(catName,songName,streamName){
		let a = <a onClick={()=> this.downloadSong(catName,songName,streamName)}>Download The Song</a>;
		return a;
	}

	downloadSong(catName,songName,streamName){
		let downloadSong = this.downloadSong;
		let url = `stream/downloadSong?c=${catName}&s=${songName}&n=${streamName}`;
		if(downloadSong.inFetch[url])
			return;
		let props = this.props;
		let lang = props.lang;
		let downloadText = this.streamText.download;
		downloadSong.inFetch[url] = true;
		notifier2.addSpeed(downloadText.start(lang,songName));
		fetcher({
			url,
			s:(response)=>{
				let action = response.action;
				delete downloadSong.inFetch[url];
				switch(action){
					case SUB.DELETE:
						notifier2.addSpeed(this.listText.songDeleted(lang,songName));
						break;
					case SUB.ADD:
						let { catName, songName, Verses } = response.payload,
						newCatId = null;
						if(!fastAccess[catName]){
							newCatId = this.props.newCatId
							props.addCategorie(catName,newCatId);
							notifier2.addSpeed(this.listText.categorieInserted(lang,catName));
						}
						else{
							newCatId = fastAccess[catName].id;
						}
						props.addSong(0,songName, newCatId, Verses, 'online');
						notifier2.addSpeed(this.listText.songInserted(lang,catName,songName));

						if(this.streamCatName.toLowerCase() == catName.toLowerCase() && this.streamSongName.toLowerCase() == songName.toLowerCase()){
							props.setCurrentCat(catName,newCatId);
							let songId = fastAccess[catName]['online'][songName.toUpperCase()];
							props.setCurrentSong(songId,newCatId,'online',this.streamPosition);
						}
						break;
					case SUB.STREAMDELETED:
						notifier2.addSpeed(this.streamText.stopped(lang,streamName));
						break;
					case SUB.CHANGED_SONG:
						notifier2.addSpeed(downloadText.error(lang,songName));
						break;
					default:
						console.error("Inregognized response from downloadSong fetcher",action,response);
				}
			},
			e:({status,response})=>{
				delete downloadSong.inFetch[url];
				notifier2.addSpeed(text.downloadError(lang,songName));
			}
		})
	}

	updateCurrentStreamInfo(catName,songName,position){
		if(!arguments.length){
			delete this.streamCatName;
			delete this.streamSongName;
			delete this.streamPosition;
		}
		else{
			this.streamCatName = catName;
			this.streamSongName = songName;
			this.streamPosition = position;
		}
	}

	subscribe(streamName,update){
		let props = this.props;
		let url = `stream/subscribe?n=${streamName}${(update)? "&u="+update:""}`;
		fetcher({
					url,
					setter: (xml)=>{
						fetcher.subscription = {abort:()=>{
							xml.abort();
							delete this.subscribe.registration;
						}}
					},
					s: (response)=>{
						if(response){
							try{
								let { catName, songName, position } = response,
								songNameL = songName && songName.toUpperCase(),
								subscribeMethod = this.subscribe,
								registration = subscribeMethod.registration,
								fastAccessCatName = null,
								fastAccessCatNameOnline = null,
								fastAccessCatNameOffline = null,
								catId = null,
								songNotInOnlineCat = undefined,
								songNotInOfflineCat = undefined,
								songId = null,
								textStream = this.streamText,
								textSubscription = textStream.subscription,
								subscriptionSuccess = textSubscription.success,
								subscriptionError = textSubscription.error,
								dontHaveSong = textSubscription.dontHaveSong,
								endSubscription = textSubscription.end,
								{ lang, setCurrentSong, setCurrentCat, subscribeToStream } = this.props;

								if(catName && songName){
									fastAccessCatName = fastAccess[catName],
									catId = fastAccessCatName && fastAccessCatName.id
									fastAccessCatNameOnline = fastAccessCatName && fastAccessCatName.online[songNameL],
									fastAccessCatNameOffline = fastAccessCatName && fastAccessCatName.offline[songNameL],
									songNotInOnlineCat = (fastAccessCatNameOnline === false) || (fastAccessCatNameOnline === undefined),
									songNotInOfflineCat = (fastAccessCatNameOffline === false) || (fastAccessCatNameOffline === undefined);

									if(!songNotInOnlineCat || !songNotInOfflineCat){
										if(songNotInOnlineCat)
											songId = fastAccessCatNameOffline;
										else
											songId = fastAccessCatNameOnline;
									}
								}


								if(!registration){
									subscribeMethod.registration = streamName;
								}
								else if(registration != streamName){
									subscribeMethod.registration = streamName;
								}

								switch(response.action){
									case SUB.UPDATE:

										if(!update){
											notifier2.addSpeed(subscriptionSuccess(lang,streamName))
										}
										if(!response.songName || !response.catName){

										}
										else if(!fastAccessCatName || (songNotInOnlineCat && songNotInOfflineCat)){
											this.downloadSong(catName,songName,streamName)
										}
										else{
											setCurrentCat(catName,fastAccessCatName.id);
											let location = (songNotInOfflineCat)? 'online':'offline';
											setCurrentSong(songId,catId,location,parseInt(position,10));
												
										}
										this.updateCurrentStreamInfo(catName, songName, position);


										this.subscribe(streamName,true);
										break;

									case SUB.UNSUBSCRIBE:
										
										notifier2.addSpeed(endSubscription(lang, streamName));
										delete subscribeMethod.registration;
										props.subscribeToStream(false);
										this.updateCurrentStreamInfo();
										break;

									case SUB.NOTHING:

										notifier2.addSpeed(textSubscription.nothing(this.props.lang, streamName));
										props.subscribeToStream(false);
										break;
									default:

										notifier2.addSpeed(subscriptionError(lang, streamName));
										console.log("fetcher Odd response",response);
										subscribeToStream(false);
										this.updateCurrentStreamInfo();
								}
							}
							catch(e){
								alert(e);
							}

						}
						
					},
					e:({status,response})=>{
						notifier2.addSpeed( this.text.Stream.subscription.error(this.props.lang, streamName));
						props.subscribeToStream(false);
						console.log("Error while trying to subscribe to stream",streamName,status,response);
					}
				});
	}

	registerToStream(streamName){
		let props = this.props;
		if(streamName != this.subscribe.registration){
			abortSubscription(fetcher);
			this.subscribe(streamName);
			props.subscribeToStream(true);
		}
	}

	render(){
		let hide = (this.props.view)? '':'whoosh';
		let props = this.props;
		let { list, showSearch, searchResult, searchTerm } = this.state;
		let { banner, open } = props.image;

		if(searchTerm)
			list = searchResult;

		function switchStreamListVisibility(event){
			event.preventDefault(); 
			event.stopPropagation(); 
			props.changeStreamListView(!props.view);
		}

		return (
			<div className="streamList il c3 tip">
				<div>
					{ 
						(props.appReachable)? 
							<a className="streamListLink" onClick={switchStreamListVisibility} href="#"><img className="vmid" src={`img/${banner}`} /> <Liner additionalClass="vmid"/><span className="counter">{this.state.list.length}</span></a> : ""
					}
				</div>
				{ (props.appReachable)?
					<div className={`abs abBottom shadowL list listStream silverBack BLRad ${hide}`}>
						<Search handleSearch={this.handleSearchInput} view={showSearch} />
						<div className="items">
							{
								list.map((streamName)=>
										<div key={streamName} className="il f1">
											<div className="il">
												<span>
													<a onClick={()=> this.registerToStream(streamName)}>{streamName}</a>
												</span><img src={`img/${open}`} />
											</div>
										</div>
								)
							}
						</div>
					</div> : ''
				}
			</div>
			)
	}
}
StreamList.contextType = Texts;

const StreamListC = connect((state)=>({
	appReachable: state.appReachable,
	lang: state.language,
	view: state.ui.show.streamList,
	image: state.images.streamList,
	newCatId: state.Categories.length
}), { subscribeToStream: Action.subscribeToStream, setAppUnreachable: Action.setAppUnreachable, addCategorie: Action.addCategorie, addSong: Action.addSong, setCurrentCat: Action.setCurrentCat, setCurrentSong: Action.setCurrentSong, changeStreamListView: Action.changeStreamListView })(StreamList);

const SongContent = (props)=>{
	return (
		<div className="body">
			<ContentC />
		</div>
		)
}

class Content extends React.Component{
	constructor(props,context){
		super(props);
		
		this.Text = context.Favorite;
		this.storageHandler = storageHandler();
		this.scrollHandler = scrollHandler.bind(this);
		this.state = { Verses:[], currentCatName:"", index:0, currentSongName:"", initialIndex:""};
		this.goToVerse = this.goToVerse.bind(this);
		this.clickHandler = this.clickHandler.bind(this);
		this.initialVerseIndex;
		this.propIndex;
	}
	
	componentDidMount(){
		this.listDiv = document.getElementById("content");
		this.papa = document.querySelector("#content .papa");
		//n('Content',this.initTime,undefined,2);
	}

	shouldComponentUpdate(nextProps,nextState){
		let props = this.props;
		let state = this.state;
		let nextCatName = nextProps.currentCat.name;
		let catName = props.currentCat.name;
		let songName = props.currentSongName;
		let nextSongName = nextProps.song.name;
		let verseIndex = state.index;
		let nextVerseIndex = nextState.index;
		let nextIsFavorite = nextProps.isFavorite,
		isFavorite = props.isFavorite

		if(nextCatName != catName || songName != nextSongName || verseIndex != nextVerseIndex || isFavorite != nextIsFavorite)
			return true;

		return false;
	}

	static getDerivedStateFromProps(props,state){
		let currentCatName = props.currentCat.name;
		let stateCurrentCatName = state.currentCatName;
		let currentSongName = props.song.name;
		let stateCurrentSongName = state.currentSongName;
		let propIndex = props.verseIndex;
		let initialIndex = state.initialIndex;

		if(initialIndex !== propIndex || currentCatName != stateCurrentCatName || currentSongName != stateCurrentSongName){
			return {
				Verses: props.song.Verses,
				currentCatName,
				index: propIndex,
				currentSongName,
				initialIndex: (initialIndex !== propIndex)? propIndex: initialIndex
			}
		}

		return null;

	}

	goToVerse(index){
		console.log("go to Verse",index);
		this.setState({index});
	}

	componentDidUpdate(prevProps){
		invoqueAfterMount('content');

		let listDiv = this.listDiv;
		let listHeight = listDiv.getBoundingClientRect().height;
		let papaHeight = this.papa.getBoundingClientRect().height;

		if(listHeight < papaHeight && !listDiv.ontouchmove){
			let trackedTouchs = [];

			listDiv.ontouchmove = (event)=>{
				this.scrollHandler(listDiv,event,trackedTouchs);
			}
		}
		else if(listHeight > papaHeight && listDiv.ontouchmove){
			delete listDiv.ontouchmove;
		}

		//n('Content',this.initTime);
		//n('Content',this.initTime,undefined,2);
	}

	addToFavorite(catName,catId,songName,songId,location,lang,fn,notify){
		try{
			let Text = this.Text;
			if(!location)
				console.error(`song ${songName} don't have a location`);

			fn(catName, catId, songName, songId,location);

			notify.addSpeed(Text.added(lang,songName));
		}
		catch(e){
			console.error("Favorite addToFavorite Error:",e);
		}
	}

	removeFromFavorite(catName,catId,songName,songId,lang,fn,notify){
		try{	
			let Text =this.Text;

			fn(catName,catId,songName,songId);
			notify.addSpeed(Text.deleted(lang,songName));
		}
		catch(e){
			console.error("Favorite removeFromFavorite Error:",e);
		}
		
	}

	isFavorite(catName,songName){
		let props = this.props;
		if(props.isFavorite)
			return true;
		else{
			let favorite = this.storageHandler.inStore('favorites',{},JSON.parse);
			if(favorite[catName] && favorite[catName][songName])
				return true;

			return false;
		}
	}

	clickHandler(event){
		let { currentCatName, currentSongName, Verses } = this.state,
		props = this.props,
		catId = props.currentCat.id,
		{ isFavorite, lang, addToFavorite, removeFromFavorite, song } = props;

		event.preventDefault();
		event.stopPropagation();

		if(!isFavorite){
			this.addToFavorite(currentCatName,catId,currentSongName, song.id, song.location, lang, addToFavorite, notifier2)
		}
		else{
			this.removeFromFavorite(currentCatName,catId, currentSongName, song.id, lang, removeFromFavorite, notifier2);
		}

	}

	voidHandler(event){
		event.preventDefault();
	}


	render(){
		this.initTime = Date.now();
		let { Verses, currentCatName, index } = this.state;
		let props = this.props;
		let currentVerse = (Verses[index] && Verses[index].Text) || "";
		let catName = currentCatName;//props.currentCat.name;
		let songName = props.song.name;
		let location = props.song.location;
		let favImg = props.images.favorite;
		let lang = props.lang;
		//let Verses = props.song.Verses;
		let self = this;
		function clickHandler(event){
			event.preventDefault(); 
			event.stopPropagation(); 
			(!props.isFavorite)? 
				self.addToFavorite(catName, songName, Verses, location, lang, props.addToFavorite, notifier2) : 
				self.removeFromFavorite(catName,songName,lang, props.removeFromFavorite, notifier2) 
		}

		function voidHandler(event){
			event.preventDefault();
		}

		return (
			<>
				<div id="content">
					<div className="papa">
						<h3>{songName}<a className="imFavorite" onClick={(songName)? this.clickHandler : this.voidHandler } href="#"><img src={(props.isFavorite)? `img/${favImg.unlove}`:`img/${favImg.love}`} /></a></h3>
						<p>{currentVerse}</p>
					</div>
				</div><br/>
				<ArrowNav index={index} catName={currentCatName} songName={songName} total={Math.max(0,Verses.length -1)} images={props.images.arrows} goToVerse={this.goToVerse} />
				<NavHelper goToVerse={this.goToVerse} currentIndex={index} catName={currentCatName} songName={songName} length={Verses.length} />
			</>

			)
	}
}
Content.contextType = Texts;

const ContentC = connect((state,ownProps)=>{
	return {
		currentCat: state.currentCat,
		song: state.currentSong,
		verseIndex: state.ui.navigation.verseIndex,
		isFavorite: (state.currentCat.name && state.favorites[state.currentCat.name] && state.favorites[state.currentCat.name][state.currentSong.name] && true ) || false,
		images: state.images,
		lang: state.language,
		currentSongName: state.currentSong.name,
		...ownProps
	}
}, { addToFavorite: Action.addToFavorite, removeFromFavorite: Action.removeFromFavorite })(Content);

class ArrowNav extends React.Component{
	constructor(props){
		super(props);
		this.backArrowHandler = this.backArrowHandler.bind(this);
		this.nextArrowHandler = this.nextArrowHandler.bind(this);
	}

	shouldComponentUpdate(nextProps,nextState){
		let props = this.props;
		let state = this.state;
		if(nextProps.currentCatName != props.currentCatName || nextProps.songName != props.songName || nextProps.index != props.index)
			return true;
		return false;
	}

	componentDidUpdate(){
		let c = 15;
		let m = 25;
	}

	backArrowHandler(event){
		let { total, current, catName, songName,images, goToVerse, index } = this.props;

		event.preventDefault(); 
		event.stopPropagation(); 
		indexChanger(Math.max(0,--index),catName,songName, goToVerse,S); 

	}

	nextArrowHandler(event){
		let { total, current, catName, songName,images, goToVerse, index } = this.props;

		event.preventDefault(); 
		event.stopPropagation(); 
		indexChanger(Math.min(total,++index),catName,songName, goToVerse ,S);

	}

	render(){
		let { total, current, catName, songName,images, index, goToVerse } = this.props;

		let prevView = (index != 0 && index != undefined)? "":"whoosh",
		nextView = (index < total && songName)? "":"whoosh";
 

		return (
			<div className="lr il">
				<a className={`prevSong ${prevView}`} onClick={this.backArrowHandler} href="#"><img src={`img/${images.prev}`} /></a>
				<a className={`nextSong ${nextView}`} onClick={this.nextArrowHandler} href="#"><img src={`img/${images.next}`} /></a>
			</div>
		)
	}
}

const NavHelper = ({length,currentIndex, goToVerse, catName, songName})=>{

	function clickHandler(event,i){
		event.preventDefault(); 
		event.stopPropagation(); 
		indexChanger(i,catName,songName, goToVerse,S); 
	}

	return (
		<div id="navHelper" className="abs">
			{[...Array(length)].map((verse,i)=>
				<div key={i} className={(i == currentIndex)? 'bHighlight':''}>
					<a className={`navNumber ${(i == currentIndex)? 'selected':''}`} onClick={(event)=> clickHandler(event,i)} href="#">{i+1}</a>
				</div>
			)}
		</div>
		)
}

class PopUp extends React.Component{
	constructor(props){
		super(props);
		this.adjustHeight = this.adjustHeight.bind(this);
		this.checkIfMustBeVisible = this.checkIfMustBeVisible.bind(this);
		this.getDimensions = this.getDimensions.bind(this);
		this.isInTheMiddle = this.isInTheMiddle.bind(this);
		this.putInTheMiddle = this.putInTheMiddle.bind(this);
		this.wHeight = window.innerHeight;
	}



	componentDidMount(){
		this.node = document.querySelector(".popUp");
		this.box = document.querySelector(".popUp .Box");
		let dimensions = this.node.getBoundingClientRect();
		this.height = dimensions.height;
		this.top = dimensions.top;

		window.onresize = ()=>{
			this.height = this.node.getBoundingClientRect().height;
			if(window.innerHeight != this.wHeight)
				this.wHeight = window.innerHeight;
			this.adjustHeight();
		}
	}

	isInTheMiddle(){
		let height = this.height,
		node = this.node, 
		wHeight = this.wHeight,
		top = this.top,
		middle = (wHeight - height) / 2;
		if(middle != top)
			return false;
		return true;
	}

	putInTheMiddle(){
		let height 	= this.height,
		node 		= this.node,
		wHeight 	= this.wHeight;

		this.top = (wHeight - height) /2;
		node.style.top 	= `${this.top}px`;
	}

	getDimensions(){
		return this.node.getBoundingClientRect();
	}

	checkIfMustBeVisible(){
		let { addCatView, addSongView, createStreamView } = this.props;

		return (addCatView || addSongView || createStreamView);
	}

	adjustHeight(){
		let boxHeight = this.box.getBoundingClientRect().height;
		let height = this.height;
		let wHeight = this.wHeight;

		if(boxHeight > height || boxHeight < height){
			if(wHeight >= boxHeight){
				let newHeight = boxHeight, newTop = (wHeight - newHeight)/2;
				this.top = newTop;
				this.height = newHeight;
				this.node.style.height 	= `${this.height}px`;
				this.node.style.top 	= `${this.top}px`;
			}
			else{
				this.height 	= wHeight;
				this.top 		= 0;
				this.node.style.height 	= `${this.height}px`;
				this.node.style.top 	= `${this.top}px`;
			}
		}
		else if(boxHeight < wHeight && !this.isInTheMiddle()){
			this.putInTheMiddle();
		}
	}

	render(){
		let props = this.props;
		let hide = this.checkIfMustBeVisible() ? '' : 'whoosh';
		return (
			<div className={`popUp ${hide}`}>
				<div className={`popWrapper abs`}>
					<div className="wrap">
						<div className="Box il silverBack TLRad TRRad BLRad BRRad">
							<SetupPopUpC adjustHeight={this.adjustHeight} />
								<AddSongDivC adjustHeight={this.adjustHeight} />
								<AddCatDivC adjustHeight={this.adjustHeight}  />
									<CreateStreamC adjustHeight={this.adjustHeight} />
						</div><Liner />
					</div>
				</div>
			</div>
		)
	}
}

const PopUpWrapper = connect((state)=>{
	return {
		VersesDiv: state.ui.addSongDiv.Verses,
		subscribedToStream: state.subscribedToStream,
		addCatView: state.ui.show.addCatDiv,
		addSongView: state.ui.show.addSongDiv,
		createStreamView: state.ui.show.createStreamDiv,
		isStreaming: state.isStreaming,
		lastCatId: state.Categories.length,
	}
},{ setCurrentSong: Action.setCurrentSong, updateSong: Action.updateSong, addSong: Action.addSong, changeAddSongView: Action.changeAddSongView, updateCategorie: Action.updateCategorie, updateSongList: Action.updateSongList, addCategorie: Action.addCategorie, changeCatView: Action.changeCatView, setAppUnreachable: Action.setAppUnreachable, changeStreamCreateView: Action.changeStreamCreateView, forceUpdate: Action.setForceUpdate, changeVerseDivNumber: Action.changeVerseDivNumber })(PopUp);


class SetupPopUp extends React.Component{
	constructor(props){
		super(props);
		this.popUpVisible = false;
	}

	componentDidUpdate(){
		let { addCatView, addSongView, createStreamView } = this.props;
		if(addCatView || addSongView || createStreamView){
			if(!this.popUpVisible){
				this.props.adjustHeight();
				this.popUpVisible = true;
			}
		}
		else if(this.popUpVisible){
			this.popUpVisible = false;
		}
	}

	render(){
		return null;
	}

}

const SetupPopUpC = connect((state)=>{
	return {
		addCatView: 		state.ui.show.addCatDiv,
		addSongView: 		state.ui.show.addSongDiv,
		createStreamView: 	state.ui.show.createStreamView
	}
})(SetupPopUp);

class Settings extends React.PureComponent{

	constructor(props){
		super(props);
		this.state = {
			view:false
		}
		this.initTime = Date.now();
		this.changeView = this.changeView.bind(this);
	}

	componentDidMount(){
		//alert(`it taked ${Date.now() - this.initTime} ms second to Mount Settings`);
	}

	componentDidUpdate(){
		invoqueAfterMount('settings');
	}

	changeView(view){
		this.setState({view});
	}

	render(){
		let { controls, setControl, changeDevToolView, viewDevTool } = this.props;
		let { view } = this.state;

		let hide = (view)? '':'whoosh';
		return (
			<div className="settings il c0 tip" id="settings">
				<SettingsTogglerC changeSettingsView={this.changeView} />
				<div className={`abs abBottom list shadowR BRRad BLRad silverBack ${hide}`}>
					<div>
						<DayModeC />
						<LanguageC />
						<ControlC />
						<DevToolViewTooglerC />
					</div>
				</div>

			</div>
			)
	}
}

class SettingsToggler extends React.Component{
	constructor(props){
		super(props);
		this.clickHandler = this.clickHandler.bind(this);
	}

	componentDidUpdate(prevProps){
		let { view, changeView, changeSettingsView } = this.props;
		
		if(prevProps.view != view){
			changeSettingsView(view);
		}
	}

	clickHandler(event){
		let { changeView, view, changeSettingsView } = this.props;
		event.preventDefault();
		event.stopPropagation();

		changeView(!view);
		changeSettingsView(!view);
	}

	render(){
		let { view } = this.props;

		return (
			<div>
				<a className="settingsToggler" onClick={this.clickHandler} href="#"><img className="vmid" src="img/settings.png" /><Liner additionalClass="vmid"/>
				</a>
			</div>
			)
	}
}

const SettingsTogglerC = connect((state,ownProps)=>({
	view: 		state.ui.show.settingList,
	...ownProps
}),{ changeView: Action.changeSettingListView})(SettingsToggler);

const SettingsC = connect((state,ownProps)=>({
	nightMode: 		state.ui.nightMode,
	lang: 			state.language,
	controls: 		state.keys.alt,
	view: 			state.ui.show.settingList,
	viewDevTool: 	state.ui.show.devTool,
	...ownProps

}),{ changeMode: Action.changeNightMode, changeLanguage: Action.changeLanguage, changeView: Action.changeSettingListView, setControl: Action.setControl, changeDevToolView: Action.changeDevToolView })(Settings);

class DayMode extends React.PureComponent{
	constructor(props){
		super(props);
		this.changeMode = this.changeMode.bind(this);
		this.initTime = Date.now();
	}

	componentDidMount(){
		let { night } = this.props;
		let react_container = document.getElementById("react-container");
		if(!react_container)
			throw Error("DayMode:componentDidMount No react container found");
		else{
			this.reactContainer = react_container;
			this.baseClassName = react_container.className.split(" ")[0];

			if(night){
				this.reactContainer = `${this.baseClassName} night`;
			}
		}
	}

	componentDidUpdate(){
		let { night } = this.props,
		reactContainer = this.reactContainer,
		baseClassName = this.baseClassName,
		newClassName = (night)? `${baseClassName} night`: baseClassName

		reactContainer.className = newClassName;
	}

	changeMode(event){
		let { changeMode,night } = this.props;
		event.preventDefault(); 
		event.stopPropagation(); 

		changeMode(!night);
	}
	render(){
		let { night } = this.props;
		return (
			<div className="il f1 dayMode">
				<span id="night">Night Mode </span> <a className="modeShift" href="#" onClick={this.changeMode}>{(night)? "On":"Off"}</a>
			</div>
		)
	}
}

const DayModeC = connect((state,ownProps)=>{
	return {
		night: 		state.ui.nightMode,
		...ownProps
	}
},{ changeMode: Action.changeNightMode})(DayMode);

class Language extends React.Component{
	constructor(props){
		super(props);
		this.state = { show:false};
		this.changeView = this.changeView.bind(this);
		this.initTime = Date.now();
	}

	componentDidMount(){
		//alert(`it Taked ${Date.now() - this.initTime} ms to Mount Language`);
	}

	componentDidUpdate(){
		invoqueAfterMount('language');
	}

	changeView(){
		let { show } = this.state;
		this.setState({show:!show});
	}

	render(){
		let { changeLanguage, currentLanguage } = this.props;
		let hide = (this.state.show)? '':'whoosh';
		let list = [ "En","Fr" ];

		return (
			<div className="language il f1">
				<span id="language">Language</span><a className="langShift" href="#" onClick={this.changeView}>{currentLanguage}</a>
				<div className={`list ${hide}`}>
					{
						list.map((lang2,i)=>
							<a className={(currentLanguage == lang2)? signal.success:''} key={i} href="#" onClick={()=> changeLanguage(lang2)}>{lang2}</a>
							)
					}
				</div>
			</div>
		)
	}
}

const LanguageC = connect((state,ownProps)=>{
	return {
		currentLanguage: state.language,
		...ownProps
	}
},{ changeLanguage: Action.changeLanguage })(Language);

const Control = ({controls,setControl})=>{

	function clickHandler(event){
		event.preventDefault(); 
		event.stopPropagation(); 
		setControl(!controls);
	}

	return (
		<div className="control il f1">
			<span id="control">Controls</span><a className='controlShift' onClick={clickHandler} href="#">{(controls)? 'On':'Off'}</a>
		</div>
	)
}

const ControlC = connect((state,ownProps)=>{
	return {
		controls: state.keys.alt,
		...ownProps
	}
},{ setControl: Action.setControl })(Control);

class DevToolViewToogler extends React.PureComponent{
	constructor(props){
		super(props);
		this.state = {view:props.view};
		this.changeView = this.changeView.bind(this);
	}

	changeView(newView){
		this.setState({view:newView});
		this.props.changeDevToolView(newView);
	}


	render(){
		let stateView = this.state.view;
		let view = (stateView)? 'On':'Off';
		return (
			<div>
				<span>DevTool View</span><a onClick={()=> this.changeView(!stateView)}>{view}</a>
			</div>
			)
	}
}

const DevToolViewTooglerC = connect((state,ownProps)=>{
	return {
		view: state.ui.show.devTool
	}
},{ changeDevToolView: Action.changeDevToolView })(DevToolViewToogler);
export class Guider extends React.PureComponent{
	constructor(props){
		super(props);
		this.state = { step: props.step, section: props.step.section, action: props.step.section.action, style:{}, lang:props.lang };
		this.toStep = this.toStep.bind(this);
		this.toSection = this.toSection.bind(this);
		this.animate = this.animate.bind(this);
		this.goToStep = this.goToStep.bind(this);
		this.goToSection = this.goToSection.bind(this);
		this.clear = this.clear.bind(this);
		this.adjustHeight = adjustHeight.bind(this);
		this.isInTheMiddle = this.isInTheMiddle.bind(this);
		this.putInTheMiddle = this.putInTheMiddle.bind(this);
		this.setDimensions = this.setDimensions.bind(this);
		this.moveHandler = compose(()=> this.putInTheMiddle(this.isInTheMiddle),this.setDimensions,this.adjustHeight);
	}

	componentDidMount(){
		this.node = document.querySelector(".Guider");
		this.box = document.getElementById("Guider");
		this.wHeight = window.innerHeight;
		this.moveHandler(this.node,this.box);
	}

	static getDerivedStateFromProps(props,state){
		if(props.lang != state.lang){
			let action = state.action;
			if(action && action.getClearer()){
				action.reset(true);
				action.getClearer()();
			}

			return {...state, lang:props.lang};
		}
		return null;
	}

	setDimensions(){
		let dimensions = this.node.getBoundingClientRect();
		this.height = dimensions.height;
		this.top = dimensions.top;
	}

	componentDidUpdate(){

		this.moveHandler(this.node,this.box);

		invoqueAfterMount("guider");
	}

	isInTheMiddle(){
		let height = this.height,
		node = this.node,
		wHeight = this.wHeight,
		top = this.top,
		middle = (wHeight - height) / 2;
		if(middle != top)
			return false;
		return true;
	}

	putInTheMiddle(InTheMiddle){
		if(!InTheMiddle()){
			let height = this.height,
			node = this.node,
			wHeight = this.wHeight;

			this.top = (wHeight - height) /2;
			node.style.top = `${this.top}px`;
		}
	}


	toStep(step){
		this.animate(false).then(()=>{
			this.setState({...this.state, section:step.section, step, action:step.section.action});
		}).then(()=>{
			this.animate(true);
		}).Oups((e)=>{
			console.error("Guider toStep catch Error",e);
		})
	}
	toSection(section){
		let state = this.state;
		this.animate(false).then(()=>{
			this.setState({...state, section, action: section.action});
		}).then(()=>{
			this.animate(true);
		}).Oups((e)=>{
			console.error("Guide toSection catch error",e);
		})
	}
	toAction(doAction){
		let state = this.state;
		let currentAction = state.action;
		doAction.then(({updateText})=>{
			if(updateText)
				this.forceUpdate();
			else if(!currentAction.nextAction && state.section.nextSection)
				this.toSection(state.section.nextSection);
			else
				this.setState({...state, action: currentAction.nextAction});
		}).Oups((e)=>{
			console.error("toAction catch error",e);
		})
	}
	animate(add){
		return new Promise((resolve,reject)=>{
			let { main } = this.refs;
			let state = this.state;
			let op = Number(getComputedStyle(main).opacity);
			let c = setInterval(()=>{
				if(add && op < 1.0){
					op = Number((op + 0.1).toPrecision(1));
					main.style.opacity = op;
					return 
					
				}
				else if(!add && op > 0.0){
					op = Number((op - 0.1).toPrecision(1));
					main.style.opacity = op;
					return 
					
				}
				clearInterval(c);
				resolve();
			},20);
		})
	}

	clear(){
		let { action } = this.state;
		return (action && action.getClearer())? ()=>{
			action.reset(false);
			return action.getClearer()()
		} :
		()=> Promise.resolve(true);
	}

	goToSection(next=true){
		let { section } = this.state;

		let clear = this.clear();

		clear().then(()=> this.toSection((next)? section.nextSection: section.prevSection)
			).Oups((e)=>{
				console.error("Couldn't clear to go to ",((next)? 'next':'prev'),'step');
			})
	}

	goToStep(next=true){
		let { step } = this.state;
		let clear = this.clear();

		clear().then(()=> this.toStep((next)? step.nextStep: step.prevStep)).Oups((e)=>{
			console.error("Couldn't clear to go to ",((next)? 'next':'prev'),'step');
		})
	}

	render(){
		let { show, end } = this.props;
		let stepStyle = this.state.style;
		let { step, section, action, lang } = this.state;
		window.section = section;
		window.action = action;
		let title = (section.getTitle() && section.getTitle()(lang)) || step.getTitle()(lang);
		let nextSection = section.nextSection;
		let prevSection = section.prevSection;
		let nextStep = step.nextStep;
		let prevStep = step.prevStep;
		let process = (action)? action.doProcess(): null;
		let goToSection = this.goToSection;
		let goToStep = this.goToStep;
		let clear = this.clear();

		return (
			<div className="Guider" id="main" ref="main">
				<div className="wrap il">
					<div id="Guider" className="il vmid Box TLRad TRRad BLRad BRRad">
						<div className="section">
							<div className="il AlL">
								{
									(prevSection && prevSection.getTitle)? 
										<a className="blueBack AllRound" onClick={()=> goToSection(false)} href="#">{(prevSection.getTitle()(lang)) || ""}
										</a>: ""
								}
							</div>
							<div className="il AlC">
								<a className="littleBox currentSection">{title || "WELCOME TO OUR"}</a>
							</div>
							<div className="il AlR">
								{
									(nextSection && nextSection.getTitle)? 
										<a className="blueBack AllRound" onClick={()=> goToSection()}>{(nextSection.getTitle()(lang)) || ""}
										</a>: ""
								}
							</div>
						</div>
						<div className="text">
							{
								section.getText().map((text,i)=>
									<p key={i} id={i}>{text(lang)}</p>
									)
							}
						</div>
						<div className="textAction">
							{
								(action)? 
									<nav>
										<ul>
											{action.getText().map((text,i)=>
												<li style={{width:"auto"}} key={i}>{text(lang)}</li>
											)}
											{(process)? this.toAction(process()): ""}
										</ul>
									</nav>
									:
									''
							}
						</div>
						<div className="step">
							<div className="il AlL">
								{
									(prevStep && prevStep.getTitle)? 
										<a className="blueBack" onClick={()=> goToStep(false)} href="#">{prevStep.getTitle()(lang)}
										</a>: ""
								}
							</div>
							<div className="il AlC">
								<a className="currentStep">{step.getTitle()(lang)}</a>
							</div>
							<div className="il AlR">
								{
									(nextStep && nextStep.getTitle)? 
										<a className="blueBack" onClick={()=>goToStep()} href="#">{nextStep.getTitle()(lang)}
										</a>: ""
								}
							</div>
						</div>
						<div>
							<a onClick={()=> {clear().then(end)}} href="#">FERMER</a>
						</div>
					</div><Liner additionalClass="vmid" />
				</div>
			</div>
			)
	}
}

const GuiderConnected = connect((state,ownProps)=>{
	return {
		lang:state.language,
		...ownProps
	}
})(Guider)

const Styles = ({lists})=>{
	return (
		<>
			{
				lists.map((list,i)=>{
					let l2 = {...list};
					let data = l2.data;
					delete l2.data;
					return ( <style key={i} {...l2}>{(data)? data:''}</style> );
				})
			}
		</>
		)
}
const Metas = ({lists})=>{
	return (
		<>
			{
				lists.map((list,i)=>
					<meta key={i} {...list} />
				)
			}
		</>
		)
}
const Links = ({lists,i})=>{
	return (
		<>
			{
				lists.map((list,i)=>
					<link key={i} {...list} />
				)
			}
		</>
		)
}

const Scripts = ({lists})=>{
	return (
		<>
			{
				lists.map((list,i)=> {
					let l2 = {...list};
					let data = l2.data;
					delete l2.data;
					return ( <script dangerouslySetInnerHTML={{__html:(data)? data:''}} key={i} {...l2}></script> )
				})
			}
		</>
		)
}

export const HTML = ({data, styles,metas,links, scripts,title,store,nodeJs})=>{
	function ap(t){
		let a = document.body;
		let c = document.createElement("p");
		c.textContent = t;
		a.appendChild(c);
	}
	return (
		<html>
			<head>
				<title>{title}</title>
				{
					(metas && metas.length)? <Metas lists={metas} /> : ''
				}
				{
					(links && links.length)? <Links lists={links} /> : ''
				}
				{
					(styles && styles.length)? <Styles lists={styles} /> : ''
				}
				{
					(scripts.head && scripts.head.length)? <Scripts lists={scripts.head} /> : ''
				}
			</head>
				<body>
					<div id="react-container" className="wrapper">
						<App lang={data.language} direction={data.ui.direction} />
					</div>
					{
						(scripts.tail && scripts.tail.length)? <Scripts lists={scripts.tail} /> : ''
					}
				</body>
		</html>
		)
}

export class App extends React.Component{
	constructor(props){
		super(props);
		let guider = localStorage.guider;
		this.state = {showGuide:(props.step)? true:false};
		this.endGuide = this.endGuide.bind(this);
		this.keyRecorder = this.keyRecorder.bind(this);
		this.initTime = Date.now();

	}

	endGuide(){
		this.setState({showGuide:false});
		window.removeEventListener('keydown',this.keyRecorder);
		localStorage.guider = true;
	}

	componentDidMount(){
		window.addEventListener('keydown',this.keyRecorder);
		//n('App',this.initTime,'Mount');
	}

	keyRecorder(event){
		if(event.key == "g"){
			let main = document.getElementById("main");
			let dis = getComputedStyle(main).display;
			if(dis == "none")
				main.style.display = "inline-block";
			else
				main.style.display = "none";
		}
	}

	render(){
		let {showGuide} = this.state;
		let { step, lang, direction, streamManager,fAccess } = this.props;

		console.log("direction",direction);
		return (
			<ErrorBoundary>
				<SetupC streamManager={streamManager} fAccess={fAccess} fastAccess={this.props.fastAccess} />
				<First direction={direction}  lang={lang}  streamManager={this.props.streamManager} />
				<Second direction={direction} />
				{
					(showGuide)? <GuiderConnected end={this.endGuide} step={step} />: ''
				}
				<PopUpWrapper />
				<DevToolC />
			</ErrorBoundary>
			)
	}
}

class Nothing extends React.Component{
	constructor(props){
		super(props);
		this.initTime = Date.now();
	}

	componentDidMount(){
		n('Nothing',this.initTime,'Mount')
	}

	render(){
		return <div>
			<p>Maman</p>
		</div>
	}
}



class DevTool extends React.PureComponent{
	constructor(props){
		super(props);
		this.log = this.log.bind(this);
		this.appendText = this.appendText.bind(this);
		this.log = this.log.bind(this);
		this.scrollHandler = scrollHandler.bind(this);
	}

	componentDidMount(){
		this.node = document.getElementById("devTool");

		if(window.innerWidth < 450){
			let self = this;
			console.log = function(){
				self.log.apply(self,['success',...arguments]);
			}
			console.error = function(){
				self.log.apply(self,['error',...arguments]);
			}
		}
		let trackedTouchs = [];

		this.node.ontouchmove = (event)=>{
			try{
				this.scrollHandler(this.node,event,trackedTouchs);
			}
			catch(e){
				console.error(e);
			}
		}
		this.node.ontouchend = function(){
			trackedTouchs = [];
		}
	}

	componentDidUpdate(){
		if(!this.props.view)
			this.node.innerHTML = "";
	}

	log(status){
		let texts = [],
		index = 1,
		item,
		stringRepresentation,
		stringRepresentation2;

		while(item = arguments[index++]){
			if(!is.String(item)){
				if(!is.Number(item)){
					stringRepresentation = item.toString();

					if(stringRepresentation === ({}).toString()){
						try{
							stringRepresentation2 = JSON.stringify(item);

							item = stringRepresentation2.substr(0,60);
						}
						catch(e){
							item = stringRepresentation;
						}
					}
				}
			}

			texts.push(item);
		}

		this.appendText(status,texts.join("  "));
	}

	appendText(status,text){

		//let p = `<p class='${status}'>${text}</p>`,
		let p = document.createElement("p"),
		node = this.node,
		childLength = node.childNodes.length;
		p.className = status;
		p.textContent = text;

		setTimeout(()=>{
			node.appendChild(p);
			//node.innerHTML = node.innerHTML + p;
			node.scrollTop = node.scrollHeight;

			if(childLength >= node.childNodes.length)
				alert("Somethings is wrong");
		},15);
	}

	render(){
		let show = (this.props.view)? '':'whoosh';

		return (
			<div id="devTool" className={show}></div>
			)
	}
}

const DevToolC = connect((state)=>({
	view: state.ui.show.devTool
}))(DevTool);
