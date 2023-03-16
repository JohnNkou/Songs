function validator(fields){
  let toValidate = {};
  
  let algo = {
	  isRequired: function(value){
	    console.log("isRequired",value);
	    if(!value || !value.length)
	      return false;
	    return true;
	  },
	  isNumber: function(value){
	    if(!value || !/^\d$/.test(value))
	      return false;
	    return true;
	  },
	  isLessThan: function(value,number){
	    let parsedValue = parseInt(value,10);

	    if(!parsedValue || parsedValue > number)
	      return false;
	    return true;
	  },
	  isMoreThan:function(value,number){
	  	let parsedValue = parseInt(value,10);

	  	if(!parsedValue || parsedValue < number)
	  		return false;
	  	return true;
	  },
	  isNotIn: function(value,list){
	  	if(!Array.isArray(list)){
	  		throw Error("list is not an Array");
	  	}
	  	if(!value){
	  		throw Error("value is undetermined");
	  	}

	  	return list.indexOf(value) == -1;
	  },
	  isAllEmpty: function(list,propName){
	  	let i=0, emptyOne = 0; 

	  	if(!list || (!Array.isArray(list) && (typeof list != typeof {})))
	  		throw Error("Expect list to be Array or Object");

	  	if(Array.isArray(list)){
	  		for(; i < list.length; i++){
	  			if(list[i] == "")
	  				emptyOne++;
	  		}

	  		if(emptyOne == list.length)
	  			return true;
	  	}
	  	else{
	  		for(let prop in list){
	  			i++;
	  			if(list[prop][propName] == "")
	  				emptyOne++;
	  		}

	  		if(emptyOne == i)
	  			return true;
	  	}

	  	return false;
	  },
	  hasBadCharacter: function(name,reg){
	  	if(reg.test(name))
	  		return true;

	  	return false;
	  }
	}

  	this.hasSomething = algo['isRequired'];
  	this.isNumber = algo['isNumber'];
  	this.isLessThan = algo['isLessThan'];
  	this.isMoreThan = algo['isMoreThan'];
  	this.isNotIn = algo['isNotIn'];
  	this.isAllEmpty = algo['isAllEmpty'];
  	this.hasBadCharacter = algo['hasBadCharacter']
}

function Action(){
	this.nextAction = null;
	this.prevAction = null;
	let anchor = [];
	let process;
	let clearer;
	let Text = [];
	let Title = null;
	let store = {};
	let reset = false;
	this.addAnchor = (a)=>{
		anchor = (a.pop)? [...a]: [a];
	}
	this.addProcess = (f)=>{
		if(!anchor)
			throw Error("To add a process there must be an anchor. Please provide an anchor with addAnchor method");
		process = (f)? ()=> f(anchor): null;
	}
	this.addText = (t)=>{
		if(t === "")
			Text = [];
		else
			Text = (t.pop)? [...t]:[t];
	}
	this.addAction = ()=>{
		let next = this.nextAction;
		let old = null;
		while(next){
			old = next;
			next = next.nextAction;
		}
		if(old){
			old.nextAction = new Action();
			old.nextAction.prevAction = old;
		}
		else{
			this.nextAction = new Action();
			this.nextAction.prevAction = this;
		}
		return this;
	}
	this.reset = (state)=>{
		if(state === true)
			reset = true;
		else{
			if(reset != false)
				reset = false;
		}
	}
	this.getReset = ()=> reset;
	this.addClearer = (f)=>{
		if(!anchor)
			throw Error("There is no anchor for the clearing process. Please provide an anchor with addAnchor method");
		clearer = (f)? ()=> f(anchor): null;
	}
	this.addToStore = (data)=>{
		store = {...store, ...data};
	}
	this.addTitle = (t)=>{
		Title = t;
	}
	this.clearStore = ()=>{
		store = {};
	}
	this.getClearer = ()=>{
		return clearer;
	}

	this.getStore = ()=>{
		return store;
	}
	this.getTitle = ()=>{
		return Title;
	}
	this.getText = ()=> Text;
	this.getAnchor = ()=> anchor;
	this.doProcess =  ()=> process;
}

function section(){
	this.nextSection = null;
	this.prevSection = null;
	this.action = new Action();
	let title;
	let text = [];
	let setter;
	let Anchors = [];

	this.addTitle = (t)=>{
		title = t;
		return true;
	}
	this.addText = (t)=>{
		text = (t.pop)? [...t]: [t];
		return true;
	}
	this.addSection = ()=>{
		let next = this.nextSection;
		let oldSection = null;

		while(next){
			oldSection = next;
			next = next.nextSection;
		}
		if(oldSection){
			oldSection.nextSection = new section();
			oldSection.nextSection.prevSection = oldSection;
		}
		else{
			this.nextSection = new section();
			this.nextSection.prevSection = this;
		}
		return this;
	}
	this.getTitle = ()=>{
		return title;
	}
	this.getText = ()=>{
		return text;
	}
}

function step(){
	this.nextStep = null;
	this.prevStep = null;
	let title;
	this.section = new section();

	this.addTitle = (t)=>{
		title = t;
		return true;
	}
	this.addStep = ()=>{
		let next = this.nextStep;
		let oldStep = null;
		while(next){
			oldStep = next;
			next = next.nextStep;
		}
		if(oldStep){
			oldStep.nextStep = new step();
			oldStep.nextStep.prevStep = oldStep;
		}
		else{
			this.nextStep = new step();
			this.nextStep.prevStep = this;
		}
		return this;
	}
	this.getTitle = ()=>{
		return title;
	}
}

function note({ displayTime, seq, signal}){
	let jsx;
	let counter;
	let timeout = displayTime.medium;
	let sequence = new seq();
	this.getTimeout = ()=> timeout;
	this.setJsx = (j)=>{
		jsx = j;
		window.kk = this;
	}

	this.addSpeed = (message,progress,t,node,signalMessage)=>{
		t = t || timeout;
		sequence.add(()=>{
			clearTimeout(counter);
			let state = jsx.state;
			let k = {message,progress,node, signal:signalMessage || signal.system,download:""};
			jsx.setState(k);
			counter = setTimeout(()=>{
				this.clear();
			},timeout)
			return Promise.resolve();

		})
	}
	this.add = (message,progress,t,node,signalMessage)=>{
		t = t || timeout;
		sequence.add(()=>{
			return new Promise((resolve,reject)=>{
				let state = jsx.state;
				let k = {message,progress,node, signal:signalMessage || signal.system,download:""}
				jsx.setState(k);
				counter = setTimeout(()=>{
					this.clear();
					resolve(true);
				},t);
			})
		})
	}
	this.post = (message, signal,download)=>{
		sequence.add(()=>{
			clearTimeout(counter);
			let state = jsx.state;
			let k = {message,signal,download};
			jsx.setState(k);
			return Promise.resolve();
		})
	}
	this.clear = ()=>{
		this.addSpeed("",null, displayTime.fast);
	}

}

exports.validator = validator;
exports.step = step;
exports.note = note;