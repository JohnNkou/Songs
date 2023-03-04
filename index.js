import express  from 'express';
import { fork, exec } from 'child_process'
import bodyParser from 'body-parser'
import compression from 'compression'
import * as express_react from 'express-react-views'
import fs from 'fs';
import https from 'https'
import logger from 'morgan'
import path from 'path'
import { indexRouter, storeProvider, Stream, Waiters, Subscription, PopulateCategoriesAndSongs,  streamCreator, streamCollector, streamUpdater, streamSubscription, streamDeleter, noStore, songDownloader, downloadToSubscriber, streamPicker, addDefaultsCategorieAndSongs }  from './router/index.js';
import { watchHelper, fConsole } from './router/dev.js';
import { appState, killUnusedStream, inEc2 } from './utilis/BrowserDb.cjs'
import songAdderController from './utilis/songAdderController.js'
import { streamFileName, lineTermination } from './db/data.js'

global.alert = ()=>{};
global.localStorage = { getItem:()=>{}, setItem:()=>{}}

process.on('exit',function(){
	let st = "Process Exited\n\n";
	console.log(st);
	console.error(st);
})
process.on('SIGINT',function(){
	let st = "Process Exited with SIGINT\n\n";
	console.log(st);
	console.log(st)
	process.exit();
})
process.on('SIGTERM',function(){
	let st = "Process Exited with SIGTERM\n\n";
	console.log(st);
	process.exit();
})

export const app = express();
//console = fConsole;

const root = process.env.ROOT;
const options = {
	key:fs.readFileSync(root+'/certs/key.pem'),
	cert: fs.readFileSync(root+'/certs/cert.pem')
}

export const streamWaiter = {};
export const streamSubscribers = {};
const downloadWaiters = {};
const stream = {};
const up = {lastupdate:0};
const textParser = bodyParser.text();

/*setInterval(()=>{
	let waiters = streamWaiter;
	let subscribers = streamSubscribers;
	let upTime = up;
	let fsys = fs;
	let filename = streamFileName;
	killUnusedStream({fs:fsys,filename,subscribers,waiters,up:upTime,lineTermination});
},60000);*/

//addDefaultsCategorieAndSongs(appState);

export const LoadSongs = PopulateCategoriesAndSongs(appState);
export const StreamJest = Stream();
export const SubscriptionJest = Subscription(streamSubscribers);


app.set('views',`${root}/views`)
app.set("view engine","jsx")
app.engine("jsx",express_react.createEngine());
/*app.use(compression({filter:(req,res)=>{
	if(path.basename(req.url).match(/\.(css|js|json)/))
		return true;
	return false;
}}))*/
app.use(express.static(root,{setHeaders:(res,filepath)=> {
	if(path.basename(filepath) == "worker.js"){
		res.set('Service-Worker-Allowed','/');
	}
	//res.set('Cache-Control','no-store,no-cache');
}}));
app.use(express.json());

app.get('/', indexRouter(appState));
app.get('/connect',noStore(),(req,res)=>{
	res.status(200).end();
})
app.get('/store', storeProvider(appState));
app.get('/songAdder.js',noStore(), songAdderController(appState));
app.route('/stream').get(StreamJest, Waiters(streamWaiter)).post(StreamJest,Subscription(streamSubscribers), Waiters(streamWaiter));
app.get('/stream/subscribe',(req,res,next)=>{ res.status(0); next();  }, SubscriptionJest);
app.get('/stream/song', StreamJest);
/*
app.get('/stream/list', noStore(), streamCollector(streamWaiter,up));
app.post('/stream/update', noStore(), textParser, streamUpdater(streamSubscribers,up, downloadWaiters,stream));
app.get('/stream/subscribe', noStore(),streamSubscription(streamSubscribers));
app.get('/stream/delete', noStore(),streamDeleter(streamSubscribers,streamWaiter,up,stream,downloadWaiters));
app.get('/stream/downloadSong', noStore(), songDownloader(downloadWaiters,stream));
app.post('/stream/create/:stream', noStore(), textParser, streamCreator(streamWaiter,up,stream));
app.post('/stream/uploadToSubscriber', noStore(), downloadToSubscriber(downloadWaiters));
app.get('/stream/:name', noStore(), streamPicker())
*/
app.use(function(err,req,res,next){
	console.error("OUps an error");
	console.error(err.stack);
	console.error(err.message);
	if(res.headersSent){
		return next(err);
	}
	res.set('Cache-Control','no-store,no-cache');

	res.status(500);
	res.json({error:err});
})