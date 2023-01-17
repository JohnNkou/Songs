import fs from 'fs';
import { is } from './BrowserDb.cjs';

export default (store)=>{
	return (req,res)=>{
		let {c,l} = req.query,
		Categories = store.Categories,
		onlineSongs = store.onlineSongs,
		catId = Categories.indexOf(c),
		songs = onlineSongs[catId],
		songsLength = songs.length;

		console.log("songs length",songs.length,l);

		l = parseInt(l);
		if(catId == -1 || !is.Number(l)){
			res.status(404).end();
		}
		else if(songsLength <= l){
			res.json({full:true});
		}
		else{
			let extend = l+300,
			rsongs = songs.slice(l,extend);		

			res.json({full: (songsLength < extend), songs:rsongs})
		}
	}
}

