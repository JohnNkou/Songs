function TTT({safeOp}){

	function dealWithConstraint(error){
		if(error.name.toLowerCase() == "constrainterror"){
			return { name:error.name, code:6, message:error.message };
		}
		return error;
	}
	function toL(name){
		return safeOp(name,"toLowerCase",null);
	}
	this.initialize = ()=>{
		return new Promise((resolve,reject)=>{
			if(this.version){
				this.version++;
			}
			else
				this.version = 1;
			var request = indexedDB.open('Test',this.version);
			request.onupgradeneeded = ()=>{
				var db = request.result;
				console.log("Hey, I'm called");
				var store1 = db.createObjectStore('Categorie',{ autoIncrement: true});
				var store2 = db.createObjectStore('Song',{ autoIncrement:true});

				var req1 = store1.createIndex("by_name","name",{ unique:true});
				var req2 = store2.createIndex("by_song_cat", ["name","cat"], { unique:true});
				var req3 = store2.createIndex("by_cat","cat");

				var sequences = new PSeq();

				var i1 = ()=>{
					return new Promise((resolve,reject)=>{
						req1.onsuccess = ()=> resolve(true);
						req1.onerror = ()=> reject(req1.error)
					});
				}
				var i2 = ()=>{
					return new Promise((resolve,reject)=>{
						req2.onsuccess = ()=> resolve(true);
						req2.onerror = ()=> reject(req2.error);
					})
				}
				var i3 = ()=>{
					return new Promise((resolve,reject)=>{
						req3.onsuccess = ()=> resolve(true);
						req3.onerror = ()=> reject(req3.error);
					})
				}

				sequences.subscribe(sequences.add(i1),()=>{
					console.log('Index1 created with success');
				},(e)=>{
					console.log('Error while creating Index1',e);
					reject(e);
				})
				sequences.subscribe(sequences.add(i2),()=>{
					console.log("Index2 created with success");
				},(e)=>{
					console.log("Error while creating Index2",e);
					reject(e);
				})
				sequences.subscribe(sequences.add(i3),()=>{
					console.log("Index3 created with success");
					resolve(true);
				},(e)=> {
					console.log("Error while creating Index3");
					reject(e);
				});

			};
			request.onblocked = ()=>{
				console.log("Hey, someone is blocking be");
			}
			request.onerror = ()=> reject(request.error);
		})
	}
	this.initialize().catch((e)=>{
		console.error("Initializing indexedDB Error",e);
	});
	this.clear = ()=>{
		return new Promise((resolve,reject)=>{
			var request = indexedDB.open('Test',this.version+1);
			console.log("The database version is",this.version);
			request.onupgradeneeded = ()=>{
				console.log("Choops");
				var db = request.result;
				try{
					Array.prototype.forEach.call(db.objectStoreNames,(o)=>{
						db.deleteObjectStore(o);
					});
					resolve(true);
				}
				catch(e){
					console.log("Clear Error",e);
					reject(e);
				}
			}
			request.onerror = ()=>{
				console.log("Clear Error",request,error);
				reject(request.error);
			}
		})
	}
	this.txR = (f,e)=>{
		var request = indexedDB.open('Test');
		request.onsuccess = ()=>{
			var db = request.result;
			db.onversionchange = ()=>{
				console.log("Some is trying to change version");
				db.close();
			}
			if(!this.version)
				this.version = db.version;

			if(!db.objectStoreNames.length){
				this.initialize().then(()=>this.txR(f,e)).catch((er)=> e(er) );
			}
			else{
				var tx = db.transaction(db.objectStoreNames,'readonly');
				f(tx);
			}
		}
		
		request.onerror = ()=>{
			e(request.error);
		}
	}
	this.txW = (f,e)=>{
		var request = indexedDB.open('Test');
		request.onsuccess = ()=>{
			var db = request.result;
			db.onversionchange = ()=>{
				console.log("Someone is trying to change version");
				db.close();
			}
			if(!this.version)
				this.version = db.version;

			if(!db.objectStoreNames.length){
				this.initialize().then(()=>this.txW(f,e)).catch((er)=> e(er));
			}
			else{
				var tx = db.transaction(db.objectStoreNames,'readwrite');
				f(tx);
			}
		}
		request.onerror = ()=>{
			e(request.error)
		}
	}

	this.insertCategorie = (name)=>{
		var txt = 'insertCategorie';
		var tx = this.txW;
		var p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var store = tx.objectStore("Categorie");
				var request = store.put({name:toL(name)});
				request.onsuccess = (e)=>{
					
					resolve(request.result);
				}
				request.onerror = (e)=>{
					e.preventDefault();
					
					reject(dealWithConstraint(request.error));
				}
			},(e)=>{
				sameCompose(reject,trError);
			})
		})

		return p;
	}
	this.updateCategorie = (name,newName)=>{
		var txt = 'updateCategorie';
		var tx = this.txW;
		var p =  ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var index = tx.objectStore("Categorie").index("by_name");
				var request = index.openCursor(IDBKeyRange.only(toL(name)));
				request.onsuccess = ()=>{
					var cursor = request.result;
					if(cursor){
						var req = cursor.update({name:toL(newName)});
						req.onsuccess = (e)=>{
							
							resolve(Boolean(req.result));
						}
						req.onerror = (e)=>{
							
							reject(dealWithConstraint(req.error))
						}
					}
					else{
						
						resolve(false)
					}
				}
				request.onerror = (e)=>{
					e.preventDefault();
					
					reject(dealWithConstraint(request.error));
				}
			},(e)=>{
				sameCompose(reject,trError);
			})
		});
		return p;
		
	};
	this.removeCategorie = (name)=>{
		var txt = `removeCategorie`;
		var p =  ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var index = tx.objectStore("Categorie").index("by_name");
				var request = index.openCursor(IDBKeyRange.only(toL(name)))
				request.onsuccess = (e)=>{
					var cursor = request.result;
					if(cursor){
						var req = cursor.delete();
						req.onsuccess = (e)=>{
							
							resolve(!req.result);
						}
						req.onerror = (e)=>{
							e.preventDefault();
							
							reject(dealWithConstraint(req.error));
						}
					}
					else{
						
						resolve();
					}
				}
				request.onerror = (e)=>{
					e.preventDefault();
					
					reject(dealWithConstraint(request.error));
				}
			},(e)=> sameCompose(reject,trError));
		});
		return p;
		
	};
	this.getCategorie = (name)=>{
		var txt = 'getCategorie';
		var tx = this.txR;
		var p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var index = tx.objectStore("Categorie").index("by_name");
				var request = index.openCursor(toL(name));
				request.onsuccess = (e)=>{
					var cursor = request.result;
					if(cursor){
						
						resolve([{id:cursor.primaryKey,...cursor.value}]);
					}
					else{
						
						resolve([]);
					}
				}
				request.onerror = (e)=>{
					e.preventDefault();
					
					reject(dealWithConstraint(request.error));
				}
			},(e)=>{
				sameCompose(reject,trError);
			});
		});

		return p;
	};

	this.getCategorieByKey = (id)=>{
		var txt = 'getCategorieByKey';
		var tx = this.txR;
		var p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var store = tx.objectStore("Categorie");
				var request = store.openCursor(id);
				request.onsuccess = (s)=>{
					var cursor = request.result;
					if(cursor){
						
						resolve({id:cursor.key,...cursor.value});
					}
					else{
						
						resolve(cursor);
					}
				}
				request.onerror = (e)=>{
					e.preventDefault();
					
					reject(dealWithConstraint(request.error));
				}
			},(e)=> sameCompose(reject,trError));
		});

		return p;
	}

	this.getAllCategories = ()=>{
		var txt = "getAllCategories";
		var tx = this.txR;
		var p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var index = tx.objectStore("Categorie").index("by_name");
				var request = (index.getAll && index.getAll()) || (index.mozGetAll && index.mozGetAll());
				if(request){
					request.onsuccess = (e)=>{
						
						resolve(request.result);
					}
					request.onerror = (e)=>{
						e.preventDefault();
						
						reject(dealWithConstraint(request.error));
					}
				}
				else{
					request = index.openCursor();
					let result = [];
					request.onsuccess = (e)=>{
						let cursor = request.result;
						if(!cursor){
							console.log("getAllCategorie result",result);
							resolve(result);
						}
						else{
							result.push(cursor.value);
							cursor.continue();
						}
					}
					request.onerror = (e)=>{
						console.error("getAllCategorie count Error",e);
					}
				}
			},(e)=> sameCompose(reject,trError));
		})

		return p;
	}
	this.insertSong = (name,verses,cat)=>{
		var txt = 'insertSong';
		var tx = this.txW;
		var p = ()=> new Promise((resolve,reject)=>{
			if(typeof cat == "number"){
				this.getCategorieByKey(cat)().then((r)=>{
					if(r){
						tx((tx)=>{
							var store = tx.objectStore("Song");
							var request = store.put({name,verses,cat:cat});
							request.onsuccess = (e)=>{
								
								resolve(Boolean(request.result));
							}
							request.onerror = (e)=>{
								e.preventDefault();
								//window.eee = {e,er:request.error};
								
								reject(dealWithConstraint(request.error));
							}
						},(e)=> sameCompose(reject,trError));
					}
					else{
						reject({message:"Foreign key constrain violated",type:"error"})
					}
				}).catch(reject);
			}
			else{
				this.getCategorie(cat)().then((r)=>{
					r = r.pop();
					if(r){
						var cat = r.id;
						if(cat){
							var v =  this.insertSong(name,verses,cat)();
							v.then(resolve).catch(reject);
						}
						else{
							
							resolve(false);
						}
					}
					else{
						
						resolve(false);
					}
				}).catch(reject);
			}
		})
		return p;

	};
	this.updateSong = (name,cat,newName,verses)=>{
		var txt = "updateSong";
		var tx = this.txW;
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					tx((tx)=>{
						var index = tx.objectStore("Song").index("by_song_cat");
						var request = index.openCursor(IDBKeyRange.only([name,cat]));
						request.onsuccess = (e)=>{
							var cursor = request.result;
							var value = cursor.value;
							if(cursor){
								var req = cursor.update({name:newName || value.name, verses:verses || value.verses,cat});
								req.onsuccess = (e)=>{
									
									resolve(Boolean(req.result));
								}
								req.onerror = (e)=>{
									e.preventDefault();
									
									reject(dealWithConstraint(req.error));
								}
							}
							else{
								
								reject(false);
							}

						}
						request.onerror = (e)=>{
							e.preventDefault();
							
							reject(dealWithConstraint(request.error));
						}
					},(e)=> sameCompose(reject,trError));
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						if(r){
							var id = r.id;
							this.updateSong(name,id,newName,verses)().then(resolve).catch(reject);
						}
						else{
							
							resolve(false);
						}
					}).catch(reject);
					break;
				default:
					
					reject({type:"Error",message:`Wrong categorie type ${cat}`});

			}
		});

		return p;

	};
	this.deleteSong = (name,cat)=>{
		var txt = 'deleteSong';
		var tx = this.txW;
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					tx((tx)=>{
						var index = tx.objectStore("Song").index("by_song_cat");
						var request = index.openCursor(IDBKeyRange.only([name,cat]));
						request.onsuccess = (e)=>{
							var cursor = request.result;
							if(cursor){
								var req = cursor.delete();
								req.onsuccess = (e)=>{
									
									resolve(!req.result);
								}
								req.onerror = (e)=>{
									e.preventDefault();
									
									reject(dealWithConstraint(req.error));
								}
							}
							else{
								
								resolve(false);
							}
						}
						request.onerror = (e)=>{
							e.preventDefault();
							
							reject(dealWithConstraint(request.error));
						}
					},(e)=> sameCompose(reject,trError));
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						if(!Array.isArray(r))
							throw Error("response should be array");
						r = r.pop();
						if(r){
							var id = r.id;
							this.deleteSong(name,id)().then(resolve).catch(reject);
						}
						else
							reject();
					}).catch(reject);
					break;
				default:
					
					reject({type:'Error',message:'Bad Categorie type'});
			}
		});
		return p;

	};
	this.getSong = (name,cat)=>{
		var txt = 'getSong';
		var tx = this.txR;
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					tx((tx)=>{
						var index = tx.objectStore("Song").index("by_song_cat");
						var request = index.openCursor([name,cat]);
						request.onsuccess = (e)=>{
							/*
							resolve(request.result);*/
							var cursor = request.result;
							if(cursor){
								
								resolve([{id:cursor.primaryKey,...cursor.value}])
							}
							else{
								
								resolve([]);
							}
						}
						request.onerror = (e)=>{
							e.preventDefault();
							
							reject(dealWithConstraint(request.error));
						}
					},(e)=> sameCompose(reject,trError));
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						if(r){
							 var id = r.id;
							 this.getSong(name,id)().then(resolve).catch(reject);
						}
						else
							resolve();
					}).catch(reject);
					break;
				default:
					
					reject({type:'error',message:`Bad Categorie type ${cat}`});
			}
		});

		return p;
	};
	this.getAllSongs = (cat)=>{
		var txt = 'getAllSongs';
		var tx = this.txR;
		var p = ()=> new Promise((resolve,reject)=>{
			//console.log("Here is the typeof cat",typeof cat);
			switch(typeof cat){
				case "number":
					tx((tx)=>{
						var index = tx.objectStore("Song").index("by_cat");
						var request = (index.getAll && index.getAll(cat)) || (index.mozGetAll && index.mozGetAll(cat));
						if(request){
							request.onsuccess = (e)=>{
								
								resolve(request.result);
							}	
							request.onerror = (e)=>{
								e.preventDefault();
								
								reject(dealWithConstraint(request.error));
							}
						}
						else{
							request = index.openCursor(cat);
							let result = [];
							request.onsuccess = ()=>{
								let cursor = request.result;

								if(!cursor){
									resolve(result);
								}
								else{
									result.push(cursor.value);
									cursor.continue();
								}
							}
							request.onerror = (e)=>{
								console.log("getAllSong openCursor error",e,request.error);
							}
						}
					},(e)=> sameCompose(reject,trError));
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						r = r.pop();
						if(r){
							var id = r.id;
							this.getAllSongs(id)().then(resolve).catch(reject);
						}
						else
							resolve();
					}).catch(reject);
					break;

				default:
					
					reject({type:'error',message:`Bad Categorie type ${cat}`})
			}
		});
		return p;
	}
	this.countSong = (cat)=>{
		var txt = 'countSong';
		var tx = this.txR;
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					tx((tx)=>{
						var index = tx.objectStore("Song").index("by_cat");
						var request = index.count(cat);
						request.onsuccess = (e)=>{
							
							resolve(request.result);
						}	
						request.onerror = (e)=>{
							e.preventDefault();
							
							reject(dealWithConstraint(request.error));
						}
					},(e)=> sameCompose(reject,trError));
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						if(r){
							var id = r.id;
							this.countSong(id)().then(resolve).catch(reject);
						}
						else
							resolve();
					}).catch(reject);
					break;

				default:
					
					reject({type:'error',message:`Bad Categorie type ${cat}`})
			}
		});
		return p;
	}
}

module.exports = TTT;