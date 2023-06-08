jest.mock('../../utilis/dbClass.js',()=>{
	return {
		getAllCategorie: jest.fn(()=>{
			let env = process.env.getAllCategorie && JSON.parse(process.env.getAllCategorie) || {},
			response = env.response || { data:[], error:null },
			action = env.action || 'resolve';

			return Promise[action](response);
		}),
		getAllSongs: jest.fn(()=>{
			let env = process.env.getAllSongs && JSON.parse(process.env.getAllSongs) || {},
			response = env.response || { data:[], error:null },
			action = env.action || 'resolve';

			return Promise[action](response);
		}),
		getCategorie: jest.fn(()=>{
			let getCatEnv = process.env.getCategorie,
			env = getCatEnv && JSON.parse(getCatEnv) || {},
			response = env.response || { data:[], error:null },
			action = env.action || 'resolve';
			
			return Promise[action](response);
		}),
		searchSong: jest.fn(()=>{
			let searchEnv = process.env.searchSong,
			env = searchEnv && JSON.parse(searchEnv) || {},
			response = env.response || { data:[], error:null },
			action = env.action || 'resolve';

			return Promise[action](response);
		}),
		addStream:jest.fn(()=> {
			let env = process.env.addStream && JSON.parse(process.env.addStream) || {},
			response = env.response || { inserted:true, error:null },
			action = env.action || 'resolve';

			return Promise[action](response)
		}),
		updateStream:jest.fn(()=> {
			let env = process.env.updateStream && JSON.parse(process.env.updateStream) || {},
			response = env.response || { updated:true, error:null },
			action = env.action || 'resolve';

			return Promise[action](response);
		}),
		deleteStream:jest.fn(()=> {
			let env = process.env.deleteStream && JSON.parse(process.env.deleteStream) || {},
			response = env.response || { deleted:true, error:null },
			action = env.action || 'resolve';

			return Promise[action](response);
		}),
		getAllStreams:jest.fn(()=> {
			let env = process.env.getAllStreams && JSON.parse(process.env.getAllStreams) || {},
			response = env.response || { data:[], error:null },
			action = env.action || 'resolve';

			return Promise[action](response)
		}),
		getStream:jest.fn(()=>{
			let get = process.env.getStream,
			env = get && JSON.parse(get) || {},
			response = env.response || { data:[], error:null },
			action = env.action || 'resolve';

			return Promise[action](response);
		})
	}
})

import { Stream, Waiters, Subscription, Categorie, Song } from '../../router/index.js';
import { EventEmitter } from 'events';
import { createReq } from '../../utilis/dev_utilis.js';
import messages from '../../utilis/message.cjs';
import config  from '../../utilis/db.config.cjs';
import db from '../../utilis/dbClass.js';
import { SUB } from '../../utilis/constant.cjs';

const res = new EventEmitter(),
errorMessage = messages.error,
next = jest.fn(),
table = config.table,
{ cat,stream,song } = table,
cF = cat.fields,
sF = song.fields,
stF = stream.fields,
stq = stream.query,
N = 'Number',
S = 'String',
O = 'Object',
A = 'Array',
B = 'Boolean',
fil = config.filters;

res.json = jest.fn(()=> res);
res.status = jest.fn(()=> res);
res.end = jest.fn(()=> res);
res.set = jest.fn(()=> res);

var statusCall,
endCall,
jsonCall,
setCall,
nextCall,
searchCall,
getCatCall;

function pm(){
	statusCall = res.status.mock.calls;
	endCall = res.end.mock.calls;
	jsonCall = res.json.mock.calls;
	setCall = res.set.mock.calls;
	nextCall = next.mock.calls;
	searchCall = db.searchSong.mock.calls;
	getCatCall = db.getCategorie.mock.calls;
}

beforeEach(()=>{
	pm();
})

describe("Testing Stream",()=>{
	describe("Testing add",()=>{
		let req = createReq(),
		addStreamCall;

		function reset(){
			addStreamCall = db.addStream.mock.calls;
		}
			
		beforeEach(()=>{
			req = createReq();
			req.body = {
				[stF.song]:{
					[stF.songName]:'puke',
					[stF.verses]:['un','deux'],
					[stF.index]:0
				},
				[stF.catName]:'mich',
				[stF.name]:'himala'
			};
			req.query = {
				action:'add'
			}

			addStreamCall = db.addStream.mock.calls;
		})
		afterEach(()=>{

		})
		test("Should call the addStream function when the parameter given are correct and should return an 201 status response",async ()=>{
			await Stream()(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(setCall.length).toBe(0);
			expect(nextCall.length).toBe(1);
			expect(addStreamCall.length).toBe(1);
			expect(nextCall[0].length).toBe(0);
			expect(statusCall[0][0]).toBe(201);
			expect(addStreamCall[0][0]).toEqual(req.body);
		})

		test("Should not call the addStream function when the parameter given are incorrect and should return an 400 status response",async ()=>{
			let req2 = createReq(),
			req3 = createReq();

			req2.query = { action:'add' };
			req3.query = { action:'add' };
			req.body = {};
			req2.body = { [stF.song]:{
				[stF.songName]:'', [stF.verses]:[], [stF.index]:''
			}, [stF.catName]:'', [stF.name]:'' };
			req3.body = {
				[stF.name]:true,
				[stF.song]:[],
				[stF.catName]:true
			};

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
			expect(jsonCall[0][0]).toEqual({
				error:{
					message: errorMessage.missData()
				}
			})

			jest.clearAllMocks();
			pm();reset();

			await Stream()(req2,res,next);

			expect(statusCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
			expect(jsonCall[0][0]).toEqual({
				error:{
					[stF.name]: errorMessage.empty(stF.name),
					[stF.songName]: errorMessage.empty(stF.songName),
					[stF.catName]: errorMessage.empty(stF.catName),
					[stF.verses]: errorMessage.empty(stF.verses),
					[stF.index]: errorMessage.type(stF.index,N)
				},
				inserted:false
			})

			jest.clearAllMocks();
			pm();reset();

			await Stream()(req3,res,next);

			expect(statusCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
			expect(jsonCall[0][0]).toEqual({
				error:{
					[stF.name]: errorMessage.type(stF.name,S),
					[stF.song]: errorMessage.type(stF.song,O),
					[stF.catName]: errorMessage.type(stF.catName,S),
					[stF.songName]: errorMessage.required(stF.songName),
					[stF.verses]: errorMessage.required(stF.verses),
					[stF.index]: errorMessage.required(stF.index)
				},
				inserted:false
			})
		})

		test("Should call the next method when the database throw an error",async ()=>{
			process.env.addStream = JSON.stringify({ action:'reject' });

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(0);
			expect(endCall.length).toBe(0);
			expect(jsonCall.length).toBe(0);
			expect(nextCall.length).toBe(1);
			expect(addStreamCall.length).toBe(1);
			expect(nextCall[0].length).toBe(1);
		})

		test("Should return an 409 status when the database return an inserted property set to false",async ()=>{
			let response = { inserted:false, error:null };
			process.env.addStream = JSON.stringify({response});

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(addStreamCall.length).toBe(1);
			expect(statusCall[0][0]).toBe(409);
			expect(jsonCall[0][0]).toEqual(response);
		})
	})

	describe("Testing getAll",()=>{
		let getAllStreamsCall,
		req;

		function reset(){
			getAllStreamsCall = db.getAllStreams.mock.calls;
		}

		beforeEach(()=>{
			getAllStreamsCall = db.getAllStreams.mock.calls;
			req = createReq();
			req.query = { action:'getAll', [fil.lastTime]:Date.now() };
		})

		test("Should call the getAllStreams method when the correct data are given and should return an 200 response along with the streams retrieved",async ()=>{
			let streams = [ {[stF.name]:'yaka'}, {[stF.name]:'ponk'} ],
			req2 = createReq();

			process.env.getAllStreams = JSON.stringify({
				response:{
					data:streams, error:null
				}
			});

			req2.query = { action:'getAll', [fil.lastTime]:(Date.now()).toString() };

			await Stream()(req,res,next);

			expect(nextCall.length).toBe(0);
			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(getAllStreamsCall.length).toBe(1);
			expect(statusCall[0][0]).toBe(200);
			expect(jsonCall[0][0]).toMatchObject({
				action:SUB.UPDATE, streams: streams.map((x)=> x.name)
			})
			expect(jsonCall[0][0].timestamp).toBeDefined();

			jest.clearAllMocks(); pm(); reset();

			await Stream()(req2,res,next);

			expect(nextCall.length).toBe(0);
			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(getAllStreamsCall.length).toBe(1);
			expect(statusCall[0][0]).toBe(200);
			expect(jsonCall[0][0]).toMatchObject({
				action:SUB.UPDATE, streams: streams.map((x)=> x.name)
			})
			expect(jsonCall[0][0].timestamp).toBeDefined();
		})

		test("Should only call the getAllStreams and the next function and the status function with an argument of 0 when the getAllStreams return an empty array data",async ()=>{
			process.env.getAllStreams = JSON.stringify({
				action:'resolve',
				response:{
					data:[], error:null
				}
			});

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(jsonCall.length).toBe(0);
			expect(endCall.length).toBe(0);
			expect(nextCall.length).toBe(1);
			expect(getAllStreamsCall.length).toBe(1);
			expect(statusCall[0][0]).toBe(0);
		})

		test("Should not call the getAllStreams method when incorrect data are given",async ()=>{
			let req2 = createReq();
			req2.query = { action:'getAll', [fil.lastTime]:true };

			delete req.query[fil.lastTime];

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(getAllStreamsCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
			expect(jsonCall[0][0]).toEqual({
				error:{
					message:errorMessage.missData()
				}
			})

			jest.clearAllMocks(); pm(); reset();

			await Stream()(req2,res,next);

			expect(statusCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(getAllStreamsCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
			expect(jsonCall[0][0]).toEqual({
				data:[], error:{
					[fil.lastTime]: errorMessage.type(fil.lastTime,N)
				}
			})
		})

		test("Should only call the next method and the getAllStreams method when the database throw an error",async ()=>{
			process.env.getAllStreams = JSON.stringify({ action:'reject' });

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(0);
			expect(endCall.length).toBe(0);
			expect(jsonCall.length).toBe(0);
			expect(nextCall.length).toBe(1);
			expect(getAllStreamsCall.length).toBe(1);
			expect(nextCall[0].length).toBe(1);
		})
	})

	describe("Testing update",()=>{
		let updateStreamCall,
		req;

		function reset(){
			updateStreamCall = db.updateStream.mock.calls;
		}

		beforeEach(()=>{
			req = createReq();
			req.query = { action:'update' }
			req.body = {
				[stF.name]:'boyle',
				[stF.song]:{
					[stF.songName]:'joly',
					[stF.verses]:['big','mama'],
					[stF.index]:0
				},
				[stF.catName]:'vish'
			}
			updateStreamCall = db.updateStream.mock.calls;
		})

		test("Should update the given stream when the parameter given are correct",async ()=>{
			let req2 = createReq();
			req2.query = req.query;
			req2.body = {
				[stF.name]:'manch',
				[stF.index]:20
			}

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(1);
			expect(updateStreamCall.length).toBe(1);
			expect(statusCall[0][0]).toBe(201);
			expect(jsonCall[0][0]).toEqual({
				updated:true, error:null
			})

			jest.clearAllMocks(); pm(); reset();

			await Stream()(req2,res,next);

			expect(statusCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(1);
			expect(updateStreamCall.length).toBe(1);
			expect(statusCall[0][0]).toBe(201);
			expect(jsonCall[0][0]).toEqual({
				updated:true, error:null
			})
		})

		test("Should not call the updateStream method when given incorrect data and should return a 404 response along with an error",async ()=>{
			let req2 = createReq(),
			req3 = createReq();
			req2.query = req3.query = req.query;

			req.body = {};
			req2.body = {
				[stF.name]:[],
				[stF.song]:'fak',
				[stF.catName]:[]
			}
			req3.body = {
				[stF.name]:'majic',
				[stF.song]:{
					[stF.songName]:[],
					[stF.verses]:true,
					[stF.index]:[]
				},
				[stF.catName]:'jurasic'
			};

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(updateStreamCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
			expect(jsonCall[0][0]).toEqual({
				error:{ message: errorMessage.missData() }
			})
			
			jest.clearAllMocks(); pm(); reset();

			await Stream()(req2,res,next);

			expect(statusCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(updateStreamCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
			expect(jsonCall[0][0]).toEqual({
				error:{
					[stF.name]:errorMessage.type(stF.name,S),
					[stF.song]: errorMessage.type(stF.song,O),
					[stF.catName]: errorMessage.type(stF.catName,S)
				},
				updated:false
			})

			jest.clearAllMocks(); pm(); reset();

			await Stream()(req3,res,next);

			expect(statusCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(updateStreamCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
			expect(jsonCall[0][0]).toEqual({
				error:{
					[stF.songName]: errorMessage.type(stF.songName,S),
					[stF.verses]: errorMessage.type(stF.verses,A),
					[stF.index]: errorMessage.type(stF.index,N)
				},
				updated:false
			})
		})

		test("Should only call the updateStream and next method when the database throw",async ()=>{
			process.env.updateStream = JSON.stringify({ action:'reject' });

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(0);
			expect(endCall.length).toBe(0);
			expect(jsonCall.length).toBe(0);
			expect(nextCall.length).toBe(1);
			expect(updateStreamCall.length).toBe(1);
			expect(nextCall[0].length).toBe(1);
		})

		test("Should return an 409 response when the database return an object with a updated property set to false",async ()=>{
			let response = { updated:false, error:null };
			process.env.updateStream = JSON.stringify({ response });

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(updateStreamCall.length).toBe(1);
			expect(statusCall[0][0]).toBe(409);
			expect(jsonCall[0][0]).toEqual(response);
		})
	})

	describe("Testing delete",()=>{
		let deleteStreamCall,
		req;

		function reset(){
			deleteStreamCall = db.deleteStream.mock.calls;
		}

		beforeEach(()=>{
			req = createReq();
			req.query = { action:'delete' };
			req.body = {
				[stF.name]:'yuki'
			}
			deleteStreamCall = db.deleteStream.mock.calls;
		})

		test("Should call the deleteStream and return an 201 response when the data send received correct",async ()=>{
			await Stream()(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(1);
			expect(deleteStreamCall.length).toBe(1);
			expect(statusCall[0][0]).toBe(201);
			expect(jsonCall[0][0]).toEqual({
				deleted:true,
				error:null
			});
		})

		test("Should not call the deleteStream and should return an 400 response when the data received are incorrect",async ()=>{
			let req2 = createReq();
			req2.query = req.query;

			req.body = {};
			req2.body = {
				[stF.name]:true
			}

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(deleteStreamCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
			expect(jsonCall[0][0]).toEqual({
				error: {
					message:errorMessage.missData()
				}
			});

			jest.clearAllMocks(); pm(); reset();

			await Stream()(req2,res,next);

			expect(statusCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(deleteStreamCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
			expect(jsonCall[0][0]).toEqual({
				deleted:false,
				error: {
					[stF.name]: errorMessage.type(stF.name,S)
				}
			});
		})

		test("Should only call the deleteStream and next method when the database throw",async ()=>{
			process.env.deleteStream = JSON.stringify({ action:'reject' });

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(0);
			expect(endCall.length).toBe(0);
			expect(jsonCall.length).toBe(0);
			expect(nextCall.length).toBe(1);
			expect(deleteStreamCall.length).toBe(1);
			expect(nextCall[0].length).toBe(1);
		})

		test("Should return an 409 response when the database return an object with a property deleted set to false",async ()=>{
			let response = { deleted:false, error:null };
			process.env.deleteStream = JSON.stringify({ response });

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(deleteStreamCall.length).toBe(1);
			expect(statusCall[0][0]).toBe(409);
			expect(jsonCall[0][0]).toEqual(response);
		})
	})

	describe("Testing downloading stream song",()=>{
		let req,
		getStreamCall;

		beforeEach(()=>{
			req = createReq();
			req.query = { action:'download', [stF.name]:'banble' };
			getStreamCall = db.getStream.mock.calls;
			delete process.env.getStream;
		})

		test("Should return a 200 response and an object with an action property set to the value of SUB.ADD when the given parameter are correct and when the database find the stream",async ()=>{
			let name = req.query[stF.name],
			songName = 'malade',
			catName = 'myu',
			verses = ['un','deux'],
			song = { [stF.songName]:songName, [stF.verses]:verses },
			response = { data:[
				{ [stF.name]:name,  [stF.song]:song, [stF.catName]:catName }
			], error:null };
			process.env.getStream = JSON.stringify({ response });

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(getStreamCall.length).toBe(1);
			expect(getStreamCall[0][0]).toBe(name);
			expect(statusCall[0][0]).toBe(200);
			expect(jsonCall[0][0]).toEqual({ action:SUB.ADD, [stF.catName]:catName, [stF.songName]:songName, [stF.verses]: verses })
		})

		test("Should return a 200 response and an object with an action property set to the value of SUB.NOTHING when the given parameter are correct and the database return empty data",async ()=>{
			let name = req.query[stF.name];

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(getStreamCall.length).toBe(1);
			expect(getStreamCall[0][0]).toBe(name);
			expect(statusCall[0][0]).toBe(200);
			expect(jsonCall[0][0]).toEqual({ action:SUB.NOTHING })
		})

		test("Should only call the getStream and the next method when the database throw",async ()=>{
			process.env.getStream = JSON.stringify({ action:'reject'});

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(0);
			expect(endCall.length).toBe(0);
			expect(jsonCall.length).toBe(0);
			expect(nextCall.length).toBe(1);
			expect(getStreamCall.length).toBe(1);
			expect(nextCall[0].length).toBe(1);
		})

		test("Should return an 404 response when the data given are incorrect",async ()=>{
			req.query[stF.name] = true;

			await Stream()(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(getStreamCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
			expect(jsonCall[0][0]).toEqual({
				data:[],
				error:{
					[stF.name]: errorMessage.type(stF.name,S)
				}
			})
		})
	})
})

describe("Testing Waiters",()=>{
	beforeAll(()=>{
		jest.useFakeTimers();
	})
	afterAll(()=>{
		jest.useRealTimers();
	})

	describe("Testing adding",()=>{
		let req,
		socket,
		remoteAddress,
		remotePort,
		waiters,
		id;

		beforeEach(()=>{
			req= createReq();
			remoteAddress = '::1';
			remotePort = '80';
			socket = { remoteAddress, remotePort };
			waiters = {};
			id = `${remoteAddress}:${remotePort}`;
			req.socket = socket;
		})

		test("When the Router receive an res object with a status code that is falsy it should register the request to the waiter object and set a Timeout for the request",async ()=>{
			await Waiters(waiters)(req,res,next);

			expect(waiters[id]).toBe(res);
			expect(statusCall.length).toBe(0);
			expect(endCall.length).toBe(0);
			expect(jsonCall.length).toBe(0);
			expect(nextCall.length).toBe(0);

			jest.runOnlyPendingTimers();

			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(200);
			expect(jsonCall[0][0]).toEqual({
				action: SUB.NOTHING
			})
		})

		test("The timer set by the router should not call the status or json or end method of the response object if a response already has been sent",async ()=>{
			await Waiters(waiters)(req,res,next);

			expect(waiters[id]).toBe(res);
			expect(statusCall.length).toBe(0);
			expect(endCall.length).toBe(0);
			expect(jsonCall.length).toBe(0);
			expect(nextCall.length).toBe(0);

			res.writableEnded = true;
			jest.runOnlyPendingTimers();

			expect(statusCall.length).toBe(0);
			expect(endCall.length).toBe(0);
			expect(jsonCall.length).toBe(0);
			expect(nextCall.length).toBe(0);
		})
	})

	describe("Testing notifying user",()=>{
		let req,
		waiters = {},
		c1,
		c2,
		c1StatusCall,
		c2StatusCall,
		c1EndCall,
		c2EndCall,
		c1JsonCall,
		c2JsonCall;

		beforeEach(()=>{
			waiters = {
				'4':{
					status:jest.fn(()=> waiters['4']),
					json:jest.fn(()=> waiters['4']),
					end:jest.fn(()=> waiters['4'])
				},
				'5':{
					status:jest.fn(()=> waiters['5']),
					json:jest.fn(()=> waiters['5']),
					end:jest.fn(()=> waiters['5'])
				}
			};

			c1 = waiters['4'];
			c2 = waiters['5'];

			c1StatusCall = c1.status.mock.calls;
			c1EndCall = c1.end.mock.calls;
			c1JsonCall = c1.json.mock.calls;
			c2StatusCall = c2.status.mock.calls;
			c2EndCall = c2.end.mock.calls;
			c2JsonCall = c2.json.mock.calls;
		})
		describe("Testing notification on new stream",()=>{
			beforeEach(()=>{
				req = createReq();
				req.query = { action:'add' };
				req.body = {
					[stF.name]:'yuki'
				};
			})

			test("Should return a 200 response to all client that are on the waiters object when a new stream is added",async ()=>{
				res.statusCode = 201;
				await Waiters(waiters)(req,res,next);

				expect(statusCall.length).toBe(0);
				expect(endCall.length).toBe(0);
				expect(jsonCall.length).toBe(0);

				expect(c1StatusCall.length).toBe(1);
				expect(c1EndCall.length).toBe(1);
				expect(c1JsonCall.length).toBe(1);
				expect(c2StatusCall.length).toBe(1);
				expect(c2EndCall.length).toBe(1);
				expect(c2JsonCall.length).toBe(1);
				expect(c1StatusCall[0][0]).toEqual(200)
				expect(c1JsonCall[0][0]).toMatchObject({
					action:SUB.ADD, [stF.name]: req.body[stF.name]
				});
				expect(c1JsonCall[0][0].timestamp).toBeDefined();
				expect(c2StatusCall[0][0]).toBe(200);
				expect(c2JsonCall[0][0]).toMatchObject({
					action:SUB.ADD, [stF.name]: req.body[stF.name]
				})
				expect(c2JsonCall[0][0].timestamp).toBeDefined();
			})
		})

		describe("Testing notification on deleting stream",()=>{
			beforeEach(()=>{
				req = createReq();
				req.query = { action:'delete' };
				req.body = {
					[stF.name]:'yuki'
				};
			})

			test("Should return an 200 response to all client and an action object with a delete instruction",async ()=>{
				res.statusCode = 201;
				await Waiters(waiters)(req,res,next);

				expect(statusCall.length).toBe(0);
				expect(endCall.length).toBe(0);
				expect(jsonCall.length).toBe(0);

				expect(c1StatusCall.length).toBe(1);
				expect(c1EndCall.length).toBe(1);
				expect(c1JsonCall.length).toBe(1);
				expect(c2StatusCall.length).toBe(1);
				expect(c2EndCall.length).toBe(1);
				expect(c2JsonCall.length).toBe(1);
				expect(c1StatusCall[0][0]).toEqual(200)
				expect(c1JsonCall[0][0]).toMatchObject({
					action:SUB.DELETE, [stF.name]: req.body[stF.name]
				});
				expect(c1JsonCall[0][0].timestamp).toBeDefined();
				expect(c2StatusCall[0][0]).toBe(200);
				expect(c2JsonCall[0][0]).toMatchObject({
					action:SUB.DELETE, [stF.name]: req.body[stF.name]
				})
				expect(c2JsonCall[0][0].timestamp).toBeDefined();
			})
		})
	})
})

describe("Testing Subscription",()=>{
	describe("Testing registering subscriber",()=>{
		let req,
		subscribers,
		getStreamCall,
		socket,
		remoteAddress = '::1',
		remotePort = 9000;

		function reset(){
			getStreamCall = db.getStream.mock.calls;
		}

		beforeEach(()=>{
			req = createReq();
			req.query = { [stq.updating]:"false", [stF.name]:'manky' };
			socket = { remoteAddress, remotePort };
			req.socket = socket;

			getStreamCall = db.getStream.mock.calls;
			subscribers = {};
			delete res.statusCode;
		})

		test("Should call the getStream method when the parameter given are correct and the updating query is set to false and should return an action with an update directive when the response contain data", async ()=>{
			let songName = 'mike',
			catName = 'champa',
			index=20,
			stream = {
				[stF.name]:req.query[stF.name],
				[stF.song]:{
					[stF.songName]:songName,
					[stF.verses]:['one'],
					[stF.index]:index
				},
				[stF.catName]:catName
			},
			req2 = createReq();
			req2.query = req.query;
			req2.socket = req.socket;

			delete req2.query[stF.updating];

			process.env.getStream = JSON.stringify({
				response:{
					data:[stream], error:null
				}
			})

			await Subscription(subscribers)(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(getStreamCall.length).toBe(1);
			expect(statusCall[0][0]).toBe(200);
			expect(jsonCall[0][0]).toEqual({
				action:SUB.UPDATE, [stF.songName]:songName, [stF.catName]:catName, [stF.index]:index
			})
			expect(Object.keys(subscribers).length).toBe(0);

			jest.clearAllMocks(); pm(); reset();

			await Subscription(subscribers)(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(getStreamCall.length).toBe(1);
			expect(statusCall[0][0]).toBe(200);
			expect(jsonCall[0][0]).toEqual({
				action:SUB.UPDATE, [stF.songName]:songName, [stF.catName]:catName, [stF.index]:index
			})
			expect(Object.keys(subscribers).length).toBe(0);
		})

		test("Should call the getStream method when the parameter given are correct and the updating query is set to false and should return an action with an NOTHING directive when the response contain empty data", async ()=>{
			process.env.getStream = JSON.stringify({
				response:{
					data:[], error:null
				}
			})
			await Subscription(subscribers)(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(getStreamCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(200);
			expect(jsonCall[0][0]).toEqual({
				action:SUB.NOTHING
			})
			expect(Object.keys(subscribers).length).toBe(0);
		})

		test("Should register the client to the subscribers object when the updating property of the query object is set to true and should register an event handler on the close topic",async ()=>{
			req.query[stq.updating] = "true";
			jest.spyOn(res,'on');
			let spy = res.on;

			await Subscription(subscribers)(req,res,next);

			expect(statusCall.length).toBe(0);
			expect(endCall.length).toBe(0);
			expect(jsonCall.length).toBe(0);
			expect(nextCall.length).toBe(0);
			expect(getStreamCall.length).toBe(0);
			expect(spy.mock.calls.length).toBe(1);
			expect(subscribers[req.query[stF.name]]).toBeDefined();
			expect(subscribers[req.query[stF.name]][`${remoteAddress}:${remotePort}`]).toBe(res);
			expect(spy.mock.calls[0][0]).toBe('close');
		})

		test("Should remove the client response socket from the subscribers object when the client close the connection",async ()=>{
			let streamName = req.query[stF.name],
			id = `${socket.remoteAddress}:${socket.remotePort}`;
			req.query[stq.updating] = "true";

			await Subscription(subscribers)(req,res,next);

			expect(subscribers[streamName][id]).toBeDefined();

			res.emit('close');

			expect(subscribers).toEqual({});
		})

		test("Should return an 400 response and an error object when the data given are incorrect",async ()=>{
			let req2 = createReq();

			req.query = {};
			req2.query = { [stF.name]:true, [stq.updating]:'maman' };

			await Subscription(subscribers)(req,res,next);

			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(getStreamCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
			expect(jsonCall[0][0]).toEqual({
				error:errorMessage.missData()
			})
			expect(subscribers).toEqual({});

			jest.clearAllMocks(); pm(); reset();

			await Subscription(subscribers)(req2,res,next);

			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(jsonCall.length).toBe(1);
			expect(getStreamCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
			expect(jsonCall[0][0]).toEqual({
				error:{
					[stF.name]: errorMessage.type(stF.name,S),
					[stq.updating]: errorMessage.type(stq.updating,B)
				}
			})
			expect(subscribers).toEqual({});
		})
	})
	describe("Testing reaction to stream creation and update and modifying",()=>{
		let streamName = 'yok',
		subscribers = {
			[streamName]:{
				"1":{
					json:jest.fn(()=> subscribers[streamName]['1']),
					end: jest.fn(()=> subscribers[streamName]['1']),
					status: jest.fn(()=> subscribers[streamName]['1'])
				},
				"2":{
					json:jest.fn(()=> subscribers[streamName]['2']),
					end: jest.fn(()=> subscribers[streamName]['2']),
					status: jest.fn(()=> subscribers[streamName]['2'])
				}
			}
		},
		c1,
		c2,
		c1StatusCall,
		c1EndCall,
		c1JsonCall,
		c2StatusCall,
		c2EndCall,
		c2JsonCall,
		req,
		songName = 'mile',
		verses = ['shut'],
		index=10,
		catName = 'yamp';

		beforeEach(()=>{
			req = createReq();
			req.query = { action: '' };
			req.body = {
				[stF.name]:streamName,
				[stF.song]:{
					[stF.songName]:songName,
					[stF.verses]:verses,
					[stF.index]:index
				},
				[stF.catName]: catName
			}
			c1 = subscribers[streamName]['1'];
			c2 = subscribers[streamName]['2'];
			c1StatusCall = c1.status.mock.calls;
			c1EndCall = c1.end.mock.calls;
			c1JsonCall = c1.json.mock.calls;
			c2StatusCall = c2.status.mock.calls;
			c2EndCall = c2.end.mock.calls;
			c2JsonCall = c2.json.mock.calls;
		})

		test("Should return a response to the subscriber when a stream their are subscribed to is updated",async ()=> {
			res.statusCode = 201;
			req.query.action = 'update';
			let r = {
				action:SUB.UPDATE, [stF.songName]:songName, [stF.catName]:catName, [stF.index]:index, [stF.verses]:verses
			}
			await Subscription(subscribers)(req,res,next);

			expect(statusCall.length).toBe(0);
			expect(endCall.length).toBe(0);
			expect(jsonCall.length).toBe(0);
			expect(c1StatusCall.length).toBe(1);
			expect(c1EndCall.length).toBe(1);
			expect(c1JsonCall.length).toBe(1);
			expect(c2StatusCall.length).toBe(1);
			expect(c2EndCall.length).toBe(1);
			expect(c2JsonCall.length).toBe(1);
			expect(c1StatusCall[0][0]).toBe(200);
			expect(c1JsonCall[0][0]).toEqual(r)
			expect(c2StatusCall[0][0]).toBe(200);
			expect(c2JsonCall[0][0]).toEqual(r)
		})

		test("Should return a response to the subscriber when a stream their are subscribed to is deleted",async ()=>{
			res.statusCode = 201;
			req.query.action = 'delete';
			let r = {
				action:SUB.UNSUBSCRIBE, message:`The stream ${req.body[stF.name]} has finished`
			}
			await Subscription(subscribers)(req,res,next);

			expect(statusCall.length).toBe(0);
			expect(endCall.length).toBe(0);
			expect(jsonCall.length).toBe(0);
			expect(nextCall.length).toBe(1);
			expect(c1StatusCall.length).toBe(1);
			expect(c1EndCall.length).toBe(1);
			expect(c1JsonCall.length).toBe(1);
			expect(c2StatusCall.length).toBe(1);
			expect(c2EndCall.length).toBe(1);
			expect(c2JsonCall.length).toBe(1);
			expect(c1StatusCall[0][0]).toBe(200);
			expect(c1JsonCall[0][0]).toEqual(r)
			expect(c2StatusCall[0][0]).toBe(200);
			expect(c2JsonCall[0][0]).toEqual(r)
		})

		test("Should call the next method when the query contain an action with a property set to add",async ()=>{
			res.statusCode = 201;
			req.query.action = 'add';

			await Subscription(subscribers)(req,res,next);

			expect(statusCall.length).toBe(0);
			expect(endCall.length).toBe(0);
			expect(jsonCall.length).toBe(0);
			expect(nextCall.length).toBe(1);
			expect(c1StatusCall.length).toBe(0);
			expect(c1EndCall.length).toBe(0);
			expect(c1JsonCall.length).toBe(0);
			expect(c2StatusCall.length).toBe(0);
			expect(c2EndCall.length).toBe(0);
			expect(c2JsonCall.length).toBe(0);
		})
	})
})

describe('Testing Categorie',()=>{
	let req;

	describe("Testing getCategorie",()=>{
		beforeEach(()=>{
			req = createReq();
			req.query = {
				action:'get'
			}
		})

		test("Should call the db.getCategorie when the query received are okay, and should return a 200 response with an aray",async ()=>{
			let id = 'purple';

			req.query.id = id;

			await Categorie()(req,res,next);

			expect(jsonCall.length).toBe(1);
			expect(jsonCall[0][0]).toEqual({ data:[], error:null })
			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(getCatCall.length).toBe(1);
			expect(getCatCall[0].length).toBe(1);
			expect(statusCall[0][0]).toBe(200);
			expect(getCatCall[0][0]).toBe(id);
		})

		test("When call with missing query id the Router should return an 400 response with an error message and not call the getCategorie method",async ()=>{
			await Categorie()(req,res,next);

			expect(jsonCall.length).toBe(1);
			expect(jsonCall[0][0]).toEqual({ error: {
				message:errorMessage.missData()
			}});
			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(getCatCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
		})
	})
})

describe("Testing Song",()=>{
	let req;
	describe("Testing searchSong",()=>{
		beforeEach(()=>{
			req = createReq();
			req.query = {
				action:'search'
			}
		})

		test("Should call the searchSong method on the database with the query search term as the first argument and the last query term as the last if given when there are present",async ()=>{
			let req2 = {...req, query:{...req.query}};

			req.query = {...req.query, term:'plyiade'};
			req2.query = {...req2.query, term:'yuf', last:'plajva'};

			await Song()(req,res,next);

			expect(jsonCall.length).toBe(1);
			expect(jsonCall[0][0]).toEqual({data:[], error:null});
			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(searchCall.length).toBe(1);
			expect(searchCall[0].length).toBe(1);
			expect(statusCall[0][0]).toBe(200);
			expect(searchCall[0][0]).toBe(req.query.term)

			jest.clearAllMocks();
			pm();

			await Song()(req2,res,next);

			expect(jsonCall.length).toBe(1);
			expect(jsonCall[0][0]).toEqual({data:[], error:null});
			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(searchCall.length).toBe(1);
			expect(searchCall[0].length).toBe(2);
			expect(statusCall[0][0]).toBe(200);
			expect(searchCall[0]).toEqual([req2.query.term,req2.query.last])
		})

		test("Should not call the database searchSong method if there is no term query",async ()=>{

			await Song()(req,res,next);

			expect(jsonCall.length).toBe(1);
			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(searchCall.length).toBe(0);
			expect(statusCall[0][0]).toBe(400);
			expect(jsonCall[0][0]).toEqual({
				error:{
					message: errorMessage.invalid('query')
				}
			})
		})

		test("Should return a 500 response when the database throw an error",async ()=>{
			let error = { message:'KIKWIT' };

			process.env.searchSong = JSON.stringify({
				response: {error},
				action:'reject'
			});

			req.query.term = 'aplia';

			await Song()(req,res,next);

			expect(jsonCall.length).toBe(1);
			expect(statusCall.length).toBe(1);
			expect(endCall.length).toBe(1);
			expect(nextCall.length).toBe(0);
			expect(searchCall.length).toBe(1);
			expect(statusCall[0][0]).toBe(500);
			expect(jsonCall[0][0]).toEqual({error})
		})
	})
})