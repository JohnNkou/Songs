module.exports = function(){
	return new Promise((resolve,reject)=>{
		require.ensure(['./guider.js'],function(require){
			let { stepManager } = require('./guider.js');
			resolve(stepManager);
		},(e)=> reject(e),'guider');
	})
}