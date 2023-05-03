import options from './db.js';
import { CreateTableCommand, DeleteTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { nanoid } from 'nanoid';
import { PutCommand, UpdateCommand, DeleteCommand, GetCommand, ScanCommand, TransactWriteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import config from './db.config.cjs';
import { songPattern } from './pattern.js';
import fs from 'fs';

const { song,cat,stream,catdef,songdef,streamdef } = config.table,
cF = cat.fields,
sF = song.fields,
stF = stream.fields,
cTableName = catdef.TableName,
sTableName = songdef.TableName,
stTableName = streamdef.TableName,
fil = config.filters,
testing = process.env.NODE_ENV == 'test';


function DoUntilLast(list,operation,payloads){
	return operation(payloads).then((response)=>{
		if(response.data.length){
			list.push(...response.data);
			if(response.last){
				payloads.last = response.last;
				return DoUntilLast(list,operation,payloads);
			}
			else{
				response.Items = list;
				return response;
			}
		}
		else{
			response.Items = list;
			return response;
		}
	})
}

function d({getClient,getClientD}){
	let client = getClient(),
	clientD = getClientD(client),
	badSongName = new RegExp(`[^${songPattern}]`,'gi');

	function addResponse(error=null){
		return {
			inserted: (error)? false:true,
			error
		}
	}
	function getResponse(data,error=null){
		return {
			data: (data)?data:[],
			error
		}
	}
	function updResponse(data,error=null){
		return {
			updated: (data && Object.keys(data.Attributes).length)? true:false,
			error
		}
	}
	function remResponse(data,error=null){
		return{
			deleted: (data && data.Attributes && Object.keys(data.Attributes).length)? true:false,
			old: data && data.Attributes,
			error
		}
	}

	async function tableInitializationHandler(status,TableName){
		let c, n = 10,r;

		switch(status){
			case 'ACTIVE':
				return true;
			case 'CREATING':
				return await new Promise((resolve,reject)=>{
					c = setInterval(async ()=>{
						r = await client.send(new DescribeTableCommand({TableName}));

						if(r.Table.TableStatus == 'ACTIVE'){
							clearInterval(c);
							return resolve(true);
						}
						if(!n--){
							clearInterval(c);
							return reject("Maximum time waiting for "+TableName+" creation exceeded");
						}
						console.log("Left retrying",n);
					},5000)
				});
				break;
			default:
				throw Error("Unwanted table status for table "+TableName+" :"+status);
		}
	}
	this.newClient = ({getClient,getClientD})=>{
		client = getClient();
		clientD = getClientD(client);
	}
	this.initialized = Promise.resolve(false);
	this.initAll = async ()=>{
		try{
			let response = await Promise.all([this.initCategorie(),this.initSong(), this.initStream()]);
			console.log("Initialized",response);
			return {
				initialized:true,
				response
			}
		}
		catch(e){
			return {
				initialized:false,
				error:e
			}
		}
	}
	this.initCategorie = async ()=>{
		try{
			let r = await client.send(new CreateTableCommand(catdef)),
			tableStatus = r.TableDescription.TableStatus;

			return tableInitializationHandler(tableStatus, cTableName);
		}
		catch(e){
			if(e.name == 'ResourceInUseException'){
				console.log(e.name,"Throwed as initCategorie");
				return false;
			}
			throw e;
		}
	}
	this.initSong = async ()=>{
		try{
			let r = await client.send(new CreateTableCommand(songdef)),
			tableStatus = r.TableDescription.TableStatus;

			return tableInitializationHandler(tableStatus,sTableName);
		}
		catch(e){
			if(e.name == 'ResourceInUseException'){
				console.log(e.name,"Throwed as initSong");
				return false;
			}
			throw e;
		}
	}
	this.initStream = async ()=>{
		try{
			let r = await client.send(new CreateTableCommand(streamdef)),
			tableStatus = r.TableDescription.TableStatus;

			return tableInitializationHandler(tableStatus,stTableName);
		}
		catch(e){
			if(e.name == 'ResourceInUseException'){
				console.log(e.name,"Throw at initStream");
				return false;
			}
			throw e;
		}
	}
	this.addCategorie = async ({name,id})=>{
		await this.initialized;
		let params = {
			TableName: cTableName,
			ConditionExpression:`attribute_not_exists(#${cF.name})`,
			ExpressionAttributeNames:{
				[`#${cF.name}`]:cF.name
			},
			Item:{
				[cF.name]:name.toLowerCase(),
				[cF.id]:id
			}
		},
		response = await clientD.send(new PutCommand(params)),
		r = addResponse();
		r.id = params.Item.id;
		return r;
	}
	this.getAllCategorie = async (o={})=>{
		await this.initialized;
		let {Limit=50, last} = o,
		params = {
			TableName: cTableName,
			ReturnConsumedCapacity:'TOTAL',
			Limit
		},
		response;

		if(last){
			params.ExclusiveStartKey = last;
		}

		response = await clientD.send(new ScanCommand(params));
		return {...getResponse(response.Items), last:response.LastEvaluatedKey};
	}
	this.getCategorie = async (id)=>{
		await this.initialized;
		let params = {
			TableName: cTableName,
			Key:{
				[cF.id]:id
			},
			ReturnConsumedCapacity:'TOTAL'
		},
		response,
		Item;

		console.log('params',params);

		response = await clientD.send(new GetCommand(params)),
		Item = (response.Item)? [response.Item]:[]; console.log('GAMA');
		return getResponse(Item);
	}
	this.updateCategorie = async (id,obj)=>{
		await this.initialized;
		let params = {
			TableName:cTableName,
			Key:{
				[cF.id]:id
			},
			ConditionExpression:`attribute_exists(${cF.id})`,
			UpdateExpression:`SET `,
			ExpressionAttributeNames:{},
			ExpressionAttributeValues:{},
			ReturnValues:'ALL_NEW'
		},
		update = [],
		response;

		for(let obName in obj){
			params.ExpressionAttributeNames[`#${obName}`] = obName;
			params.ExpressionAttributeValues[`:${obName}`] = (obName == cF.name)? obj[obName].toLowerCase(): obj[obName];
			update.push(`#${obName}=:${obName}`);
		}

		params.UpdateExpression += update.join(',');

		response = await clientD.send(new UpdateCommand(params));
		
		return updResponse(response);
	}
	this.removeCategorie = async (id)=>{
		await this.initialized;
		try{
			let params = {
				TableName:cTableName,
				Key:{
					[cF.id]:id
				},
				ConditionExpression:`attribute_exists(#${cF.id})`,
				ExpressionAttributeNames:{
					[`#${cF.id}`]:cF.id
				},
				ReturnConsumedCapacity:'TOTAL',
				ReturnValues:'ALL_OLD'
			},
			songs,
			response,
			r,
			last;

			songs = (await DoUntilLast([],this.getAllSongs.bind(this),{ catId:id})).Items;

			let removed = await this.bulkRemoveSongs(id,songs);

			if(removed == songs.length){
				response = await clientD.send(new DeleteCommand(params));
				return remResponse(response);
			}
			else{
				return remResponse(null,{ message:"We couldn't delete some songs" })
			}
		}
		catch(e){
			if(e.name == 'ConditionalCheckFailedException'){
				let r = remResponse();
				r.exist = false;
				return r;
			}
			throw e;
		}
	}
	this.addSong = async ({name,verses,catId})=>{
		await this.initialized;
		let params = {
			TableName: sTableName,
			ConditionExpression:`attribute_not_exists(#${sF.name})`,
			ExpressionAttributeNames:{
				[`#${sF.name}`]:sF.name
			},
			Item:{
				[sF.name]:name.toLowerCase(),
				[sF.cTime]:Date.now(),
				[sF.verses]:verses,
				[sF.catId]:catId
			}
		},
		response;

		if(badSongName.test(name)){
			params.Item[sF.name] = name.replace(badSongName,' ');
		}
		
		response = await clientD.send(new PutCommand(params));
		return addResponse();
	}
	this.getAl = async ()=>{
		await this.initialized;
		let params = {
			TableName:sTableName,
			ReturnConsumedCapacity:'TOTAL'
		},
		response,
		data = [];

		while(response = await clientD.send(new ScanCommand(params))){
			data.push(...response.Items);
			if(!response.LastEvaluatedKey){
				break;
			}
			else{
				params.ExclusiveStartKey = response.LastEvaluatedKey;
			}
		}

		return data;
	}
	this.getAllSongs = async (o={})=>{
		await this.initialized;
		let { catId, limit, last, all } = o,
		params = {
			TableName: sTableName,
			KeyConditionExpression:`${sF.catId}=:${sF.catId}`,
			ExpressionAttributeValues:{
				[`:${sF.catId}`]:catId
			},
			Limit:100,
			ReturnConsumedCapacity:'TOTAL',
		},
		response,
		r;

		if(all){
			response = await DoUntilLast([],this.getAllSongs.bind(this), {catId,limit});
			return getResponse(response.Items);
		}

		if(limit){
			params.Limit = limit;
		}
		if(last){
			params.ExclusiveStartKey = last;
		}

		response = await clientD.send(new QueryCommand(params));
		r = getResponse(response.Items);

		if(response.LastEvaluatedKey){
			r.last = response.LastEvaluatedKey;
		}

		return r;
	}
	this.getSong = async (name,catId)=>{
		await this.initialized;
		let params = {
			TableName: sTableName,
			Key:{
				[sF.name]:name,
				[sF.catId]:catId
			},
			ReturnConsumedCapacity:'TOTAL'
		},
		response = await clientD.send(new GetCommand(params)),
		Item = (response.Item)? [response.Item]:[];
		return getResponse(Item);
	}
	this.updateSong = async (name,catId,obj)=>{
		await this.initialized;
		try{
			let params = {
				TableName: sTableName,
				Key:{
					[sF.name]:name,
					[sF.catId]:catId
				},
				ConditionExpression:`attribute_exists(#${sF.name})`,
				ExpressionAttributeNames:{
					[`#${sF.name}`]:sF.name
				},
				ExpressionAttributeValues:{},
				UpdateExpression:"",
				ReturnValues:'UPDATED_NEW',
			},
			response;
			params.UpdateExpression = "SET "+ Object.keys(obj).map((x)=>{
				params.ExpressionAttributeNames[`#${x}`] = x;
				params.ExpressionAttributeValues[`:${x}`] = obj[x];

				return `#${x}=:${x}`;
			}).join(',');

			if('name' in obj){
				let r = await this.removeSong(name,catId),
				r2,
				verses,
				Attributes;

				if(r.deleted){
					console.log("deleted");
					verses = obj[sF.verses] || r.old[sF.verses];
					Attributes = { [sF.name]:obj.name,[sF.verses]:verses,[sF.catId]:catId };

					r2 = await this.addSong(Attributes);

					if(r2.inserted){
						return updResponse({Attributes})
					}
					else{
						return updResponse(null);
					}
				}
				else{
					console.log("Not deleted",name,catId);
					return updResponse(null,r.error);
				}
			}
			else{
				response = await clientD.send(new UpdateCommand(params));
				return updResponse(response);
			}
		}
		catch(e){
			if(e.name == 'ConditionalCheckFailedException'){
				return updResponse(null,{ name:e.name });
			}
			throw e;
		}
	}
	this.removeSong = async (name,catId)=>{
		await this.initialized;
		try{
			let params = {
				TableName: sTableName,
				Key:{
					[sF.name]:name,
					[sF.catId]:catId
				},
				ConditionExpression:`attribute_exists(#${sF.name})`,
				ExpressionAttributeNames:{
					[`#${sF.name}`]:sF.name
				},
				ReturnValues:'ALL_OLD'
			},
			response = await clientD.send(new DeleteCommand(params));
			return remResponse(response);
		}
		catch(e){
			if(e.name == "ConditionalCheckFailedException")
				return remResponse();
			throw e;
		}
			
	}
	this.bulkRemoveSongs = async (catId,songs)=>{
		let params = {
			TransactItems:[]
		},
		removed = 0;

		while(songs.length){
			let params = {
				TransactItems:[]
			},
			miniSongs = songs.splice(0,25),
			response;

			miniSongs.forEach((song)=>{
				params.TransactItems.push({
					Delete:{
						TableName:sTableName,
						Key:{
							[sF.name]:song.name,
							[sF.catId]:catId
						},
						ConditionExpression:`attribute_exists(#${sF.name})`,
						ExpressionAttributeNames:{
							[`#${sF.name}`]:sF.name
						}
					}
				})
			})

			try{
				response = await clientD.send(new TransactWriteCommand(params));
			}
			catch(e){
				console.log("Error",e);
			}
		}

		return removed;
	}
	this.searchSong = async (term,last)=>{
		let params = {
			TableName:sTableName,
			FilterExpression:`contains(#${sF.name},:val)`,
			ExpressionAttributeNames:{
				[`#${sF.name}`]: sF.name
			},
			ExpressionAttributeValues:{
				':val': term
			},
			LIMIT:100
		},
		r,
		response;

		if(last){
			params.ExclusiveStartKey = last;
		}

		r = await clientD.send(new ScanCommand(params)),
		response = getResponse(r.Items);

		if(r.LastEvaluatedKey){
			response.last = r.LastEvaluatedKey;
		}

		return response;
	}
	this.addStream = async ({ name, catName, song })=>{
		await this.initialized;
		try{
			let params = {
				TableName:stTableName,
				Item:{
					[stF.name]:name.toLowerCase(),
					[stF.song]:song,
					[stF.catName]:catName.toLowerCase(),
					[stF.cTime]: Date.now()
				},
				ConditionExpression:`attribute_not_exists(#${stF.name})`,
				ExpressionAttributeNames:{
					[`#${stF.name}`]:stF.name
				}
			},
			response = await clientD.send(new PutCommand(params));

			return addResponse()
		}
		catch(e){
			if(e.name == "ConditionalCheckFailedException"){
				let r = addResponse({ name:e.name});
				r.exist= true;
				return r;
			}
			throw e;
		}
	}
	this.updateStream = async (name,{ song, catName, index })=>{
		await this.initialized;
		try{
			let params = {
				TableName:stTableName,
				Key:{
					[stF.name]:name
				},
				ConditionExpression: `attribute_exists(#${stF.name})`,
				ExpressionAttributeNames:{
					[`#${stF.name}`]:stF.name
				},
				ExpressionAttributeValues:{},
				UpdateExpression:"SET ",
				ReturnValues:"UPDATED_NEW"
			},
			response,
			upd = [];

			if(catName){
				if(song){
					upd.push(`#${stF.catName}=:${stF.catName}`);
					upd.push(`#${stF.song}=:${stF.song}`);
					params.ExpressionAttributeValues[`:${stF.song}`] = song;
					params.ExpressionAttributeValues[`:${stF.catName}`] = catName.toLowerCase();
					params.ExpressionAttributeNames[`#${stF.song}`] = stF.song;
					params.ExpressionAttributeNames[`#${stF.catName}`] = stF.catName;
				}
				else{
					return updResponse(null,{
						message:'catName should be given with a song'
					})
				}
			}
			else if(song){
				upd.push(`#${stF.song}=:${stF.song}`);
				params.ExpressionAttributeValues[`:${stF.song}`] = song;
				params.ExpressionAttributeNames[`#${stF.song}`] = stF.song;
			}
			else if(index != undefined){
				upd.push(`${stF.song}.#${stF.index}=:${stF.index}`);
				params.ExpressionAttributeValues[':index'] = index;
				params.ExpressionAttributeNames[`#${stF.index}`] = stF.index;
			}
			else{
				return updResponse(null,{
					message:"No data given"
				})
			}
			params.UpdateExpression += upd.join(',');

			response = await clientD.send(new UpdateCommand(params));

			return updResponse(response);
		}
		catch(e){
			if(e.name == "ConditionalCheckFailedException"){
				let r = updResponse();
				r.exist = false;
				return r;
			}
			throw e;
		}
	}
	this.getStream = async (name)=>{
		await this.initialized;
		let params = {
			TableName:stTableName,
			Key:{
				[stF.name]:name.toLowerCase()
			}
		},
		response = await clientD.send(new GetCommand(params)),
		Item = (response.Item)? [response.Item]:[];

		return getResponse(Item);
	}
	this.getAllStreams = async (filters={})=>{
		await this.initialized;
		let params = {
			TableName: stTableName
		},
		response,
		r;

		if(fil.limit in filters){
			params.Limit = filters[fil.limit];
		}
		if(fil.last in filters){
			params.ExclusiveStartKey = filters[fil.last];
		}
		if(fil.lastTime in filters){
			params.ExpressionAttributeNames = { [`#${stF.cTime}`]:stF.cTime };
			params.ExpressionAttributeValues = { [`:${fil.lastTime}`]: filters[fil.lastTime] };
			params.FilterExpression = `#${stF.cTime} > :${fil.lastTime}`; 
		}

		response = await clientD.send(new ScanCommand(params));

		r = getResponse(response.Items);

		if(response.LastEvaluatedKey){
			r.last = response.LastEvaluatedKey;
		}
		return r;
	}
	this.deleteStream = async (name)=>{
		await this.initialized;
		try{
			let params = {
				TableName:stTableName,
				Key:{
					[stF.name]:name.toLowerCase()
				},
				ConditionExpression:`attribute_exists(#${stF.name})`,
				ExpressionAttributeNames:{
					[`#${stF.name}`]:stF.name
				},
				ReturnValues:"ALL_OLD"
			},
			response = await clientD.send(new DeleteCommand(params));
			return remResponse(response);
		}
		catch(e){
			if(e.name == "ConditionalCheckFailedException"){
				let r = remResponse();
				r.exist = false;
				return r;
			}
			throw e;
		}
	}
	this.dropSong = async ()=>{
		try{
			await client.send(new DeleteTableCommand({
				TableName: sTableName
			}));
		}
		catch(e){
			if(e.name == 'ResourceNotFoundException'){
				console.log(e.name,"Throwed at dropSong");
				return;
			}
			throw e;
		}
	}
	this.dropCategorie = async ()=>{
		try{
			await client.send(new DeleteTableCommand({TableName:catdef.TableName}));
		}
		catch(e){
			if(e.name == 'ResourceNotFoundException'){
				console.log(e.name,"Throwed at dropCategorie");
				return;
			}
			throw e
		}
	}
	this.dropStream = async ()=>{
		try{
			await client.send(new DeleteTableCommand({ TableName:stTableName}))
		}
		catch(e){
			if(e.name == 'ResourceNotFoundException'){
				console.log(e.name,"Throwed at dropStream");
				return;
			}
			throw e;
		}
	}
	this.dropAll = async ()=>{
		await Promise.all([this.dropCategorie(), this.dropSong(), this.dropStream()]);
	}
	this.end = ()=> client.destroy();
	
	this.initialized = this.initAll()
}

const e = new d(options);

export default e;