function TTT({safeOp,seq}){

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
				var store1 = db.createObjectStore('Categorie',{ autoIncrement: true}),
				store2 = db.createObjectStore('Song',{ autoIncrement:true});

				var req1 = store1.createIndex("by_name","name",{ unique:true}),
				req2 = store2.createIndex("by_song_cat", ["name","cat"], { unique:true}),
				req3 = store2.createIndex("by_cat","cat"),
				req4 = store1.createIndex("by_id","id",{ unique:true });

				var i1 = ()=>{
					return new Promise((resolve,reject)=>{
						req1.onsuccess = ()=> resolve(true);
						req1.onerror = ()=> reject(req1.error)
					});
				},
				i2 = ()=>{
					return new Promise((resolve,reject)=>{
						req2.onsuccess = ()=> resolve(true);
						req2.onerror = ()=> reject(req2.error);
					})
				},
				i3 = ()=>{
					return new Promise((resolve,reject)=>{
						req3.onsuccess = ()=> resolve(true);
						req3.onerror = ()=> reject(req3.error);
					})
				},
				i4 = ()=>{
					return new Promise((resolve,reject)=>{
						req4.onsuccess = ()=> resolve(true);
						req4.onerror = ()=> reject(req4.error);
					})
				}

				Promise.all([i1(),i2(),i3(),i4()]).then(resolve).catch((e)=>{
					console.error("Couldn't initial the database",e);
				})

			};
			request.onblocked = ()=>{
				console.log("Hey, someone is blocking me");
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

	this.insertCategorie = (name,id)=>{
		var txt = 'insertCategorie',
		tx = this.txW,
		p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var store = tx.objectStore("Categorie");
				var request = store.put({name:toL(name,id),id});
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
		var txt = 'updateCategorie',
		tx = this.txW,
		p =  ()=> new Promise((resolve,reject)=>{
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
	this.removeCategorie = (id)=>{
		var txt = `removeCategorie`,
		tx = this.txW,
		p =  ()=> new Promise((resolve,reject)=>{
			this.deleteCategorieSong(id)().then((r)=>{
				if(r){
					tx((tx)=>{
						var index = tx.objectStore("Categorie").index("by_id"),
						request = index.openCursor(IDBKeyRange.only(id))
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
								resolve(true);
							}
						}
						request.onerror = (e)=>{
							e.preventDefault();
							reject(dealWithConstraint(request.error));
						}
					},(e)=> sameCompose(reject,trError));
				}
				else{
					console.error("Couldn't delete all the song of the categorie");
					resolve(false);
				}
			}).catch(reject);
		});
		return p;
		
	};
	this.getCategorie = (id="")=>{
		var txt = 'getCategorie',
		tx = this.txR,
		p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var index = tx.objectStore("Categorie").index("by_id"),
				request = index.openCursor(toL(id));
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

	this.getCategorieByKey = (id="")=>{
		var txt = 'getCategorieByKey',
		tx = this.txR;
		p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var index = tx.objectStore("Categorie").index("by_id"),
				request = index.openCursor(id);
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
		var txt = "getAllCategories",
		tx = this.txR,
		p = ()=> new Promise((resolve,reject)=>{
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
		var txt = 'insertSong',
		tx = this.txW,
		p = ()=> new Promise((resolve,reject)=>{
			this.getCategorieByKey(cat)().then((r)=>{
				if(r){
					tx((tx)=>{
						var store = tx.objectStore("Song");
						var request = store.put({name:toL(name),verses,cat:cat});
						request.onsuccess = (e)=>{
							resolve(Boolean(request.result));
						}
						request.onerror = (e)=>{
							e.preventDefault();
							reject(dealWithConstraint(request.error));
						}
					},(e)=> sameCompose(reject,trError));
				}
				else{
					reject({message:"Foreign key constrain violated",type:"error"})
				}
			}).catch(reject);
		})
		return p;

	};
	this.updateSong = (name,cat,newName,verses)=>{
		var txt = "updateSong",
		tx = this.txW,
		p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var index = tx.objectStore("Song").index("by_song_cat");
				var request = index.openCursor(IDBKeyRange.only([toL(name),cat]));
				request.onsuccess = (e)=>{
					var cursor = request.result;
					if(cursor){
						var value = cursor.value,
						req = cursor.update({name:toL(newName) || value.name, verses:verses || value.verses,cat});
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
		});

		return p;

	};
	this.deleteSong = (name,cat)=>{
		var txt = 'deleteSong',
		tx = this.txW,
		p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var index = tx.objectStore("Song").index("by_song_cat");
				var request = index.openCursor(IDBKeyRange.only([toL(name),cat]));
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
		});
		return p;

	};
	this.deleteCategorieSong = (catId)=>{
		var txt = 'deleteCategorieSong',
		tx = this.txW,
		p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var index = tx.objectStore("Song").index("by_cat"),
				request2 = index.count(catId);

				request2.onsuccess = ()=>{
					let totalSong = request2.result;

					if(totalSong){
						request = index.openCursor(catId);

						request.onsuccess = (e)=>{
							var cursor = request.result;
							if(cursor){
								var req = cursor.delete();
								req.onsuccess = (e)=>{
									if(!(--totalSong)){
										resolve(true);
									}
								}
								req.onerror = (e)=>{
									e.preventDefault();
									
									reject(dealWithConstraint(req.error));
								}
								cursor.continue();
							}
							else{
								if(!totalSong){
									resolve(true);	
								}
								else{
									console.error(totalSong,"where not deleted");
									resolve(false);
								}
							}
						}
						request.onerror = (e)=>{
							e.preventDefault();
							reject(dealWithConstraint(request.error));
						}
					}
					else{
						resolve(true);
					}
				}
				request2.onerror = (e)=>{
					e.preventDefault();
					reject(dealWithConstraint(request2.error));
				}
			},(e)=> sameCompose(reject,trError));
		});
		return p;
	}
	this.getSong = (name,cat)=>{
		var txt = 'getSong',
		tx = this.txR,
		p = ()=> new Promise((resolve,reject)=>{
			tx((tx)=>{
				var index = tx.objectStore("Song").index("by_song_cat");
				var request = index.openCursor([name,cat]);
				request.onsuccess = (e)=>{
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
		});

		return p;
	};
	this.getAllSongs = (id)=>{
		var txt = 'getAllSongs',
		tx = this.txR,
		p = ()=> new Promise((resolve,reject)=>{
			//console.log("Here is the typeof cat",typeof cat);
			tx((tx)=>{
				var index = tx.objectStore("Song").index("by_cat");
				var request = (index.getAll && index.getAll(id)) || (index.mozGetAll && index.mozGetAll(id));
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
					request = index.openCursor(id);
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
		});
		return p;
	}
	this.countSong = (cat)=>{
		var txt = 'countSong',
		tx = this.txR,
		p = ()=> new Promise((resolve,reject)=>{
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
		});
		return p;
	}
}

module.exports = TTT;