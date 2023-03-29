import db  from './utilis/dbClass.js';
import cantique  from './cantique.js';
import config  from './utilis/db.config.cjs';
import { nanoid } from 'nanoid';
import fs from 'fs';


const songs = cantique.Songs,
table = config.table,
cF = table.cat.fields,
sF = table.song.fields;

let songLength = songs.length,
song,
catId = '_iEYzp2HvqtDa_dz4RL-m',
inserted = 0;

fs.readFile('Book.js',{'encoding':'utf8'},async (err,data)=>{
	if(err){
		console.error(err);
	}
	else{
		data = JSON.parse(data);

		for(let catName in data){
			try{
				let but = data[catName],
				catId = nanoid(),
				r = await db.addCategorie({name:catName,id:catId});

				if(r.inserted){
					but.songs.forEach(async (song)=>{
						try{
							await db.addSong({name:song.name, verses:song.verses, catId})
							console.log("inserted song",song.name,'of',catName);
						}
						catch(e){
							if(e.name == 'ConditionalCheckFailedException'){
								return;
							}
							else{
								throw e;
							}
						}
						
					})
				}
				else{
					console.log("Categorie",catName,"not inserted");
				}
			}
			catch(e){
				if(e.name == 'ConditionalCheckFailedException'){
					continue;
				}
				throw e;
			}
		}
	}
})