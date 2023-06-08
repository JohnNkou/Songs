import { nanoid } from 'nanoid';
import db from '../../utilis/dbClass.js';
import { addSongs, songs, addCats, categories, addCatId, addStreams, streams } from '../../utilis/dev_utilis.js';
import config from '../../utilis/db.config.cjs';

const { cat,song,stream } = config.table,
cF = cat.fields, sF = song.fields, stF = stream.fields,
fil = config.filters; 

describe("Testing Categories",()=>{
	beforeEach(async ()=>{
		await db.initCategorie();
	})
	afterEach(async ()=>{
		await db.dropCategorie();
	})

	describe("Testing addCategorie",()=>{
		test("Should add the given category to the database",async ()=>{
			let ids = [nanoid(), nanoid()],
			names = ['Jeanpy', 'Yor'],
			op = await db.addCategorie({[cF.name]:names[0],[cF.id]:ids[0]}),
			op2 = await db.addCategorie({ [cF.name]:names[1],[cF.id]:ids[1]}),
			op3 = await db.getAllCategorie(),
			op4 = await db.getCategorie(ids[0]),
			op5 = await db.getCategorie(ids[1]);

			expect(op.inserted).toBe(true);
			expect(op2.inserted).toBe(true);
			expect(op.id).toBe(ids[0]);
			expect(op2.id).toBe(ids[1]);
			expect(op3.data.length).toBe(2);
			expect(op4.data.length).toBe(1);
			expect(op5.data.length).toBe(1);
			expect(op4.data[0]).toEqual({
				[cF.id]:ids[0], [cF.name]: names[0].toLowerCase()
			})
			expect(op5.data[0]).toEqual({
				[cF.id]:ids[1], [cF.name]: names[1].toLowerCase()
			})
		})
	})

	describe("Testing getCategorie",()=>{
		test("Should return an array with one item when the given category exist",async ()=>{
			await addCats(db,categories);

			let op = await db.getCategorie(categories[0][cF.id]),
			op2 = await db.getCategorie(categories[1][cF.id]),
			op3 = await db.getCategorie('sdfoiudofiso');

			expect(op.data.length).toBe(1);
			expect(op2.data.length).toBe(1);
			expect(op3.data.length).toBe(0);
			expect(op.data[0]).toMatchObject(categories[0]);
			expect(op2.data[0]).toMatchObject(categories[1]);
		})
	})

	describe("Testing getAllCategorie",()=>{
		test("Should return an array of the given category in the database",async ()=>{
			await addCats(db,categories);

			let op = await db.getAllCategorie();

			expect(op.data.length).toBe(categories.length);
		})
		test("Should apply the filter given in the parameter in the result",async ()=>{
			await addCats(db,categories);

			let op = await db.getAllCategorie({Limit:3}),
			op2 = await db.getAllCategorie({Limit:3, last:op.last});

			expect(op.data.length).toBe(3);
			expect(op2.data.length).toBe(1);
			expect(op.last).toBeDefined();
		})
	})

	describe("Testing updateCategorie",()=>{
		beforeAll(async ()=>{
			await db.initSong();
		})
		afterAll(async ()=>{
			await db.dropSong();
		})
		test("Should return an object with a update property set to true when the categorie updated",async ()=>{
			await addCats(db,categories);
			let cats = (await db.getAllCategorie()).data.slice(0,2);
			await addCatId(cats,songs);
			await addSongs(db,songs);

			let names = ['Grace','Tortue'],
			op = await db.updateCategorie(cats[0].id, { [cF.name]: names[0] }),
			op2 = await db.updateCategorie(cats[1].id, { [cF.name]: names[1] }),
			op3 = await db.getCategorie(cats[0].id),
			op4 = await db.getCategorie(cats[1].id);

			expect(op.updated).toBe(true);
			expect(op2.updated).toBe(true);
			expect(op3.data.length).toBe(1);
			expect(op4.data.length).toBe(1);
			expect(op3.data[0]).toMatchObject({[cF.name]:names[0].toLowerCase()});
			expect(op4.data[0]).toMatchObject({[cF.name]:names[1].toLowerCase()});
		})
	})

	describe("Testing deleteCategorie",()=>{
		beforeAll(async ()=>{
			await db.initSong();
		})
		afterAll(async ()=>{
			await db.dropSong();
		})
		test("Should remove the given category when it's in the database",async ()=>{
			await addCats(db,categories);
			let cats = (await db.getAllCategorie()).data;
			await addCatId(cats,songs);
			await addSongs(db,songs);

			let op = await db.removeCategorie(cats[0][cF.id]),
			op2 = await db.removeCategorie(cats[1][cF.id]),
			op3 = await db.removeCategorie('malakYonyon'),
			op4 = await db.getCategorie(cats[0][cF.id]),
			op5 = await db.getCategorie(cats[1][cF.id]),
			op6 = await db.getAllSongs({ catId: cats[0][cF.name] })

			expect(op.deleted).toBe(true);
			expect(op2.deleted).toBe(true);
			expect(op3.deleted).toBe(false);
			expect(op3.exist).toBe(false);
			expect(op4.data.length).toBe(0);
			expect(op5.data.length).toBe(0);
			expect(op6.data.length).toBe(0);
		})
	})
})

describe("Testing Songs",()=>{
	let cats;
	beforeAll(async ()=>{
		await db.initCategorie();
		await addCats(db,categories);
		let catLength, songLength,
		i=0;

		cats = (await db.getAllCategorie()).data.slice(0,2);
		catLength = cats.length;
		songLength = songs.length;

		while(i < songLength){
			songs[i][sF.catId] = cats[i % catLength][cF.id];
			i++;
		}
	})
	afterAll(async ()=>{
		await db.dropCategorie();
	})
	describe("Testing addSong",()=>{
		beforeEach(async ()=>{
			await db.initSong();
		})
		afterEach(async ()=>{
			await db.dropSong();
		})
		test("Should return an Object with an inserted option set to true when the operation success",async ()=>{
			let data = { [sF.name]:'Champa', [sF.verses]:[
				"Tout est une quesino de joie et de choise",
				"Nous ne pouvons tous pas arrive aux meme conclusion",
				"Travialler pour le resultat" 
				], [sF.catId]:cats[0][cF.id]},
			op = await db.addSong(data),
			op2 = await db.getAllSongs({ catId:cats[0][cF.id] });

			expect(op.inserted).toBe(true);
			expect(op2.data.length).toBe(1);
			expect(op2.data[0]).toMatchObject({...data, [sF.name]: data[sF.name].toLowerCase()});
		})
	})

	describe("Testing getSong",()=>{
		beforeAll(async ()=>{
			await db.initSong();
		})
		afterAll(async ()=>{
			await db.dropSong();
		})
		test("Should return the record with the given name",async ()=>{
			await addSongs(db,songs);

			let op = await db.getSong(songs[0][sF.name],songs[0][sF.catId]),
			op2 = await db.getSong(songs[1][sF.name],songs[1][sF.catId]);

			expect(op.data.length).toBe(1);
			expect(op2.data.length).toBe(1);
			expect(op.data[0]).toMatchObject(songs[0]);
			expect(op2.data[0]).toMatchObject(songs[1]);
		})
	})

	describe("Testing getAllSongs",()=>{
		beforeAll(async ()=>{
			await db.initSong();
		})
		afterAll(async ()=>{
			await db.dropSong();
		})

		test("Should return the songs associated with the given category",async ()=>{
			await addSongs(db,songs);
			let op = await db.getAllSongs({ [sF.catId]: cats[0][cF.id] }),
			op2 = await db.getAllSongs({ [sF.catId]: cats[1][cF.id] }),
			op3 = await db.getAllSongs({ [sF.catId]: cats[0][cF.id], limit:1}),
			op4 = await db.getAllSongs({ [sF.catId]: cats[0][cF.id], limit:1, last:op3.last }),
			op5 = await db.getAllSongs({ [sF.catId]: cats[0][cF.id], limit:1, last:op4.last }),
			s1 = songs.filter((song)=> song[sF.catId] == cats[0][cF.id]).sort((x,y)=>{
				if(x[sF.name] < y[sF.name])
					return -1
				return 1;
			}),
			s2 = songs.filter((song)=> song[sF.catId] == cats[1][cF.id]).sort((x,y)=>{
				if(x[sF.name] < y[sF.name])
					return -1;
				return 1;
			});

			expect(op.data.length).toBe(s1.length);
			expect(op2.data.length).toBe(s2.length);
			expect(op3.data.length).toBe(1);
			expect(op4.data.length).toBe(1);
			expect(op5.data.length).toBe(0);
			expect(op.data).toMatchObject(s1);
			expect(op2.data).toMatchObject(s2);
			expect(op.last).not.toBeDefined();
			expect(op2.last).not.toBeDefined();
			expect(op3.last).toBeDefined();
			expect(op4.last).toBeDefined();
			expect(op5.last).not.toBeDefined();
		})
	})

	describe("Testing updateSong",()=>{
		beforeEach(async ()=>{
			await db.initSong();
		})
		afterEach(async ()=>{
			await db.dropSong();
		})
		test("Should return an object with an updated property set to true when the update succeded",async ()=>{
			await addSongs(db,songs);

			let name = 'Plague',
			verses = [['puig','tong'],['mile']],
			op = await db.updateSong(songs[0][sF.name], songs[0][sF.catId], { [sF.verses]: verses[0], name }),
			op2 = await db.updateSong(songs[1][sF.name], songs[1][sF.catId], { [sF.verses]: verses[1] }),
			op3 = await db.getSong(name.toLowerCase(),songs[0][sF.catId]),
			op4 = await db.getSong(songs[1][sF.name],songs[1][sF.catId]),
			op5 = await db.getSong(songs[0][sF.name],songs[0][sF.catId]);

			expect(op).toEqual({ updated:true, error:null });
			expect(op2).toEqual({ updated:true, error:null });
			expect(op3.data[0]).toMatchObject({ [sF.name]:name.toLowerCase(), [sF.verses]: verses[0] });
			expect(op4.data[0].verses).toEqual(verses[1]);
			expect(op5.data.length).toBe(0);
		})

		test("Should return an object with an updated property set to false when the given key don't exist",async ()=>{	
			let op = await db.updateSong('mich',songs[0][sF.catId],{ [sF.name]:'yopiti' }),
			op2 = await db.updateSong('clak', songs[1][sF.catId], { [sF.verses]:['Yamak'] });

			expect(op).toEqual({ updated:false, error:null });
			expect(op2).toEqual({ updated:false, error:{
				name:'ConditionalCheckFailedException'
			} });
		})
	})

	describe("Testing removeSong",()=>{
		beforeEach(async ()=>{
			await db.initSong();
		})
		afterEach(async ()=>{
			await db.dropSong();
		})
		test("Should remove the given song from the database",async ()=>{
			await addSongs(db,songs);
			let op = await db.removeSong(songs[0][sF.name],songs[0][sF.catId]),
			op2 = await db.removeSong(songs[1][sF.name],songs[1][sF.catId]),
			op3 = await db.getSong(songs[0][sF.name],songs[0][sF.catId]),
			op4 = await db.getSong(songs[1][sF.name],songs[1][sF.catId]);

			expect(op).toMatchObject({ deleted:true, error:null })
			expect(op2).toMatchObject({ deleted:true, error:null })
			expect(op3.data.length).toBe(0);
			expect(op4.data.length).toBe(0);
		})
	})

	describe("Testing searchSong",()=>{
		beforeAll(async ()=>{
			await db.initSong();
		})

		afterAll(async ()=>{
			await db.dropSong();
		})

		test("Should return the song that match the given term",async ()=>{
			await addSongs(db,songs);

			let op = await db.searchSong(songs[0].name.slice(0,4)),
			op2 = await db.searchSong(songs[1].name.slice(0,4));

			expect(op.data.length).toBe(1);
			expect(op2.data.length).toBe(1);

			expect(op.data[0]).toMatchObject(songs[0]);
			expect(op2.data[0]).toMatchObject(songs[1]);
		})
	})
})

describe("Testing Stream",()=>{
	describe("Testing addStream",()=>{
		beforeEach(async ()=>{
			await db.initStream();
		})
		afterEach(async ()=>{
			await db.dropStream();
		})

		test("The given data should be added to the database when the operation succedd",async ()=>{
			let payloads = [{[stF.name]:'Ponk',[stF.catName]:'Yor',[stF.song]:{
			[stF.songName]:'yapiti',[stF.verses]:['one','two','three'], [stF.index]:0
			} }, {[stF.name]:'Yamada',[stF.catName]:'dumb',[stF.song]:{[stF.songName]:'joy',[stF.verses]:['clark','dump'],[stF.index]:0 } } ],
			op = await db.addStream(payloads[0]),
			op2 = await db.addStream(payloads[1]),
			op3 = await db.getStream(payloads[0][sF.name].toLowerCase()),
			op4 = await db.getStream(payloads[1][sF.name].toLowerCase());

			expect(op.inserted).toBe(true);
			expect(op2.inserted).toBe(true);
			expect(op3.data.length).toBe(1);
			expect(op4.data.length).toBe(1);
			expect(op3.data[0]).toMatchObject({...payloads[0],[stF.name]:payloads[0][stF.name].toLowerCase(), [stF.catName]: payloads[0][stF.catName].toLowerCase()});
			expect(op4.data[0]).toMatchObject({...payloads[1], [stF.name]: payloads[1][stF.name].toLowerCase()});
		})

		test("Trying to add an item already in the database should return an object with an inserted property set to false and an exist set to true",async ()=>{
			await addStreams(db,streams.slice(0,1));

			let op = await db.addStream(streams[0]);

			expect(op.inserted).toBe(false);
			expect(op.exist).toBe(true);
		})
	})

	describe("Testing getAllStream",()=>{
		beforeEach(async ()=>{
			await db.initStream();
		})
		afterEach(async ()=>{
			await db.dropStream();
		})

		test("Should retrieve all the stream in the database",async ()=>{
			await addStreams(db,streams);
			let op = await db.getAllStreams(),
			op2 = await db.getAllStreams({[fil.limit]:1}),
			op3 = await db.getAllStreams({ [fil.limit]:1, [fil.last]:op2.last }),
			op4 = await db.getAllStreams({ [fil.limit]:1, [fil.last]:op3.last }),
			op5 = await db.getAllStreams({ [fil.lastTime]:Date.now() }),
			op6 = await db.getAllStreams({ [fil.lastTime]:(new Date('2010',3,10)).getTime() });

			expect(op.data.length).toBe(streams.length);
			expect(op2.data.length).toBe(1)
			expect(op3.data.length).toBe(1);
			expect(op4.data.length).toBe(0);
			expect(op5.data.length).toBe(0);
			expect(op6.data.length).toBe(streams.length);
			expect(op.data[0]).toMatchObject(streams[1]);
			expect(op.data[1]).toMatchObject(streams[0]);
			expect(op2.last).toBeDefined();
			expect(op3.last).toBeDefined();
			expect(op4.last).not.toBeDefined();
		})
	})

	describe("Testing getStream",()=>{
		beforeEach(async ()=>{
			await db.initStream();
		})
		afterEach(async ()=>{
			await db.dropStream();
		})

		test("Should return the record with the given stream name",async ()=>{
			await addStreams(db,streams);
			let op = await db.getStream(streams[0][sF.name]),
			op2 = await db.getStream(streams[1][sF.name]),
			op3 = await db.getStream('mach___sdfoi');

			expect(op.data.length).toBe(1);
			expect(op2.data.length).toBe(1);
			expect(op3.data.length).toBe(0);
			expect(op.data[0]).toMatchObject(streams[0]);
			expect(op2.data[0]).toMatchObject(streams[1]);
		})
	})

	describe("Testing updateStream",()=>{
		beforeEach(async ()=>{
			await db.initStream();
		})
		afterEach(async ()=>{
			await db.dropStream();
		})

		test("Should update the stream with the given name",async ()=>{
			await addStreams(db,streams);
			let payload = [{
			[stF.catName]:'philif',
			[stF.song]:{
				[stF.name]:'pygy',
				[stF.verses]:['vamp','damp','kyrs']
				},
			[stF.index]:3
			},{
			[stF.index]:1
			}],
			op = await db.updateStream(streams[0][sF.name],payload[0]),
			op2 = await db.updateStream(streams[1][sF.name],payload[1]),
			op3 = await db.getStream(streams[0][sF.name]),
			op4 = await db.getStream(streams[1][sF.name]);

			expect(op.updated).toBe(true);
			expect(op2.updated).toBe(true);
			expect(op3.data[0].song).toEqual(payload[0].song);
			expect(op3.data[0].catName).toEqual(payload[0].catName);
			expect(op4.data[0].song.index).toBe(payload[1].index);
		})

		test("When given incorrect data or a key that don't exist the function should return an object with an error message and an updated property set to false",async ()=>{
			await addStreams(db,streams);

			let op = await db.updateStream('malak', {[stF.index]:1 }),
			op2 = await db.updateStream(streams[0][sF.name], {[stF.catName]:'yuki'});

			expect(op.updated).toBe(false);
			expect(op.exist).toBe(false);
			expect(op2.updated).toBe(false);
			expect(op2.error).toEqual({
				message:"catName should be given with a song"
			})
		})
	})

	describe("Testing deleteStream",()=>{
		beforeEach(async ()=>{
			await db.initStream();
		})
		afterEach(async ()=>{
			await db.dropStream();
		})

		test("Should remove the given stream from the database when it exist",async ()=>{
			await addStreams(db,streams);

			let op = await db.deleteStream(streams[0][sF.name]),
			op2 = await db.deleteStream(streams[1][sF.name]),
			op3 = await db.deleteStream('honk'),
			op4 = await db.getStream(streams[0][sF.name]),
			op5 = await db.getStream(streams[1][sF.name])

			expect(op.deleted).toBe(true);
			expect(op2.deleted).toBe(true);
			expect(op3.deleted).toBe(false);
			expect(op3.exist).toBe(false);
			expect(op4.data.length).toBe(0);
			expect(op5.data.length).toBe(0);
		})
	})
})