import db from './dbClass.js';

async function killUnusedStream(){
	let payload = await db.getUnusedStreams().catch((error)=> error),
	data = payload.data;

	if(data.length){
		data.forEach(async (stream)=>{
			let r = await db.deleteStream(stream.name).catch((error)=> error);

			if(r.error){
				console.error("killUnusedStream eerror",r.error);
			}
			else{
				console.log("stream",stream.name,"purged");
			}
		})
	}
}

export default function purgeStream(){
	setInterval(()=>{
		killUnusedStream();
	},10000)
}