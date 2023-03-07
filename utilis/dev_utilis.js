import { nanoid } from 'nanoid';
import { EventEmitter } from 'events';
import http from 'http';

export async function addSongs(db,songs){
	let i=0,
	songLength = songs.length;

	while(i < songLength){
		await db.addSong(songs[i++]);
	}
}
export async function addCats(db,cats){
	let i=0,
	catLength = cats.length;

	while(i < catLength){
		await db.addCategorie({...cats[i++],id:nanoid()});
	}
}

export async function addStreams(db,streams){
	let i=0,
	sLength = streams.length;

	while(i < sLength){
		await db.addStream(streams[i++]);
	}
}
export async function addCatId(cats,songs){
	let catLength = cats.length,
	songLength = songs.length,
	i=0;

	while(i < songLength){
		songs[i]['catId'] = cats[i % catLength]['id'];
		i++;
	}
}
export function validator(is){
	let alfaNumPattern = /^[a-z0-9\sàèéôö'"-_]+$/i,
	songNamePattern = /^[a-z0-9\s'"_èéàô!îï:ç(),\-?#.Œ–]+$/i,
	mailPattern = /^[a-zA-Z][\d\w_]*@[\d\w_-]+(\.[^.\W]+)+$/i,
	toString = (x)=> Object.prototype.toString.call(x);

	this.Number = (data)=>{
		return toString(1) === toString(data) && data == data;
	}
	this.Object = (data)=>{
		return toString({}) === toString(data);
	}
	this.String = (data)=>{
		return toString('l') === toString(data);
	}
	this.Boolean = (data)=>{
		return toString(true) === toString(data);
	}
	this.NotEmpty = (data)=>{
		return (this.String(data))? data.length: this.isDefined(data);
	}
	this.IsMail = (data)=>{
		return mailPattern.test(data);
	}
	this.isDefined = (data)=>{
		return toString(undefined) !== toString(data);
	}
	this.Between = (data,l1,l2)=>{
		return this.Number(data) &&  data >= l1 && data <= l2
	}
	this.GreaterThan = (data,n)=>{
		if(this.String(data)){
			data = data.length;
		}
		if(this.Array(data)){
			data = data.length;
		}
		return this.Number(data) && data > n;
	}
	this.LessThan = (data,n)=>{
		if(this.String(data)){
			data = data.length;
		}
		if(this.Array(data)){
			data = data.length;
		}
		return this.Number(data) && data < n
	}
	this.IsAlphaNumeric = (data)=>{
		return alfaNumPattern.test(data);
	}
	this.LengthIs = (data,n)=>{
		data = String(data);
		return data.length == n;
	}
	this.IsIn = (data,sack)=>{
		return (data in sack);
	}
	this.Array = (data)=>{
		return toString([]) === toString(data);
	}
	this.ArrayOfNumber = (data)=>{
		return this.Array(data) && data.every((x)=> this.Number(x))
	}
	this.ArrayOfAlphaNumeric = (data)=>{
		return this.Array(data) && data.every((d)=> this.IsAlphaNumeric(d));
	}
	this.hasValidSongName = (data)=>{
		return songNamePattern.test(data);
	}
	this.MatchExpression = (data,express)=>{
		return express.test(data);
	}
}
export function check(payloads,constraint,validator,transformer,action=()=>{}){
	let errors = {},
	miss = 0,
	p2 = {...payloads};

	if(!Object.keys(payloads).length){
		errors.message = 'No data given';

		return {miss,errors};
	}

	for(var cName in constraint){
		let c = constraint[cName],
		current = payloads[cName],
		i,
		vName = c.validate.names,
		vLength = vName.length,
		vAction,
		error,
		data,
		v;

		if(validator.isDefined(current)){
			delete p2[cName];

			for(i=0; i < vLength; i++){
				v = vName[i];
				data = [current, ...(v[1].data || [])]
				vAction = v[1].action;

				if(!validator[v[0]].apply(this,data)){
					error = v[1].error;
					break;
				}
				else if(vAction){
					payloads[cName] = current =  transformer[vAction](current);
				}
			}

			if(!error){
				action(cName,current);
			}
			else
				errors[cName] = error;
		}
		else if(c.required){
			errors[cName] = c.required
		}
	}

	miss = Object.keys(p2).length;

	return {miss,errors};
}

export function transformer(is){
	if(arguments.length && Object.prototype.toString.call(is) == Object.prototype.toString.call({})){
		this.lower = (data)=>{
			if(is.String(data))
				return data.toLowerCase();

			throw Error('The given data is not a string');
		}
	}
	else if(!arguments.length){
		throw Error('No argument given');
	}
	else
		throw Error('The given argument should be an objet')
}

export const songs = [
	{ name:'malayi', verses:['tample','sardine','mellow','Hupiki','tanderm']},
	{ name:'junior', verses:['lakis','champa','durban'] },
	{ name:'helm', verses:['tampi','donalan','clerk'] },
	{ name:'pig', verses:['mihn','don']}
];
export const categories = [
	{ name:'cantique' },
	{ name:'individual' },
	{ name:'hymn' },
	{ name:'tarzan' }
];
export const streams = [
	{ 
		name:'pako', 
		catName:'pak',
		song:{
			name:'mileston',
			verses:['youpik','santam','dompeg'],
			index:0
	} },
	{
		name:'yuke',
		catName:'youth', 
		song:{
			name:'ballad',
			verses:['mandemset','cancret','yupiki'],
			index:0
		}
	}
]

export function createReq(){
	let req = new EventEmitter();
	req.body = {};
	req.headers = {};

	return req;
}
export function fetch({url,data,type,method,port}){
	return new Promise((resolve,reject)=>{
		var options = { headers:{} },
		req;

		if(method){
			options['method'] = method;
		}
		if(port){
			options['port'] = port;
		}
		if(type){
			options['headers']['content-type'] = type;
		}

		req = http.request(url,options,(res)=>{
			let data="";
			res.on('data',(chunk)=>{
				data += chunk;
			})
			res.on('end',()=>{
				if(res.headers['content-type'] && res.headers['content-type'].indexOf('json') != -1){
					data = JSON.parse(data);
				}
				resolve({res,response:data});
			})
		});
		req.on('error',reject);
		req.on('timeout',()=>{
			reject({name:"Timetout", message:"Request timeouted"});
		})

		if(data){
			req.end(data);
		}
		else{
			req.end();
		}
		fetch.req.push(req);
	})
}
fetch.req = [];