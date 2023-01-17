 import { spawn, fork } from 'child_process';

 let c = spawn("mysqld",[],{cwd:'/Users/flashbell/Node/Songs'});
 let locked;
 c.stderr.on('data',(data)=>{
 	data = data.toString();
 	if(/Unable\s+to\s+lock/i.test(data) && !locked){
 		locked = true;
 		console.log("Can't lock");
 		let killed = c.kill('SIGKILL');

 		console.log("Killed",killed,c.pid);
 	}
 	if(data.indexOf('ready for connections') != -1)
 		process.send({ready:true});
 });
 c.on('error',(e)=>{
 	console.log("childProcess Error",e);
 })
 c.on('close',(closed)=>{
 	process.send({terminated:true});
 })