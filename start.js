import { app } from './index.js';
import app2 from './update.js';

const PORT = process.env.PORT || 80,
server = app.listen(PORT);

Object.defineProperty(app,'__customServer',{
	enumerable:false,
	writable:false,
	configurable:false,
	readable:false,
	value: server
})

if(process.send){
	process.send({ started: true });
	process.on('message',(payload)=>{
		if(payload.close){
			console.log("Closing server",process.pid);
			process.send({ closed:true });
			setTimeout(()=>{
				console.log("process exit", process.pid);
				process.exit(0);
			},30000)
		}
		else{
			console.error("Bad payload",payload);
		}
	})
}
else{
	app2.listen(8044);
}