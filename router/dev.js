import {fork,execFile} from 'child_process';
import fs from 'fs';
import { sequencer } from '../utilis/devHelper.js'
import { dev } from '../utilis/constant.cjs'
import { Console } from 'console'

export const fConsole = Console({
	stdout: fs.createWriteStream(dev.LOG_FILE),
	stderr: fs.createWriteStream(dev.ERROR_LOG_FILE)
})

export function watchHelper(file){
	fs.watchFile(file,(curr,prev)=>{
		if(curr.mtime != prev.mtime){
			let f = fs.readFileSync(file).toString();
			let passed = sequencer(f,"addProcess((anchor)=>",(s)=> /action\.addToStore/.test(s))

			if(!passed)
				execFile("bash/devHelp.sh",(err)=>{
					if(err)
						console.log("BASH ERROR",err);
				});
		}
	})
}

export function watchBundler(file){
	fs.watchFile(file,(curr,prev)=>{
		f(curr,prev);
	})

	let f = (curr,prev)=>{
		if(curr.mtime != prev.mtime){
			let f = fs.readFileSync(file).toString();
			let count = 0;
			let first = /(\W\w+)\.(return|default|delete)(\W)/g;
			let second = /(Symbol)\.(for)/g;
			while(f.match(first)){
				count++;
				f = f.replace(first,"$1['$2']$3");
			}
			while(f.match(second)){
				count++;
				f = f.replace(second,"$1['$2']")
			}

			if(count){
				console.log("Current mtime",curr.mtime);
				fs.writeFileSync(file,f);
				console.log("wrote");
			}
		}
	}
}