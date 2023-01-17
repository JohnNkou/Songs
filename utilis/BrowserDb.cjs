try{
	window.e;
}
catch(e){
	global.window = global;
}


const SUB = {
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
};

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
							console.log("Error while applying function",fn.name," to data ",data);
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
function validator(fields){
  let toValidate = {};
  
  let algo = {
	  isRequired: function(value){
	    console.log("isRequired",value);
	    if(!value || !value.length)
	      return false;
	    return true;
	  },
	  isNumber: function(value){
	    if(!value || !/^\d$/.test(value))
	      return false;
	    return true;
	  },
	  isLessThan: function(value,number){
	    let parsedValue = parseInt(value,10);

	    if(!parsedValue || parsedValue > number)
	      return false;
	    return true;
	  },
	  isMoreThan:function(value,number){
	  	let parsedValue = parseInt(value,10);

	  	if(!parsedValue || parsedValue < number)
	  		return false;
	  	return true;
	  },
	  isNotIn: function(value,list){
	  	if(!Array.isArray(list)){
	  		throw Error("list is not an Array");
	  	}
	  	if(!value){
	  		throw Error("value is undetermined");
	  	}

	  	return list.indexOf(value) == -1;
	  },
	  isAllEmpty: function(list,propName){
	  	let i=0, emptyOne = 0; 

	  	if(!list || (!Array.isArray(list) && (typeof list != typeof {})))
	  		throw Error("Expect list to be Array or Object");

	  	if(Array.isArray(list)){
	  		for(; i < list.length; i++){
	  			if(list[i] == "")
	  				emptyOne++;
	  		}

	  		if(emptyOne == list.length)
	  			return true;
	  	}
	  	else{
	  		for(let prop in list){
	  			i++;
	  			if(list[prop][propName] == "")
	  				emptyOne++;
	  		}

	  		if(emptyOne == i)
	  			return true;
	  	}

	  	return false;
	  },
	  hasBadCharacter: function(name,reg){
	  	if(reg.test(name))
	  		return true;

	  	return false;
	  }
	}

  	this.hasSomething = algo['isRequired'];
  	this.isNumber = algo['isNumber'];
  	this.isLessThan = algo['isLessThan'];
  	this.isMoreThan = algo['isMoreThan'];
  	this.isNotIn = algo['isNotIn'];
  	this.isAllEmpty = algo['isAllEmpty'];
  	this.hasBadCharacter = algo['hasBadCharacter']
}


function  openDb (name,version="1",size=1024*1024*10){
	//alert("Size is "+size);
	var D = openDatabase(name,version,name,size);
	let rowSealed;
	
	try{
		D.query = (sql,datas=[])=>{
			return new Promise((resolve,reject)=>{
				D.transaction((t)=>{
					t.executeSql(sql,datas,(tt,s)=> { 
						var res = [];
						
						//if(s.rows.length){
							
							for(let i=0;;i++){
								let row;
								try{
									
									row = s.rows.item(i);
									
								}
								catch(e){
									
								}
								if(row){
									
									if(row.Verses){
										
										if(rowSealed === false){
											
											res.push(row)
										}
										else if(rowSealed){
											
											res.push({...row})
										}
										else{
											
											let oldId = row.id;
											
											row.id = 100;
											
											if(row.id != 100){
												rowSealed = true;
												res.push({...row});
											}
											else{
												
												row.id = oldId;
												rowSealed = false;
												res.push(row);
											}
										}
									}
									else{	
										
										res.push(row);
									}
								}
								else
									break;
							}
						//}
						var r = {data:res, updated:s.rowsAffected};
						try{
							r['inserted'] = s.insertId;
						}
						catch(e){
							r['inserted'] = false;
						}
						resolve(r);
					}, (tt,e)=> { console.error("D.query error",e); reject(e)});
				},(e)=> {  reject(e)},(s)=> resolve(null,s));
			}) 
		}
	}
	catch(e){
		console.error("openDb Catch error",e);
	}

	return D;
}

function dealWithConstraint(error){
	if(error.name.toLowerCase() == "constrainterror"){
		return { name:error.name, code:6, message:error.message };
	}
	return error;
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

function toL(name){
	return safeOp(name,"toLowerCase",null);
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

function trError(e){
	console.log("Transaction Error Clicke",e);
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

function inEc2(exec){
	return new Promise((resolve,reject)=>{
		exec('ec2metadata --profile',(err)=>{
			if(err)
				return resolve(false);
			return resolve(true);
		})
	})
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

function timeThis(f,notifier = alert){
	var now = Date.now();
	f();
	notifier(`It took ${Date.now() - now} ms to Execute`);
}

function killUnusedStream({fs,filename,subscribers,waiters,up,lineTermination}){
	fs.access(filename,(err)=>{
		if(err){
			
		}
		else{
			fs.readFile(filename,(err,data)=>{
				if(err){
					console.log("killUnusedStream error",err);
				}
				else{
					data = data.toString();
					fs.unlink(filename,(err)=>{
						if(err){
							console.log("Couldn't delete the file",filename);
						}
						console.log("file",filename,"is deleted");
					});
					//try{
						console.log("data is",data.split(lineTermination));

						let streamNames = data.split(lineTermination).map((x)=> x.toLowerCase()), _SUB = SUB, streamName="";

						console.log("streamNames to be deleted",streamNames);
						if(streamNames.length){
							up.lastupdate = new Date().getTime().toString().slice(0,10); 
							while(streamName = streamNames.pop()){
								let subscribeds = subscribers[streamName];

								if(subscribeds){
									for(let subscribed in subscribeds){
										let res = subscribeds[subscribed];
										res.json({action:_SUB.UNSUBSCRIBE, message:`The stream has finished`});
										delete subscribeds[subscribed];
									}
								}
							}

							if(waiters.length){
								console.log("There is",waiters.length,"waiter");
								for(let id in waiters){
									if(id != "length"){
										let socket = waiters[id];
										socket.json({action:_SUB.DELETE, name: streamNames, timestamp:up.lastupdate});
									}
								}
							}
							else{
								console.log("There is no Waiter");
							}
						}
					//}	
					/*catch(e){
						console.log(e);
					}*/

				}
			})
		}
	})
}

function Action(){
	this.nextAction = null;
	this.prevAction = null;
	let anchor = [];
	let process;
	let clearer;
	let Text = [];
	let Title = null;
	let store = {};
	let reset = false;
	this.addAnchor = (a)=>{
		anchor = (a.pop)? [...a]: [a];
	}
	this.addProcess = (f)=>{
		if(!anchor)
			throw Error("To add a process there must be an anchor. Please provide an anchor with addAnchor method");
		process = (f)? ()=> f(anchor): null;
	}
	this.addText = (t)=>{
		if(t === "")
			Text = [];
		else
			Text = (t.pop)? [...t]:[t];
	}
	this.addAction = ()=>{
		let next = this.nextAction;
		let old = null;
		while(next){
			old = next;
			next = next.nextAction;
		}
		if(old){
			old.nextAction = new Action();
			old.nextAction.prevAction = old;
		}
		else{
			this.nextAction = new Action();
			this.nextAction.prevAction = this;
		}
		return this;
	}
	this.reset = (state)=>{
		if(state === true)
			reset = true;
		else{
			if(reset != false)
				reset = false;
		}
	}
	this.getReset = ()=> reset;
	this.addClearer = (f)=>{
		if(!anchor)
			throw Error("There is no anchor for the clearing process. Please provide an anchor with addAnchor method");
		clearer = (f)? ()=> f(anchor): null;
	}
	this.addToStore = (data)=>{
		store = {...store, ...data};
	}
	this.addTitle = (t)=>{
		Title = t;
	}
	this.clearStore = ()=>{
		store = {};
	}
	this.getClearer = ()=>{
		return clearer;
	}

	this.getStore = ()=>{
		return store;
	}
	this.getTitle = ()=>{
		return Title;
	}
	this.getText = ()=> Text;
	this.getAnchor = ()=> anchor;
	this.doProcess =  ()=> process;
}

function section(){
	this.nextSection = null;
	this.prevSection = null;
	this.action = new Action();
	let title;
	let text = [];
	let setter;
	let Anchors = [];

	this.addTitle = (t)=>{
		title = t;
		return true;
	}
	this.addText = (t)=>{
		text = (t.pop)? [...t]: [t];
		return true;
	}
	this.addSection = ()=>{
		let next = this.nextSection;
		let oldSection = null;

		while(next){
			oldSection = next;
			next = next.nextSection;
		}
		if(oldSection){
			oldSection.nextSection = new section();
			oldSection.nextSection.prevSection = oldSection;
		}
		else{
			this.nextSection = new section();
			this.nextSection.prevSection = this;
		}
		return this;
	}
	this.getTitle = ()=>{
		return title;
	}
	this.getText = ()=>{
		return text;
	}
}

function step(){
	this.nextStep = null;
	this.prevStep = null;
	let title;
	this.section = new section();

	this.addTitle = (t)=>{
		title = t;
		return true;
	}
	this.addStep = ()=>{
		let next = this.nextStep;
		let oldStep = null;
		while(next){
			oldStep = next;
			next = next.nextStep;
		}
		if(oldStep){
			oldStep.nextStep = new step();
			oldStep.nextStep.prevStep = oldStep;
		}
		else{
			this.nextStep = new step();
			this.nextStep.prevStep = this;
		}
		return this;
	}
	this.getTitle = ()=>{
		return title;
	}
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
				console.log(`Topic ${topic} deleted`);
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
				if(registration.scope){
					console.log("Registration scope is",registration.scope);
				}

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
		console.log("No service worker dude. Cry");
		return false;
	}
}



function getLocalData(dbC,store,{addSong,addCategorie,addSongs}){
	const db = dbC('Test');

	return  db.getAllCategories()().then((categories)=>{
		let catLength = categories.length -1;
		let lastCatId = 0;
		let onlineCat = store.getState().Categories;
		let Categories = categories.map((c)=> c.name.toLowerCase());
		let fastLookUp = {};
		let index;
		if(!Categories.length){
			return {data: store.getState(), fastLookUp };
		}
		else{
			return new Promise((resolve)=>{
				
				Categories.forEach((catName,id)=>{
					try{
						index = onlineCat.indexOf(catName);
						if(index != -1){
							lastCatId = index;
						}
						else{
							while(onlineCat[lastCatId]){
								lastCatId++;
							}
						}
						
						let catId = lastCatId++;
						store.dispatch(addCategorie(catName,catId));
						fastLookUp[catName] = {};

						db.getAllSongs(catName)().then((songs)=>{
							songs = songs.map((song)=>{
								delete song.cat;
								fastLookUp[catName][song.name] = true;
								do{
									song.Verses = JSON.parse(song.Verses);
								}while(is.String(song.Verses));
								return song;
							});

							store.dispatch(addSongs(songs, catId,'offline'))

							if(id == catLength)
								resolve({data:store.getState(),fastLookUp});

						}).Oups((e)=> { console.log("getLocalData getAllSong cath error",e); alert("getLocalData:getAllSong Error"+e.message);});

					}
					catch(e){
						console.log("getLocalData catch error",e);
					}
						
						
				})
			})
		}
	})
}
function getRemoteData(store,songLoader,localData){
	let state = store.getState();
	let onlineCategories = state.Categories;
	let fastAccess;

	onlineCategories.forEach((catName,i)=>{
		fastAccess = songLoader(catName.toLowerCase(), state.onlineSongs[i].length ,store,localData);
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

function pickSongsWithVerse(songs){
	let selectedSongs;
	let songLength = songs.length;

	for(var i=0,j=0; i < 50 && j < songLength; i += songs[i].Verses.length -1,j++){
		if(songs[i].Verses.length -1)
			selectedSongs.push(songs[i]);
	}
	return selectedSongs;
}

function pullUnique(c1,c2){
	return c1.reduce((x,y)=>{
		let i1 = x.indexOf(y);
		let i2 = x.lastIndexOf(y);

		while(i1 != i2){
			delete x[i2];
			i1 = x.indexOf(y);
			i2 = x.lastIndexOf(y);
		}
		return x;
	},[...c1,...c2]).filter((x)=> x);
}

function TT(Name){
	this.db = openDb(Name,"");
	this.query = this.db.query.bind(this.db);
	this.initialize = ()=>{
		return new Promise((resolve,reject)=>{
			var falsed = false;
			this.query('CREATE TABLE IF NOT EXISTS Categorie(id integer primary key, name varchar(50) not null unique)',[]).then((s)=>{
		console.log("Table Categorie Created with sucess");
			}).Oups((e)=>{
		console.log("Table Categorie not Created",e);
		falsed = true;
			});
		
			this.query("CREATE TABLE IF NOT EXISTS Song(id integer primary key, name varchar(100) not null, Verses Text not null, cat integer not null, unique(name,cat), FOREIGN KEY(cat) REFERENCES Categorie(id))",[]).then((s)=>{
		console.log("Table Song Created with Success");
		if(falsed)
			reject();
		else
			resolve();
			}).Oups((e)=>{
		console.log("Table Song not Created",e);
		if(falsed)
			reject();
			})
		})
	}
	this.initialize();
	this.clear = ()=>{
		return new Promise((resolve,reject)=>{
			this.query('DROP TABLE Categorie',[]).then((s)=>{
				if(s){
					console.log("Categorie Table Droped");
					resolve(true);
				}
				else{
					console.log("Couldn't delete table Categorie",s);
					resolve(false);
				}
			}).Oups((e)=> console.log("clear Error",e));
			this.query('DROP TABLE Song',[]).then((s)=>{
				if(s){
					console.log("Song Table Dropped");
					resolve(true);
				}
				else{
					console.log("Couldn't delete table Song");
					resolve(false);
				}
			}).Oups((e)=> console.log("clear Error",e))
		})
	}
	this.insertCategorie = (name)=>{
		 var txt = 'Wb insertCategorie'
		var p = ()=> new Promise((resolve,reject)=>{
			this.query('INSERT INTO Categorie(name) VALUES(?)',[safeOp(name,"toLowerCase",null)]).then((s)=>{
				if(s.inserted){
					Gp(`${txt} success`,`categorie ${name} inserted Successfully`,s.inserted);
					resolve(s.inserted);

					this.getCategorie[name] = [{id:s.inserted, name}];
					this.getCategorieByKey[s.inserted] = this.getCategorie[name];
				}
				else{
					resolve(false);
				}
			}).Oups((e)=>{
					Gp(`${txt} Error`, `Error while trying to inset categorie ${name}`,e);
					reject(e);
			});
		});
		return p;
	}
	this.updateCategorie = (name,newName)=>{
		var txt = "Wb updateCategorie ";
		var p = ()=>  new Promise((resolve,reject)=>{
			this.query('UPDATE Categorie SET name=? WHERE name=?',[safeOp(newName,"toLowerCase",null),safeOp(name,"toLowerCase",null)]).then((s)=>{
				if(s.updated){
					Gp(`${txt} Success`,`categorie ${name} updated to ${newName}`,s.updated);
					resolve(true);

					if(this.getCategorie[name]){
						this.getCategorie[newName] = this.getCategorie[name];
						let id = this.getCategorie[name][0].id;
						this.getCategorie[newName][0].name = newName;
						
						if(this.getCategorieByKey[id])
							this.getCategorieByKey[id][0].name = newName;
					}
				}
				else{
					Gp(`${txt}Error`,`no value found for categorie ${name}`);
					resolve(false)
				}
			}).Oups((e)=>{
				Gp(`${txt} Error`,`Error while trying to update categorie ${name} to ${newName}`);
				reject();
			})
		});

		return p;
	}
	this.removeCategorie = (name)=>{
		var txt = "Wb removeCategorie"
		var p = ()=> new Promise((resolve,reject)=>{

			this.query("DELETE FROM Categorie WHERE name=?",[safeOp(name,"toLowerCase",null)]).then((s)=>{

				if(s.updated){

					Gp(`${txt} Success`,`categorie ${name} removed`,Boolean(s.updated));
					resolve(true);

					if(this.getCategorie[name]){
						let id = this.getCategorie[name][0].id;
						delete this.getCategorie[name];
						delete this.getCategorieByKey[id];
					}
				}
				else{

					Gp(`${txt}Error`,`Categorie ${name} not deleted`);
					resolve(false);
				}
			}).Oups((e)=>{

				Gp(`${txt} Error`,`Categorie ${name} not removed`,e);
				reject(e);
			});
		});
		return p;
	}
	this.getCategorie = (name)=>{
		var txt = 'Wb getCategorie';
		
		var p = ()=> new Promise((resolve,reject)=>{
			
			if(this.getCategorie[name])
				return resolve(this.getCategorie[name].slice());

			this.query("SELECT * from Categorie WHERE name=?",[safeOp(name,"toLowerCase",null)]).then((s)=>{
				
				Gp(`${txt} Success`,`categorie ${name} getted`,s.data);
				resolve(s.data);
				
				if(s.data.length){
					let id = s.data[0].id;
					
					if(!this.getCategorieByKey[id])
						this.getCategorieByKey[id] = this.getCategorie[name] = s.data;
					else
						this.getCategorie[name] = s.data;
				}

			}).Oups((e)=>{
				
				Gp(`${txt} Error`,`Couldn't getCategorie ${name}`,e);
				reject(e);
			})
		});
		return p;
	}
	this.getCategorieByKey = (id)=>{
		var txt = 'Wb getCategorieByKey'
		var p = ()=> new Promise((resolve,reject)=>{
			if(this.getCategorieByKey[id]){
				return resolve(this.getCategorieByKey[id].slice());
			}

			this.query("SELECT * FROM Categorie where id=?",[id]).then((s)=>{
				Gp(`${txt} Success`,`Categorie with id ${id} found`,s.data);
				resolve(s.data);
				
				if(s.data.length){
					let name = s.data[0].name;
					if(this.getCategorie[name])
						this.getCategorieByKey[id] = this.getCategorie[name];
					else{
						this.getCategorie[name] = this.getCategorieByKey[id] = s.data;
					}
				}

			}).Oups((e)=>{
				Gp(`${txt} Error`, `Categorie with id ${id} not found`,e);
				reject(e);
			});
		});

		return p;
	}
	this.getAllCategories = ()=>{
		var txt = 'Wb getAllCategories';
		var p = ()=> new Promise((resolve,reject)=>{
			
			this.query("SELECT * FROM Categorie",[]).then((s)=>{
				
				Gp(`${txt} Success`,s.data);
				
				resolve(s.data);
			}).Oups((e)=>{
				
				Gp(`${txt} Error`,e);
				reject(e);
			})
		});

		return p; 
	}
	this.insertSong = (name,Verses,cat)=>{
		var txt = "Wb insertSong";
		Verses = JSON.stringify(Verses);

		var p = ()=> new Promise((resolve,reject)=>{
			
			if(this.getCategorie[cat])
				cat = this.getCategorie[cat][0].id;

			if(typeof cat == "number"){
					
				this.query("INSERT INTO Song(name,Verses,cat) VALUES(?,?,?)",[safeOp(name,"toUpperCase",null),(Verses)? Verses:null,(cat)? cat: null]).then((s)=>{
					if(s.inserted){
						Gp(`${txt} Success`,`song ${name} inserted`,s.inserted);
						//alert(`${name} inserted`);
						resolve(true);
					}
					else{
						//alert(`${name} Hug`);
						Gp(`${txt} Error`,`Couldn't insert the song ${name}`);
						resolve(false);
					}
					}).Oups((e)=>{
							
						Gp(`${txt} Error`,`Insert song ${name} Error`,e);
						reject(e);
					})
			}
			else{
				this.getCategorie(cat)().then((r)=>{
					r = r.pop();
					if(r){
						
						var cat = r.id;
						if(cat){
							
							var v = this.insertSong(name,Verses,cat)();
							v.then(resolve).Oups(reject);
						}
						else{
							
							Gp(`${txt} Error`,`categorie ${cat} don't exist`);
							resolve(false);
						}
					}
					else{
						
						Gp(`${txt} Error`,`No categorie with that id ${cat} exist`);
						resolve(false);;
					}
				}).Oups(reject);
			}
		});

		return p;
	}
	this.updateSong = (name,cat,newName,Verses)=>{
		var txt = "Wb updateSong";
		name = safeOp(name,"toUpperCase",null);
		newName = safeOp(newName,"toUpperCase",null);
		var sql = "UPDATE Song SET "+((newName)? "name=?"+((Verses)? ", Verses=?":""): "Verses=?")+" WHERE name=? AND cat=?"
		var holder = [(newName)? newName:Verses,(newName && Verses)? Verses:name,((newName && Verses))? name:cat,(newName && Verses)? cat: null].filter((s) => s);
		console.log("Look at this sql",sql,holder);
		//holder = holder.filter((s) => s);
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					this.query(sql,holder).then((s)=>{
						if(s.updated){
							Gp(`${txt} Success`,`song ${name} updated to ${newName}`,s.updated);
							resolve(true);
						}
						else{
							Gp(`${txt} Error`,`updateSong ${name} failed`,s);
							resolve(false);
						}
					}).Oups((e)=>{
						Gp(`${txt} Error`,e);
						reject(e);
					})
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						if(r){
							var id = r.id;
							this.updateSong(name,id,newName,Verses)().then(resolve).Oups(reject);
						}
						else{
							Gp(`${txt} Error`,`no categorie ${cat} found`);
							resolve(false);
						}
					}).Oups(reject);
					break;
				default:
					Gp(`${txt} Error`,`wrong Categorie type ${cat}`);
					reject({type:"Error",message:`Wrong categorie type ${cat}`});

			}
		});
		return p;
	}
	this.deleteSong = (name,cat)=>{
		var txt = "Wb deleteSong"
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					this.query("DELETE FROM Song WHERE name=? AND cat=?",[safeOp(name,"toUpperCase",null),cat]).then((s)=>{
					if(s.updated){
						Gp(`${txt} Success`,`song ${name} deleted`,Boolean(s.updated));
						resolve(true);
					}
					else{
						Gp(`${txt} Error`,`Couldn't ${txt} ${name}`);
						resolve(false);
					}
					}).Oups((e)=>{
						Gp(`${txt} Error`,`${txt} ${name} Error`,e);
						reject(e);
					})
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						if(!Array.isArray(r))
							throw Error("response should be array");
						r = r.pop();
						if(r){
							var id = r.id;
							this.deleteSong(name,id)().then(resolve).Oups(reject);
						}
						else
							resolve();
					}).Oups(reject);
					break;

				default:
					Gp(`${txt} Error`,`Bad Categorie type ${cat}`);
					reject({type:'error',message:`Bad Categorie type ${cat}`});
			}
		});
		return p;
	}
	this.getSong = (name,cat)=>{
		var txt = 'Wb getSong';
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					this.query("SELECT * from Song WHERE name=? AND cat=?",[safeOp(name,"toUpperCase",null),cat]).then((s)=>{
						if(s.data.length){
							s.data = s.data.pop();
							s.data.Verses = JSON.parse(s.data.Verses);
						}
						
						Gp(`${txt} Success`,`${txt} ${name}`,s.data)
						resolve(s.data);
					}).Oups((e)=>{
						Gp(`${txt} Error`,`${txt} ${name}`,e);
						reject(e);
					})
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						r = r.pop();
						if(r){
							var id = r.id;
							this.getSong(name,id)().then(resolve).Oups(reject);
						}
						else{
							resolve(false);
						}
					}).Oups(reject);
					break;

				default:
					Gp(`${txt} Error`,`Bad categorie type ${cat}`);
					reject({type:"Error", message:`Wrong type of categorie ${cat}`});
			}

		});
		return p;
	}
	this.getAllSongs = (cat)=>{
		var txt = 'Wb getAllSongs';
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					this.query("SELECT * FROM Song WHERE cat=?",[cat]).then((s)=>{
						Gp(`${txt} Success`,`${txt} ${cat}`,s.data);
						resolve(s.data);
					}).Oups((e)=>{
						Gp(`${txt} Error`,`${txt} ${cat}`,e);
						reject(e);
					})
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						r = r.pop();
						if(r){
							var id = r.id;

							this.getAllSongs(id)().then(resolve).Oups(reject);
						}
						else{
							resolve(false);
						}
					}).Oups(reject);
					break;
				}
		});
		return p;
	}
	this.countSong = (cat)=>{
		var txt = 'Wb countSong';
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					this.query("SELECT count(*) as TOTAL FROM Song WHERE cat=?",[cat]).then((s)=>{
						Gp(`${txt} Success`,`${txt} ${cat}`,s.data.TOTAL);
						resolve(s.data.TOTAL);
					}).Oups((e)=>{
						Gp(`${txt} Error`,`${txt} ${cat}`,e);
						reject(e);
					})
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						r = r.pop();
						if(r){
							var id = r.id;
							this.countSong(id)().then(resolve).Oups(reject);
						}
						else{
							resolve(false);
						}
					}).Oups(reject);
					break;
				default:
					Gp(`${txt} Error`,`Bad Categorie type ${cat}`);
					reject({type:'error',message:`Bad Categorie type ${cat}`})
			}
		});
		return p;
	}
}
function TTT(){
	this.initialize = ()=>{
		return new Promise((resolve,reject)=>{
			if(this.version){
				this.version++;
			}
			else
				this.version = 1;
			var request = indexedDB.open('Test',this.version);
			request.onupgradeneeded = ()=>{
				var db = request.result;
				console.log("Hey, I'm called");
				var store1 = db.createObjectStore('Categorie',{ autoIncrement: true});
				var store2 = db.createObjectStore('Song',{ autoIncrement:true});

				var req1 = store1.createIndex("by_name","name",{ unique:true});
				var req2 = store2.createIndex("by_song_cat", ["name","cat"], { unique:true});
				var req3 = store2.createIndex("by_cat","cat");

				var sequences = new PSeq();

				var i1 = ()=>{
					return new Promise((resolve,reject)=>{
						req1.onsuccess = ()=> resolve(true);
						req1.onerror = ()=> reject(req1.error)
					});
				}
				var i2 = ()=>{
					return new Promise((resolve,reject)=>{
						req2.onsuccess = ()=> resolve(true);
						req2.onerror = ()=> reject(req2.error);
					})
				}
				var i3 = ()=>{
					return new Promise((resolve,reject)=>{
						req3.onsuccess = ()=> resolve(true);
						req3.onerror = ()=> reject(req3.error);
					})
				}

				sequences.subscribe(sequences.add(i1),()=>{
					console.log('Index1 created with success');
				},(e)=>{
					console.log('Error while creating Index1',e);
					reject(e);
				})
				sequences.subscribe(sequences.add(i2),()=>{
					console.log("Index2 created with success");
				},(e)=>{
					console.log("Error while creating Index2",e);
					reject(e);
				})
				sequences.subscribe(sequences.add(i3),()=>{
					console.log("Index3 created with success");
					resolve(true);
				},(e)=> {
					console.log("Error while creating Index3");
					reject(e);
				});

			};
			request.onblocked = ()=>{
				console.log("Hey, someone is blocking be");
			}
			request.onerror = ()=> reject(request.error);
		})
	}
	this.initialize().Oups((e)=>{
		console.error("Initializing indexedDB Error",e);
	});
	this.clear = ()=>{
		return new Promise((resolve,reject)=>{
			var request = indexedDB.open('Test',this.version+1);
			console.log("The database version is",this.version);
			request.onupgradeneeded = ()=>{
				console.log("Choops");
				var db = request.result;
				try{
					Array.prototype.forEach.call(db.objectStoreNames,(o)=>{
						db.deleteObjectStore(o);
					});
					resolve(true);
				}
				catch(e){
					console.log("Clear Error",e);
					reject(e);
				}
			}
			request.onerror = ()=>{
				console.log("Clear Error",request,error);
				reject(request.error);
			}
		})
	}
	this.txR = (f,e)=>{
		var request = indexedDB.open('Test');
		request.onsuccess = ()=>{
			var db = request.result;
			db.onversionchange = ()=>{
				console.log("Some is trying to change version");
				db.close();
			}
			if(!this.version)
				this.version = db.version;

			if(!db.objectStoreNames.length){
				this.initialize().then(()=>this.txR(f,e)).Oups((er)=> e(er) );
			}
			else{
				var tx = db.transaction(db.objectStoreNames,'readonly');
				f(tx);
			}
		}
		
		request.onerror = ()=>{
			e(request.error);
		}
	}
	this.txW = (f,e)=>{
		var request = indexedDB.open('Test');
		request.onsuccess = ()=>{
			var db = request.result;
			db.onversionchange = ()=>{
				console.log("Someone is trying to change version");
				db.close();
			}
			if(!this.version)
				this.version = db.version;

			if(!db.objectStoreNames.length){
				this.initialize().then(()=>this.txW(f,e)).Oups((er)=> e(er));
			}
			else{
				var tx = db.transaction(db.objectStoreNames,'readwrite');
				f(tx);
			}
		}
		request.onerror = ()=>{
			e(request.error)
		}
	}

	this.insertCategorie = (name)=>{
		var txt = 'insertCategorie';
		var tx = this.txW;
		var p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var store = tx.objectStore("Categorie");
				var request = store.put({name:toL(name)});
				request.onsuccess = (e)=>{
					Gp(`${txt} Success`,`categorie ${name} inserted Successfully`,request.result);
					resolve(request.result);
				}
				request.onerror = (e)=>{
					e.preventDefault();
					Gp(`${txt} Error`,request.error);
					reject(dealWithConstraint(request.error));
				}
			},(e)=>{
				sameCompose(reject,trError);
			})
		})

		return p;
	}
	this.updateCategorie = (name,newName)=>{
		var txt = 'updateCategorie';
		var tx = this.txW;
		var p =  ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var index = tx.objectStore("Categorie").index("by_name");
				var request = index.openCursor(IDBKeyRange.only(toL(name)));
				request.onsuccess = ()=>{
					var cursor = request.result;
					if(cursor){
						var req = cursor.update({name:toL(newName)});
						req.onsuccess = (e)=>{
							Gp(`${txt} Success`,`categorie ${name} updated to ${newName}`,req.result);
							resolve(Boolean(req.result));
						}
						req.onerror = (e)=>{
							Gp(`${txt} Error`,`categorie ${name} not updated to ${newName}`,req.error);
							reject(dealWithConstraint(req.error))
						}
					}
					else{
						Gp(`${txt} Error`,`no value found for categorie ${name}`)
						resolve(false)
					}
				}
				request.onerror = (e)=>{
					e.preventDefault();
					Gp(`${txt} Error`,`couldn't open the cursor to value ${name}`);
					reject(dealWithConstraint(request.error));
				}
			},(e)=>{
				sameCompose(reject,trError);
			})
		});
		return p;
		
	};
	this.removeCategorie = (name)=>{
		var txt = `removeCategorie`;
		var p =  ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var index = tx.objectStore("Categorie").index("by_name");
				var request = index.openCursor(IDBKeyRange.only(toL(name)))
				request.onsuccess = (e)=>{
					var cursor = request.result;
					if(cursor){
						var req = cursor.delete();
						req.onsuccess = (e)=>{
							Gp(`${txt} Success`,`categorie ${name} removed`,!req.result);
							resolve(!req.result);
						}
						req.onerror = (e)=>{
							e.preventDefault();
							Gp(`${txt} Error`,`Categorie ${name} not removed`,req.error);
							reject(dealWithConstraint(req.error));
						}
					}
					else{
						Gp(`${txt} Error`,`No cursor to categorie ${name}`);
						resolve();
					}
				}
				request.onerror = (e)=>{
					e.preventDefault();
					Gp(`${txt} Error`,`Couldn't open a cursor to Categorie ${name}`);
					reject(dealWithConstraint(request.error));
				}
			},(e)=> sameCompose(reject,trError));
		});
		return p;
		
	};
	this.getCategorie = (name)=>{
		var txt = 'getCategorie';
		var tx = this.txR;
		var p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var index = tx.objectStore("Categorie").index("by_name");
				var request = index.openCursor(toL(name));
				request.onsuccess = (e)=>{
					var cursor = request.result;
					if(cursor){
						Gp(`${txt} Success`,`categorie ${name} getted`,{id:cursor.primaryKey,...cursor.value});
						resolve([{id:cursor.primaryKey,...cursor.value}]);
					}
					else{
						Gp(`${txt} Error`,`No cursor to categorie ${name} found`);
						resolve([]);
					}
				}
				request.onerror = (e)=>{
					e.preventDefault();
					Gp(`${txt} Error`,request.error);
					reject(dealWithConstraint(request.error));
				}
			},(e)=>{
				sameCompose(reject,trError);
			});
		});

		return p;
	};

	this.getCategorieByKey = (id)=>{
		var txt = 'getCategorieByKey';
		var tx = this.txR;
		var p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var store = tx.objectStore("Categorie");
				var request = store.openCursor(id);
				request.onsuccess = (s)=>{
					var cursor = request.result;
					if(cursor){
						Gp(`${txt} Success`,`Categorie with id ${id} found`,{id:cursor.key,...cursor.value})
						resolve({id:cursor.key,...cursor.value});
					}
					else{
						Gp(`${txt} Error`,`No cursor found to categorie with id ${id}`)
						resolve(cursor);
					}
				}
				request.onerror = (e)=>{
					e.preventDefault();
					Gp(`${txt} Error`,`Categorie with id ${id} not found`,request.error);
					reject(dealWithConstraint(request.error));
				}
			},(e)=> sameCompose(reject,trError));
		});

		return p;
	}

	this.getAllCategories = ()=>{
		var txt = "getAllCategories";
		var tx = this.txR;
		var p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var index = tx.objectStore("Categorie").index("by_name");
				var request = (index.getAll && index.getAll()) || (index.mozGetAll && index.mozGetAll());
				if(request){
					request.onsuccess = (e)=>{
						Gp(`${txt} Success`,request.result);
						resolve(request.result);
					}
					request.onerror = (e)=>{
						e.preventDefault();
						Gp(`${txt} Error`,request.error);
						reject(dealWithConstraint(request.error));
					}
				}
				else{
					request = index.openCursor();
					let result = [];
					request.onsuccess = (e)=>{
						let cursor = request.result;
						if(!cursor){
							console.log("getAllCategorie result",result);
							resolve(result);
						}
						else{
							result.push(cursor.value);
							cursor.continue();
						}
					}
					request.onerror = (e)=>{
						console.error("getAllCategorie count Error",e);
					}
				}
			},(e)=> sameCompose(reject,trError));
		})

		return p;
	}
	this.insertSong = (name,Verses,cat)=>{
		var txt = 'insertSong';
		var tx = this.txW;
		var p = ()=> new Promise((resolve,reject)=>{
			if(typeof cat == "number"){
				this.getCategorieByKey(cat)().then((r)=>{
					if(r){
						tx((tx)=>{
							var store = tx.objectStore("Song");
							var request = store.put({name,Verses,cat:cat});
							request.onsuccess = (e)=>{
								Gp(`${txt} Success`,`song ${name} inserted`,request.result);
								resolve(Boolean(request.result));
							}
							request.onerror = (e)=>{
								e.preventDefault();
								//window.eee = {e,er:request.error};
								Gp(`${txt} Error`,`Couldn't insert the song ${name}`,request.error);
								reject(dealWithConstraint(request.error));
							}
						},(e)=> sameCompose(reject,trError));
					}
					else{
						reject({message:"Foreign key constrain violated",type:"error"})
					}
				}).Oups(reject);
			}
			else{
				this.getCategorie(cat)().then((r)=>{
					r = r.pop();
					if(r){
						var cat = r.id;
						if(cat){
							var v =  this.insertSong(name,Verses,cat)();
							v.then(resolve).Oups(reject);
						}
						else{
							Gp(`${txt} Error`,`categorie ${cat} don't exist`);
							resolve(false);
						}
					}
					else{
						Gp(`${txt} Error`,`No categorie with that id ${cat} exist`);
						resolve(false);
					}
				}).Oups(reject);
			}
		})
		return p;

	};
	this.updateSong = (name,cat,newName,Verses)=>{
		var txt = "updateSong";
		var tx = this.txW;
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					tx((tx)=>{
						var index = tx.objectStore("Song").index("by_song_cat");
						var request = index.openCursor(IDBKeyRange.only([name,cat]));
						request.onsuccess = (e)=>{
							var cursor = request.result;
							var value = cursor.value;
							if(cursor){
								var req = cursor.update({name:newName || value.name, Verses:Verses || value.Verses,cat});
								req.onsuccess = (e)=>{
									Gp(`${txt} Success`,`song ${name} updated to ${newName}`,req.result);
									resolve(Boolean(req.result));
								}
								req.onerror = (e)=>{
									e.preventDefault();
									Gp(`${txt} Error`,req.error);
									reject(dealWithConstraint(req.error));
								}
							}
							else{
								Gp(`${txt} cursor Error`,`updateSong ${name} no cursor found`)
								reject(false);
							}

						}
						request.onerror = (e)=>{
							e.preventDefault();
							Gp(`${txt} cursor Error`,request.error);
							reject(dealWithConstraint(request.error));
						}
					},(e)=> sameCompose(reject,trError));
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						if(r){
							var id = r.id;
							this.updateSong(name,id,newName,Verses)().then(resolve).Oups(reject);
						}
						else{
							Gp(`${txt} Error`,`no categorie ${cat} found`);
							resolve(false);
						}
					}).Oups(reject);
					break;
				default:
					Gp(`${txt} Error`,`wrong Categorie type ${cat}`)
					reject({type:"Error",message:`Wrong categorie type ${cat}`});

			}
		});

		return p;

	};
	this.deleteSong = (name,cat)=>{
		var txt = 'deleteSong';
		var tx = this.txW;
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					tx((tx)=>{
						var index = tx.objectStore("Song").index("by_song_cat");
						var request = index.openCursor(IDBKeyRange.only([name,cat]));
						request.onsuccess = (e)=>{
							var cursor = request.result;
							if(cursor){
								var req = cursor.delete();
								req.onsuccess = (e)=>{
									Gp(`${txt} success`,`song ${name} deleted`,!req.result);
									resolve(!req.result);
								}
								req.onerror = (e)=>{
									e.preventDefault();
									Gp(`${txt} error`,`Coudn't delete the song ${name}`,req.error);
									reject(dealWithConstraint(req.error));
								}
							}
							else{
								Gp(`${txt} cursor Error`,`${txt} ${name} cursor not found`)
								resolve(false);
							}
						}
						request.onerror = (e)=>{
							e.preventDefault();
							Gp(`${txt} cursor Error`,`${txt} ${name} couldn't open a cursor`)
							reject(dealWithConstraint(request.error));
						}
					},(e)=> sameCompose(reject,trError));
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						if(!Array.isArray(r))
							throw Error("response should be array");
						r = r.pop();
						if(r){
							var id = r.id;
							this.deleteSong(name,id)().then(resolve).Oups(reject);
						}
						else
							reject();
					}).Oups(reject);
					break;
				default:
					Gp(`${txt} Error`,`Bad categorie type`);
					reject({type:'Error',message:'Bad Categorie type'});
			}
		});
		return p;

	};
	this.getSong = (name,cat)=>{
		var txt = 'getSong';
		var tx = this.txR;
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					tx((tx)=>{
						var index = tx.objectStore("Song").index("by_song_cat");
						var request = index.openCursor([name,cat]);
						request.onsuccess = (e)=>{
							/*Gp(`${txt} Success`,`${txt} ${name}`,request.result);
							resolve(request.result);*/
							var cursor = request.result;
							if(cursor){
								Gp(`${txt} Success`,`${txt} ${name}`,{id:cursor.primaryKey,...cursor.result})
								resolve([{id:cursor.primaryKey,...cursor.value}])
							}
							else{
								Gp(`${txt} Success`,`${txt} ${name} ${cursor}`)
								resolve([]);
							}
						}
						request.onerror = (e)=>{
							e.preventDefault();
							Gp(`${txt} Errpr`,`${txt} ${name}`,request.error);
							reject(dealWithConstraint(request.error));
						}
					},(e)=> sameCompose(reject,trError));
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						if(r){
							 var id = r.id;
							 this.getSong(name,id)().then(resolve).Oups(reject);
						}
						else
							resolve();
					}).Oups(reject);
					break;
				default:
					Gp(`${txt} Error`,`Bad Categorie type ${cat}`);
					reject({type:'error',message:`Bad Categorie type ${cat}`});
			}
		});

		return p;
	};
	this.getAllSongs = (cat)=>{
		var txt = 'getAllSongs';
		var tx = this.txR;
		var p = ()=> new Promise((resolve,reject)=>{
			//console.log("Here is the typeof cat",typeof cat);
			switch(typeof cat){
				case "number":
					tx((tx)=>{
						var index = tx.objectStore("Song").index("by_cat");
						var request = (index.getAll && index.getAll(cat)) || (index.mozGetAll && index.mozGetAll(cat));
						if(request){
							request.onsuccess = (e)=>{
								Gp(`${txt} Success`,`${txt} ${cat}`,request.result);
								resolve(request.result);
							}	
							request.onerror = (e)=>{
								e.preventDefault();
								Gp(`${txt} Error`,`${txt} ${cat}`,request.error);
								reject(dealWithConstraint(request.error));
							}
						}
						else{
							request = index.openCursor(cat);
							let result = [];
							request.onsuccess = ()=>{
								let cursor = request.result;

								if(!cursor){
									resolve(result);
								}
								else{
									result.push(cursor.value);
									cursor.continue();
								}
							}
							request.onerror = (e)=>{
								console.log("getAllSong openCursor error",e,request.error);
							}
						}
					},(e)=> sameCompose(reject,trError));
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						r = r.pop();
						if(r){
							var id = r.id;
							this.getAllSongs(id)().then(resolve).Oups(reject);
						}
						else
							resolve();
					}).Oups(reject);
					break;

				default:
					Gp(`${txt} Error`,`Bad Categorie type ${cat}`);
					reject({type:'error',message:`Bad Categorie type ${cat}`})
			}
		});
		return p;
	}
	this.countSong = (cat)=>{
		var txt = 'countSong';
		var tx = this.txR;
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					tx((tx)=>{
						var index = tx.objectStore("Song").index("by_cat");
						var request = index.count(cat);
						request.onsuccess = (e)=>{
							Gp(`${txt} success`,`${txt} ${cat}`,request.result);
							resolve(request.result);
						}	
						request.onerror = (e)=>{
							e.preventDefault();
							Gp(`${txt} Error`,`${txt} ${cat}`,request.error);
							reject(dealWithConstraint(request.error));
						}
					},(e)=> sameCompose(reject,trError));
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						if(r){
							var id = r.id;
							this.countSong(id)().then(resolve).Oups(reject);
						}
						else
							resolve();
					}).Oups(reject);
					break;

				default:
					Gp(`${txt} Error`,`Bad Categorie type ${cat}`);
					reject({type:'error',message:`Bad Categorie type ${cat}`})
			}
		});
		return p;
	}
}
function bogusTT(){
	this.getAllCategories = this.getAllSongs = ()=> ()=> new Promise((resolve)=> resolve([]));
	this.getSong = this.getCategorie = ()=> ()=> new Promise((resolve)=> resolve([1]));
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


exports.dbChooser = (name)=>{
	if(window.openDatabase){
		return  new TT(name);
	}

	if(window.indexedDB){
		return new TTT(name);
	}
	
		return new bogusTT();

}
exports.registerWorker = registerWorker;
exports.getLocalData = getLocalData;
exports.getRemoteData = getRemoteData;
exports.getStoreData = getStoreData;
exports.step = step;
exports.sameCompose = sameCompose;
exports.compose = compose;
exports.relay = relay;
exports.getAllReturn = getAllReturn;
exports.streamer = function(fetcher,store){
	let fastAccess,
	name = "",
	lastSongName = "";
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
	this.updateStream = (catName,songName,position,Verses)=>{
		let additionalQuery = `&p=${position}`;
		if(name){
			this.updateLocalStorage();

			if(lastSongName == songName){
				Verses = "";
			}
			else{
				lastSongName = songName;
				additionalQuery+=`&c=${catName}&s=${songName}`;
			}
			

			let url =  `stream/update?n=${name}${additionalQuery}`;
			console.log("The url is",url);
			fetcher({
						url, 
						method:'POST',
						data:(Verses)? JSON.stringify(Verses):null,
						e:({status,response})=>{
								console.log("Error trying to update the stream with url",url, status, response);
						},
						s:(response)=>{
							console.log("streamUpdated",response);
							let waitingDownload = response.waitingDownload,
							catId = null;
							if(waitingDownload){
								let state = store.getState(),
								{ Categories, onlineSongs, offlineSongs } = state,
								r = {};
								console.log("Oups, some people don't have my song");
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
													r[catName][songName] = songs[songIndex].Verses;
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
										r[catName][songName] = Verses;
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
					p[0]().then(sameCompose(this.executeNext, (d)=> { this.sequence[0].clients.forEach((client)=> client[0](d))})).Oups((e)=>{
						//console.log("Error",e);
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
			})).Oups((e)=>{
				this.sequence[0].clients.forEach((client)=>{
					client[1](e);
				})
				//console.log("Error",e);
				this.executeNext();
			});
		}
		else{
			//console.log("No more sequence");
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

function test(n){
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{
			console.log(n);
			resolve(n);
		},n)
	})
}

exports.fetcher = function fetcher(a){
	var xml = new XMLHttpRequest();
	xml.open(a.method || 'GET',a.url,true);
	if(a.setter){
		a.setter(xml);
	}
	xml.onload = ()=>{
		var response = xml.response;
		if(/application\/json/.test(xml.getResponseHeader('Content-Type'))){
			response = JSON.parse(xml.response || xml.responseText);
		}
		if(xml.status < 300 && xml.status >= 200){
			a.s(response);
		}
		else{
			a.e({status:xml.status,error:response},xml);
		}
	}
	xml.onerror = (e)=>{
		a.e({status:xml.status, error:e},xml);
	}
	xml.send(a.data);
}

exports.abortSubscription = function(f){
	if(f.subscription){
		f.subscription.abort();
	}
}

function Gp(name){
	//console.log(name);
	/*console.groupCollapsed(name);
	for(var name in arguments){
		if(name != 0)
	console.log(arguments[name]);
	}
	console.groupEnd(); */
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

function mergeLocalDataWithServerData(local,data){
	if(local.nightMode)
		data.ui.nightMode = local.nightMode;
	if(local.language)
		data.language = local.language;
	if(local.currentCat){
		data.currentCat = local.currentCat;
	}
	if(local.currentSong)
		data.currentSong = local.currentSong;

	return data
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

exports.indexChanger = function(index,catName,songName,f,stream){
	console.log("indexChanger",index);
	stream.updateStream(catName,songName,index); f(index);
}
exports.setLocal = setLocalStorage;
exports.getLocal = getLocalStorage;

exports.appState = {
	Categories:[],
	onlineSongs:{},
	offlineSongs:{},
	currentCat:{name:""},
	currentSong:{name:"", Verses:[]},
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
			Verses:0
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
	searchResult:[],
	message:"",
	selector:{
		withVerse:false
	},
	songIncrement:100,
	isStreaming:false,
	appReachable:true,
}
 
exports.seq = PSeq;
exports.SUB =  SUB;
exports.safeOp = safeOp;
exports.curry = curry;
exports.sameCompose = sameCompose;
exports.tA = function(d){
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
exports.validator = validator;
exports.adjustHeight = adjustHeight;

exports.helpWithCoordinate = function(div1,div2){
	let c1 = div1.getBoundingClientRect();
	let r = { coordi1:{...toPercentage({left:c1.left, width:c1.width},window.innerWidth), ...toPercentage({top:c1.top, height:c1.height},window.innerHeight)}};
	if(div2){
		let c2 = div2.getBoundingClientRect();
		r['coordi2'] = {...toPercentage({left:c2.left, width:c2.width},window.innerWidth),...toPercentage({top:c2.top, height:c2.height},window.innerHeight)}
	}

	return r;

}

exports.storageHandler = storageHandler;
exports.saveToLocalStorage = saveToLocalStorage;
exports.loadFromLocalStorage = loadFromLocalStorage;
exports.mergeLocalDataWithServerData = mergeLocalDataWithServerData;
exports.is = is;
exports.killUnusedStream = killUnusedStream;
exports.timeThis = timeThis;
exports.inEc2 = inEc2;

exports.documentTree = {
		title: "Song Apps",
		metas:[
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			}
		],
		links:[
			{
				rel: "icon",
				href: "favicon.png",
				sizes: "16x16",
				type:"image/png"
			},
			{
				rel:'stylesheet',
				href:'css/app.css',
				type:'text/css'
			},
			{
				rel:'stylesheet',
				href:'css/font.css',
				type:'text/css'
			}
		],
		scripts:{
			head:
			[
				{
					type:'text/javascript',
					src: 'polyfill/Symbol.js'
				},
				{
					type:'text/javascript',
					src:'js/bluebird_mod.min.js'
				},
				{
					type:'text/javascript',
					data:`
					(
						function(){
							if(!Array.isArray)
								Array.isArray = function(item){
									return Object.prototype.toString.call(item) == Object.prototype.toString.call([]);
								}
						}
					)();
					`
				}
			],
			tail:
			[
				{
					type:'text/javascript',
					src: '/store'
				},
				{
					src:'dist/bundle.js',
					type: 'text/javascript'
				}

			]
		}
	}