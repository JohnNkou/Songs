module.exports = function(){
	return new Promise((resolve,reject)=>{
		require.ensure(['./guider.js'],function(require){
			let { stepManager } = require('./guider.js');
			if(stepManager && stepManager.constructor){
				return resolve(new stepManager());
			}
			console.error("stepManager retrieved is not a function",stepManager);
			resolve(null);
		},(e)=> reject(e),'guider');
	})
}