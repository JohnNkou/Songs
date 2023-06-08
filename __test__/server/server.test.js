import db from '../../utilis/dbClass.js';
import config from '../../utilis/db.config.cjs';
import { songs, streams, categories, addSongs, addCats, addStreams, addCatId, fetch } from '../../utilis/dev_utilis.js';
import { SUB } from '../../utilis/constant.cjs';
import { app, streamWaiter, streamSubscribers, StreamJest, SubscriptionJest }  from '../../index.js';
import messages from '../../utilis/message.cjs'

const errorMessage = messages.error;

var server,
{ table, filters } = config,
{ song, cat, stream } = table,
cF = cat.fields,
sF = song.fields,
stF = stream.fields,
stq = stream.query,
fil = filters;

beforeAll(async ()=>{
	server = app.listen(80);
	jest.useFakeTimers();
	addCatId(categories,songs);
})

afterAll(async ()=>{
	server.close();
	await db.dropAll();
})


describe("Testing Stream feature",()=>{
	var url,
	data;

	beforeEach(async ()=>{
		await db.initStream();
		url = "http://localhost/api/stream?action=add";
		data = {
			[stF.name]:'yuki',
			[stF.song]:{
				[stF.songName]:'jambak',
				[stF.verses]: ["Il etait une fois a l'osto"],
				[stF.index]:0
			},
			[stF.catName]:'puke'
		}
	})
	afterEach(async ()=>{
		await db.dropStream();
	})
	describe("Testing adding stream",()=>{
		test("Should add the stream to the stream database",async ()=>{
			jest.spyOn(db,'addStream');
			let spy = db.addStream,
			op = await fetch({url,data:JSON.stringify(data), method:'POST', type:'application/json'}),
			op2 = await db.getAllStreams(),
			op3 = await db.getStream(data[stF.name]);

			expect(op.response).toEqual({
				inserted:true, error:null
			})
			expect(op.res.statusCode).toBe(201);
			expect(op2.data.length).toBe(1);
			expect(op3.data[0]).toMatchObject(data);
		})
	})

	describe("Putting client in waiter List",()=>{
		var url;
		beforeEach(()=>{
			url = `http://localhost/api/stream?action=getAll&${fil.lastTime}=0`;
		})
		afterEach(()=>{
			jest.useFakeTimers();
		})
		afterAll(()=>{
			fetch.req.forEach((r)=>{
				r.abort();
			})
			fetch.req = [];
		})
		test("When the client try to receive a stream list and the database doesn't have any stream, the client should be put on the streamWaiter object",async ()=>{
			let f = fetch({ url }),
			op;

			jest.useRealTimers();

			await new Promise((resolve,reject)=>{
				let count = setInterval(()=>{
					if(StreamJest.mock.calls.length){
						clearInterval(count);
						resolve(true);
					}
				},2);
			});
			expect(StreamJest.mock.calls.length).toBe(1);
			await StreamJest.mock.results[0].value;
			expect(Object.keys(streamWaiter).length).toBe(1);
			jest.runOnlyPendingTimers();
			op = await f;

			expect(op.res.statusCode).toBe(200);
			expect(op.response).toEqual({ action:SUB.NOTHING });
			expect(Object.keys(streamWaiter).length).toBe(0);
			expect(Object.keys(streamSubscribers).length).toBe(0);
		})

		test("When the client send a request for a stream list and the getAllStreams return an non empty array the client should receive an instruction with a SUB.UPDATE action and a list of stream available since the time the client give in the query",async ()=>{
			await addStreams(db,streams);

			let op = await fetch({ url }),
			op2 = await db.getAllStreams({ [fil.lastTime]:0 }),
			streamss = op2.data.map((x)=> x[stF.name]);

			expect(op.response).toMatchObject({
				action:SUB.UPDATE, streams: streamss
			})
			expect(op.res.statusCode).toBe(200);
			expect(Object.keys(streamWaiter).length).toBe(0);
			expect(Object.keys(streamSubscribers).length).toBe(0);
		})

		test("When the are client who wait for new stream and a streamer add a new stream, a response with an action of SUB.ADD and the name of the stream should be return to each waiters",async ()=>{
			let url2 = 'http://localhost/api/stream?action=add',
			f = fetch({ url }),
			op,
			op2;

			jest.useRealTimers();

			await new Promise((resolve,reject)=>{
				let count = setInterval(()=>{
					if(StreamJest.mock.calls.length){
						clearInterval(count);
						resolve();
					}
				},2)
			})

			expect(StreamJest.mock.calls.length).toBe(1);

			op = await fetch({ url:url2, data:JSON.stringify(data), method:'POST', type:'application/json' });
			op2 = await f;

			expect(op.response).toEqual({
				inserted:true, error:null
			})
			expect(op.res.statusCode).toBe(201);
			expect(op2.response).toMatchObject({
				action:SUB.ADD, [stF.name]: data[stF.name]
			})
			expect(op2.res.statusCode).toBe(200);
			expect(Object.keys(streamWaiter).length).toBe(0);
			expect(Object.keys(streamSubscribers).length).toBe(0);

		})

		test("When there are waiters on stream and a streamer delete a stream each waiter should receive a response with an action SUB.DELETE and the name of the stream",async ()=>{
			await addStreams(db,streams);

			let date = (new Date(2023,3,24)).getTime(),
			url = `http://localhost/api/stream?action=getAll&${fil.lastTime}=${date}`,
			url2 = "http://localhost/api/stream?action=delete",
			body = { [stF.name]: streams[0][stF.name] },
			f = fetch({ url }),
			op,
			op2;

			jest.useRealTimers();

			await new Promise((resolve,reject)=>{
				let count = setInterval(()=>{
					if(StreamJest.mock.calls.length){
						clearInterval(count);
						resolve();
					}
				},2)
			})

			op = await fetch({ url: url2, data: JSON.stringify(body), method:'POST', type:'application/json' }),
			op2 = await f;

			expect(op.response).toEqual({
				deleted:true, error:null
			});
			expect(op.res.statusCode).toBe(201);
			expect(op2.response).toMatchObject({
				action:SUB.DELETE, [stF.name]: body[stF.name]
			})
			expect(op2.res.statusCode).toBe(200);
			expect(Object.keys(streamWaiter).length).toBe(0);
			expect(Object.keys(streamSubscribers).length).toBe(0);
		})
	})

	describe("Testing handling of subscriber",()=>{
		var url,
		url2,
		url3,
		stream = streams[0],
		name = stream[stF.name],
		song = stream[stF.song],
		songName = song[stF.songName],
		catName = stream[stF.catName],
		index = song[stF.index];

		beforeEach(()=>{
			url = "http://localhost/api/stream?action=update";
			url2 = `http://localhost/api/stream/subscribe?${stq.updating}=false&${stF.name}=${name}`;
			url3 = `http://localhost/api/stream?action=delete`;
		})
		afterEach(()=>{
			fetch.req.forEach((r)=> r.abort());
			fetch.req = [];
		})
		test("When a client send a subscribe request with an updating query set to false and the server getStream return an non empty array the client should have a response with an action set to SUB.UPDATE along with information about the stream",async ()=>{
			await addStreams(db,streams);

			let op = await fetch({ url:url2 });

			expect(op.response).toEqual({
				action:SUB.UPDATE, [stF.songName]:songName,
				[stF.catName]: catName, 
				[stF.index]: index
			})
			expect(op.res.statusCode).toBe(200);
			expect(Object.keys(streamWaiter).length).toBe(0);
			expect(Object.keys(streamSubscribers).length).toBe(0);
		})

		test("When a client send a subscribe request with an updating query set to false and the server getStream return an  empty array the client should have a response with an action set to SUB.NOTHING ",async ()=>{
			let op = await fetch({ url:url2 });

			expect(op.response).toEqual({
				action:SUB.NOTHING
			})
			expect(op.res.statusCode).toBe(200);
			expect(Object.keys(streamWaiter).length).toBe(0);
			expect(Object.keys(streamSubscribers).length).toBe(0);
		})

		test("When a streamer update his stream, his subscribers should receive a response with the action set to SUB.UPDATE along with the data updated",async()=>{
			await addStreams(db,streams);

			let url2 = `http://localhost/api/stream/subscribe?${stq.updating}=true&${stF.name}=${name}`,
			data = {
				[stF.name]:name,
				[stF.index]:3
			},
			f = fetch({ url:url2 }),
			op,
			op2;

			jest.useRealTimers();

			await new Promise((resolve,reject)=>{
				let count = setInterval(()=>{
					if(SubscriptionJest.mock.calls.length){
						clearInterval(count);
						resolve();
					}
				},2)
			});

			expect(streamSubscribers[name]).toBeDefined();
			expect(Object.keys(streamSubscribers[name]).length).toBe(1);

			op = await fetch({ url, data:JSON.stringify(data), method:'POST', type:'application/json' });

			expect(op.response).toEqual({
				updated:true, error:null
			})
			expect(op.res.statusCode).toBe(201);

			op2 = await f;

			expect(op2.response).toEqual({
				action:SUB.UPDATE, [stF.index]: data[stF.index]
			})
			expect(op2.res.statusCode).toBe(200);
			expect(Object.keys(streamSubscribers).length).toBe(0);
			expect(Object.keys(streamWaiter).length).toBe(0)
		});

		test("When a streamer delete his stream, his subscribers should receive a response with the action set to SUB.UNSUBSCRIBE along with a message",async()=>{
			await addStreams(db,streams);

			let url2 = `http://localhost/api/stream/subscribe?${stq.updating}=true&${stF.name}=${name}`,
			data = {
				[stF.name]:name
			},
			f = fetch({ url:url2 }),
			op,
			op2;

			jest.useRealTimers();

			await new Promise((resolve,reject)=>{
				let count = setInterval(()=>{
					if(SubscriptionJest.mock.calls.length){
						clearInterval(count);
						resolve();
					}
				},2)
			});

			expect(streamSubscribers[name]).toBeDefined();
			expect(Object.keys(streamSubscribers[name]).length).toBe(1);

			op = await fetch({ url:url3, data:JSON.stringify(data), method:'POST', type:'application/json' });

			expect(op.response).toEqual({
				deleted:true, error:null
			})
			expect(op.res.statusCode).toBe(201);

			op2 = await f;

			expect(op2.response).toEqual({
				action:SUB.UNSUBSCRIBE, message:`The stream ${name} has finished`
			})
			expect(op2.res.statusCode).toBe(200);
			expect(Object.keys(streamSubscribers).length).toBe(0);
			expect(Object.keys(streamWaiter).length).toBe(0)
		});
	})
})

describe("Testing Categorie",()=>{
	let url;

	beforeEach(async ()=>{
		url = 'http://localhost/api/Categorie'
		await db.initCategorie();
	})

	afterEach(async ()=>{
		await db.dropCategorie();
	})

	describe("Testing getting categorie record",()=>{
		beforeEach(async ()=>{
			await addCats(db,categories);
		})

		test("Should return an object with a data array containing the found category ",async ()=>{
			let op;

			url +=`?action=get&id=${categories[0].id}`;
			op = await fetch({url});

			expect(op.response).toMatchObject({
				data:[categories[0]],
				error:null
			})
			expect(op.res.statusCode).toBe(200);
		})

		test("Should return an error object when the id is not given",async ()=>{
			let op;

			url += '?action=get';
			op = await fetch({url});

			expect(op.response).toMatchObject({
				error:{
					message: errorMessage.missData()
				}
			})
			expect(op.res.statusCode).toBe(400);
		})
	})
})

describe('Testing Song',()=>{
	let url;

	beforeEach(async ()=>{
		url = 'http://localhost/api/Song'
		await db.initSong();
	})
	afterEach(async ()=>{
		await db.dropSong();
	})

	describe("Testing searching song",()=>{
		beforeAll(async ()=>{
			await addSongs(db,songs);
		})
		test("Should return an object with a data array containing found song with the given term when the query given are complete",async ()=>{
			let op;

			url +=`?action=search&term=${songs[0].name.slice(0,4)}`;
			op = await fetch({url});

			expect(op.response).toMatchObject({
				data:[songs[0]],
				error:null
			})
			expect(op.res.statusCode).toBe(200);
		})

		test("When no search term are given the server should return an 400 status code and an error message",async ()=>{
			let op;

			url +=`?action=search`;
			op = await fetch({url});

			expect(op.response).toEqual({
				error:{
					message:errorMessage.invalid('query')
				}
			});
			expect(op.res.statusCode).toBe(400);
		})
	})
})