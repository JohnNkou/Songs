(self["webpackChunksongs"] = self["webpackChunksongs"] || []).push([["indexDb"],{

/***/ "./utilis/indexDb.cjs":
/*!****************************!*\
  !*** ./utilis/indexDb.cjs ***!
  \****************************/
/***/ (function(module) {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function TTT(_ref) {
  var _this = this;
  var safeOp = _ref.safeOp,
    seq = _ref.seq;
  function dealWithConstraint(error) {
    if (error.name.toLowerCase() == "constrainterror") {
      return {
        name: error.name,
        code: 6,
        message: error.message
      };
    }
    return error;
  }
  function toL(name) {
    return safeOp(name, "toLowerCase", null);
  }
  this.initialize = function () {
    return new Promise(function (resolve, reject) {
      if (_this.version) {
        _this.version++;
      } else _this.version = 1;
      var request = indexedDB.open('Test', _this.version);
      request.onupgradeneeded = function () {
        var db = request.result;
        console.log("Hey, I'm called");
        var store1 = db.createObjectStore('Categorie', {
            autoIncrement: true
          }),
          store2 = db.createObjectStore('Song', {
            autoIncrement: true
          });
        var req1 = store1.createIndex("by_name", "name", {
            unique: true
          }),
          req2 = store2.createIndex("by_song_cat", ["name", "cat"], {
            unique: true
          }),
          req3 = store2.createIndex("by_cat", "cat"),
          req4 = store1.createIndex("by_id", "id", {
            unique: true
          });
        var i1 = function i1() {
            return new Promise(function (resolve, reject) {
              req1.onsuccess = function () {
                return resolve(true);
              };
              req1.onerror = function () {
                return reject(req1.error);
              };
            });
          },
          i2 = function i2() {
            return new Promise(function (resolve, reject) {
              req2.onsuccess = function () {
                return resolve(true);
              };
              req2.onerror = function () {
                return reject(req2.error);
              };
            });
          },
          i3 = function i3() {
            return new Promise(function (resolve, reject) {
              req3.onsuccess = function () {
                return resolve(true);
              };
              req3.onerror = function () {
                return reject(req3.error);
              };
            });
          },
          i4 = function i4() {
            return new Promise(function (resolve, reject) {
              req4.onsuccess = function () {
                return resolve(true);
              };
              req4.onerror = function () {
                return reject(req4.error);
              };
            });
          };
        Promise.all([i1(), i2(), i3(), i4()]).then(resolve)["catch"](function (e) {
          console.error("Couldn't initial the database", e);
        });
      };
      request.onblocked = function () {
        console.log("Hey, someone is blocking me");
      };
      request.onerror = function () {
        return reject(request.error);
      };
    });
  };
  this.initialize()["catch"](function (e) {
    console.error("Initializing indexedDB Error", e);
  });
  this.clear = function () {
    return new Promise(function (resolve, reject) {
      var request = indexedDB.open('Test', _this.version + 1);
      console.log("The database version is", _this.version);
      request.onupgradeneeded = function () {
        console.log("Choops");
        var db = request.result;
        try {
          Array.prototype.forEach.call(db.objectStoreNames, function (o) {
            db.deleteObjectStore(o);
          });
          resolve(true);
        } catch (e) {
          console.log("Clear Error", e);
          reject(e);
        }
      };
      request.onerror = function () {
        console.log("Clear Error", request, error);
        reject(request.error);
      };
    });
  };
  this.txR = function (f, e) {
    var request = indexedDB.open('Test');
    request.onsuccess = function () {
      var db = request.result;
      db.onversionchange = function () {
        console.log("Some is trying to change version");
        db.close();
      };
      if (!_this.version) _this.version = db.version;
      if (!db.objectStoreNames.length) {
        _this.initialize().then(function () {
          return _this.txR(f, e);
        })["catch"](function (er) {
          return e(er);
        });
      } else {
        var tx = db.transaction(db.objectStoreNames, 'readonly');
        f(tx);
      }
    };
    request.onerror = function () {
      e(request.error);
    };
  };
  this.txW = function (f, e) {
    var request = indexedDB.open('Test');
    request.onsuccess = function () {
      var db = request.result;
      db.onversionchange = function () {
        console.log("Someone is trying to change version");
        db.close();
      };
      if (!_this.version) _this.version = db.version;
      if (!db.objectStoreNames.length) {
        _this.initialize().then(function () {
          return _this.txW(f, e);
        })["catch"](function (er) {
          return e(er);
        });
      } else {
        var tx = db.transaction(db.objectStoreNames, 'readwrite');
        f(tx);
      }
    };
    request.onerror = function () {
      e(request.error);
    };
  };
  this.insertCategorie = function (name, id) {
    var txt = 'insertCategorie',
      tx = _this.txW,
      p = function p() {
        return new Promise(function (resolve, reject) {
          tx(function (tx) {
            var store = tx.objectStore("Categorie");
            var request = store.put({
              name: toL(name, id),
              id: id
            });
            request.onsuccess = function (e) {
              resolve(request.result);
            };
            request.onerror = function (e) {
              e.preventDefault();
              reject(dealWithConstraint(request.error));
            };
          }, function (e) {
            sameCompose(reject, trError);
          });
        });
      };
    return p;
  };
  this.updateCategorie = function (name, newName) {
    var txt = 'updateCategorie',
      tx = _this.txW,
      p = function p() {
        return new Promise(function (resolve, reject) {
          tx(function (tx) {
            var index = tx.objectStore("Categorie").index("by_name");
            var request = index.openCursor(IDBKeyRange.only(toL(name)));
            request.onsuccess = function () {
              var cursor = request.result;
              if (cursor) {
                var req = cursor.update({
                  name: toL(newName)
                });
                req.onsuccess = function (e) {
                  resolve(Boolean(req.result));
                };
                req.onerror = function (e) {
                  reject(dealWithConstraint(req.error));
                };
              } else {
                resolve(false);
              }
            };
            request.onerror = function (e) {
              e.preventDefault();
              reject(dealWithConstraint(request.error));
            };
          }, function (e) {
            sameCompose(reject, trError);
          });
        });
      };
    return p;
  };
  this.removeCategorie = function (id) {
    var txt = "removeCategorie",
      tx = _this.txW,
      p = function p() {
        return new Promise(function (resolve, reject) {
          _this.deleteCategorieSong(id)().then(function (r) {
            if (r) {
              tx(function (tx) {
                var index = tx.objectStore("Categorie").index("by_id"),
                  request = index.openCursor(IDBKeyRange.only(id));
                request.onsuccess = function (e) {
                  var cursor = request.result;
                  if (cursor) {
                    var req = cursor["delete"]();
                    req.onsuccess = function (e) {
                      resolve(!req.result);
                    };
                    req.onerror = function (e) {
                      e.preventDefault();
                      reject(dealWithConstraint(req.error));
                    };
                  } else {
                    resolve(true);
                  }
                };
                request.onerror = function (e) {
                  e.preventDefault();
                  reject(dealWithConstraint(request.error));
                };
              }, function (e) {
                return sameCompose(reject, trError);
              });
            } else {
              console.error("Couldn't delete all the song of the categorie");
              resolve(false);
            }
          })["catch"](reject);
        });
      };
    return p;
  };
  this.getCategorie = function () {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var txt = 'getCategorie',
      tx = _this.txR,
      p = function p() {
        return new Promise(function (resolve, reject) {
          tx(function (tx) {
            var index = tx.objectStore("Categorie").index("by_id"),
              request = index.openCursor(toL(id));
            request.onsuccess = function (e) {
              var cursor = request.result;
              if (cursor) {
                resolve([_objectSpread({
                  id: cursor.primaryKey
                }, cursor.value)]);
              } else {
                resolve([]);
              }
            };
            request.onerror = function (e) {
              e.preventDefault();
              reject(dealWithConstraint(request.error));
            };
          }, function (e) {
            sameCompose(reject, trError);
          });
        });
      };
    return p;
  };
  this.getCategorieByKey = function () {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var txt = 'getCategorieByKey',
      tx = _this.txR;
    p = function p() {
      return new Promise(function (resolve, reject) {
        tx(function (tx) {
          var index = tx.objectStore("Categorie").index("by_id"),
            request = index.openCursor(id);
          request.onsuccess = function (s) {
            var cursor = request.result;
            if (cursor) {
              resolve(_objectSpread({
                id: cursor.key
              }, cursor.value));
            } else {
              resolve(cursor);
            }
          };
          request.onerror = function (e) {
            e.preventDefault();
            reject(dealWithConstraint(request.error));
          };
        }, function (e) {
          return sameCompose(reject, trError);
        });
      });
    };
    return p;
  };
  this.getAllCategories = function () {
    var txt = "getAllCategories",
      tx = _this.txR,
      p = function p() {
        return new Promise(function (resolve, reject) {
          tx(function (tx) {
            var index = tx.objectStore("Categorie").index("by_name");
            var request = index.getAll && index.getAll() || index.mozGetAll && index.mozGetAll();
            if (request) {
              request.onsuccess = function (e) {
                resolve(request.result);
              };
              request.onerror = function (e) {
                e.preventDefault();
                reject(dealWithConstraint(request.error));
              };
            } else {
              request = index.openCursor();
              var result = [];
              request.onsuccess = function (e) {
                var cursor = request.result;
                if (!cursor) {
                  console.log("getAllCategorie result", result);
                  resolve(result);
                } else {
                  result.push(cursor.value);
                  cursor["continue"]();
                }
              };
              request.onerror = function (e) {
                console.error("getAllCategorie count Error", e);
              };
            }
          }, function (e) {
            return sameCompose(reject, trError);
          });
        });
      };
    return p;
  };
  this.insertSong = function (name, verses, cat) {
    var txt = 'insertSong',
      tx = _this.txW,
      p = function p() {
        return new Promise(function (resolve, reject) {
          _this.getCategorieByKey(cat)().then(function (r) {
            if (r) {
              tx(function (tx) {
                var store = tx.objectStore("Song");
                var request = store.put({
                  name: toL(name),
                  verses: verses,
                  cat: cat
                });
                request.onsuccess = function (e) {
                  resolve(Boolean(request.result));
                };
                request.onerror = function (e) {
                  e.preventDefault();
                  reject(dealWithConstraint(request.error));
                };
              }, function (e) {
                return sameCompose(reject, trError);
              });
            } else {
              reject({
                message: "Foreign key constrain violated",
                type: "error"
              });
            }
          })["catch"](reject);
        });
      };
    return p;
  };
  this.updateSong = function (name, cat, newName, verses) {
    var txt = "updateSong",
      tx = _this.txW,
      p = function p() {
        return new Promise(function (resolve, reject) {
          tx(function (tx) {
            var index = tx.objectStore("Song").index("by_song_cat");
            var request = index.openCursor(IDBKeyRange.only([toL(name), cat]));
            request.onsuccess = function (e) {
              var cursor = request.result;
              if (cursor) {
                var value = cursor.value,
                  req = cursor.update({
                    name: toL(newName) || value.name,
                    verses: verses || value.verses,
                    cat: cat
                  });
                req.onsuccess = function (e) {
                  resolve(Boolean(req.result));
                };
                req.onerror = function (e) {
                  e.preventDefault();
                  reject(dealWithConstraint(req.error));
                };
              } else {
                reject(false);
              }
            };
            request.onerror = function (e) {
              e.preventDefault();
              reject(dealWithConstraint(request.error));
            };
          }, function (e) {
            return sameCompose(reject, trError);
          });
        });
      };
    return p;
  };
  this.deleteSong = function (name, cat) {
    var txt = 'deleteSong',
      tx = _this.txW,
      p = function p() {
        return new Promise(function (resolve, reject) {
          tx(function (tx) {
            var index = tx.objectStore("Song").index("by_song_cat");
            var request = index.openCursor(IDBKeyRange.only([toL(name), cat]));
            request.onsuccess = function (e) {
              var cursor = request.result;
              if (cursor) {
                var req = cursor["delete"]();
                req.onsuccess = function (e) {
                  resolve(!req.result);
                };
                req.onerror = function (e) {
                  e.preventDefault();
                  reject(dealWithConstraint(req.error));
                };
              } else {
                resolve(false);
              }
            };
            request.onerror = function (e) {
              e.preventDefault();
              reject(dealWithConstraint(request.error));
            };
          }, function (e) {
            return sameCompose(reject, trError);
          });
        });
      };
    return p;
  };
  this.deleteCategorieSong = function (catId) {
    var txt = 'deleteCategorieSong',
      tx = _this.txW,
      p = function p() {
        return new Promise(function (resolve, reject) {
          tx(function (tx) {
            var index = tx.objectStore("Song").index("by_cat"),
              request2 = index.count(catId);
            request2.onsuccess = function () {
              var totalSong = request2.result;
              if (totalSong) {
                request = index.openCursor(catId);
                request.onsuccess = function (e) {
                  var cursor = request.result;
                  if (cursor) {
                    var req = cursor["delete"]();
                    req.onsuccess = function (e) {
                      if (! --totalSong) {
                        resolve(true);
                      }
                    };
                    req.onerror = function (e) {
                      e.preventDefault();
                      reject(dealWithConstraint(req.error));
                    };
                    cursor["continue"]();
                  } else {
                    if (!totalSong) {
                      resolve(true);
                    } else {
                      console.error(totalSong, "where not deleted");
                      resolve(false);
                    }
                  }
                };
                request.onerror = function (e) {
                  e.preventDefault();
                  reject(dealWithConstraint(request.error));
                };
              } else {
                resolve(true);
              }
            };
            request2.onerror = function (e) {
              e.preventDefault();
              reject(dealWithConstraint(request2.error));
            };
          }, function (e) {
            return sameCompose(reject, trError);
          });
        });
      };
    return p;
  };
  this.getSong = function (name, cat) {
    var txt = 'getSong',
      tx = _this.txR,
      p = function p() {
        return new Promise(function (resolve, reject) {
          tx(function (tx) {
            var index = tx.objectStore("Song").index("by_song_cat");
            var request = index.openCursor([name, cat]);
            request.onsuccess = function (e) {
              var cursor = request.result;
              if (cursor) {
                resolve([_objectSpread({
                  id: cursor.primaryKey
                }, cursor.value)]);
              } else {
                resolve([]);
              }
            };
            request.onerror = function (e) {
              e.preventDefault();
              reject(dealWithConstraint(request.error));
            };
          }, function (e) {
            return sameCompose(reject, trError);
          });
        });
      };
    return p;
  };
  this.getAllSongs = function (id) {
    var txt = 'getAllSongs',
      tx = _this.txR,
      p = function p() {
        return new Promise(function (resolve, reject) {
          //console.log("Here is the typeof cat",typeof cat);
          tx(function (tx) {
            var index = tx.objectStore("Song").index("by_cat");
            var request = index.getAll && index.getAll(id) || index.mozGetAll && index.mozGetAll(id);
            if (request) {
              request.onsuccess = function (e) {
                resolve(request.result);
              };
              request.onerror = function (e) {
                e.preventDefault();
                reject(dealWithConstraint(request.error));
              };
            } else {
              request = index.openCursor(id);
              var result = [];
              request.onsuccess = function () {
                var cursor = request.result;
                if (!cursor) {
                  resolve(result);
                } else {
                  result.push(cursor.value);
                  cursor["continue"]();
                }
              };
              request.onerror = function (e) {
                console.log("getAllSong openCursor error", e, request.error);
              };
            }
          }, function (e) {
            return sameCompose(reject, trError);
          });
        });
      };
    return p;
  };
  this.countSong = function (cat) {
    var txt = 'countSong',
      tx = _this.txR,
      p = function p() {
        return new Promise(function (resolve, reject) {
          tx(function (tx) {
            var index = tx.objectStore("Song").index("by_cat");
            var request = index.count(cat);
            request.onsuccess = function (e) {
              resolve(request.result);
            };
            request.onerror = function (e) {
              e.preventDefault();
              reject(dealWithConstraint(request.error));
            };
          }, function (e) {
            return sameCompose(reject, trError);
          });
        });
      };
    return p;
  };
}
module.exports = TTT;

/***/ })

}]);
//# sourceMappingURL=indexDb.js.map