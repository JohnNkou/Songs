import minimize  from 'minimize';
import mysql from 'mysql'
import { SUB } from '../utilis/constant.cjs'
import { spawn, fork } from 'child_process'
import dbClients from '../utilis/db.js';
import db from '../utilis/dbClass.js';
import { check,transformer, validator } from '../utilis/dev_utilis.js'
import messages from '../utilis/message.cjs';
import config from '../utilis/db.config.cjs';
import { songPattern } from '../utilis/pattern.js';

const resTimeToWait = 30000,
errorMessage = messages.error,
constrains = config.constrains,
{ table, filters } = config,
{ cat,song, stream } = table,
cF = cat.fields,
sF = song.fields,
stF = stream.fields,
stq = stream.query,
V = new validator(),
T = new transformer(V),
streamConstrains = constrains[stream.name](errorMessage),
streamRelaxConstrains = constrains[stream.name](errorMessage,false),
catConstrains = constrains[cat.name](errorMessage),
relaxCatConstrains = constrains[cat.name](errorMessage,false),
songConstrains = constrains[song.name](errorMessage),
relaxSongConstrains = constrains[song.name](errorMessage,false),
streamFilterConstrains = constrains[`${stream.name}Filter`](errorMessage),
testing = process.env.NODE_ENV == 'test',
root = process.env.ROOT;


function getAllCategorie(){
	return new Promise((resolve,reject)=>{
		db.query('SELECT * FROM Categorie',(err,rows)=>{
			if(err){
				reject(err);
			}

			resolve(rows);
		})
	})
}

function storeError(res){
	res.status(500).json({code:0,message:"Coudln't retrieve data from store"});
}

export function ErrorLogger(){
	return (req,res)=>{
		let headers = req.headers,
		userAgent = headers['user-agent'],
		body = req.body || {};

		if(Object.keys(body).length){
			console.error('user-agent',userAgent,body);
		}
		res.status(200).end();
	}
}

export function CommitHandler(){
	let reg = /heads\/master$/;

	return (req,res,next)=>{
		let body = req.body,
		ref = body.ref,
		message = "";

		if(ref){
			res.status(200).end();

			if(reg.test(ref)){
				console.log("Git Pulling");
				let proc = spawn("git",["pull","Master","master"]),
				proc2;

				proc.stderr.on('data',(chunk)=> { message += chunk });
				proc.on('error',(e)=>{
					console.error("error",e);
				})
				proc.on('exit',(code,signal)=>{
					if(code == 0){
						next();
					}
					else{
						console.error("Git pull exited with bad code",code);
						console.error(message);
					}
				})
			}
			else{
				console.log("Commit from non master",body);
			}
		}
		else{
			res.status(400).end();
		}
	}
}

export function CloseServer(app,db){
	return (req,res,next)=>{
		let server = app.__customServer;
		server.close();

		setTimeout(()=>{
			db.end();
			next();
		},15000)
	}
}

export function ForkProcess(app,db){
	return (req,res)=>{
		let proc = fork('start.js',{ env:process.env, cwd: root });
		proc.on('message',(payload)=>{
			if(payload.started){
				process.exit(0);
			}
			else{
				console.error("Received Odd response",payload);
				try{
					app.listen(process.env.PORT);
					db.newClient(dbClients);
				}
				catch(e){
					console.error(e);
					process.exit(1);
				}
			}
		})
	}
}

export async function PopulateCategoriesAndSongs(store){
	await db.getAllCategorie().then(async (r)=>{
		let cats = r.data,
		cat,
		catLength = cats.length,
		i=0;

		store.Categories = cats;

		while(i < catLength){
			cat = cats[i];
			await db.getAllSongs({[sF.catId]: cat[cF.id]}).then((r)=>{
				let songs = r.data;

				store.onlineSongs[cat.id] = songs.map((song)=> ({ [sF.name]: song[sF.name], [sF.verses]: song[sF.verses] }));
			})
			i++;
		}
	}).catch((e)=>{
		console.error("Coudn't populate the Categories and Songs",e);
	})
}

export const addDefaultsCategorieAndSongs = (store)=>{
	getAllCategorie().then((cats)=>{
		if(cats){
			store.Categories = cats.map((cat)=> cat.name);
			cats.forEach((cat,i)=>{
				db.query("SELECT * FROM Songs WHERE cid=?",cat.cid,(err,songs)=>{
					if(err){
						console.log("addDefaultsCategorieAndSongs Error",err);
						return;
					}
					store.onlineSongs[i] = songs.map((song)=> ({name:song.name, Verses:JSON.parse(song.Verses)}));
					store.offlineSongs[i] = [];
				})
			})
		}
	}).catch((e)=>{
		console.error('addDefaultsCategorieAndSongs Error',e);
	})
}

export function streamPicker(){
	return (req,res,next)=>{
		let { q } = req.query,
		name = req.params.name

		console.log("Hitted");

		if(q == 'Exist'){
			console.log("Q Exist");
			db.query('SELECT * FROM Stream WHERE name=?',[name],(err,rows)=>{
				if(err)
					next(err);
				else{
					if(rows.length)
						res.status(200).send();
					else
						res.status(404).send();
				}
			})
		}
		else{
			console.log("Stopping",q,name);
			next();
		}
	}
}
export const indexRouter =  (store)=>{
	return (req,res)=>{
		let query = req.query,
		manifest = /*query.manifest || */false;

		res.app.render('index.jsx',{store,nodeJs:true, manifest},(err,html)=>{
			if(err){
				console.log(err)
				res.end("Error"+html)
			}
			else{
				res.set("Cache-Control","no-store,no-cache");
				res.writeHead(200,{"Content-type":"text/html; charset=utf8"})
				res.end(html.replace(/\s{2,}/g,''));
			}
		})
		
	}
}

export function Stream(){
	function fa(req,res,next){
		let query = req.query || {},
		{ action } = query,
		body = req.body || {},
		name,
		song,
		songName,
		catName,
		verses,
		index,
		error,
		r,
		data = {};

		if(action){
			switch(action){
				case 'add':
					if(Object.keys(body).length){
						song = body[stF.song];
						songName = song && song[stF.songName];
						verses = song && song[stF.verses];
						index = song && song[stF.index];

						if(songName != undefined){
							body[stF.songName] = songName;
						}
						if(verses != undefined){
							body[stF.verses] = verses;
						}
						if(index != undefined){
							body[stF.index] = index;
						}

						r = check(body,streamConstrains,V,T);
						error = r.errors;

						if(Object.keys(error).length){
							return res.status(400).json({error,inserted:false}).end();
						}
						else{
							return db.addStream(body).then((r)=>{
								if(r.inserted){
									res.status(201).json(r).end();
									next();
								}
								else{
									res.status(409).json(r).end();
								}
							}).catch(next);
						}
					}
					else{
						return res.status(400).json({
							error: { 
								message:errorMessage.missData()
							}
						}).end();
					}
				case 'getAll':
					delete query['action'];

					if(Object.keys(query).length){
						if(filters.lastTime in query){
							query[filters.lastTime] = parseInt(query[filters.lastTime],10);
						}
						r = check(query,streamFilterConstrains,V,T);
						error = r.errors;

						if(Object.keys(error).length){
							return res.status(400).json({error,data:[]}).end();
						}
						else{
							return db.getAllStreams(query).then((r)=>{
								if(r.data.length){
									res.status(200).json({
										action:SUB.UPDATE, streams:r.data.map((x)=> x[stF.name]), timestamp:Date.now(), 
									}).end();
								}
								else{
									res.status(0);
									next();
								}
							}).catch(next);
						}
					}
					else{
						return res.status(400).json({
							error:{
								message:errorMessage.missData()
							}
						}).end();
					}
				case 'update':
					if(Object.keys(body).length){
						song = body[stF.song];
						songName = song && song[stF.songName];
						verses = song && song[stF.verses];
						index = song && song[stF.index];
						name = body[stF.name];
						catName = body[stF.catName];

						if(songName != undefined){
							body[stF.songName] = data[stF.songName] = songName;
						}
						if(verses != undefined){
							body[stF.verses] = data[stF.verses] = verses;
						}
						if(index != undefined){
							body[stF.index] = data[stF.index] = index;
						}
						if(catName != undefined){
							data[stF.catName] = catName;
						}
						if(index == undefined && stF.index in body){
							data[stF.index] = body[stF.index];
						}

						r = check(body,streamRelaxConstrains,V,T);
						error = r.errors;

						if(!Object.keys(error).length){
							delete body[stF.name];
							return db.updateStream(name,body).then((r)=>{
								body[stF.name] = name;
								res.status((r.updated)? 201:409).json(r).end();

								if(r.updated){
									next();
								}
							}).catch(next);
						}
						else{
							let reg = new RegExp(`[^${songPattern}]`,'gi');
							console.log("Bad characted",songName.match(reg));
							return res.status(400).json({error,updated:false}).end();
						}
					}
					else{
						return res.status(400).json({
							error: { 
								message:errorMessage.missData()
							}
						}).end();
					}
				case 'delete':
					if(Object.keys(body).length){
						r = check(body,streamRelaxConstrains,V,T);
						error = r.errors;

						if(!Object.keys(error).length){
							return db.deleteStream(body[stF.name]).then((r)=>{
								delete r.old;
								res.status((r.deleted)? 201:409).json(r).end();
								if(r.deleted){
									next();
								}
							}).catch(next);
						}
						else{
							return res.status(400).json({error,deleted:false}).end();
						}
					}
					else{
						return res.status(400).json({
							error: { 
								message:errorMessage.missData()
							}
						}).end();
					}
				case 'download':
					delete query.action;

					if(Object.keys(query).length){
						r = check(query, streamRelaxConstrains,V,T),
						error = r.errors;

						if(!Object.keys(error).length){
							return db.getStream(query[stF.name]).then((r)=>{
								let data = r.data[0];

								if(data){
									song = data[stF.song];
									songName = song[stF.songName];
									verses = song[stF.verses];
									catName = data[stF.catName];
									res.status(200).json({ action:SUB.ADD, [stF.catName]: catName, [stF.songName]: songName, [stF.verses]:verses }).end();
								}
								else{
									res.status(200).json({ action:SUB.NOTHING }).end();
								}
							}).catch(next);
						}
						else{
							return res.status(400).json({error,data:[]}).end();
						}
					}
					else{
						return res.status(400).json({
							error: { 
								message:errorMessage.missData()
							}
						}).end();
					}	
				case 'checkExist':
					return db.getStream(query.name).then((r)=>{
						if(r.data.length){
							res.status(200).end();
						}
						else{
							res.status(404).end();
						}
					}).catch((e)=>{
						console.error(e);
						res.status(404).end();
					})
				default:
					res.status(400).json({
						error:{
							message: errorMessage.unknown('action')
						}
					})
			}
		}
		else{
			res.status(400).json({
				error:{
					message: errorMessage.invalid('action')
				}
			}).end();
		}
	}
	if(process.env.NODE_ENV == 'test'){
		return jest.fn(function(){ return fa.apply(null,arguments) })
	}
	else{
		return fa;
	}
}

export function Categorie(){
		return (req,res,next)=>{
			let query = req.query || {},
			{ action } = query,
			body = req.body || {},
			r,
			error;

			if(action){
				switch(action){
					case 'getAll':
						if(Object.keys(body).length){
							r = check(body, relaxCatConstrains, V,T);
							error = r.errors;

							if(Object.keys(error).length){
								return res.status(400).json({error,data:null}).end();
							}
						}
						db.getAllCategorie(body).then((r)=>{
							res.status(200).json(r).end();
						}).catch((error)=>{
							res.status(500).json({error}).end();
						})
						break;
					default:
						res.status(400).json({
							error:{
								message: errorMessage.unknown('action')
							}
						})
				}
			}
			else{
				res.status(400).json({
					error:{
						message:errorMessage.invalid('action')
					}
				}).end();
			}
		}
}

export function Song(){
	return (req,res,next)=>{
		let query = req.query || {},
		{ action, catId, last } = query,
		reqBody = { catId },
		body = req.body || {},
		r,
		error;

		if(last){
			try{
				reqBody.last = JSON.parse(last);
			}
			catch(e){

			}
		}

		if(action){
			switch(action){
				case 'getAll':
					if(Object.keys(reqBody).length){
						r = check(reqBody,relaxSongConstrains,V,T);
						error = r.errors;

						if(Object.keys(error).length){
							return res.status(400).json({error}).end();
						}

						return db.getAllSongs(reqBody).then((r)=>{
							res.status(200).json(r).end();
						}).catch((error)=>{
							console.error(error);
							res.status(500).json({error}).end();
						})
					}
					else{
						console.log("No reqBody given",reqBody);
						res.status(400).json({
							error:{
								message:errorMessage.missData()
							}
						}).end();
					}
					break;
				default:
					res.status(400).json({
						error:{
							message:errorMessage.invalid('action')
						}
					})
			}
		}
		else{
			res.status(400).json({
				error:{
					message:errorMessage.invalid('action')
				}
			})
		}
	}
}
export function streamUpdater(subscribers,up, downloadWaiters,stream){
	return (req,res,next)=>{
		console.log("req.body",req.body,typeof req.body);
		let {c,s,p,n,v} = req.query, 
		lastTime = String(Date.now()).slice(0,10),
		sql = ["UPDATE Stream SET"], holder = [],
		payload = stream[n] && stream[n].payload || {},
		{ songName, catName } = payload,
		Verses = (is.Object(req.body))? '' : JSON.parse(req.body);

		p = parseInt(p),

		sql.push('position=?');
		holder.push(p);

		if(!n || !stream[n])
			return res.json(BadInput())

		if(is.Number(p) && !s && !c && songName && catName){
			console.log("updating just position");
			console.log(sql);
		}
		else if(c && s && is.Number(p) && n){
			console.log("updating Everything");
			s = s.toUpperCase();
			c = c.toLowerCase();
			n = n.toLowerCase();
			p = parseInt(p) || 0;

			if(p > 15)
				return res.json(BadInput());

			sql.push(',catName=?,songName=?,lastTime=? WHERE name=?');
			holder.push(c,s,lastTime,n);
			console.log(sql);
		}
		else{
			console.log("Bad input");
			console.log(p,s,c,n);
			return res.json(BadInput());
		}

		db.query(sql.join(" "),holder,(err)=>{
				if(err){
					if(subscribers[n]){
						for(var subscriber in subscribers[n])
						subscribers[n][subscriber].end();
					}
					return res.status(404).json({code:err.code,message:err.sqlMessage})
				}
				try{
					if(subscribers[n]){
						for(var subscriber in subscribers[n])
							subscribers[n][subscriber].json({action:SUB.UPDATE,songName:s,catName:c,position:p}).end();
					}
					
					res.status(200).json({updated:true});

					if(p && !s && !c){
						payload.position = p;
						console.log("Just position updated");
					}
					else{
						payload.songName = s;
						payload.catName = c;
						payload.Verses = Verses;
						console.log("All updated");
					}

					console.log("downloadWaiters",downloadWaiters);
					if(downloadWaiters[n]){
						let categories = {};
						for(let catName in downloadWaiters[n]){
							categories[catName] = {songs:[]};
							for(let songName in downloadWaiters[n][catName])
								categories[catName].songs.push(songName);
						}

						if(Object.keys(categories).length)
							res.status(200).json({waitingDownload:categories});
					}
				}
				catch(e){
					next(e);
				}
			})
	}
}

export function streamCreator(waiters,up,stream){
	return function(req,res,next){
		let n = req.params.stream.toLowerCase();
		//res.status(200).end(`Got your stream ${stream}`);
		let {s,c,i} = req.query,
		v = [];

		if(!s || !c || !i){
			s = s || '';
			c = c || '';
			i = i || 0 ;
		}

		s = s.toUpperCase();
		c = c.toLowerCase();
		i = parseInt(i);

		if(i == undefined || i > 20)
			return res.json(BadInput());

		let t = new Date().getTime().toString().slice(0,10);
		up.lastupdate = t;
		db.query('INSERT INTO Stream(name,catName,songName,position,LastTime) VALUES(?,?,?,?,?)',[n,c,s,i,t],(err,succ)=>{
			if(err){
				if(err.code=='ER_DUP_ENTRY')
					return res.status(404).json({code:6,message:'Duplicate entry'});
				return res.status(404).json({message:err.sqlMessage || err.message});
			}
			
			try{
				console.log("Here is what we have",c,s,v,i,req.body);
				stream[n] = {payload:{catName:c, songName:s, position:i, Verses:v}};

				res.json(`Got your stream ${n}`).end();

				console.log("new lastTime",)

				if(waiters.length){
					for(let id in waiters){
						if(id != "length"){
							let socket = waiters[id];
							socket.json({action:SUB.ADD,name:n,timestamp:t});
						}
					}
				}
				else
					console.log("There is no waiting while creating stream",n);
			}
			catch(e){
				db.query('DELETE FROM Stream WHERE name=?',[n],(err)=>{
					if(err)
						console.log(`Damn't couldn't delete the stream ${n} after a failure`);
					else{
						console.log(`Stream ${n} delete because of failure`);
					}
					delete stream[n];
				})
				next(e);
			}
		})
	}
}

export function streamCollector(waiters,up){
	return function(req,res,next,counter = 0){
		if(counter == 10)
			return next();
		let {t} = req.query;
		t = parseInt(t);
		if(!t)
			t = 0;

		if(!t || t < up.lastupdate){
			let holder = (t)? [t]:[0];
			db.query(`SELECT name FROM Stream ${(t)? 'WHERE LastTime > ?':''}`,holder,(err,streams)=>{
				if(err){
					if(err.fatal){
						console.log("Fatal error in streamCollector",counter);
						db.reconnect();
						return setTimeout(()=>{
							streamCollector(waiters,up)(req,res,()=> next(err),++counter);
						},500)
					}
					console.log("streamCollector Error",err);
					next(err);
					return res.status(404).json({code:err.code, message:err.sqlMessage});
				}
				res.json({action:SUB.UPDATE,streams: streams.map((stream)=> stream.name),timestamp:new Date().getTime().toString().slice(0,10)});
			})
		}
		else{
			let id = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
			waiters[id] = res;
			waiters.length++;

			console.log("New Watier",waiters.length);

			let count = setTimeout(()=>{
				if(!res.writableEnded){
					res.json({action:SUB.NOTHING});
				}
			},resTimeToWait);

			res.on('close',()=>{
				if(waiters[id]){
					delete waiters[id];
					waiters.length--;

					console.log("Waiter goes",waiters.length);
				}
				//clearTimeout(count);
			})
		}
	}
}
export function streamSubscription(subscribers){
	return (req,res,next)=>{
		let {n,u} = req.query, clientSubscribed = 0;

		if(!n || !n.charAt || (n && u && u != 'true' && u != 'false'))
			return res.json(BadInput());
		
		n = n.toLowerCase();

		let subscriberId = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
		if(!subscribers[n])
			subscribers[n] = {};
		else{
			let c = 0;
			for(var xx in subscribers[n])
				c++;
			
			clientSubscribed = c;
		}

		if(!u){
			
			db.query('SELECT catName,songName,position from Stream WHERE name=?',[n],(err,data)=>{
				if(err)
					res.status(404).json({code:err.code,message:err.sqlMessage});
				else{
					data = data.pop();
					if(data)
						res.status(200).json({action:SUB.UPDATE,songName:data.songName,catName:data.catName, position: data.position})
					else
						res.status(200).json({action:SUB.NOTHING});

				}
			})	
		}	
		else{
			subscribers[n][subscriberId] = res;

			console.log("There is ",++clientSubscribed,"on stream ",n);
			res.on('close',()=>{
			if(subscribers[n])
				console.log("There is ", --clientSubscribed,"on stream",n);
				delete subscribers[n][subscriberId]
			})			
		}

	}
}

export function streamDeleter(subscribers,waiters,up,stream,downloadWaiters){
	return (req,res,next)=>{
		
		let {n} = req.query;
		if(!n || !n.charAt)
			return res.json(BadInput());

		n = n.toLowerCase();

		db.query('DELETE FROM Stream WHERE name=?',[n],(err)=>{
		if(err){
			console.log("Error while trying to delete stream",n);
			for(var subscriber in subscribers[n]){
				subscribers[n][subscriber].json({action:SUB.UNSUBSCRIBE, message:`The stream ${n} is presenting some problemes`});
			}
			res.status(200).json({code:0,message:"Couldn't delete the stream"});
			return;
		}
		try{
			up.lastupdate = new Date().getTime().toString().slice(0,10);
			for(var subscriber in subscribers[n]){
				subscribers[n][subscriber].json({action:SUB.UNSUBSCRIBE, message:`The stream ${n} has finished`});
			}
			if(subscriber){
				subscribers[n][subscriber].on('close',()=>{
					console.log(subscribers[n]);
					delete subscribers[n];
					console.log("Deleted stream",n);
				})
			}
			res.end();
			if(waiters.length){
				for(let id in waiters){
					if(id != "length"){
						let socket = waiters[id];
						socket.json({action:SUB.DELETE,name:n, timestamp:up.lastupdate});
					}
				}
			}

			if(stream[n]){
				if(stream[n]['streamer'])
					stream[n]['streamer'].end();
				delete stream[n];
			}

			if(downloadWaiters[n]){
				for(let c in downloadWaiters[n]){
					for(let s in downloadWaiters[n][c]){
						for(let id of downloadWaiters[n][c][s]){
							downloadWaiters[n][c][s][id].json({action:SUB.STREAMDELETED});
							delete downloadWaiters[n][c][s][id];
						}

						delete downloadWaiters[n][catName]
					}
				}

				delete downloadWaiters[n];
			}
		}
		catch(e){
			next(e);
		}
		})
	}
}

export function songDownloader(downloadWaiters,stream){
	return (req,res,next)=>{
		try{
			console.log("songDownloader");
			let {n,s,c} =  req.query;
			if(!n || !s || !c)
				return res.json(BadInput());


			s = s.toUpperCase();
			n = n.toLowerCase();
			c = c.toLowerCase();

			if(stream[n]){
				console.log("npm Oh, He is in stream, let look if there is the song I want");
				if(stream[n].payload.catName == c && stream[n].payload.songName == s){
					console.log("Found a match in stream",n);
					if(stream[n].payload.Verses){
						console.log("Everything is okay, no need to put me in downloadWaiters");
						return res.json({action:SUB.ADD, payload:{catName:c}});
					}

					if(stream[n]['streamer']){
						console.log("Telling streammer to uploadVerse");
						if(!stream[n]['streamer'].writableEnded)
							stream[n]['streamer'].json({action:SUB.UPLOADVERSES});
						else
							delete stream[n]['streamer'];
					}
				}
				else{
					console.log("Look like there is no match for me in stream",n);
				}
			}
			else{
				console.log("stream",n,"Is not in the stream GV");
				return res.json({action:SUB.NOTHING})
			}
			let id = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
			if(!downloadWaiters[n]){
				downloadWaiters[n] = {};
				downloadWaiters[n][c] = {};
				downloadWaiters[n][c][s] = {};
				downloadWaiters[n][c][s][id] = res;
			}
			else if(!downloadWaiters[n][c]){
				downloadWaiters[n].length++;
				downloadWaiters[n][c] = {};
				downloadWaiters[n][c][s] = {};
				downloadWaiters[n][c][s][id] = res
			}
			else if(!downloadWaiters[n][c][s]){
				downloadWaiters[n][c];
				downloadWaiters[n][c][s] = {};
				downloadWaiters[n][c][s][id] = res;
			}
			else{
				downloadWaiters[n][c][s];
				downloadWaiters[n][c][s][id] = res;
			}

			res.on('close',()=>{
				if(downloadWaiters[n] && downloadWaiters[n][c] && downloadWaiters[n][c][s] && downloadWaiters[n][c][s][id]){
					delete downloadWaiters[n][c][s][id];
				}
			})
		}
		catch(e){
			next(e);
		}
	}
}

export function downloadToSubscriber(downloadWaiters){
	return (req,res,next)=>{
		let r = req.body;
		let { n } = req.query;
		if(!n)
			return res.json(BadInput());

		n = n.toLowerCase();

		if(downloadWaiters[n]){
			for(var catName in r){
				if(downloadWaiters[n][catName]){
					if(r[catName].deleted){
						for(var s in downloadWaiters[n][catName]){
							for(var id in downloadWaiters[n][catName][s]){
								let client = downloadWaiters[n][catName][s][id]
								client.json({action:SUB.DELETE});
							}
						}
						delete downloadWaiters[n][catName];
					}
					else{
						for(var songName in r[catName]){
							if(downloadWaiters[n][catName][songName]){
								let client;
								let action = (r[catName][songName].deleted)? SUB.DELETE: SUB.ADD;
								let payload = (action == SUB.DELETE)? null: {catName,songName, Verses: r[catName][songName]};
								console.log("Action is",action);
								for(let id in downloadWaiters[n][catName][songName]){
									if(id != "length"){
										let client = downloadWaiters[n][catName][songName][id];
										client.json({action, payload})
										console.log(`client ${id} got is response from streamer ${n}`);
									}
								}

								delete downloadWaiters[n][catName][songName];
							}
						}

						if(!Object.keys(downloadWaiters[n][catName]).length)
							delete downloadWaiters[n][catName];
					}
				}
			}
		}
		let c = Object.keys(downloadWaiters[n]);
		if(!c.length)
			delete downloadWaiters[n];

		res.end();
	}
}

export const Waiters = (waiters)=>{
	return (req,res,next)=>{
		let status = res.statusCode,
		query = req.query || {},
		body = req.body || {};

		if(status){
			if(status == 201){
				if(query.action == 'add'){
					for(let id in waiters){
						waiters[id].status(200).json({
							action:SUB.ADD, [stF.name]:body[stF.name], timestamp:Date.now() 
						}).end();
						delete waiters[id];
					}
					return;
				}
				else if(query.action == 'delete'){
					for(let id in waiters){
						waiters[id].status(200).json({
							action:SUB.DELETE, [stF.name]:body[stF.name], timestamp:Date.now()
						}).end();
						delete waiters[id];
					}
					return;
				}
			}
		}
		else{
			let socket = req.socket,
			ip = `${socket.remoteAddress}:${socket.remotePort}`;

			waiters[ip] = res;

			if(testing){
				jest.useFakeTimers();
			}
			setTimeout(()=>{
				if(!res.writableEnded){
					res.status(200).json({action:SUB.NOTHING}).end();
				}
				delete waiters[ip];
			},30000)
		}
	}
}
export const Subscription = (subscribers)=>{
	function fa(req,res,next){
		let query = req.query || {},
		r,
		action = query.action,
		body = req.body || {},
		error,
		updating,
		streamName,
		songName,
		catName,
		verses,
		index,
		payload,
		subject,
		song;

		if(Object.keys(query).length){
			if(!res.statusCode){
				if(stq.updating in query && query[stq.updating] === "true" || query[stq.updating] === "false"){
					query[stq.updating] = query[stq.updating] == 'true';
				}
				r = check(query,streamRelaxConstrains,V,T);
				error = r.errors;

				if(!Object.keys(error).length){
					updating = query[stq.updating];
					streamName = query[stF.name];

					if(!updating){
						return db.getStream(streamName).then((r)=>{
							res.status(200);

							if(r.data.length){
								let stream = r.data[0],
								song = stream[stF.song];

								res.json({
									action:SUB.UPDATE, [stF.songName]: song[stF.songName], [stF.catName]: stream[stF.catName], [stF.index]: song[stF.index]
								}).end();
							}
							else{
								res.json({
									action:SUB.NOTHING
								}).end();
							}
						}).catch(next);
					}
					else{
						if(!(streamName in subscribers)){
							subscribers[streamName] = {};
						}

						let socket = req.socket,
						id = `${socket.remoteAddress}:${socket.remotePort}`; 
						
						subscribers[streamName][id] = res;

						res.on('close',()=>{
							if(subscribers[streamName]){
								delete subscribers[streamName][id];
								if(!Object.keys(subscribers[streamName]).length){
									delete subscribers[streamName];
								}
							}
						})
					}
				}
				else{
					res.status(400).json({error}).end();	
				}
			}
			else{
				if(res.statusCode == 201){
					streamName = body[stF.name];
					subject = subscribers[streamName];
					if(action == 'update'){
						payload = {};
						song = body[stF.song];
						catName = body[stF.catName];
						if(song){
							songName = song[stF.songName];
							verses = song[stF.verses];
							index = song[stF.index];

							if(songName != undefined){
								payload[stF.songName] = songName;
							}
							if(verses != undefined){
								payload[stF.verses] = verses;
							}
							if(index != undefined){
								payload[stF.index] = index;
							}
						}
						else{
							if(stF.index in body){
								payload[stF.index] = body[stF.index];
							}
						}

						if(catName != undefined){
							payload[stF.catName] = catName;
						}

						if(subject != undefined){
							for(let subscriber in subject){
								subject[subscriber].status(200).json({
									action:SUB.UPDATE, ...payload
								}).end();
							}
						}
					}
					else if(action == 'delete'){
						if(subject != undefined){
							for(let subscriber in subject){
								subject[subscriber].status(200).json({
									action:SUB.UNSUBSCRIBE, message: `The stream ${streamName} has finished`
								}).end();
							}
						}
						next();
					}
					else{
						next();
					}
				}
			}
		}
		else{
			res.status(400).json({error: errorMessage.missData()}).end();
		}
	}

	if(testing){
		return jest.fn(function(){ return fa.apply(null,arguments); })
	}
	return fa;
}

export function noStore(){
	return (req,res,next)=>{
		res.set('Cache-control','no-store,no-cache');
		next();
	}
}

function BadInput(){
	return {error:true, message:'Bad Input'}
}
