function storageHandler(CONSTANT){
	if(!localStorage){
		return {
			getItem : function(){
				return {};
			},
			setItem : function(){
				return true;
			},
			inStore: function(){
				return {}
			}
		}
	}
	else{
		return {
			getItem: function(name,fn){
				let item =  localStorage.getItem(name);

				if(fn){
					try{
						item = fn(item);
						return item;
					}
					catch(e){
						console.error(e);
						return null;
					}
				}
			},
			getItems:function(fn){
				if(arguments.length < 2)
					return null;

				let lists = {},
				name = "",
				index = 1,
				data = "";

				while(name = arguments[index++]){
					data = localStorage.getItem(name);

					if(data){
						try{
							data = fn(data);
							lists[name] = data;
						}
						catch(e){
							console.error("Error while applying function",fn.name," to data ",data);
						}
					}
				}

				return lists;
			},
			setItem: function(name,value){
				return localStorage.setItem(name,value);
			},
			inStore: function(name,value){
				let item = localStorage.getItem(name);

				if(item){
					if(fn)
						return fn(item);
					return item;
				}

				localStorage.setItem(name,JSON.stringify(value));

				return value;
			}
		}

	}
}

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

function safeOp(data,op,defaults){
	try{
		var result = (((typeof window.console.log) == typeof op) && op(data)) ||  (data[op] && data[op]());
		return result;
	}
	catch(e){
		return defaults
	}
}

function adjustHeight(wrapper,box){
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

function curry(f){
	var length = f.length;
	let kids = function(received=[]){
		var mineReceived = [...received];
		if(mineReceived.length >= length){
			var r = f.apply(this,mineReceived);
			return r;
		}
		else{
			return function(){
				var received = [...mineReceived];
				for(var name in arguments){
					if(arguments.hasOwnProperty(name))
						received.push(arguments[name]);
				}
				return kids([...received]);
			}.bind(this);
		}
	}.bind(this);
	
	return function(){ 
		var received = [];
		for(var name in arguments){
			if(arguments.hasOwnProperty(name))
				received.push(arguments[name]);
		}

		return kids(received);
	}.bind(this);
}

function sameCompose(){
	var args = arguments;
	return function(){
		var r = [];
		for(var name in arguments){
			if(arguments.hasOwnProperty(name))
				r.push(arguments[name]);
		}
		Object.keys(args).sort((x,y)=> y-x).forEach((k)=>
			args[k].apply(this,r) );		
	}
}

function compose(){
  let args = arguments;

  return function(){
    let i = args.length-1;
    let r = args[i].apply(this,arguments);
    while(i--){

    	if(r && !r.pop && (r.chatAt || parseInt(r))){
    		r = [r];
    	}
    	r = args[i].apply(this,r);
    }

    return r;
  }.bind(this);
}

function relay(f){
  return function(){
    f.apply(this,arguments);
    let r = [];
    for(var n in arguments){
    	if(arguments.hasOwnProperty(n))
      		r.push(arguments[n]);
    }

    return r;
  }
}

function getAllReturn(){
  let args = arguments;
  return function(){
    let i= args.length;
    let r = [];
    while(i--){
      let data = args[i].apply(this,arguments);
      if(!data)
        continue;
      if(data.pop){
        r = r.concat(data);
      }
      else
        r.push(data);
    }
    return r;
  }.bind(this);
}

const P = function(){
	this.subscribers = {};
	this.notify = (topic,data)=>{
		if(!this.subscribers[topic])
			return;

		let topicSubscriber = this.subscribers[topic];
		let sub;
		while( sub = topicSubscriber.pop())
			sub(data);
	}

	this.subscribe = (topic,fn)=>{
		if(!fn || !(fn instanceof Function))
			return false;

		if(this.subscribers[topic]){
			this.subscribers[topic].push(fn);
		}
		else
			this.subscribers[topic] = [fn];
	}
	this.clearTopic = ()=>{
		for (let i = 0; i < arguments.length; i++) {
			let topic = arguments[i];

			if(this.subscribers[topic]){
				delete this.subscribers[topic];
			}
		}

		return true;
	}
}

function registerWorker(src){
	let N = new P();
	let serviceWorker = navigator.serviceWorker
	if(serviceWorker){
		return serviceWorker.register(src).then((registration)=>{
			if(registration){
				let { installing, active } = registration;

				if(installing){
					installing.onstatechange = ()=>{

						switch(installing.state){

							case 'installing':

								N.notify('serviceWorker:installing',{
									type: SUB.REGISTRATION_INSTALLING
								})
								break;



							case 'installed':

								N.notify('serviceWorker:done',{
									type: SUB.REGISTRATION_DONE
								})
								break;
						}
					}
				}

				if(active){
					active.onstatechange = ()=>{
						if(active.state == 'activated')
							N.notify('serviceWorker:active',{
								type: SUB.REGISTRATION_ACTIVE
							})
					}

				}

				return N;
			}
		})
	}
	else{
		return false;
	}
}



function getLocalData(dbLoader,store,{addSong,addCategorie,addSongs}){
	return dbLoader.then((db)=>{
		return  db.getAllCategories()().then((categories)=>{
			let catLength = categories.length -1,
			onlineCat = store.getState().Categories,
			fastLookUp = {},
			index,
			iterationMax = 5;

			if(!categories.length){
				return {data: store.getState(), fastLookUp, db };
			}
			else{
				return new Promise((resolve)=>{
					
					categories.forEach((cat,id)=>{
						try{
							let catName = cat.name,
							catId = cat.id;

							store.dispatch(addCategorie(catName,catId));
							fastLookUp[catName] = {};

							db.getAllSongs(catId)().then((songs)=>{
								songs = songs.map((song)=>{
									delete song.cat;
									fastLookUp[cat.name][song.name] = true;
									while(is.String(song.verses) && iterationMax--){
										song.verses = JSON.parse(song.verses);
									}
									return song;
								});

								store.dispatch(addSongs(songs,catId,'offline'))

								if(id == catLength)
									resolve({data:store.getState(),fastLookUp, db});

							}).catch((e)=> { console.error("getLocalData getAllSong cath error",e); alert("getLocalData:getAllSong Error"+e.message);});

						}
						catch(e){
							console.error("getLocalData catch error",e);
						}
							
							
					})
				})
			}
		})
	})
}
function getRemoteData(store,songLoader,localData){
	let state = store.getState();
	let onlineCategories = state.Categories;
	let fastAccess;

	onlineCategories.forEach((cat,i)=>{
		fastAccess = songLoader(cat, state.onlineSongs[cat.id].length ,store,localData);
	})

	return fastAccess || Promise.resolve({success:true,data:store.getState()});
}

function getStoreData(appState){
	if(window.storeData){
		window.storeData.Text = Text;
		return window.storeData;
	}
	return appState;
}

function bogusTT(){
	this.getAllCategories = this.getAllSongs = ()=> ()=> Promise.resolve([]);
	this.getSong = this.getCategorie = ()=> ()=> Promise.resolve([]);
	this.insertSong = this.insertCategorie = ()=> ()=> Promise.resolve(false);
	this.isBogus = true;
}

function toPercentage(coor,total){
	const newCoord = {};
	for(var c in coor){
		if(coor.hasOwnProperty(c)){
			if(!coor[c].charCodeAt)
				coor[c] = String(coor[c]);
			if(coor[c].indexOf('%') == -1){
				newCoord[c] = parseInt(((parseFloat(coor[c])/ total) * 100).toPrecision(2));
			}
			else
				newCoord[c] = parseInt(coor[c].slice(0,coor[c].indexOf('%')));
		}
	}
	return newCoord;
}


exports.dbChooser = (options)=>{
	if(window.openDatabase){
		return new Promise((resolve,reject)=>{
			require.ensure(['./openDb.cjs'],function(require){
				let openDb = require('./openDb.cjs'),
				TT = new openDb(options);
				resolve(TT);
			},function(e){ 
				console.error("Error while loading the openDb file",e);
				resolve(new bogusTT());
			},'openDb')
		})
	}
	if(window.indexedDB){
		return new Promise((resolve,reject)=>{
			require.ensure(['./indexDb.cjs'],function(require){
				let indexDb = require('./indexDb.cjs'),
				TTT = new indexDb(options);
				resolve(TTT);
			}, function(e){ 
				console.error("Error while loading the indexDb file",e);
				resolve(new bogusTT());
			},'indexDb')
		})
	}
	
	return Promise.resolve(new bogusTT()) 

}
exports.streamer = function(fetcher,store,table){
	let fastAccess,
	name = "",
	lastSongName = "",
	{ cat,song,stream } = table,
	cF = cat.fields,
	sF = song.fields,
	stF = stream.fields;

	this.updateFastAccess = (newFast)=>{
		fastAccess = newFast;
	}
	this.setName = (n,f=()=> {})=>{
		name = n;
		f();
	}
	this.setUpdateStream = (f)=>{
		this.updateStream = f;
	}
	this.getName = ()=>{
		return name;
	}
	this.addFastAccess = (f)=>{
		fastAccess = f;
	}
	this.updateLocalStorage = ()=>{
		setTimeout(()=>{
			setLocalStorage("stream",JSON.stringify({name, time:Date.now()}));
		},15)
	}
	this.updateStream = (catName,songName,position,verses)=>{
		let additionalQuery = `&p=${position}`,
		payload = {};
		if(name){
			this.updateLocalStorage();
			payload[stF.name] = name;	

			if(lastSongName == songName){
				verses = "";
				payload[stF.index] = position;
			}
			else{
				lastSongName = songName;
				additionalQuery+=`&c=${catName}&s=${songName}`;
				payload[stF.song] = {
					[stF.songName]: songName,
					[stF.verses]: verses,
					[stF.index]: position
				}
				payload[stF.catName] = catName;
			}		

			let url =  `stream?action=update`;
			fetcher({
						url, 
						method:'POST',
						data:JSON.stringify(payload),
						setter:(xml)=>{
							xml.setRequestHeader('content-type','application/json');
						},
						e:({status,response})=>{
								console.error("Error trying to update the stream with url",url, status, response);
						},
						s:(response)=>{
							let waitingDownload = response.waitingDownload,
							catId = null;
							if(waitingDownload){
								let state = store.getState(),
								{ Categories, onlineSongs, offlineSongs } = state,
								r = {};
								
								for(let catName in waitingDownload){
									if((catId = Categories.indexOf(catName.toLowerCase())) == -1){
										r[catName] = {delete:true};
										continue;
									}
									if(waitingDownload.hasOwnProperty(catName)){
										r[catName] = {};
											
										let toUploadSongs = waitingDownload[catName].songs;
										if(toUploadSongs.length){
											let songName;
											while(songName = toUploadSongs.pop()){
												let location = null;

												if(fastAccess[catName] && is.Number(fastAccess[catName]['online'][songName]))
													location = 'online';
												if(fastAccess[catName] && is.Number(fastAccess[catName]['offline'][songName]))
													location = 'offline';
												
												if(!location){
													r[catName][songName] = {deleted:true};
												}
												else{
													let songs = state[`${location}Songs`][catId],
													songIndex = fastAccess[catName][location][songName];
													r[catName][songName] = songs[songIndex].verses;
												}
											}
										}
										else
											r[catName].deleted = true;
									}
								}

								let url = `stream/uploadToSubscriber?n=${name}`;
								fetcher({
									url,
									setter:(xml)=>{
										xml.setRequestHeader('content-type','application/json');
									},
									method:'POST',
									data:JSON.stringify(r),
									s:(response)=>{

									},
									e:(error)=>{
										console.error("updateStream waitingDownload response error",error);
									}
								})
							}

							let action = response.action;
							if(action){
								switch(action){
									case SUB.UPLOADVERSES:
										let url = `stream/uploadToSubscriber?n=${name}`;
										if(!catName)
											debugger;
										let r = {};
										r[catName] = {};
										r[catName][songName] = verses;
										fetcher({
											url,
											setter:(xml)=>{
												xml.setRequestHeader('content-type','application/json');
											},
											method:'POST',
											data:JSON.stringify(r),
											s:(response)=>{

											},
											e:(error)=>{
												console.error("updateStream SUB.UPLOADVERSES response error",error);
											}
										})
								}
							}
						}
					})
		}
	}
}

function PSeq(){
	this.sequence = [];
	this.add = (p)=>{
		switch(typeof p){
			case "string":
				throw Error("Wrong type. Must be a function");
				break;
			case "function":
			case "object":
				if(!p.forEach)
					p = [p];
				var id = null;
				if(!this.sequence.length){
					id = this.sequence.push(p[0]) -1;
					p[0]().then(sameCompose(this.executeNext, (d)=> { this.sequence[0].clients.forEach((client)=> client[0](d))})).catch((e)=>{
						this.sequence[0].clients.forEach((client)=>{
							client[1](e);
						})
						this.executeNext();
					});
					this.sequence[id].clients = [];
					p = p.slice(1);
				}
				p.forEach((pp)=>{
					id = this.sequence.push(pp) -1;
					this.sequence[id].clients = [];
				})
				return id;
				break;
		}
	}
	this.executeNext = ()=>{
		this.sequence.shift();
		if(this.sequence.length){
			this.sequence[0]().then(sameCompose(this.executeNext,(d)=>{
				this.sequence[0].clients.forEach((client)=>{
					client[0](d);
				})
			})).catch((e)=>{
				this.sequence[0].clients.forEach((client)=>{
					client[1](e);
				})
				this.executeNext();
			});
		}
	}
	this.subscribe = (id,f,e)=>{
		var s = this.sequence[id];
		if(s){
			if(s.clients)
				return s.clients.push([f,e]);
			s.clients = [[f,e]];
			return 0;
		}
	}
}

function parseHeader(data){
  let start = 0,
  next,
  headers = {},
  i = 0;

  while((next = data.indexOf(':',start)) != -1){
    let name = data.slice(start,next),
    value;
    start = next+1;
    next = data.indexOf('\n',start);
    value = data.slice(start,next);
    start = next+1;

    headers[name.toLowerCase()] = value;
  }

  return headers;
}

function parseResponse(xml){
	let body = xml.response || xml.responseText,
	status = xml.status,
	headers = parseHeader(xml.getAllResponseHeaders());

	if(headers['content-type'] && headers['content-type'].indexOf('application/json') != -1){
		body = JSON.parse(body);
	}
	if(!status){
		xml.networkDown = true;
	}
	if(status >= 200 && status < 300){
		xml.ok = true;
	}
	if(status >= 300 && status < 400){
		xml.redirected = true;
	}
	if(status >= 400 && status < 500){
		xml.problems = true;
	}
	if(status >= 500){
		xml.serverError = true;
	}

	return {body, headers, status, xml};
}

exports.fetcher = function fetcher(a){
	var xml = new XMLHttpRequest();
	xml.open(a.method || 'GET',a.url,true);
	if(a.setter){
		a.setter(xml);
	}
	if(a.type){
		xml.setRequestHeader('content-type',a.type);
	}
	xml.onload = ()=>{
		try{
			a.s(parseResponse(xml));
		}
		catch(error){
			a.e({error,xml});
		}
	}
	xml.onerror = (e)=>{
		try{
			a.e({...parseResponse(xml), error:e})
		}
		catch(e){
			a.e({error:e,xml});
		}
	}
	xml.onabort = (e)=>{
		a.e({
			error:{
				name:'aborted',
				message:'Request aborted'
			},
			aborted:true
		})
	}
	xml.send(a.data);

	return xml;
}

exports.abortSubscription = function(f){
	if(f.subscription){
		f.subscription.abort();
	}
}

const is = {
	Array: function(n){
		return Object.prototype.toString.call(n) == Object.prototype.toString.call([]);
	},
	String: function(n){
		return Object.prototype.toString.call(n) == Object.prototype.toString.call("");
	},
	Number: function(n){
		return Object.prototype.toString.call(n) == Object.prototype.toString.call(2)
	},
	Object: function(n){
		return Object.prototype.toString.call(n) == Object.prototype.toString.call({});
	},
	Function: function(n){
		return Object.prototype.toString.call(n) == Object.prototype.toString.call(function(){})
	},
	Undefined: function(n){
		return Object.prototype.toString.call(n) == Object.prototype.toString.call(undefined);
	}
}


function saveToLocalStorage(name,data){
	if(!is.String(data))
		throw Error("saveToLocalStore expect data to be String");

	localStorage.setItem(name,data);
} 
function loadFromLocalStorage(name){
	if(!is.String(name))
		throw Error("loadFromLocalStorage expect name to be String");

	try{
		let data = JSON.parse(localStorage.getItem(name));
		if(!is.Object(data))
			data = {};
		return data;
	}
	catch(e){
		console.error("loadFromLocalStorage Error",e);
		return {};
	}
}

function setLocalStorage(name,value){
	if(window.localStorage){
		localStorage.setItem(name,value);
		return true;
	}
	return null;
}
function getLocalStorage(name){
	if(window.localStorage){
		return localStorage.getItem(name);
	}
	return null;
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

function tA(d){
	if(!d || !d.length)
		return d;

	let toAdd = {
		forEach:function(x){
			x.forEach = function(f){
				Array.prototype.forEach.call(this,f);
			}
		},
		map:function(x){
			x.map = function(f){
				return Array.prototype.map.call(this,f);
			}
		},
		filter:function(x){
			x.filter = function(f){
				return Array.prototype.filter.call(this,f);
			}
		},
		slice:function(x){
			x.slice = function(f){
				return Array.prototype.slice.call(this,f);
			}
		},
		concat:function(x){
			x.concat = function(f){
				return Array.prototype.concat.call(this,f);
			}
		},
		push:function(x){
			x.push = function(f){
				Array.prototype.push.call(this,f);
			}
		}
	}
	d.pop = ()=>{

	}

	for(var i=1; i < arguments.length; i++){
		let o = arguments[i];
		if(toAdd[o])
			toAdd[o](d);
	}
	return d;
}

function indexChanger(index,catName,songName,f,stream){
	stream.updateStream(catName,songName,index); f(index);
}

function helpWithCoordinate(div1,div2){
	let c1 = div1.getBoundingClientRect();
	let r = { coordi1:{...toPercentage({left:c1.left, width:c1.width},window.innerWidth), ...toPercentage({top:c1.top, height:c1.height},window.innerHeight)}};
	if(div2){
		let c2 = div2.getBoundingClientRect();
		r['coordi2'] = {...toPercentage({left:c2.left, width:c2.width},window.innerWidth),...toPercentage({top:c2.top, height:c2.height},window.innerHeight)}
	}

	return r;

}

function errorLogger(){
	let oldConsole = window.console,
	error = oldConsole.error;

	return function(...p){
		error.apply(oldConsole,arguments);
		let xml = new XMLHttpRequest(),
		url = '/api/reportError';

		xml.open('POST',url,true);
		xml.setRequestHeader('content-type','application/json');
		xml.send(JSON.stringify(p));
	}
}

exports.errorLogger = errorLogger;
exports.indexChanger = indexChanger;
exports.setLocal = setLocalStorage;
exports.getLocal = getLocalStorage;
exports.seq = PSeq;
exports.safeOp = safeOp;
exports.curry = curry;
exports.tA = tA;
exports.adjustHeight = adjustHeight;
exports.helpWithCoordinate = helpWithCoordinate
exports.scrollHandler = scrollHandler;
exports.registerWorker = registerWorker;
exports.getLocalData = getLocalData;
exports.getRemoteData = getRemoteData;
exports.getStoreData = getStoreData;
exports.compose = compose;
exports.relay = relay;
exports.getAllReturn = getAllReturn;
exports.storageHandler = storageHandler;
exports.saveToLocalStorage = saveToLocalStorage;
exports.loadFromLocalStorage = loadFromLocalStorage;
exports.is = is;
exports.invoqueAfterMount = invoqueAfterMount;