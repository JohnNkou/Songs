import mysql from 'mysql'
import * as C from './db/data.js'
import * as setupFunction from './db/setup.js';

const db = mysql.createConnection({
	host:'localhost',
	database: 'Songs',
	user:'Abel',
	password:'Abel'
})

let a = [];

for(let fName in setupFunction){
	a.push(setupFunction[fName]({db,...C}).then((r)=>{
		console.log(fName,"setup happened successfully");
	}).catch((e)=>{
		console.log(fName,"setup failed",e);
	}))
}

Promise.all(a).then(()=> db.end());
