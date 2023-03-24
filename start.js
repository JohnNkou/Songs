import { app } from './index.js';

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
	console.log("process",process.pid,"started");
	process.send({ started: true });
}