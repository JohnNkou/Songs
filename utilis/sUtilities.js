export function killUnusedStream({fs,filename,subscribers,waiters,up,lineTermination}){
	fs.access(filename,(err)=>{
		if(err){
			
		}
		else{
			fs.readFile(filename,(err,data)=>{
				if(err){
					console.log("killUnusedStream error",err);
				}
				else{
					data = data.toString();
					fs.unlink(filename,(err)=>{
						if(err){
							console.log("Couldn't delete the file",filename);
						}
						console.log("file",filename,"is deleted");
					});
					//try{
						console.log("data is",data.split(lineTermination));

						let streamNames = data.split(lineTermination).map((x)=> x.toLowerCase()), _SUB = SUB, streamName="";

						console.log("streamNames to be deleted",streamNames);
						if(streamNames.length){
							up.lastupdate = new Date().getTime().toString().slice(0,10); 
							while(streamName = streamNames.pop()){
								let subscribeds = subscribers[streamName];

								if(subscribeds){
									for(let subscribed in subscribeds){
										let res = subscribeds[subscribed];
										res.json({action:_SUB.UNSUBSCRIBE, message:`The stream has finished`});
										delete subscribeds[subscribed];
									}
								}
							}

							if(waiters.length){
								console.log("There is",waiters.length,"waiter");
								for(let id in waiters){
									if(id != "length"){
										let socket = waiters[id];
										socket.json({action:_SUB.DELETE, name: streamNames, timestamp:up.lastupdate});
									}
								}
							}
							else{
								console.log("There is no Waiter");
							}
						}
					//}	
					/*catch(e){
						console.log(e);
					}*/

				}
			})
		}
	})
}