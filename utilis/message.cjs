const messages = {
	error:{
		required:(name)=>{
			return `${name} is a required field`
		},
		range:(name)=>{
			return `${name} is out of allowed range`
		},
		type:(name,type)=>{
			return `${name} should be a ${type}`
		},
		empty:(name)=>{
			return `${name} should not be empty`;
		},
		insert:(name)=>{
			return `Couldn't insert ${name}`
		},
		unknown:(name)=>{
			return `unknown ${name}`
		},
		greaterThan:(name,n)=>{
			return `${name} should be greater than ${n}`
		},
		missData:()=>{
			return 'No data given'
		},
		exists:(name)=>{
			return `${name} already exist`
		},
		reference:(name)=>{
			return `Referenced ${name} don't exist`
		},
		invalid:(name)=>{
			return `Invalid ${name}`
		},
		incorrectLength:(name)=>{
			return `Incorrect length for ${name}`
		},
		notAuthentified:()=>{
			return "user not authentified"
		},
		notAlphaNumeric:(name)=>{
			return `${name} should only have alphanumberic character`
		},
		notArrayOfAlphaNumeric:(name)=>{
			return `${name} don't only contain alphaNumeric character`;
		}
	}
}

module.exports = messages;