const { messages } = require('./message.cjs');

const config = (function(){
	let testing = process.env.NODE_ENV == 'test',
	cat = {
		name:'Categorie',
		testName:'CategorieTest',
		fields:{
			id:'id',
			name:'name'
		}
	},
	song = {
		name:'Songs',
		testName:'SongsTest',
		fields:{
			name:'name',
			catId:'catId',
			cTime:'creationTime',
			verses:'verses'
		}
	},
	user = {
		name:'User',
		testName:'UserTest',
		fields:{
			username:'username',
			id:'id',
			email:'email',
			password:'password'
		}
	},
	stream = {
		name:'Stream',
		testName:'StreamTest',
		fields:{
			name:'name',
			songName:'songName',
			song:'song',
			verses:'verses',
			index:'index',
			catName:'catName',
			cTime:'creationTime'
		},
		query:{
			updating:'updating',
		}
	},
	filters = {
		limit:'limit',
		next:'next',
		lastTime:'lastTime'
	},
	streamdef = {
		TableName: (!testing)? stream.name: stream.testName,
		AttributeDefinitions:[
			{
				AttributeName:stream.fields.name,
				AttributeType:'S'
			}
		],
		KeySchema:[
			{
				AttributeName:stream.fields.name,
				KeyType:'HASH'
			}
		],
		ProvisionedThroughput:{
			ReadCapacityUnits:1,
			WriteCapacityUnits:1
		}
	},
	userdef = {
		TableName:'User',
		AttributeDefinitions:[
			{
				AttributeName:user.fields.id,
				AttributeType:'S'
			}
		],
		KeySchema:[
			{
				AttributeName:user.fields.username,
				KeyType:'HASH'
			}
		],
		ProvisionedThroughput:{
			ReadCapacityUnits:1,
			WriteCapacityUnits:1
		},
	},
	songdef = {
		TableName:(!testing)? song.name:song.testName,
		AttributeDefinitions:[
			{
				AttributeName:song.fields.name,
				AttributeType:'S'
			},
			{
				AttributeName:song.fields.catId,
				AttributeType:'S'
			}
		],
		KeySchema:[
			{
				AttributeName:song.fields.catId,
				KeyType:'HASH'
			},
			{
				AttributeName:song.fields.name,
				KeyType:'RANGE'
			}
		],
		ProvisionedThroughput:{
			ReadCapacityUnits:1,
			WriteCapacityUnits:20
		}
	},
	catdef = {
		TableName:(!testing)? cat.name:cat.testName,
		AttributeDefinitions:[
			{
				AttributeName:cat.fields.name,
				AttributeType:'S'
			},
			{
				AttributeName:cat.fields.id,
				AttributeType:'S'
			}
		],
		KeySchema:[
			{
				AttributeName:cat.fields.name,
				KeyType:'HASH'
			}
		],
		GlobalSecondaryIndexes:[
			{
				IndexName:'byName',
				KeySchema:[
					{
						AttributeName:cat.fields.id,
						KeyType:'HASH'
					},
					{
						AttributeName:cat.fields.name,
						KeyType:'RANGE'
					}
				],
				Projection:{
					ProjectionType:'ALL'
				},
				ProvisionedThroughput:{
					ReadCapacityUnits:1,
					WriteCapacityUnits:1
				}
			}
		],
		ProvisionedThroughput:{
			ReadCapacityUnits:1,
			WriteCapacityUnits:1
		}
	},
	cF = cat.fields,
	sF = song.fields,
	stF = stream.fields,
	stq = stream.query,
	S = 'String',
	O = 'Object',
	A = 'Array',
	B = 'Boolean',
	AIa = 'ArrayOfAlphaNumeric',
	N = 'Number',
	Gt = 'GreaterThan',
	Ne = 'NotEmpty',
	Ia = 'IsAlphaNumeric';

	return {
		table:{
			cat,
			catdef,
			song,
			songdef,
			stream,
			streamdef,
			user,
			userdef
		},
		constrains:{
			[cat.name]: function(errorMessage, required=true){
				return {
					[cF.name]:{
						validate:{
							names:[
								[S,{
									error: errorMessage.type(cF.name,S)
								}],
								[Ne,{
									error:errorMessage.empty(cF.name)
								}],
								[Ia,{
									error: errorMessage.notAlphaNumeric(cF.name)
								}]
							]
						},
						required: (required)? errorMessage.required(cF.name):false
					}
				}
			},
			[song.name]: function(errorMessage,required=true){
				return{
					[sF.name]:{
						validate:{
							names:[
								[S,{
									error: errorMessage.type(sF.name,S)
								}],
								[Ne,{
									error: errorMessage.empty(sF.name)
								}],
								[Ia,{
									error: errorMessage.notAlphaNumeric(sF.name)
								}]
							]
						},
						required: (required)? errorMessage.required(sF.name):false
					},
					[sF.catId]:{
						validate:{
							names:[
								[S,{
									error: errorMessage.type(sF.name,S)
								}],
								[Ne,{
									error: errorMessage.empty(sF.name)
								}],
								[Ia,{
									error: errorMessage.notAlphaNumeric(sF.name)
								}]
							]
						},
						required: (required)? errorMessage.required(sF.name):false
					},
					[sF.verses]:{
						validate:{
							names:[
								[AIa,{
									error: errorMessage.notArrayOfAlphaNumeric(sF.verses,A)
								}],
							]
						},
						required:(required)? errorMessage.required(sF.verses):false
					}
				}
			},
			[stream.name]: function(errorMessage,required=true){
				return {
					[stF.name]:{
						validate:{
							names:[
								[S,{
									error: errorMessage.type(stF.name,S)
								}],
								[Ne,{
									error: errorMessage.empty(stF.name)
								}],
								[Ia,{
									error: errorMessage.notAlphaNumeric(stF.name)
								}]
							]
						},
						required: (required)? errorMessage.required(stF.name):false
					},
					[stF.songName]:{
						validate:{
							names:[
								[S,{
									error: errorMessage.type(stF.songName,S)
								}],
								[Ne,{
									error: errorMessage.empty(stF.songName)
								}],
								[Ia,{
									error: errorMessage.notAlphaNumeric(stF.songName)
								}]
							]
						},
						required: (required)? errorMessage.required(stF.songName):false
					},
					[stF.catName]:{
						validate:{
							names:[
								[S,{
									error: errorMessage.type(stF.catName,S)
								}],
								[Ne,{
									error: errorMessage.empty(stF.catName)
								}],
								[Ia,{
									error: errorMessage.notAlphaNumeric(stF.catName)
								}]
							]
						},
						required: (required)? errorMessage.required(stF.catName):false
					},
					[stF.song]:{
						validate:{
							names:[
								[O,{
									error: errorMessage.type(stF.song,O)
								}]
							]
						},
						required: (required)? errorMessage.required(stF.song):false
					},
					[stF.verses]:{
						validate:{
							names:[
								[A,{
									error: errorMessage.type(stF.verses,A)
								}],
								[Gt,{
									error: errorMessage.empty(stF.verses),
									data:[0]
								}],
								[AIa,{
									error: errorMessage.notArrayOfAlphaNumeric(stF.verses)
								}],
							]
						},
						required:(required)? errorMessage.required(stF.verses):false
					},
					[stF.index]:{
						validate:{
							names:[
								[N,{
									error: errorMessage.type(stF.index,N)
								}]
							]
						},
						required:(required)? errorMessage.required(stF.index):false
					},
					[stq.updating]:{
						validate:{
							names:[
								[B,{
									error: errorMessage.type(stq.updating,B)
								}]
							]
						}
					}
				}
			},
			[`${stream.name}Filter`]:function(errorMessage){
				return {
					[filters.lastTime]:{
						validate:{
							names:[
								[N,{
									error:errorMessage.type(filters.lastTime,N)
								}]
							]
						}
					}
				}
			}
		},
		filters
	}
})();{
};

module.exports = config;