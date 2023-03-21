import React  from 'react';
import { storageHandler,compose, relay, getAllReturn, seq, fetcher, abortSubscription,indexChanger, curry, safeOp, registerWorker, is, adjustHeight, scrollHandler, invoqueAfterMount } from '../utilis/BrowserDb.cjs';
import { SUB, insertStatus, signal, displayTime } from '../utilis/constant.cjs';
import config from '../utilis/db.config.cjs';
import Custom from '../utilis/context.cjs';

const { table,filters } = config,
{ cat,song,stream } = table,
cF = cat.fields,
sF = song.fields,
stF = stream.fields,
stq = stream.query,
Categories = {},
Songs = {},
directAccess = {};

let notifier,
notifier2,
db,
Pseq,
fastAccess = {__exec__:[]},
Validator;
fastAccess = {__exec__:[]};


function n(p,time,u='Update',f=1){
	var j = (f ==1 )? notifier : notifier2;
	j.add(`It Taked ${Date.now() - time} ms to ${u} ${p}`);
}

function meticulus(node,fn){
	window.mountNotifier[node] = [fn];
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
		let Text = context.Text,
		store = context.store,
		state = store.getState();

		this.cachingText = Text.caching;
		this.streamText = Text.Stream;
		this.handleKeydown = this.handleKeydown.bind(this);
		this.configureStream = this.configureStream.bind(this);
		this.configureStreamManager = this.configureStreamManager.bind(this);
		this.populateFastAccess = this.populateFastAccess.bind(this);
		this.registerGlobalClickHandler = this.registerGlobalClickHandler.bind(this);
		this.globalClickHandler = this.globalClickHandler.bind(this);
		this.handleDirection = this.handleDirection.bind(this);
		this.store = store;
		this.state = { lang: state.language, direction: state.ui.direction, catListView: state.ui.show.catList, favListView: state.ui.show.favList, streamListView: state.ui.show.streamList, resultView: state.ui.show.resultList, settingListView: state.ui.show.settingList, control: state.keys.alt  };
		this.images = state.images;
	}

	componentDidUpdate(prevProps,prevState){
		let { direction } = this.state;
		if(!this.first)
			this.first = document.getElementById("first");
		if(!this.second)
			this.second = document.getElementById("second");

		if(prevState.direction != direction){
			this.handleDirection(direction);
		}
	}

	populateFastAccess(fAccess){
		/*for(var n in fastAccess){
			if(fastAccess.hasOwnProperty(n))
				fAccess[n] = fAccess[n];
		}*/
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
		let { changeCatListView, changeResultListView, changeStreamListView, changeFavListView, changeSettingListView } = this.props,
		{ resultView, catListView, streamListView, favListView, settingListView } = this.state,
		store = this.store;

		if(event.target.inlist)
			event.stopPropagation();
		else{
			if(catListView){
				store.dispatch(changeCatListView(false));
			}
			if(resultView){
				store.dispatch(changeResultListView(false));
			}
			if(streamListView){
				store.dispatch(changeStreamListView(false));
			}
			if(favListView){
				store.dispatch(changeFavListView(false));
			}
			if(settingListView){
				store.dispatch(changeSettingListView(false));
			}
		}
	}

	configureStream(){
		let { lang } = this.state,
		images = this.images,
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
		let { setControl } = this.props,
		{ controls } = this.state;

		if(event.target.tagName.indexOf('input') != -1 && event.altKey)
			setControl(!controls);
	}

	componentDidMount(){
		let store = this.store,
		Text = this.cachingText,
		streamText = this.streamText,
		{ streamManager, startStream, stopStream, setControl } = this.props,
		{ lang } = this.state,
		images = this.images,
		fAccess = this.props.fastAccess,
		fn = null;

		this.populateFastAccess(this.props.fAccess);
		this.configureStream();
		this.configureStreamManager(fAccess,streamManager,fastAccess);
		this.registerGlobalClickHandler(this.globalClickHandler);
		this.unsubscribe = store.subscribe(()=>{
			let state = this.state,
			cState = store.getState(),
			newState = {};

			if(state.lang != cState.language){
				newState.language = cState.language;
			}
			if(state.direction != cState.ui.direction){
				newState.direction = cState.ui.direction;
			}
			if(cState.ui.show.catList != state.catListView){
				newState.catListView = cState.ui.show.catList;
			}
			if(cState.ui.show.favList != state.favListView){
				newState.favListView = cState.ui.show.favList;
			}
			if(cState.ui.show.resultList != state.resultView){
				newState.resultView = cState.ui.show.resultList;
			}
			if(cState.ui.show.settingList != state.settingListView){
				newState.settingListView = cState.ui.show.settingList;
			}
			if(cState.ui.show.streamList != state.streamListView){
				newState.streamListView = cState.ui.show.streamList;
			}

			if(Object.keys(newState).length){
				this.setState(newState);
			}
		})

		window.db = db;
		window.ss = S;
		window.fetcher = fetcher;
		window.onkeydown = this.handleKeydown;

	}

	componentWillUnmount(){
		this.unsubscribe();
	}

	render(){
		return null;
	}
}
Setup.contextType = Custom;

function First(props){
	let { direction } = props;
	return (
		<div id="first" className={((direction && direction == "Right")? "il TRR ":"il TLL ")+"silverBack"}>
			<DownloaderLine />
			<Notification parent="First"/>
			<Head1 {...props} />
			<div className="songList">
				<OnlineSongs {...props} />
				<OfflineSongs {...props} />
			</div>
		</div>
	)
}

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
		let state = context.store.getState(),
		Text = context.Text,
		currentCat = state.currentCat,
		songs = (state.onlineSongs[currentCat.id] || []),
		show = (songs.length)? true:false;

		this.store = context.store;
		this.state = {show,report:false, songs, to: state.ui.navigation.to, catName: currentCat.name, controls: state.keys.alt, currentCat, downloadImage: state.images.download, updateForced: state.updateForced, increment: state.songIncrement, subscribedToStream: state.subscribedToStream};
		this.initialSongLength = songs.length;
		this.SavedSongs = 0;
		this.failedToSavedSongs = [];
		this.Text = Text.Song;
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
		let store = this.store

		this.unsubscribe = store.subscribe(()=>{
			let cState = store.getState(),
			state = this.state,
			currentCat = cState.currentCat,
			songs = (cState.onlineSongs[currentCat.id] || []),
			newState = {};

			if(state.songs != songs){
				newState.songs = songs;
			}
			if(state.to != cState.ui.navigation.to){
				newState.to = cState.ui.navigation.to
			}
			if(state.catName != currentCat.name){
				newState.catName = currentCat.name;
			}
			if(state.updateForced != cState.updateForced){
				newState.updateForced = cState.updateForced;
			}
			if(state.increment != cState.songIncrement){
				newState.increment = cState.songIncrement;
			}
			if(state.subscribedToStream != cState.subscribedToStream){
				newState.subscribedToStream = cState.subscribedToStream;
			}
			if(state.currentCat != currentCat){
				newState.currentCat = currentCat;
			}
			if(state.controls != cState.keys.alt){
				newState.controls = cState.keys.alt;
			}

			if(Object.keys(newState).length){
				this.setState(newState);
			}
		})

		let c = setInterval(()=>{
			this.node = document.querySelector("#online .papa");
			if(this.node)
				clearInterval(c);
		},15)
	}

	componentWillUnmount(){
		this.unsubscribe();
	}


	componentDidUpdate(prevProps, prevState){
		let { songs, report,catName } = this.state,
		songLength = songs.length;

		if(!this.initialSongLength && songLength || prevState.catName != catName){
			this.initialSongLength = songLength;
		}
		
		if(!songLength && report){
			this.setState({report:false});
		}

		if(this.state.currentCat.name != prevState.currentCat.name && this.state.songs.length){
			this.setState({ show:true })
		}

		invoqueAfterMount('online');
	}

	handleScroll(event){
		let { songs, to } = this.state,
		songLength = songs.length, 
		{ updateSongList } = this.props,
		node = this.node,
		nodeHeight = node.getBoundingClientRect().height,
		scrollTop = node.scrollTop,
		scrollHeight = node.scrollHeight,
		percent = (nodeHeight + scrollTop) / node.scrollHeight * 100,
		store = this.store;

		if(songLength >= to && percent >= 70 ){
			store.dispatch(updateSongList(to+100));
		}
	}

	traceReport(t){		
		let total = this.failedToSavedSongs.length + this.SavedSongs,
		{ currentCat } = this.state;

		if(total >= this.initialSongLength){
			if(this.SavedSongs == this.initialSongLength){
				this.downloading[currentCat] = true;
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
	throwReport(){
		let { addCategorie } = this.props,
		state = this.store.getState(),
		currentCat = state.currentCat,
		catName = currentCat.name,
		catId = currentCat.id,
		offlineSongs = state.offlineSongs;

		if(offlineSongs[currentCat.id]){
			this.downloading[catName] = true;
			this.setState({report:true});
		}
		else{
			db.insertCategorie(catName, catId)().then((id)=>{
				if(id){
					this.downloading[catName] = true;
					store.dispatch(addCategorie(catName,catId));
					this.setState({report:true});
				}
				else{
					console.error("categorie not inserted",id);
				}
			}).catch((e)=>{
				console.error("Error while trying to inserted categorie");
				console.error(e);
			})
		}
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
		let { show, report, songs, downloadImage, currentCat } = this.state,
		{ lang } = this.props,
		mustReport = report,
		onlineClass = `il ${(!currentCat.name || !this.store.getState().onlineSongs[currentCat.id])? 'whoosh':''} ${(show)? 'heightHelper':'online'}`,
		pop =  { ...this.props, ...this.state };

		// Report expect to have status, name, parameter
		if(mustReport){
			let composeBinded = compose.bind(this);
			let getAllReturnBinded = getAllReturn.bind(this);
			let relayBinded = relay.bind(this);
			let notify = this.Notify(lang);
			report = composeBinded(this.traceReport,notify,getAllReturnBinded(this.getPercentage,relayBinded(this.updateSongStatus)));
		}

		return (
			<div id="online" className={onlineClass}>
				<div className="onlineHead il blueBack">
					<a className="vmid tagName" id="onLink" href="#" onClick={this.manageShowing}>Online</a>
					<Counter i={songs.length} />{(show && songs.length)? <Download additionalClass="vmid" src={downloadImage} download={()=> Promise.resolve((db.isBogus)? [null]:[])} action={[()=> { return new Promise((resolve)=> { resolve(false); this.throwReport();})}]} additionalClass="vmid" />:''}
					<Liner additionalClass="vmid" />
				</div>
				{(show)? <div onScroll={this.handleScroll} className="papa"><SongList location="online" counterUpdater={this.counterUpdater} includeAdder={false} {...pop} store={this.store} report={report} Text={this.Text} /></div>:''
			}
			</div>
			)
	}
}
OnlineSongs.contextType = Custom;

class OfflineSongs extends React.Component{
	constructor(props,context){
		super(props);
		let state = context.store.getState(),
		currentCat = state.currentCat,
		songs = (state.offlineSongs[currentCat.id] || []),
		songLength = songs.length,
		Text = context.Text,
		show = (currentCat.name)? true:false;

		this.store = context.store;
		this.state = {show, songs, songLength, updateForced: state.updateForced, controls: state.keys.alt, to: state.ui.navigation.to, increment: state.songIncrement, currentCat, subscribedToStream: state.subscribedToStream};
		this.manageShowing = this.manageShowing.bind(this);
		this.initTime = Date.now();
		this.Text = Text.Song;

	}

	componentDidUpdate(prevProps,prevState){
		invoqueAfterMount('offline');

		if(this.state.currentCat.name != prevState.currentCat.name && this.state.currentCat.name){
			this.setState({show:true});
		}
	}

	componentDidMount(){
		let store = this.store

		this.unsubscribe = store.subscribe(()=>{
			let cState = store.getState(),
			state = this.state,
			currentCat = cState.currentCat,
			songs = (cState.offlineSongs[currentCat.id] || []),
			songLength = songs.length,
			newState = {};

			if(state.songLength != songLength){
				newState.songLength = songLength;
			}
			if(state.songs != songs){
				newState.songs = songs;
			}
			if(state.to != cState.ui.navigation.to){
				newState.to = cState.ui.navigation.to
			}
			if(state.catName != currentCat.name){
				newState.catName = currentCat.name;
			}
			if(state.updateForced != cState.updateForced){
				newState.updateForced = cState.updateForced;
			}
			if(state.increment != cState.songIncrement){
				newState.increment = cState.songIncrement;
			}
			if(state.subscribedToStream != cState.subscribedToStream){
				newState.subscribedToStream = cState.subscribedToStream;
			}
			if(state.controls != cState.keys.alt){
				newState.controls = cState.keys.alt
			}
			if(state.currentCat != currentCat){
				newState.currentCat = currentCat;
			}

			if(Object.keys(newState).length){
				this.setState(newState);
			}
		})
	}

	manageShowing(event){
		event.preventDefault();
		event.stopPropagation();
		let { show } = this.state;
		this.setState({show:!show});
	}
	
	render(){
		let { show, songs,currentCat } = this.state,
		pop = { ...this.props, ...this.state },
		offlineClass = `il ${(currentCat.name)?'':'whoosh'} ${(show)? 'heightHelper':'offline'}`;


		return (
			<div id="offline" className={offlineClass}>
				<div className="offlineHead il open blueBack">
					<a className="vmid tagName" id="offLink" onClick={this.manageShowing} href="#">Local</a>
					<Counter i={songs.length} />
					<Liner additionalClass="vmid" />
				</div>
				{(show)? <div className="papa"><SongList location="offline" includeModify={true} includeAdder={true} {...pop} store={this.store} Text={this.Text} /></div>:''}
			</div>
			)
	}
}
OfflineSongs.contextType = Custom;

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
		let state = context.store.getState(),
		Text = context.Text,
		current = state.currentCat;

		this.store = context.store;
		this.submit = this.submit.bind(this);
		this.updateCat = this.updateCat.bind(this);
		this.Text = Text.addCatDiv;
		this.formError = Text.formError;
		this.formText = Text.formError;
		this.state = {message:()=> "",name:"", signal:signal.system, controls: state.keys.alt, current, catNames: state.Categories, view: state.ui.show.addCatDiv, lastCatId: state.Categories.length, catNamesString: state.Categories.join(' ') };
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
		},
		store = this.store;

		this.unsubscribe = store.subscribe(()=>{
			let cState = store.getState(),
			state = this.state,
			newState = {};

			if(state.controls != cState.keys.alt){
				newState.controls = cState.keys.alt;
			}
			if(state.current != cState.currentCat){
				newState.current = cState.currentCat;
			}
			if(state.catNames != cState.Categories){
				newState.catNames = cState.Categories; 
			}
			if(state.view != cState.ui.show.addCatDiv){
				newState.view = cState.ui.show.addCatDiv
			}
			if(state.lastCatId != cState.Categories.length){
				newState.lastCatId = cState.Categories.length
			}
			if(state.catNamesString != cState.Categories.length){
				newState.catNamesString = cState.Categories.join(' ')
			}

			if(Object.keys(newState).length){
				this.setState(newState);
			}
		})
		this.node = document.getElementById("addCat");
		this.popUp = document.querySelector(".popUp");
		this.box = 	document.querySelector(".popUp .Box");
		invoqueAfterMount('addCatDiv');
	}

	componentWillUmount(){
		this.unsubscribe();
	}

	componentDidUpdate(prevProps,prevState){
		let {_catName} = this.refs,
		{ name, controls, current } = this.state,
		{ lang } = this.props,
		Text = this.Text;

		if(controls){
			if(current.name){
				_catName.value = (!prevState.controls || prevState.current.name != current.name)? current.name : name || current.name;
				this.refs._add.textContent = Text.modiButtonText(lang);
			}
		}
		else{
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
		catNames = this.state.catNames.map((cat)=> cat.name.toLowerCase()),
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
		else if(!Validator.isAlphaNumeric(catNameValue)){
			action = ()=>{
				this.setState({ message:this.formError.notAlphaNumeric(text.nameHolder(lang)), signal:signal.error})
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
		let { current } = this.state,
		{ lang, addCategorie } = this.props,
		catName = this.refs._catName.value,
		{ action, message } = this.checker(e),
		store = this.store,
		id = Date.now().toString();

		if(action){
			return action();
		}
		else{
			db.insertCategorie(catName,id)().then((r)=>{
				if(r){
					store.dispatch(addCategorie(catName, id));
					this.setState({ message:this.Text.message.success, signal:signal.success});
					console.log("categorie",catName,"was inserted");
				}
				else{
					this.setState({ message:this.Text.message.insertFailure, signal:signal.error })
					console.log("something went wrong while trying to insert categorie ",catName);
				}
			}).catch((e)=>{
				console.log("Failed to insertCategorie",e);
			})
		}
	}
	updateCat(e){
		let {_catName} = this.refs,
		{ current } = this.state,
		{ updateCategorie, setForceUpdate:forceUpdate, setControl } = this.props,
		oldName = current.name,
		newName = _catName.value,
		{ action } = this.checker(e),
		store = this.store,
		state = store.getState();

		if(action){
			return action();
		}
		else{
			if(state.offlineSongs[current.id]){
				db.updateCategorie(oldName,newName)().then((r)=>{
					if(r){
						this.setState({message:this.Text.message.updated, name:_catName.value, signal:signal.success});

						store.dispatch(updateCategorie(oldName,newName,current.id));
						store.dispatch(setControl(false));
						store.dispatch(forceUpdate({node:'catNames', value:true}));
						meticulus('catNames',()=> store.dispatch(forceUpdate({node:'catNames', value:false})))
					}
					else{
						this.setState({message:this.Text.message.updateFailure, name:_catName.value, signal:signal.error})
					}
				}).catch((e)=>{

				})
			}
			else{
				this.setState({message:this.Text.message.updated, name:_catName.value, signal:signal.success});

				store.dispatch(updateCategorie(oldName,newName,current.id));
				store.dispatch(forceUpdate({node:'catNames', value:true}));
				store.dispatch(setControl(false));
				meticulus('catNames',()=> store.dispatch(forceUpdate({node:'catNames', value:false})))
			}
		}
	}
	cleanUp(){
		this.setState({...this.state,message:()=> "",name:"", signal:signal.system});
	}
	handleClick(event){
		let target = event.target, 
		isOfInterest = target.className.indexOf('add') != -1 || target.className.indexOf('close') != -1, 
		className=null, 
		{ controls, current } = this.state,
		{ changeCatView, setControl } = this.props,
		store = this.store;

		if(isOfInterest){
			event.preventDefault();
			event.stopPropagation();

			className = target.className;

			if(className.indexOf('add') != -1){
				if(controls && current.name)
					this.updateCat(event);
				else
					this.submit(event);
			}
			else if(className.indexOf('close') != -1){
				if(controls){
					store.dispatch(setControl(false));
				}
				store.dispatch(changeCatView(false));
				this.cleanUp();
			}
		}
	}
	render(){
		let { controls,view,message, signal } = this.state,
		{ lang } = this.props,
		text = this.Text,
		but1 = (controls)? text.modiButtonText: text.addButtonText,
		but2 = text.closeButtonText,
		viewClass = (view)? '':'whoosh'; 

		return (
			<div id="addCat" className={viewClass}>
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
AddCatDiv.contextType = Custom; 

class AddSongDiv extends React.Component{
	constructor(props,context){
		super(props);
		let state = context.store.getState(),
		current = state.currentSong,
		currentCat = state.currentCat,
		Text = context.Text;

		this.store = context.store;
		this.kak = this.kak.bind(this);
		this.changeVerseNumber = this.changeVerseNumber.bind(this);
		this.updateSong = this.updateSong.bind(this);
		this.deleteVerse = this.deleteVerse.bind(this);
		this.hasOverflowed = this.hasOverflowed.bind(this);
		this.scrollHandler = scrollHandler.bind(this);
		this.lastUpdateOverflowed = false;
		this.state = { VerseNumber:"",verses: [], name:"",message:"",VersesText:{}, signal:signal.system, location: current.location, controls: state.keys.alt, current, VersesDiv: state.ui.addSongDiv.verses, currentCatName: currentCat.name, catId: currentCat.id, view: state.ui.show.addSongDiv };
		this.Text = Text;
		this.formError = Text.formError;
		this.songText = Text.Song;
		this.addSongText = Text.addSongDiv;
		this.handleClick = this.handleClick.bind(this);
		this.focusSignal = this.focusSignal.bind(this);
	}

	componentDidMount(){
		let store = this.store;

		this.unsubscribe = store.subscribe(()=>{
			let cState = store.getState(),
			state = this.state,
			newState = {},
			current = cState.currentSong,
			currentCat = cState.currentCat;

			if(state.location != current.location){
				newState.location = current.location
			}
			if(state.controls != cState.keys.alt){
				newState.controls = cState.keys.alt;
			}
			if(state.current != current){
				newState.current = current;
			}
			if(state.VersesDiv != cState.ui.addSongDiv.verses){
				newState.VersesDiv = cState.ui.addSongDiv.verses;
			}
			if(state.currentCatName != currentCat.name){
				newState.currentCatName = currentCat.name
			}
			if(state.catId != currentCat.id){
				newState.catId = currentCat.id;
			}
			if(state.view != cState.ui.show.addSongDiv){
				newState.view = cState.ui.show.addSongDiv;
			}

			if(Object.keys(newState).length){
				this.setState(newState);
			}
		})
		invoqueAfterMount('AddSongDiv');
		this.node = document.getElementById("addSong");
		this.listDiv = document.querySelector(".popUp .wrap");

		if(window.innerWidth > 400){
			this.hasOverflowed = ()=> false;
		}
	}
	componentWillUnmount(){
		this.unsubscribe();
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
			console.log(e);
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


			if(((prevState.current.name != this.state.current.name) && this.state.verses.length) || prevProps.lang != this.props.lang){
				this.setState({...this.state,verses:[]});
			}

			let {_name,_verseNumber} = this.refs;
			if(this.state.controls){
				let { VersesText } = this.state;
				_name.value = this.state.current.name;
				let verses = (this.state.verses.length && this.state.verses) || (this.state.current.verses);
				for(let i=1;;i++){
					let input = [`_Verse${i}`]
					let verse = this.refs[input];
					if(!verse)
						break;
					else{
						verse.value = VersesText[input] || (verses[i-1] && verses[i-1].Text) || '';
						if(!VersesText[input])
							VersesText[input] = verse.value;
						if(!verse.onchange){
							verse.onchange = ()=>{
								let localState = this.state;
								VersesText[input] = verse.value;
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
							let verse = this.refs[input];
							verse.onchange = ()=>{
								let localState = this.state;
								state.VersesText[input] = verse.value;
								
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
			console.log(e);
		}

		this.props.adjustHeight();

		invoqueAfterMount('addSongDiv');
	}
	focusSignal(){
		let signalDiv = document.querySelector(".status");
		signalDiv.scrollIntoView();
	}

	kak(e){
		let { action, verses, _name } = this.checker(e),
		songName = _name &&  _name.value;

		if(action)
			return action();
		else{
			let { currentCatName, catId, VersesText } = this.state,
			{ addSong, setForceUpdate:forceUpdate, lang } = this.props,
			store = this.store;

			db.insertSong(songName,verses,catId)().then((r)=>{
				if(r){
					store.dispatch(addSong(0,songName,catId,verses));
					store.dispatch(forceUpdate({node:'songList',value:true}));
					this.setState({ name:"",message:this.songText.insertion.success(lang,songName),VersesText:{},verses:[], VerseNumber:0, signal:signal.success})
					meticulus('songList',()=>{
						store.dispatch(forceUpdate({node:'songList', value:false}));
					})
				}
				else{
					this.setState({message:this.songText.insertion.failed(lang,songName), signal:signal.error })
				}
			}).catch((e)=>{
				let message = (e.name == 'ConstraintError')? this.songText.insertion.duplicate(lang,songName): this.songText.insertion.error(lang);

				this.setState({ message, signal:signal.error })
				console.error(e);
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
			this.setState({ name:"",VerseNumber:vvv || "",message:this.addSongText.message.nameRequired(this.props.lang), signal:signal.error})
			return ;
		}
		if(is.Number(n)){
			
			if(n <= 0){
				this.setState({ name:nV,VerseNumber:vvv,message:this.addSongText.message.verseNumberBadNumber(this.props.lang), signal:signal.error});
				return;
			}
			else if(n >= 15){
				this.setState({...this.state, name:nV, VerseNumber:vvv,message:this.addSongText.message.verseNumberToBig(this.props.lang), signal:signal.error});
				return;
			}
			_verseNumber.value = n;
			this.setState({ message:"",VerseNumber:n,name:nV, verses: new Array(n), signal:signal.system});
		}
		else{
			this.setState({name:nV,VerseNumber:vvv,message:this.addSongText.message.verseNumberNotInteger(this.props.lang), signal:signal.error})
			
			return;
		}
	}

	checker(e){
		e.preventDefault();

		let message = "",
		{ _name } = this.refs,
		verses = [],
		{ VersesText } = this.state,
		subRefs = {...this.refs},
		{ Text, formError, addSongText } = this,
		{ lang } = this.props;

		delete subRefs['_name'];
		delete subRefs['_verseNumber'];

		if(!Validator.hasSomething(_name.value)){
			return { action: ()=>{
				this.setState({ name:"",message:addSongText.message.nameRequired(this.props.lang), VersesText, signal:signal.error}) ;
			}}
		}
		if(!Validator.isAlphaNumeric(_name.value)){
			return { action:()=>{
				this.setState({ name:_name.value, signal:signal.error, message:Text.formError.notAlphaNumeric(addSongText.nameHolder(lang))(lang), VersesText })
			}}
		}
		if(Validator.isAllEmpty(subRefs,'value')){
			message += addSongText.message.verseRequired(this.props.lang);

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
				verses.push({Text:Verse.value});
			}
		}
		if(message){
			return { action: ()=>{
				this.setState({ message,name:_name.value,VersesText, signal:signal.error}); 
			}}
		}
		return {verses,_name};
	}

	updateSong(e){
		let { action, verses, _name } = this.checker(e),
		newSongName = _name.value;

		if(action)
			return action();
		else{
			let { location, currentCatName, current, catId, VersesText,controls } = this.state,
			{ updateSong, setCurrentSong, lang, setControl } = this.props,
			{ songText } = this,
			oldName = current.name,
			store = this.store;

			db.updateSong(oldName,catId, newSongName, verses)().then((r)=>{
				if(r){
					store.dispatch(updateSong(current.id,catId,newSongName,verses,location,oldName));
					store.dispatch(setCurrentSong(current.id,catId,location));
					store.dispatch(setControl(false));
					this.setState({ message:songText.updating.success(lang,oldName), signal:signal.success, name:'', VersesText:{}});
				}
				else{
					this.setState({ message:songText.updating.failed(lang,oldName), signal: signal.error, name:newSongName, VersesText })
				}
			}).catch((e)=>{
				let message = (e.name == 'ConstraintError')? songText.updating.duplicate(lang): songText.updating.error(lang,newSongName);

				this.setState({message, signal: signal.error, name:newSongName, VersesText});

				console.error(e);
			})
		}
	}

	deleteVerse(id){
		let VersesText = this.state.VersesText;
		let verses = (this.state.verses.length)? this.state.verses: new Array(this.props.current.verses.length);
		verses.pop();
		let nextVerse;
		let oldVerse = null;
		let { _verseNumber } = this.refs;
		_verseNumber.value = verses.length;

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
		this.setState({...this.state, verses, VerseNumber:verses.length, VersesText});
	}

	cleanUp(){
		this.setState({message:"",VersesText:{},name:"",VerseNumber:"", verses:[]});
	}
	handleClick(e){
		let target = e.target, isOfInterest = target.className.indexOf("add") != -1 || target.className.indexOf("close") != -1, 
		className = null,
		{ controls } = this.state, 
		{ changeAddSongView, changeVerseDivNumber:changeVerseDiv, setControl } = this.props,
		store = this.store;

		if(isOfInterest){
			e.preventDefault();
			className = target.className;

			if(className.indexOf('add') != -1){
				if(controls)
					this.updateSong(e);
				else
					this.kak(e);
			}
			else{
				store.dispatch(changeAddSongView(false));
				store.dispatch(changeVerseDiv(0));
				if(controls){
					store.dispatch(setControl(false));
				}
				this.cleanUp();
			}
		}
	}

	render(){
		let { lang } = this.props,
		{ verses,signal, controls, current, view } = this.state,
		text = this.addSongText,
		verseNumber = (controls)? (verses && verses.length) || (current.verses && current.verses.length) || 0: verses.length ,
		but1 = (controls)? text.modiButtonText: text.addButtonText,
		but2 = text.closeButtonText,
		viewClass = (view)? '':'whoosh';

		return (
			<div id="addSong" className={`addSong ${viewClass}`}>
				<p><span className={`status ${signal}`}>{this.state.message}</span></p>
				<div className="songName">
					<input ref="_name" type="text" placeholder="Nom de la chanson"/>
				</div>
				<div className="verseChanger">
					<p><span className="signal">{text.verseNumberHolder(lang)}</span></p>
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
					<input className="add blueBack" type="submit" name="" value={but1(lang)} />
					<input className="close blueBack" type="submit" value={but2(lang)} />
				</div>
			</div>
			)
	}
}
AddSongDiv.contextType = Custom;

class CreateStream extends React.Component{
	constructor(props,context){
		super(props);
		let state = context.store.getState(),
		Text = context.Text,
		currentSong = state.currentSong

		this.store = context.store;
		this.save = this.save.bind(this);
		this.formError = Text.formError;
		this.cleanUp = this.cleanUp.bind(this);
		this.state = {message:()=> "", disabled:false,signal:signal.system, appReachable: state.appReachable, subscribedToStream: state.subscribedToStream, index: state.ui.navigation.verseIndex, catName: state.currentCat.name, songName: currentSong.name, verses: currentSong.verses, view: state.ui.show.createStreamDiv, isStreaming: state.isStreaming};
		this.Text = Text.createStreamDiv;
		this.badInput = /\W/;
	}

	componentDidMount(){
		let store = this.store;

		this.unsubscribe = store.subscribe(()=>{
			let cState = store.getState(),
			state = this.state,
			currentSong = cState.currentSong,
			newState = {};

			if(state.appReachable != cState.appReachable){
				newState.appReachable = cState.appReachable;
			}
			if(state.subscribedToStream != cState.subscribedToStream){
				newState.subscribedToStream = cState.subscribedToStream;
			}
			if(state.index != cState.ui.navigation.verseIndex){
				newState.index = cState.ui.navigation.verseIndex;
			}
			if(state.catName != cState.currentCat.name){
				newState.catName = cState.currentCat.name;
			}
			if(state.songName != currentSong.name){
				newState.songName = currentSong.name;
			}
			if(state.verses != currentSong.verses){
				newState.verses = currentSong.verses;
			}
			if(state.view != cState.ui.show.createStreamDiv){
				newState.view = cState.ui.show.createStreamDiv
			}
			if(state.isStreaming != cState.isStreaming){
				newState.isStreaming = cState.isStreaming;
			}

			if(Object.keys(newState).length){
				this.setState(newState);
			}
		})
		invoqueAfterMount('createStream');
		this.box = document.querySelector(".popUp .Box");
		this.popUp = document.querySelector(".popUp");
	}

	componentWillUmount(){
		this.unsubscribe();
	}

	componentDidUpdate(prevProps,prevState){
		invoqueAfterMount('createStream');

		if(prevState.isStreaming && !this.state.isStreaming)
			this.setState({message:()=>""});

		this.props.adjustHeight();
	}

	save(){
		let { appReachable, subscribedToStream, isStreaming, catName, songName, index, verses } = this.state,
		{ lang, setAppUnreachable } = this.props,
		{ Text,formError } = this,
		data,
		store;

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
		data = {
			[stF.name]: streamName,
			[stF.catName]: catName,
			[stF.song]:{
				[stF.songName]: songName,
				[stF.verses]: verses,
				[stF.index]: index || 0
			}
		};
		fetcher({
			url:"/stream?action=add",
			method:'POST',
			data:JSON.stringify(data),
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
				store.dispatch(setAppUnreachable());
				stopStream(streamName.toLowerCase());
			},
			setter:(xml)=>{
				xml.setRequestHeader('content-type','application/json');
			}
		})

	}
	cleanUp(){
		let {_name} = this.refs,
		{ changeStreamCreateView: changeView } = this.props,
		store = this.store;

		if(_name)
			_name.value = "";
		this.setState({...this.state,message:()=> "",disabled:false, signal:signal.system});
		store.dispatch(changeView(false));
	}
	render(){
		let { message, disabled, signal, isStreaming } = this.state,
		{ lang }  = this.props,
		text = this.Text,
		view = (this.state.view)? '':'whoosh',
		closeButton = <input type="submit" className='close blueBack' onClick={this.cleanUp} value={text.close(lang)}/>,
		createForm = (
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

CreateStream.contextType = Custom;

function Second(props){
	let className = (props.direction && props.direction == "Right")? 'il TRRR ':'il Full ',
	lang = props.lang;

	return (
		<div id="second" className={className}>
				<Notification />
				<Head2 {...props} />
				<SongContent {...props} />
		</div>
	)
}

class CatToggler extends React.Component{
	constructor(props,context){
		super(props);
		let store = context.store,
		state = store.getState();

		this.clickHandler = this.clickHandler.bind(this);
		this.store = store;
		this.state = { catListView: state.ui.show.catList }
		this.image = state.images.categorie;
	}

	componentDidMount(){
		let store = this.store;

		this.unsubscribe = store.subscribe(()=>{
			let state = store.getState();

			if(this.state.catListView != state.ui.show.catList){
				this.setState({ catListView: state.ui.show.catList });
			}
		})
	}

	componentWillUmount(){
		this.unsubscribe();
	}

	clickHandler(event){
		let { changeCatListView } = this.props,
		{ catListView  } = this.state,
		store = this.store;

		event.preventDefault();
		event.nativeEvent.stopImmediatePropagation();
		store.dispatch(changeCatListView(!catListView));
	}

	render(){
		let { image } = this;

		return <div className="il c1">
				<a href="#" onClick={this.clickHandler}><img src={`img/${image}`}/></a>
		</div>
	}

}
CatToggler.contextType = Custom;

const Head1 = (props)=>{
	return (
		<div className="head">
			<CatToggler {...props} />
			<Input {...props} />
			<Toggler {...props} />
			<Liner />
			<CatNames {...props} />
			<ResultList {...props} />
		</div>
		)
}

class Input extends React.Component{

	constructor(props,context){
		super(props);
		let store = context.store,
		state = store.getState();

		this.inlet = "Josaphat";
		this.initTime = Date.now();
		this.state = { view: state.ui.show.resultList }
		this.store = store;
	}
	componentDidMount(){
		let store = this.store,
		{ changeResultListView, searchSong } = this.props;

		this.node = this.refs['_search'];
		this.unsubscribe = store.subscribe(()=>{
			let state = store.getState();

			if(this.state.view != state.ui.show.resultList){
				this.setState({ view: state.ui.show.resultList });
			}
		})
		if(!this.node){
			console.error("Input componentDidMount this.node is null");
		}
		else{
			this.node.oninput = (event)=>{
				let value = this.node.value,
				{ view } = this.state;

				if(value.length > 2){
					store.dispatch(searchSong(value));

					if(!view){
						store.dispatch(changeResultListView(true));
					}
				}
				else{
					if(view){
						store.dispatch(searchSong(""));
					}
				}
			}
		}
	}
	componentWillUmount(){
		this.unsubscribe();
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
Input.contextType = Custom;

class Toggler extends React.Component{
	constructor(props,context){
		super(props);
		let store = context.store,
		state = store.getState();

		this.store = store;
		this.state = { direction: state.ui.direction };
		this.mustChangeDirection = this.mustChangeDirection.bind(this);
		this.clickHandler = this.clickHandler.bind(this);
	}

	componentDidMount(){
		let { changeDirection } = this.props,
		{ direction } = this.state,
		store = this.store;

		if(this.mustChangeDirection()){
			store.dispatch(changeDirection((direction == "Right")? "Left":"Right"));
		}

		this.unsubscribe = store.subscribe(()=>{
			let state = store.getState();

			if(state.ui.direction != this.state.direction){
				this.setState({ direction: state.ui.direction })
			}
		})
	}

	componentWillUmount(){
		this.unsubscribe();
	}

	mustChangeDirection(){

		let full = document.querySelector(".FULL"),
		{ direction } = this.state;

		if(full){
			if(direction != "Left")
				return true;
			return false;
		}
		else if(direction == "Left"){
			return true;
		}
		else
			return false;

	}

	clickHandler(event){
		let { changeDirection } = this.props,
		{ direction } = this.state,
		store = this.store;

		event.preventDefault();
		event.stopPropagation();
		store.dispatch(changeDirection(((direction == "Right")? "Left":"Right")));
	}

	render(){
		let { direction } = this.state;
		direction = direction || "Right";

		return (
			<div className="il c3 Toggler">
				<a onClick={this.clickHandler} href="#" ><img src={"img/Toggle"+direction+".png"} /></a>
			</div>
			)	

	}
}
Toggler.contextType = Custom

class CatNames extends React.Component{
	constructor(props,context){
		super(props);
		let Text = context.Text,
		state = context.store.getState();

		this.text  = Text.Categorie;
		this.store = context.store;
		this.clickHandler = this.clickHandler.bind(this);
		this.addCatButton = this.addCatButton.bind(this);
		this.topClass = "wrap";
		this.modif = this.modif.bind(this);
		this.wipe = this.wipe.bind(this);
		this.action1 = this.action1.bind(this);
		this.action2 = this.action2.bind(this);
		this.download = this.download.bind(this);
		this.propagationHandler = this.propagationHandler.bind(this);
		this.showControl = this.showControl.bind(this);
		this.state = { updateForced: state.updateForced.catNames, controls: state.keys.alt, view: state.ui.show.catList, catNames: state.Categories, controls: state.keys.alt }
		this.image = state.images.download
	}

	componentDidMount(){
		let store = this.store;

		this.unsubscribe = store.subscribe(()=>{
			let cState = store.getState(),
			state = this.state,
			newState = {};

			if(state.updateForced != cState.updateForced.catNames){
				newState.updateForced = cState.updateForced.catNames;
			}
			if(state.controls != cState.keys.alt){
				newState.controls = cState.keys.alt;
			}
			if(state.view != cState.ui.show.catList){
				newState.view = cState.ui.show.catList;
			}
			if(state.catNames != cState.Categories){
				newState.catNames = cState.Categories;
			}

			if(Object.keys(newState).length){
				this.setState(newState);
			}
		})
		this.node = document.querySelector(".catNames");

		if(db.isBogus){
			this.addCatButton = ()=> null;
			this.forceUpdate();
		}
	}

	componentWillUmount(){
		this.unsubscribe();
	}

	componentDidUpdate(){
		invoqueAfterMount('catNames');
	}

	clickHandler(event){
		let target = event.target, 
		{ changeCatView } = this.props,
		store = this.store;
		
		if(target.className == "addCatCliquer" || target.className == "imgCliquer"){
			store.dispatch(changeCatView(true));
		}
		

		event.preventDefault();
	}
	showControl({id}){
		let store = this.store;

		return (id in store.getState().offlineSongs);
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
		let { setCurrentCat, changeCatView } = this.props,
		store = this.store,
		state = store.getState();

		store.dispatch(setCurrentCat(item.name,item.id,item.location));
		store.dispatch(changeCatView(true));
	}
	wipe(item,target,id){
		let { removeCategorie } = this.props,
		store = this.store,
		state = store.getState();

		if(state.offlineSongs[item.id]){
			db.removeCategorie(item.id)().then((r)=>{
				if(r){
					store.dispatch(removeCategorie(item.name,item.id));
				}
				else{
					console.error("Couldn't delete categorie")
				}

			}).catch((e)=>{
				console.error(e);
			})
		}
		else{
			store.dispatch(removeCategorie(item.name,item.id));
		}
	}
	action1(item,id){
		let { changeIndex, setCurrentCat, updateSongList, changeCatListView } = this.props,
		store = this.store;

		store.dispatch(changeIndex(0));
		store.dispatch(setCurrentCat(item.name,item.id,item.location));
		store.dispatch(updateSongList(100));
		store.dispatch(changeCatListView(false));
	}
	action2({name,id}){
		let text = this.text,
		{ lang, addCategorie } = this.props;

		return db.insertCategorie(name,id)().then((r)=>{
			if(r){
				notifier.addSpeed(text.insertion.success(lang,name));
				store.dispatch(addCategorie(name,id));
				return true;
			}
		}).catch((e)=>{
			notifier.addSpeed(text.insertion.failed(lang,name));
		})
	}
	download({id}){
		return db.getCategorie(id)();
	}
	propagationHandler(event){
		event.nativeEvent.stopImmediatePropagation();
	}

	render(){
		let { action1, wipe, modif, download } = this,
		{ lang } = this.props,
		{ view, controls, catNames } = this.state,
		image = this.image,
		hide = (view)? '':'whoosh',
		text = this.text,
		action2 = [this.action2],
		action = this.action1,
		style = {style:" abs abBottom shadowR list catNames BRRad "+hide};

		return (
				<div onClick={this.propagationHandler}>
					<List 
						download={(global.alert)? download : null} 
						args={{}} 
						action2={action2} 
						modif={modif} 
						wipe={wipe}  
						controls={controls} 
						first={this.addCatButton} 
						src={image}
						action={action} 
						list={catNames} 
						abs={style}
						topClass={this.topClass}
						catName={true}
						itemClass='categorieContextMenu'
						showControl={this.showControl}
					/>
				</div>
			)
	}
}
CatNames.contextType = Custom;

class ResultList extends React.Component{
	constructor(prop,context){
		super(prop);
		let store = context.store,
		state = store.getState();


		this.scrollHandler = scrollHandler;
		this.action = this.action.bind(this);
		this.state = { resultView: state.ui.show.resultList, songs: state.searchResult };
		this.store = store;
	}

	componentDidMount(){
		let trackedTouchs = [],
		store = this.store;

		this.unsubscribe = store.subscribe(()=>{
			let state = store.getState(),
			newState = {};

			if(state.ui.show.resultList != this.state.resultView){
				newState.resultView = state.ui.show.resultList;
			}
			if(state.searchResult != this.state.songs){
				newState.songs = state.searchResult;
			}

			if(Object.keys(newState).length){
				this.setState(newState);
			}
		})
		this.node = document.querySelector("#first .head .result");
		this.node.ontouchmove = (event)=>{
			this.scrollHandler(this.node,event,trackedTouchs);
		}
		this.node.ontouchend = (event)=>{
			trackedTouchs = [];
		}
	}
	componentWillUmount(){
		this.node.ontouchmove = this.node.ontouchend = null;
		this.unsubscribe();
	}

	action({songId, catId, location,catName}){
		let { setCurrentCat, setCurrentSong } = this.props,
		store = this.store;

		store.dispatch(setCurrentCat(catName,catId,location));
		store.dispatch(setCurrentSong(songId, catId, location));
	}

	render(){
		let {resultView, songs } = this.state,
		hide = (resultView)? '':'whoosh',
		style = { style:" abs abBottom list result shadowC BLRad BRRad "+hide };
		songs = (songs.length)? songs: ["Aucun resultat"];
		return (
			<List action={this.action} abs={style} list={songs} />
			)

	}
}
ResultList.contextType = Custom;

const List = ({catName,putInLastAccess,hide,updateMyCat,args,song,abs,src,list = [],action,action2,first=()=>{},controls,wipe,modif,download,downloadAll,topClass, itemClass,showControl})=>{

	return (
		<div className={(abs)? abs.style: ""}>
			{first()}
			{list.map((item,i)=>{
				if(item.name) item = {id:i,...item};
						return	(<div className={`${(topClass)? topClass: ''}`+((song)? ` p${i}`:'')} key={i}>
									<Item itemClass={itemClass || ''} hide={hide} i={i} args={{...args}} item={item} action={action} action2={action2} controls={controls} src={src} wipe={wipe} modif={modif} updateMyCat={updateMyCat} song={song} downloadAll={downloadAll} download={download} showControl={showControl} />
								</div>)
							}
				)}
		</div>
		)
}


const Item = ({i,hide,item,action,action2,src,wipe,modif,updateMyCat,song,downloadAll, download,args, itemClass, showControl})=>{
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
				<a id={item.id} className={itemClass} inlist="true" onClick={(action)? (event)=>{ event.preventDefault(); action(item,i) }:'' } href="#">{name}</a>
			</div>
			<div className='il'>
				{(item && showControl && showControl(item))? <Controls wipe={({target})=> wipe(item,target,i)} modif={()=> modif(item,i)} />:null}
				{(src && action2)? <Download hide={()=> hide(i)} args={args} downloadAll={downloadAll} updateMyCat={updateMyCat} name={name} song={song} src={src} download={download} action={action2} item={item} />:null}
			</div>
		</>
	);
}


const Controls = (props)=>{
	
	return (
			<div>
				{(props.modif)? <a className='modif' onClick={(event)=> {event.preventDefault(); props.modif()}} href="#"><img src='img/edit.png' /></a>:''}
				<a className='wipe' onClick={(event)=>{ event.preventDefault(); props.wipe(event)}} href="#"><img src='img/remove.png' /></a>
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

		this.checkImageDownload();
	}

	componentDidUpdate(){
		if(this.props.downloadAll){
			this.save();
		}
		else{
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
			}).catch(reject);
		})
	}

	checkImageDownload(){
		let {args, action2, download, name, item} = this.props;
		let { img } = this.state;
		if(!download){
			if(img)
				this.setState({img:!img});
			return false;
		}
		download(item).then((r)=>{
			if(r.length){
				if(img){
					this.setState({img:!img});
				}
			}
			else{
				if(!img)
					this.setState({img:!img});
			}
		}).catch((e)=>{
			console.error("checkImageDownload Error",e);
		})
	}

	save(e){
		if(e)
			e.preventDefault();

		let { action,args, song, name } = this.props;
		this.doAction(action,args,song).then((r)=>{
			if(r){
				/*if(song){
					let hide = this.props.hide;
					if(hide)
						hide();
					this.props.updateMyCat();
				}
				else*/
					this.setState({img:false});
				
			}
			else{
				console.log("Odd thing happened");
			}
		}).catch((e)=>{
			alert("doAction catch Error");
			alert(e.message);
		});

	}

	render(){
		let show = this.state.img;

		if(!this.props.song && !Categories[this.name] && this.name){
			Categories[this.name] = {img:show, setState:this.setState.bind(this)};
		}
		else if(this.name)
			Songs[this.name] = {img:show, setState:this.setState.bind(this)};

		return (
					(show)? <a className='sdownloader' onClick={this.save} href="#" ref='dad'><img src={'img/'+this.props.src} /></a>:''
			
			)
	}
}

class SongList extends React.Component{
	constructor(props,context){
		super(props);
		let Text = props.Text;

		this.text = Text;
		this.store = props.store;
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
		this.showControl = this.showControl.bind(this);
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
	}

	componentDidUpdate(prevProps, prevState){
		let props = this.props,
		report = props.report;

		if(report && !prevProps.report){
			this.songInsert(props.songs, props.currentCat.id);
		}

		invoqueAfterMount('songList');
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
			let { to, increment, updateSongList, store } = this.props;
			if(this.shouldAddMoreSong()){
				let percent = Math.floor(((this.listDiv.clientHeight + this.listDiv.scrollTop) / this.listDiv.scrollHeight) * 100);

				(percent > 65)? store.dispatch(updateSongList(to + increment)): '';
			}
		}	
		catch(e){
			console.log(e);
		}
	}
	
	reportSuccess(name,i,verses){
		let { report, addSong, removeSong, counterUpdater, currentCat, songs, lang, location,store, addCategorie } = this.props,
		catName = currentCat.name,
		catId = currentCat.id,
		addCat = (location == 'online' && !store.getState().offlineSongs[catId]),
		status = (i == songs.length -1)? insertStatus.COMPLETE: insertStatus.SUCCESS;

		if(report){
			report(status, name);
		}
		else
			notifier.addSpeed(this.text.insertion.success(lang,name),undefined,undefined,undefined,signal.success);

		if(addCat){
			store.dispatch(addCategorie(catName,catId));
		}
		store.dispatch(addSong(0,name,catId, verses,'offline'));
		store.dispatch(removeSong(i,catId,name));

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
	songInsert(songs,catId){
		let c = Promise.resolve(true),
		self = this;

		songs.forEach((song,i)=>{
			let { name, verses } = song;
			c = c.then(()=>{
				return db.insertSong(name,verses,catId)().then((r)=>{
					try{
						if(r){
							self.reportSuccess(name,0,verses);
							return true;
						}
						else{
							self.reportError(name);
							console.error("Failed");
							return false;
						}
					}
					catch(e){
						console.error("insertSong Error"+c);
						console.error(e);
						return e;
					}
				})
			}).catch((e)=>{
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
	download({name}){
		let { currentCat } = this.props;

		return db.getSong(name,currentCat.id)();
	}

	async insertSong(name,verses,cat,index,tried=0){
		let { store, currentCat, lang } = this.props,
		songText = this.text.Song,
		catName = currentCat.name,
		catId = currentCat.id,
		state = store.getState(),
		r;

		if(!state.offlineSongs[catId]){
			r = await db.insertCategorie(catName, catId)();
			if(!r){
				return false;
			}
		}

		return db.insertSong(name,verses,cat)().then((r)=>{
			if(r){
				this.reportSuccess(name,index,verses);
				return true;
			}
			return r;
		})
	}

	insertCategorie(cat,id){
		return db.insertCategorie(cat,id)().then((id)=>{
			if(is.Number(id)){
				return id;
			}
			return false;
		}).catch((e)=>{
			if(e.code == 6)
				return id;
		})
	}

	action2(sequence,{name,verses,cat,index}){
		return new Promise((resolve,reject)=>{
			let self = this,
			{ currentCat } = this.props,
			catId = currentCat.id;

			sequence.subscribe(sequence.add(()=>{
				return self.insertSong(name,verses,catId,index).then((r)=>{
					if(!r){
						self.reportError(name);
						return false;
					}
					else
						return true;
				}).catch((e)=>{
					self.reportError(name);
					console.log("Error while trying to insert song",name);
					console.log(e);
				})
			}),(f)=>{
				resolve(f);
			},(e)=> reject(e));
		})
	}
	modif(item,id){
		let { changeIndex, setCurrentSong, location, changeAddSongView, currentCat, store, setControl } = this.props;

		store.dispatch(setCurrentSong(id,currentCat.id,location));
		store.dispatch(changeIndex(0));
		store.dispatch(setControl(true));
		store.dispatch(changeAddSongView(true));
	}
	wipe(item,target,songId){
		let name = item.name || item;
		let { removeSong, currentCat, location, lang, store } = this.props;
		let catName = currentCat.name,
		parent = target.parentNode,
		catId = currentCat.id;

		db.deleteSong(name,catId)().then((r)=>{
			if(r){
				store.dispatch(removeSong(songId,catId,name,location));

				if(catName == name){
					store.dispatch(setCurrentSong(""));
				}

				notifier.addSpeed(this.text.wiping.success(lang,name),undefined,undefined,undefined,signal.success);

				while(parent && parent.className.indexOf('wrapper') == -1){
					parent = parent.parentNode;
				}

				parent.style.display = "none";
			}
			else{
				notifier.addSpeed(this.text.wiping.failed(lang,name),undefined,undefined,undefined,signal.error);
			}
		}).catch((e)=>{
			notifier.addSpeed(this.text.wiping.error(lang,name),undefined,undefined,undefined,signal.error);
			console.log(e);
		})
				
	}
	action(x,id){
		let { currentCat, setCurrentSong, subscribedToStream, subscribeToStream, location, changeDirection, store } = this.props;

		abortSubscription(fetcher);
		S.updateStream(currentCat.name, x.name, 0, x.verses);

		store.dispatch(setCurrentSong(id,currentCat.id,location));

		if(window.innerWidth <= 425){
			store.dispatch(changeDirection('Left'));
		}

		if(subscribedToStream){
			store.dispatch(subscribeToStream(false));
		}
	}

	showControl(){
		return (this.props.location == 'offline');
	}

	render(){
		let props = this.props,
		location = props.location || 'online',
		songs = props.songs,
		{ lang, to,store, changeAddSongView,currentCat } = props,
		saveSequence = new seq(),
		report = props.report,
		songProps = {
			abs:{
				style:'list il'
			},
			list:[]
		},
		action2Curried = curry(this.action2)(this.saveSequence),
		catName = currentCat.name,
		catId = currentCat.id,
		cat = props.currentCat.name,
		text = this.text;

		if(!report){
			songProps = {
				song:(db.isBogus)? false:true,
				updateMyCat:this.updateMyCat,
				download:(global.alert)? this.download:null,
				args:{cat:props.currentCat.name},
				action2:[action2Curried],
				modif:(!props.includeModify)? null: this.modif,
				wipe: this.wipe,
				controls:props.controls,
				first:(props.includeAdder)? (!props.currentCat.name)? ()=> "":()=> <div className="wrapper"><div id="AddSong" className="il f1"><a onClick={(event)=> {event.preventDefault(); store.dispatch(changeAddSongView(true))}} href="#">{text.adder(lang)}</a></div><div className="il"></div></div>: ()=>{},
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
				showControl:this.showControl,
				topClass:"wrapper",
				itemClass:(location == 'offline')? 'songContextMenu': undefined
			};
		}

		return <List {...songProps} />;
	}
}

const Head2 = (props)=>{
	return (
		<div className="head" onClick={(event)=> event.nativeEvent.stopImmediatePropagation()}>
			<Toggler {...props} />
			<Settings {...props} />
			<Favorite {...props} />
			<StreamCreation {...props} />
			<StreamList {...props} />
			<Liner />
			{/*<SettingsC />
						<FavoriteC />
						<StreamCreationC />
						<StreamListC />
						<Liner />*/}
		</div>
		)
}

class Favorite extends React.Component{
	constructor(props,context){
		super(props);
		let state = context.store.getState();

		this.store = context.store;
		this.state = { view: state.ui.show.favList, favorites:state.favorites }
		this.clickHandler = this.clickHandler.bind(this);
		this.action = this.action.bind(this);
		this.image = state.images.favorite.start;
	}

	componentDidMount(){
		let store = this.store;

		this.unsubscribe = store.subscribe(()=>{
			let state = store.getState(),
			newState = {};

			if(state.ui.show.favList != this.state.view){
				newState.view = state.ui.show.favList;
			}
			if(state.favorites != this.state.favorites){
				newState.favorites = state.favorites
			}

			if(Object.keys(newState).length){
				this.setState(newState);
			}
		})
	}

	componentWillUmount(){
		this.unsubscribe();
	}

	clickHandler(event){
		let { view } = this.state, 
		{ changeFavListView } = this.props,
		store = this.store;

		store.dispatch(changeFavListView(!view));
	}

	action(item){
		let { setCurrentCat, setCurrentSong } = this.props,
		store = this.store;

		store.dispatch(setCurrentCat(item.catName, item.catId, item.location));
		store.dispatch(setCurrentSong(item.songId, item.catId, item.location));
	}

	buildFavList(favorites){
		let catName = "", songName = "", verses = [], location = "", catId, songId, favList = [], song = {}, songs = ""

		for(catName in favorites){
			songs = favorites[catName];
			for(songName in songs){
				song = songs[songName];
				favList.push({catName, songName, location:song.location, verses:song.verses, songId:song.songId, catId:song.catId, name:songName});
			}

		}

		return favList;
	}

	render(){
		let { favorites, view } = this.state,
		image = this.image,
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
Favorite.contextType = Custom;

class StreamCreation extends React.Component{
	constructor(props,context){
		super(props);
		let state = context.store.getState();

		this.store = context.store;
		this.showCreateStream = this.showCreateStream.bind(this);
		this.stopStream = this.stopStream.bind(this);
		this.text = context.Text;
		this.images = state.images.streamCreate;
		this.state = {img:`img/${this.images.start}`, isStreaming: state.isStreaming, songName: state.currentSong.name, appReachable: state.appReachable};
	}

	componentDidUpdate(prevProps,prevState){
		invoqueAfterMount('streamCreation');

		if(prevState.isStreaming == false && this.state.isStreaming == true){
			let streamName = S.getName();
			this.setState({img:`img/${this.images.stop}`});
		}
	}

	componentDidMount(){
		let store = this.store;

		this.unsubscribe = store.subscribe(()=>{
			let state = store.getState(),
			newState = {};

			if(state.isStreaming != this.state.isStreaming){
				newState.isStreaming = state.isStreaming;
			}
			if(state.appReachable != this.state.appReachable){
				newState.appReachable = state.appReachable;
			}
			if(state.currentSong.name != this.state.songName){
				newState.songName = state.currentSong.name;
			}

			if(Object.keys(newState).length){
				this.setState(newState);
			}
		})

		directAccess["streamCreation"] = this;
		if(S.getName())
			this.setState({img:`img/${this.images.stop}`});
	}

	componentWillUmount(){
		this.unsubscribe();
	}

	showCreateStream(event){
		event.preventDefault();
		event.stopPropagation();

		let { songName } = this.state,
		{ changeStreamCreateView } = this.props,
		store = this.store;

		if(!songName){
			return alert("Please select a song before starting a stream");
		}
		if(!S.getName()){ 
			return store.dispatch(changeStreamCreateView(true));
		}
		this.stopStream();
		let c = 0;
		this.counter = setInterval(()=>{
			notifier2.addSpeed(this.text.Stream.stopping(this.props.lang,S.getName(),".".repeat(c % 6)));
			c++;
		},100);
	}

	stopStream(){
		let streamName = S.getName(),
		data = {
			[stF.name]:streamName
		};
		fetcher({
			url:`stream?action=delete`,
			method:'POST',
			data:JSON.stringify(data),
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
			},
			setter:(xml)=>{
				xml.setRequestHeader('content-type','application/json');
			}
		})
	}

	render(){
		let { img, appReachable } = this.state;

		return (
			<div className="streamCreation il c2 tip">
				<div>
					{ 
						(appReachable)? 
							<a onClick={this.showCreateStream} href="#">
								<img className="vmid" src={img} /><Liner additionalClass="vmid" /> 
							</a>: ""
					}
				</div>
			</div>
			)
	}
}
StreamCreation.contextType = Custom;

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
		let state = context.store.getState(),
		Text = context.Text;

		this.store = context.store;
		this.state = {list:[], showSearch:false, searchResult:[], searchTerm:"", appReachable: state.appReachable, view: state.ui.show.streamList, newCatId: state.Categories.length }
		this.updateStream = this.updateStream.bind(this);
		this.updateCurrentStreamInfo = this.updateCurrentStreamInfo.bind(this);
		this.downloadSong = this.downloadSong.bind(this);
		this.registerToStream = this.registerToStream.bind(this);
		this.restartUpdateStream = this.restartUpdateStream.bind(this);
		this.downloadSong.inFetch = {};
		this.listText = Text.streamList;
		this.streamText = Text.Stream;
		this.timer = {normal:5000, error:10000};
		this.lastTimestamp;
		this.hasOverflowed = this.hasOverflowed.bind(this);
		this.handleSearchInput = this.handleSearchInput.bind(this);
		this.scrollHandler = scrollHandler;
		this.createDownloadLink = this.createDownloadLink.bind(this);
		this.changeView = this.changeView.bind(this);
		this.image = state.images.streamList
	}

	componentDidMount(){
		let { appReachable } = this.state,
		store = this.store;

		this.unsubscribe = store.subscribe(()=>{
			let state = store.getState(),
			newState = {};

			if(state.appReachable != this.state.appReachable){
				newState.appReachable = state.appReachable;
			}
			if(state.ui.show.streamList != this.state.view){
				newState.view = state.ui.show.streamList;
			}
			if(state.Categories.length != this.state.newCatId){
				newState.newCatId = state.Categories.length;
			}

			if(Object.keys(newState).length){
				this.setState(newState);
			}
		})

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

		if(appReachable){
			this.updateStream();
		}
	}

	componentDidUpdate(prevProps,prevState){
		let { showSearch, searchTerm, appReachable } = this.state;
		if(!prevState.appReachable && appReachable)
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
		let text = this.text,
		{ lang, subscribeToStream, setAppUnreachable } = this.props,
		store = this.store,
		lastTime = t || 0;

		fetcher({
			url:`/stream/?action=getAll&${filters.lastTime}=${lastTime}`,
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
							store.dispatch(subscribeToStream(false));
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
				store.dispatch(setAppUnreachable());
				notifier2.addSpeed(this.listText.updateStreamError(lang));
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
		let url = `stream/song?action=download&${stF.name}=${streamName}`;
		if(downloadSong.inFetch[url])
			return;
		let { lang, addCategorie, addSong, setCurrentCat, setCurrentSong } = this.props,
		{ newCatId } = this.state,
		downloadText = this.streamText.download,
		store = this.store;

		downloadSong.inFetch[url] = true;
		notifier2.addSpeed(downloadText.start(lang,songName));
		fetcher({
			url,
			s:(response)=>{
				let { action,songName, catName, verses } = response;
				delete downloadSong.inFetch[url];
				switch(action){
					case SUB.DELETE:
						notifier2.addSpeed(this.listText.songDeleted(lang,songName));
						break;
					case SUB.ADD:
						let newCatId = null;
						if(!fastAccess[catName]){
							newCatId = Date.now()
							store.dispatch(addCategorie(catName,newCatId,'online'));
							notifier2.addSpeed(this.listText.categorieInserted(lang,catName));
						}
						else{
							newCatId = fastAccess[catName].id;
						}
						store.dispatch(addSong(0,songName, newCatId, verses, 'online'));
						notifier2.addSpeed(this.listText.songInserted(lang,catName,songName));

						if(this.streamCatName.toLowerCase() == catName.toLowerCase() && this.streamSongName.toLowerCase() == songName.toLowerCase()){
							store.dispatch(setCurrentCat(catName,newCatId,'online'));
							let songId = fastAccess[catName]['online'][songName.toUpperCase()];
							store.dispatch(setCurrentSong(songId,newCatId,'online',this.streamPosition));
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

	subscribe(streamName,update, past={}){
		let { subscribeToStream, setCurrentSong, setCurrentCat, lang } = this.props,
		url = `stream/subscribe?${stF.name}=${streamName}${(update)? `&${stq.updating}=true`:""}`,
		store = this.store;

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
								let catName = response[stF.catName] || past[stF.catName],
								songName = response[stF.songName] || past[stF.songName],
								position = response[stF.index],
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
								endSubscription = textSubscription.end;

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
										if(!songName || !catName){

										}
										else if(!fastAccessCatName || (songNotInOnlineCat && songNotInOfflineCat)){
											this.downloadSong(catName,songName,streamName)
										}
										else{
											let location = (songNotInOfflineCat)? 'online':'offline';
											store.dispatch(setCurrentCat(catName,fastAccessCatName.id,location));
											store.dispatch(setCurrentSong(songId,catId,location,parseInt(position,10)));
												
										}
										this.updateCurrentStreamInfo(catName, songName, position);


										this.subscribe(streamName,true, { [stF.songName]: songName, [stF.catName]:catName });
										break;

									case SUB.UNSUBSCRIBE:
										
										notifier2.addSpeed(endSubscription(lang, streamName));
										delete subscribeMethod.registration;
										store.dispatch(subscribeToStream(false));
										this.updateCurrentStreamInfo();
										break;

									case SUB.NOTHING:

										notifier2.addSpeed(textSubscription.nothing(this.props.lang, streamName));
										store.dispatch(subscribeToStream(false));
										break;
									default:

										notifier2.addSpeed(subscriptionError(lang, streamName));
										console.log("fetcher Odd response",response);
										store.dispatch(subscribeToStream(false));
										this.updateCurrentStreamInfo();
								}
							}
							catch(e){
								console.log(e);
							}

						}
						
					},
					e:({status,response})=>{
						notifier2.addSpeed( this.text.Stream.subscription.error(this.props.lang, streamName));
						store.dispatch(subscribeToStream(false));
						console.log("Error while trying to subscribe to stream",streamName,status,response);
					}
				});
	}

	registerToStream(streamName){
		let { subscribeToStream } = this.props,
		store = this.store;

		if(streamName != this.subscribe.registration){
			abortSubscription(fetcher);
			this.subscribe(streamName);
			store.dispatch(subscribeToStream(true));
		}
	}

	changeView(){
		let { view } = this.state,
		store = this.store,
		{ changeStreamListView } = this.props;

		store.dispatch(changeStreamListView(!view));
	}

	render(){
		let { view, appReachable } = this.state, 
		hide = (view)? '':'whoosh',
		{ list, showSearch, searchResult, searchTerm } = this.state,
		{ banner, open } = this.image;

		if(searchTerm)
			list = searchResult;

		return (
			<div className="streamList il c3 tip">
				<div>
					{ 
						(appReachable)? 
							<a className="streamListLink" onClick={this.changeView} href="#"><img className="vmid" src={`img/${banner}`} /> <Liner additionalClass="vmid"/><span className="counter">{list.length}</span></a> : ""
					}
				</div>
				{ (appReachable)?
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
StreamList.contextType = Custom;

const SongContent = (props)=>{
	return (
		<div className="body">
			<Content {...props} />
		</div>
		)
}

class Content extends React.Component{
	constructor(props,context){
		super(props);
		let state = context.store.getState(),
		Text = context.Text,
		currentCat = state.currentCat,
		currentSong = state.currentSong,
		isFavorite = (currentCat.name && state.favorites[currentCat.name] && state.favorites[currentCat.name][currentSong.name] && true) || false;
		
		this.store = context.store;
		this.Text = Text.Favorite;
		this.storageHandler = storageHandler();
		this.scrollHandler = scrollHandler.bind(this);
		this.state = { verses:currentSong.verses, currentCatName:"", index:0, currentSongName:"", currentCat, song: currentSong,isFavorite, currentSongName: currentSong.name};
		this.goToVerse = this.goToVerse.bind(this);
		this.clickHandler = this.clickHandler.bind(this);
		this.propIndex;
		this.images = state.images;
	}
	
	componentDidMount(){
		let store = this.store;

		this.unsubscribe = store.subscribe(()=>{
			let cState = store.getState(),
			state = this.state,
			currentCat = cState.currentCat,
			currentSong = cState.currentSong,
			isFavorite = (currentCat.name && cState.favorites[currentCat.name] && cState.favorites[currentCat.name][currentSong.name] && true) || false,
			newState = {};

			if(state.currentCat != currentCat){
				newState.currentCat = currentCat;
			}
			if(state.song != currentSong){
				newState.song = currentSong;
			}
			if(state.isFavorite != isFavorite){
				newState.isFavorite = isFavorite;
			}
			if(state.currentSongName != cState.currentSong.name){
				newState.currentSongName = cState.currentSong.name;
				newState.index = 0;
			}
			if(state.verses != currentSong.verses){
				newState.verses = currentSong.verses;
			}
			if(state.currentCatName != currentCat.name){
				newState.currentCatName = currentCat.name;
				newState.index = 0;
			}
			if(state.index != cState.ui.navigation.verseIndex){
				newState.index = cState.ui.navigation.verseIndex;
			}

			if(Object.keys(newState).length){
				this.setState(newState);
			}
		})
		this.listDiv = document.getElementById("content");
		this.papa = document.querySelector("#content .papa");
	}

	goToVerse(index){
		let store = this.store,
		{ changeIndex } = this.props;
		store.dispatch(changeIndex(index));
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
	}

	addToFavorite(catName,catId,songName,songId,location,lang,notify){
		try{
			let Text = this.Text,
			{ addToFavorite } = this.props,
			store = this.store;


			if(!location)
				console.error(`song ${songName} don't have a location`);

			store.dispatch(addToFavorite(catName, catId, songName, songId,location));

			notify.addSpeed(Text.added(lang,songName));
		}
		catch(e){
			console.error("Favorite addToFavorite Error:",e);
		}
	}

	removeFromFavorite(catName,catId,songName,songId,lang,notify){
		try{	
			let Text =this.Text,
			{ removeFromFavorite } = this.props,
			store = this.store;

			store.dispatch(removeFromFavorite(catName,catId,songName,songId));
			notify.addSpeed(Text.deleted(lang,songName));
		}
		catch(e){
			console.error("Favorite removeFromFavorite Error:",e);
		}
		
	}

	isFavorite(catName,songName){
		let { isFavorite } = this.state;

		if(isFavorite)
			return true;
		else{
			let favorite = this.storageHandler.inStore('favorites',{},JSON.parse);
			if(favorite[catName] && favorite[catName][songName])
				return true;

			return false;
		}
	}

	clickHandler(event){
		let { currentCatName, currentSongName, verses, currentCat, isFavorite, song } = this.state,
		{ lang } = this.props,
		catId = currentCat.id,
		store

		event.preventDefault();
		event.stopPropagation();

		if(!isFavorite){
			this.addToFavorite(currentCatName,catId,currentSongName, song.id, song.location, lang, notifier2)
		}
		else{
			this.removeFromFavorite(currentCatName,catId, currentSongName, song.id, lang, notifier2);
		}

	}

	voidHandler(event){
		event.preventDefault();
	}


	render(){
		let { verses, currentCatName, index, song, isFavorite } = this.state,
		{ lang } = this.props,
		currentVerse = (verses[index] && verses[index].Text) || "",
		catName = currentCatName,
		songName = song.name,
		location = song.location,
		images = this.images,
		favImg = images.favorite;
		//let Verses = props.song.Verses;
		let self = this;
		function clickHandler(event){
			event.preventDefault(); 
			event.stopPropagation(); 
			(!props.isFavorite)? 
				self.addToFavorite(catName, songName, verses, location, lang, props.addToFavorite, notifier2) : 
				self.removeFromFavorite(catName,songName,lang, props.removeFromFavorite, notifier2) 
		}

		function voidHandler(event){
			event.preventDefault();
		}

		return (
			<>
				<div id="content">
					<div className="papa">
						<h3><span>{songName}</span><a className="imFavorite" onClick={(songName)? this.clickHandler : this.voidHandler } href="#"><img src={(isFavorite)? `img/${favImg.unlove}`:`img/${favImg.love}`} /></a></h3>
						<p>{currentVerse}</p>
					</div>
				</div><br/>
				<ArrowNav index={index} catName={currentCatName} songName={songName} total={Math.max(0,verses.length -1)} images={images.arrows} goToVerse={this.goToVerse} />
				<NavHelper goToVerse={this.goToVerse} currentIndex={index} catName={currentCatName} songName={songName} length={verses.length} />
			</>

			)
	}
}
Content.contextType = Custom;

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
	constructor(props,context){
		super(props);

		this.store = context.store;
		this.adjustHeight = this.adjustHeight.bind(this);
		this.getDimensions = this.getDimensions.bind(this);
		this.isInTheMiddle = this.isInTheMiddle.bind(this);
		this.putInTheMiddle = this.putInTheMiddle.bind(this);
		this.state = { view:false };
	}



	componentDidMount(){
		let store = this.store;

		this.wHeight = window.innerHeight;
		this.node = document.querySelector(".popUp");
		this.box = document.querySelector(".popUp .Box");
		let dimensions = this.node.getBoundingClientRect();
		this.height = dimensions.height;
		this.top = dimensions.top;
		this.unsubscribe = store.subscribe(()=>{
			let state = store.getState(),
			{ addCatDiv:addCatView, addSongDiv:addSongView, createStreamDiv:createStreamView } = state.ui.show,
			newState = {};

			if(addCatView || addSongView || createStreamView){
				if(!this.state.view){
					this.adjustHeight();
					newState.view = true;
				}
			}
			else if(this.state.view){
				newState.view = false;
			}

			if(Object.keys(newState).length){
				this.setState(newState);
			}
		})

		window.onresize = ()=>{
			this.height = this.node.getBoundingClientRect().height;
			if(window.innerHeight != this.wHeight)
				this.wHeight = window.innerHeight;
			this.adjustHeight();
		}
	}

	componentWillUmount(){
		this.unsubscribe();
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
		let hide = this.state.view ? '' : 'whoosh';
		return (
			<div className={`popUp ${hide}`}>
				<div className={`popWrapper abs`}>
					<div className="wrap">
						<div className="Box il silverBack TLRad TRRad BLRad BRRad">
							{/*<SetupPopUpC adjustHeight={this.adjustHeight} />*/}
								<AddSongDiv adjustHeight={this.adjustHeight} {...props} />
								<AddCatDiv adjustHeight={this.adjustHeight} {...props}  />
									<CreateStream adjustHeight={this.adjustHeight} {...props} />
						</div><Liner />
					</div>
				</div>
			</div>
		)
	}
}
PopUp.contextType = Custom;

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

class Settings extends React.PureComponent{
	constructor(props,context){
		super(props);
		let state = context.store.getState();

		this.store = context.store;
		this.state = { view: state.ui.show.settingList }
		this.changeView = this.changeView.bind(this);
	}

	componentDidUpdate(){
		invoqueAfterMount('settings');
	}

	componentDidMount(){
		let store = this.store;

		this.unsubscribe = store.subscribe(()=>{
			let state = store.getState();

			if(state.ui.show.settingList != this.state.view){
				this.setState({ view: state.ui.show.settingList });
			}
		})
	}

	componentWillUmount(){
		this.unsubscribe();
	}

	changeView(){
		let { changeSettingListView } = this.props,
		store = this.store,
		{ view } = this.state;


		store.dispatch(changeSettingListView(!view));
	}

	render(){
		let { view } = this.state,
		props = this.props;

		let hide = (view)? '':'whoosh';
		return (
			<div className="settings il c0 tip" id="settings">
				<div>
					<a className="settingsToggler" onClick={this.changeView} href="#"><img className="vmid" src="img/settings.png" /><Liner additionalClass="vmid"/>
					</a>
				</div>
				<div className={`abs abBottom list shadowR BRRad BLRad silverBack ${hide}`}>
					<div>
						<DayMode {...props} />
						<Language {...props} />
					</div>
				</div>

			</div>
			)
	}
}
Settings.contextType = Custom;

class DayMode extends React.PureComponent{
	constructor(props,context){
		super(props);
		let store = context.store,
		state = store.getState();

		this.store = store;
		this.state = { night: state.ui.nightMode }
		this.changeMode = this.changeMode.bind(this);
		this.initTime = Date.now();
	}

	componentDidMount(){
		let { night } = this.state,
		react_container = document.getElementById("react-container"),
		store = this.store;

		this.unsubscribe = store.subscribe(()=>{
			let state = store.getState();

			if(state.ui.nightMode != this.state.night){
				this.setState({ night: state.ui.nightMode })
			}
		})

		if(!react_container)
			throw Error("DayMode:componentDidMount No react container found");
		else{
			this.reactContainer = react_container;
			this.baseClassName = react_container.className.split(" ")[0];

			if(night){
				this.reactContainer.className = `${this.baseClassName} night`;
			}
		}
	}

	componentDidUpdate(){
		let { night } = this.state,
		reactContainer = this.reactContainer,
		baseClassName = this.baseClassName,
		newClassName = (night)? `${baseClassName} night`: baseClassName

		reactContainer.className = newClassName;
	}

	changeMode(event){
		let { night } = this.state,
		{ changeNightMode } = this.props;
		event.preventDefault(); 
		event.stopPropagation(),
		store = this.store;

		store.dispatch(changeNightMode(!night));
	}
	render(){
		let { night } = this.state;
		return (
			<div className="il f1 dayMode">
				<span id="night">Night Mode </span> <a className="modeShift" href="#" onClick={this.changeMode}>{(night)? "On":"Off"}</a>
			</div>
		)
	}
}
DayMode.contextType = Custom;

class Language extends React.Component{
	constructor(props,context){
		super(props);
		let store = context.store;


		this.state = { show:false};
		this.store = store;
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
		let { changeLanguage, lang } = this.props;
		let hide = (this.state.show)? '':'whoosh';
		let list = [ "En","Fr" ];

		return (
			<div className="language il f1">
				<span id="language">Language</span><a className="langShift" href="#" onClick={this.changeView}>{lang}</a>
				<div className={`list ${hide}`}>
					{
						list.map((lang2,i)=>
							<a className={(lang == lang2)? signal.success:''} key={i} href="#" onClick={()=> this.store.dispatch(changeLanguage(lang2))}>{lang2}</a>
							)
					}
				</div>
			</div>
		)
	}
}
Language.contextType = Custom;

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
		}).catch((e)=>{
			console.error("Guider toStep catch Error",e);
		})
	}
	toSection(section){
		let state = this.state;
		this.animate(false).then(()=>{
			this.setState({...state, section, action: section.action});
		}).then(()=>{
			this.animate(true);
		}).catch((e)=>{
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
		}).catch((e)=>{
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
			).catch((e)=>{
				console.error("Couldn't clear to go to ",((next)? 'next':'prev'),'step');
			})
	}

	goToStep(next=true){
		let { step } = this.state;
		let clear = this.clear();

		clear().then(()=> this.toStep((next)? step.nextStep: step.prevStep)).catch((e)=>{
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

export const HTML = ({data, styles,metas,links, scripts,title,store,nodeJs, manifest})=>{
	function ap(t){
		let a = document.body;
		let c = document.createElement("p");
		c.textContent = t;
		a.appendChild(c);
	}
	let manifestFile = (manifest)? 'song.appcache':'';

	return (
		<html manifest={manifestFile}>
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
						<App />
					</div>
					{
						(scripts.tail && scripts.tail.length)? <Scripts lists={scripts.tail} /> : ''
					}
				</body>
		</html>
		)
}

export class App extends React.Component{
	constructor(props,context){
		super(props);
		let guider = localStorage.guider,
		store = context.store,
		state = store.getState();


		this.state = {showGuide:(props.step)? true:false, lang: state.language, direction: state.ui.direction };
		this.store = store;
		this.store = context.store;
		this.endGuide = this.endGuide.bind(this);
		this.keyRecorder = this.keyRecorder.bind(this);
		this.initTime = Date.now();

		if(props.db){
			db = props.db;
			Validator = new props.validator();
			notifier = new props.note({displayTime, seq: props.seq, signal});
			notifier2 = new props.note({displayTime, seq: props.seq, signal});
			Pseq = new props.seq();
		}
	}

	endGuide(){
		this.setState({showGuide:false});
		window.removeEventListener('keydown',this.keyRecorder);
		localStorage.guider = true;
	}

	componentDidMount(){
		let store = this.store,
		props = this.props;

		this.unsubscribe = store.subscribe(()=>{
			let cState = store.getState(),
			state = this.state;

			if(state.lang != cState.language){
				this.setState({ lang: cState.language });
			}
		})
		window.addEventListener('keydown',this.keyRecorder);

		//registerWorker('worker.js');
	}
	componentWillUmount(){
		this.unsubscribe();
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
		let props = this.props,
		{ showGuide, direction, lang } = this.state,
		{ step, streamManager,fAccess } = props,
		Guide = (showGuide)? <Guider end={this.endGuide} step={step} lang={lang} />: null;

		return (
			<ErrorBoundary>
				<Setup streamManager={streamManager} fAccess={fAccess} fastAccess={this.props.fastAccess} {...props} />
								<First direction={direction} lang={lang} {...props} />
								
								<Second direction={direction} lang={lang} {...props}/>
								{Guide}
								<PopUp {...props} lang={lang} />
			</ErrorBoundary>
			)
	}
}
App.contextType = Custom;

const Liner = ({additionalClass=''})=> <div className={`tight ${additionalClass}`}> </div>