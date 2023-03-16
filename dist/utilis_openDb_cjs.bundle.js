(self["webpackChunksongs"] = self["webpackChunksongs"] || []).push([["utilis_openDb_cjs"],{

/***/ "./utilis/openDb.cjs":
/*!***************************!*\
  !*** ./utilis/openDb.cjs ***!
  \***************************/
/***/ (function(module) {

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function TT(_ref) {
  var _this = this;
  var name = _ref.name,
    safeOp = _ref.safeOp;
  this.db = openDb(name, "");
  this.query = this.db.query.bind(this.db);
  this.initialize = function () {
    return new Promise(function (resolve, reject) {
      var falsed = false;
      _this.query('CREATE TABLE IF NOT EXISTS Categorie(id varchar(50) primary key, name varchar(50) not null unique)', []).then(function (s) {
        console.log("Table Categorie Created with sucess");
      })["catch"](function (e) {
        console.log("Table Categorie not Created", e);
        falsed = true;
      });
      _this.query("CREATE TABLE IF NOT EXISTS Song(id integer primary key, name varchar(100) not null, verses Text not null, cat varchar(50) not null, unique(name,cat), FOREIGN KEY(cat) REFERENCES Categorie(id))", []).then(function (s) {
        console.log("Table Song Created with Success");
        if (falsed) reject();else resolve();
      })["catch"](function (e) {
        console.log("Table Song not Created", e);
        if (falsed) reject();
      });
    });
  };
  this.initialize();
  this.clear = function () {
    return new Promise(function (resolve, reject) {
      _this.query('DROP TABLE Categorie', []).then(function (s) {
        if (s) {
          console.log("Categorie Table Droped");
          resolve(true);
        } else {
          console.log("Couldn't delete table Categorie", s);
          resolve(false);
        }
      })["catch"](function (e) {
        return console.log("clear Error", e);
      });
      _this.query('DROP TABLE Song', []).then(function (s) {
        if (s) {
          console.log("Song Table Dropped");
          resolve(true);
        } else {
          console.log("Couldn't delete table Song");
          resolve(false);
        }
      })["catch"](function (e) {
        return console.log("clear Error", e);
      });
    });
  };
  this.insertCategorie = function (name, id) {
    var txt = 'Wb insertCategorie';
    var p = function p() {
      return new Promise(function (resolve, reject) {
        _this.query('INSERT INTO Categorie(name,id) VALUES(?,?)', [safeOp(name, "toLowerCase", null), id]).then(function (s) {
          if (s.inserted) {
            resolve(s.inserted);
            _this.getCategorie[name] = [{
              id: s.inserted,
              name: name
            }];
            _this.getCategorieByKey[s.inserted] = _this.getCategorie[name];
          } else {
            resolve(false);
          }
        })["catch"](function (e) {
          reject(e);
        });
      });
    };
    return p;
  };
  this.updateCategorie = function (name, newName) {
    var txt = "Wb updateCategorie ";
    var p = function p() {
      return new Promise(function (resolve, reject) {
        _this.query('UPDATE Categorie SET name=? WHERE name=?', [safeOp(newName, "toLowerCase", null), safeOp(name, "toLowerCase", null)]).then(function (s) {
          if (s.updated) {
            resolve(true);
            if (_this.getCategorie[name]) {
              _this.getCategorie[newName] = _this.getCategorie[name];
              var id = _this.getCategorie[name][0].id;
              _this.getCategorie[newName][0].name = newName;
              if (_this.getCategorieByKey[id]) _this.getCategorieByKey[id][0].name = newName;
            }
          } else {
            resolve(false);
          }
        })["catch"](function (e) {
          reject();
        });
      });
    };
    return p;
  };
  this.removeCategorie = function (name) {
    var txt = "Wb removeCategorie";
    var p = function p() {
      return new Promise(function (resolve, reject) {
        _this.query("DELETE FROM Categorie WHERE name=?", [safeOp(name, "toLowerCase", null)]).then(function (s) {
          if (s.updated) {
            resolve(true);
            if (_this.getCategorie[name]) {
              var id = _this.getCategorie[name][0].id;
              delete _this.getCategorie[name];
              delete _this.getCategorieByKey[id];
            }
          } else {
            resolve(false);
          }
        })["catch"](function (e) {
          reject(e);
        });
      });
    };
    return p;
  };
  this.getCategorie = function (name) {
    var txt = 'Wb getCategorie';
    var p = function p() {
      return new Promise(function (resolve, reject) {
        if (_this.getCategorie[name]) return resolve(_this.getCategorie[name].slice());
        _this.query("SELECT * from Categorie WHERE name=?", [safeOp(name, "toLowerCase", null)]).then(function (s) {
          resolve(s.data);
          if (s.data.length) {
            var id = s.data[0].id;
            if (!_this.getCategorieByKey[id]) _this.getCategorieByKey[id] = _this.getCategorie[name] = s.data;else _this.getCategorie[name] = s.data;
          }
        })["catch"](function (e) {
          reject(e);
        });
      });
    };
    return p;
  };
  this.getCategorieByKey = function (id) {
    var txt = 'Wb getCategorieByKey';
    var p = function p() {
      return new Promise(function (resolve, reject) {
        if (_this.getCategorieByKey[id]) {
          return resolve(_this.getCategorieByKey[id].slice());
        }
        _this.query("SELECT * FROM Categorie where id=?", [id]).then(function (s) {
          resolve(s.data);
          if (s.data.length) {
            var _name = s.data[0].name;
            if (_this.getCategorie[_name]) _this.getCategorieByKey[id] = _this.getCategorie[_name];else {
              _this.getCategorie[_name] = _this.getCategorieByKey[id] = s.data;
            }
          }
        })["catch"](function (e) {
          reject(e);
        });
      });
    };
    return p;
  };
  this.getAllCategories = function () {
    var txt = 'Wb getAllCategories';
    var p = function p() {
      return new Promise(function (resolve, reject) {
        _this.query("SELECT * FROM Categorie", []).then(function (s) {
          resolve(s.data);
        })["catch"](function (e) {
          reject(e);
        });
      });
    };
    return p;
  };
  this.insertSong = function (name, verses, cat) {
    var txt = "Wb insertSong";
    verses = JSON.stringify(verses);
    var p = function p() {
      return new Promise(function (resolve, reject) {
        _this.query("INSERT INTO Song(name,verses,cat) VALUES(?,?,?)", [safeOp(name, "toUpperCase", null), verses, cat]).then(function (s) {
          if (s.inserted) {
            //alert(`${name} inserted`);
            resolve(true);
          } else {
            //alert(`${name} Hug`);

            resolve(false);
          }
        })["catch"](function (e) {
          reject(e);
        });
      });
    };
    return p;
  };
  this.updateSong = function (name, cat, newName, verses) {
    var txt = "Wb updateSong";
    name = safeOp(name, "toUpperCase", null);
    newName = safeOp(newName, "toUpperCase", null);
    var sql = "UPDATE Song SET " + (newName ? "name=?" + (verses ? ", verses=?" : "") : "verses=?") + " WHERE name=? AND cat=?";
    var holder = [newName ? newName : verses, newName && verses ? verses : name, newName && verses ? name : cat, newName && verses ? cat : null].filter(function (s) {
      return s;
    });
    console.log("Look at this sql", sql, holder);
    //holder = holder.filter((s) => s);
    var p = function p() {
      return new Promise(function (resolve, reject) {
        switch (_typeof(cat)) {
          case "number":
            _this.query(sql, holder).then(function (s) {
              if (s.updated) {
                resolve(true);
              } else {
                resolve(false);
              }
            })["catch"](function (e) {
              reject(e);
            });
            break;
          case "string":
            _this.getCategorie(cat)().then(function (r) {
              if (r) {
                var id = r.id;
                _this.updateSong(name, id, newName, verses)().then(resolve)["catch"](reject);
              } else {
                resolve(false);
              }
            })["catch"](reject);
            break;
          default:
            reject({
              type: "Error",
              message: "Wrong categorie type ".concat(cat)
            });
        }
      });
    };
    return p;
  };
  this.deleteSong = function (name, cat) {
    var txt = "Wb deleteSong";
    var p = function p() {
      return new Promise(function (resolve, reject) {
        switch (_typeof(cat)) {
          case "number":
            _this.query("DELETE FROM Song WHERE name=? AND cat=?", [safeOp(name, "toUpperCase", null), cat]).then(function (s) {
              if (s.updated) {
                resolve(true);
              } else {
                resolve(false);
              }
            })["catch"](function (e) {
              reject(e);
            });
            break;
          case "string":
            _this.getCategorie(cat)().then(function (r) {
              if (!Array.isArray(r)) throw Error("response should be array");
              r = r.pop();
              if (r) {
                var id = r.id;
                _this.deleteSong(name, id)().then(resolve)["catch"](reject);
              } else resolve();
            })["catch"](reject);
            break;
          default:
            reject({
              type: 'error',
              message: "Bad Categorie type ".concat(cat)
            });
        }
      });
    };
    return p;
  };
  this.getSong = function (name, cat) {
    var txt = 'Wb getSong';
    var p = function p() {
      return new Promise(function (resolve, reject) {
        switch (_typeof(cat)) {
          case "number":
            _this.query("SELECT * from Song WHERE name=? AND cat=?", [safeOp(name, "toUpperCase", null), cat]).then(function (s) {
              if (s.data.length) {
                s.data = s.data.pop();
                s.data.verses = JSON.parse(s.data.verses);
              }
              resolve(s.data);
            })["catch"](function (e) {
              reject(e);
            });
            break;
          case "string":
            _this.getCategorie(cat)().then(function (r) {
              r = r.pop();
              if (r) {
                var id = r.id;
                _this.getSong(name, id)().then(resolve)["catch"](reject);
              } else {
                resolve(false);
              }
            })["catch"](reject);
            break;
          default:
            reject({
              type: "Error",
              message: "Wrong type of categorie ".concat(cat)
            });
        }
      });
    };
    return p;
  };
  this.getAllSongs = function (cat) {
    var txt = 'Wb getAllSongs';
    var p = function p() {
      return new Promise(function (resolve, reject) {
        _this.query("SELECT * FROM Song WHERE cat=?", [cat]).then(function (s) {
          resolve(s.data);
        })["catch"](function (e) {
          reject(e);
        });
      });
    };
    return p;
  };
  this.countSong = function (cat) {
    var txt = 'Wb countSong';
    var p = function p() {
      return new Promise(function (resolve, reject) {
        switch (_typeof(cat)) {
          case "number":
            _this.query("SELECT count(*) as TOTAL FROM Song WHERE cat=?", [cat]).then(function (s) {
              resolve(s.data.TOTAL);
            })["catch"](function (e) {
              reject(e);
            });
            break;
          case "string":
            _this.getCategorie(cat)().then(function (r) {
              r = r.pop();
              if (r) {
                var id = r.id;
                _this.countSong(id)().then(resolve)["catch"](reject);
              } else {
                resolve(false);
              }
            })["catch"](reject);
            break;
          default:
            reject({
              type: 'error',
              message: "Bad Categorie type ".concat(cat)
            });
        }
      });
    };
    return p;
  };
  function openDb(name) {
    var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "1";
    var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1024 * 1024 * 10;
    var D = openDatabase(name, version, name, size);
    var rowSealed;
    try {
      D.query = function (sql) {
        var datas = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        return new Promise(function (resolve, reject) {
          D.transaction(function (t) {
            t.executeSql(sql, datas, function (tt, s) {
              var res = [];

              //if(s.rows.length){

              for (var i = 0;; i++) {
                var row = void 0;
                try {
                  row = s.rows.item(i);
                } catch (e) {}
                if (row) {
                  if (row.verses) {
                    if (rowSealed === false) {
                      res.push(row);
                    } else if (rowSealed) {
                      res.push(_objectSpread({}, row));
                    } else {
                      var oldId = row.id;
                      row.id = 100;
                      if (row.id != 100) {
                        rowSealed = true;
                        res.push(_objectSpread({}, row));
                      } else {
                        row.id = oldId;
                        rowSealed = false;
                        res.push(row);
                      }
                    }
                  } else {
                    res.push(row);
                  }
                } else break;
              }
              //}
              var r = {
                data: res,
                updated: s.rowsAffected
              };
              try {
                r['inserted'] = s.insertId;
              } catch (e) {
                r['inserted'] = false;
              }
              resolve(r);
            }, function (tt, e) {
              console.error("D.query error", e);
              reject(e);
            });
          }, function (e) {
            reject(e);
          }, function (s) {
            return resolve(null, s);
          });
        });
      };
    } catch (e) {
      console.error("openDb Catch error", e);
    }
    return D;
  }
}
module.exports = TT;

/***/ })

}]);
//# sourceMappingURL=utilis_openDb_cjs.bundle.js.map