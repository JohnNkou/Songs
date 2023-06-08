import express  from 'express';
import { fork, exec } from 'child_process'
import bodyParser from 'body-parser'
import compression from 'compression'
import * as express_react from 'express-react-views'
import fs from 'fs';
import https from 'https'
import logger from 'morgan'
import path from 'path'
import { indexRouter, Stream, Waiters, Subscription, PopulateCategoriesAndSongs,  streamCreator, streamCollector, streamUpdater, streamSubscription, streamDeleter, noStore, songDownloader, downloadToSubscriber, streamPicker, addDefaultsCategorieAndSongs, ErrorLogger, Categorie, Song, CommitHandler, CloseServer, ForkProcess, ServerSong }  from './router/index.js';
import { killUnusedStream } from './utilis/sUtilities.js'
import { appState } from './utilis/constant.cjs';
import { streamFileName, lineTermination } from './db/data.js'
import db from './utilis/dbClass.js'

global.alert = ()=>{};
global.localStorage = { getItem:()=>{}, setItem:()=>{}}

export const app = express();

const root = process.env.ROOT;

export const streamWaiter = {};
export const streamSubscribers = {};
const downloadWaiters = {};
const stream = {};
const up = {lastupdate:0};
const textParser = bodyParser.text();

export const StreamJest = Stream();
export const SubscriptionJest = Subscription(streamSubscribers);


app.set('views',`${root}/views`)
app.set("view engine","jsx")
app.engine("jsx",express_react.createEngine());
app.use(compression());
app.use(express.json());
app.use(express.static(`${root}/public`,{setHeaders:(res,filepath)=> {
	if(path.basename(filepath) == "worker.js"){
		res.set('Service-Worker-Allowed','/');
	}
}}));
app.get('/', indexRouter(appState));
app.get('/song/:catId/:songName',ServerSong(appState));
app.get('/connect',noStore(),(req,res)=>{
	res.status(200).end();
})
app.get('/health',(req,res)=>{
	res.status(200).end();
})
app.route('/api/Categorie').get(Categorie());
app.route('/api/Song').get(Song());
app.route('/api/stream').get(StreamJest, Waiters(streamWaiter)).post(StreamJest,Subscription(streamSubscribers), Waiters(streamWaiter));
app.get('/api/stream/subscribe',(req,res,next)=>{ res.status(0); next();  }, SubscriptionJest);
app.get('/api/stream/song', StreamJest);
app.post('/api/reportError',ErrorLogger());
app.post('/webhoock',CommitHandler(), CloseServer(app,db), ForkProcess(app,db));
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