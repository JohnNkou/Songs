import fs from 'fs'

export function sequencer(string,searchedTerm,f){
	let currentIndex = string.indexOf(searchedTerm);

	let n;

	while(n = extractFunction(string.substr(currentIndex))){
		if(!f(n.newString)){
			return false;
		}
		currentIndex = string.indexOf(searchedTerm, currentIndex+1);
		if(currentIndex == -1)
			break;
	}
	return true;
}

export function extractFunction(string){
	let parentheses = 1;
	let lastIndex;
	if(string.indexOf("(") == -1)
		return false;

	for(var i=string.indexOf("(")+1;;i++){
		if(string[i] == "(")
			parentheses++;
		else if(string[i] == ")")
			parentheses--;

		if(!parentheses){
			lastIndex = i+1;
			break;
		}
	}

	return {newString:string.substr(0,lastIndex),lastIndex};
}