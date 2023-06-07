"use strict";
(self["webpackChunksongs"] = self["webpackChunksongs"] || []).push([["guider"],{

/***/ "./utilis/guider.js":
/*!**************************!*\
  !*** ./utilis/guider.js ***!
  \**************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "stepManager": function() { return /* binding */ stepManager; }
/* harmony export */ });
/* harmony import */ var _BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BrowserDb.cjs */ "./utilis/BrowserDb.cjs");
/* harmony import */ var _utilities_cjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities.cjs */ "./utilis/utilities.cjs");
/* harmony import */ var _aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./aCreator.cjs */ "./utilis/aCreator.cjs");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }




function checkDbSupport() {
  return window.openDatabase || window.indexedDB || null;
}
function revertAction(action) {
  var oldProcess = action.doProcess();
  var oldText = action.getText();
  var oldTitle = action.getTitle();
  var oldClearer = action.getClearer();
  var problematics = [function () {
    action.addProcess(oldProcess);
    action.addText("");
    action.addText(oldText);
    action.addTitle(oldTitle);
    action.addClearer(oldClearer);
  }];
  action.addToStore({
    problematics: problematics
  });
}
function toOriginalState(initials) {
  var state;
  while (state = initials.pop()) {
    if (state.length == 3) state[0][state[1]] = state[2];else if (state.length == 4) state[0][state[1]][state[2]] = state[3];else throw Error("toOriginalState state: state length not anticipated");
  }
}
function actionHasReset(action) {
  var clear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (action.getReset()) {
    triggerCleaner(action, clear);
    action.reset(false);
    return true;
  }
  return false;
}
var originalBorder = function () {
  if (window.navigator.userAgent.indexOf('MSIE') != -1) return originalBackground;else {
    return function (initial, nodes) {
      if (!nodes.pop || typeof nodes.pop != "function") nodes = [nodes];
      nodes.forEach(function (node) {
        initial.push([node, 'style', 'border', getComputedStyle(node).border]);
      });
      return initial[initial.length - 1][3];
    };
  }
}();
function originalBackground(initial, nodes) {
  if (!nodes.pop) nodes = [nodes];
  nodes.forEach(function (node) {
    return initial.push([node, 'style', 'backgroundColor', getComputedStyle(node).backgroundColor]);
  });
  return initial[initial.length - 1][3];
}
function moveToBottom(div1, div2, action) {
  return new Promise(function (resolve, reject) {
    var _helpWithCoordinate = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.helpWithCoordinate)(div1, div2),
      coordi1 = _helpWithCoordinate.coordi1,
      coordi2 = _helpWithCoordinate.coordi2,
      trace = 0;
    var c2Height = coordi2.top + coordi2.height;
    if (coordi1.top < c2Height) {
      action.addToStore({
        coordi1: _objectSpread({}, coordi1),
        coordi2: _objectSpread({}, coordi2)
      });
      var r1 = window.innerHeight - c2Height;
      var c11 = setInterval(function () {
        div1.style.top = ++coordi1.top + "%";
        if (coordi1.top >= c2Height) {
          clearInterval(c11);
          trace--;
          if (!trace) resolve(true);
        }
      }, 10);
      trace++;
      if (coordi1.height > r1) {
        var c22 = setInterval(function () {
          div1.style.top = --coordi1.height + "%";
          if (coordi1.height <= r1) {
            clearInterval(c22);
            trace--;
            if (!trace) resolve(true);
          }
        }, 10);
        trace++;
      }
    } else resolve(true);
  });
}
function moveToOriginalPosition(div1, div2, coord) {
  return new Promise(function (resolve, reject) {
    var _helpWithCoordinate2 = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.helpWithCoordinate)(div1, div2),
      coordi1 = _helpWithCoordinate2.coordi1,
      coordi2 = _helpWithCoordinate2.coordi2,
      trace = 0;
    if (coord.coordi1) {
      var coord1 = coord.coordi1,
        pos = ["left", "right", "top", "height"],
        i = 0,
        _trace = 0;
      var _loop = function _loop() {
        var currentPos = pos[i];
        if (coord1[currentPos] != coordi1[currentPos]) {
          var diff = coordi1[currentPos] > coord1[currentPos] ? -1 : 1;
          var c1 = setInterval(function () {
            coordi1[currentPos] = coordi1[currentPos] + diff;
            div1.style[currentPos] = coordi1[currentPos] + "%";
            if (coordi1[currentPos] == coord1[currentPos]) {
              clearInterval(c1);
              _trace--;
              if (!_trace) resolve(true);
            }
          });
          _trace++;
        }
      };
      for (; i < pos.length; i++) {
        _loop();
      }
    } else resolve(true);
  });
}
function originalDisabled(initial, nodes) {
  if (!nodes.pop) nodes = [nodes];
  nodes.forEach(function (node) {
    return initial.push([node, 'disabled', false]);
  });
  return initial[initial.length - 1][3];
}
function originalValue(initial, nodes) {
  if (!nodes.pop) nodes = [nodes];
  nodes.forEach(function (node) {
    return initial.push([node, 'value', '']);
  });
}
function animateBackground(nodes, c) {
  if (!nodes.pop) nodes = [nodes];
  var second = nodes.length > 10 ? 80 : 40;
  nodes.slice(0, 20).forEach(function (node) {
    var n = 0;
    animate(function () {
      node.style.backgroundColor = "rgba(0,255,0,".concat(Math.max(0.1, n++ % 11 / 10), ")");
    }, second, c);
  });
  return c;
}
var animateBorder = function () {
  if (window.navigator.userAgent.indexOf('MSIE') != -1) {
    return animateBackground;
  } else return function (nodes) {
    if (!nodes.pop) nodes = [nodes];
    var c = [];
    var second = nodes.length > 10 ? 80 : 40;
    nodes.slice(0, 20).forEach(function (node) {
      var n = 0;
      animate(function () {
        node.style.border = "1px solid rgba(0,255,0,".concat(Math.max(0.1, n++ % 11 / 10), ")");
      }, second, c);
    });
    return c;
  };
}();
var animate = function () {
  if (window.requestAnimationFrame) {
    return function (t, s, counters) {
      var last;
      var Frame = function Frame(time) {
        if (!last) {
          last = time;
          t();
        } else {
          if (time - last > s) {
            last = time;
            t();
          }
        }
        counters.push(requestAnimationFrame(Frame));
        counters.shift();
      };
      counters.push(requestAnimationFrame(Frame));
    };
  } else {
    return function (t, s, counters) {
      counters.push(setInterval(t, s));
    };
  }
}();
function addListener(l, nodes, type, fn) {
  if (!nodes.pop) nodes = [nodes];
  nodes.forEach(function (node) {
    node.addEventListener(type, node.fn = fn, false);
    l.push([node, type, node]);
  });
  return l.length;
}
var clearCounters = function () {
  if (window.requestAnimationFrame) {
    return function (counters) {
      var cnt;
      while (cnt = counters.pop()) {
        cancelAnimationFrame(cnt);
      }
    };
  } else {
    return function (counters) {
      var cnt;
      while (cnt = counters.pop()) clearInterval(cnt);
    };
  }
}();
function removeListeners(listeners) {
  var listener;
  while (listener = listeners.pop()) {
    listener[0].removeEventListener(listener[1], listener[2].fn, false);
    delete listener[2].fn;
  }
}
function Unsubscriber(subscribers) {
  var unsubscribe;
  while (unsubscribe = subscribers.pop()) unsubscribe();
}
function clearProblems(problems) {
  var problem;
  while (problem = problems.pop()) problem();
}
function clearPreviousAction(actions) {
  var action;
  while (action = actions.pop()) action.getClearer()();
}
function dispatchReverser(actions) {
  var action;
  while (action = actions.pop()) {
    action[0].dispatch(action[1](action[2]));
  }
}
function triggerCleaner(action) {
  var clear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var _action$getStore = action.getStore(),
    initialState = _action$getStore.initialState,
    counters = _action$getStore.counters,
    listeners = _action$getStore.listeners,
    actionsReverser = _action$getStore.actionsReverser,
    subscribers = _action$getStore.subscribers,
    problematics = _action$getStore.problematics,
    previousActions = _action$getStore.previousActions;
  softCleaner(initialState, counters, listeners, actionsReverser, subscribers, problematics, previousActions);
  if (clear) action.clearStore();
}
function softCleaner(initials, counters, listeners, actionsReverser, subscribers, problematics, previousActions) {
  if (initials) toOriginalState(initials);
  if (counters) clearCounters(counters);
  if (listeners) removeListeners(listeners);
  if (subscribers) Unsubscriber(subscribers);
  if (actionsReverser) dispatchReverser(actionsReverser);
  if (problematics) clearProblems(problematics);
  if (previousActions) clearPreviousAction(previousActions);
}
function meticulus(selector, payload) {
  window.mountNotifier[selector] = [payload];
}
function stepManager(store, Text) {
  function forceUpdate(node, value) {
    store.dispatch((0,_aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.setForceUpdate)({
      node: node,
      value: value
    }));
  }
  function updateSelector(selector, value) {
    store.dispatch((0,_aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.setSelector)({
      selector: selector,
      value: value
    }));
  }
  function withVerseShowing() {
    return store.getState().selector.withVerse;
  }
  var Ms = new _utilities_cjs__WEBPACK_IMPORTED_MODULE_2__.step().addStep().addStep().addStep().addStep().addStep();
  Ms.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Welcome" : "Bienvenu";
  });
  var Ms_s1 = Ms.section;
  Ms_s1.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "En";
    return "Presentation";
  });
  Ms_s1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "This tutoriel will guide across some of the fonctionnalities of the app. And Believe me, there are many." : "Ce tutoriel vous aidera à decouvrir toute les fonctionnalités presenté par l'application, et croyez moi il y en a plusieur";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Each tutorial is made of step, and each step of sections." : "Chaque tutoriel est constitué des etapes, et chaque etapes est constitués de sections";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "In the bottom, you'll find step navigation which will allow you to go to the next or previous step" : "Les navigations d'etapes situé en bas de la fenetre du tutoriel vous permettrons d'aller vers l'etapes suivante ou precedentes";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "In each step with many section in it, you'll find navigations link. They will be located at the top" : "Pour chaque etapes contenant plusieurs sections, des liens de navigations des etapes seront pourvu en haut du tutoriel";
  }]);
  var Ms2 = Ms.nextStep;
  Ms2.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? 'Category' : 'Categorie';
  });
  var Ms2_s1 = Ms2.section.addSection().addSection();
  Ms2_s1.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Listing" : "Affichage";
  });
  Ms2_s1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "All of the songs in the app are grouped in categories" : "Les differentes chansons de l'application sont regroupé par categorie.";
  }]);
  var Ms2_s1_a1 = Ms2_s1.action.addAction();
  Ms2_s1_a1.addText(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To see all of the available categories, click in the blinking section at the top of the app" : "Pour afficher les categories disponible veuillez cliquer la section clignotante en haut à gauche de la page";
  });
  Ms2_s1_a1.addAnchor([".head .c1"]);
  Ms2_s1_a1.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var settings = function settings() {
        var action = Ms2_s1_a1;
        var catCliquer = document.querySelector(anchor[0]).firstElementChild;
        var counters = [];
        var listeners = [];
        var initialState = [];
        animateBackground(catCliquer, counters);
        originalBackground(initialState, catCliquer);
        addListener(listeners, catCliquer, 'click', function (event) {
          event.preventDefault();
          action.getClearer()();
          meticulus("catNames", function () {
            return resolve(true);
          });
        });
        action.addToStore({
          initialState: initialState,
          counters: counters,
          listeners: listeners
        });
      };
      if (store.getState().ui.show.catList) {
        store.dispatch((0,_aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeCatListView)(false));
        meticulus("catNames", settings);
      } else settings();
    });
  });
  Ms2_s1_a1.addClearer(function (anchor) {
    var action = Ms2_s1_a1;
    triggerCleaner(action);
    return Promise.resolve(true);
  });
  var Ms2_s1_a2 = Ms2_s1_a1.nextAction;
  Ms2_s1_a2.addAnchor([".catNames"]);
  Ms2_s1_a2.addTitle("");
  Ms2_s1_a2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You'll see a list of the available categories" : "Vous verez apparaitre la liste des categorie";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can also add your own category" : "Vous avez egalement la possibilité d'ajouter une categorie";
  }]);
  Ms2_s1_a2.addClearer(function (anchor) {
    if (store.getState().ui.show.catList) store.dispatch((0,_aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeCatListView)(false));
    return Promise.resolve(true);
  });
  var Ms2_s2 = Ms2_s1.nextSection;
  Ms2_s2.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Add a Category" : "Ajouter une Categorie";
  });
  Ms2_s2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can also add your own categorie" : "Vous avez egalement la possibilité d'ajouter vos propres categorie";
  }]);
  var Ms2_s2_a1 = Ms2_s2.action.addAction().addAction();
  Ms2_s2_a1.addAnchor([".catNames", "addCatButton"]);
  Ms2_s2_a1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To add a categorie, click on the blinking section" : "Pour ajouter une categorie veuillez cliquer sur la section clignotante";
  }]);
  Ms2_s2_a1.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms2_s2_a1;
      var settings = function settings() {
        var catLists = document.querySelector(anchor[0]);
        var clicker = document.getElementById(anchor[1]).querySelector("a");
        var counters = []; //= [];
        var listeners = [];
        var initialState = [];
        var actionsReverser = [[store, _aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeCatListView, false]];
        originalBackground(initialState, clicker);
        animateBackground(clicker, counters);
        addListener(listeners, clicker, 'click', function () {
          action.getClearer()();
          meticulus('addCatDiv', function () {
            return resolve(true);
          });
        });
        action.addToStore({
          initialState: initialState,
          counters: counters,
          listeners: listeners,
          actionsReverser: actionsReverser
        });
      };
      if (!store.getState().ui.show.catList) {
        store.dispatch((0,_aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeCatListView)(true));
        meticulus('catNames', settings);
      } else settings();
    });
  });
  Ms2_s2_a1.addClearer(function (anchor) {
    var action = Ms2_s2_a1;
    triggerCleaner(action);
    return Promise.resolve(true);
  });
  var Ms2_s2_a2 = Ms2_s2_a1.nextAction;
  Ms2_s2_a2.addTitle("");
  Ms2_s2_a2.addAnchor(["main", "addCat", ".message span", ".popUp"]);
  Ms2_s2_a2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You'll see the create category form appear" : "Vous verez apparaitre le  formulaire de creation de categorie";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Enter the categorie name in the blinking input" : "Entrer un le nom de la categorie que vous vouler créer dans le champs de texte clignotant";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Then click on Add" : "Ensuite cliquer sur ajouter";
  }]);
  Ms2_s2_a2.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var addCatDiv = document.getElementById(anchor[1]);
      var mainDiv = document.getElementById(anchor[0]);
      var input = addCatDiv.querySelector("input");
      var add = addCatDiv.querySelector(".add");
      var close = addCatDiv.querySelector(".close");
      var message = addCatDiv.querySelector(anchor[2]);
      var popUpDiv = document.querySelector(anchor[3]);
      var action = Ms2_s2_a2;
      var counters = [];
      var initialState = [];
      var listeners = [];
      var actionsReverser = [[store, _aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeCatView, false]];
      action.addToStore({
        counters: counters,
        initialState: initialState,
        actionsReverser: actionsReverser
      });
      function disableButton() {
        add.disabled = true;
        close.disabled = true;
      }
      disableButton();
      originalDisabled(initialState, [close, add]);
      var inputBorder = originalBackground(initialState, input);
      var addBorder = originalBackground(initialState, add);
      popUpDiv.className = popUpDiv.className.split(" ").filter(function (x) {
        return x != "blur";
      }).join(" ");
      function originalGame() {
        var i = initialState.filter(function (x) {
          return x[1] == 'disabled' ? false : true;
        });
        toOriginalState(i);
        inputBorder = originalBackground(initialState, input);
        addBorder = originalBackground(initialState, add);
      }
      function handleInput() {
        animateBackground(input, counters);
        input.oninput = function (event) {
          event.preventDefault();
          if (input.value.length) {
            clearCounters(counters);
            originalGame();
            handleAdder();
          }
        };
      }
      function handleAdder() {
        add.disabled = false;
        input.oninput = null;
        animateBackground(add, counters);
        add.onclick = function (event) {
          event.preventDefault();
          clearCounters(counters);
          originalGame();
          if (input.value.length) {
            var lang = store.getState().language;
            meticulus('addCatDiv', function () {
              if (message.textContent.trim() != Text.addCatDiv.message.success(lang)) {
                handleInput();
                disableButton();
              } else {
                add.onclick = null;
                if (!store.getState().ui.show.catList) store.dispatch((0,_aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeCatListView)(true));
                action.addToStore({
                  actionsReverser: [[{
                    dispatch: function dispatch() {}
                  }, function () {}, null]]
                });
                triggerCleaner(action, false);
                action.addToStore({
                  actionsReverser: actionsReverser
                });
                meticulus('catNames', function () {
                  action.nextAction.addToStore({
                    catName: input.value.trim().toLowerCase()
                  });
                  resolve(true);
                });
              }
            });
          } else {
            disableButton();
            handleInput();
          }
        };
      }
      if (!store.getState().ui.show.addCatDiv) {
        store.dispatch((0,_aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeCatView)(true));
        meticulus('addCatDiv', function () {
          handleInput();
        });
      } else handleInput();
      var _helpWithCoordinate3 = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.helpWithCoordinate)(mainDiv, popUpDiv),
        coordi1 = _helpWithCoordinate3.coordi1,
        coordi2 = _helpWithCoordinate3.coordi2;
      if (coordi1.left <= coordi2.left && coordi1.left + coordi1.width > coordi2.left || coordi1.left > coordi2.left && coordi1.left < coordi2.left + coordi2.width) {
        action.addToStore({
          coordi1: _objectSpread({}, coordi1),
          coordi2: _objectSpread({}, coordi2)
        });
        var r1 = 100 - coordi1.left - coordi1.width;
        var r2 = 100 - coordi2.left - coordi2.width;
        var c1 = setInterval(function () {
          mainDiv.style.left = ++coordi1.left + "%";
          if (coordi1.left + coordi1.width == 100) mainDiv.style.width = --coordi1.width + "%";
          if (coordi1.left >= coordi2.left + coordi2.width + 1) clearInterval(c1);
        }, 10);
        if (r2 < 40) {
          if (r2 + coordi2.left >= 40) {
            var c = setInterval(function () {
              popUpDiv.style.left = --coordi2.left + "%";
              r2++;
              if (r2 == 40) clearInterval(c);
            }, 10);
          } else {
            var _c = setInterval(function () {
              popUpdDiv.style.left = --coordi2.left + "%";
              popUpdDiv.style.width = --coordi2.width + "%";
              r2 = r2 + 2;
              if (r2 >= 40) clearInterval(_c);
            }, 10);
          }
        }
      }
    });
  });
  Ms2_s2_a2.addClearer(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms2_s2_a2;
      var mainDiv = document.getElementById(anchor[0]);
      var popUpDiv = document.querySelector(anchor[3]);
      if (actionHasReset(action, false)) {
        return Promise.resolve(true);
      }
      var _action$getStore2 = action.getStore(),
        coordi1 = _action$getStore2.coordi1,
        coordi2 = _action$getStore2.coordi2;
      triggerCleaner(action);
      var coord = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.helpWithCoordinate)(mainDiv, popUpDiv);
      var l1 = coordi1.left > coord.coordi1.left ? 1 : -1;
      var w1 = coordi1.width > coord.coordi1.width ? 1 : -1;
      var l2 = coordi2.left > coord.coordi2.left ? 1 : -1;
      var w2 = coordi2.width > coord.coordi2.width ? 1 : -1;
      var counter = 0;
      if (coordi1.left != coord.coordi1.left) {
        counter++;
        var c1 = setInterval(function () {
          coord.coordi1.left = coord.coordi1.left + l1;
          mainDiv.style.left = coord.coordi1.left + "%";
          if (coordi1.left == coord.coordi1.left) {
            clearInterval(c1);
            if (! --counter) resolve(true);
          }
        }, 10);
      }
      if (coordi1.width != coord.coordi1.width) {
        counter++;
        var _c2 = setInterval(function () {
          coord.coordi1.width = coord.coordi1.width + w1;
          mainDiv.style.width = coord.coordi1.width + "%";
          if (coordi1.width == coord.coordi1.width) {
            clearInterval(_c2);
            if (! --counter) resolve(true);
          }
        }, 10);
      }
      if (coordi2.left != coord.coordi2.left) {
        counter++;
        var _c3 = setInterval(function () {
          coord.coordi2.left = coord.coordi2.left + l2;
          popUpDiv.style.left = coord.coordi2.left + "%";
          if (coordi2.left == coord.coordi2.left) {
            clearInterval(_c3);
            if (! --counter) resolve(true);
          }
        }, 10);
      }
      if (coordi2.width != coord.coordi2.width) {
        counter++;
        var _c4 = setInterval(function () {
          coord.coordi2.width = coord.coordi2.width + w2;
          popUpDiv.style.width = coord.coordi2.width + "%";
          if (coordi2.width == coord.coordi2.width) {
            clearInterval(_c4);
            if (! --counter) resolve(true);
          }
        }, 10);
      }
    });
  });
  var Ms2_s2_a3 = Ms2_s2_a2.nextAction;
  Ms2_s2_a3.addTitle("");
  Ms2_s2_a3.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Congratulation, You have created your own category" : "Felicitation, vous avez reussit à creer une categorie.";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Your created category will be seen in the categories listing" : "La categorie que vous avez crée sera afficher dans la liste de categorie";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can proceed to the next section" : "Vous pouvez passer à la section suivante";
  }]);
  Ms2_s2_a3.addAnchor([".catNames"]);
  Ms2_s2_a3.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var settings = function settings() {
        var action = Ms2_s2_a3;
        var catList = document.querySelector(anchor[0]);
        var lastElement = document.querySelector("".concat(anchor[0], " .").concat(action.getStore().catName));
        var counters = []; // = [];
        var initialState = [];
        originalBackground(initialState, lastElement);
        animateBackground(lastElement, counters);
        action.addToStore({
          initialState: initialState,
          counters: counters
        });
      };
      if (!store.getState().ui.show.catList) {
        store.dispatch((0,_aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeCatListView)(true));
        meticulus('catNames', settings);
      } else settings();
    });
  });
  Ms2_s2_a3.addClearer(function (anchor) {
    var action = Ms2_s2_a3;
    if (actionHasReset(action, false)) return Promise.resolve(true);
    triggerCleaner(action);
    return action.prevAction.getClearer()();
  });
  var Ms2_s3 = Ms2_s2.nextSection;
  Ms2_s3.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Save a category" : "Enregistrer une categorie";
  });
  Ms2_s3.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can also save your categories in you computer. That will allow you to access your songs even without an internet connection" : "Vous avez egalement la possibilité d'enregistrer vos categories sur votre machine. Cela vous permettra d'avoir accès à vos chansons sans que vous ayez une connexion internet";
  }]);
  var Ms2_s3_a1 = Ms2_s3.action.addAction();
  Ms2_s3_a1.addAnchor([".head .downloader", ".head .downloader img"]);
  Ms2_s3_a1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To do an offline saving of your category, click on the blinking image just near every category" : "Pour enregistrer localement votre categorie, veuillez cliquer sur l'image clignante juste à coté de chaque categorie";
  }]);
  Ms2_s3_a1.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var settings = function settings() {
        var action = Ms2_s3_a1;
        var clickers = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.tA)(document.querySelectorAll(anchor[0]), "forEach", "map", "slice");
        var imgs = document.querySelectorAll(anchor[1]);
        var initialState = [];
        var counters = []; //= [];
        var listeners = [];
        var actionsReverser = [[store, _aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeCatListView, false]];
        if (!checkDbSupport()) {
          revertAction(action);
          action.addTitle("");
          action.addText([function () {
            var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
            return lang.toLowerCase() == "en" ? "We're sorry to inform you that your browser can't do offline saving" : "Nous somme desolé de vous informer que votre navigateur ne dispose pas des fonctionnalités pour enregistrer localement vos categorie";
          }, function () {
            var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
            return lang.toLowerCase() == "en" ? "Please, Go to the next section" : "Veuillez passer à la section suivante";
          }]);
          action.addProcess(function () {
            return new Promise(function (resolve, reject) {});
          });
          return resolve({
            updateText: true
          });
        }
        if (imgs.length) {
          try {
            originalBackground(initialState, clickers);
            animateBackground(clickers, counters);
            addListener(listeners, clickers, 'click', function (event) {
              event.preventDefault();
              action.getClearer()();
              resolve(true);
            });
            action.addToStore({
              initialState: initialState,
              counters: counters,
              listeners: listeners
            });
          } catch (e) {
            alert(e);
          }
        } else {
          var _action$getStore3 = action.getStore(),
            updateText = _action$getStore3.updateText;
          if (!updateText) {
            revertAction(action);
            action.addText("");
            action.addText([function () {
              var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
              return lang.toLowerCase() == "en" ? "Oh, It seem's you've already save all the category" : "Oh, il semble que vous avez dejà enregistré toute les categorie";
            }, function () {
              var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
              return lang.toLowerCase() == "en" ? "You can go to the next step" : "Veuillez donc passer à l'etape suivant";
            }]);
            action.addTitle(function () {
              var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
              return lang.toLowerCase() == "en" ? "Category already saved" : "Categorie dejà enregistré";
            });
            action.addToStore({
              updateText: true
            });
            resolve({
              updateText: true
            });
          }
        }
      };
      if (store.getState().ui.show.catList) settings();else {
        store.dispatch((0,_aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeCatListView)(true));
        meticulus('catNames', settings);
      }
    });
  });
  Ms2_s3_a1.addClearer(function (anchor) {
    var action = Ms2_s3_a1;
    triggerCleaner(action);
    return Promise.resolve(true);
  });
  var Ms2_s3_a2 = Ms2_s3_a1.nextAction;
  Ms2_s3_a2.addTitle("");
  Ms2_s3_a2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Congratulation, You've succed in saving a category" : "Felicitation, vous avez reussit à enregistrer localement une categorie";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can access it even without an internet connection" : "Vous pourez ainsi y acceder quand vous n'aurez pas de connection";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can go to the next step" : "Veuillez passer à l'etape suivante";
  }]);
  var Ms3 = Ms2.nextStep;
  Ms3.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Songs" : "Chansons";
  });
  var Ms3_s1 = Ms3.section.addSection().addSection().addSection();
  Ms3_s1.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Listing" : "Affichage";
  });
  var Ms3_s1_a1 = Ms3_s1.action.addAction().addAction();
  Ms3_s1_a1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To see the available songs, you'll have to choose a category" : "Pour afficher les chants disponibles veuillez selectionner une la categorie clignotante";
  }]);
  Ms3_s1_a1.addAnchor([".catNames"]);
  Ms3_s1_a1.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var settings = function settings() {
        var action = Ms3_s1_a1,
          cantiqueDiv,
          _store$getState = store.getState(),
          Categories = _store$getState.Categories,
          onlineSongs = _store$getState.onlineSongs,
          offlineSongs = _store$getState.offlineSongs,
          i = 0,
          onSongs,
          offSongs,
          catName;
        while (catName = Categories[i]) {
          onSongs = onlineSongs[i];
          offSongs = offlineSongs[i++];
          if (onSongs && onSongs.length || offSongs && offSongs.length) {
            cantiqueDiv = document.querySelector("".concat(anchor[0], " .").concat(catName));
            break;
          }
        }
        if (!cantiqueDiv) {
          revertAction(action);
          action.addTitle("");
          action.addText([function () {
            var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
            return lang.toLowerCase() == "en" ? "This category has no song" : "Cette categorie n'a aucune chanson";
          }]);
          action.addProcess(function () {
            return new Promise(function (resolve, reject) {});
          });
          return resolve({
            updateText: true
          });
        }
        //let cantiqueDiv = catList[1];
        var clicker = cantiqueDiv.querySelector("a");
        var counters = []; //= [];
        var initialState = [];
        var listeners = [];
        var actionsReverser = [[store, _aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeCatListView, false]];
        var oldCurrentCatName = store.getState().currentCat.name;
        originalBackground(initialState, cantiqueDiv);
        //counters.push(...animateBackground(cantiqueDiv));
        animateBackground(cantiqueDiv, counters);
        addListener(listeners, clicker, 'click', function (event) {
          event.preventDefault();
          action.getClearer()();
          if (oldCurrentCatName != store.getState().currentCat.name) {
            meticulus('songList', function () {
              return resolve(true);
            });
          } else resolve(true);
        });
        action.addToStore({
          counters: counters,
          initialState: initialState,
          listeners: listeners,
          actionsReverser: actionsReverser
        });
      };
      if (store.getState().ui.show.catList) settings();else {
        store.dispatch((0,_aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeCatListView)(true));
        meticulus('catNames', settings);
      }
    });
  });
  Ms3_s1_a1.addClearer(function (anchor) {
    var action = Ms3_s1_a1;
    triggerCleaner(action);
    return Promise.resolve(true);
  });
  var Ms3_s1_a2 = Ms3_s1_a1.nextAction;
  Ms3_s1_a2.addTitle("");
  Ms3_s1_a2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Each category songs are grouped in panel" : "Les chansons de chaque categorie sont groupé en deux volet:";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Online et offline" : "En ligne et Hors ligne";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "The online pannel has not locally saved songs and the offline panel has saved songs" : "Le vollet online contient les chansons que vous n'avez pas encore enregistré localement, et le volet offline contient les chants enregistrés localement";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Next to each panel, there is a number representing the number of song" : "A coté de chaque volet, il y a un nombre qui indique le nombre de chanson";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Click on the blinking panel to display it songs" : "Cliquer sur le volet clignotant pour afficher les chansons";
  }]);
  Ms3_s1_a2.addAnchor(["online", "onLink", "#online .list", "offline", "offLink", "#offline .list"]);
  Ms3_s1_a2.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms3_s1_a2;
      var state = store.getState(),
        Categories = state.Categories,
        onSongs = state.onlineSongs,
        offSongs = state.offlineSongs,
        onlineSongs,
        offlineSongs,
        nodeToWait,
        i = 0;
      while (Categories[i]) {
        if (onSongs[i] && onSongs[i].length) {
          onlineSongs = true;
          break;
        }
        if (offSongs[i] && offSongs[i].length) {
          offlineSongs = true;
          break;
        }
        i++;
      }
      if (!onlineSongs && !offlineSongs) {
        var previousActions = [];
        revertAction(action);
        action.addTitle("");
        action.addText([function () {
          var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
          return lang.toLowerCase() == "en" ? "This category has no song" : "Cette categorie ne dispose d'aucune chanson";
        }, function () {
          var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
          return lang.toLowerCase() == "en" ? "Please, choose another category" : "veuillez selectionner une autre categorie";
        }]);
        action.addProcess(function () {
          return action.prevAction.doProcess()().then(function (r) {
            return action.getClearer()().then(function () {
              return action.doProcess()();
            });
          });
        });
        previousActions.push(action.prevAction);
        action.addToStore({
          previousActions: previousActions
        });
        return resolve({
          updateText: true
        });
      }
      if (offlineSongs) anchor = anchor.slice(3);
      nodeToWait = anchor[0];
      var onlineDiv = document.getElementById(anchor[0]);
      var onlineLink = document.getElementById(anchor[1]);
      var songList = document.querySelector(anchor[2]);
      var counters = []; //= [];
      var initialState = [];
      var listeners = [];
      if (songList) {
        action.nextAction.addToStore({
          location: "#".concat(anchor[0])
        });
        resolve(true);
      } else {
        originalBackground(initialState, onlineLink);
        //counters.push(...animateBackground(onlineLink))
        animateBackground(onlineLink, counters);
        addListener(listeners, onlineLink, 'click', function (event) {
          event.preventDefault();
          action.getClearer()();
          action.nextAction.addToStore({
            location: "#".concat(anchor[0])
          });
          meticulus(nodeToWait, function () {
            return resolve(true);
          });
        });
        action.addToStore({
          initialState: initialState,
          counters: counters,
          listeners: listeners,
          location: location
        });
      }
    });
  });
  Ms3_s1_a2.addClearer(function (anchor) {
    var action = Ms3_s1_a2;
    triggerCleaner(action);
    return Promise.resolve(true);
  });
  var Ms3_s1_a3 = Ms3_s1_a2.nextAction;
  Ms3_s1_a3.addAnchor([".list", "main"]);
  Ms3_s1_a3.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To show a song content, click on one of the blinking song" : "Pour afficher le contenu d'une chanson, cliquer sur une chanson clignotante";
  }]);
  Ms3_s1_a3.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms3_s1_a3;
      var _action$getStore4 = action.getStore(),
        location = _action$getStore4.location;
      var songs;
      var songListDiv = document.querySelector("".concat(location, " ").concat(anchor[0]));
      if (songListDiv) {
        songs = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.tA)(songListDiv.children, 'slice', 'forEach').slice(/^#off/i.test(location) ? 1 : 0, 10);
      }
      if (!songs) {
        var previousActions = [];
        revertAction(action);
        action.addText([function () {
          var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
          return lang.toLowerCase() == "en" ? "Please, choose a song" : "Veuillez selectionner une chanson";
        }]);
        action.addProcess(function () {
          function doUntil() {
            return action.prevAction.doProcess()().then(function (r) {
              if (r.updateText) return doUntil();else return true;
            });
          }
          return doUntil().then(function (r) {
            triggerCleaner(action, false);
            return action.doProcess()();
          });
        });
        previousActions.push(action.prevAction);
        action.addToStore({
          previousActions: previousActions
        });
        return resolve({
          updateText: true
        });
      } else {
        var oldCurrentSongName = store.getState().currentSong.name;
        var oldCurrentCatName = store.getState().currentCat.name;
        var counters = []; //= [];
        var listeners = [];
        var initialState = [];
        var problematics = [function () {
          return forceUpdate('content', false);
        }];
        var mainDiv = document.getElementById(anchor[1]);
        originalBackground(initialState, songs);
        //counters.push(...animateBackground(songs,true));
        animateBackground(songs, counters);
        addListener(listeners, songListDiv, 'click', function (event) {
          try {
            action.getClearer()().then(resolve);
            meticulus('content', function () {
              action.getClearer()().then(resolve);
            });
            forceUpdate('content', true);
          } catch (e) {
            alert("Bob");
          }
        });
        var _helpWithCoordinate4 = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.helpWithCoordinate)(mainDiv, songListDiv),
          coordi1 = _helpWithCoordinate4.coordi1,
          coordi2 = _helpWithCoordinate4.coordi2;
        action.addToStore({
          counters: counters,
          initialState: initialState,
          listeners: listeners,
          problematics: problematics,
          coordi1: _objectSpread({}, coordi1),
          coordi2: _objectSpread({}, coordi2)
        });
        if (coordi1.left < coordi2.left + coordi2.width) {
          var r = coordi2.left + coordi2.width - coordi1.left;
          var c = setInterval(function () {
            mainDiv.style.left = ++coordi1.left + "%";
            if (! --r) clearInterval(c);
          }, 10);
        }
      }
    });
  });
  Ms3_s1_a3.addClearer(function (anchor) {
    var action = Ms3_s1_a3;
    var mainDiv = document.getElementById(anchor[1]);
    var _action$getStore5 = action.getStore(),
      coordi1 = _action$getStore5.coordi1;
    var coord = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.helpWithCoordinate)(mainDiv).coordi1;
    triggerCleaner(action, false);
    return new Promise(function (resolve, reject) {
      if (!coordi1) return resolve(true);
      var count = 2;
      if (coordi1.left != coord.left) {
        var s1 = coord.left > coordi1.left ? -1 : 1;
        var c1 = setInterval(function () {
          coord.left = coord.left + s1;
          mainDiv.style.left = coord.left + "%";
          if (coord.left == coordi1.left) {
            clearInterval(c1);
            if (! --count) resolve(true);
          }
        }, 10);
      } else {
        --count;
      }
      if (coordi1.width != coord.width) {
        var s2 = coord.width > coordi1.width ? -1 : 1;
        var c2 = setInterval(function () {
          coord.width = coord.width + s2;
          mainDiv.style.width = coord.width + "%";
          if (coord.width == coordi1.width) {
            clearInterval(c2);
            if (! --count) resolve(true);
          }
        }, 10);
      } else --count;
      if (!count) resolve(true);
    });
  });
  var Ms3_s2 = Ms3_s1.nextSection;
  Ms3_s2.addTitle(function () {
    return "Navigation";
  });
  Ms3_s2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Once the song content is displayed, many navigations options are offered to you, that will allow you to go to verses" : "Le contenu de la chanson etant affiché, plusieurs options de navigations s'offrent à vous pour vous rendre vers diffenretes strophes";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "We'll beging with arrow navigation" : "Nous allons commencer par la navigation de chant avec les boutons fleches";
  }]);
  var Ms3_s2_a1 = Ms3_s2.action.addAction().addAction();
  Ms3_s2_a1.addAnchor([".nextSong", "second", "main"]);
  Ms3_s2_a1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Please, click the blinking button, in the bottom of the verses to go to the next Verse" : "Veuillez cliquer sur le button clignotant juste en bas de la strophe affiché pour aller vers la strophe suivante";
  }]);
  Ms3_s2_a1.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var settings = function settings(nextArrow) {
        var action = Ms3_s2_a1;
        var counters = []; //= [];
        var listeners = [];
        var initialState = [];
        var secondDiv = document.getElementById(anchor[1]);
        var mainDiv = document.getElementById(anchor[2]);
        originalBackground(initialState, nextArrow);
        //counters.push(...animateBackground(nextArrow));
        animateBackground(nextArrow, counters);
        addListener(listeners, nextArrow, 'click', function (event) {
          event.preventDefault();
          triggerCleaner(action, false);
          meticulus('content', function () {
            return resolve(true);
          });
        });
        var _helpWithCoordinate5 = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.helpWithCoordinate)(mainDiv, secondDiv),
          coordi1 = _helpWithCoordinate5.coordi1,
          coordi2 = _helpWithCoordinate5.coordi2;
        action.addToStore({
          counters: counters,
          listeners: listeners,
          initialState: initialState,
          coordi1: _objectSpread({}, coordi1),
          coordi2: _objectSpread({}, coordi2)
        });
        if (coordi1.left <= coordi2.left && coordi1.left + coordi1.width > coordi2.left || coordi1.left > coordi2.left && coordi1.left < coordi2.left + coordi2.width) {
          var r1 = 100 - coordi2.width;
          var c1 = setInterval(function () {
            mainDiv.style.left = --coordi1.left + "%";
            if (!coordi1.left) clearInterval(c1);
          }, 10);
          if (r1 < coordi1.width) {
            var c2 = setInterval(function () {
              mainDiv.style.width = --coordi1.width + "%";
              if (coordi1.width == r1) clearInterval(c2);
            }, 10);
          }
        }
      };
      function testIfNextArrowNull() {
        var _store$getState2 = store.getState(),
          currentSong = _store$getState2.currentSong,
          ui = _store$getState2.ui;
        if (!currentSong.name) {
          var prevAction = Ms3_s1_a3;
          revertAction(action);
          action.addTitle("");
          action.addText(prevAction.getText());
          action.addProcess(function () {
            function doUntil() {
              return Ms3_s1_a3.doProcess()().then(function (r) {
                if (r.updateText) return doUntil();else return {
                  success: true
                };
              });
            }
            return doUntil().then(function (r) {
              action.getClearer()();
              return {
                updateText: true
              };
            });
          });
          var previousActions = [prevAction];
          action.addToStore({
            previousActions: previousActions
          });
          return resolve({
            updateText: true
          });
        }
        if (currentSong.Verses && currentSong.Verses.length > 1) {
          var nextArrow = document.querySelector(anchor[0]);
          var Lenon = "Marka";
          if (ui.navigation.VerseIndex != currentSong.Verses.length - 1) /*return*/settings(nextArrow);else {
            store.dispatch((0,_aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeIndex)(0));
            meticulus('content', function () {
              nextArrow = document.querySelector(anchor[0]);
              settings(nextArrow);
            });
            //return;
          }
        } else {
          var _previousActions = [];
          revertAction(action);
          action.addTitle("");
          action.addText([function () {
            var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
            return lang.toLowerCase() == "en" ? "This song a one verse" : "Cette chanson n'a qu'une seule trophe";
          }, function () {
            var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
            return lang.toLowerCase() == "en" ? "Please, choose another song" : "veuillez choisir une autre chanson";
          }]);
          action.addProcess(function () {
            function doUntil() {
              return Ms3_s1_a3.doProcess()().then(function (r) {
                if (r.updateText) return doUntil();else return {
                  success: true
                };
              });
            }
            return doUntil().then(function (r) {
              action.getClearer()();
              return {
                updateText: true
              };
            });
          });
          _previousActions.push(Ms3_s1_a3);
          action.addToStore({
            previousActions: _previousActions
          });
          return resolve({
            updateText: true
          });
        }
      }
      testIfNextArrowNull();
    });
  });
  Ms3_s2_a1.addClearer(function (anchor) {
    var action = Ms3_s2_a1;
    if (actionHasReset(action)) {
      return Promise.resolve(true);
    }
    return Ms3_s1_a3.getClearer()().then(function (r) {
      var _action$getStore6 = action.getStore(),
        coordi1 = _action$getStore6.coordi1;
      var mainDiv = document.getElementById(anchor[2]);
      var coord = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.helpWithCoordinate)(mainDiv).coordi1;
      var c = 0;
      triggerCleaner(action);
      return new Promise(function (resolve, reject) {
        if (coordi1.left != coord.left) {
          var diff = coord.left > coordi1.left ? -1 : 1;
          c++;
          var counter = setInterval(function () {
            coord.left = coord.left + diff;
            mainDiv.style.left = "".concat(coord.left, "%");
            if (coord.left == coordi1.left) {
              clearInterval(counter);
              c--;
              if (!c) resolve(true);
            }
          }, 10);
        }
        if (coordi1.width != coord.width) {
          var _diff = coord.width > coordi1.width ? -1 : 1;
          c++;
          var _counter = setInterval(function () {
            coord.width = coord.width + _diff;
            mainDiv.style.width = "".concat(coord.width, "%");
            if (coord.width == coordi1.width) {
              clearInterval(_counter);
              c--;
              if (!c) resolve(true);
            }
          }, 10);
        }
        if (!c) resolve(true);
      });
    });
  });
  var Ms3_s2_a2 = Ms3_s2_a1.nextAction;
  Ms3_s2_a2.addAnchor([".prevSong"]);
  Ms3_s2_a2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To go to the previous verse, click on the blinking back arrow button" : "Pour aller vers une strophe precedente, veuillez cliquer sur le button de retour clignotant, juste en bas de la strophe courante";
  }]);
  Ms3_s2_a2.addTitle("");
  Ms3_s2_a2.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms3_s2_a2;
      var prevArrow = document.querySelector(anchor[0]);
      var counters = []; //= [];
      var initialState = [];
      var listeners = [];
      originalBackground(initialState, prevArrow);
      animateBackground(prevArrow, counters);
      addListener(listeners, prevArrow, 'click', function (event) {
        event.preventDefault();
        triggerCleaner(action);
        meticulus('content', function () {
          return resolve(true);
        });
      });
      action.addToStore({
        listeners: listeners,
        counters: counters,
        initialState: initialState
      });
    });
  });
  Ms3_s2_a2.addClearer(function (anchor) {
    var action = Ms3_s2_a2;
    if (actionHasReset(action)) return Promise.resolve(true);
    return action.prevAction.getClearer()().then(function (r) {
      triggerCleaner(action);
      return true;
    });
  });
  var Ms3_s2_a3 = Ms3_s2_a2.nextAction;
  Ms3_s2_a3.addAnchor(["#navHelper div"]);
  Ms3_s2_a3.addTitle("");
  Ms3_s2_a3.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "The app also allow you to go to the verse of your choice, but using the numbered navigation" : "L'application met egalement à votre disposition une navigation numeroté, pour vous rendre directement vers la strophe souhaité";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To go to the verse of your choice, click on the blinking number at the extrem right of the display" : "Pour aller vers n'importe quel strophe veuillez cliquer sur les numeros clignotant à l'extreme droite de l'application";
  }]);
  Ms3_s2_a3.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms3_s2_a3;
      var navNumber = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.tA)(document.querySelectorAll(anchor[0]), "filter", "forEach").filter(function (n) {
        return n.className.indexOf('bHighlight') == -1;
      });
      var counters = []; //= [];
      var listeners = [];
      var initialState = [];
      var problematics = [function () {
        navNumber.forEach(function (div) {
          div.style.backgroundColor = "";
        });
      }];
      originalBackground(initialState, navNumber);
      animateBackground(navNumber, counters);
      addListener(listeners, navNumber, 'click', function (event) {
        event.preventDefault();
        action.getClearer()();
        meticulus('content', function () {
          return resolve(true);
        });
      });
      action.addToStore({
        counters: counters,
        initialState: initialState,
        listeners: listeners,
        problematics: problematics
      });
    });
  });
  Ms3_s2_a3.addClearer(function (anchor) {
    var action = Ms3_s2_a3;
    if (actionHasReset(action)) return Promise.resolve(true);
    return action.prevAction.getClearer()().then(function (r) {
      triggerCleaner(action);
      return true;
    });
  });
  var Ms3_s3 = Ms3_s2.nextSection;
  Ms3_s3.addTitle(function (lang) {
    return "Favoris";
  });
  Ms3_s3.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Sometime, It'll happen that you'll have a need to access a loved song quickly" : "Parfois il arrive que vous aimer une chanson, vous avez donc besoin d'y acceder rapidement.";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To access quickly a loved song you can put the song in the favorite section" : "Pour acceder rapidement à certaine chanson vous pouvez tagger votre application comme favori";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "All the songs in the favorites section can be quickly access by clicking in the favorite section" : "Les chansons taggé comme favoris seront facilement accessible en cliquant sur l'icone de favoris";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "When a song is not in the favorite section, a heart like icon just near the song name will have a brown color" : "Lorsque une chanson n'est pas taggé comme favoris, l'icone de coeur juste à coté du titre de la chanson aura une coleur jaune";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "When a song is put in the favorie section, a heart like icon just near the song name will a have a blue color" : "Lorsque une chanson est taggé comme favoris, l'icone deviendra bleu";
  }]);
  var Ms3_s3_a1 = Ms3_s3.action.addAction().addAction().addAction();
  Ms3_s3_a1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To put a song in the favorites sections, click in the heart like icon near the song name" : "Pour mettre une chanson sous favoris veuillez cliquer sur la petite icone de coeur clignotante juste à coté du nom de la chanson.(Soyez sur que la chansons n'est pas encore taggé comme favoris)";
  }]);
  Ms3_s3_a1.addAnchor([".imFavorite", "#online .list", "#offline .list"]);
  Ms3_s3_a1.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var state = store.getState();
      var currentCat = state.currentCat,
        currentSong = state.currentSong,
        favorites = state.favorites,
        Categories = state.Categories,
        ui = state.ui,
        onlineSongs = state.onlineSongs,
        offlineSongs = state.offlineSongs,
        to = ui.navigation.to,
        catId = currentCat.id,
        catOnSongs,
        catOffSongs,
        catName = currentCat.name,
        songName = currentSong.name;
      function goBack() {
        var previousActions = [];
        var onlineSongLength = document.querySelector(anchor[1]) && document.querySelector(anchor[1]).children.length;
        if (onlineSongLength) {
          action.addProcess(function () {
            var location = anchor[1].split(" ")[0];
            Ms3_s1_a3.addToStore({
              location: location
            });
            return Ms3_s1_a3.doProcess()().then(function (r) {
              triggerCleaner(action);
              return {
                updateText: true
              };
            });
          });
          previousActions.push(Ms3_s1_a3);
          action.addToStore({
            previousActions: previousActions
          });
          resolve({
            updateText: true
          });
          return;
        } else {
          var offlineSongLength = document.querySelector(anchor[2]) && document.querySelector(anchor[2]).children.length;
          if (offlineSongLength) {
            action.addProcess(function () {
              var location = anchor[2].split(" ")[0];
              Ms3_s1_a3.addToStore({
                location: location
              });
              return Ms3_s1_a3.doProcess()().then(function (r) {
                triggerCleaner(action);
                return {
                  updateText: true
                };
              });
            });
            previousActions.push(Ms3_s1_a3);
            action.addToStore({
              previousActions: previousActions
            });
            resolve({
              updateText: true
            });
            return true;
          } else {
            catOnSongs = onlineSongs[catId];
            catOffSongs = offlineSongs[catId];
            var catHasSongs = Categories[catId] && (catOnSongs && catOnSongs.length || catOffSongs && catOffSongs.length);
            if (catHasSongs) {
              action.addProcess(function () {
                return Ms3_s1_a2.doProcess()().then(function (r) {
                  triggerCleaner(action);
                  return {
                    updateText: true
                  };
                });
              });
              previousActions.push(Ms3_s1_a2);
              action.addToStore({
                previousActions: previousActions
              });
              resolve({
                updateText: true
              });
              return true;
            } else {
              action.addProcess(function () {
                return Ms3_s1_a1.doProcess()().then(function (r) {
                  return Ms3_s1_a2.doProcess()().then(function (r) {
                    return Ms3_s1_a3.doProcess()().then(function (r) {
                      triggerCleaner(action);
                      return {
                        updateText: true
                      };
                    });
                  });
                });
              });
              previousActions.push(Ms3_s1_a1);
              action.addToStore({
                previousActions: previousActions
              });
              resolve({
                updateText: true
              });
              return true;
            }
          }
        }
      }
      if (favorites[catName] && favorites[catName][songName]) {
        revertAction(action);
        action.addTitle("");
        action.addText([function () {
          var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
          return lang.toLowerCase() == "en" ? "This song is already in the favorites section" : "Cette chanson est dejà enregistré sous favoris";
        }, function () {
          var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
          return lang.toLowerCase() == "en" ? "Please, choose another song" : "Veuillez selectionner une autre chanson";
        }]);
        return goBack();
      } else if (!songName) {
        revertAction(action);
        action.addTitle("");
        action.addText([function () {
          var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
          return lang.toLowerCase() == "en" ? "Please, choose a song" : "Veuillez selectionner une chanson";
        }]);
        return goBack();
      } else {
        var _action = Ms3_s3_a1;
        var clicker = document.querySelector(anchor[0]);
        var counters = []; //= [];
        var initialState = [];
        var listeners = [];
        originalBackground(initialState, clicker);
        animateBackground(clicker, counters);
        addListener(listeners, clicker, 'click', function (event) {
          event.preventDefault();
          _action.getClearer()();
          meticulus('content', function () {
            return resolve(true);
          });
        });
        _action.addToStore({
          counters: counters,
          initialState: initialState,
          listeners: listeners
        });
      }
    });
  });
  Ms3_s3_a1.addClearer(function (anchor) {
    var action = Ms3_s3_a1;
    triggerCleaner(action);
    return Promise.resolve(true);
  });
  var Ms3_s3_a2 = Ms3_s3_a1.nextAction;
  Ms3_s3_a2.addAnchor(["favLink"]);
  Ms3_s3_a2.addTitle("");
  Ms3_s3_a2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Congratulation, you've put a song in the favorites section" : "Felicitation, vous avez ajouter une chanson dans les favoris";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To acces the favorites section, click in the blinking start icon just above the page" : "Pour y acceder à vos favoris cliquer sur la grande icone favoris clignotante en haut de la page";
  }]);
  Ms3_s3_a2.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms3_s3_a2;
      var favLink = document.getElementById(anchor[0]);
      var counters = []; //= [];
      var listeners = [];
      var initialState = [];
      originalBackground(initialState, favLink);
      animateBackground(favLink, counters);
      addListener(listeners, favLink, 'click', function (event) {
        event.preventDefault();
        action.getClearer()();
        meticulus('favorite', function () {
          return resolve(true);
        });
      });
      action.addToStore({
        counters: counters,
        listeners: listeners,
        initialState: initialState
      });
    });
  });
  Ms3_s3_a2.addClearer(function (anchor) {
    var action = Ms3_s3_a2;
    triggerCleaner(action);
    return Promise.resolve(true);
  });
  var Ms3_s3_a3 = Ms3_s3_a2.nextAction;
  Ms3_s3_a3.addAnchor([".imFavorite"]);
  Ms3_s3_a3.addTitle("");
  Ms3_s3_a3.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You'll see a list of your favorites song appear" : "Vous verez apparaitre la liste de vos favoris";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To remove a song in the favorite section, click on the blinking heart like icon just near the song name" : "Pour enlever une chansons de la liste de favoris, cliquer sur l'icone de coeur bleu clignotante juste à coté du nom de la chanon";
  }]);
  Ms3_s3_a3.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms3_s3_a3;
      var clicker = document.querySelector(anchor[0]);
      var counters = []; //= [];
      var listeners = [];
      var initialState = [];
      originalBackground(initialState, clicker);
      animateBackground(clicker, counters);
      addListener(listeners, clicker, 'click', function (event) {
        event.preventDefault();
        action.getClearer()();
        meticulus('favorite', function () {
          return resolve(true);
        });
      });
      action.addToStore({
        counters: counters,
        listeners: listeners,
        initialState: initialState
      });
    });
  });
  Ms3_s3_a3.addClearer(function (anchor) {
    var action = Ms3_s3_a3;
    triggerCleaner(action);
    return Promise.resolve(true);
  });
  var Ms3_s3_a4 = Ms3_s3_a3.nextAction;
  Ms3_s3_a4.addTitle("");
  Ms3_s3_a4.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Congratulation, You've finish the favorite tutorial" : "Felicitation, vous avez finit le tutoriel sur les favoris";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can go to the next Section" : "Veuillez passer à la section suivante";
  }]);
  Ms3_s3_a4.addClearer(function (anchor) {
    return Promise.resolve(true);
  });
  var Ms3_s4 = Ms3_s3.nextSection;
  Ms3_s4.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Save a song" : "Enregistrer une chanson";
  });
  Ms3_s4.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "The app give you the possibility to save your song on your computer" : "L'application vous donne egalement la possibilité d'enregistrer vos chansons localement";
  }]);
  var Ms3_s4_a1 = Ms3_s4.action.addAction().addAction();
  Ms3_s4_a1.addAnchor(["#online .list .downloader", "#online .list", "main"]);
  Ms3_s4_a1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To save your song locally, click in one the blinking icons" : "Pour enregistrer vos chansons localement veuillez cliquer sur l'une des icones clignotante";
  }]);
  Ms3_s4_a1.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms3_s4_a1;
      var _store$getState3 = store.getState(),
        currentCat = _store$getState3.currentCat,
        Categories = _store$getState3.Categories,
        onlineSongs = _store$getState3.onlineSongs,
        offlineSongs = _store$getState3.offlineSongs,
        catId = currentCat,
        id,
        onCatSongs = onlineSongs[catId],
        offCatSongs = offlineSongs[catId],
        songList = document.querySelector(anchor[1]),
        i = 0,
        catName;
      if (!checkDbSupport()) {
        revertAction(action);
        action.addTitle("");
        action.addText([function () {
          var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
          return lang.toLowerCase() == "en" ? "We're sorry to inform you that your browser can't do offline saving " : "Nous somme desolé de vous informer que votre navigation ne dispose pas des fonctionnalités pour nous permettre d'enregistrer localement vos chansons";
        }, " Veuillez passer à l'etape suivante"]);
        action.addProcess(function () {
          return new Promise(function (resolve) {});
        });
        return resolve({
          updateText: true
        });
      }
      if (!songList) {
        revertAction(action);
        var previousActions = [];
        action.addTitle("");
        if (onCatSongs && onCatSongs.length) {
          action.addText([function () {
            var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
            return lang.toLowerCase() == "en" ? "Click, in the blinking section to see song that can be saved locally" : "Veuillez cliquer sur la section clignotante pour afficher les chants sauvegardables";
          }]);
          action.addProcess(function () {
            function doUntil() {
              return Ms3_s1_a2.doProcess()().then(function (r) {
                if (r.updateText) return doUntil();
                return true;
              });
            }
            return doUntil().then(function (r) {
              action.getClearer()();
              return action.doProcess()();
            });
          });
          previousActions.push(Ms3_s1_a2);
          action.addToStore({
            previousActions: previousActions
          });
          return resolve({
            updateText: true
          });
        } else {
          if (offCatSongs && offCatSongs.length) {
            action.addText([function () {
              var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
              return lang.toLowerCase() == "en" ? "Oh, You've alreay saved all the song of this category" : "Vous avez dejà sauvegardé tout le chant de cette categorie";
            }, function () {
              var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
              return lang.toLowerCase() == "en" ? "You can, go to the next step" : "Veuillez passer à l'etape suivante";
            }]);
            action.addProcess(function () {
              return new Promise(function (resolve, reject) {
                action.getClearer()();
              });
            });
            resolve({
              updateText: true
            });
          } else {
            var hasDownloadAll = true;
            while (Categories[i]) {
              if (onlineSongs[i++].length) {
                hasDownloadAll = false;
                break;
              }
            }
            if (hasDownloadAll) {
              action.addText([function () {
                var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
                return lang.toLowerCase() == "en" ? "Oh, We see that you've already saved all the songs of this category" : "Oh, nous constatons que vous avez dejà sauvegardé tous les chans de toutes les categories";
              }, function () {
                var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
                return lang.toLowerCase() == "en" ? "You can go to the next step" : "Veuillez donc passer à l'étape suivante";
              }]);
              action.addProcess(function () {
                return new Promise(function (resolve, reject) {
                  action.getClearer()();
                });
              });
              return resolve({
                updateText: true
              });
            } else {
              action.addText([function () {
                var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
                return lang.toLowerCase() == "en" ? "This category has no song that can be saved locally" : "Cette categorie ne dispose pas de chant sauvegardables";
              }, function () {
                var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
                return lang.toLowerCase() == "en" ? "Please, choose another category" : "Veuillez choisir une autre categorie";
              }]);
              action.addProcess(function () {
                function doUntil() {
                  return Ms3_s1_a1.doProcess()().then(function (r) {
                    if (r.updateText) return doUntil();
                    return true;
                  });
                }
                return doUntil().then(function (r) {
                  var previousActions = [];
                  action.getClearer()();
                  revertAction(action);
                  action.addTitle("");
                  action.addText([function () {
                    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
                    return lang.toLowerCase() == "en" ? "Choosing online" : "Selectionner En line";
                  }]);
                  action.addProcess(function () {
                    function doUntil() {
                      return Ms3_s1_a2.doProcess()().then(function (r) {
                        if (r.updateText) return doUntil();
                        return true;
                      });
                    }
                    return doUntil().then(function (r) {
                      action.getClearer()();
                      return {
                        updateText: true
                      };
                    });
                  });
                  previousActions.push(Ms3_s1_a2);
                  action.addToStore({
                    previousActions: previousActions
                  });
                  return {
                    updateText: true
                  };
                });
              });
              previousActions.push(Ms2_s1_a1);
              action.addToStore({
                previousActions: previousActions
              });
              resolve({
                updateText: true
              });
            }
          }
        }
      } else {
        var clickers = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.tA)(document.querySelectorAll(anchor[0]), "slice", "forEach").slice(0, 10);
        var listeners = [];
        var counters = []; //= [];
        var initialState = [];
        var mainDiv = document.getElementById(anchor[2]);
        if (clickers.length) {
          originalBackground(initialState, clickers);
          animateBackground(clickers, counters);
          addListener(listeners, clickers, 'click', function (event) {
            event.preventDefault();
            action.getClearer()();
            resolve(true);
          });
          var _helpWithCoordinate6 = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.helpWithCoordinate)(mainDiv, songList),
            coordi1 = _helpWithCoordinate6.coordi1,
            coordi2 = _helpWithCoordinate6.coordi2;
          action.addToStore({
            counters: counters,
            listeners: listeners,
            initialState: initialState,
            coordi1: _objectSpread({}, coordi1),
            coordi2: _objectSpread({}, coordi2)
          });
          if (coordi1.left < coordi2.left + coordi2.width) {
            var r = coordi2.left + coordi2.width - coordi1.left;
            var c = setInterval(function () {
              mainDiv.style.left = ++coordi1.left + "%";
              if (! --r) clearInterval(c);
            }, 10);
          }
        } else resolve(true);
      }
    });
  });
  Ms3_s4_a1.addClearer(function (anchor) {
    var action = Ms3_s4_a1;
    var mainDiv = document.getElementById(anchor[2]);
    var _action$getStore7 = action.getStore(),
      coordi1 = _action$getStore7.coordi1;
    var coord = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.helpWithCoordinate)(mainDiv).coordi1;
    triggerCleaner(action);
    return new Promise(function (resolve) {
      if (!coordi1) return resolve(true);
      if (coordi1.left != coord.left) {
        var dif = coord.left > coordi1.left ? -1 : 1;
        var c = setInterval(function () {
          coord.left = coord.left + dif;
          mainDiv.style.left = coord.left + "%";
          if (coord.left == coordi1.left) clearInterval(c);
        }, 10);
      } else resolve(true);
    });
  });
  var Ms3_s4_a2 = Ms3_s4_a1.nextAction;
  Ms3_s4_a2.addTitle("");
  Ms3_s4_a2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Congratulation, You've locally saved a song" : "Felicitation, vous avez enregistré une chanson";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can also save all the song of a category. To do that you'll just have to click in the blinking downloading icon just near the online panel" : "Vous avez egalement la possibilité d'enregistrer toute les chansons d'une categorie. Pour cela il vous suffira de cliquer sur l'icone de telechargement clignotante juste à coté de En ligne";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "If you don't want to download all the song, you can go to the next step" : "Vous pouvez egalement passer à l'etape suivante si vous ne souhaiter pas telecharger toute les categorie.";
  }]);
  Ms3_s4_a2.addAnchor([".onlineHead .downloader"]);
  Ms3_s4_a2.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms3_s4_a2;
      var clicker = document.querySelector(anchor[0]);
      if (clicker) {
        var listeners = [];
        var counters = []; //= [];
        var initialState = [];
        originalBackground(initialState, clicker);
        animateBackground(clicker, counters);
        addListener(listeners, clicker, 'click', function (event) {
          event.preventDefault();
          resolve(true);
        });
        action.addToStore({
          counters: counters,
          listeners: listeners,
          initialState: initialState
        });
      } else {
        resolve(true);
      }
    });
  });
  Ms3_s4_a2.addClearer(function (anchor) {
    var action = Ms3_s4_a2;
    triggerCleaner(action);
    return Promise.resolve(true);
  });
  var Ms3_s4_a3 = Ms3_s4_a2.nextAction;
  Ms3_s4_a3.addTitle("");
  Ms3_s4_a3.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Congratulation, You have saved all the song of this category" : "Felicitation vous avez enregistré toute les chansons de cette categorie";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can go to the next step" : "Vous pouvez passer à l'etape suivante";
  }]);
  Ms3_s4_a3.addClearer(function () {
    return Promise.resolve(true);
  });
  var Ms4 = Ms3.nextStep;
  Ms4.addTitle(function (lang) {
    return "Stream";
  });
  var Ms4_s1 = Ms4.section.addSection().addSection();
  Ms4_s1.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Create a stream" : "Créer un stream";
  });
  Ms4_s1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "A stream allow other user the possibility" : "Un stream est une fonctionnalités qui donne aux autres utilisateur la possibilité et bref";
  }]);
  var Ms4_s1_a1 = Ms4_s1.action.addAction().addAction().addAction();
  Ms4_s1_a1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To create your stream, you can click in the blinking section at the top of the page" : "Pour creer votre stream veuillez cliquer sur la section clignotante";
  }]);
  Ms4_s1_a1.addAnchor([".streamCreation a", ".streamCreation img"]);
  ;
  Ms4_s1_a1.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var createStreamImg = document.querySelector(anchor[1]);
      var settings = function settings() {
        var action = Ms4_s1_a1;
        var clicker = document.querySelector(anchor[0]);
        var counters = []; //= [];
        var initialState = [];
        var listeners = [];
        originalBackground(initialState, clicker);
        animateBackground(clicker, counters);
        addListener(listeners, clicker, 'click', function (event) {
          event.preventDefault();
          action.getClearer()();
          meticulus('createStream', function () {
            return resolve(true);
          });
        });
        action.addToStore({
          counters: counters,
          listeners: listeners,
          initialState: initialState
        });
      };
      if (createStreamImg.src.indexOf(store.getState().images.streamCreate.stop) != -1) {
        revertAction(action);
        action.addTitle("");
        action.addText([function () {
          var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
          return lang.toLowerCase() == "en" ? "Oh, it look like there is already a stream going on" : "Oh, il semble que vous avez dejà un stream en cours";
        }, function () {
          var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
          return lang.toLowerCase() == "en" ? "Please, go to the next step" : "Veuillez passer à la section suivante";
        }]);
        action.addProcess(function () {
          return new Promise(function (resolve, reject) {});
        });
        resolve({
          updateText: true
        });
      } else settings();
    });
  });
  Ms4_s1_a1.addClearer(function (anchor) {
    var action = Ms4_s1_a1;
    triggerCleaner(action);
    return Promise.resolve(true);
  });
  var Ms4_s1_a2 = Ms4_s1_a1.nextAction;
  Ms4_s1_a2.addTitle("");
  Ms4_s1_a2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Enter a name in the input section, then click on create" : "Entrer un nom dans le champ de texte, ensuite cliquer sur creer";
  }]);
  Ms4_s1_a2.addAnchor([".createStream input", ".createStream .add", ".createStream .close", ".createStream .message", "main", ".createStream"]);
  Ms4_s1_a2.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms4_s1_a2;
      var input = document.querySelector(anchor[0]);
      var addButton = document.querySelector(anchor[1]);
      var closeButton = document.querySelector(anchor[2]);
      var mainDiv = document.getElementById(anchor[4]);
      var createStreamDiv = document.querySelector(anchor[5]);
      var counters = []; // = [];
      var initialState = [];
      var listeners = [];
      var actionsReverser = [[store, _aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeStreamCreateView, false]];
      var problematics = [function () {
        var close = document.querySelector(anchor[2]);
        if (close) close.click();
      }];
      var inputBorder = originalBackground(initialState, input);
      var addButtonBorder = originalBackground(initialState, addButton);
      function disable() {
        addButton.disabled = true;
        closeButton.disabled = true;
      }
      function originalGame() {
        if (initialState.length) {
          var i = initialState;
          i = i.filter(function (x) {
            return x.length == 3 && x[1] == 'disabled' ? false : true;
          });
          toOriginalState(i);
        }
      }
      function handleInput() {
        disable();
        originalGame();
        animateBackground(input, counters);
        action.addToStore({
          counters: counters
        });
        input.oninput = function (event) {
          event.preventDefault();
          if (input.value.length) {
            clearCounters(counters);
            originalGame();
            handleCreate();
          }
        };
      }
      function handleCreate() {
        addButton.disabled = false;
        animateBackground(addButton, counters);
        action.addToStore({
          counters: counters
        });
        addButton.onclick = function (event) {
          event.preventDefault();
          meticulus('createStream', function () {
            var message = document.querySelector(anchor[3]);
            var _store$getState4 = store.getState(),
              language = _store$getState4.language;
            if (message.textContent) {
              if (message.textContent.trim() != Text.createStreamDiv.message.streamCreated(language)) {
                clearCounters(counters);
                originalGame();
                handleInput();
              } else {
                action.getClearer()();
                resolve(true);
              }
            }
          });
        };
      }
      var settings = function settings() {
        if (!store.getState().ui.show.createStreamDiv) {
          meticulus('createStream', settings);
          store.dispatch((0,_aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeStreamCreateView)(true));
        } else {
          originalDisabled(initialState, [addButton, closeButton]);
          handleInput();
          var _helpWithCoordinate7 = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.helpWithCoordinate)(mainDiv, createStreamDiv),
            coordi1 = _helpWithCoordinate7.coordi1,
            coordi2 = _helpWithCoordinate7.coordi2;
          action.addToStore({
            counters: counters,
            listeners: listeners,
            initialState: initialState,
            actionsReverser: actionsReverser,
            problematics: problematics
          });
          if (coordi1.top <= coordi2.top && coordi1.top + coordi1.height > coordi2.top || coordi1.top > coordi2.top && coordi1.top < coordi2.top + coordi2.height) {
            action.addToStore({
              coordi1: _objectSpread({}, coordi1),
              coordi2: _objectSpread({}, coordi2)
            });
            var h1 = 100 - coordi2.height;
            if (h1 >= 40) {
              if (coordi1.height > h1) {
                var c1 = setInterval(function () {
                  mainDiv.style.height = --coordi1.height + "%";
                  if (coordi1.height == h1) clearInterval(c1);
                }, 10);
              }
              if (coordi1.top < coordi2.top + coordi2.height) {
                var _c5 = setInterval(function () {
                  mainDiv.style.top = ++coordi1.top + "%";
                  if (coordi1.top > coordi2.top + coordi2.height) clearInterval(_c5);
                }, 10);
              }
            }
          }
        }
      };
      if (!input && closeButton) {
        closeButton.click();
        meticulus('createStream', settings);
      } else settings();
    });
  });
  Ms4_s1_a2.addClearer(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms4_s1_a2;
      if (actionHasReset(action, false)) return resolve(true);
      var mainDiv = document.getElementById(anchor[4]);
      var coord = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.helpWithCoordinate)(mainDiv).coordi1;
      var _action$getStore8 = action.getStore(),
        coordi1 = _action$getStore8.coordi1;
      triggerCleaner(action);
      var count = 2;
      var dif1 = coord.top > coordi1.top ? -1 : 1;
      var dif2 = coord.height > coordi1.height ? -1 : 1;
      if (coord.top != coordi1.top) {
        var c1 = setInterval(function () {
          coord.top = coord.top + dif1;
          mainDiv.style.top = coord.top + "%";
          if (coord.top == coordi1.top) {
            clearInterval(c1);
            if (! --count) resolve(true);
          }
        }, 10);
      } else --count;
      if (coord.height != coordi1.height) {
        var c2 = setInterval(function () {
          coord.height = coord.height + dif1;
          mainDiv.style.height = coord.height + "%";
          if (coord.height == coordi1.height) {
            clearInterval(c2);
            if (! --count) resolve(true);
          }
        }, 10);
      } else --count;
      if (!count) resolve(true);
    });
  });
  var Ms4_s1_a3 = Ms4_s1_a2.nextAction;
  Ms4_s1_a3.addTitle("");
  Ms4_s1_a3.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Congratulation, You've created a stream" : "Felecitation vous avez crée un stream";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To stop a stream, click in the same link that you use before" : "Pour arreter votre stream veuillez cliquer sur le meme lien que vous avez cliquer pour afficher le formulaire de creation du stream";
  }]);
  Ms4_s1_a3.addAnchor([".streamCreation a"]);
  Ms4_s1_a3.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms4_s1_a3;
      var clicker = document.querySelector(anchor[0]);
      var counters = []; // = [];
      var initialState = [];
      var listeners = [];
      originalBackground(initialState, clicker);
      animateBackground(clicker, counters);
      addListener(listeners, clicker, 'click', function (event) {
        event.preventDefault();
        meticulus('streamCreation', function () {
          action.getClearer()();
          resolve(true);
        });
      });
      action.addToStore({
        counters: counters,
        listeners: listeners,
        initialState: initialState
      });
    });
  });
  Ms4_s1_a3.addClearer(function () {
    var action = Ms4_s1_a3;
    triggerCleaner(action);
    return Promise.resolve(true);
  });
  var Ms4_s1_a4 = Ms4_s1_a3.nextAction;
  Ms4_s1_a4.addTitle("");
  Ms4_s1_a4.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Congratulation, You're done with the tutorial about the stream" : "Felecitation, vous avez finit le tutoriel sur le stream.";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can go to the next section" : "Veuillez passer à la section suivante";
  }]);
  Ms4_s1_a4.addClearer(function (anchor) {
    return action.prevAction.getClearer()().then(function () {
      return true;
    });
  });
  var Ms4_s2 = Ms4_s1.nextSection;
  Ms4_s2.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "List of streams" : 'Afficher la liste des streams';
  });
  Ms4_s2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Once a stream is created, the stream will appear in the on going stream list" : "Lorsque vous créer un stream, le stream sera affiché dans la liste des streams en cours";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "However, the creator of the stream will not see it stream in the list of streams" : "Toutefois, le createur du stream ne pourra pas voir son stream dans la liste";
  }]);
  var Ms4_s2_a1 = Ms4_s2.action.addAction();
  Ms4_s2_a1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To display the list of stream, you'll have to click in the blinking section at the head of the page" : "Pour afficher la liste des streams il vous suffira de cliquer sur la section clignotante en haut de la page";
  }]);
  Ms4_s2_a1.addAnchor([".streamList .streamListLink", ".streamList .counter"]);
  Ms4_s2_a1.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var settings = function settings() {
        var action = Ms4_s2_a1;
        var clicker = document.querySelector(anchor[0]);
        var counters = []; //= [];
        var listeners = [];
        var initialState = [];
        var clickerB = originalBackground(initialState, clicker);
        animateBackground(clicker, counters);
        addListener(listeners, clicker, 'click', function (event) {
          event.preventDefault();
          meticulus('streamList', function () {
            action.getClearer()();
            var streamCount = document.querySelector(anchor[1]).textContent;
            if (parseInt(streamCount)) {
              resolve(true);
            } else {
              revertAction(action);
              action.addTitle("");
              action.addText([function () {
                var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
                return lang.toLowerCase() == "en" ? "Congratulation, You have succed in displaying the list of streams" : "Felicitation, vous avez pu afficher la liste des streams";
              }, function () {
                var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
                return lang.toLowerCase() == "en" ? "Althoug, there is no ongoing stream we'll show you next how to subsribe to a stream" : "Bien qu'il n'y a aucun stream disponible nous vous montrerons dans la suite comment souscrire à un stream";
              }, function () {
                var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
                return lang.toLowerCase() == "en" ? "You can go to the next section" : "Veuillez passer à la section suivante";
              }]);
              action.addProcess(function () {
                return new Promise(function (resolve, reject) {});
              });
              resolve({
                updateText: true
              });
            }
          });
        });
        action.addToStore({
          counters: counters,
          listeners: listeners,
          initialState: initialState
        });
      };
      if (store.getState().ui.show.streamList) {
        store.dispatch((0,_aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeStreamListView)(false));
        meticulus('streamList', settings);
      } else settings();
    });
  });
  Ms4_s2_a1.addClearer(function (anchor) {
    var action = Ms4_s2_a1;
    triggerCleaner(action);
    return Promise.resolve(true);
  });
  var Ms4_s2_a2 = Ms4_s2_a1.nextAction;
  Ms4_s2_a2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Congratulation, You've succeded in displaying the list of streams" : "Felicitation, vous avez pu afficher la liste des streams";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can go to the next section" : "Veuillez passer à la section suivante";
  }]);
  Ms4_s2_a2.addClearer(function () {
    return Promise.resolve(true);
  });
  var Ms4_s3 = Ms4_s2.nextSection;
  Ms4_s3.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Subscribe to a stream" : "Souscrire à un stream";
  });
  var Ms4_s3_a1 = Ms4_s3.action.addAction().addAction().addAction();
  Ms4_s3_a1.addAnchor([".streamList .streamListLink", ".streamList .counter"]);
  Ms4_s3_a1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You'll have to be carefull in this section. You'll need two tab or two open browser" : "Cette section requiert un peu plus de delicatesse. Pour correctement suivre les procedures du tutoriels vous devez créer une autre fenetre de navigation, ou soit vous pouvez vous connecter à l'application avec un autre dispositif";
  }]);
  Ms4_s3_a1.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms4_s3_a1;
      if (store.getState().isStreaming) {
        revertAction(action);
        action.addTitle("");
        action.addText([function () {
          var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
          return lang.toLowerCase() == "en" ? "To subscribe to a stream you'll have to stop your on going stream" : "Pour souscrire à un stream vous devez stopper votre propre stream en cours";
        }, function () {
          var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
          return lang.toLowerCase() == "en" ? "Please, click in the blinking section to stop your stream" : "Veuillez cliquer sur la section clignotante pour stopper votre stream";
        }]);
        action.addProcess(function () {
          return Ms4_s1_a3.doProcess()().then(function (r) {
            return action.getClearer()().then(function (r) {
              return {
                updateText: true
              };
            });
          });
        });
        return resolve({
          updateText: true
        });
      }
      var streamCount = document.querySelector(anchor[1]).textContent;
      if (!parseInt(streamCount)) {
        revertAction(action);
        action.addTitle("");
        action.addText([function () {
          var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
          return lang.toLowerCase() == "en" ? "To subscribe to a stream you'll have to create a stream in another browser" : "Pour souscrire à un stream veuillez créer un stream dans la fenetre de navigation qui vous avez créer ou dans le dispositif connecté à l'application";
        }]);
        action.addProcess(function () {
          return new Promise(function (resolve, reject) {
            var _action$getStore9 = action.getStore(),
              problematics = _action$getStore9.problematics;
            function doUntil() {
              return new Promise(function (resolve, reject) {
                if (doUntil.stop) return resolve(false);
                meticulus('streamList', function () {
                  var count = document.querySelector(anchor[1]).textContent;
                  if (doUntil.stop) return resolve(false);
                  if (parseInt(count)) return resolve(true);
                  return doUntil().then(resolve);
                });
              });
            }
            doUntil().then(function (r) {
              if (r) {
                action.getClearer()();
                resolve(true);
              }
            });
            problematics.push(function () {
              doUntil.stop = true;
            });
            action.addToStore({
              problematics: problematics
            });
          });
        });
        resolve({
          updateText: true
        });
      } else {
        resolve(true);
      }
    });
  });
  Ms4_s3_a1.addClearer(function (anchor) {
    var action = Ms4_s3_a1;
    triggerCleaner(action);
    return Ms4_s1_a3.getClearer()().then(function () {
      return true;
    });
    //return Promise.resolve(true);
  });

  var Ms4_s3_a2 = Ms4_s3_a1.nextAction;
  Ms4_s3_a2.addTitle("");
  Ms4_s3_a2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To subscribe to a stream, you'll have to display the list of stream by clicking in the blinking link at the top" : "Pour souscrire à un stream veuillez afficher la liste des strems en cliquant sur le lien clignotant en haut";
  }]);
  Ms4_s3_a2.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      if (store.getState().ui.show.streamList) resolve(true);else {
        Ms4_s2_a1.doProcess()().then(function (r) {
          resolve(true);
        });
      }
      //action.addToStore
    });
  });

  Ms4_s3_a2.addClearer(function (anchor) {
    return Ms4_s2_a1.getClearer()().then(function () {
      return true;
    });
  });
  var Ms4_s3_a3 = Ms4_s3_a2.nextAction;
  Ms4_s3_a3.addTitle("");
  Ms4_s3_a3.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Click in one of the blinking stream to subsribe" : "Selectionner un des streams clignotant pour vous y souscrire";
  }]);
  Ms4_s3_a3.addAnchor([".listStream .f1 a"]);
  Ms4_s3_a3.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms4_s3_a3;
      var clickers = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.tA)(document.querySelectorAll(anchor[0]), "forEach", "map", "slice");
      var counters = []; //= []
      var listeners = [];
      var initialState = [];
      originalBackground(initialState, clickers);
      animateBackground(clickers, counters);
      addListener(listeners, clickers, 'click', function (event) {
        event.preventDefault();
        action.getClearer()();
        resolve(true);
      });
      action.addToStore({
        counters: counters,
        listeners: listeners,
        initialState: initialState
      });
    });
  });
  Ms4_s3_a3.addClearer(function (anchor) {
    var action = Ms4_s3_a3;
    triggerCleaner(action);
    return Promise.resolve(true);
  });
  var Ms4_s3_a4 = Ms4_s3_a3.nextAction;
  Ms4_s3_a4.addTitle('');
  Ms4_s3_a4.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Congratulation, You have subscribe to a stream" : "Felecition, vous avez pu vous souscribe à un stream";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You'll see the song currently in stream appear" : "Vous verez apparaitre le chant actuellement en stream";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can go to the next section" : "Vous pouvez passer à l'etape suivante";
  }]);
  Ms4_s3_a4.addClearer(function () {
    return Promise.resolve(true);
  });
  var Ms5 = Ms4.nextStep;
  Ms5.addTitle(function (lang) {
    return "Configuration";
  });
  var Ms5_s1 = Ms5.section.addSection().addSection().addSection();
  Ms5_s1.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return "Configurations";
  });
  Ms5_s1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Configurations will allows you to customize the app" : "Les configurations vous permettrons de personnaliser l'application";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You'll have the ability to change the langage, activate the dark mode, activer the control touch" : "Vous pourrez changer des langues, activer le mode nuit et activer la touche control";
  }]);
  var Ms5_s1_a1 = Ms5_s1.action;
  Ms5_s1_a1.addTitle("");
  Ms5_s1_a1.addAnchor([" #settings .settingsToggler"]);
  Ms5_s1_a1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To show the available configuations, click in the blinking section at the top" : "Pour afficher les configurations disponible, veuillez cliquer sur la section clignotante en haut ";
  }]);
  Ms5_s1_a1.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var settings = function settings() {
        var action = Ms5_s1_a1;
        var settingToggler = document.querySelector(anchor[0]);
        var initialState = [];
        var counters = [];
        var actionsReverser = [[store, _aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.changeSettingListView, false]];
        var listeners = [];
        if (!settingToggler) throw Error("Ms5_s1_a1: #settings .settingsToggler selector Not found");
        originalBackground(initialState, settingToggler);
        animateBackground(settingToggler, counters);
        addListener(listeners, settingToggler, 'click', function (event) {
          action.getClearer()();
          meticulus('settings', function () {
            return resolve(true);
          });
        });
        action.addToStore({
          counters: counters,
          actionsReverser: actionsReverser,
          initialState: initialState,
          listeners: listeners
        });
      };
      if (store.getState().ui.show.settingList) resolve(true);else settings();
    });
  });
  Ms5_s1_a1.addClearer(function (anchor) {
    var action = Ms5_s1_a1;
    triggerCleaner(action);
    return Promise.resolve(true);
  });
  var Ms5_s2 = Ms5_s1.nextSection;
  Ms5_s2.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Dark Mode" : 'Mode nuit';
  });
  Ms5_s2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "The dark Mode will allow you to read when there is low light condition" : "Le mode nuit est un mode qui vous permettra d'utiliser l'application dans un environnement de faible lumiere";
  }]);
  var Ms5_s2_a1 = Ms5_s2.action.addAction().addAction();
  Ms5_s2_a1.addTitle("");
  Ms5_s2_a1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To toggle dark mode, click in the blinking section of the configuration" : "Pour activer le mode nuit, veuillez cliquer la partie clignotante en bas de la page";
  }]);
  Ms5_s2_a1.addAnchor([".dayMode .modeShift", "main", ".settings .list"]);
  Ms5_s2_a1.addProcess(function (anchor) {
    var mainDiv = document.getElementById(anchor[1]);
    var settingList = document.querySelector(anchor[2]);
    var action = Ms5_s2_a1;
    var settings = function settings() {
      var clicker = document.querySelector(anchor[0]);
      var counters = []; //= [];
      var initialState = [];
      var listeners = [];
      originalBackground(initialState, clicker);
      animateBackground(clicker, counters);
      return new Promise(function (resolve, reject) {
        addListener(listeners, clicker, 'click', function (event) {
          event.preventDefault();
          meticulus('settings', function () {
            triggerCleaner(action, false);
            resolve(true);
          });
        });
        action.addToStore({
          counters: counters,
          initialState: initialState,
          listeners: listeners
        });
      });
    };
    if (!mainDiv || !settingList) throw Error("mainDiv or settingList undefined");
    if (settingList.className.indexOf("whoosh") != -1) {
      revertAction(action);
      action.addTitle("");
      action.addText(function () {
        var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
        return lang.toLowerCase() == "en" ? "Please, click in the blinking section at the top to show the configurations list" : "Veuillez cliquer sur la section clignotante en haut pour afficher la liste des configuration";
      });
      action.addProcess(function () {
        var settingAction = Ms5_s1_a1;
        return settingAction.doProcess()().then(function (r) {
          return action.getClearer()().then(function () {
            return {
              updateText: true
            };
          });
        });
      });
      return Promise.resolve({
        updateText: true
      });
    }
    return moveToBottom(mainDiv, settingList, action).then(function (r) {
      if (store.getState().ui.show.nightMode) {
        resolve(true);
      } else {
        return settings();
      }
    });
  });
  Ms5_s2_a1.addClearer(function (anchor) {
    var action = Ms5_s2_a1;
    var mainDiv = document.getElementById(anchor[1]);
    var settingList = document.querySelector(anchor[2]);
    var settingAction = Ms5_s1_a1;
    if (actionHasReset(action, false)) return Promise.resolve(true);
    var _action$getStore10 = action.getStore(),
      coordi1 = _action$getStore10.coordi1,
      coordi2 = _action$getStore10.coordi2;
    triggerCleaner(action);
    settingAction.getClearer()();
    return moveToOriginalPosition(mainDiv, settingList, {
      coordi1: coordi1,
      coordi2: coordi2
    });
  });
  var Ms5_s2_a2 = Ms5_s2_a1.nextAction;
  Ms5_s2_a2.addAnchor([".dayMode .modeShift"]);
  Ms5_s2_a2.addTitle("");
  Ms5_s2_a2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Bravo, as you can see, the colors are more dark allowing you to read easily in low light condition" : "Bravo, Comme vous pouvez le voir, les couleurs sont plus sombre permettant ainsi une lecture agreable dans un environnement de faible lumiere";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "to go back to the preceding mode, click again in the blinking section" : "Pour revenir au mode precedent cliquer de nouveau sur la section clignotante";
  }]);
  Ms5_s2_a2.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var clicker = document.querySelector(anchor[0]);
      var counters = []; //= [];
      var listeners = [];
      var initialState = [];
      originalBackground(initialState, clicker);
      animateBackground(clicker, counters);
      addListener(listeners, clicker, 'click', function (event) {
        event.preventDefault();
        meticulus('settings', function () {
          triggerCleaner(action, false);
          resolve(true);
        });
      });
      action.addToStore({
        counters: counters,
        listeners: listeners,
        initialState: initialState
      });
    });
  });
  Ms5_s2_a2.addClearer(function (anchor) {
    var action = Ms5_s2_a2;
    if (actionHasReset(action, false)) return Promise.resolve(true);
    triggerCleaner(action);
    return action.prevAction.getClearer()();
  });
  var Ms5_s2_a3 = Ms5_s2_a2.nextAction;
  Ms5_s2_a3.addTitle("");
  Ms5_s2_a3.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Congratulation, You've finish the dark mode tutorial" : "Felicitation, vous avez finit le tutoriel sur le mode nuit";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can go to the next section" : "Vous pouvez passer au tutoriel suivant";
  }]);
  Ms5_s2_a3.addClearer(function () {
    var action = Ms5_s2_a3;
    return action.prevAction.getClearer()();
  });
  var Ms5_s3 = Ms5_s2.nextSection;
  Ms5_s3.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Changing langage" : "Change la langue";
  });
  Ms5_s3.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can also change you langage" : "Vous avez egalement la possibilité de change la langue";
  }]);
  var Ms5_s3_a1 = Ms5_s3.action.addAction().addAction();
  Ms5_s3_a1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "To change the langage, please click in the blinking section" : "Pour changer la langue, veuillez cliquer sur la section clignotante";
  }]);
  Ms5_s3_a1.addAnchor([".language .langShift", "main", ".settings .list", ".language .list"]);
  Ms5_s3_a1.addProcess(function (anchor) {
    var action = Ms5_s3_a1;
    var mainDiv = document.getElementById(anchor[1]);
    var settingList = document.querySelector(anchor[2]);
    var languageList = document.querySelector(anchor[3]);
    if (settingList.className.indexOf("whoosh") != -1) {
      revertAction(action);
      action.addTitle("");
      action.addText([function () {
        var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
        return lang.toLowerCase() == "en" ? "Please click in the blinking section at the top to show the configuration list" : "Veuillez cliquer sur la section clignotante en haut pour afficher les configurations disponible";
      }]);
      action.addProcess(function () {
        var settingAction = Ms5_s1_a1;
        return settingAction.doProcess()().then(function (r) {
          return action.getClearer()().then(function () {
            return {
              updateText: true
            };
          });
        });
      });
      return Promise.resolve({
        updateText: true
      });
    }
    if (languageList.className.indexOf("whoosh") == -1) {
      document.querySelector(anchor[0]).click();
    }
    return moveToBottom(mainDiv, settingList, action).then(function (r) {
      var clicker = document.querySelector(anchor[0]);
      var counters = []; //= [];
      var initialState = [];
      var listeners = [];
      originalBackground(initialState, clicker);
      animateBackground(clicker, counters);
      return new Promise(function (resolve, reject) {
        addListener(listeners, clicker, 'click', function (event) {
          event.preventDefault();
          meticulus('language', function () {
            triggerCleaner(action, false);
            resolve(true);
          });
        });
        action.addToStore({
          counters: counters,
          initialState: initialState,
          listeners: listeners
        });
      });
    });
  });
  Ms5_s3_a1.addClearer(function (anchor) {
    var action = Ms5_s3_a1;
    var settingAction = Ms5_s1_a1;
    var mainDiv = document.getElementById(anchor[1]);
    var settingList = document.querySelector(anchor[2]);
    var _action$getStore11 = action.getStore(),
      coordi1 = _action$getStore11.coordi1,
      coordi2 = _action$getStore11.coordi2;
    settingAction.getClearer()();
    triggerCleaner(action);
    return moveToOriginalPosition(mainDiv, settingList, {
      coordi1: coordi1,
      coordi2: coordi2
    });
  });
  var Ms5_s3_a2 = Ms5_s3_a1.nextAction;
  Ms5_s3_a2.addTitle("");
  Ms5_s3_a2.addText(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Choose a langage among the blinking ones" : "Veuillez choisir l'une des langues dans la section clignotante";
  });
  Ms5_s3_a2.addAnchor([".language .list", ".langShift"]);
  Ms5_s3_a2.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var settings = function settings() {
        var action = Ms5_s3_a2;
        var languageList = document.querySelector(anchor[0]);
        var clickers = (0,_BrowserDb_cjs__WEBPACK_IMPORTED_MODULE_0__.tA)(languageList.querySelectorAll("a"), "forEach", "map", "slice");
        var counters = []; //= [];
        var listeners = [];
        var initialState = [];
        var problematics = [function () {
          return forceUpdate('settings', false);
        }, function () {
          if (document.querySelector(anchor[0])) {
            var langShifter = document.querySelector(anchor[1]);
            langShifter.click();
          }
        }];
        originalBackground(initialState, clickers);
        animateBackground(clickers, counters);
        addListener(listeners, clickers, 'click', function (event) {
          event.preventDefault();
          triggerCleaner(action, false);
          var updateForceSettings = store.getState().updateForced.settings;
          meticulus('settings', function () {
            return resolve(true);
          });
          forceUpdate('settings', !updateForceSettings);
        });
        action.addToStore({
          counters: counters,
          listeners: listeners,
          initialState: initialState,
          problematics: problematics
        });
      };
      var languageList = document.querySelector(anchor[0]);
      if (languageList.className.indexOf('whoosh') != -1) {
        var langShift = document.querySelector(anchor[1]);
        meticulus('settings', settings);
        langShift.click();
      } else settings();
    });
  });
  Ms5_s3_a2.addClearer(function (anchor) {
    var action = Ms5_s3_a2;
    triggerCleaner(action);
    return action.prevAction.getClearer()();
  });
  var Ms5_s3_a3 = Ms5_s3_a2.nextAction;
  Ms5_s3_a3.addTitle("");
  Ms5_s3_a3.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Congratulation, You've finish the tutorial about the langage changement. You can go to the next section" : "Felicitation, vous avez finit ce tutoriel sur le changement de langue, Veuillez passer à la section  suivante";
  }]);
  Ms5_s3_a3.addClearer(function (anchor) {
    var action = Ms5_s3_a3;
    return action.prevAction.getClearer()();
  });
  var Ms5_s4 = Ms5_s3.nextSection;
  Ms5_s4.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Control key trigger" : "Activer la touche de control";
  });
  var Ms5_s4_a1 = Ms5_s4.action.addAction().addAction();
  Ms5_s4_a1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "The control key allow you to display hidden functionnality. In triggered the key, you'll see modifications and deletion link for songs and categories " : "La touche de control vous permet d'afficher des fonctionnalité cachés, en appuyant sur la touche de control vous verez les liens de modifications et de suppressions s'afficher pour chaque chansons et categorie";
  }]);
  Ms5_s4_a1.addAnchor(['.control .controlShift', "main", ".settings .list"]);
  Ms5_s4_a1.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      var action = Ms5_s4_a1;
      var mainDiv = document.getElementById(anchor[1]);
      var settingList = document.querySelector(anchor[2]);
      if (settingList.className.indexOf("whoosh") != -1) {
        revertAction(action);
        action.addTitle("");
        action.addText(function () {
          var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
          return lang.toLowerCase() == "en" ? "Please, click in the blinking section at the top" : "Veuillez cliquer sur la section clignotante en haut";
        });
        action.addProcess(function () {
          var settingAction = Ms5_s1_a1;
          return settingAction.doProcess()().then(function (r) {
            return action.getClearer()().then(function () {
              return {
                updateText: true
              };
            });
          });
        });
        return resolve({
          updateText: true
        });
      }
      if (store.getState().keys.alt) {
        revertAction(action);
        action.addTitle("");
        action.addText([function () {
          var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
          return lang.toLowerCase() == "en" ? "Oh, we see that you've already triggered the control key. You can go to the next section" : "Oh, nous voyons que vous savez dejà activer la touche control, Veuillez passer à l'etape suivante";
        }]);
        action.addProcess(function () {
          return new Promise(function (resolve, reject) {});
        });
        return resolve({
          updateText: true
        });
      }
      moveToBottom(mainDiv, settingList, action).then(function (r) {
        var clicker = document.querySelector(anchor[0]);
        var counters = []; //= [];
        var initialState = [];
        var listeners = [];
        originalBackground(initialState, clicker);
        animateBackground(clicker, counters);
        addListener(listeners, clicker, 'click', function (event) {
          event.preventDefault();
          meticulus('settings', function () {
            triggerCleaner(action, false);
            resolve(true);
          });
        });
        action.addToStore({
          counters: counters,
          initialState: initialState,
          listeners: listeners
        });
      });
    });
  });
  Ms5_s4_a1.addClearer(function (anchor) {
    var action = Ms5_s4_a1;
    var settingAction = Ms5_s1_a1;
    var mainDiv = document.getElementById(anchor[1]);
    var settingList = document.querySelector(anchor[2]);
    var _action$getStore12 = action.getStore(),
      coordi1 = _action$getStore12.coordi1,
      coordi2 = _action$getStore12.coordi2;
    settingAction.getClearer()();
    triggerCleaner(action);
    return moveToOriginalPosition(mainDiv, settingList, {
      coordi1: coordi1,
      coordi2: coordi2
    });
  });
  var Ms5_s4_a2 = Ms5_s4_a1.nextAction;
  Ms5_s4_a2.addTitle("");
  Ms5_s4_a2.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Display the categories list to see the new controls that have appeared" : "Afficher la liste des categories pour voir les nouveaux controls qui vont apparaitre";
  }]);
  Ms5_s4_a2.addProcess(function () {
    return Ms2_s1_a1.doProcess()().then(function (r) {
      return r;
    });
  });
  Ms5_s4_a2.addClearer(function () {
    Ms5_s4_a2.prevAction.getClearer()();
    return Ms2_s1_a1.getClearer()().then(function (r) {
      return r;
    });
  });
  var Ms5_s4_a3 = Ms5_s4_a2.nextAction;
  Ms5_s4_a3.addTitle("");
  Ms5_s4_a3.addAnchor([".wipe", ".modif"]);
  Ms5_s4_a3.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You'll see appear modification et deletion link" : "Vous verez apparaitre les controls de modifications(M) et de suppersions(S)";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "The modification link allow you to modify a song or a category" : "Le controls de modifications(M) vous permettre de modifier une chansons ou une categorie";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "The deletion link allow you to delete a song or a categorie" : "Le control de suppersions vous permettra de supprimer une chanson ou categorie";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "You can go to the next step" : "Vous pouvez passer à l'etape suivante";
  }]);
  Ms5_s4_a3.addProcess(function (anchor) {
    return new Promise(function (resolve, reject) {
      try {
        var _action2 = Ms5_s4_a3;
        var controls = [];
        var c1 = document.querySelectorAll(anchor[0]);
        var c2 = document.querySelectorAll(anchor[1]);
        for (var i = 0; i < c2.length && i < c1.length; i++) {
          c1[i] && controls.push(c1[i]);
          c2[i] && controls.push(c2[i]);
        }
        c1 = null;
        c2 = null;
        var counters = []; //= [];
        var initialState = [];
        var actionsReverser = [[store, _aCreator_cjs__WEBPACK_IMPORTED_MODULE_1__.setControl, false]];
        originalBackground(initialState, controls);
        animateBackground(controls, counters);
        _action2.addToStore({
          initialState: initialState,
          counters: counters,
          actionsReverser: actionsReverser
        });
      } catch (e) {
        alert(e);
      }
    });
  });
  Ms5_s4_a3.addClearer(function (anchor) {
    var action = Ms5_s4_a3;
    triggerCleaner(action);
    action.prevAction.getClearer()();
    return Promise.resolve(true);
  });
  var Ms6 = Ms5.nextStep;
  Ms6.addTitle(function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "End" : "Fin";
  });
  var Ms6_s1 = Ms6.section;
  Ms6_s1.addText([function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "Here we are at the end" : "Vous voilà, arrivé à la fin de ce tutoriel";
  }, function () {
    var lang = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en";
    return lang.toLowerCase() == "en" ? "We hope this tutorial will have give you a clear oversight of the functionnality of the app" : "Nous esperons que ce tutoriel vous a donné un apperçu global des capacité de l'application";
  }]);
  return Ms;
}

/***/ })

}]);
//# sourceMappingURL=guider.js.map