import minimize  from 'minimize';
import mysql from 'mysql'
import { SUB, is } from '../utilis/BrowserDb.cjs'
import process from 'child_process'
import { spawn, fork } from 'child_process'
import { createDb } from '../utilis/db.js'
import { fConsole } from './dev.js';

const db = new createDb();
db.on('error',(err)=>{
	console.log("Database Error",err);
})

const resTimeToWait = 30000;

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

export const storeProvider = (store)=>{
	return (req,res,next)=>{
		res.set('Content-type','text/javascript');
		//res.status(200).end(`window.storeData=${JSON.stringify(store)}`);

		let onlineSongs = {};

		for(var id in store.onlineSongs){
			onlineSongs[id] = [];
		}

		res.status(200).end(`window.storeData=${JSON.stringify({
			...store,
			onlineSongs
		})}`);
	}
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
		res.app.render('index.jsx',{store,nodeJs:true},(err,html)=>{
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

export function noStore(){
	return (req,res,next)=>{
		res.set('Cache-control','no-store,no-cache');
		next();
	}
}

function BadInput(){
	return {error:true, message:'Bad Input'}
}
