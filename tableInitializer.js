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
catId = nanoid(),
inserted = 0;

await db.dropAll();
await db.initAll();

await db.addCategorie({[cF.name]:'categorie', [cF.id]:catId});

while(songLength--){
	song = songs[songLength];
	if(song.Text){
		try{
			await db.addSong({ [sF.name]: song.Text, [sF.verses]: song.Verses, [sF.catId]: catId });
			inserted++;
		}
		catch(e){
			console.log(e.code, e.name);
			console.log(e.message);
			console.log("Couldn't insert song", song.Text);
		}
	}
}

console.log(inserted,"song inserted");