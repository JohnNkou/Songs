function TT({name,safeOp}){
	this.db = openDb(name,"");
	this.query = this.db.query.bind(this.db);
	this.initialize = ()=>{
		return new Promise((resolve,reject)=>{
			var falsed = false;
			this.query('CREATE TABLE IF NOT EXISTS Categorie(id varchar(50) primary key, name varchar(50) not null unique)',[]).then((s)=>{
		console.log("Table Categorie Created with sucess");
			}).catch((e)=>{
		console.log("Table Categorie not Created",e);
		falsed = true;
			});
		
			this.query("CREATE TABLE IF NOT EXISTS Song(id integer primary key, name varchar(100) not null, verses Text not null, cat varchar(50) not null, unique(name,cat), FOREIGN KEY(cat) REFERENCES Categorie(id))",[]).then((s)=>{
		console.log("Table Song Created with Success");
		if(falsed)
			reject();
		else
			resolve();
			}).catch((e)=>{
		console.log("Table Song not Created",e);
		if(falsed)
			reject();
			})
		})
	}
	this.initialize();
	this.clear = ()=>{
		return new Promise((resolve,reject)=>{
			this.query('DROP TABLE Categorie',[]).then((s)=>{
				if(s){
					console.log("Categorie Table Droped");
					resolve(true);
				}
				else{
					console.log("Couldn't delete table Categorie",s);
					resolve(false);
				}
			}).catch((e)=> console.log("clear Error",e));
			this.query('DROP TABLE Song',[]).then((s)=>{
				if(s){
					console.log("Song Table Dropped");
					resolve(true);
				}
				else{
					console.log("Couldn't delete table Song");
					resolve(false);
				}
			}).catch((e)=> console.log("clear Error",e))
		})
	}
	this.insertCategorie = (name,id)=>{
		 var txt = 'Wb insertCategorie'
		var p = ()=> new Promise((resolve,reject)=>{
			this.query('INSERT INTO Categorie(name,id) VALUES(?,?)',[safeOp(name,"toLowerCase",null),id]).then((s)=>{
				if(s.inserted){
					
					resolve(s.inserted);

					this.getCategorie[name] = [{id:s.inserted, name}];
					this.getCategorieByKey[s.inserted] = this.getCategorie[name];
				}
				else{
					resolve(false);
				}
			}).catch((e)=>{
					
					reject(e);
			});
		});
		return p;
	}
	this.updateCategorie = (name,newName)=>{
		var txt = "Wb updateCategorie ";
		var p = ()=>  new Promise((resolve,reject)=>{
			this.query('UPDATE Categorie SET name=? WHERE name=?',[safeOp(newName,"toLowerCase",null),safeOp(name,"toLowerCase",null)]).then((s)=>{
				if(s.updated){
					
					resolve(true);

					if(this.getCategorie[name]){
						this.getCategorie[newName] = this.getCategorie[name];
						let id = this.getCategorie[name][0].id;
						this.getCategorie[newName][0].name = newName;
						
						if(this.getCategorieByKey[id])
							this.getCategorieByKey[id][0].name = newName;
					}
				}
				else{
					
					resolve(false)
				}
			}).catch((e)=>{
				
				reject();
			})
		});

		return p;
	}
	this.removeCategorie = (name)=>{
		var txt = "Wb removeCategorie"
		var p = ()=> new Promise((resolve,reject)=>{

			this.query("DELETE FROM Categorie WHERE name=?",[safeOp(name,"toLowerCase",null)]).then((s)=>{

				if(s.updated){
					resolve(true);

					if(this.getCategorie[name]){
						let id = this.getCategorie[name][0].id;
						delete this.getCategorie[name];
						delete this.getCategorieByKey[id];
					}
				}
				else{

					
					resolve(false);
				}
			}).catch((e)=>{

				
				reject(e);
			});
		});
		return p;
	}
	this.getCategorie = (name)=>{
		var txt = 'Wb getCategorie';
		
		var p = ()=> new Promise((resolve,reject)=>{
			
			if(this.getCategorie[name])
				return resolve(this.getCategorie[name].slice());

			this.query("SELECT * from Categorie WHERE name=?",[safeOp(name,"toLowerCase",null)]).then((s)=>{
				
				
				resolve(s.data);
				
				if(s.data.length){
					let id = s.data[0].id;
					
					if(!this.getCategorieByKey[id])
						this.getCategorieByKey[id] = this.getCategorie[name] = s.data;
					else
						this.getCategorie[name] = s.data;
				}

			}).catch((e)=>{
				
				
				reject(e);
			})
		});
		return p;
	}
	this.getCategorieByKey = (id)=>{
		var txt = 'Wb getCategorieByKey'
		var p = ()=> new Promise((resolve,reject)=>{
			if(this.getCategorieByKey[id]){
				return resolve(this.getCategorieByKey[id].slice());
			}

			this.query("SELECT * FROM Categorie where id=?",[id]).then((s)=>{
				
				resolve(s.data);
				
				if(s.data.length){
					let name = s.data[0].name;
					if(this.getCategorie[name])
						this.getCategorieByKey[id] = this.getCategorie[name];
					else{
						this.getCategorie[name] = this.getCategorieByKey[id] = s.data;
					}
				}

			}).catch((e)=>{
				
				reject(e);
			});
		});

		return p;
	}
	this.getAllCategories = ()=>{
		var txt = 'Wb getAllCategories';
		var p = ()=> new Promise((resolve,reject)=>{
			
			this.query("SELECT * FROM Categorie",[]).then((s)=>{
				
				
				
				resolve(s.data);
			}).catch((e)=>{
				
				
				reject(e);
			})
		});

		return p; 
	}
	this.insertSong = (name,verses,cat)=>{
		var txt = "Wb insertSong";
		verses = JSON.stringify(verses);

		var p = ()=> new Promise((resolve,reject)=>{

			this.query("INSERT INTO Song(name,verses,cat) VALUES(?,?,?)",[safeOp(name,"toUpperCase",null),verses, cat]).then((s)=>{
					if(s.inserted){
					
					//alert(`${name} inserted`);
					resolve(true);
				}
				else{
					//alert(`${name} Hug`);
					
					resolve(false);
				}
			}).catch((e)=>{
						
					
					reject(e);
			})
		});

		return p;
	}
	this.updateSong = (name,cat,newName,verses)=>{
		var txt = "Wb updateSong";
		name = safeOp(name,"toUpperCase",null);
		newName = safeOp(newName,"toUpperCase",null);
		var sql = "UPDATE Song SET "+((newName)? "name=?"+((verses)? ", verses=?":""): "verses=?")+" WHERE name=? AND cat=?"
		var holder = [(newName)? newName:verses,(newName && verses)? verses:name,((newName && verses))? name:cat,(newName && verses)? cat: null].filter((s) => s);
		console.log("Look at this sql",sql,holder);
		//holder = holder.filter((s) => s);
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					this.query(sql,holder).then((s)=>{
						if(s.updated){
							
							resolve(true);
						}
						else{
							
							resolve(false);
						}
					}).catch((e)=>{
						
						reject(e);
					})
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
	}
	this.deleteSong = (name,cat)=>{
		var txt = "Wb deleteSong"
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					this.query("DELETE FROM Song WHERE name=? AND cat=?",[safeOp(name,"toUpperCase",null),cat]).then((s)=>{
					if(s.updated){
						resolve(true);
					}
					else{
						
						resolve(false);
					}
					}).catch((e)=>{
						
						reject(e);
					})
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
							resolve();
					}).catch(reject);
					break;

				default:
					
					reject({type:'error',message:`Bad Categorie type ${cat}`});
			}
		});
		return p;
	}
	this.getSong = (name,cat)=>{
		var txt = 'Wb getSong';
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					this.query("SELECT * from Song WHERE name=? AND cat=?",[safeOp(name,"toUpperCase",null),cat]).then((s)=>{
						if(s.data.length){
							s.data = s.data.pop();
							s.data.verses = JSON.parse(s.data.verses);
						}
						
						
						resolve(s.data);
					}).catch((e)=>{
						
						reject(e);
					})
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						r = r.pop();
						if(r){
							var id = r.id;
							this.getSong(name,id)().then(resolve).catch(reject);
						}
						else{
							resolve(false);
						}
					}).catch(reject);
					break;

				default:
					
					reject({type:"Error", message:`Wrong type of categorie ${cat}`});
			}

		});
		return p;
	}
	this.getAllSongs = (cat)=>{
		var txt = 'Wb getAllSongs';
		var p = ()=> new Promise((resolve,reject)=>{
			this.query("SELECT * FROM Song WHERE cat=?",[cat]).then((s)=>{
				
				resolve(s.data);
			}).catch((e)=>{
				
				reject(e);
			})
		});
		return p;
	}
	this.countSong = (cat)=>{
		var txt = 'Wb countSong';
		var p = ()=> new Promise((resolve,reject)=>{
			switch(typeof cat){
				case "number":
					this.query("SELECT count(*) as TOTAL FROM Song WHERE cat=?",[cat]).then((s)=>{
						
						resolve(s.data.TOTAL);
					}).catch((e)=>{
						
						reject(e);
					})
					break;
				case "string":
					this.getCategorie(cat)().then((r)=>{
						r = r.pop();
						if(r){
							var id = r.id;
							this.countSong(id)().then(resolve).catch(reject);
						}
						else{
							resolve(false);
						}
					}).catch(reject);
					break;
				default:
					
					reject({type:'error',message:`Bad Categorie type ${cat}`})
			}
		});
		return p;
	}

	function  openDb (name,version="1",size=1024*1024*10){
		var D = openDatabase(name,version,name,size);
		let rowSealed;
		
		try{
			D.query = (sql,datas=[])=>{
				return new Promise((resolve,reject)=>{
					D.transaction((t)=>{
						t.executeSql(sql,datas,(tt,s)=> { 
							var res = [];
							
							//if(s.rows.length){
								
								for(let i=0;;i++){
									let row;
									try{
										
										row = s.rows.item(i);
										
									}
									catch(e){
										
									}
									if(row){
										
										if(row.verses){
											
											if(rowSealed === false){
												
												res.push(row)
											}
											else if(rowSealed){
												
												res.push({...row})
											}
											else{
												
												let oldId = row.id;
												
												row.id = 100;
												
												if(row.id != 100){
													rowSealed = true;
													res.push({...row});
												}
												else{
													
													row.id = oldId;
													rowSealed = false;
													res.push(row);
												}
											}
										}
										else{	
											
											res.push(row);
										}
									}
									else
										break;
								}
							//}
							var r = {data:res, updated:s.rowsAffected};
							try{
								r['inserted'] = s.insertId;
							}
							catch(e){
								r['inserted'] = false;
							}
							resolve(r);
						}, (tt,e)=> { console.error("D.query error",e); reject(e)});
					},(e)=> {  reject(e)},(s)=> resolve(null,s));
				}) 
			}
		}
		catch(e){
			console.error("openDb Catch error",e);
		}

		return D;
	}
}
module.exports = TT;