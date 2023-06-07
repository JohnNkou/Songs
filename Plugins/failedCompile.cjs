const { execFile } = require("child_process");
const fs = require('fs');

function f(txt,hooks){
	execFile('bash/devHelp.sh',[txt],(err)=>{
		if(err)
			console.log("compileError Error, with hooks",hooks,txt,err);
	})
}

class Failer{
	apply(compiler){
	let mode = compiler.options.mode;
		if(process.env.os == 'Darwin'){
			compiler.hooks.failed.tap("Failer",(error)=>{
				f("CompileError","failed");
			})

			compiler.hooks.done.tap("Failer",(stats)=>{
				if(stats.compilation.errors.length)
					f("CompileError","done");
				else
					f("Success","done");
			})
		}

		compiler.hooks.afterEmit.tap('Failer',(compilation)=>{
			let file = "public/dist/bundle.js";
			let f = fs.readFileSync(file).toString();
			let gog = [];
			let count = 0;
			let first = /(\W\w*)\.(return|default|delete|continue)(\W)/g;
			let second = /(Symbol)\.(for)/g;
			let third = (mode == 'development')? /(\Wdelete|\Wdefault|[\W]for|\Wcontinue|[\W]in|[^$]typeof):([^\n]+)/g : /(delete):/g;

			gog.push("$1['$2']$3");
			gog.push("$1['$2']");
			gog.push(((mode == 'development')? "'$1':$2": "'$s1':" ))

			while(f.match(first)){
				count++;
				f = f.replace(first,gog[0]);
			}
			while(f.match(second)){
				count++;
				f = f.replace(second,gog[1]);
			}
			while(f.match(third)){
				count++;
				f = f.replace(third,gog[2]);
			}

			if(count){
				fs.writeFileSync(file,f);
			}
		})
	}
}

module.exports = Failer;