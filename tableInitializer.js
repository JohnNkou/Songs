import db  from './utilis/dbClass.js';
import cantique  from './cantique.js';
import config  from './utilis/db.config.cjs';
import { nanoid } from 'nanoid';

const songs = cantique.Songs,
table = config.table,
cF = table.cat.fields,
sF = table.song.fields;

let songLength = songs.length,
song,
catId = '_iEYzp2HvqtDa_dz4RL-m',
inserted = 0;

try{
	try{
		await db.addCategorie({[cF.name]:'cantique', [cF.id]: catId});
	}
	catch(e){
		if(e.name != 'ConditionalCheckFailedException'){
			throw e;
		}
	}

	while(songLength--){
		song = songs[songLength];
		if(song.Text){
			console.log("Inserting",song.Text);
			try{
				await db.addSong({ [sF.name]: song.Text, [sF.verses]: song.Verses, [sF.catId]: catId });
				inserted++;
			}
			catch(e){
				if(e.name != 'ConditionalCheckFailedException')
					throw e;
			}
		}
	}

	console.log(inserted,"song inserted");
}
catch(e){
	console.log("BORD");
	console.log(e.message);
}