import mysql  from 'mysql'
import { appState } from './BrowserDb.cjs'
import { databasesOptions } from './constant.cjs'

const error = {
	connectionrefused: 'ECONNREFUSED',

}

const { host, user, password, database } = databasesOptions;
export function createDb(){
	let db = mysql.createConnection({host,user,password,database});

	this.handleFatalError = (db)=>{
		db.on('error',(err)=>{
			if(err.fatal){

				console.error("fatal Error",err);
				console.error("trying to reconnect");
				this.reconnect();
			}
			else{
				console.error(err);
			}
		})
	}
	this.handleFatalError(db);

	this.query = function(){
		db.query.apply(db,arguments);
	}
	this.reconnect = function(){
		db = mysql.createConnection({host,user,password,database});
		console.log("reconnecting database");
		db.connect((err)=>{
			if(err){
				console.error("couldnt reconnect");
				console.error(err);
			}
			else{
				console.log("connection succedded");
			}
		})
		this.handleFatalError(db);
	}
	this.connect = function(){
		db.connect.apply(db,arguments);
	}

	this.on = function(){
		db.on.apply(db,arguments);
	}
	this.end = function(){
		db.end.apply(db,arguments);
	}
}

let mamp = new createDb();
mamp.connect((err)=>{
	if(err){
		return console.log("couldnt connect");
	}
	console.log('connection succedded');
})