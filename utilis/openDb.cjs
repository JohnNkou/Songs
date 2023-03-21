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
				}
				else{
					resolve(false);
				}
			}).catch(reject);
		});
		return p;
	}
	this.updateCategorie = (name,newName)=>{
		var txt = "Wb updateCategorie ";
		var p = ()=>  new Promise((resolve,reject)=>{
			this.query('UPDATE Categorie SET name=? WHERE name=?',[safeOp(newName,"toLowerCase",null),safeOp(name,"toLowerCase",null)]).then((s)=>{
				if(s.updated){
					resolve(true);
				}
				else{
					resolve(false)
				}
			}).catch(reject)
		});

		return p;
	}
	this.removeCategorie = (id)=>{
		var txt = "Wb removeCategorie"
		var p = ()=> new Promise((resolve,reject)=>{
			this.query("DELETE FROM Categorie WHERE id=?",[id]).then((s)=>{
				if(s.updated){
					resolve(true);
				}
				else{
					resolve(false);
				}
			}).catch(reject);
		});
		return p;
	}
	this.getCategorie = (id)=>{
		var txt = 'Wb getCategorie';
		
		var p = ()=> new Promise((resolve,reject)=>{
			this.query("SELECT * from Categorie WHERE id=?",[id]).then((s)=>{
				resolve(s.data);
			}).catch(reject)
		});
		return p;
	}
	this.getAllCategories = ()=>{
		var txt = 'Wb getAllCategories';
		var p = ()=> new Promise((resolve,reject)=>{
			this.query("SELECT * FROM Categorie",[]).then((s)=>{
				resolve(s.data);
			}).catch(reject)
		});

		return p; 
	}
	this.insertSong = (name,verses,cat)=>{
		var txt = "Wb insertSong";
		verses = JSON.stringify(verses),
		p = ()=> new Promise((resolve,reject)=>{
			this.query("INSERT INTO Song(name,verses,cat) VALUES(?,?,?)",[safeOp(name,"toUpperCase",null),verses, cat]).then((s)=>{
				if(s.inserted){
					resolve(true);
				}
				else{
					resolve(false);
				}
			}).catch(reject)
		});

		return p;
	}
	this.updateSong = (name,cat,newName,verses)=>{
		var txt = "Wb updateSong",
		name = safeOp(name,"toUpperCase",null),
		newName = safeOp(newName,"toUpperCase",null),
		sql = "UPDATE Song SET "+((newName)? "name=?"+((verses)? ", verses=?":""): "verses=?")+" WHERE name=? AND cat=?",
		holder = [(newName)? newName:verses,(newName && verses)? verses:name,((newName && verses))? name:cat,(newName && verses)? cat: null].filter((s) => s),
		p = ()=> new Promise((resolve,reject)=>{
			this.query(sql,holder).then((s)=>{
				if(s.updated){
					resolve(true);
				}
				else{
					resolve(false);
				}
			}).catch(reject)
		});
		return p;
	}
	this.deleteSong = (name,cat)=>{
		var txt = "Wb deleteSong",
		p = ()=> new Promise((resolve,reject)=>{
			this.query("DELETE FROM Song WHERE name=? AND cat=?",[safeOp(name,"toUpperCase",null),cat]).then((s)=>{
				if(s.updated){
					resolve(true);
				}
				else{
					resolve(false);
				}
			}).catch(reject)
		});
		return p;
	}
	this.getSong = (name,cat)=>{
		var txt = 'Wb getSong',
		p = ()=> new Promise((resolve,reject)=>{
			this.query("SELECT * from Song WHERE name=? AND cat=?",[safeOp(name,"toUpperCase",null),cat]).then((s)=>{
				if(s.data.length){
					s.data = s.data.pop();
					s.data.verses = JSON.parse(s.data.verses);
				}
				resolve(s.data);
			}).catch(reject)

		});
		return p;
	}
	this.getAllSongs = (cat)=>{
		var txt = 'Wb getAllSongs',
		p = ()=> new Promise((resolve,reject)=>{
			this.query("SELECT * FROM Song WHERE cat=?",[cat]).then((s)=>{
				resolve(s.data);
			}).catch(reject)
		});
		return p;
	}
	this.deleteCategorieSong = (catId)=>{
		var txt = 'Wb deleteCategorieSong',
		p = ()=> new Promise((resolve,reject)=>{
			this.query("DELETE FROM Song WHERE cat=?",[catId]).then((s)=>{
				if(s.updated){
					resolve(true);
				}
				else{
					resolve(false);
				}
			}).catch(reject)
		})
	}
	this.countSong = (cat)=>{
		var txt = 'Wb countSong',
		p = ()=> new Promise((resolve,reject)=>{
			this.query("SELECT count(*) as TOTAL FROM Song WHERE cat=?",[cat]).then((s)=>{
				resolve(s.data.TOTAL);
			}).catch(reject)
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