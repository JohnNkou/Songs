export default function(){
	let moduleName = './guider.js';
	return import('./guider.js').then((module)=>{
		return module.stepManager;
	}).catch((e)=>{
		console.error("Error loading",moduleName);
	})
}