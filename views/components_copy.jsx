import React  from 'react';
import {unmountComponentAtNode}  from 'react-dom';
import { connect } from 'react-redux'
import { store1, store2, Action1, Action2, dbChooser,sameCompose, compose, relay, getAllReturn, seq, fetcher,streamer, abortSubscription,SUB, indexChanger, setLocal, getLocal, curry, safeOp, helpWithCoordinate} from '../utilis/BrowserDb.cjs';
import F from '../utilis/prop_to_Func.cjs'
import Text from '../utilis/Text.cjs';
import * as Action from '../utilis/aCreator.cjs'

const Texts = React.createContext(Text);

const displayTime = { fast:50, normal:1500, medium:3000, long:20000};
const insertStatus = {
	FAILED:0,
	SUCCESS:1,
	DUPLICATE:2,
	COMPLETE:3,
	FAIL_ALL:4
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

	this.add = (message,progress,t,node)=>{
		sequence.add(()=>{
			return new Promise((resolve)=>{
				clearTimeout(counter);
				jsx.setState({message,progress,node});
				counter = setTimeout(()=>{
					resolve();
				},t || timeout)
			})
		});
	}
	this.addSpeed = (message,progress,t,node)=>{
		t = t || timeout;
		sequence.add(()=>{
			clearTimeout(counter)
			let state = jsx.state;
			jsx.setState({message,progress,node});
			counter = setTimeout(()=>{
				this.clear();
			},t);
			return Promise.resolve();
		})
	}
	this.clear = ()=>{
		this.add("",null, displayTime.fast);
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

function startStream(name){
	S.setName(name,()=> changeStreamCreationImage(`img/${startStream.img}`));
	setLocal("stream",JSON.stringify({name,time: Date.now()}));
	startStream.f();
}

function stopStream(name){
	S.setName("",()=> changeStreamCreationImage(`img/${stopStream.img}`));
	setLocal("stream","");
	stopStream.f();
}

const notifier = new note();
const notifier2 = new note();
const db = (global.alert)? dbChooser('Test'): null;
const Categories = {};
const Songs = {};
const Pseq = new seq();
const directAccess = {};
const fastAccess = {};

var S;

/*export */ class First extends React.Component{
	constructor(props){
		super(props);
		this.clickHandler = this.clickHandler.bind(this);
	}
	componentDidMount(){
		let props = this.props;
		S = props.streamManager;
		S.addFastAccess(fastAccess);

		this.node = document.getElementById('first');
		startStream.f = this.props.startStream || function(){ console.error('First componentDidMount, startStream not defined in props')}
		stopStream.f  =	this.props.stopStream || function(){ console.error('First componentDidMount, stopStream not defined in props')};
		window.onkeydown = (event)=>{
			if(!/input/i.test(event.target.tagName)){
				if(event.altKey)
					this.props.setControl(!this.props.controls);
			}
		}

		window.ss = S;
		window.fetcher = fetcher;
		window.localer = getLocal;
		let oldStream = getLocal("stream");

		if(this.props.fastAccess){
			this.props.fastAccess.then((cats)=>{
				for(var catName in cats){
					if(cats.hasOwnProperty(catName)){
						fastAccess[catName] = {online:{},offline:{}};
						let onlineSongs = cats[catName].songs.online;
						let offlineSongs = cats[catName].songs.offline;
						onlineSongs.forEach((song,i)=>{
							fastAccess[catName.toLowerCase()].online[song.name.toUpperCase()] = true;
						})
						offlineSongs.forEach((song,i)=>{
							fastAccess[catName.toLowerCase()].offline[song.name.toUpperCase()] = true;
						})
					}
				}
				return true;
			}).catch((e)=> console.log("First fastAccess catch error",e));
		}
		if(oldStream){
			oldStream = JSON.parse(oldStream);
			if((Date.now() - oldStream.time) > 120000)
				localStorage.clear();
			else{
				
				fetcher({
					url:`stream/update?n=${oldStream.name}`,
					s:(response)=>{
						if(response.exist)
							startStream(oldStream.name);
						else
							localStorage.clear();
					},
					e:(error)=>{
						console.log("Error while trying to confirm local stream",error);
					}
				})
			}
		}

		startStream.img = props.images.streamCreate.stop;
		stopStream.img = props.images.streamCreate.start;

		window.db = db;
		window.CC = Categories;
		
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

	updateSongs(to){
		this.props.updateSongList(to);
	}
	render(){
		let props = this.props;
		let favorites = props.favorites;
		let night = (props.nightMode)? 'night': '';
		if(props.addCatView)
			console.log("Viewing addCatDiv");

		return (
		<div onClick={this.clickHandler} onScroll={()=>{ if(props.to <= (props.onlineSongs.length + props.offlineSongs.length)){ let percent = Math.floor(((this.node.clientHeight + this.node.scrollTop) / this.node.scrollHeight) * 100); (percent > 65)? this.updateSongs(props.to + props.increment):'' }}} id="first" className={(props.direction && props.direction == "Right")? "il TRR "+night:"il TLL "+night}>
			<Notification {...F.notification(props)}/>
			<Toggler {...F.toggler(props)} />
			<Head1 {...props}/>
			{/*<OnlineSongs subscribeToStream={props.subscribeToStream} songs={props.onlineSongs} setCurrentSong={props.setCurrentSong} changeIndex={props.changeIndex} setMessage={props.setMessage} controls={props.controls} changeAddSongView={props.changeAddSongView} songText={props.songText} removeSong={props.removeSong} addSong={props.addSong} updateForced={props.updateForced} setCurrentSong={props.setCurrentSong} lang={props.lang} songLength={props.onlineSongs.length} Text={props.Text} currentCat={props.currentCat} to={props.to} location='online' downloadImage={props.images.download} />*/}
			<OnlineSongs {...F.onlineSongs(props)} />
			{/*<OfflineSongs songs={props.offlineSongs} updateForced={props.updateForced} setCurrentSong={props.setCurrentSong} lang={props.lang} songText={props.songListText || props.Text.songList} Text={props.Text} controls={props.controls} to={props.to} lang={props.lang} currentCat={props.currentCat} location={'offline'} setCurrentSong={props.setCurrentSong} removeSong={props.removeSong} addSong={props.addSong} setMessage={props.setMessage} changeIndex={props.changeIndex} changeAddSongView={props.changeAddSongView} subscribedToStream={props.subscribedToStream} subscribeToStream={props.subscribeToStream} downloadImage={props.images.download} />*/}
			<OfflineSongs {...F.offlineSongs(props)} />
		</div>
		)
	}
}

class OnlineSongs extends React.PureComponent{
	constructor(props){
		super(props);

		this.state = {show:false};
		this.initialSongLength = props.songLength;
		this.SavedSongs = 0;
		this.failedToSavedSongs = [];
		this.Text = this.props.Text;
		this.state = {report:false};
		this.downloading = {};

		this.manageShowing = this.manageShowing.bind(this);
		this.Notify = curry(this.Notify)(this.Text);
		this.throwReport = this.throwReport.bind(this);
		this.traceReport = this.traceReport.bind(this);
	}

	componentDidUpdate(prevProps){
		let props = this.props;
		let state = this.state;
		if(!this.initialSongLength && props.songLength || prevProps.currentCat.name != props.currentCat.name)
			this.initialSongLength = props.songLength;
		
		if(!props.songLength && state.report){
			this.setState({report:false});
		}
		invoqueAfterMount('onlineSong');
	}

	traceReport(){
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
		this.downloading[this.props.currentCat.name] = true;
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

	Notify(Text,lang,status,name,percent){
		if(status == insertStatus.SUCCESS){
			notifier.addSpeed(Text.Song.insertion.success(lang,name),percent)
		}
		else if(status == insertStatus.DUPLICATE){
			notifier.addSpeed(Text.Song.insertion.duplicate(lang,name),percent);
		}
		else if(status == insertStatus.FAILED){
			notifier.addSpeed(Text.Song.insertion.failed(lang,name));
		}
		else if(status == insertStatus.COMPLETE)
			notifier.addSpeed(Text.Song.insertion.allDone(lang),percent);
		else if(status == insertStatus.FAIL_ALL)
			notifier.addSpeed(Text.Song.insertion.allNotDone(langs,name,percent));

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

		// Report expect to have status, name, parameter
		if(mustReport){
			let composeBinded = compose.bind(this);
			let getAllReturnBinded = getAllReturn.bind(this);
			let relayBinded = relay.bind(this);
			//report = ()=>{}
			let notify = this.Notify(lang);
			report = composeBinded(notify,this.traceReport,notify,getAllReturnBinded(this.getPercentage,relayBinded(this.updateSongStatus)));
		}

		return (
			<div id="onlineSong">
				<div className="onlineHead">
					<a id="onLink" onClick={this.manageShowing} href="#">Online</a><span>{props.songLength}</span>{(show && props.songLength)? <Download src={props.downloadImage} download={()=> Promise.resolve((db.isBogus)? [null]:[])} action={[()=> { return new Promise((resolve)=> { resolve(false); this.throwReport();})}]} />:''}
				</div>
				{(show)? <SongList report={report} includeAdder={false} {...props} />:''}
			</div>
			)
	}
}

class OfflineSongs extends React.Component{
	constructor(props){
		super(props);
		this.state = {show:false};
		this.manageShowing = this.manageShowing.bind(this);
	}

	componentDidUpdate(){
		invoqueAfterMount('offlineSong')
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

		return (
			<div id="offlineSong">
				<div>
					<a id="offLink" onClick={this.manageShowing} href="#">Offline</a><span>{props.songs.length}</span>
				</div>
				{(show)? <SongList includeModify={true} includeAdder={true} {...props}/>:''}
			</div>
			)
	}
}

class Notification extends React.PureComponent{
	constructor(props){
		super(props);
		this.state = {message:"",node:null};
	}
	componentDidMount(){
		if(this.props.parent == "first")
			notifier.setJsx(this);
		else
			notifier2.setJsx(this);
	}
	render(){
		let {message,progress,node} = this.state;
		let percent = `${progress}%`;
		return (
			<div className={"abs "+this.props.direction} style={{overflow:"hidden"}}>
				{message}
				{(progress)?
				<div style={{width:percent, height:"20px", backgroundColor:"green"}}>

				</div>: ""}
				{(node)? node:''}
			</div>
			)
	}
}
class AddCatDiv extends React.Component{
	constructor(props){
		super(props);
		this.submit = this.submit.bind(this);
		this.updateCat = this.updateCat.bind(this);
		this.Text = this.props.Text;
		this.state = {message:"",name:""};
		this.addText = this.Text.addButtonText(this.props.lang);
		this.close = this.Text.closeButtonText(this.props.lang);
		this.cleanUp = this.cleanUp.bind(this);
	}

	componentDidMount(){
		let { _catName } = this.refs;
		_catName.onchange = ()=>{
			let state = this.state;
			this.setState({...state,name:_catName.value});
		}
		invoqueAfterMount('addCatDiv');
	}

	componentDidUpdate(){
		let {_catName} = this.refs;
		let state = this.state;

		if(this.props.controls){
			if(this.props.current.name){
				_catName.value = state.name || this.props.current.name;
				this.refs._add.textContent = this.Text.modiButtonText(this.props.lang);
			}
		}
		else if(!this.props.controls){
			_catName.value = this.state.name;
			this.refs._add.textContent = this.Text.addButtonText(this.props.lang);
		}

		invoqueAfterMount('addCatDiv');
	}
	submit(){
		let catNames = this.props.catNames.map((catName)=> catName.toLowerCase());
		let catName = this.refs._catName;

		if(!catName.value){
			this.setState({...this.state,message:this.Text.message.nameRequired(this.props.lang)});
			
		}
		else if(catNames.indexOf(catName.value.toLowerCase()) != -1){
			this.setState({...this.state,message:this.Text.message.alreadyExist(this.props.lang)});
			
		}
		else{
			this.props.addCategorie(catName.value);
			this.setState({...this.state,message:this.Text.message.success(this.props.lang)});
			fastAccess[catName.value.toLowerCase()] = {offline:{}, online:{}};
		}
	}
	updateCat(){
		let {_catName} = this.refs;
		let props = this.props;
		if(!_catName.value.length){
			this.setState({...this.state, message:this.Text.message.nameRequired(this.props.lang), name:_catName.value});
		}
		else if(_catName.value.toLowerCase() == props.current.name.toLowerCase()){
			this.setState({...this.state, message: this.Text.message.alreadyExist(this.props.lang)});
		}
		else{
			this.setState({...this.state, message:this.Text.message.updated(this.props.lang), name:_catName.value});
			props.updateCategorie(props.current.name,_catName.value);
			props.forceUpdate({node:'catNames', value:true});
			meticulus('catNames',()=> props.forceUpdate({node:'catNames', value:false}))
			if(fastAccess[catName.value.toLowerCase()])
				fastAccess[catName.value.toLowerCase()].offline = {}
			else{
				let oldOffline = fastAccess[catName.value.toLowerCase()].offline;
				let oldOnline = fastAccess[catName.value.toLowerCase()].online;
				fastAccess[catName.value.toLowerCase()] = {online:oldOnline, offline:oldOffline};
			}
		}
	}
	cleanUp(){
		this.setState({...this.state,message:"",name:""});
	}
	render(){
		let props = this.props;
		let l = props.lang;

		return (
			<div className={"addCat abs "}>
				<p className='message'><span>{this.state.message}</span></p>
				<p><span>{this.Text.nameHolder(l)}</span></p>
				<input ref="_catName" type="text" name="" />
				<button ref="_add" className="add" onClick={(props.controls && props.current.name)? this.updateCat: this.submit}>{this.addText}</button>
				<button ref="_close" className="close" onClick={()=>{ this.props.changeCatView(false); this.cleanUp()}}>{this.Text.closeButtonText(l)}</button>
			</div>
		)
	}
} 

class AddSongDiv extends React.Component{
	constructor(props){
		super(props);
		this.kak = this.kak.bind(this);
		this.changeVerseNumber = this.changeVerseNumber.bind(this);
		this.updateSong = this.updateSong.bind(this);
		this.deleteVerse = this.deleteVerse.bind(this);
		this.state = {VerseNumber:"",Verses: [], name:"", lang:this.props.lang,message:"",VersesText:{}};
		this.Text = this.props.Text;
	}

	componentDidMount(){
		invoqueAfterMount('AddSongDiv');
	}

	componentDidUpdate(prevProps, prevState){

		invoqueAfterMount('addSongDiv');

		try{
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

	}

	kak(e){
		e.preventDefault();
		let message = "";
		let {_name} = this.refs;
		let Verses = [];
		let  { VersesText } = this.state;
		let props = this.props;

		if(!_name.value.length){
			return this.setState({...this.state,name:"",message:this.Text.message.nameRequired(this.props.lang), VersesText}) 
		}
		if(Object.keys(this.refs).filter((s)=> (s != "_name" && s != "_verseNumber")).every((s)=> this.refs[s].value.length == 0)){
			message += this.Text.message.verseRequired(this.props.lang);
				
			this.setState({...this.state,message,name:_name.value});
			return;
		}

		for(let i=1;;i++){
			let Verse = this.refs[`_Verse${i}`];
			if(!Verse)
				break;
			else if(!Verse.value)
				message += this.Text.message.verseValueRequired(this.props.lang,i);
			else{
				VersesText[`_Verse${i}`] = Verse.value;
				Verses.push({Text:Verse.value});
			}
		}
		if(message){
			return this.setState({...this.state,message,name:_name.value,VersesText}); 
		}

		this.props.addSong(0,_name.value,this.props.currentCatName,Verses);
		this.props.forceUpdate({node:'songList',value:true});
		this.setState({...this.state,name:"",message:this.Text.message.success(this.props.lang),VersesText:{},Verses:[], VerseNumber:0})
		meticulus('songList',()=>{
			this.props.forceUpdate({node:'songList', value:false});
		})
		fastAccess[props.currentCatName.toLowerCase()].offline[_name.value.toUpperCase()] = true;
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
			this.setState({...this.state,name:"",VerseNumber:vvv || "",message:this.Text.message.nameRequired(this.props.lang)})
			return ;
		}
		if(parseInt(n)){
			
			if(n <= 0){
				this.setState({...this.state,name:nV,VerseNumber:vvv,message:this.Text.message.verseNumberBadNumber(this.props.lang)});
				return;
			}
			else if(n >= 15){
				this.setState({...this.state, name:nV, VerseNumber:vvv,message:this.Text.message.verseNumberToBig(this.props.lang)});
				return;
			}
			_verseNumber.value = n;
			this.setState({...this.state,message:"",VerseNumber:n,name:nV, Verses: new Array(n)});
		}
		else{
			this.setState({...this.state,name:nV,VerseNumber:vvv,message:this.Text.message.verseNumberNotInteger(this.props.lang)})
			
			return;
		}
	}

	checker(e){
		e.preventDefault();

		let message = "";
		let { _name } = this.refs;
		let Verses = [];
		let  { VersesText } = this.state;
		if(!_name.value.length){
			return { action: ()=>{
				this.setState({...this.state,name:"",message:this.Text.message.nameRequired(this.props.lang), VersesText}) ;
			}}
		}
		if(Object.keys(this.refs).filter((s)=> (s != "_name" && s != "_verseNumber")).every((s)=> this.refs[s].value.length == 0)){
			message += this.Text.message.verseRequired(this.props.lang);

			return { action: ()=>{
				this.setState({...this.state,message,name:_name.value});
			}}
		}

		for(let i=1;;i++){
			let Verse = this.refs[`_Verse${i}`];
			if(!Verse)
				break;
			else if(!Verse.value)
				message += this.Text.message.verseValueRequired(this.props.lang,i);
			else{
				VersesText[`_Verse${i}`] = Verse.value;
				Verses.push({Text:Verse.value});
			}
		}
		if(message){
			return { action: ()=>{
				this.setState({...this.state,message,name:_name.value,VersesText}); 
			}}
		}
		return {Verses,_name};
	}

	updateSong(e){
		let { action, Verses, _name } = this.checker(e);

		if(action)
			return action();
		else{
			let props = props;
			let location = props.location;
			props.updateSong(props.currentCatName,props.current.id,_name.value,Verses)
			props.setCurrentSong(_name.value,location);
			this.setState({...this.state, message:this.Text.message.updated(props.lang)});
			fastAccess[props.currentCatName.toLowerCase()].offline[_name.value.toUpperCase()] = true;
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

	render(){
		let props = this.props;
		let { Verses,name } = this.state;
		let l = this.props.lang;
		let verseNumber = (props.controls)? (Verses && Verses.length) || (props.current.Verses && props.current.Verses.length) || 0: Verses.length ; 

		return (
			<div className={"abs addSong "}>
				<p><span>{this.state.message}</span></p>
				<p><span>{this.Text.nameHolder(l)}</span></p>
				<input ref="_name" type="text" />
				<p><span>{this.Text.verseNumberHolder(l)}</span><input className="verseNumber" ref="_verseNumber" type="text" placeholder={verseNumber} /><button className="changeVerse" onClick={this.changeVerseNumber}>changer</button></p>
				{[...Array(verseNumber)].map((verse,i)=>
					<div>
						<textarea cols="50%" rows="5%" ref={`_Verse${i+1}`} className="Verse" ></textarea>
						{(verseNumber-1 == i)? <button className='plus' onClick={()=> this.changeVerseNumber(verseNumber+ 1)}>+</button>:''}
						{(i > 0 )? <button className='minus' onClick={()=> this.deleteVerse(i+1)}>-</button>:''}
					</div>
				)}
				<button className="add" onClick={(props.controls)? this.updateSong:this.kak}>{(props.controls)? this.Text.modiButtonText(l):this.Text.addButtonText(l)}</button>
				<button className="close" onClick={()=> {props.changeAddSongView(false); props.changeVerseDiv(0); this.cleanUp(); }}>{this.Text.closeButtonText(l)}</button>
			</div>
			)
	}
}

class CreateStream extends React.Component{
	constructor(props){
		super(props);
		this.save = this.save.bind(this);
		this.cleanUp = this.cleanUp.bind(this);
		this.state = {message:()=> "", disabled:false, lang:props.lang};
		this.Text = props.Text;
	}

	componentDidMount(){
		invoqueAfterMount('createStream');
	}

	componentDidUpdate(prevProps,prevState){
		invoqueAfterMount('createStream');
		if(prevProps.lang != this.props.lang){
			this.setState({...this.state, lang:this.props.lang});
		}
	}

	save(){
		if(!this.props.appReachable)
			return this.setState({...this.state,message:this.Text.message.networkProblem});
		if(this.props.subscribedToStream)
			return this.setState({...this.state,message:this.Text.message.UnsubscribeFirst});

		let {_name} = this.refs;
		if(!_name.value.length){
			return this.setState({...this.state, message: this.Text.message.nameRequired});
		}
		
		var counter = 1;
		var c = setInterval(()=>{
			this.setState({message:()=> ".".repeat((counter++ % 10)+1)});
		},500);
		fetcher({
			url:`/stream/create/${_name.value}?s=${this.props.songName}&c=${this.props.catName}&i=${this.props.index || 0}`,
			method:'POST',
			data:_name.value,
			s:(s)=>{
				
				clearInterval(c);
				this.setState({...this.state,message:this.Text.message.streamCreated, disabled:true})
				
				startStream(_name.value.toLowerCase());
			},
			e:({status,error})=>{
				clearInterval(c);
				if(e.response && e.response.code && e.response.code == 6)
					return this.setState({...this.state,message:this.Text.message.nameDuplication});
				this.setState({...this.state,message:this.Text.message.creationError});
				this.props.setAppUnreachable();
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
		this.setState({...this.state,message:()=> "",disabled:false});
		props.changeView(false);
	}
	render(){
		console.log("createStream componentDidrender");
		let state = this.state;
		let lang = this.props.lang
		return (
				<div className={"abs addSong createStream "}>
					<p className='message'>{state.message(lang)}</p>
					{
						(!state.disabled)?<>
							<p><span>{this.Text.nameHolder(lang)}</span></p>
							<input ref="_name" type="text" />
							<button className="add" onClick={this.save}>Creer</button>
							</>: ''
					}
					<button className='close' onClick={this.cleanUp}>Fermer</button>
				</div>
			)
	}
}


/*export*/ class Second extends React.Component{
	constructor(props){
		super(props);
		this.clickHandler = this.clickHandler.bind(this);
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
		let night = (props.nightMode)? 'night':'';
		return (
			<div onClick={this.clickHandler} id="second" className={(props.direction && props.direction == "Right")? 'il TRRR '+night:'il FULL '+night}>
				<Notification />
				{
					(props.addCatView)?
					<AddCatDiv {...F.addCatDiv(props)} />
					:''
				}
				{
					(props.addSongView)?
					<AddSongDiv {...F.addSongDiv(props)} />
					:
					''
				}
				{
					(props.createStreamView)? 
					<CreateStream {...F.createStream(props)} />
					:''
				}
				<Toggler {...F.toggler(props)} />
				<Head2 {...props} />
				<SongContent {...props}/>
				<Settings {...F.settings(props)} />
			</div>
			)
	}
}



const Head1 = (props)=>{
	return (
		<div className="head">
			<div className="il c1"><a href="#" onClick={(event)=> {event.preventDefault(); event.stopPropagation(); props.changeCatListView(!props.catListView)}}><img src={`img/${props.images.categorie}`} /></a></div>
			
			<Input {...F.input(props)} holder="Rechercher"/>
			<Liner />
			<CatNames {...F.catNames(props)} />
			<ResultList {...F.resultList(props)} />
		</div>
		)
}

class Input extends React.Component{

	constructor(props){
		super(props);
		this.inlet = "Josaphat";
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
			}
		}
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


class Toggler extends React.Component{
	constructor(props){
		super(props);
		this.mustChangeDirection = this.mustChangeDirection.bind(this);
		this.checked = false;
	}

	componentDidMount(){
		if(!this.checked && this.mustChangeDirection())
			this.props.changeDirection("Left");

		if(window.onresize){
			window.onresize = ()=>{
				this.checked = false;
			}
		}
	}

	componentDidUpdate(prevProps){
		if(!this.checked && this.mustChangeDirection())
			this.props.changeDirection("Left");
	}

	mustChangeDirection(){
		let first = document.getElementById("first");
		if(!first || getComputedStyle(first).display == 'none'){
			if(this.props.direction == "Right"){
				this.checked = true;
				return true;
			}
		}
		return false;
	}

	render(){
		let { direction, changeDirection } = this.props;
		direction = direction || "Right";

		return (
			<div className="il c3">
				<a onClick={(event)=>{ event.preventDefault(); event.stopPropagation(); changeDirection(((direction == "Right")? "Left": "Right"))}} href="#" ><img className={(direction=="Right")? 'abs Toggler TR':'abs Toggler TL'} src={"img/Toggle"+direction+".png"} /></a>
			</div>
			)	

	}
}

const Liner = ()=> <div className="tight"> </div>


class CatNames extends React.Component{
	constructor(props){
		super(props);
	}

	shouldComponentUpdate(nextProps){
		let props = this.props;
		if(nextProps.updateForced || nextProps.controls != props.controls || nextProps.lang != props.lang || nextProps.view != props.view || nextProps.catNames.length != props.catNames.length)
			return true;

		return false;
	}

	componentDidUpdate(){
		invoqueAfterMount('catNames');
	}

	render(){
		let props = this.props;
		let hide = (props.view)? '':'whoosh';
		let lang = props.lang;

		return (
			<>
				<Texts.Consumer>
				{
					text=> <List 
							download={(global.alert)? (name)=> { return db.getCategorie(name)()}: null} 
							args={{}} 
							action2={[({name})=> {  return db.insertCategorie(name)().then((r)=>{ if(r) {notifier.addSpeed(text.Categorie.insertion.success(lang,name)); return true}}).catch((e)=> { notifier.addSpeed(text.Categorie.insertion.failed(lang,name));})}]} 
							modif={(item)=> { props.setMessage(""); props.setCurrentCat(item.name || item); props.changeCatView(true)}} 
							wipe={(item)=> props.wipe(item.name || item)}  
							controls={props.controls} 
							first={()=> <div><div id="addCat" className="il f1"><a onClick={(event)=> { event.preventDefault();props.setMessage(""); props.changeCatView(true)}} href="#">{props.catDivText.addCatDiv(lang)}</a></div></div>} 
							src={props.image}
							action={(item)=>{  props.changeIndex(0); props.setCurrentCat(item.name || item); props.updateSongList(100)}} 
							list={props.catNames} 
							abs={{style:"abs abBottom shadowR list catNames "+hide}}
						/>

				}
				</Texts.Consumer>
			</>
			)
	}
}

const CatNamesConnected = connect((state,ownProps)=>{
	return {
		updateForced: state.updateForced.catNames,
		...ownProps
	}
})(CatNames)

const ResultList = ({resultView,songs=[],setCurrentCat,setCurrentSong})=>{
	songs = (songs.length)? songs: ["Aucun resultat"];
	let hide = (resultView)? '':'whoosh';
	return (
		<List action={(item)=>{ console.log("REsultList item",item); setCurrentCat(item.catName); setCurrentSong(item.name.toUpperCase(), item.location)}} abs={{style:"abs abBottom list result shadowC "+hide}} list={songs}/>
		)
}

const List = ({putInLastAccess,hide,updateMyCat,args,song,abs,src,list = [],action,action2,first=()=>{},controls,wipe,modif,download,downloadAll})=>{
	return (
		<div className={(abs)? abs.style: ""}>
			{first()}
			{list.map((item,i)=>{
				if(item.name) item = {...item,id:i};
						return	(<div className={(song)? `p${i}`:''} key={i}>
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
			args = {...args,...item};
		else
			args['name'] = name;
	}
	return (
		<>
			<div className={`il f1 ${name}`}>
				<a inlist="true" onClick={(action)? (event)=>{ event.preventDefault(); action(item) }:'' } href="#">{name}</a>
			</div>
			{
				(src || controls)?
					<>
						<div className='il'>
							{(controls)? <Controls wipe={()=> wipe(item)} modif={()=> modif(item)} />: (action2)? <Download hide={()=> hide(i)} args={args} downloadAll={downloadAll} updateMyCat={updateMyCat} name={name} song={song} src={src} download={download} action={action2} />:''}
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
				<a className='wipe' onClick={(event)=>{ event.preventDefault(); props.wipe()}} href="#">D</a>
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

	/*shouldComponentUpdate(nextProp,nextState){
		return true;
	}*/

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
			}).catch(reject);
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
		}).catch((e)=>{
			console.error("checkImageDownload Error",e);
		})
	}

	save(e){
		function ap(t){
			let s = document.getElementById("content");
			let c = document.createElement("p");
			c.textContent = t;
			s.appendChild(c);
		}

		ap(`download Img clicked`);
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
		}).catch((e)=>{
			alert("doAction catch Error");
			alert(e.message);
		});

	}

	render(){
		var show = this.state.img;
		if(!this.props.song && !Categories[this.name] && this.name){
			Categories[this.name] = {img:show, setState:this.setState.bind(this)};
		}
		else if(this.name)
			Songs[this.name] = {img:show, setState:this.setState.bind(this)};

		return (
					(show)? <a className='downloader' onClick={this.save} href="#" ref='dad'><img src={'img/'+this.props.src} /></a>:''
			
			)
	}
}

class SongList extends React.Component{
	constructor(props,context){
		super(props);
		this.text = this.props.Text;
	}

	shouldComponentUpdate(nextProps,nextState){
		let props = this.props;
		
		if(nextProps.updateForced.songList || nextProps.controls != props.controls || nextProps.to != props.to || nextProps.lang != props.lang || nextProps.currentCat.name != props.currentCat.name || (nextProps.report  &&  !props.report) || (props.report && !nextProps.report))
			return true;

		return false;
	}

	componentDidUpdate(){
		invoqueAfterMount('songList');
	}

	render(){
		let props = this.props;
		let location = props.location || 'online';
		let songs = props.songs;
		let { lang } = props;
		let saveSequence = new seq();
		let report = props.report;
		if(!fastAccess[props.currentCat.name])
			fastAccess[props.currentCat.name] = {};

		let songProps = {
				song:(db.isBogus)? false:true,
				updateMyCat:()=>{
					if(Categories[props.currentCat.name].img)
						Categories[props.currentCat.name].setState({img:false});
				},
				download:(global.alert)? ({name,cat})=> db.getSong(name,cat)(): null,
				args:{cat:props.currentCat.name},
				action2:[({name,Verses,cat})=> {
					let self = this;

					function reportSuccess(removeSong,addSong){
						//
						if(report){
							//report(insertStatus.SUCCESS,name);
						}
						else{
							//notifier.addSpeed(this.text.Song.insertion.success(lang,name)); 
						}
						removeSong(cat,name); addSong(1,name,cat,Verses,'offline');
						return true;
					}

					function reportError(){
						//
						if(report){
							//report(insertStatus.FAILED,name);
						}
						else{
							//notifier.addSpeed(this.text.Song.failed(lang,name));
						}
						return false;
					}

					return new Promise((resolve,reject)=>{

						saveSequence.subscribe(saveSequence.add(()=>
							db.insertSong(name,Verses,cat)().then((r)=>{
								if(r){
									return reportSuccess(props.removeSong,props.addSong);
								}
								else{
									
									//console.error("songList First insertSong Error",r);
									return db.insertCategorie(cat)().then((r)=>{
										
										if(r){
											
											return db.insertSong(name,Verses,cat)().then((r)=>{
												
												if(r){
													
													return reportSuccess(props.removeSong,props.addSong);
												}
												else{
													
													console.error("songList second insertSong Error",r);
													return reportError();
												}
											}).catch((e)=>{
												
												alert(e.message);
												return e;
											});
										}
										else{
											
											return reportError();
										}
									}).catch((e)=>{
										
										if(e.code == 6){
											
											console.error("Integrity error",e);
											return db.insertSong(name,Verses,cat)().then((r)=>{
												
												if(r){
													
													return reportSuccess(props.removeSong,props.addSong);
												}
												else{
													
													console.log("songList catch insertSong Error",r);
													return reportError();
												}
											}).catch((e)=>{
												
												console.error("songList catch insertSong catch error");
												return e;
											})
										}
										else{
												
											return e;
										}
									});
								}
							}).catch((e)=>{
								
								alert(e.message);
									//notifier.addSpeed(this.text.Song.insertion.failed(lang,name));
									return e;
								})
						),(f)=>{ 
							if(f){
								delete fastAccess[cat].online[name.toUpperCase()];
								if(!fastAccess[cat].offline[name.toUpperCase()])
									fastAccess[cat].offline[name.toUpperCase()] = true;
							} 
							resolve(f);}, (e)=> reject(e));
					})
				}],
				modif:(!props.includeModify)? null: (item)=> { props.setMessage(""); props.changeIndex(0); props.setCurrentSong(item.name,location); props.changeAddSongView(true)},
				wipe:(item)=> { var name = item.name || item; this.props.removeSong(this.props.currentCat.name,name,location); if(this.props.currentSong.name == name) this.props.setCurrentSong("");},
				controls:props.controls,
				first:(props.includeAdder)? (!props.currentCat.name)? ()=> "":()=> <div><div id="addSong" className="il f1"><a onClick={(event)=> {event.preventDefault(); props.setMessage(""); props.changeAddSongView(true)}} href="#">{props.songText.list(props.lang)}</a></div><div className="il"></div></div>: ()=>{},
				action:(x)=>{ abortSubscription(fetcher); S.updateStream(props.currentCat.name,x.name,0,x.Verses); props.setCurrentSong(x.name,location); if(props.subscribedToStream) props.subscribeToStream(false); },
				src:props.downloadImage,
				downloadAll:(report)? true:false,
				list:(report)? songs.slice(0,100) : songs.slice(0,20/*props.to*/),
				abs:{style:'songList'},
				hide:(index)=>{
					
					let className = `.p${index}`
					let parent = document.querySelector(className);
					if(parent)
						parent.style.display = "none";
					else
						console.log("Couldn't hide p"+index);
					
				}
		};

		return <List {...songProps} />;
	}
}


const Head2 = (props)=>{
	let favListView = props.favListView;
	let streamListView = props.streamListView;
	return (
		<div className="head">
			<Favorite {...F.favorite(props)} />
			<StreamCreation {...F.streamCreation(props)} />
			<StreamList {...F.streamList(props)} />
			<Liner />
		</div>
		)
}

const Favorite = ({image,countFav,setCurrentSong,setCurrentCat,currentCat,favorites,view, changeFavListView})=>{
	let hide = (view)? '':'whoosh'
	let favList = [];
	for( var catName in favorites){
		if(favorites.hasOwnProperty(catName)){
			let s = favorites[catName]
			for(var sn in s){
				if(s.hasOwnProperty(sn)){
					let n = {catName,...s[sn]};
					n.name = sn;
					favList.push(n)
				}
			}
		}
	}
	return (
		<div className="fav il c1">
			<div>
				<a id="favLink" onClick={(event)=> {event.preventDefault(); event.stopPropagation(); changeFavListView(!view)}} href="#"><img src={`img/${image}`}/><span className="counter">{countFav}</span></a>
			</div>
			{(hide)? '': <List action={(item)=>{ setCurrentCat(item.catName); setCurrentSong(item.name, item.location);  }}  abs={{style:"abs abBottom list shadowR "}} list={favList} />}
		</div>
		)
}

class StreamCreation extends React.Component{
	constructor(props,context){
		super(props);
		this.showCreateStream = this.showCreateStream.bind(this);
		this.stopStream = this.stopStream.bind(this);
		this.text = context;
		this.images = this.props.images;
		this.state = {img:`img/${this.images.start}`};
	}

	shouldComponentUpdate(nextProps,nextState){
		let state = this.state;

		if(nextState.img != state.img)
			return true;

		return false;
	}

	componentDidUpdate(){
		invoqueAfterMount('streamCreation');
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
			<div className="streamCreation il c2">
				<div>
					{ (props.online)? <a onClick={this.showCreateStream} href="#"><img src={img} /> </a>: ""}
				</div>
			</div>
			)
	}
}
StreamCreation.contextType = Texts;


class StreamList extends React.Component{
	constructor(props,context){
		super(props);
		this.state = {list:[]}
		this.updateStream = this.updateStream.bind(this);
		this.updateCurrentStreamInfo = this.updateCurrentStreamInfo.bind(this);
		this.downloadSong = this.downloadSong.bind(this);
		this.downloadSong.inFetch = {};
		this.text = context;
		this.timer = {normal:50, error:10000};
		this.lastTimestamp;
	}

	componentDidUpdate(prevProps){
		invoqueAfterMount('streamList');
		console.log("I'm updated");

		if(!prevProps.appReachable && this.props.appReachable)
			this.updateStream(this.lastTimestamp || 0);
	}

	componentDidMount(){
		if(this.props.appReachable)
			this.updateStream();
	}
	addStream(name){
		this.setState({list:[...this.state.list,name]})
	}
	removeStream(name){
		let list = this.state.list.filter((l)=> l != name);
		this.setState({list});
	}
	updateStream(t){
		fetcher({
			url:`/stream/list${(t)? '?t='+t:''}`,
			s:({action, streams,timestamp,name})=>{
				let myStream = S.getName();
				if(!timestamp && t)
					timestamp = t;
				switch(action){
					case SUB.UPDATE:
						
						if(myStream)
							this.setState({list:streams.filter((stream)=> stream != myStream)});
						else
							this.setState({list:streams})
						setTimeout(()=>{
							this.updateStream(timestamp);
						},this.timer.normal);
						break;
					case SUB.ADD:
						if(!myStream || myStream != name)	
							this.setState({list:[...this.state.list,name]});
						setTimeout(()=>{
							this.updateStream(timestamp);
						},this.timer.normal)
						break;
					case SUB.DELETE:
						let list = this.state.list.filter((l)=> l != name);
						if(S.getName() == name){
							abortSubscription(fetcher);
						}
						
						this.setState({list:list});
						setTimeout(()=>{
							this.updateStream(timestamp);
						},this.timer.normal);
						break;
					case SUB.NOTHING:
						setTimeout(()=>{
							this.updateStream(timestamp);
						},this.timer.normal);
						break;
					default:
						console.log("Incomprehensible action",action,streams);
						setTimeout(()=>{
							this.updateStream(timestamp);
						})
				}
				
			},
			e:(e,xml)=>{
				this.props.setAppUnreachable();
				notifier2.addSpeed("Couldn't connect to the server. Check if your connection is live");
				console.log("Error while retriving the stream",e);
			}
		})
	}

	downloadSong(catName,songName,streamName){
		let downloadSong = this.downloadSong;
		let url = `stream/downloadSong?c=${catName}&s=${songName}&n=${streamName}`;
		if(downloadSong.inFetch[url])
			return;
		let props = this.props;
		downloadSong.inFetch[url] = true;
		fetcher({
			url,
			s:(response)=>{
				let action = response.action;
				delete downloadSong.inFetch[url];
				switch(action){
					case SUB.DELETE:
						notifier2.addSpeed(`The song ${songName} that you wanted to download have been deleted from the streamer.`);
						break;
					case SUB.ADD:
						let { catName, songName, Verses } = response.payload;
						if(!fastAccess[catName]){
							props.addCategorie(catName);
							notifier2.addSpeed(`Categorie ${catName} has been inserted to online song`);
							fastAccess[catName] = {online:{},offline:{}};
						}
						props.addSong(0,songName, catName, Verses, 'online');
						notifier2.addSpeed(`The song ${songName} has been inserted to the  online songs of categorie ${catName}`);
						fastAccess[catName].online[songName] = true;

						if(this.streamCatName.toLowerCase() == catName.toLowerCase() && this.streamSongName.toLowerCase() == songName.toLowerCase()){
							props.setCurrentCat(catName);
							props.setCurrentSong(songName,'online',this.streamPosition);
						}
					case SUB.STREAMDELETED:
						break;
					default:
						console.error("Inregognized response from downloadSong fetcher",action,response);
				}
			},
			e:({status,response})=>{
				delete downloadSong.inFetch[url];
				notifier2.addSpeed(`Sorry, an error occured while trying to download song ${songName}`)
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
		if(S.getName()){
			notifier2.addSpeed(this.text.Stream.subscription.alreadyStreaming(this.props.lang));
			return;
		}

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
							if(!this.subscribe.registration){
								this.subscribe.registration = streamName;
							}
							else if(this.subscribe.registration != streamName){
								this.subscribe.registration = streamName;
							}
							switch(response.action){
								case SUB.UPDATE:

									if(!update){
										notifier2.addSpeed(this.text.Stream.subscription.success(this.props.lang,streamName))
									}
									if(!response.songName || !response.catName){

									}
									else if(!fastAccess[response.catName] || (fastAccess[response.catName].online[response.songName.toUpperCase()] == undefined && fastAccess[response.catName].offline[response.songName.toUpperCase()] == undefined)){
										let a = <div style={{display:'block'}}><a href="#" style={{backgroundColor:'blue', color:'white'}} onClick={(event)=> { event.preventDefault(); this.downloadSong(response.catName ,response.songName, streamName)}}>Download</a></div>
										notifier2.addSpeed(this.text.Stream.subscription.dontHaveSong(this.props.lang,response.catName,response.songName),null,displayTime.long,a);
									}
									else{
										this.props.setCurrentCat(response.catName);
										let location = (fastAccess[response.catName].online[response.songName.toUpperCase()] != undefined)? 'online':'offline'
										this.props.setCurrentSong(response.songName,location,parseInt(response.position));
									}
									
									this.updateCurrentStreamInfo(response.catName, response.songName, response.position);

									this.subscribe(streamName,true);
									break;

								case SUB.UNSUBSCRIBE:
									
									notifier2.addSpeed(this.text.Stream.subscription.end(this.props.lang, streamName));
									delete this.subscribe.registration;
									props.subscribeToStream(false);
									this.updateCurrentStreamInfo();
									break;

								case SUB.NOTHING:

									notifier2.addSpeed(this.text.Stream.subscription.nothing(this.props.lang, streamName));
									props.subscribeToStream(false);
									break;
								default:

									notifier2.addSpeed(this.text.Stream.subscription.error(this.props.lang, streamName));
									console.log("fetcher Odd response",response);
									props.subscribeToStream(false);
									this.updateCurrentStreamInfo();
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

	render(){
		let hide = (this.props.view)? '':'whoosh';
		let props = this.props;
		let {banner} = props.image;

		return (
			<div className="streamList il c3">
				<div>
					{ (props.online)? <a className="streamListLink" onClick={(event)=> {event.preventDefault(); event.stopPropagation(); this.props.changeStreamListView(!this.props.view)}} href="#"><img src={`img/${banner}`} /><span className="counter">{this.state.list.length}</span></a> : ""}
				</div>
				{ (props.online && !hide)?
					<List 
						src={props.image} 
						list={this.state.list}
						action={(streamName)=> { if(streamName != this.subscribe.registration){ abortSubscription(fetcher); this.subscribe(streamName); props.subscribeToStream(true)}}} 
						abs={{style:"abs abBottom shadowL list listStream "}} 
					/>: ""
				}
			</div>
			)
	}
}
StreamList.contextType = Texts;

const SongContent = (props)=>{
	return (
		<div className="body">
			<Content {...F.content(props)} />
			<NavHelper {...F.navHelper(props)} />
		</div>
		)
}

class Content extends React.PureComponent{
	constructor(props){
		super(props);
	}
	
	componentDidUpdate(prevProps){
		invoqueAfterMount('content');
	}

	render(){
		let props = this.props
		let favImg = props.images.favorite;
		let lang = props.lang;
		let Verses = props.song.Verses;

		return (

			<Texts.Consumer>
				{
					value=>{
						return (
							<div id="content">
								<h3>{props.song.name}<a className="imFavorite" onClick={(props.song && props.song.name)? (event)=> {event.preventDefault(); event.stopPropagation(); (!props.favorite)? (()=> { props.addToFavorite(props.currentCat.name,props.song.name,props.song.Verses,props.song.location); notifier2.addSpeed(value.Favorite.added(lang,props.song.name));})() : (()=> {props.removeFromFavorite(props.currentCat.name,props.song.name); notifier2.addSpeed( value.Favorite.deleted(lang,props.song.name));})(); }: (e)=> e.preventDefault()} href="#"><img src={(props.favorite)? `img/${favImg.unlove}`:`img/${favImg.love}`} /></a></h3>
								<p>{Verses[props.Index].Text}</p>
								<ArrowNav {...F.arrowNav(props)} />
							</div>
						)
					}
				}

			</Texts.Consumer>
			)
	}
}


class ArrowNav extends React.PureComponent{
	constructor(props){
		super(props);
	}

	componentDidUpdate(){
		let c = 15;
		let m = 25;
	}

	render(){
		let { total, current, changeIndex, catName, songName,images } = this.props;
		let Prev = "";
		let Next = "";

		if(current != 0)
			Prev = <a className='prevSong' onClick={(event)=>{event.preventDefault(); event.stopPropagation(); indexChanger(Math.max(0,current-1),catName,songName, changeIndex,S); }} href="#"><img src={`img/${images.prev}`} /></a>
		if(current < total && songName)
			Next = <a className='nextSong' onClick={(event)=>{event.preventDefault(); event.stopPropagation(); indexChanger(Math.min(total,current+1),catName,songName, changeIndex,S) }} href="#"><img src={`img/${images.next}`} /></a>

		return (
			<div className="lr il">
				{Prev}
				{Next}
			</div>
		)
	}
}

const NavHelper = ({Verses,current, changeIndex, catName, songName})=>{
	return (
		<div id="navHelper" className="abs">
			{[...Array(Verses)].map((verse,i)=>
				<div key={i} className={(i == current)? 'highlight':''}>
					<a className={`navNumber ${(i == current)? 'selected':''}`} onClick={(event)=>{event.preventDefault(); event.stopPropagation(); indexChanger(i,catName,songName, changeIndex,S); }} href="#">{i+1}</a>
				</div>
			)}
		</div>
		)
}

class Settings extends React.PureComponent{

	constructor(props){
		super(props);
		this.state = {
			NightMode:false,
			language:this.props.lang,
			showLangSub:false,
			controls: this.props.controls
		}
		this.p = this.props;
		this.changeMode = this.changeMode.bind(this);
		this.changeLanguage = this.changeLanguage.bind(this);
		this.toggleLangSub = this.toggleLangSub.bind(this);
	}

	componentDidUpdate(){
		invoqueAfterMount('settings');
	}

	changeMode(mode){
		this.setState({...this.state,NightMode:mode});
		this.p.changeMode(mode);
	}
	changeLanguage(lang){
		this.setState({...this.state,language:lang});
		this.p.changeLanguage(lang);
	}
	toggleLangSub(view){
		this.setState({...this.state,showLangSub:view});
	}

	render(){
		let state = this.state;
		let p = this.props;
		return (
			<div id="settings" style={{position:'fixed',bottom:'0%',border:'1px solid black',borderRadius:'10px 10px 0px 0px',width:"auto",height:"auto"}}>
				<DayMode  night={state.NightMode} changeMode={this.changeMode}/>
				<Language change={this.changeLanguage} toggle={this.toggleLangSub} current={state.language} Sub={state.showLangSub} />
				<Control {...F.control(p)} />
			</div>
			)
	}
}

const DayMode = ({night,changeMode})=>
	<div className="dayMode">
		<p id="night">Night Mode <a className="modeShift" href="#" onClick={(event)=>{ event.preventDefault(); event.stopPropagation(); changeMode(!night)}}>{(night)? "On":"Off"}</a></p>
	</div>

const Language = ({current,Sub,toggle,change})=>{
	let hide = (!Sub)? "whoosh":'';
	return (
		<div>
			<div className="language">
				<p id="language"><a className="langShift" onClick={(event)=>{ event.preventDefault(); event.stopPropagation(); toggle(!Sub)}}>Language: <span>{current}</span></a></p>
			</div>
			{(hide)? '': <List abs={{style:`languageList`}} action={(item)=>{ change(item.name || item) }} list={["en","fr"]}/>}
		</div>
		)
}

const Control = ({controls,setControl})=>
	<div className="control">
		<p id="control">Controls <a className='controlShift' onClick={(event)=> { event.preventDefault(); event.stopPropagation(); setControl(!controls)}} href="#">{(controls)? 'On':'Off'}</a></p>
	</div>

const CCatList = connect((state,ownProps)=>{
	return {
		...store1(state),
		...ownProps
	}
},{...Action1(Action)})(First)
const CSongList = connect((state)=>{
	return {
		...store2(state)
	}
},{ ...Action2(Action)})(Second);

export class Guider extends React.Component{
	constructor(props){
		super(props);
		this.state = { step: this.props.step, section: this.props.step.section, action: this.props.step.section.action, style:{} };
		this.toStep = this.toStep.bind(this);
		this.toSection = this.toSection.bind(this);
		this.animate = this.animate.bind(this);
	}

	componentDidMount(){
		/*window.m = this.refs.main;
		window.c = document.querySelector('.addCat');
		window.mg = getComputedStyle(window.m);
		window.cg = getComputedStyle(window.c);*/
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
				this.setState({...state});
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

	render(){
		let { show, end } = this.props;
		let stepStyle = this.state.style;
		let { step, section, action } = this.state;
		window.section = section;
		window.action = action;
		let title =  section.getTitle() || step.getTitle();
		let process = (action)? action.doProcess(): null;
		let clear = (action && action.getClearer())? action.getClearer(): ()=> { return Promise.resolve(true)};

		return (
			<div className="main" id="main" style={{textAlign:"center",zIndex:10000000000000,backgroundColor:"white",fontSize:"1.em",position:"absolute", ...stepStyle}} ref="main">
				<div>
					<div style={{display:"inline-block" , border:"1px solid black", minWidth:"30px"}}>{(section.prevSection)? <a onClick={()=> { clear().then(()=> this.toSection(section.prevSection) ).catch((e)=> console.error("Couldnt't clear to go to prev section"));}} href="#">{section.prevSection.getTitle() || step.getTitle()}</a>: ""}</div>
					<div style={{display:"inline-block" , border:"1px solid black", minWidth:"30px"}}><h2>{title || "WELCOME TO OUR"}</h2></div>
					<div style={{display:"inline-block" , border:"1px solid black", minWidth:"30px"}}>{(section.nextSection)? <a onClick={()=> { clear().then(()=> this.toSection(section.nextSection)).catch((e)=> console.error("Couldnt't clear to go to next section"));}}>{section.nextSection.getTitle()}</a>: ""}</div>
				</div>
				<div>
					<div>
						<div>{(!action || action.getTitle() === null)? section.getText().map((text,i)=>
							<p id={i}>{text}</p>
							): action.getTitle()}</div>
						{
							(action)? <div><nav style={{width:"auto"}}>
										<ul>
										{action.getText().map((text,i)=>
											<li style={{width:"auto"}} key={i}>{text}</li>
										)}
										{(process)? this.toAction(process()): ""}
										</ul>
									</nav><div className='additional'></div></div>: ''
						}
					</div>
					<div>
						<div style={{display:"inline-block" , border:"1px solid black", minWidth:"30px"}}>{(step.prevStep)? <a onClick={()=> { clear().then(()=> this.toStep(step.prevStep)).catch((e)=> console.error("Couldnt clear to go to prev Step")); }} href="#">{step.prevStep.getTitle()}</a>: ""}</div>
						<div style={{display:"inline-block" , border:"1px solid black", minWidth:"30px"}}>{step.getTitle()}</div>
						<div style={{display:"inline-block" , border:"1px solid black", minWidth:"30px"}}>{(step.nextStep)? <a onClick={()=> { clear().then(()=> this.toStep(step.nextStep)).catch((e)=> console.error("Couldnt clear to go to next Step")); }} href="#">{step.nextStep.getTitle()}</a>: ""}</div>
					</div>
				</div>
				<div>
				<a onClick={()=> { clear().then(end)}} href="#">FERMER</a>
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
					return ( <script key={i} {...l2}>{(data)? data:''}</script> )
				})
			}
		</>
		)
}

export const HTML = ({styles,metas,links, scripts,title,store,nodeJs, store1,store2})=>{
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
						<First {...store1(store)}/>
						<Second {...store2(store)} />
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
	}

	endGuide(){
		this.setState({showGuide:false});
		window.removeEventListener('keydown',this.keyRecorder);
		localStorage.guider = true;
	}

	componentDidMount(){
		window.addEventListener('keydown',this.keyRecorder);
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
		return (
			<>
				{<CCatList streamManager={this.props.streamManager} fastAccess={this.props.fastAccess} />}
				{<CSongList />}
				{(showGuide)? <Guider end={this.endGuide} step={this.props.step} />: ''}
			</>
			)
	}
}

