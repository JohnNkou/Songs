function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
import React from 'react';
import { connect } from 'react-redux';
import { storageHandler, dbChooser, compose, relay, getAllReturn, seq, fetcher, abortSubscription, SUB, indexChanger, curry, safeOp, registerWorker, validator, is, timeThis, adjustHeight } from '../utilis/BrowserDb.cjs';
import Text from '../utilis/Text.cjs';
import Action from '../utilis/aCreator.cjs';
import config from '../utilis/db.config.js';
var Texts = /*#__PURE__*/React.createContext(Text),
  table = config.table,
  cat = table.cat,
  song = table.song,
  stream = table.stream,
  cF = cat.fields,
  sF = song.fields,
  stF = stream.fields,
  stq = stream.query,
  displayTime = {
    fast: 50,
    normal: 1500,
    medium: 3000,
    "long": 20000
  },
  insertStatus = {
    FAILED: 0,
    SUCCESS: 1,
    DUPLICATE: 2,
    COMPLETE: 3,
    FAIL_ALL: 4
  },
  signal = {
    system: "mSystem",
    success: "mSuccess",
    error: "mError"
  },
  Validator = new validator();
function scrollHandler(node, event, trackedTouchsArray) {
  try {
    var touches = event.touches;
    if (touches.length > 1) {
      var length = touches.length - 1;
      node.scrollTop += touches[0].clientY - touches[length].clientY;
      trackedTouchsArray.push(touches[length].clientY);
    } else {
      if (trackedTouchsArray.length) {
        var pastY = trackedTouchsArray.shift();
        node.scrollTop += pastY - touches[0].clientY;
        trackedTouchsArray.push(touches[0].clientY);
      } else trackedTouchsArray.push(touches[0].clientY);
    }
  } catch (e) {
    console.error(e);
  }
}
function note() {
  var _this = this;
  var jsx;
  var counter;
  var timeout = displayTime.medium;
  var sequence = new seq();
  this.getTimeout = function () {
    return timeout;
  };
  this.setJsx = function (j) {
    jsx = j;
    window.kk = _this;
  };
  this.addSpeed = function (message, progress, t, node, signalMessage) {
    t = t || timeout;
    sequence.add(function () {
      clearTimeout(counter);
      var state = jsx.state;
      var k = {
        message: message,
        progress: progress,
        node: node,
        signal: signalMessage || signal.system,
        download: ""
      };
      jsx.setState(k);
      counter = setTimeout(function () {
        _this.clear();
      }, timeout);
      return Promise.resolve();
    });
  };
  this.add = function (message, progress, t, node, signalMessage) {
    t = t || timeout;
    sequence.add(function () {
      return new Promise(function (resolve, reject) {
        var state = jsx.state;
        var k = {
          message: message,
          progress: progress,
          node: node,
          signal: signalMessage || signal.system,
          download: ""
        };
        jsx.setState(k);
        counter = setTimeout(function () {
          _this.clear();
          resolve(true);
        }, t);
      });
    });
  };
  this.post = function (message, signal, download) {
    sequence.add(function () {
      clearTimeout(counter);
      var state = jsx.state;
      var k = {
        message: message,
        signal: signal,
        download: download
      };
      jsx.setState(k);
      return Promise.resolve();
    });
  };
  this.clear = function () {
    _this.addSpeed("", null, displayTime.fast);
  };
}
function meticulus(node, fn) {
  window.mountNotifier[node] = [fn];
}
function invoqueAfterMount(selector) {
  if (window.mountNotifier[selector]) {
    var subscriber;
    var length = window.mountNotifier[selector].length;
    while (length--) {
      subscriber = window.mountNotifier[selector].shift();
      subscriber();
    }
    delete window.mountNotifier[selector];
  }
}
function changeStreamCreationImage(img) {
  if (!directAccess['streamCreation']) setTimeout(function () {
    return changeStreamCreationImage(img);
  }, 5);else directAccess['streamCreation'].setState({
    img: img
  });
}
function startStream(name, createdInServer) {
  var img = createdInServer ? startStream.img : _stopStream.img;
  S.setName(name, function () {
    return changeStreamCreationImage("img/".concat(img));
  });
  if (createdInServer) {
    startStream.f();
  }
}
function _stopStream(name) {
  S.setName("", function () {
    return changeStreamCreationImage("img/".concat(_stopStream.img));
  });
  _stopStream.f();
}
var notifier = new note();
var notifier2 = new note();
var db = global.alert ? dbChooser('Test') : null;
var Categories = {};
var Songs = {};
var Pseq = new seq();
var directAccess = {};
var fastAccess = {
  __exec__: []
};
function n(p, time) {
  var u = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Update';
  var f = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var j = f == 1 ? notifier : notifier2;
  j.add("It Taked ".concat(Date.now() - time, " ms to ").concat(u, " ").concat(p));
}
var S;
var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  _inherits(ErrorBoundary, _React$Component);
  var _super = _createSuper(ErrorBoundary);
  function ErrorBoundary(props) {
    _classCallCheck(this, ErrorBoundary);
    return _super.call(this, props);
  }
  _createClass(ErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, errorinfo) {
      alert("Oh");
      alert(error);
      alert(errorinfo);
      console.log(error);
      console.log(errorinfo);
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);
  return ErrorBoundary;
}(React.Component);
var Setup = /*#__PURE__*/function (_React$Component2) {
  _inherits(Setup, _React$Component2);
  var _super2 = _createSuper(Setup);
  function Setup(props, context) {
    var _this2;
    _classCallCheck(this, Setup);
    _this2 = _super2.call(this, props);
    _this2.cachingText = context.caching;
    _this2.streamText = context.Stream;
    _this2.handleKeydown = _this2.handleKeydown.bind(_assertThisInitialized(_this2));
    _this2.configureStream = _this2.configureStream.bind(_assertThisInitialized(_this2));
    _this2.configureStreamManager = _this2.configureStreamManager.bind(_assertThisInitialized(_this2));
    _this2.populateFastAccess = _this2.populateFastAccess.bind(_assertThisInitialized(_this2));
    _this2.registerGlobalClickHandler = _this2.registerGlobalClickHandler.bind(_assertThisInitialized(_this2));
    _this2.globalClickHandler = _this2.globalClickHandler.bind(_assertThisInitialized(_this2));
    _this2.handleDirection = _this2.handleDirection.bind(_assertThisInitialized(_this2));
    return _this2;
  }
  _createClass(Setup, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var direction = this.props.direction;
      if (!this.first) this.first = document.getElementById("first");
      if (!this.second) this.second = document.getElementById("second");
      if (prevProps.direction != direction) {
        this.handleDirection(direction);
      }
    }
  }, {
    key: "populateFastAccess",
    value: function populateFastAccess(fAccess) {
      for (var n in fastAccess) {
        if (fastAccess.hasOwnProperty(n)) fAccess[n] = fAccess[n];
      }
      fastAccess = fAccess;
    }
  }, {
    key: "handleDirection",
    value: function handleDirection(direction) {
      var first = this.first,
        second = this.second,
        firstClassName = first.className.split(" "),
        secondClassName = second.className.split(" "),
        addFirstClass = direction == "Right" ? "TRR" : "TLL",
        addSecondClass = direction == "Right" ? "TRRR" : "Full";
      this.first.className = "".concat(firstClassName[0], " ").concat(addFirstClass, " ").concat(firstClassName[2]);
      this.second.className = "".concat(secondClassName[0], " ").concat(addSecondClass);
    }
  }, {
    key: "registerGlobalClickHandler",
    value: function registerGlobalClickHandler(handler) {
      window.onclick = handler;
    }
  }, {
    key: "globalClickHandler",
    value: function globalClickHandler(event) {
      var _this$props = this.props,
        changeCatListView = _this$props.changeCatListView,
        changeResultListView = _this$props.changeResultListView,
        changeStreamListView = _this$props.changeStreamListView,
        changeFavListView = _this$props.changeFavListView,
        changeSettingListView = _this$props.changeSettingListView,
        resultView = _this$props.resultView,
        catListView = _this$props.catListView,
        streamListView = _this$props.streamListView,
        favListView = _this$props.favListView,
        settingListView = _this$props.settingListView;
      if (event.target.inlist) event.stopPropagation();else {
        if (catListView) changeCatListView(false);
        if (resultView) changeResultListView(false);
        if (streamListView) changeStreamListView(false);
        if (favListView) changeFavListView(false);
        if (settingListView) changeSettingListView(false);
      }
    }
  }, {
    key: "configureStream",
    value: function configureStream() {
      var _this3 = this;
      var _this$props2 = this.props,
        lang = _this$props2.lang,
        images = _this$props2.images,
        streamText = this.streamText;
      startStream.f = startStream ? function () {
        notifier2.addSpeed(streamText.started(lang), undefined, undefined, undefined, signal.success);
        _this3.props.startStream();
        setTimeout(function () {
          localStorage.setItem("stream", JSON.stringify({
            name: S.getName(),
            time: Date.now()
          }));
        }, 15);
      } : function () {
        return console.error("First componentDidMount, startStream not defined in props");
      };
      _stopStream.f = _stopStream ? function () {
        notifier2.addSpeed(streamText.stopped(lang));
        _this3.props.stopStream();
        setTimeout(function () {
          localStorage.removeItem("stream");
        }, 15);
      } : function () {
        return console.error("First componentDidMount, stopStream not defined in scope");
      };
      startStream.img = images.streamCreate.stop;
      _stopStream.img = images.streamCreate.start;
    }
  }, {
    key: "configureStreamManager",
    value: function configureStreamManager(fAccess, streamManager, fastAccess) {
      S = streamManager;
      S.addFastAccess(fastAccess);
    }
  }, {
    key: "handleKeydown",
    value: function handleKeydown(event) {
      var setControl = this.props.setControl;
      if (event.target.tagName.indexOf('input') != -1 && event.altKey) setControl(this.props.controls);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var Text = this.cachingText;
      var streamText = this.streamText;
      var _this$props3 = this.props,
        lang = _this$props3.lang,
        streamManager = _this$props3.streamManager,
        startStream = _this$props3.startStream,
        stopStream = _this$props3.stopStream,
        setControl = _this$props3.setControl,
        images = _this$props3.images,
        fAccess = this.props.fastAccess,
        fn = null;
      this.populateFastAccess(this.props.fAccess);
      this.configureStream();
      this.configureStreamManager(fAccess, streamManager, fastAccess);
      this.registerGlobalClickHandler(this.globalClickHandler);
      window.db = db;
      window.ss = S;
      window.fetcher = fetcher;
      window.onkeydown = this.handleKeydown;
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);
  return Setup;
}(React.Component);
Setup.contextType = Texts;
var SetupC = connect(function (state, ownProps) {
  return _objectSpread({
    lang: state.language,
    images: state.images,
    controls: state.keys.alt,
    resultView: state.ui.show.resultList,
    catListView: state.ui.show.catList,
    streamListView: state.ui.show.streamList,
    favListView: state.ui.show.favList,
    settingListView: state.ui.show.settingList,
    direction: state.ui.direction
  }, ownProps);
}, {
  startStream: Action.startStream,
  stopStream: Action.stopStream,
  setControl: Action.setControl,
  changeCatListView: Action.changeCatListView,
  changeResultListView: Action.changeResultListView,
  changeStreamListView: Action.changeStreamListView,
  changeFavListView: Action.changeFavListView,
  changeSettingListView: Action.changeSettingListView
})(Setup);
var FirstHelper = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(FirstHelper, _React$PureComponent);
  var _super3 = _createSuper(FirstHelper);
  function FirstHelper(props) {
    _classCallCheck(this, FirstHelper);
    return _super3.call(this, props);
  }
  _createClass(FirstHelper, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props4 = this.props,
        firstDirection = _this$props4.firstDirection,
        direction = _this$props4.direction,
        setDirection = _this$props4.setDirection;
      if (firstDirection != direction) setDirection(direction);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$props5 = this.props,
        direction = _this$props5.direction,
        setDirection = _this$props5.setDirection;
      if (prevProps.direction != direction) setDirection(direction);
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);
  return FirstHelper;
}(React.PureComponent);
var FirstHelperC = connect(function (state, ownProps) {
  return _objectSpread({
    direction: state.ui.direction
  }, ownProps);
})(FirstHelper);
var First = /*#__PURE__*/function (_React$Component3) {
  _inherits(First, _React$Component3);
  var _super4 = _createSuper(First);
  function First(props, context) {
    _classCallCheck(this, First);
    return _super4.call(this, props);
  }
  _createClass(First, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.node = document.getElementById('first');
    }
  }, {
    key: "render",
    value: function render() {
      var direction = this.props.direction;
      return /*#__PURE__*/React.createElement("div", {
        id: "first",
        className: (direction && direction == "Right" ? "il TRR " : "il TLL ") + "silverBack"
      }, /*#__PURE__*/React.createElement(DownloaderLine, null), /*#__PURE__*/React.createElement(Notification, {
        parent: "First"
      }), /*#__PURE__*/React.createElement(Head1, null), /*#__PURE__*/React.createElement("div", {
        className: "songList"
      }, /*#__PURE__*/React.createElement(OnlineSongsC, null), /*#__PURE__*/React.createElement(OfflineSongsC, null)));
    }
  }]);
  return First;
}(React.Component);
First.contextType = Texts;
var Counter = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(Counter, _React$PureComponent2);
  var _super5 = _createSuper(Counter);
  function Counter(props) {
    var _this4;
    _classCallCheck(this, Counter);
    _this4 = _super5.call(this, props);
    _this4.state = {
      number: props.i
    };
    _this4.updateNumber = _this4.updateNumber.bind(_assertThisInitialized(_this4));
    if (props.setUpdater) props.setUpdater(_this4.updateNumber, _assertThisInitialized(_this4));
    return _this4;
  }
  _createClass(Counter, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.i != this.props.i && this.props.i != this.state.number) this.setState({
        number: this.props.i
      });
    }
  }, {
    key: "updateNumber",
    value: function updateNumber(number) {
      this.setState({
        number: this.state.number + number
      });
    }
  }, {
    key: "render",
    value: function render() {
      var number = this.state.number;
      var additionalClass = this.props.additionalClass;
      additionalClass = additionalClass || "";
      return /*#__PURE__*/React.createElement("span", {
        className: " counter ".concat(additionalClass)
      }, number);
    }
  }]);
  return Counter;
}(React.PureComponent);
var OnlineSongs = /*#__PURE__*/function (_React$Component4) {
  _inherits(OnlineSongs, _React$Component4);
  var _super6 = _createSuper(OnlineSongs);
  function OnlineSongs(props, context) {
    var _this5;
    _classCallCheck(this, OnlineSongs);
    _this5 = _super6.call(this, props);
    _this5.state = {
      show: false,
      report: false
    };
    _this5.initialSongLength = props.songLength;
    _this5.SavedSongs = 0;
    _this5.failedToSavedSongs = [];
    _this5.Text = context.Song;
    _this5.downloading = {};
    _this5.manageShowing = _this5.manageShowing.bind(_assertThisInitialized(_this5));
    _this5.Notify = curry(_this5.Notify.bind(_assertThisInitialized(_this5)))(_this5.Text);
    _this5.throwReport = _this5.throwReport.bind(_assertThisInitialized(_this5));
    _this5.traceReport = _this5.traceReport.bind(_assertThisInitialized(_this5));
    _this5.setUpdater = _this5.setUpdater.bind(_assertThisInitialized(_this5));
    _this5.updateSongStatus = _this5.updateSongStatus.bind(_assertThisInitialized(_this5));
    _this5.initTime = Date.now();
    _this5.handleScroll = _this5.handleScroll.bind(_assertThisInitialized(_this5));
    return _this5;
  }
  _createClass(OnlineSongs, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this6 = this;
      //n('OnlineSongs',this.initTime,'Mount');
      var c = setInterval(function () {
        _this6.node = document.querySelector("#online .papa");
        if (_this6.node) clearInterval(c);
      }, 15);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var props = this.props;
      var state = this.state;
      if (nextState.show != state.show || props.to != nextProps.to) return true;
      if (nextState.report && state.report && nextProps.catName == props.catName) return false;else if (!nextState.report && !state.report && nextProps.catName == props.catName && nextProps.songLength == props.songLength && nextProps.controls == props.controls) return false;
      return true;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var props = this.props;
      var state = this.state;
      if (!this.initialSongLength && props.songLength || prevProps.catName != props.catName) {
        this.initialSongLength = props.songLength;
      }
      if (!props.songLength && state.report) {
        this.setState({
          report: false
        });
      }
      invoqueAfterMount('online');
    }
  }, {
    key: "handleScroll",
    value: function handleScroll(event) {
      var _this$props6 = this.props,
        songLength = _this$props6.songLength,
        to = _this$props6.to,
        updateSongList = _this$props6.updateSongList,
        node = this.node,
        nodeHeight = node.getBoundingClientRect().height,
        scrollTop = node.scrollTop,
        scrollHeight = node.scrollHeight,
        percent = (nodeHeight + scrollTop) / node.scrollHeight * 100;
      if (songLength >= to && percent >= 70) {
        updateSongList(to + 100);
      }
    }
  }, {
    key: "traceReport",
    value: function traceReport(t) {
      var total = this.failedToSavedSongs.length + this.SavedSongs;
      if (total >= this.initialSongLength) {
        if (this.SavedSongs == this.initialSongLength) {
          this.downloading[this.props.currentCat] = true;
          this.setState({
            report: false
          });
          return [insertStatus.COMPLETE, null, null];
        } else {
          return [insertStatus.FAIL_ALL, this.SavedSongs, this.initialSongLength];
        }
      }
    }
  }, {
    key: "updateSongStatus",
    value: function updateSongStatus(status, name) {
      if (status == insertStatus.SUCCESS) {
        this.SavedSongs++;
      } else if (status == insertStatus.FAILED) {
        this.failedToSavedSongs.push(name);
      }
    }
  }, {
    key: "throwReport",
    value: function throwReport(full) {
      this.downloading[this.props.catName] = true;
      this.setState({
        report: true
      });
    }
  }, {
    key: "getPercentage",
    value: function getPercentage() {
      if (!this.SavedSongs) return 0;
      if (!this.initialSongLength) throw Error("initialSongLength is zero");
      var percent = (parseFloat(this.SavedSongs / this.initialSongLength).toPrecision(4) * 100).toPrecision(4);
      return percent;
    }
  }, {
    key: "Notify",
    value: function Notify(T, lang, status, name, percent) {
      var n = notifier[this.report && this.SavedSongs != this.initialSongLength ? "add" : "addSpeed"],
        Text = this.Text;
      if (status == insertStatus.SUCCESS) {
        n(Text.insertion.success(lang, name), percent);
      } else if (status == insertStatus.DUPLICATE) {
        n(Text.insertion.duplicate(lang, name), percent);
      } else if (status == insertStatus.FAILED) {
        n(Text.insertion.failed(lang, name));
      } else if (status == insertStatus.COMPLETE) {
        n(Text.insertion.allDone(lang), percent);
      } else if (status == insertStatus.FAIL_ALL) n(Text.insertion.allNotDone(langs, name, percent));
    }
  }, {
    key: "setUpdater",
    value: function setUpdater(updater, s) {
      this.counterUpdater = updater.bind(s);
    }
  }, {
    key: "manageShowing",
    value: function manageShowing(event) {
      event.preventDefault();
      event.stopPropagation();
      var show = this.state.show;
      this.setState({
        show: !show
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this7 = this;
      var show = this.state.show;
      var props = this.props;
      var lang = props.lang;
      var mustReport = this.state.report;
      var report;
      var additionalClass = show ? 'heightHelper' : 'online';

      // Report expect to have status, name, parameter
      if (mustReport) {
        var composeBinded = compose.bind(this);
        var getAllReturnBinded = getAllReturn.bind(this);
        var relayBinded = relay.bind(this);
        var notify = this.Notify(lang);
        report = composeBinded(this.traceReport, notify, getAllReturnBinded(this.getPercentage, relayBinded(this.updateSongStatus)));
      }
      return /*#__PURE__*/React.createElement("div", {
        id: "online",
        className: "il ".concat(additionalClass)
      }, /*#__PURE__*/React.createElement("div", {
        className: "onlineHead il blueBack"
      }, /*#__PURE__*/React.createElement("a", {
        className: "vmid tagName",
        id: "onLink",
        href: "#",
        onClick: this.manageShowing
      }, "Online"), /*#__PURE__*/React.createElement(Counter, {
        i: props.songLength,
        setUpdater: this.setUpdater
      }), show && props.songLength ? /*#__PURE__*/React.createElement(Download, _defineProperty({
        additionalClass: "vmid",
        src: props.downloadImage,
        download: function download() {
          return Promise.resolve(db.isBogus ? [null] : []);
        },
        action: [function () {
          return new Promise(function (resolve) {
            resolve(false);
            _this7.throwReport();
          });
        }]
      }, "additionalClass", "vmid")) : '', /*#__PURE__*/React.createElement(Liner, {
        additionalClass: "vmid"
      })), show ? /*#__PURE__*/React.createElement("div", {
        onScroll: this.handleScroll,
        className: "papa"
      }, /*#__PURE__*/React.createElement(SongList, _extends({
        location: "online",
        counterUpdater: this.counterUpdater,
        report: report,
        includeAdder: false
      }, props))) : '');
    }
  }]);
  return OnlineSongs;
}(React.Component);
OnlineSongs.contextType = Texts;
var OnlineSongsC = connect(function (state, ownProps) {
  var _objectSpread2;
  return _objectSpread((_objectSpread2 = {
    songLength: state.currentCat.name ? state.onlineSongs[state.currentCat.id].length : [].length,
    songs: state.currentCat.name ? state.onlineSongs[state.currentCat.id] : [],
    to: state.ui.navigation.to,
    catName: state.currentCat.name,
    controls: state.keys.alt,
    currentCat: state.currentCat,
    lang: state.language,
    downloadImage: state.images.download
  }, _defineProperty(_objectSpread2, "songs", state.currentCat.name ? state.onlineSongs[state.currentCat.id] : []), _defineProperty(_objectSpread2, "updateForced", state.updateForced), _defineProperty(_objectSpread2, "increment", state.songIncrement), _defineProperty(_objectSpread2, "direction", state.ui.direction), _defineProperty(_objectSpread2, "subscribedToStream", state.subscribedToStream), _objectSpread2), ownProps);
}, {
  updateSongList: Action.updateSongList,
  addSong: Action.addSong,
  removeSong: Action.removeSong,
  changeIndex: Action.changeIndex,
  setCurrentSong: Action.setCurrentSong,
  changeAddSongView: Action.changeAddSongView,
  subscribeToStream: Action.subscribeToStream,
  changeDirection: Action.changeDirection
})(OnlineSongs);
var OfflineSongs = /*#__PURE__*/function (_React$Component5) {
  _inherits(OfflineSongs, _React$Component5);
  var _super7 = _createSuper(OfflineSongs);
  function OfflineSongs(props) {
    var _this8;
    _classCallCheck(this, OfflineSongs);
    _this8 = _super7.call(this, props);
    _this8.state = {
      show: false
    };
    _this8.manageShowing = _this8.manageShowing.bind(_assertThisInitialized(_this8));
    _this8.initTime = Date.now();
    return _this8;
  }
  _createClass(OfflineSongs, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      //n('OfflineSong',this.initTime,'Mount');
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      invoqueAfterMount('offline');
    }
  }, {
    key: "manageShowing",
    value: function manageShowing(event) {
      event.preventDefault();
      event.stopPropagation();
      var show = this.state.show;
      this.setState({
        show: !show
      });
    }
  }, {
    key: "render",
    value: function render() {
      var show = this.state.show;
      var props = this.props;
      var additionalClass = show ? 'heightHelper' : 'offline';
      return /*#__PURE__*/React.createElement("div", {
        id: "offline",
        className: "il ".concat(additionalClass)
      }, /*#__PURE__*/React.createElement("div", {
        className: "offlineHead il open blueBack"
      }, /*#__PURE__*/React.createElement("a", {
        className: "vmid tagName",
        id: "offLink",
        onClick: this.manageShowing,
        href: "#"
      }, "Offline"), /*#__PURE__*/React.createElement(Counter, {
        i: props.songs.length
      }), /*#__PURE__*/React.createElement(Liner, {
        additionalClass: "vmid"
      })), show ? /*#__PURE__*/React.createElement("div", {
        className: "papa"
      }, /*#__PURE__*/React.createElement(SongList, _extends({
        location: "offline",
        includeModify: true,
        includeAdder: true
      }, props))) : '');
    }
  }]);
  return OfflineSongs;
}(React.Component);
var OfflineSongsC = connect(function (state, ownProps) {
  var songs = state.currentCat.name ? state.offlineSongs[state.currentCat.id] : [];
  return _objectSpread({
    songs: songs,
    songLength: songs.length,
    updateForced: state.updateForced,
    lang: state.language,
    controls: state.keys.alt,
    to: state.ui.navigation.to,
    increment: state.songIncrement,
    currentCat: state.currentCat,
    direction: state.ui.direction,
    subscribedToStream: state.subscribedToStream
  }, ownProps);
}, {
  setCurrentSong: Action.setCurrentSong,
  updateSongList: Action.updateSongList,
  removeSong: Action.removeSong,
  addSong: Action.addSong,
  changeIndex: Action.changeIndex,
  changeAddSongView: Action.changeAddSongView,
  subscribeToStream: Action.subscribeToStream,
  changeDirection: Action.changeDirection
})(OfflineSongs);
var DownloaderLine = /*#__PURE__*/function (_React$PureComponent3) {
  _inherits(DownloaderLine, _React$PureComponent3);
  var _super8 = _createSuper(DownloaderLine);
  function DownloaderLine() {
    _classCallCheck(this, DownloaderLine);
    return _super8.apply(this, arguments);
  }
  _createClass(DownloaderLine, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        id: "download",
        className: "whoosh"
      }, /*#__PURE__*/React.createElement("div", {
        className: "progress mSuccess"
      }, " "));
    }
  }]);
  return DownloaderLine;
}(React.PureComponent);
var Notification = /*#__PURE__*/function (_React$PureComponent4) {
  _inherits(Notification, _React$PureComponent4);
  var _super9 = _createSuper(Notification);
  function Notification(props) {
    var _this9;
    _classCallCheck(this, Notification);
    _this9 = _super9.call(this, props);
    _this9.state = {
      message: "",
      node: null,
      signal: signal.system
    };
    return _this9;
  }
  _createClass(Notification, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.parent == "First") notifier.setJsx(this);else notifier2.setJsx(this);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
        message = _this$state.message,
        progress = _this$state.progress,
        node = _this$state.node,
        signal = _this$state.signal,
        download = _this$state.download;
      var percent = "".concat(progress, "%");
      var hide = message ? '' : 'whoosh';
      return /*#__PURE__*/React.createElement("div", {
        className: "Notification AllRound littleBox ".concat(hide, " ").concat(signal)
      }, /*#__PURE__*/React.createElement("div", {
        className: "il vmid"
      }, message), /*#__PURE__*/React.createElement("div", {
        className: "tight vmid"
      }), download ? download : '');
    }
  }]);
  return Notification;
}(React.PureComponent);
var AddCatDiv = /*#__PURE__*/function (_React$Component6) {
  _inherits(AddCatDiv, _React$Component6);
  var _super10 = _createSuper(AddCatDiv);
  function AddCatDiv(props, context) {
    var _this10;
    _classCallCheck(this, AddCatDiv);
    _this10 = _super10.call(this, props);
    _this10.submit = _this10.submit.bind(_assertThisInitialized(_this10));
    _this10.updateCat = _this10.updateCat.bind(_assertThisInitialized(_this10));
    _this10.Text = context.addCatDiv;
    _this10.formError = context.formError;
    _this10.formText = context.formError;
    _this10.state = {
      message: function message() {
        return "";
      },
      name: "",
      signal: signal.system
    };
    _this10.cleanUp = _this10.cleanUp.bind(_assertThisInitialized(_this10));
    _this10.handleClick = _this10.handleClick.bind(_assertThisInitialized(_this10));
    _this10.checker = _this10.checker.bind(_assertThisInitialized(_this10));
    _this10.adjustHeight = _this10.adjustHeight.bind(_assertThisInitialized(_this10));
    _this10.badInput = /\W/;
    return _this10;
  }
  _createClass(AddCatDiv, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this11 = this;
      var _catName = this.refs._catName;
      _catName.onchange = function () {
        var state = _this11.state;
        _this11.setState(_objectSpread(_objectSpread({}, state), {}, {
          name: _catName.value
        }));
      };
      this.node = document.getElementById("addCat");
      this.popUp = document.querySelector(".popUp");
      this.box = document.querySelector(".popUp .Box");
      invoqueAfterMount('addCatDiv');
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _catName = this.refs._catName;
      var name = this.state.name;
      var state = this.state;
      var _this$props7 = this.props,
        lang = _this$props7.lang,
        current = _this$props7.current;
      var Text = this.Text;
      if (this.props.controls) {
        if (this.props.current.name) {
          _catName.value = !prevProps.controls || prevProps.current.name != current.name ? current.name : name || current.name;
          this.refs._add.textContent = Text.modiButtonText(lang);
        }
      } else if (!this.props.controls) {
        _catName.value = name;
        this.refs._add.textContent = Text.addButtonText(lang);
      }
      this.adjustHeight(this.popUp, this.box);
      invoqueAfterMount('addCatDiv');
    }
  }, {
    key: "adjustHeight",
    value: function adjustHeight(wrapper, box) {
      var wrapperHeight = wrapper.getBoundingClientRect().height,
        boxHeight = box.getBoundingClientRect().height,
        winHeight = window.innerHeight;
      if (wrapperHeight < boxHeight) {
        if (winHeight >= boxHeight) {
          wrapper.style.height = boxHeight + "px";
        } else {
          wrapper.style.height = winHeight + "px";
        }
      } else if (wrapperHeight > boxHeight) {
        wrapper.style.height = boxHeight + "px";
      }
    }
  }, {
    key: "checker",
    value: function checker(e) {
      var _this12 = this;
      e.preventDefault();
      var lang = this.props.lang,
        catNames = this.props.catNames.map(function (catName) {
          return catName.toLowerCase();
        }),
        catName = this.refs._catName,
        catNameValue = catName.value,
        action = null,
        message = "",
        text = this.Text,
        formError = this.formError;
      if (!Validator.hasSomething(catNameValue)) {
        action = function action() {
          _this12.setState({
            message: text.message.nameRequired,
            signal: signal.error
          });
        };
      } else if (Validator.hasBadCharacter(catNameValue, this.badInput)) {
        action = function action() {
          _this12.setState({
            message: _this12.formError.badCharacter(text.nameHolder(lang)),
            signal: signal.error
          });
        };
      } else if (!Validator.isNotIn(catNameValue.toLowerCase(), catNames)) {
        action = function action() {
          _this12.setState({
            message: text.message.alreadyExist,
            signal: signal.system
          });
        };
      } else if (Validator.isMoreThan(catNameValue.length, 20)) {
        action = function action() {
          _this12.setState({
            message: formError.inputToLong(text.nameHolder(lang), 20),
            signal: signal.error
          });
        };
      }
      return {
        action: action
      };
    }
  }, {
    key: "submit",
    value: function submit(e) {
      var _this$props8 = this.props,
        current = _this$props8.current,
        lastCatId = _this$props8.lastCatId,
        lang = _this$props8.lang,
        catName = this.refs._catName.value,
        _this$checker = this.checker(e),
        action = _this$checker.action,
        message = _this$checker.message;
      if (action) {
        return action();
      } else {
        this.props.addCategorie(catName, lastCatId);
        this.setState({
          message: this.Text.message.success,
          signal: signal.success
        });
        db.insertCategorie(catName)().then(function (r) {
          if (r) {
            console.log("categorie", catName, "was inserted");
          } else console.log("something went wrong while trying to insert categorie ", catName);
        }).Oups(function (e) {
          console.log("Failed to insertCategorie", e);
        });
      }
    }
  }, {
    key: "updateCat",
    value: function updateCat(e) {
      var _catName = this.refs._catName;
      var props = this.props;
      var oldName = props.current.name;
      var newName = _catName.value;
      var _this$checker2 = this.checker(e),
        action = _this$checker2.action;
      var current = props.current;
      if (action) {
        return action();
      } else {
        this.setState({
          message: this.Text.message.updated,
          name: _catName.value,
          signal: signal.success
        });
        props.updateCategorie(oldName, newName, current.id);
        props.forceUpdate({
          node: 'catNames',
          value: true
        });
        meticulus('catNames', function () {
          return props.forceUpdate({
            node: 'catNames',
            value: false
          });
        });
      }
    }
  }, {
    key: "cleanUp",
    value: function cleanUp() {
      this.setState(_objectSpread(_objectSpread({}, this.state), {}, {
        message: function message() {
          return "";
        },
        name: "",
        signal: signal.system
      }));
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      var target = event.target,
        isOfInterest = target.className.indexOf('add') != -1 || target.className.indexOf('close') != -1,
        className = null,
        props = this.props;
      if (isOfInterest) {
        event.preventDefault();
        event.stopPropagation();
        className = target.className;
        if (className.indexOf('add') != -1) {
          if (props.controls && props.current.name) this.updateCat(event);else this.submit(event);
        } else if (className.indexOf('close') != -1) {
          props.changeCatView(false);
          this.cleanUp();
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props9 = this.props,
        lang = _this$props9.lang,
        controls = _this$props9.controls,
        view = _this$props9.view;
      var text = this.Text;
      var _this$state2 = this.state,
        message = _this$state2.message,
        signal = _this$state2.signal;
      var but1 = controls ? text.modiButtonText : text.addButtonText;
      var but2 = text.closeButtonText;
      view = view ? '' : 'whoosh';
      return /*#__PURE__*/React.createElement("div", {
        id: "addCat",
        className: view
      }, /*#__PURE__*/React.createElement("p", {
        className: "message ".concat(signal)
      }, /*#__PURE__*/React.createElement("span", {
        className: "status"
      }, message(lang))), /*#__PURE__*/React.createElement("div", {
        className: "catName"
      }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
        className: "signal error"
      })), /*#__PURE__*/React.createElement("input", {
        ref: "_catName",
        type: "text",
        name: "",
        placeholder: text.nameHolder(lang)
      })), /*#__PURE__*/React.createElement("div", {
        onClick: this.handleClick,
        className: "actions il"
      }, /*#__PURE__*/React.createElement("input", {
        ref: "_add",
        className: "add blueBack",
        type: "submit",
        name: "",
        value: but1(lang)
      }), /*#__PURE__*/React.createElement("input", {
        ref: "_close",
        className: "close blueBack",
        name: "",
        type: "submit",
        value: but2(lang)
      })));
    }
  }]);
  return AddCatDiv;
}(React.Component);
AddCatDiv.contextType = Texts;
var AddCatDivC = connect(function (state, ownProps) {
  var Categories = state.Categories;
  return _objectSpread({
    lang: state.language,
    controls: state.keys.alt,
    current: state.currentCat,
    catNames: Categories,
    view: state.ui.show.addCatDiv,
    lastCatId: state.Categories.length,
    catNamesString: Categories.join(' ')
  }, ownProps);
}, {
  forceUpdate: Action.setForceUpdate,
  updateCategorie: Action.updateCategorie,
  updateSongList: Action.updateSongList,
  addCategorie: Action.addCategorie,
  changeCatView: Action.changeCatView
})(AddCatDiv);
var AddSongDiv = /*#__PURE__*/function (_React$Component7) {
  _inherits(AddSongDiv, _React$Component7);
  var _super11 = _createSuper(AddSongDiv);
  function AddSongDiv(props, context) {
    var _this13;
    _classCallCheck(this, AddSongDiv);
    _this13 = _super11.call(this, props);
    _this13.kak = _this13.kak.bind(_assertThisInitialized(_this13));
    _this13.changeVerseNumber = _this13.changeVerseNumber.bind(_assertThisInitialized(_this13));
    _this13.updateSong = _this13.updateSong.bind(_assertThisInitialized(_this13));
    _this13.deleteVerse = _this13.deleteVerse.bind(_assertThisInitialized(_this13));
    _this13.hasOverflowed = _this13.hasOverflowed.bind(_assertThisInitialized(_this13));
    _this13.scrollHandler = scrollHandler.bind(_assertThisInitialized(_this13));
    _this13.lastUpdateOverflowed = false;
    _this13.state = {
      VerseNumber: "",
      Verses: [],
      name: "",
      lang: _this13.props.lang,
      message: "",
      VersesText: {},
      signal: signal.system
    };
    _this13.Text = context.addSongDiv;
    _this13.formError = context.formError;
    _this13.songText = context.Song;
    _this13.handleClick = _this13.handleClick.bind(_assertThisInitialized(_this13));
    _this13.focusSignal = _this13.focusSignal.bind(_assertThisInitialized(_this13));
    return _this13;
  }
  _createClass(AddSongDiv, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      invoqueAfterMount('AddSongDiv');
      this.node = document.getElementById("addSong");
      this.listDiv = document.querySelector(".popUp .wrap");
      if (window.innerWidth > 400) {
        this.hasOverflowed = function () {
          return false;
        };
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.listDiv.ontouchmove = "";
      this.listDiv.ontouchend = "";
      delete this.node;
      delete this.listDiv;
    }
  }, {
    key: "hasOverflowed",
    value: function hasOverflowed() {
      try {
        var nodeHeight = this.node.getBoundingClientRect().height;
        var listDivHeight = this.listDiv.getBoundingClientRect().height;
        return nodeHeight > listDivHeight;
      } catch (e) {
        alert(e);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this14 = this;
      this.focusSignal();
      try {
        if (this.hasOverflowed()) {
          if (!this.lastUpdateOverflowed) {
            this.lastUpdateOverflowed = true;
            var trackedTouchs = [];
            this.listDiv.ontouchend = function () {
              trackedTouchs = [];
            };
            this.listDiv.ontouchmove = function (event) {
              try {
                _this14.scrollHandler(_this14.listDiv, event, trackedTouchs);
              } catch (e) {
                console.error(e);
              }
            };
          }
        } else {
          if (this.lastUpdateOverflowed) this.lastUpdateOverflowed = false;
        }
        this.props.adjustHeight();
        if (prevProps.current.name != this.props.current.name && this.state.Verses.length || prevProps.lang != this.props.lang) {
          this.setState(_objectSpread(_objectSpread({}, this.state), {}, {
            Verses: [],
            lang: this.props.lang
          }));
        }
        var _this$refs = this.refs,
          _name = _this$refs._name,
          _verseNumber = _this$refs._verseNumber;
        if (this.props.controls) {
          var VersesText = this.state.VersesText;
          _name.value = this.props.current.name;
          var Verses = this.state.Verses.length && this.state.Verses || this.props.current.Verses;
          var _loop = function _loop() {
            var input = ["_Verse".concat(i)];
            var Verse = _this14.refs[input];
            if (!Verse) return "break";else {
              Verse.value = VersesText[input] || Verses[i - 1] && Verses[i - 1].Text || '';
              if (!VersesText[input]) VersesText[input] = Verse.value;
              if (!Verse.onchange) {
                Verse.onchange = function () {
                  var localState = _this14.state;
                  VersesText[input] = Verse.value;
                };
              }
            }
          };
          for (var i = 1;; i++) {
            var _ret = _loop();
            if (_ret === "break") break;
          }
        } else {
          var state = this.state;
          var _loop2 = function _loop2(input) {
            if (_this14.refs.hasOwnProperty(input)) {
              if (input != '_name' && input != '_verseNumber' && !_this14.refs[input].onchange) {
                var Verse = _this14.refs[input];
                Verse.onchange = function () {
                  var localState = _this14.state;
                  state.VersesText[input] = Verse.value;
                };
              }
              if (_this14.state.VersesText[input]) {
                var tem;
                var tam;
                _this14.refs[input].value = _this14.state.VersesText[input];
              } else {
                _this14.refs[input].value = "";
              }
            }
          };
          for (var input in this.refs) {
            _loop2(input);
          }
          if (this.state.name) _name.value = this.state.name;
          if (this.state.VerseNumber) _verseNumber.value = this.state.VerseNumber;
        }
      } catch (e) {
        alert(e);
      }
      this.props.adjustHeight();
      invoqueAfterMount('addSongDiv');
    }
  }, {
    key: "focusSignal",
    value: function focusSignal() {
      var signalDiv = document.querySelector(".status");
      signalDiv.scrollIntoView();
    }
  }, {
    key: "kak",
    value: function kak(e) {
      var _this15 = this;
      var _this$checker3 = this.checker(e),
        action = _this$checker3.action,
        Verses = _this$checker3.Verses,
        _name = _this$checker3._name,
        songName = _name && _name.value;
      if (action) return action();else {
        var _this$props10 = this.props,
          addSong = _this$props10.addSong,
          forceUpdate = _this$props10.forceUpdate,
          currentCatName = _this$props10.currentCatName,
          lang = _this$props10.lang,
          catId = _this$props10.catId;
        db.insertSong(songName, Verses, currentCatName)().then(function (r) {
          if (r) {
            notifier.addSpeed(_this15.songText.insertion.success(lang, songName), null, null, null, signal.success);
          } else notifier.addSpeed(_this15.songText.insertion.failed(lang, songName), null, null, null, signal.error);
        }).Oups(function (e) {
          alert("addCatDiv kak insertSong " + e);
        });
        addSong(0, songName, catId, Verses);
        forceUpdate({
          node: 'songList',
          value: true
        });
        this.setState({
          name: "",
          message: this.Text.message.success(lang),
          VersesText: {},
          Verses: [],
          VerseNumber: 0,
          signal: signal.success
        });
        meticulus('songList', function () {
          forceUpdate({
            node: 'songList',
            value: false
          });
        });
      }
    }
  }, {
    key: "changeVerseNumber",
    value: function changeVerseNumber(number) {
      var _this$refs2 = this.refs,
        _verseNumber = _this$refs2._verseNumber,
        _name = _this$refs2._name;
      var n;
      if (!parseInt(number) || !number) {
        n = parseInt(_verseNumber.value || 0);
      } else {
        n = parseInt(number);
      }
      var vvv = _verseNumber.value;
      var nV = _name.value;
      if (!_name.value.length) {
        this.setState({
          name: "",
          VerseNumber: vvv || "",
          message: this.Text.message.nameRequired(this.props.lang),
          signal: signal.error
        });
        return;
      }
      if (is.Number(n)) {
        if (n <= 0) {
          this.setState({
            name: nV,
            VerseNumber: vvv,
            message: this.Text.message.verseNumberBadNumber(this.props.lang),
            signal: signal.error
          });
          return;
        } else if (n >= 15) {
          this.setState(_objectSpread(_objectSpread({}, this.state), {}, {
            name: nV,
            VerseNumber: vvv,
            message: this.Text.message.verseNumberToBig(this.props.lang),
            signal: signal.error
          }));
          return;
        }
        _verseNumber.value = n;
        this.setState({
          message: "",
          VerseNumber: n,
          name: nV,
          Verses: new Array(n),
          signal: signal.system
        });
      } else {
        this.setState({
          name: nV,
          VerseNumber: vvv,
          message: this.Text.message.verseNumberNotInteger(this.props.lang),
          signal: signal.error
        });
        return;
      }
    }
  }, {
    key: "checker",
    value: function checker(e) {
      var _this16 = this;
      e.preventDefault();
      var message = "",
        _name = this.refs._name,
        Verses = [],
        VersesText = this.state.VersesText,
        subRefs = _objectSpread({}, this.refs),
        Text = this.Text,
        formError = this.formError,
        lang = this.props.lang;
      delete subRefs['_name'];
      delete subRefs['_verseNumber'];
      if (!Validator.hasSomething(_name.value)) {
        return {
          action: function action() {
            _this16.setState({
              name: "",
              message: _this16.Text.message.nameRequired(_this16.props.lang),
              VersesText: VersesText,
              signal: signal.error
            });
          }
        };
      }
      if (Validator.isAllEmpty(subRefs, 'value')) {
        message += this.Text.message.verseRequired(this.props.lang);
        return {
          action: function action() {
            _this16.setState({
              message: message,
              name: _name.value,
              signal: signal.error
            });
          }
        };
      }
      for (var i = 1;; i++) {
        var Verse = this.refs["_Verse".concat(i)];
        if (!Verse) break;else if (!Validator.hasSomething(Verse.value)) message += formError.required("Verse")(lang);else {
          VersesText["_Verse".concat(i)] = Verse.value;
          Verses.push({
            Text: Verse.value
          });
        }
      }
      if (message) {
        return {
          action: function action() {
            _this16.setState({
              message: message,
              name: _name.value,
              VersesText: VersesText,
              signal: signal.error
            });
          }
        };
      }
      return {
        Verses: Verses,
        _name: _name
      };
    }
  }, {
    key: "updateSong",
    value: function updateSong(e) {
      var _this$checker4 = this.checker(e),
        action = _this$checker4.action,
        Verses = _this$checker4.Verses,
        _name = _this$checker4._name;
      if (action) return action();else {
        var _this$props11 = this.props,
          location = _this$props11.location,
          updateSong = _this$props11.updateSong,
          currentCatName = _this$props11.currentCatName,
          _setCurrentSong = _this$props11.setCurrentSong,
          current = _this$props11.current,
          lang = _this$props11.lang,
          catId = _this$props11.catId;
        updateSong(current.id, catId, _name.value, Verses, location, current.name);
        _setCurrentSong(current.id, catId, location);
        this.setState({
          message: this.Text.message.updated(lang),
          signal: signal.success
        });
      }
    }
  }, {
    key: "deleteVerse",
    value: function deleteVerse(id) {
      var VersesText = this.state.VersesText;
      var Verses = this.state.Verses.length ? this.state.Verses : new Array(this.props.current.Verses.length);
      Verses.pop();
      var nextVerse;
      var oldVerse = null;
      var _verseNumber = this.refs._verseNumber;
      _verseNumber.value = Verses.length;
      while (nextVerse = this.refs["_Verse".concat(++id)]) {
        VersesText["_Verse".concat(id - 1)] = nextVerse.value;
        oldVerse = nextVerse;
      }
      if (oldVerse) {
        var deleted = delete VersesText["_Verse".concat(id - 1)];
      } else {
        var _deleted = delete VersesText["_Verse".concat(id - 1)];
      }
      var objectKeys = Object.keys(this.refs);
      this.setState(_objectSpread(_objectSpread({}, this.state), {}, {
        Verses: Verses,
        VerseNumber: Verses.length,
        VersesText: VersesText
      }));
    }
  }, {
    key: "cleanUp",
    value: function cleanUp() {
      this.setState(_objectSpread(_objectSpread({}, this.state), {}, {
        message: "",
        VersesText: {},
        name: "",
        VerseNumber: "",
        Verses: []
      }));
    }
  }, {
    key: "handleClick",
    value: function handleClick(e) {
      var target = e.target,
        isOfInterest = target.className.indexOf("add") != -1 || target.className.indexOf("close") != -1,
        className = null,
        props = this.props;
      if (isOfInterest) {
        e.preventDefault();
        className = target.className;
        if (className.indexOf('add') != -1) {
          if (props.controls) this.updateSong(e);else this.kak(e);
        } else {
          props.changeAddSongView(false);
          props.changeVerseDiv(0);
          this.cleanUp();
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this17 = this;
      var props = this.props;
      var _this$state3 = this.state,
        Verses = _this$state3.Verses,
        name = _this$state3.name,
        signal = _this$state3.signal;
      var l = props.lang;
      var controls = props.controls;
      var text = this.Text;
      var verseNumber = controls ? Verses && Verses.length || props.current.Verses && props.current.Verses.length || 0 : Verses.length;
      var but1 = controls ? text.modiButtonText : text.addButtonText;
      var but2 = text.closeButtonText;
      var view = props.view ? '' : 'whoosh';
      return /*#__PURE__*/React.createElement("div", {
        id: "addSong",
        className: "addSong ".concat(view)
      }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
        className: "status ".concat(signal)
      }, this.state.message)), /*#__PURE__*/React.createElement("div", {
        className: "songName"
      }, /*#__PURE__*/React.createElement("input", {
        ref: "_name",
        type: "text",
        placeholder: "Nom de la chanson"
      })), /*#__PURE__*/React.createElement("div", {
        className: "verseChanger"
      }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
        className: "signal"
      }, text.verseNumberHolder(l))), /*#__PURE__*/React.createElement("input", {
        className: "verseNumber",
        ref: "_verseNumber",
        type: "number",
        placeholder: verseNumber
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
        className: "changeVerse changeSubmit blueBack",
        type: "submit",
        value: "Changer",
        onClick: this.changeVerseNumber
      })), _toConsumableArray(Array(verseNumber)).map(function (verse, i) {
        return /*#__PURE__*/React.createElement("div", {
          className: "verseText"
        }, /*#__PURE__*/React.createElement("textarea", {
          cols: "50%",
          rows: "5%",
          ref: "_Verse".concat(i + 1),
          className: "Verse"
        }), verseNumber - 1 == i ? /*#__PURE__*/React.createElement("button", {
          className: "plus",
          onClick: function onClick() {
            return _this17.changeVerseNumber(verseNumber + 1);
          }
        }, "+") : '', i > 0 ? /*#__PURE__*/React.createElement("button", {
          className: "minus",
          onClick: function onClick() {
            return _this17.deleteVerse(i + 1);
          }
        }, "-") : '');
      }), /*#__PURE__*/React.createElement("div", {
        onClick: this.handleClick,
        className: "actions il"
      }, /*#__PURE__*/React.createElement("input", {
        className: "add blueBack",
        type: "submit",
        name: "",
        value: but1(l)
      }), /*#__PURE__*/React.createElement("input", {
        className: "close blueBack",
        type: "submit",
        value: but2(l)
      })));
    }
  }]);
  return AddSongDiv;
}(React.Component);
AddSongDiv.contextType = Texts;
var AddSongDivC = connect(function (state, ownProps) {
  return _objectSpread({
    location: state.currentSong.location,
    lang: state.language,
    controls: state.keys.alt,
    current: state.currentSong,
    VersesDiv: state.ui.addSongDiv.Verses,
    currentCatName: state.currentCat.name,
    catId: state.currentCat.id,
    view: state.ui.show.addSongDiv
  }, ownProps);
}, {
  forceUpdate: Action.setForceUpdate,
  setCurrentSong: Action.setCurrentSong,
  updateSong: Action.updateSong,
  changeVerseDiv: Action.changeVerseDivNumber,
  changeAddSongView: Action.changeAddSongView,
  addSong: Action.addSong
})(AddSongDiv);
var CreateStream = /*#__PURE__*/function (_React$Component8) {
  _inherits(CreateStream, _React$Component8);
  var _super12 = _createSuper(CreateStream);
  function CreateStream(props, context) {
    var _this18;
    _classCallCheck(this, CreateStream);
    _this18 = _super12.call(this, props);
    _this18.save = _this18.save.bind(_assertThisInitialized(_this18));
    _this18.formError = context.formError;
    _this18.cleanUp = _this18.cleanUp.bind(_assertThisInitialized(_this18));
    _this18.state = {
      message: function message() {
        return "";
      },
      disabled: false,
      lang: props.lang,
      signal: signal.system
    };
    _this18.Text = context.createStreamDiv;
    _this18.badInput = /\W/;
    return _this18;
  }
  _createClass(CreateStream, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      invoqueAfterMount('createStream');
      this.box = document.querySelector(".popUp .Box");
      this.popUp = document.querySelector(".popUp");
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      invoqueAfterMount('createStream');
      if (prevProps.lang != this.props.lang) {
        this.setState(_objectSpread(_objectSpread({}, this.state), {}, {
          lang: this.props.lang
        }));
      }
      if (prevProps.isStreaming && !this.props.isStreaming) this.setState({
        message: function message() {
          return "";
        }
      });
      this.props.adjustHeight();
    }
  }, {
    key: "save",
    value: function save() {
      var _this19 = this;
      var _this$props12 = this.props,
        appReachable = _this$props12.appReachable,
        subscribedToStream = _this$props12.subscribedToStream,
        isStreaming = _this$props12.isStreaming,
        lang = _this$props12.lang,
        _this$Text = this.Text,
        Text = _this$Text.Text,
        formError = _this$Text.formError;
      if (!appReachable) return this.setState({
        message: Text.message.networkProblem,
        signal: signal.error
      });
      if (subscribedToStream) return this.setState({
        message: Text.message.UnsubscribeFirst,
        signal: signal.system
      });
      if (isStreaming) return this.setState({
        message: Text.message.isAlreadyStreaming,
        signal: signal.system
      });
      var streamName = this.refs['_name'] && this.refs['_name'].value;
      if (!Validator.hasSomething(streamName)) {
        return this.setState({
          message: Text.message.nameRequired,
          signal: signal.error
        });
      } else if (Validator.isMoreThan(streamName.length, 50)) {
        return this.setState({
          message: formError(Text.nameHolder(lang), 50),
          signal: signal.error
        });
      } else if (this.badInput.test(streamName)) {
        return this.setState({
          message: Text.message.BadCharacter,
          signal: signal.error
        });
      }
      var counter = 1;
      var c = setInterval(function () {
        var _message = _this19.state.message;
        _this19.setState({
          message: function message() {
            var adder = 1;
            var dotNumber = 0;
            if (/^\.+$/.test(_message)) {
              dotNumber = _message.split("").length;
              if (dotNumber > 5) adder = -1;else adder = 1;
            } else _message = "";
            var newDotNumber = dotNumber + adder;
            for (var i = 0; i < newDotNumber; i++) _message += ".";
            return _message;
          }
        });
      }, 500);
      startStream(streamName.toLowerCase());
      fetcher({
        url: "/stream/create/".concat(streamName, "?s=").concat(this.props.songName, "&c=").concat(this.props.catName, "&i=").concat(this.props.index || 0),
        method: 'POST',
        data: JSON.stringify(this.props.Verses),
        s: function s(_s) {
          clearInterval(c);
          _this19.setState({
            message: Text.message.streamCreated,
            disabled: true,
            signal: signal.success
          });
          startStream(streamName.toLowerCase(), true);
        },
        e: function e(_ref) {
          var status = _ref.status,
            error = _ref.error;
          clearInterval(c);
          if (error && error.code && error.code == 6) {
            _stopStream(streamName.toLowerCase());
            return _this19.setState({
              message: Text.message.nameDuplication,
              signal: signal.error
            });
          }
          _this19.setState({
            message: Text.message.creationError,
            signal: signal.error
          });
          _this19.props.setAppUnreachable();
          _stopStream(streamName.toLowerCase());
        },
        setter: function setter(xml) {
          window.bb = xml;
        }
      });
    }
  }, {
    key: "cleanUp",
    value: function cleanUp() {
      var _name = this.refs._name;
      var props = this.props;
      if (_name) _name.value = "";
      this.setState(_objectSpread(_objectSpread({}, this.state), {}, {
        message: function message() {
          return "";
        },
        disabled: false,
        signal: signal.system
      }));
      props.changeView(false);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state4 = this.state,
        message = _this$state4.message,
        disabled = _this$state4.disabled,
        signal = _this$state4.signal;
      var _this$props13 = this.props,
        lang = _this$props13.lang,
        isStreaming = _this$props13.isStreaming;
      var text = this.Text;
      var view = this.props.view ? '' : 'whoosh';
      var closeButton = /*#__PURE__*/React.createElement("input", {
        type: "submit",
        className: "close blueBack",
        onClick: this.cleanUp,
        value: text.close(lang)
      });
      var createForm = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
        ref: "_name",
        type: "text",
        placeholder: text.nameHolder(lang)
      }), /*#__PURE__*/React.createElement("div", {
        className: "actions il"
      }, /*#__PURE__*/React.createElement("input", {
        type: "submit",
        className: "add blueBack",
        onClick: this.save,
        value: text.create(lang)
      }), closeButton));
      return /*#__PURE__*/React.createElement("div", {
        id: "createStream",
        className: "createStream ".concat(view)
      }, /*#__PURE__*/React.createElement("p", {
        className: "message"
      }, /*#__PURE__*/React.createElement("span", {
        className: "status ".concat(signal)
      }, message(lang))), isStreaming ? closeButton : createForm);
    }
  }]);
  return CreateStream;
}(React.Component);
CreateStream.contextType = Texts;
var CreateStreamC = connect(function (state, ownProps) {
  return _objectSpread({
    appReachable: state.appReachable,
    subscribedToStream: state.subscribedToStream,
    lang: state.language,
    index: state.ui.navigation.verseIndex,
    catName: state.currentCat.name,
    songName: state.currentSong.name,
    Verses: state.currentSong.Verses,
    view: state.ui.show.createStreamDiv,
    isStreaming: state.isStreaming
  }, ownProps);
}, {
  setAppUnreachable: Action.setAppUnreachable,
  changeView: Action.changeStreamCreateView
})(CreateStream);
var Second = /*#__PURE__*/function (_React$Component9) {
  _inherits(Second, _React$Component9);
  var _super13 = _createSuper(Second);
  function Second(props) {
    var _this20;
    _classCallCheck(this, Second);
    _this20 = _super13.call(this, props);
    _this20.clickHandler = _this20.clickHandler.bind(_assertThisInitialized(_this20));
    _this20.initTime = Date.now();
    return _this20;
  }
  _createClass(Second, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      //n('Second',this.initTime,'Mount');
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate() {
      return true;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      invoqueAfterMount('favorite');
    }
  }, {
    key: "clickHandler",
    value: function clickHandler(event) {
      var _this$props14 = this.props,
        changeCatListView = _this$props14.changeCatListView,
        changeResultListView = _this$props14.changeResultListView,
        changeStreamListView = _this$props14.changeStreamListView,
        changeFavListView = _this$props14.changeFavListView,
        resultView = _this$props14.resultView,
        catListView = _this$props14.catListView,
        streamListView = _this$props14.streamListView,
        favListView = _this$props14.favListView;
      if (event.target.inlist) event.stopPropagation();else {
        if (catListView) changeCatListView(false);
        if (resultView) changeResultListView(false);
        if (streamListView) changeStreamListView(false);
        if (favListView) changeFavListView(false);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props;
      var className = props.direction && props.direction == "Right" ? 'il TRRR ' : 'il Full ';
      return /*#__PURE__*/React.createElement("div", {
        onClick: this.clickHandler,
        id: "second",
        className: className
      }, /*#__PURE__*/React.createElement(Notification, null), props.showGuide ? /*#__PURE__*/React.createElement(Guider, {
        end: props.endGuide,
        step: props.step,
        showGuide: props.showGuide
      }) : '', /*#__PURE__*/React.createElement(Head2, null), /*#__PURE__*/React.createElement(SongContent, null));
    }
  }]);
  return Second;
}(React.Component);
var CatToggler = /*#__PURE__*/function (_React$Component10) {
  _inherits(CatToggler, _React$Component10);
  var _super14 = _createSuper(CatToggler);
  function CatToggler(props) {
    var _this21;
    _classCallCheck(this, CatToggler);
    _this21 = _super14.call(this, props);
    _this21.clickHandler = _this21.clickHandler.bind(_assertThisInitialized(_this21));
    return _this21;
  }
  _createClass(CatToggler, [{
    key: "clickHandler",
    value: function clickHandler(event) {
      var _this$props15 = this.props,
        changeCatListView = _this$props15.changeCatListView,
        catListView = _this$props15.catListView;
      event.preventDefault();
      event.stopPropagation();
      changeCatListView(!catListView);
    }
  }, {
    key: "render",
    value: function render() {
      var image = this.props.image;
      return /*#__PURE__*/React.createElement("div", {
        className: "il c1"
      }, /*#__PURE__*/React.createElement("a", {
        href: "#",
        onClick: this.clickHandler
      }, /*#__PURE__*/React.createElement("img", {
        src: "img/".concat(image)
      })));
    }
  }]);
  return CatToggler;
}(React.Component);
var CatTogglerC = connect(function (state) {
  return {
    catListView: state.ui.show.catList,
    image: state.images.categorie
  };
}, {
  changeCatListView: Action.changeCatListView
})(CatToggler);
var Head1 = function Head1(props) {
  function clickHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    props.changeCatListView(!props.catListView);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement(CatTogglerC, null), /*#__PURE__*/React.createElement(InputC, null), /*#__PURE__*/React.createElement(TogglerC, null), /*#__PURE__*/React.createElement(Liner, null), /*#__PURE__*/React.createElement(CatNamesC, null), /*#__PURE__*/React.createElement(ResultListC, null));
};
var Input = /*#__PURE__*/function (_React$Component11) {
  _inherits(Input, _React$Component11);
  var _super15 = _createSuper(Input);
  function Input(props) {
    var _this22;
    _classCallCheck(this, Input);
    _this22 = _super15.call(this, props);
    _this22.inlet = "Josaphat";
    _this22.initTime = Date.now();
    return _this22;
  }
  _createClass(Input, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this23 = this;
      this.node = this.refs['_search'];
      var view = this.props.view;
      if (!this.node) {
        console.error("Input componentDidMount this.node is null");
      } else {
        this.node.oninput = function (event) {
          var value = _this23.node.value;
          if (value.length > 2) {
            _this23.search(value);
            _this23.changeView(!view);
          } else {
            if (_this23.props.view) _this23.search("");
          }
        };
      }
      //n('Input',this.initTime,'Mount');
    }
  }, {
    key: "search",
    value: function search(term) {
      this.props.searchSong(term);
    }
  }, {
    key: "changeView",
    value: function changeView(view) {
      this.props.changeResultListView(view);
    }
  }, {
    key: "render",
    value: function render() {
      var holder = this.props.holder || "Rechercher";
      return /*#__PURE__*/React.createElement("div", {
        className: "il c2"
      }, /*#__PURE__*/React.createElement("input", {
        ref: "_search",
        type: "text",
        name: "",
        placeholder: holder
      }));
    }
  }]);
  return Input;
}(React.Component);
var InputC = connect(function (state) {
  return {
    view: state.ui.show.resultList
  };
}, {
  searchSong: Action.searchSong,
  changeResultListView: Action.changeResultListView
})(Input);
var Toggler = /*#__PURE__*/function (_React$Component12) {
  _inherits(Toggler, _React$Component12);
  var _super16 = _createSuper(Toggler);
  function Toggler(props) {
    var _this24;
    _classCallCheck(this, Toggler);
    _this24 = _super16.call(this, props);
    _this24.mustChangeDirection = _this24.mustChangeDirection.bind(_assertThisInitialized(_this24));
    _this24.clickHandler = _this24.clickHandler.bind(_assertThisInitialized(_this24));
    return _this24;
  }
  _createClass(Toggler, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.mustChangeDirection()) {
        this.props.changeDirection(this.props.direction == "Right" ? "Left" : "Right");
      }
    }
  }, {
    key: "mustChangeDirection",
    value: function mustChangeDirection() {
      var full = document.querySelector(".FULL");
      if (full) {
        if (this.props.direction != "Left") return true;
        return false;
      } else if (this.props.direction == "Left") {
        return true;
      } else return false;
    }
  }, {
    key: "clickHandler",
    value: function clickHandler(event) {
      var _this$props16 = this.props,
        changeDirection = _this$props16.changeDirection,
        direction = _this$props16.direction;
      event.preventDefault();
      event.stopPropagation();
      changeDirection(direction == "Right" ? "Left" : "Right");
    }
  }, {
    key: "render",
    value: function render() {
      var direction = this.props.direction;
      direction = direction || "Right";
      return /*#__PURE__*/React.createElement("div", {
        className: "il c3 Toggler"
      }, /*#__PURE__*/React.createElement("a", {
        onClick: this.clickHandler,
        href: "#"
      }, /*#__PURE__*/React.createElement("img", {
        src: "img/Toggle" + direction + ".png"
      })));
    }
  }]);
  return Toggler;
}(React.Component);
var TogglerC = connect(function (state) {
  return {
    direction: state.ui.direction
  };
}, {
  changeDirection: Action.changeDirection
})(Toggler);
var Liner = function Liner(_ref2) {
  var _ref2$additionalClass = _ref2.additionalClass,
    additionalClass = _ref2$additionalClass === void 0 ? '' : _ref2$additionalClass;
  return /*#__PURE__*/React.createElement("div", {
    className: "tight ".concat(additionalClass)
  }, " ");
};
var CatNames = /*#__PURE__*/function (_React$Component13) {
  _inherits(CatNames, _React$Component13);
  var _super17 = _createSuper(CatNames);
  function CatNames(props, context) {
    var _this25;
    _classCallCheck(this, CatNames);
    _this25 = _super17.call(this, props);
    _this25.text = context.Categorie;
    _this25.clickHandler = _this25.clickHandler.bind(_assertThisInitialized(_this25));
    _this25.addCatButton = _this25.addCatButton.bind(_assertThisInitialized(_this25));
    _this25.topClass = "wrap";
    _this25.modif = _this25.modif.bind(_assertThisInitialized(_this25));
    _this25.wipe = _this25.wipe.bind(_assertThisInitialized(_this25));
    _this25.action1 = _this25.action1.bind(_assertThisInitialized(_this25));
    _this25.action2 = _this25.action2.bind(_assertThisInitialized(_this25));
    _this25.download = _this25.download.bind(_assertThisInitialized(_this25));
    _this25.propagationHandler = _this25.propagationHandler.bind(_assertThisInitialized(_this25));
    return _this25;
  }
  _createClass(CatNames, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.node = document.querySelector(".catNames");
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      invoqueAfterMount('catNames');
    }
  }, {
    key: "clickHandler",
    value: function clickHandler(event) {
      var target = event.target,
        props = this.props;
      event.preventDefault();
      if (target.className == "addCatCliquer" || target.className == "imgCliquer") {
        props.changeCatView(true);
      } else event.stopPropagation();
    }
  }, {
    key: "addCatButton",
    value: function addCatButton() {
      return /*#__PURE__*/React.createElement("div", {
        className: this.topClass
      }, /*#__PURE__*/React.createElement("div", {
        id: "addCatButton",
        className: "il f1"
      }, /*#__PURE__*/React.createElement("a", {
        className: "addCatCliquer",
        onClick: this.clickHandler,
        href: "#"
      }, /*#__PURE__*/React.createElement("img", {
        className: "imgCliquer",
        src: "img/Adder.png"
      }))));
    }
  }, {
    key: "modif",
    value: function modif(item, id) {
      var _this$props17 = this.props,
        setCurrentCat = _this$props17.setCurrentCat,
        changeCatView = _this$props17.changeCatView;
      setCurrentCat(item.name || item, id);
      changeCatView(true);
    }
  }, {
    key: "wipe",
    value: function wipe(item, target, id) {
      var removeCategorie = this.props.removeCategorie;
      removeCategorie(item.name || item, id);
    }
  }, {
    key: "action1",
    value: function action1(item, id) {
      var _this$props18 = this.props,
        changeIndex = _this$props18.changeIndex,
        setCurrentCat = _this$props18.setCurrentCat,
        updateSongList = _this$props18.updateSongList,
        changeCatListView = _this$props18.changeCatListView;
      changeIndex(0);
      setCurrentCat(item.name || item, id);
      updateSongList(100);
      changeCatListView(false);
    }
  }, {
    key: "action2",
    value: function action2(_ref3) {
      var name = _ref3.name;
      var text = this.text;
      var lang = this.props.lang;
      return db.insertCategorie(name)().then(function (r) {
        if (r) {
          notifier.addSpeed(text.insertion.success(lang, name));
          return true;
        }
      }).Oups(function (e) {
        notifier.addSpeed(text.insertion.failed(lang, name));
      });
    }
  }, {
    key: "download",
    value: function download(name) {
      return db.getCategorie(name)();
    }
  }, {
    key: "propagationHandler",
    value: function propagationHandler(event) {
      event.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      var action1 = this.action1,
        wipe = this.wipe,
        modif = this.modif,
        download = this.download;
      var props = this.props;
      var hide = props.view ? '' : 'whoosh';
      var lang = props.lang;
      var text = this.text;
      var action2 = [this.action2];
      var action = this.action1;
      var style = {
        style: " abs abBottom shadowR list catNames BRRad " + hide
      };
      return /*#__PURE__*/React.createElement("div", {
        onClick: this.propagationHandler
      }, /*#__PURE__*/React.createElement(List, {
        download: global.alert ? download : null,
        args: {},
        action2: action2,
        modif: modif,
        wipe: wipe,
        controls: props.controls,
        first: this.addCatButton,
        src: props.image,
        action: action,
        list: props.catNames,
        abs: style,
        topClass: this.topClass,
        catName: true
      }));
    }
  }]);
  return CatNames;
}(React.Component);
CatNames.contextType = Texts;
var CatNamesC = connect(function (state, ownProps) {
  var _objectSpread3;
  return _objectSpread((_objectSpread3 = {
    updateForced: state.updateForced.catNames,
    controls: state.keys.alt,
    view: state.ui.show.catList,
    catNames: state.Categories
  }, _defineProperty(_objectSpread3, "controls", state.keys.alt), _defineProperty(_objectSpread3, "image", state.images.download), _objectSpread3), ownProps);
}, {
  changeCatView: Action.changeCatView,
  setCurrentCat: Action.setCurrentCat,
  removeCategorie: Action.removeCategorie,
  changeIndex: Action.changeIndex,
  updateSongList: Action.updateSongList,
  changeCatListView: Action.changeCatListView
})(CatNames);
var ResultList = /*#__PURE__*/function (_React$Component14) {
  _inherits(ResultList, _React$Component14);
  var _super18 = _createSuper(ResultList);
  function ResultList(prop) {
    var _this26;
    _classCallCheck(this, ResultList);
    _this26 = _super18.call(this, prop);
    _this26.scrollHandler = scrollHandler;
    _this26.action = _this26.action.bind(_assertThisInitialized(_this26));
    return _this26;
  }
  _createClass(ResultList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this27 = this;
      this.node = document.querySelector("#first .head .result");
      var trackedTouchs = [];
      this.node.ontouchmove = function (event) {
        _this27.scrollHandler(_this27.node, event, trackedTouchs);
      };
      this.node.ontouchend = function (event) {
        trackedTouchs = [];
      };
    }
  }, {
    key: "componentWillUmount",
    value: function componentWillUmount() {
      this.node.ontouchmove = this.node.ontouchend = null;
    }
  }, {
    key: "action",
    value: function action(_ref4) {
      var songId = _ref4.songId,
        catId = _ref4.catId,
        location = _ref4.location,
        catName = _ref4.catName;
      var _this$props19 = this.props,
        setCurrentCat = _this$props19.setCurrentCat,
        setCurrentSong = _this$props19.setCurrentSong;
      setCurrentCat(catName, catId);
      setCurrentSong(songId, catId, location);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props20 = this.props,
        resultView = _this$props20.resultView,
        songs = _this$props20.songs,
        setCurrentCat = _this$props20.setCurrentCat,
        setCurrentSong = _this$props20.setCurrentSong,
        hide = resultView ? '' : 'whoosh',
        style = {
          style: " abs abBottom list result shadowC BLRad BRRad " + hide
        };
      songs = songs.length ? songs : ["Aucun resultat"];
      return /*#__PURE__*/React.createElement(List, {
        action: this.action,
        abs: style,
        list: songs
      });
    }
  }]);
  return ResultList;
}(React.Component);
var ResultListC = connect(function (state) {
  return {
    resultView: state.ui.show.resultList,
    songs: state.searchResult || []
  };
}, {
  setCurrentCat: Action.setCurrentCat,
  setCurrentSong: Action.setCurrentSong
})(ResultList);
var List = function List(_ref5) {
  var catName = _ref5.catName,
    putInLastAccess = _ref5.putInLastAccess,
    hide = _ref5.hide,
    updateMyCat = _ref5.updateMyCat,
    args = _ref5.args,
    song = _ref5.song,
    abs = _ref5.abs,
    src = _ref5.src,
    _ref5$list = _ref5.list,
    list = _ref5$list === void 0 ? [] : _ref5$list,
    action = _ref5.action,
    action2 = _ref5.action2,
    _ref5$first = _ref5.first,
    first = _ref5$first === void 0 ? function () {} : _ref5$first,
    controls = _ref5.controls,
    wipe = _ref5.wipe,
    modif = _ref5.modif,
    download = _ref5.download,
    downloadAll = _ref5.downloadAll,
    topClass = _ref5.topClass;
  return /*#__PURE__*/React.createElement("div", {
    className: abs ? abs.style : ""
  }, first(), list.map(function (item, i) {
    if (item.name) item = _objectSpread(_objectSpread({}, item), {}, {
      id: i
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "".concat(topClass ? topClass : '') + (song ? " p".concat(i) : ''),
      key: i
    }, /*#__PURE__*/React.createElement(Item, {
      hide: hide,
      i: i,
      args: _objectSpread({}, args),
      item: item,
      action: action,
      action2: action2,
      controls: controls,
      src: src,
      wipe: wipe,
      modif: modif,
      updateMyCat: updateMyCat,
      song: song,
      downloadAll: downloadAll,
      download: download
    }));
  }));
};
var Item = function Item(_ref6) {
  var i = _ref6.i,
    _hide = _ref6.hide,
    item = _ref6.item,
    action = _ref6.action,
    action2 = _ref6.action2,
    controls = _ref6.controls,
    src = _ref6.src,
    _wipe = _ref6.wipe,
    _modif = _ref6.modif,
    updateMyCat = _ref6.updateMyCat,
    song = _ref6.song,
    downloadAll = _ref6.downloadAll,
    download = _ref6.download,
    args = _ref6.args;
  var name = item.name || item;
  if (args) {
    if (item.name) args = _objectSpread(_objectSpread(_objectSpread({}, args), item), {}, {
      index: i
    });else {
      args['name'] = name;
      args['index'] = i;
    }
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "il f1 ".concat(name)
  }, /*#__PURE__*/React.createElement("a", {
    inlist: "true",
    onClick: action ? function (event) {
      event.preventDefault();
      action(item, i);
    } : '',
    href: "#"
  }, name)), src || controls ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "il"
  }, controls ? /*#__PURE__*/React.createElement(Controls, {
    wipe: function wipe(_ref7) {
      var target = _ref7.target;
      return _wipe(item, target, i);
    },
    modif: function modif() {
      return _modif(item, i);
    }
  }) : action2 ? /*#__PURE__*/React.createElement(Download, {
    hide: function hide() {
      return _hide(i);
    },
    args: args,
    downloadAll: downloadAll,
    updateMyCat: updateMyCat,
    name: name,
    song: song,
    src: src,
    download: download,
    action: action2
  }) : '')) : '');
};
var Controls = function Controls(props) {
  return /*#__PURE__*/React.createElement("div", null, props.modif ? /*#__PURE__*/React.createElement("a", {
    className: "modif",
    onClick: function onClick(event) {
      event.preventDefault();
      props.modif();
    },
    href: "#"
  }, "M") : '', /*#__PURE__*/React.createElement("a", {
    className: "wipe",
    onClick: function onClick(event) {
      event.preventDefault();
      props.wipe(event);
    },
    href: "#"
  }, "D"));
};
var Download = /*#__PURE__*/function (_React$Component15) {
  _inherits(Download, _React$Component15);
  var _super19 = _createSuper(Download);
  function Download(props) {
    var _this28;
    _classCallCheck(this, Download);
    _this28 = _super19.call(this, props);
    _this28.doAction = _this28.doAction.bind(_assertThisInitialized(_this28));
    _this28.state = {
      img: true
    };
    _this28.save = _this28.save.bind(_assertThisInitialized(_this28));
    _this28.name = _this28.props.name;
    _this28.checkImageDownload = _this28.checkImageDownload.bind(_assertThisInitialized(_this28));
    return _this28;
  }
  _createClass(Download, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.downloadAll) this.save();
      if (!this.props.song) this.checkImageDownload();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.props.downloadAll) {
        this.save();
      } else if (!this.props.song) {
        this.checkImageDownload();
      }
    }
  }, {
    key: "doAction",
    value: function doAction(action, args, song) {
      return new Promise(function (resolve, reject) {
        action[0](args).then(function (r) {
          if (r) {
            resolve(true);
          } else {
            resolve(false);
          }
        }).Oups(reject);
      });
    }
  }, {
    key: "checkImageDownload",
    value: function checkImageDownload() {
      var _this29 = this;
      var _this$props21 = this.props,
        args = _this$props21.args,
        action2 = _this$props21.action2,
        download = _this$props21.download,
        name = _this$props21.name;
      var img = this.state.img;
      if (!download) {
        if (img) this.setState({
          img: !img
        });
        return false;
      }
      download(name).then(function (r) {
        if (r.length) {
          if (img) {
            _this29.setState({
              img: !img
            });
          }
        } else {
          if (!img) _this29.setState({
            img: !img
          });
        }
      }).Oups(function (e) {
        console.error("checkImageDownload Error", e);
      });
    }
  }, {
    key: "save",
    value: function save(e) {
      var _this30 = this;
      if (e) e.preventDefault();
      var _this$props22 = this.props,
        action = _this$props22.action,
        args = _this$props22.args,
        song = _this$props22.song,
        name = _this$props22.name;
      this.doAction(action, args, song).then(function (r) {
        if (r) {
          if (song) {
            var hide = _this30.props.hide;
            if (hide) hide();
            _this30.props.updateMyCat();
          } else _this30.setState({
            img: false
          });
        } else {
          console.log("Odd thing happened");
        }
      }).Oups(function (e) {
        alert("doAction catch Error");
        alert(e.message);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var show = this.state.img;
      var additionalClass = this.props.additionalClass;
      if (!this.props.song && !Categories[this.name] && this.name) {
        Categories[this.name] = {
          img: show,
          setState: this.setState.bind(this)
        };
      } else if (this.name) Songs[this.name] = {
        img: show,
        setState: this.setState.bind(this)
      };
      return show ? /*#__PURE__*/React.createElement("a", {
        className: "downloader ".concat(additionalClass),
        onClick: this.save,
        href: "#",
        ref: "dad"
      }, /*#__PURE__*/React.createElement("img", {
        src: 'img/' + this.props.src
      })) : '';
    }
  }]);
  return Download;
}(React.Component);
var SongList = /*#__PURE__*/function (_React$Component16) {
  _inherits(SongList, _React$Component16);
  var _super20 = _createSuper(SongList);
  function SongList(props, context) {
    var _this31;
    _classCallCheck(this, SongList);
    _this31 = _super20.call(this, props);
    _this31.text = context.Song;
    _this31.scrollHandler = scrollHandler.bind(_assertThisInitialized(_this31));
    _this31.addMoreSong = _this31.addMoreSong.bind(_assertThisInitialized(_this31));
    _this31.shouldAddMoreSong = _this31.shouldAddMoreSong.bind(_assertThisInitialized(_this31));
    _this31.reportSuccess = _this31.reportSuccess.bind(_assertThisInitialized(_this31));
    _this31.reportError = _this31.reportError.bind(_assertThisInitialized(_this31));
    _this31.songInsert = _this31.songInsert.bind(_assertThisInitialized(_this31));
    _this31.updateMyCat = _this31.updateMyCat.bind(_assertThisInitialized(_this31));
    _this31.download = _this31.download.bind(_assertThisInitialized(_this31));
    _this31.action2 = _this31.action2.bind(_assertThisInitialized(_this31));
    _this31.modif = _this31.modif.bind(_assertThisInitialized(_this31));
    _this31.wipe = _this31.wipe.bind(_assertThisInitialized(_this31));
    _this31.action = _this31.action.bind(_assertThisInitialized(_this31));
    _this31.saveSequence = new seq();
    _this31.initTime = Date.now();
    _this31.insertSong = _this31.insertSong.bind(_assertThisInitialized(_this31));
    _this31.insertCategorie = _this31.insertCategorie.bind(_assertThisInitialized(_this31));
    return _this31;
  }
  _createClass(SongList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this32 = this;
      var location = this.props.location;
      this.node = document.querySelector("#".concat(location, " .list"));
      if (!this.node) {
        alert("this.node #".concat(location, " . list is null"));
        return;
      }
      this.listDiv = document.querySelector("#".concat(location, " .papa"));
      this.second = document.getElementById("second");
      if (window.innerWidth < 400) {
        var trackedTouchs = [];
        this.node.ontouchend = function () {
          trackedTouchs = [];
        };
        this.node.ontouchmove = function (event) {
          _this32.scrollHandler(_this32.listDiv, event, trackedTouchs);
        };
      }
      this.listDiv.onscroll = this.addMoreSong;
      n('SongList', this.initTime, 'Mount');
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var props = this.props;
      if (nextProps.report && props.report && props.currentCat.name == nextProps.currentCat.name && props.songs.length == nextProps.songs.length) return false;
      if (nextProps.currentCat.name == props.currentCat.name && nextProps.songLength != props.songLength) return true;
      if (nextProps.updateForced.songList || nextProps.controls != props.controls || nextProps.to != props.to || nextProps.lang != props.lang || nextProps.currentCat.name != props.currentCat.name || nextProps.report && !props.report || props.report && !nextProps.report) {
        if (props.currentCat.name != nextProps.currentCat.name) this.saveSequence = new seq();
        return true;
      }
      return false;
    }
  }, {
    key: "componentWillUmount",
    value: function componentWillUmount() {
      if (this.node) {
        this.node.ontouchmove = this.node.ontouchend = this.listDiv.onscroll = "";
        delete this.node;
        delete this.onlineDiv;
      }
    }
  }, {
    key: "shouldAddMoreSong",
    value: function shouldAddMoreSong() {
      var _this$props23 = this.props,
        to = _this$props23.to,
        songs = _this$props23.songs,
        updateSongList = _this$props23.updateSongList,
        increment = _this$props23.increment;
      return to < songs.length;
    }
  }, {
    key: "addMoreSong",
    value: function addMoreSong(event) {
      try {
        var _this$props24 = this.props,
          to = _this$props24.to,
          increment = _this$props24.increment,
          updateSongList = _this$props24.updateSongList;
        if (this.shouldAddMoreSong()) {
          var percent = Math.floor((this.listDiv.clientHeight + this.listDiv.scrollTop) / this.listDiv.scrollHeight * 100);
          percent > 65 ? updateSongList(to + increment) : '';
        }
      } catch (e) {
        alert(e);
      }
    }
  }, {
    key: "reportSuccess",
    value: function reportSuccess(name, i, Verses) {
      var _this$props25 = this.props,
        report = _this$props25.report,
        addSong = _this$props25.addSong,
        removeSong = _this$props25.removeSong,
        counterUpdater = _this$props25.counterUpdater,
        currentCat = _this$props25.currentCat,
        songs = _this$props25.songs,
        lang = _this$props25.lang;
      var catName = currentCat.name;
      var catId = currentCat.id;
      if (report) {
        report(i == songs.length - 1 ? insertStatus.COMPLETE : insertStatus.SUCCESS, name);
      } else notifier.addSpeed(this.text.insertion.success(lang, name), undefined, undefined, undefined, signal.success);
      addSong(0, name, catId, Verses, 'offline');
      removeSong(i, catId, name);
      counterUpdater(-1);
      return true;
    }
  }, {
    key: "reportError",
    value: function reportError(name) {
      var _this$props26 = this.props,
        report = _this$props26.report,
        lang = _this$props26.lang;
      if (report) {
        report(insertStatus.FAILED, name);
      } else {
        notifier.addSpeed(this.text.insertion.failed(lang, name), undefined, undefined, undefined, signal.error);
      }
      return true;
    }
  }, {
    key: "songInsert",
    value: function songInsert(songs, cat) {
      var c = Promise.resolve(true);
      var self = this;
      songs.forEach(function (song, i) {
        var name = song.name,
          Verses = song.Verses;
        c = c.then(function () {
          return db.insertSong(name, Verses, cat)().then(function (r) {
            try {
              if (r) {
                self.reportSuccess(name, 0, Verses);
                return true;
              } else {
                self.reportError(name);
                alert("Failed");
                return false;
              }
            } catch (e) {
              alert("insertSong Error" + c);
              console.log(e);
              return e;
            }
          });
        }).Oups(function (e) {
          if (e.code != 6) {
            console.log("db insertSong catch");
            console.log(e);
          }
        });
      });
    }
  }, {
    key: "updateMyCat",
    value: function updateMyCat() {
      var currentCat = this.props.currentCat;
      if (Categories[currentCat.name].img) Categories[currentCat.name].setState({
        img: false
      });
    }
  }, {
    key: "download",
    value: function download(_ref8) {
      var name = _ref8.name,
        cat = _ref8.cat;
      return db.getSong(name, cat)();
    }
  }, {
    key: "insertSong",
    value: function insertSong(name, Verses, cat, index) {
      var _this33 = this;
      var tried = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      return db.insertSong(name, JSON.stringify(Verses), cat)().then(function (r) {
        if (r) {
          _this33.reportSuccess(name, index, Verses);
          return true;
        } else {
          if (tried) return false;
          return _this33.insertCategorie(cat).then(function (id) {
            if (is.Number(id)) return _this33.insertSong(name, Verses, id, index, 1);else return false;
          });
        }
      });
    }
  }, {
    key: "insertCategorie",
    value: function insertCategorie(cat) {
      return db.insertCategorie(cat)().then(function (id) {
        if (is.Number(id)) {
          return id;
        }
        return false;
      }).Oups(function (e) {
        if (e.code == 6) return id;
      });
    }
  }, {
    key: "action2",
    value: function action2(sequence, _ref9) {
      var _this34 = this;
      var name = _ref9.name,
        Verses = _ref9.Verses,
        cat = _ref9.cat,
        index = _ref9.index;
      return new Promise(function (resolve, reject) {
        var self = _this34;
        sequence.subscribe(sequence.add(function () {
          return self.insertSong(name, Verses, cat, index).then(function (r) {
            if (!r) {
              self.reportError(name);
              return false;
            } else return true;
          }).Oups(function (e) {
            console.log("Error while trying to insert song", name);
            console.log(e);
          });
        }), function (f) {
          resolve(f);
        }, function (e) {
          return reject(e);
        });
      });
    }
  }, {
    key: "modif",
    value: function modif(item, id) {
      var _this$props27 = this.props,
        changeIndex = _this$props27.changeIndex,
        setCurrentSong = _this$props27.setCurrentSong,
        location = _this$props27.location,
        changeAddSongView = _this$props27.changeAddSongView,
        currentCat = _this$props27.currentCat;
      changeIndex(0);
      setCurrentSong(id, currentCat.id, item.name, location);
      changeAddSongView(true);
    }
  }, {
    key: "wipe",
    value: function wipe(item, target, songId) {
      var _this35 = this;
      var name = item.name || item;
      var _this$props28 = this.props,
        removeSong = _this$props28.removeSong,
        currentCat = _this$props28.currentCat,
        location = _this$props28.location,
        lang = _this$props28.lang;
      var catName = currentCat.name,
        parent = target.parentNode,
        catId = currentCat.id;
      db.deleteSong(name, catName)().then(function (r) {
        if (r) {
          removeSong(songId, catId, name, location);
          if (catName == name) setCurrentSong("");
          notifier.addSpeed(_this35.text.wiping.success(lang, name), undefined, undefined, undefined, signal.success);
          while (parent && parent.className.indexOf('wrapper') == -1) {
            parent = parent.parentNode;
          }
          parent.style.display = "none";
        } else {
          notifier.addSpeed(_this35.text.wiping.error(lang, name), undefined, undefined, undefined, signal.error);
        }
      }).Oups(function (e) {
        notifier.addSpeed(_this35.text.wiping.error(lang, name), undefined, undefined, undefined, signal.error);
        console.log("Oh oh");
        console.log(e);
      });
    }
  }, {
    key: "action",
    value: function action(x, id) {
      var _this$props29 = this.props,
        currentCat = _this$props29.currentCat,
        setCurrentSong = _this$props29.setCurrentSong,
        subscribedToStream = _this$props29.subscribedToStream,
        subscribeToStream = _this$props29.subscribeToStream,
        location = _this$props29.location,
        changeDirection = _this$props29.changeDirection;
      abortSubscription(fetcher);
      S.updateStream(currentCat.name, x.name, 0, x.Verses);
      setCurrentSong(id, currentCat.id, location);
      if (window.innerWidth <= 425) changeDirection('Left');
      if (subscribedToStream) subscribeToStream(false);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      invoqueAfterMount('songList');
    }
  }, {
    key: "render",
    value: function render() {
      var _this36 = this;
      var props = this.props,
        location = props.location || 'online',
        songs = props.songs,
        lang = props.lang,
        to = props.to,
        saveSequence = new seq(),
        report = props.report,
        songProps = {
          abs: {
            style: 'list il'
          },
          list: []
        },
        action2Curried = curry(this.action2)(this.saveSequence),
        catName = props.currentCat.name,
        cat = props.currentCat.name,
        text = this.text;
      if (report) {
        var Fender = db.insertCategorie(catName)().then(function (id) {
          if (is.Number(id)) {
            _this36.songInsert(songs, id);
          } else {
            console.error("insert Categorie Failed");
            alert("Fender insertCategorie failed");
          }
        }).Oups(function (e) {
          var passableCode = {};
          passableCode[1] = true;
          passableCode[6] = true;
          if (passableCode[e.code]) {
            db.getCategorie(cat)().then(function (r) {
              var id = r.pop().id;
              _this36.songInsert(songs, id);
            });
          } else {
            console.error(e);
            alert("Fender Oups");
            alert(e.message);
            alert(e.code);
          }
        });
      } else {
        songProps = {
          song: db.isBogus ? false : true,
          updateMyCat: this.updateMyCat,
          download: global.alert ? this.download : null,
          args: {
            cat: props.currentCat.name
          },
          action2: [action2Curried],
          modif: !props.includeModify ? null : this.modif,
          wipe: this.wipe,
          controls: props.controls,
          first: props.includeAdder ? !props.currentCat.name ? function () {
            return "";
          } : function () {
            return /*#__PURE__*/React.createElement("div", {
              className: "wrapper"
            }, /*#__PURE__*/React.createElement("div", {
              id: "AddSong",
              className: "il f1"
            }, /*#__PURE__*/React.createElement("a", {
              onClick: function onClick(event) {
                event.preventDefault();
                props.changeAddSongView(true);
              },
              href: "#"
            }, text.adder(lang))), /*#__PURE__*/React.createElement("div", {
              className: "il"
            }));
          } : function () {},
          action: this.action,
          src: props.downloadImage,
          downloadAll: report ? true : false,
          list: report ? songs : songs.slice(0, to),
          abs: {
            style: 'list il'
          },
          hide: function hide(index) {
            /*let className = `.p${index}`
            let parent = document.querySelector(className);
            if(parent)
            	parent.style.display = "none";
            else
            	console.log("Couldn't hide p"+index); */
          },
          topClass: "wrapper"
        };
      }
      return /*#__PURE__*/React.createElement(List, songProps);
    }
  }]);
  return SongList;
}(React.Component);
SongList.contextType = Texts;
var Head2 = function Head2(props) {
  var favListView = props.favListView;
  var streamListView = props.streamListView;
  return /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement(TogglerC, null), /*#__PURE__*/React.createElement(SettingsC, null), /*#__PURE__*/React.createElement(FavoriteC, null), /*#__PURE__*/React.createElement(StreamCreationC, null), /*#__PURE__*/React.createElement(StreamListC, null), /*#__PURE__*/React.createElement(Liner, null));
};
var Favorite = /*#__PURE__*/function (_React$Component17) {
  _inherits(Favorite, _React$Component17);
  var _super21 = _createSuper(Favorite);
  function Favorite(props) {
    var _this37;
    _classCallCheck(this, Favorite);
    _this37 = _super21.call(this, props);
    _this37.clickHandler = _this37.clickHandler.bind(_assertThisInitialized(_this37));
    _this37.action = _this37.action.bind(_assertThisInitialized(_this37));
    return _this37;
  }
  _createClass(Favorite, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "clickHandler",
    value: function clickHandler(event) {
      event.preventDefault();
      event.stopPropagation();
      var _this$props30 = this.props,
        changeFavListView = _this$props30.changeFavListView,
        view = _this$props30.view;
      changeFavListView(!view);
    }
  }, {
    key: "action",
    value: function action(item) {
      var _this$props31 = this.props,
        setCurrentCat = _this$props31.setCurrentCat,
        setCurrentSong = _this$props31.setCurrentSong;
      setCurrentCat(item.catName, item.catId);
      setCurrentSong(item.songId, item.catId, item.location);
    }
  }, {
    key: "buildFavList",
    value: function buildFavList(favorites) {
      var catName = "",
        songName = "",
        Verses = [],
        location = "",
        catId,
        songId,
        favList = [],
        song = {},
        songs = "";
      for (catName in favorites) {
        songs = favorites[catName];
        for (songName in songs) {
          song = songs[songName];
          favList.push({
            catName: catName,
            songName: songName,
            location: song.location,
            Verses: song.Verses,
            songId: song.songId,
            catId: song.catId,
            name: songName
          });
        }
      }
      return favList;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props32 = this.props,
        image = _this$props32.image,
        favorites = _this$props32.favorites,
        view = _this$props32.view,
        favList = this.buildFavList(favorites),
        hide = view ? '' : 'whoosh';
      var style = {
        style: "abs abBottom list shadowC silverBack BLRad BRRad ".concat(hide)
      };
      return /*#__PURE__*/React.createElement("div", {
        className: "fav il c1 tip"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
        id: "favLink",
        onClick: this.clickHandler,
        href: "#"
      }, /*#__PURE__*/React.createElement("img", {
        className: "vmid",
        src: "img/".concat(image)
      }), /*#__PURE__*/React.createElement(Liner, {
        additionalClass: "vmid"
      }), /*#__PURE__*/React.createElement("span", {
        className: "counter"
      }, favList.length))), /*#__PURE__*/React.createElement(List, {
        action: this.action,
        abs: style,
        list: favList
      }));
    }
  }]);
  return Favorite;
}(React.Component);
var FavoriteC = connect(function (state) {
  return {
    view: state.ui.show.favList,
    favorites: state.favorites,
    image: state.images.favorite.start
  };
}, {
  changeFavListView: Action.changeFavListView,
  setCurrentCat: Action.setCurrentCat,
  setCurrentSong: Action.setCurrentSong
})(Favorite);
var StreamCreation = /*#__PURE__*/function (_React$PureComponent5) {
  _inherits(StreamCreation, _React$PureComponent5);
  var _super22 = _createSuper(StreamCreation);
  function StreamCreation(props, context) {
    var _this38;
    _classCallCheck(this, StreamCreation);
    _this38 = _super22.call(this, props);
    _this38.showCreateStream = _this38.showCreateStream.bind(_assertThisInitialized(_this38));
    _this38.stopStream = _this38.stopStream.bind(_assertThisInitialized(_this38));
    _this38.text = context;
    _this38.images = _this38.props.images;
    _this38.state = {
      img: "img/".concat(_this38.images.start)
    };
    return _this38;
  }
  _createClass(StreamCreation, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      invoqueAfterMount('streamCreation');
      if (prevProps.isStreaming == false && this.props.isStreaming == true) {
        var streamName = S.getName();
        this.setState({
          img: "img/".concat(this.images.stop)
        });
      }
    }
  }, {
    key: "showCreateStream",
    value: function showCreateStream(event) {
      var _this39 = this;
      event.preventDefault();
      event.stopPropagation();
      if (!S.getName()) return this.props.changeStreamCreateView(true);
      this.stopStream();
      var c = 0;
      this.counter = setInterval(function () {
        notifier2.addSpeed(_this39.text.Stream.stopping(_this39.props.lang, S.getName(), ".".repeat(c % 6)));
        c++;
      }, 100);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      directAccess["streamCreation"] = this;
      if (S.getName()) this.setState({
        img: "img/".concat(this.images.stop)
      });
    }
  }, {
    key: "stopStream",
    value: function stopStream() {
      var _this40 = this;
      var streamName = S.getName();
      fetcher({
        url: "stream/delete?n=".concat(streamName),
        s: function s(response) {
          clearInterval(_this40.counter);
          notifier2.addSpeed(_this40.text.Stream.stopped(_this40.props.lang, streamName));
          _stopStream(streamName);
          _this40.setState({
            img: "img/".concat(_this40.images.start)
          });
        },
        e: function e(_e) {
          clearInterval(_this40.counter);
          notifier2.addSpeed(_this40.text.stopError(_this40.props.lang, streamName));
          console.log("Error while trying to stop the stream ".concat(streamName), _e);
          _stopStream(streamName);
          _this40.setState({
            img: "img/".concat(_this40.images.start)
          });
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props;
      var img = this.state.img;
      return /*#__PURE__*/React.createElement("div", {
        className: "streamCreation il c2 tip"
      }, /*#__PURE__*/React.createElement("div", null, props.appReachable ? /*#__PURE__*/React.createElement("a", {
        onClick: this.showCreateStream,
        href: "#"
      }, /*#__PURE__*/React.createElement("img", {
        className: "vmid",
        src: img
      }), /*#__PURE__*/React.createElement(Liner, {
        additionalClass: "vmid"
      })) : ""));
    }
  }]);
  return StreamCreation;
}(React.PureComponent);
StreamCreation.contextType = Texts;
var StreamCreationC = connect(function (state) {
  return {
    images: state.images.streamCreate,
    lang: state.language,
    appReachable: state.appReachable,
    isStreaming: state.isStreaming
  };
}, {
  changeStreamCreateView: Action.changeStreamCreateView
})(StreamCreation);
var Search = function Search(_ref10) {
  var view = _ref10.view;
  var hide = view ? '' : 'whoosh';
  return /*#__PURE__*/React.createElement("div", {
    className: "search ".concat(hide)
  }, /*#__PURE__*/React.createElement("input", {
    className: "vmid",
    type: "text",
    name: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "vmid tight"
  }));
};
var StreamList = /*#__PURE__*/function (_React$Component18) {
  _inherits(StreamList, _React$Component18);
  var _super23 = _createSuper(StreamList);
  function StreamList(props, context) {
    var _this41;
    _classCallCheck(this, StreamList);
    _this41 = _super23.call(this, props);
    _this41.state = {
      list: [],
      showSearch: false,
      searchResult: [],
      searchTerm: ""
    };
    _this41.updateStream = _this41.updateStream.bind(_assertThisInitialized(_this41));
    _this41.updateCurrentStreamInfo = _this41.updateCurrentStreamInfo.bind(_assertThisInitialized(_this41));
    _this41.downloadSong = _this41.downloadSong.bind(_assertThisInitialized(_this41));
    _this41.registerToStream = _this41.registerToStream.bind(_assertThisInitialized(_this41));
    _this41.restartUpdateStream = _this41.restartUpdateStream.bind(_assertThisInitialized(_this41));
    _this41.downloadSong.inFetch = {};
    _this41.listText = context.streamList;
    _this41.streamText = context.Stream;
    _this41.timer = {
      normal: 5000,
      error: 10000
    };
    _this41.lastTimestamp;
    _this41.hasOverflowed = _this41.hasOverflowed.bind(_assertThisInitialized(_this41));
    _this41.handleSearchInput = _this41.handleSearchInput.bind(_assertThisInitialized(_this41));
    _this41.scrollHandler = scrollHandler;
    _this41.createDownloadLink = _this41.createDownloadLink.bind(_assertThisInitialized(_this41));
    return _this41;
  }
  _createClass(StreamList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this42 = this;
      if (this.props.appReachable) this.updateStream();
      this.listDiv = document.querySelector(".streamList .list");
      this.searchInput = document.querySelector(".streamList .list .search");
      this.searchInput.oninput = this.handleSearchInput;
      var trackedTouchs = [];
      this.listDiv.ontouchmove = function (event) {
        _this42.scrollHandler(_this42.listDiv, event, trackedTouchs);
      };
      this.listDiv.ontouchend = function (event) {
        trackedTouchs = [];
      };
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$state5 = this.state,
        showSearch = _this$state5.showSearch,
        searchTerm = _this$state5.searchTerm;
      if (!prevProps.appReachable && this.props.appReachable) this.updateStream(this.lastTimestamp || 0);
      var hasOverflowed = this.hasOverflowed();
      if (!searchTerm) {
        if (hasOverflowed && !showSearch) this.setState({
          showSearch: true
        });
        if (!hasOverflowed && showSearch) this.setState({
          showSearch: false
        });
      }
      invoqueAfterMount('streamList');
    }
  }, {
    key: "handleSearchInput",
    value: function handleSearchInput(event) {
      var target = event.target,
        _this$state6 = this.state,
        searchResult = _this$state6.searchResult,
        searchTerm = _this$state6.searchTerm,
        list = _this$state6.list,
        terms = target.value;
      if (terms.length) {
        searchResult = list.filter(function (item) {
          return item.indexOf(terms) != -1;
        });
        searchTerm = terms;
        this.setState({
          searchResult: searchResult,
          searchTerm: searchTerm
        });
      } else {
        if (searchResult.length || searchTerm.length) this.setState({
          searchResult: [],
          searchTerm: ""
        });
      }
    }
  }, {
    key: "hasOverflowed",
    value: function hasOverflowed() {
      var listDiv = this.listDiv,
        listDivHeight = listDiv.getBoundingClientRect().height,
        lastElementHeight = listDiv.lastElementChild.getBoundingClientRect().height;
      if (listDivHeight < lastElementHeight) return true;
      return false;
    }
  }, {
    key: "addStream",
    value: function addStream(name) {
      this.setState({
        list: [].concat(_toConsumableArray(this.state.list), [name])
      });
    }
  }, {
    key: "removeStream",
    value: function removeStream(name) {
      var list = this.state.list.filter(function (l) {
        return l != name;
      });
      this.setState({
        list: list
      });
    }
  }, {
    key: "restartUpdateStream",
    value: function restartUpdateStream(t) {
      this.updateStream(t);
    }
  }, {
    key: "updateStream",
    value: function updateStream(t) {
      var _this43 = this;
      var text = this.text;
      var lang = this.props.lang,
        data = {};
      if (t) {
        data[stq.lastTime] = t;
      }
      fetcher({
        url: "/stream/?action=getAll",
        setter: function setter(xml) {
          xml.setRequestHeader('content-type', 'application/json');
        },
        data: JSON.stringify(data),
        s: function s(_ref11) {
          var action = _ref11.action,
            streams = _ref11.streams,
            timestamp = _ref11.timestamp,
            name = _ref11.name;
          var myStream = S.getName();
          if (!timestamp && t) timestamp = t;
          switch (action) {
            case SUB.UPDATE:
              if (myStream) {
                _this43.setState({
                  list: streams.filter(function (stream) {
                    return stream != myStream;
                  })
                });
              } else {
                _this43.setState({
                  list: streams
                });
              }
              _this43.restartUpdateStream(timestamp);
              break;
            case SUB.ADD:
              if (!myStream || myStream != name) {
                _this43.setState({
                  list: [].concat(_toConsumableArray(_this43.state.list), [name])
                });
              }
              _this43.restartUpdateStream(timestamp);
              break;
            case SUB.DELETE:
              var isNotIn = is.Array(name) ? function (x) {
                  return name.indexOf(x) == -1;
                } : function (x) {
                  return x != name;
                },
                currentStreamName = S.getName(),
                currentRegistration = _this43.subscribe.registration;
              var list = _this43.state.list.filter(isNotIn);
              if (currentStreamName && !isNotIn(currentStreamName)) {
                _stopStream(S.getName());
              }
              if (currentRegistration && !isNotIn(currentRegistration)) {
                notifier2.addSpeed(_this43.streamText.subscription.end(_this43.props.lang, currentRegistration));
                delete _this43.subscribe.registration;
                _this43.props.subscribeToStream(false);
                _this43.updateCurrentStreamInfo();
                abortSubscription(fetcher);
              }
              _this43.setState({
                list: list
              });
              _this43.restartUpdateStream(timestamp);
              break;
            case SUB.NOTHING:
              _this43.restartUpdateStream(timestamp);
              break;
            default:
              console.log("Incomprehensible action", action, streams);
              _this43.restartUpdateStream(timestamp);
          }
        },
        e: function e(_e2, xml) {
          _this43.props.setAppUnreachable();
          notifier2.addSpeed(_this43.text.listText.updateStreamError(lang));
          console.log("Error while retriving the stream", _e2);
        }
      });
    }
  }, {
    key: "createDownloadLink",
    value: function createDownloadLink(catName, songName, streamName) {
      var _this44 = this;
      var a = /*#__PURE__*/React.createElement("a", {
        onClick: function onClick() {
          return _this44.downloadSong(catName, songName, streamName);
        }
      }, "Download The Song");
      return a;
    }
  }, {
    key: "downloadSong",
    value: function downloadSong(catName, songName, streamName) {
      var _this45 = this;
      var downloadSong = this.downloadSong;
      var url = "stream/downloadSong?c=".concat(catName, "&s=").concat(songName, "&n=").concat(streamName);
      if (downloadSong.inFetch[url]) return;
      var props = this.props;
      var lang = props.lang;
      var downloadText = this.streamText.download;
      downloadSong.inFetch[url] = true;
      notifier2.addSpeed(downloadText.start(lang, songName));
      fetcher({
        url: url,
        s: function s(response) {
          var action = response.action;
          delete downloadSong.inFetch[url];
          switch (action) {
            case SUB.DELETE:
              notifier2.addSpeed(_this45.listText.songDeleted(lang, _songName));
              break;
            case SUB.ADD:
              var _response$payload = response.payload,
                _catName2 = _response$payload.catName,
                _songName = _response$payload.songName,
                Verses = _response$payload.Verses,
                newCatId = null;
              if (!fastAccess[_catName2]) {
                newCatId = _this45.props.newCatId;
                props.addCategorie(_catName2, newCatId);
                notifier2.addSpeed(_this45.listText.categorieInserted(lang, _catName2));
              } else {
                newCatId = fastAccess[_catName2].id;
              }
              props.addSong(0, _songName, newCatId, Verses, 'online');
              notifier2.addSpeed(_this45.listText.songInserted(lang, _catName2, _songName));
              if (_this45.streamCatName.toLowerCase() == _catName2.toLowerCase() && _this45.streamSongName.toLowerCase() == _songName.toLowerCase()) {
                props.setCurrentCat(_catName2, newCatId);
                var songId = fastAccess[_catName2]['online'][_songName.toUpperCase()];
                props.setCurrentSong(songId, newCatId, 'online', _this45.streamPosition);
              }
              break;
            case SUB.STREAMDELETED:
              notifier2.addSpeed(_this45.streamText.stopped(lang, streamName));
              break;
            case SUB.CHANGED_SONG:
              notifier2.addSpeed(downloadText.error(lang, _songName));
              break;
            default:
              console.error("Inregognized response from downloadSong fetcher", action, response);
          }
        },
        e: function e(_ref12) {
          var status = _ref12.status,
            response = _ref12.response;
          delete downloadSong.inFetch[url];
          notifier2.addSpeed(text.downloadError(lang, songName));
        }
      });
    }
  }, {
    key: "updateCurrentStreamInfo",
    value: function updateCurrentStreamInfo(catName, songName, position) {
      if (!arguments.length) {
        delete this.streamCatName;
        delete this.streamSongName;
        delete this.streamPosition;
      } else {
        this.streamCatName = catName;
        this.streamSongName = songName;
        this.streamPosition = position;
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(streamName, update) {
      var _this46 = this;
      var props = this.props;
      var url = "stream/subscribe?n=".concat(streamName).concat(update ? "&u=" + update : "");
      fetcher({
        url: url,
        setter: function setter(xml) {
          fetcher.subscription = {
            abort: function abort() {
              xml.abort();
              delete _this46.subscribe.registration;
            }
          };
        },
        s: function s(response) {
          if (response) {
            try {
              var catName = response.catName,
                songName = response.songName,
                position = response.position,
                songNameL = songName && songName.toUpperCase(),
                subscribeMethod = _this46.subscribe,
                registration = subscribeMethod.registration,
                fastAccessCatName = null,
                fastAccessCatNameOnline = null,
                fastAccessCatNameOffline = null,
                catId = null,
                songNotInOnlineCat = undefined,
                songNotInOfflineCat = undefined,
                songId = null,
                textStream = _this46.streamText,
                textSubscription = textStream.subscription,
                subscriptionSuccess = textSubscription.success,
                subscriptionError = textSubscription.error,
                dontHaveSong = textSubscription.dontHaveSong,
                endSubscription = textSubscription.end,
                _this46$props = _this46.props,
                lang = _this46$props.lang,
                _setCurrentSong2 = _this46$props.setCurrentSong,
                setCurrentCat = _this46$props.setCurrentCat,
                subscribeToStream = _this46$props.subscribeToStream;
              if (catName && songName) {
                fastAccessCatName = fastAccess[catName], catId = fastAccessCatName && fastAccessCatName.id;
                fastAccessCatNameOnline = fastAccessCatName && fastAccessCatName.online[songNameL], fastAccessCatNameOffline = fastAccessCatName && fastAccessCatName.offline[songNameL], songNotInOnlineCat = fastAccessCatNameOnline === false || fastAccessCatNameOnline === undefined, songNotInOfflineCat = fastAccessCatNameOffline === false || fastAccessCatNameOffline === undefined;
                if (!songNotInOnlineCat || !songNotInOfflineCat) {
                  if (songNotInOnlineCat) songId = fastAccessCatNameOffline;else songId = fastAccessCatNameOnline;
                }
              }
              if (!registration) {
                subscribeMethod.registration = streamName;
              } else if (registration != streamName) {
                subscribeMethod.registration = streamName;
              }
              switch (response.action) {
                case SUB.UPDATE:
                  if (!update) {
                    notifier2.addSpeed(subscriptionSuccess(lang, streamName));
                  }
                  if (!response.songName || !response.catName) {} else if (!fastAccessCatName || songNotInOnlineCat && songNotInOfflineCat) {
                    _this46.downloadSong(catName, songName, streamName);
                  } else {
                    setCurrentCat(catName, fastAccessCatName.id);
                    var location = songNotInOfflineCat ? 'online' : 'offline';
                    _setCurrentSong2(songId, catId, location, parseInt(position, 10));
                  }
                  _this46.updateCurrentStreamInfo(catName, songName, position);
                  _this46.subscribe(streamName, true);
                  break;
                case SUB.UNSUBSCRIBE:
                  notifier2.addSpeed(endSubscription(lang, streamName));
                  delete subscribeMethod.registration;
                  props.subscribeToStream(false);
                  _this46.updateCurrentStreamInfo();
                  break;
                case SUB.NOTHING:
                  notifier2.addSpeed(textSubscription.nothing(_this46.props.lang, streamName));
                  props.subscribeToStream(false);
                  break;
                default:
                  notifier2.addSpeed(subscriptionError(lang, streamName));
                  console.log("fetcher Odd response", response);
                  subscribeToStream(false);
                  _this46.updateCurrentStreamInfo();
              }
            } catch (e) {
              alert(e);
            }
          }
        },
        e: function e(_ref13) {
          var status = _ref13.status,
            response = _ref13.response;
          notifier2.addSpeed(_this46.text.Stream.subscription.error(_this46.props.lang, streamName));
          props.subscribeToStream(false);
          console.log("Error while trying to subscribe to stream", streamName, status, response);
        }
      });
    }
  }, {
    key: "registerToStream",
    value: function registerToStream(streamName) {
      var props = this.props;
      if (streamName != this.subscribe.registration) {
        abortSubscription(fetcher);
        this.subscribe(streamName);
        props.subscribeToStream(true);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this47 = this;
      var hide = this.props.view ? '' : 'whoosh';
      var props = this.props;
      var _this$state7 = this.state,
        list = _this$state7.list,
        showSearch = _this$state7.showSearch,
        searchResult = _this$state7.searchResult,
        searchTerm = _this$state7.searchTerm;
      var _props$image = props.image,
        banner = _props$image.banner,
        open = _props$image.open;
      if (searchTerm) list = searchResult;
      function switchStreamListVisibility(event) {
        event.preventDefault();
        event.stopPropagation();
        props.changeStreamListView(!props.view);
      }
      return /*#__PURE__*/React.createElement("div", {
        className: "streamList il c3 tip"
      }, /*#__PURE__*/React.createElement("div", null, props.appReachable ? /*#__PURE__*/React.createElement("a", {
        className: "streamListLink",
        onClick: switchStreamListVisibility,
        href: "#"
      }, /*#__PURE__*/React.createElement("img", {
        className: "vmid",
        src: "img/".concat(banner)
      }), " ", /*#__PURE__*/React.createElement(Liner, {
        additionalClass: "vmid"
      }), /*#__PURE__*/React.createElement("span", {
        className: "counter"
      }, this.state.list.length)) : ""), props.appReachable ? /*#__PURE__*/React.createElement("div", {
        className: "abs abBottom shadowL list listStream silverBack BLRad ".concat(hide)
      }, /*#__PURE__*/React.createElement(Search, {
        handleSearch: this.handleSearchInput,
        view: showSearch
      }), /*#__PURE__*/React.createElement("div", {
        className: "items"
      }, list.map(function (streamName) {
        return /*#__PURE__*/React.createElement("div", {
          key: streamName,
          className: "il f1"
        }, /*#__PURE__*/React.createElement("div", {
          className: "il"
        }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
          onClick: function onClick() {
            return _this47.registerToStream(streamName);
          }
        }, streamName)), /*#__PURE__*/React.createElement("img", {
          src: "img/".concat(open)
        })));
      }))) : '');
    }
  }]);
  return StreamList;
}(React.Component);
StreamList.contextType = Texts;
var StreamListC = connect(function (state) {
  return {
    appReachable: state.appReachable,
    lang: state.language,
    view: state.ui.show.streamList,
    image: state.images.streamList,
    newCatId: state.Categories.length
  };
}, {
  subscribeToStream: Action.subscribeToStream,
  setAppUnreachable: Action.setAppUnreachable,
  addCategorie: Action.addCategorie,
  addSong: Action.addSong,
  setCurrentCat: Action.setCurrentCat,
  setCurrentSong: Action.setCurrentSong,
  changeStreamListView: Action.changeStreamListView
})(StreamList);
var SongContent = function SongContent(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement(ContentC, null));
};
var Content = /*#__PURE__*/function (_React$Component19) {
  _inherits(Content, _React$Component19);
  var _super24 = _createSuper(Content);
  function Content(props, context) {
    var _this48;
    _classCallCheck(this, Content);
    _this48 = _super24.call(this, props);
    _this48.Text = context.Favorite;
    _this48.storageHandler = storageHandler();
    _this48.scrollHandler = scrollHandler.bind(_assertThisInitialized(_this48));
    _this48.state = {
      Verses: [],
      currentCatName: "",
      index: 0,
      currentSongName: "",
      initialIndex: ""
    };
    _this48.goToVerse = _this48.goToVerse.bind(_assertThisInitialized(_this48));
    _this48.clickHandler = _this48.clickHandler.bind(_assertThisInitialized(_this48));
    _this48.initialVerseIndex;
    _this48.propIndex;
    return _this48;
  }
  _createClass(Content, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.listDiv = document.getElementById("content");
      this.papa = document.querySelector("#content .papa");
      //n('Content',this.initTime,undefined,2);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var props = this.props;
      var state = this.state;
      var nextCatName = nextProps.currentCat.name;
      var catName = props.currentCat.name;
      var songName = props.currentSongName;
      var nextSongName = nextProps.song.name;
      var verseIndex = state.index;
      var nextVerseIndex = nextState.index;
      var nextIsFavorite = nextProps.isFavorite,
        isFavorite = props.isFavorite;
      if (nextCatName != catName || songName != nextSongName || verseIndex != nextVerseIndex || isFavorite != nextIsFavorite) return true;
      return false;
    }
  }, {
    key: "goToVerse",
    value: function goToVerse(index) {
      console.log("go to Verse", index);
      this.setState({
        index: index
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this49 = this;
      invoqueAfterMount('content');
      var listDiv = this.listDiv;
      var listHeight = listDiv.getBoundingClientRect().height;
      var papaHeight = this.papa.getBoundingClientRect().height;
      if (listHeight < papaHeight && !listDiv.ontouchmove) {
        var trackedTouchs = [];
        listDiv.ontouchmove = function (event) {
          _this49.scrollHandler(listDiv, event, trackedTouchs);
        };
      } else if (listHeight > papaHeight && listDiv.ontouchmove) {
        delete listDiv.ontouchmove;
      }

      //n('Content',this.initTime);
      //n('Content',this.initTime,undefined,2);
    }
  }, {
    key: "addToFavorite",
    value: function addToFavorite(catName, catId, songName, songId, location, lang, fn, notify) {
      try {
        var _Text = this.Text;
        if (!location) console.error("song ".concat(songName, " don't have a location"));
        fn(catName, catId, songName, songId, location);
        notify.addSpeed(_Text.added(lang, songName));
      } catch (e) {
        console.error("Favorite addToFavorite Error:", e);
      }
    }
  }, {
    key: "removeFromFavorite",
    value: function removeFromFavorite(catName, catId, songName, songId, lang, fn, notify) {
      try {
        var _Text2 = this.Text;
        fn(catName, catId, songName, songId);
        notify.addSpeed(_Text2.deleted(lang, songName));
      } catch (e) {
        console.error("Favorite removeFromFavorite Error:", e);
      }
    }
  }, {
    key: "isFavorite",
    value: function isFavorite(catName, songName) {
      var props = this.props;
      if (props.isFavorite) return true;else {
        var favorite = this.storageHandler.inStore('favorites', {}, JSON.parse);
        if (favorite[catName] && favorite[catName][songName]) return true;
        return false;
      }
    }
  }, {
    key: "clickHandler",
    value: function clickHandler(event) {
      var _this$state8 = this.state,
        currentCatName = _this$state8.currentCatName,
        currentSongName = _this$state8.currentSongName,
        Verses = _this$state8.Verses,
        props = this.props,
        catId = props.currentCat.id,
        isFavorite = props.isFavorite,
        lang = props.lang,
        addToFavorite = props.addToFavorite,
        removeFromFavorite = props.removeFromFavorite,
        song = props.song;
      event.preventDefault();
      event.stopPropagation();
      if (!isFavorite) {
        this.addToFavorite(currentCatName, catId, currentSongName, song.id, song.location, lang, addToFavorite, notifier2);
      } else {
        this.removeFromFavorite(currentCatName, catId, currentSongName, song.id, lang, removeFromFavorite, notifier2);
      }
    }
  }, {
    key: "voidHandler",
    value: function voidHandler(event) {
      event.preventDefault();
    }
  }, {
    key: "render",
    value: function render() {
      this.initTime = Date.now();
      var _this$state9 = this.state,
        Verses = _this$state9.Verses,
        currentCatName = _this$state9.currentCatName,
        index = _this$state9.index;
      var props = this.props;
      var currentVerse = Verses[index] && Verses[index].Text || "";
      var catName = currentCatName; //props.currentCat.name;
      var songName = props.song.name;
      var location = props.song.location;
      var favImg = props.images.favorite;
      var lang = props.lang;
      //let Verses = props.song.Verses;
      var self = this;
      function clickHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        !props.isFavorite ? self.addToFavorite(catName, songName, Verses, location, lang, props.addToFavorite, notifier2) : self.removeFromFavorite(catName, songName, lang, props.removeFromFavorite, notifier2);
      }
      function voidHandler(event) {
        event.preventDefault();
      }
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        id: "content"
      }, /*#__PURE__*/React.createElement("div", {
        className: "papa"
      }, /*#__PURE__*/React.createElement("h3", null, songName, /*#__PURE__*/React.createElement("a", {
        className: "imFavorite",
        onClick: songName ? this.clickHandler : this.voidHandler,
        href: "#"
      }, /*#__PURE__*/React.createElement("img", {
        src: props.isFavorite ? "img/".concat(favImg.unlove) : "img/".concat(favImg.love)
      }))), /*#__PURE__*/React.createElement("p", null, currentVerse))), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(ArrowNav, {
        index: index,
        catName: currentCatName,
        songName: songName,
        total: Math.max(0, Verses.length - 1),
        images: props.images.arrows,
        goToVerse: this.goToVerse
      }), /*#__PURE__*/React.createElement(NavHelper, {
        goToVerse: this.goToVerse,
        currentIndex: index,
        catName: currentCatName,
        songName: songName,
        length: Verses.length
      }));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var currentCatName = props.currentCat.name;
      var stateCurrentCatName = state.currentCatName;
      var currentSongName = props.song.name;
      var stateCurrentSongName = state.currentSongName;
      var propIndex = props.verseIndex;
      var initialIndex = state.initialIndex;
      if (initialIndex !== propIndex || currentCatName != stateCurrentCatName || currentSongName != stateCurrentSongName) {
        return {
          Verses: props.song.Verses,
          currentCatName: currentCatName,
          index: propIndex,
          currentSongName: currentSongName,
          initialIndex: initialIndex !== propIndex ? propIndex : initialIndex
        };
      }
      return null;
    }
  }]);
  return Content;
}(React.Component);
Content.contextType = Texts;
var ContentC = connect(function (state, ownProps) {
  return _objectSpread({
    currentCat: state.currentCat,
    song: state.currentSong,
    verseIndex: state.ui.navigation.verseIndex,
    isFavorite: state.currentCat.name && state.favorites[state.currentCat.name] && state.favorites[state.currentCat.name][state.currentSong.name] && true || false,
    images: state.images,
    lang: state.language,
    currentSongName: state.currentSong.name
  }, ownProps);
}, {
  addToFavorite: Action.addToFavorite,
  removeFromFavorite: Action.removeFromFavorite
})(Content);
var ArrowNav = /*#__PURE__*/function (_React$Component20) {
  _inherits(ArrowNav, _React$Component20);
  var _super25 = _createSuper(ArrowNav);
  function ArrowNav(props) {
    var _this50;
    _classCallCheck(this, ArrowNav);
    _this50 = _super25.call(this, props);
    _this50.backArrowHandler = _this50.backArrowHandler.bind(_assertThisInitialized(_this50));
    _this50.nextArrowHandler = _this50.nextArrowHandler.bind(_assertThisInitialized(_this50));
    return _this50;
  }
  _createClass(ArrowNav, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var props = this.props;
      var state = this.state;
      if (nextProps.currentCatName != props.currentCatName || nextProps.songName != props.songName || nextProps.index != props.index) return true;
      return false;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var c = 15;
      var m = 25;
    }
  }, {
    key: "backArrowHandler",
    value: function backArrowHandler(event) {
      var _this$props33 = this.props,
        total = _this$props33.total,
        current = _this$props33.current,
        catName = _this$props33.catName,
        songName = _this$props33.songName,
        images = _this$props33.images,
        goToVerse = _this$props33.goToVerse,
        index = _this$props33.index;
      event.preventDefault();
      event.stopPropagation();
      indexChanger(Math.max(0, --index), catName, songName, goToVerse, S);
    }
  }, {
    key: "nextArrowHandler",
    value: function nextArrowHandler(event) {
      var _this$props34 = this.props,
        total = _this$props34.total,
        current = _this$props34.current,
        catName = _this$props34.catName,
        songName = _this$props34.songName,
        images = _this$props34.images,
        goToVerse = _this$props34.goToVerse,
        index = _this$props34.index;
      event.preventDefault();
      event.stopPropagation();
      indexChanger(Math.min(total, ++index), catName, songName, goToVerse, S);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props35 = this.props,
        total = _this$props35.total,
        current = _this$props35.current,
        catName = _this$props35.catName,
        songName = _this$props35.songName,
        images = _this$props35.images,
        index = _this$props35.index,
        goToVerse = _this$props35.goToVerse;
      var prevView = index != 0 && index != undefined ? "" : "whoosh",
        nextView = index < total && songName ? "" : "whoosh";
      return /*#__PURE__*/React.createElement("div", {
        className: "lr il"
      }, /*#__PURE__*/React.createElement("a", {
        className: "prevSong ".concat(prevView),
        onClick: this.backArrowHandler,
        href: "#"
      }, /*#__PURE__*/React.createElement("img", {
        src: "img/".concat(images.prev)
      })), /*#__PURE__*/React.createElement("a", {
        className: "nextSong ".concat(nextView),
        onClick: this.nextArrowHandler,
        href: "#"
      }, /*#__PURE__*/React.createElement("img", {
        src: "img/".concat(images.next)
      })));
    }
  }]);
  return ArrowNav;
}(React.Component);
var NavHelper = function NavHelper(_ref14) {
  var length = _ref14.length,
    currentIndex = _ref14.currentIndex,
    goToVerse = _ref14.goToVerse,
    catName = _ref14.catName,
    songName = _ref14.songName;
  function clickHandler(event, i) {
    event.preventDefault();
    event.stopPropagation();
    indexChanger(i, catName, songName, goToVerse, S);
  }
  return /*#__PURE__*/React.createElement("div", {
    id: "navHelper",
    className: "abs"
  }, _toConsumableArray(Array(length)).map(function (verse, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: i == currentIndex ? 'bHighlight' : ''
    }, /*#__PURE__*/React.createElement("a", {
      className: "navNumber ".concat(i == currentIndex ? 'selected' : ''),
      onClick: function onClick(event) {
        return clickHandler(event, i);
      },
      href: "#"
    }, i + 1));
  }));
};
var PopUp = /*#__PURE__*/function (_React$Component21) {
  _inherits(PopUp, _React$Component21);
  var _super26 = _createSuper(PopUp);
  function PopUp(props) {
    var _this51;
    _classCallCheck(this, PopUp);
    _this51 = _super26.call(this, props);
    _this51.adjustHeight = _this51.adjustHeight.bind(_assertThisInitialized(_this51));
    _this51.checkIfMustBeVisible = _this51.checkIfMustBeVisible.bind(_assertThisInitialized(_this51));
    _this51.getDimensions = _this51.getDimensions.bind(_assertThisInitialized(_this51));
    _this51.isInTheMiddle = _this51.isInTheMiddle.bind(_assertThisInitialized(_this51));
    _this51.putInTheMiddle = _this51.putInTheMiddle.bind(_assertThisInitialized(_this51));
    _this51.wHeight = window.innerHeight;
    return _this51;
  }
  _createClass(PopUp, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this52 = this;
      this.node = document.querySelector(".popUp");
      this.box = document.querySelector(".popUp .Box");
      var dimensions = this.node.getBoundingClientRect();
      this.height = dimensions.height;
      this.top = dimensions.top;
      window.onresize = function () {
        _this52.height = _this52.node.getBoundingClientRect().height;
        if (window.innerHeight != _this52.wHeight) _this52.wHeight = window.innerHeight;
        _this52.adjustHeight();
      };
    }
  }, {
    key: "isInTheMiddle",
    value: function isInTheMiddle() {
      var height = this.height,
        node = this.node,
        wHeight = this.wHeight,
        top = this.top,
        middle = (wHeight - height) / 2;
      if (middle != top) return false;
      return true;
    }
  }, {
    key: "putInTheMiddle",
    value: function putInTheMiddle() {
      var height = this.height,
        node = this.node,
        wHeight = this.wHeight;
      this.top = (wHeight - height) / 2;
      node.style.top = "".concat(this.top, "px");
    }
  }, {
    key: "getDimensions",
    value: function getDimensions() {
      return this.node.getBoundingClientRect();
    }
  }, {
    key: "checkIfMustBeVisible",
    value: function checkIfMustBeVisible() {
      var _this$props36 = this.props,
        addCatView = _this$props36.addCatView,
        addSongView = _this$props36.addSongView,
        createStreamView = _this$props36.createStreamView;
      return addCatView || addSongView || createStreamView;
    }
  }, {
    key: "adjustHeight",
    value: function adjustHeight() {
      var boxHeight = this.box.getBoundingClientRect().height;
      var height = this.height;
      var wHeight = this.wHeight;
      if (boxHeight > height || boxHeight < height) {
        if (wHeight >= boxHeight) {
          var newHeight = boxHeight,
            newTop = (wHeight - newHeight) / 2;
          this.top = newTop;
          this.height = newHeight;
          this.node.style.height = "".concat(this.height, "px");
          this.node.style.top = "".concat(this.top, "px");
        } else {
          this.height = wHeight;
          this.top = 0;
          this.node.style.height = "".concat(this.height, "px");
          this.node.style.top = "".concat(this.top, "px");
        }
      } else if (boxHeight < wHeight && !this.isInTheMiddle()) {
        this.putInTheMiddle();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props;
      var hide = this.checkIfMustBeVisible() ? '' : 'whoosh';
      return /*#__PURE__*/React.createElement("div", {
        className: "popUp ".concat(hide)
      }, /*#__PURE__*/React.createElement("div", {
        className: "popWrapper abs"
      }, /*#__PURE__*/React.createElement("div", {
        className: "wrap"
      }, /*#__PURE__*/React.createElement("div", {
        className: "Box il silverBack TLRad TRRad BLRad BRRad"
      }, /*#__PURE__*/React.createElement(SetupPopUpC, {
        adjustHeight: this.adjustHeight
      }), /*#__PURE__*/React.createElement(AddSongDivC, {
        adjustHeight: this.adjustHeight
      }), /*#__PURE__*/React.createElement(AddCatDivC, {
        adjustHeight: this.adjustHeight
      }), /*#__PURE__*/React.createElement(CreateStreamC, {
        adjustHeight: this.adjustHeight
      })), /*#__PURE__*/React.createElement(Liner, null))));
    }
  }]);
  return PopUp;
}(React.Component);
var PopUpWrapper = connect(function (state) {
  return {
    VersesDiv: state.ui.addSongDiv.Verses,
    subscribedToStream: state.subscribedToStream,
    addCatView: state.ui.show.addCatDiv,
    addSongView: state.ui.show.addSongDiv,
    createStreamView: state.ui.show.createStreamDiv,
    isStreaming: state.isStreaming,
    lastCatId: state.Categories.length
  };
}, {
  setCurrentSong: Action.setCurrentSong,
  updateSong: Action.updateSong,
  addSong: Action.addSong,
  changeAddSongView: Action.changeAddSongView,
  updateCategorie: Action.updateCategorie,
  updateSongList: Action.updateSongList,
  addCategorie: Action.addCategorie,
  changeCatView: Action.changeCatView,
  setAppUnreachable: Action.setAppUnreachable,
  changeStreamCreateView: Action.changeStreamCreateView,
  forceUpdate: Action.setForceUpdate,
  changeVerseDivNumber: Action.changeVerseDivNumber
})(PopUp);
var SetupPopUp = /*#__PURE__*/function (_React$Component22) {
  _inherits(SetupPopUp, _React$Component22);
  var _super27 = _createSuper(SetupPopUp);
  function SetupPopUp(props) {
    var _this53;
    _classCallCheck(this, SetupPopUp);
    _this53 = _super27.call(this, props);
    _this53.popUpVisible = false;
    return _this53;
  }
  _createClass(SetupPopUp, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this$props37 = this.props,
        addCatView = _this$props37.addCatView,
        addSongView = _this$props37.addSongView,
        createStreamView = _this$props37.createStreamView;
      if (addCatView || addSongView || createStreamView) {
        if (!this.popUpVisible) {
          this.props.adjustHeight();
          this.popUpVisible = true;
        }
      } else if (this.popUpVisible) {
        this.popUpVisible = false;
      }
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);
  return SetupPopUp;
}(React.Component);
var SetupPopUpC = connect(function (state) {
  return {
    addCatView: state.ui.show.addCatDiv,
    addSongView: state.ui.show.addSongDiv,
    createStreamView: state.ui.show.createStreamView
  };
})(SetupPopUp);
var Settings = /*#__PURE__*/function (_React$PureComponent6) {
  _inherits(Settings, _React$PureComponent6);
  var _super28 = _createSuper(Settings);
  function Settings(props) {
    var _this54;
    _classCallCheck(this, Settings);
    _this54 = _super28.call(this, props);
    _this54.state = {
      view: false
    };
    _this54.initTime = Date.now();
    _this54.changeView = _this54.changeView.bind(_assertThisInitialized(_this54));
    return _this54;
  }
  _createClass(Settings, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      //alert(`it taked ${Date.now() - this.initTime} ms second to Mount Settings`);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      invoqueAfterMount('settings');
    }
  }, {
    key: "changeView",
    value: function changeView(view) {
      this.setState({
        view: view
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props38 = this.props,
        controls = _this$props38.controls,
        setControl = _this$props38.setControl,
        changeDevToolView = _this$props38.changeDevToolView,
        viewDevTool = _this$props38.viewDevTool;
      var view = this.state.view;
      var hide = view ? '' : 'whoosh';
      return /*#__PURE__*/React.createElement("div", {
        className: "settings il c0 tip",
        id: "settings"
      }, /*#__PURE__*/React.createElement(SettingsTogglerC, {
        changeSettingsView: this.changeView
      }), /*#__PURE__*/React.createElement("div", {
        className: "abs abBottom list shadowR BRRad BLRad silverBack ".concat(hide)
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DayModeC, null), /*#__PURE__*/React.createElement(LanguageC, null), /*#__PURE__*/React.createElement(ControlC, null), /*#__PURE__*/React.createElement(DevToolViewTooglerC, null))));
    }
  }]);
  return Settings;
}(React.PureComponent);
var SettingsToggler = /*#__PURE__*/function (_React$Component23) {
  _inherits(SettingsToggler, _React$Component23);
  var _super29 = _createSuper(SettingsToggler);
  function SettingsToggler(props) {
    var _this55;
    _classCallCheck(this, SettingsToggler);
    _this55 = _super29.call(this, props);
    _this55.clickHandler = _this55.clickHandler.bind(_assertThisInitialized(_this55));
    return _this55;
  }
  _createClass(SettingsToggler, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props39 = this.props,
        view = _this$props39.view,
        changeView = _this$props39.changeView,
        changeSettingsView = _this$props39.changeSettingsView;
      if (prevProps.view != view) {
        changeSettingsView(view);
      }
    }
  }, {
    key: "clickHandler",
    value: function clickHandler(event) {
      var _this$props40 = this.props,
        changeView = _this$props40.changeView,
        view = _this$props40.view,
        changeSettingsView = _this$props40.changeSettingsView;
      event.preventDefault();
      event.stopPropagation();
      changeView(!view);
      changeSettingsView(!view);
    }
  }, {
    key: "render",
    value: function render() {
      var view = this.props.view;
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
        className: "settingsToggler",
        onClick: this.clickHandler,
        href: "#"
      }, /*#__PURE__*/React.createElement("img", {
        className: "vmid",
        src: "img/settings.png"
      }), /*#__PURE__*/React.createElement(Liner, {
        additionalClass: "vmid"
      })));
    }
  }]);
  return SettingsToggler;
}(React.Component);
var SettingsTogglerC = connect(function (state, ownProps) {
  return _objectSpread({
    view: state.ui.show.settingList
  }, ownProps);
}, {
  changeView: Action.changeSettingListView
})(SettingsToggler);
var SettingsC = connect(function (state, ownProps) {
  return _objectSpread({
    nightMode: state.ui.nightMode,
    lang: state.language,
    controls: state.keys.alt,
    view: state.ui.show.settingList,
    viewDevTool: state.ui.show.devTool
  }, ownProps);
}, {
  changeMode: Action.changeNightMode,
  changeLanguage: Action.changeLanguage,
  changeView: Action.changeSettingListView,
  setControl: Action.setControl,
  changeDevToolView: Action.changeDevToolView
})(Settings);
var DayMode = /*#__PURE__*/function (_React$PureComponent7) {
  _inherits(DayMode, _React$PureComponent7);
  var _super30 = _createSuper(DayMode);
  function DayMode(props) {
    var _this56;
    _classCallCheck(this, DayMode);
    _this56 = _super30.call(this, props);
    _this56.changeMode = _this56.changeMode.bind(_assertThisInitialized(_this56));
    _this56.initTime = Date.now();
    return _this56;
  }
  _createClass(DayMode, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var night = this.props.night;
      var react_container = document.getElementById("react-container");
      if (!react_container) throw Error("DayMode:componentDidMount No react container found");else {
        this.reactContainer = react_container;
        this.baseClassName = react_container.className.split(" ")[0];
        if (night) {
          this.reactContainer = "".concat(this.baseClassName, " night");
        }
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var night = this.props.night,
        reactContainer = this.reactContainer,
        baseClassName = this.baseClassName,
        newClassName = night ? "".concat(baseClassName, " night") : baseClassName;
      reactContainer.className = newClassName;
    }
  }, {
    key: "changeMode",
    value: function changeMode(event) {
      var _this$props41 = this.props,
        changeMode = _this$props41.changeMode,
        night = _this$props41.night;
      event.preventDefault();
      event.stopPropagation();
      changeMode(!night);
    }
  }, {
    key: "render",
    value: function render() {
      var night = this.props.night;
      return /*#__PURE__*/React.createElement("div", {
        className: "il f1 dayMode"
      }, /*#__PURE__*/React.createElement("span", {
        id: "night"
      }, "Night Mode "), " ", /*#__PURE__*/React.createElement("a", {
        className: "modeShift",
        href: "#",
        onClick: this.changeMode
      }, night ? "On" : "Off"));
    }
  }]);
  return DayMode;
}(React.PureComponent);
var DayModeC = connect(function (state, ownProps) {
  return _objectSpread({
    night: state.ui.nightMode
  }, ownProps);
}, {
  changeMode: Action.changeNightMode
})(DayMode);
var Language = /*#__PURE__*/function (_React$Component24) {
  _inherits(Language, _React$Component24);
  var _super31 = _createSuper(Language);
  function Language(props) {
    var _this57;
    _classCallCheck(this, Language);
    _this57 = _super31.call(this, props);
    _this57.state = {
      show: false
    };
    _this57.changeView = _this57.changeView.bind(_assertThisInitialized(_this57));
    _this57.initTime = Date.now();
    return _this57;
  }
  _createClass(Language, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      //alert(`it Taked ${Date.now() - this.initTime} ms to Mount Language`);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      invoqueAfterMount('language');
    }
  }, {
    key: "changeView",
    value: function changeView() {
      var show = this.state.show;
      this.setState({
        show: !show
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props42 = this.props,
        changeLanguage = _this$props42.changeLanguage,
        currentLanguage = _this$props42.currentLanguage;
      var hide = this.state.show ? '' : 'whoosh';
      var list = ["En", "Fr"];
      return /*#__PURE__*/React.createElement("div", {
        className: "language il f1"
      }, /*#__PURE__*/React.createElement("span", {
        id: "language"
      }, "Language"), /*#__PURE__*/React.createElement("a", {
        className: "langShift",
        href: "#",
        onClick: this.changeView
      }, currentLanguage), /*#__PURE__*/React.createElement("div", {
        className: "list ".concat(hide)
      }, list.map(function (lang2, i) {
        return /*#__PURE__*/React.createElement("a", {
          className: currentLanguage == lang2 ? signal.success : '',
          key: i,
          href: "#",
          onClick: function onClick() {
            return changeLanguage(lang2);
          }
        }, lang2);
      })));
    }
  }]);
  return Language;
}(React.Component);
var LanguageC = connect(function (state, ownProps) {
  return _objectSpread({
    currentLanguage: state.language
  }, ownProps);
}, {
  changeLanguage: Action.changeLanguage
})(Language);
var Control = function Control(_ref15) {
  var controls = _ref15.controls,
    setControl = _ref15.setControl;
  function clickHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    setControl(!controls);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "control il f1"
  }, /*#__PURE__*/React.createElement("span", {
    id: "control"
  }, "Controls"), /*#__PURE__*/React.createElement("a", {
    className: "controlShift",
    onClick: clickHandler,
    href: "#"
  }, controls ? 'On' : 'Off'));
};
var ControlC = connect(function (state, ownProps) {
  return _objectSpread({
    controls: state.keys.alt
  }, ownProps);
}, {
  setControl: Action.setControl
})(Control);
var DevToolViewToogler = /*#__PURE__*/function (_React$PureComponent8) {
  _inherits(DevToolViewToogler, _React$PureComponent8);
  var _super32 = _createSuper(DevToolViewToogler);
  function DevToolViewToogler(props) {
    var _this58;
    _classCallCheck(this, DevToolViewToogler);
    _this58 = _super32.call(this, props);
    _this58.state = {
      view: props.view
    };
    _this58.changeView = _this58.changeView.bind(_assertThisInitialized(_this58));
    return _this58;
  }
  _createClass(DevToolViewToogler, [{
    key: "changeView",
    value: function changeView(newView) {
      this.setState({
        view: newView
      });
      this.props.changeDevToolView(newView);
    }
  }, {
    key: "render",
    value: function render() {
      var _this59 = this;
      var stateView = this.state.view;
      var view = stateView ? 'On' : 'Off';
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "DevTool View"), /*#__PURE__*/React.createElement("a", {
        onClick: function onClick() {
          return _this59.changeView(!stateView);
        }
      }, view));
    }
  }]);
  return DevToolViewToogler;
}(React.PureComponent);
var DevToolViewTooglerC = connect(function (state, ownProps) {
  return {
    view: state.ui.show.devTool
  };
}, {
  changeDevToolView: Action.changeDevToolView
})(DevToolViewToogler);
export var Guider = /*#__PURE__*/function (_React$PureComponent9) {
  _inherits(Guider, _React$PureComponent9);
  var _super33 = _createSuper(Guider);
  function Guider(props) {
    var _this60;
    _classCallCheck(this, Guider);
    _this60 = _super33.call(this, props);
    _this60.state = {
      step: props.step,
      section: props.step.section,
      action: props.step.section.action,
      style: {},
      lang: props.lang
    };
    _this60.toStep = _this60.toStep.bind(_assertThisInitialized(_this60));
    _this60.toSection = _this60.toSection.bind(_assertThisInitialized(_this60));
    _this60.animate = _this60.animate.bind(_assertThisInitialized(_this60));
    _this60.goToStep = _this60.goToStep.bind(_assertThisInitialized(_this60));
    _this60.goToSection = _this60.goToSection.bind(_assertThisInitialized(_this60));
    _this60.clear = _this60.clear.bind(_assertThisInitialized(_this60));
    _this60.adjustHeight = adjustHeight.bind(_assertThisInitialized(_this60));
    _this60.isInTheMiddle = _this60.isInTheMiddle.bind(_assertThisInitialized(_this60));
    _this60.putInTheMiddle = _this60.putInTheMiddle.bind(_assertThisInitialized(_this60));
    _this60.setDimensions = _this60.setDimensions.bind(_assertThisInitialized(_this60));
    _this60.moveHandler = compose(function () {
      return _this60.putInTheMiddle(_this60.isInTheMiddle);
    }, _this60.setDimensions, _this60.adjustHeight);
    return _this60;
  }
  _createClass(Guider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.node = document.querySelector(".Guider");
      this.box = document.getElementById("Guider");
      this.wHeight = window.innerHeight;
      this.moveHandler(this.node, this.box);
    }
  }, {
    key: "setDimensions",
    value: function setDimensions() {
      var dimensions = this.node.getBoundingClientRect();
      this.height = dimensions.height;
      this.top = dimensions.top;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.moveHandler(this.node, this.box);
      invoqueAfterMount("guider");
    }
  }, {
    key: "isInTheMiddle",
    value: function isInTheMiddle() {
      var height = this.height,
        node = this.node,
        wHeight = this.wHeight,
        top = this.top,
        middle = (wHeight - height) / 2;
      if (middle != top) return false;
      return true;
    }
  }, {
    key: "putInTheMiddle",
    value: function putInTheMiddle(InTheMiddle) {
      if (!InTheMiddle()) {
        var height = this.height,
          node = this.node,
          wHeight = this.wHeight;
        this.top = (wHeight - height) / 2;
        node.style.top = "".concat(this.top, "px");
      }
    }
  }, {
    key: "toStep",
    value: function toStep(step) {
      var _this61 = this;
      this.animate(false).then(function () {
        _this61.setState(_objectSpread(_objectSpread({}, _this61.state), {}, {
          section: step.section,
          step: step,
          action: step.section.action
        }));
      }).then(function () {
        _this61.animate(true);
      }).Oups(function (e) {
        console.error("Guider toStep catch Error", e);
      });
    }
  }, {
    key: "toSection",
    value: function toSection(section) {
      var _this62 = this;
      var state = this.state;
      this.animate(false).then(function () {
        _this62.setState(_objectSpread(_objectSpread({}, state), {}, {
          section: section,
          action: section.action
        }));
      }).then(function () {
        _this62.animate(true);
      }).Oups(function (e) {
        console.error("Guide toSection catch error", e);
      });
    }
  }, {
    key: "toAction",
    value: function toAction(doAction) {
      var _this63 = this;
      var state = this.state;
      var currentAction = state.action;
      doAction.then(function (_ref16) {
        var updateText = _ref16.updateText;
        if (updateText) _this63.forceUpdate();else if (!currentAction.nextAction && state.section.nextSection) _this63.toSection(state.section.nextSection);else _this63.setState(_objectSpread(_objectSpread({}, state), {}, {
          action: currentAction.nextAction
        }));
      }).Oups(function (e) {
        console.error("toAction catch error", e);
      });
    }
  }, {
    key: "animate",
    value: function animate(add) {
      var _this64 = this;
      return new Promise(function (resolve, reject) {
        var main = _this64.refs.main;
        var state = _this64.state;
        var op = Number(getComputedStyle(main).opacity);
        var c = setInterval(function () {
          if (add && op < 1.0) {
            op = Number((op + 0.1).toPrecision(1));
            main.style.opacity = op;
            return;
          } else if (!add && op > 0.0) {
            op = Number((op - 0.1).toPrecision(1));
            main.style.opacity = op;
            return;
          }
          clearInterval(c);
          resolve();
        }, 20);
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      var action = this.state.action;
      return action && action.getClearer() ? function () {
        action.reset(false);
        return action.getClearer()();
      } : function () {
        return Promise.resolve(true);
      };
    }
  }, {
    key: "goToSection",
    value: function goToSection() {
      var _this65 = this;
      var next = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var section = this.state.section;
      var clear = this.clear();
      clear().then(function () {
        return _this65.toSection(next ? section.nextSection : section.prevSection);
      }).Oups(function (e) {
        console.error("Couldn't clear to go to ", next ? 'next' : 'prev', 'step');
      });
    }
  }, {
    key: "goToStep",
    value: function goToStep() {
      var _this66 = this;
      var next = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var step = this.state.step;
      var clear = this.clear();
      clear().then(function () {
        return _this66.toStep(next ? step.nextStep : step.prevStep);
      }).Oups(function (e) {
        console.error("Couldn't clear to go to ", next ? 'next' : 'prev', 'step');
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props43 = this.props,
        show = _this$props43.show,
        end = _this$props43.end;
      var stepStyle = this.state.style;
      var _this$state10 = this.state,
        step = _this$state10.step,
        section = _this$state10.section,
        action = _this$state10.action,
        lang = _this$state10.lang;
      window.section = section;
      window.action = action;
      var title = section.getTitle() && section.getTitle()(lang) || step.getTitle()(lang);
      var nextSection = section.nextSection;
      var prevSection = section.prevSection;
      var nextStep = step.nextStep;
      var prevStep = step.prevStep;
      var process = action ? action.doProcess() : null;
      var goToSection = this.goToSection;
      var goToStep = this.goToStep;
      var clear = this.clear();
      return /*#__PURE__*/React.createElement("div", {
        className: "Guider",
        id: "main",
        ref: "main"
      }, /*#__PURE__*/React.createElement("div", {
        className: "wrap il"
      }, /*#__PURE__*/React.createElement("div", {
        id: "Guider",
        className: "il vmid Box TLRad TRRad BLRad BRRad"
      }, /*#__PURE__*/React.createElement("div", {
        className: "section"
      }, /*#__PURE__*/React.createElement("div", {
        className: "il AlL"
      }, prevSection && prevSection.getTitle ? /*#__PURE__*/React.createElement("a", {
        className: "blueBack AllRound",
        onClick: function onClick() {
          return goToSection(false);
        },
        href: "#"
      }, prevSection.getTitle()(lang) || "") : ""), /*#__PURE__*/React.createElement("div", {
        className: "il AlC"
      }, /*#__PURE__*/React.createElement("a", {
        className: "littleBox currentSection"
      }, title || "WELCOME TO OUR")), /*#__PURE__*/React.createElement("div", {
        className: "il AlR"
      }, nextSection && nextSection.getTitle ? /*#__PURE__*/React.createElement("a", {
        className: "blueBack AllRound",
        onClick: function onClick() {
          return goToSection();
        }
      }, nextSection.getTitle()(lang) || "") : "")), /*#__PURE__*/React.createElement("div", {
        className: "text"
      }, section.getText().map(function (text, i) {
        return /*#__PURE__*/React.createElement("p", {
          key: i,
          id: i
        }, text(lang));
      })), /*#__PURE__*/React.createElement("div", {
        className: "textAction"
      }, action ? /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("ul", null, action.getText().map(function (text, i) {
        return /*#__PURE__*/React.createElement("li", {
          style: {
            width: "auto"
          },
          key: i
        }, text(lang));
      }), process ? this.toAction(process()) : "")) : ''), /*#__PURE__*/React.createElement("div", {
        className: "step"
      }, /*#__PURE__*/React.createElement("div", {
        className: "il AlL"
      }, prevStep && prevStep.getTitle ? /*#__PURE__*/React.createElement("a", {
        className: "blueBack",
        onClick: function onClick() {
          return goToStep(false);
        },
        href: "#"
      }, prevStep.getTitle()(lang)) : ""), /*#__PURE__*/React.createElement("div", {
        className: "il AlC"
      }, /*#__PURE__*/React.createElement("a", {
        className: "currentStep"
      }, step.getTitle()(lang))), /*#__PURE__*/React.createElement("div", {
        className: "il AlR"
      }, nextStep && nextStep.getTitle ? /*#__PURE__*/React.createElement("a", {
        className: "blueBack",
        onClick: function onClick() {
          return goToStep();
        },
        href: "#"
      }, nextStep.getTitle()(lang)) : "")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
        onClick: function onClick() {
          clear().then(end);
        },
        href: "#"
      }, "FERMER"))), /*#__PURE__*/React.createElement(Liner, {
        additionalClass: "vmid"
      })));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (props.lang != state.lang) {
        var action = state.action;
        if (action && action.getClearer()) {
          action.reset(true);
          action.getClearer()();
        }
        return _objectSpread(_objectSpread({}, state), {}, {
          lang: props.lang
        });
      }
      return null;
    }
  }]);
  return Guider;
}(React.PureComponent);
var GuiderConnected = connect(function (state, ownProps) {
  return _objectSpread({
    lang: state.language
  }, ownProps);
})(Guider);
var Styles = function Styles(_ref17) {
  var lists = _ref17.lists;
  return /*#__PURE__*/React.createElement(React.Fragment, null, lists.map(function (list, i) {
    var l2 = _objectSpread({}, list);
    var data = l2.data;
    delete l2.data;
    return /*#__PURE__*/React.createElement("style", _extends({
      key: i
    }, l2), data ? data : '');
  }));
};
var Metas = function Metas(_ref18) {
  var lists = _ref18.lists;
  return /*#__PURE__*/React.createElement(React.Fragment, null, lists.map(function (list, i) {
    return /*#__PURE__*/React.createElement("meta", _extends({
      key: i
    }, list));
  }));
};
var Links = function Links(_ref19) {
  var lists = _ref19.lists,
    i = _ref19.i;
  return /*#__PURE__*/React.createElement(React.Fragment, null, lists.map(function (list, i) {
    return /*#__PURE__*/React.createElement("link", _extends({
      key: i
    }, list));
  }));
};
var Scripts = function Scripts(_ref20) {
  var lists = _ref20.lists;
  return /*#__PURE__*/React.createElement(React.Fragment, null, lists.map(function (list, i) {
    var l2 = _objectSpread({}, list);
    var data = l2.data;
    delete l2.data;
    return /*#__PURE__*/React.createElement("script", _extends({
      dangerouslySetInnerHTML: {
        __html: data ? data : ''
      },
      key: i
    }, l2));
  }));
};
export var HTML = function HTML(_ref21) {
  var data = _ref21.data,
    styles = _ref21.styles,
    metas = _ref21.metas,
    links = _ref21.links,
    scripts = _ref21.scripts,
    title = _ref21.title,
    store = _ref21.store,
    nodeJs = _ref21.nodeJs;
  function ap(t) {
    var a = document.body;
    var c = document.createElement("p");
    c.textContent = t;
    a.appendChild(c);
  }
  return /*#__PURE__*/React.createElement("html", null, /*#__PURE__*/React.createElement("head", null, /*#__PURE__*/React.createElement("title", null, title), metas && metas.length ? /*#__PURE__*/React.createElement(Metas, {
    lists: metas
  }) : '', links && links.length ? /*#__PURE__*/React.createElement(Links, {
    lists: links
  }) : '', styles && styles.length ? /*#__PURE__*/React.createElement(Styles, {
    lists: styles
  }) : '', scripts.head && scripts.head.length ? /*#__PURE__*/React.createElement(Scripts, {
    lists: scripts.head
  }) : ''), /*#__PURE__*/React.createElement("body", null, /*#__PURE__*/React.createElement("div", {
    id: "react-container",
    className: "wrapper"
  }, /*#__PURE__*/React.createElement(App, {
    lang: data.language,
    direction: data.ui.direction
  })), scripts.tail && scripts.tail.length ? /*#__PURE__*/React.createElement(Scripts, {
    lists: scripts.tail
  }) : ''));
};
export var App = /*#__PURE__*/function (_React$Component25) {
  _inherits(App, _React$Component25);
  var _super34 = _createSuper(App);
  function App(props) {
    var _this67;
    _classCallCheck(this, App);
    _this67 = _super34.call(this, props);
    var guider = localStorage.guider;
    _this67.state = {
      showGuide: props.step ? true : false
    };
    _this67.endGuide = _this67.endGuide.bind(_assertThisInitialized(_this67));
    _this67.keyRecorder = _this67.keyRecorder.bind(_assertThisInitialized(_this67));
    _this67.initTime = Date.now();
    return _this67;
  }
  _createClass(App, [{
    key: "endGuide",
    value: function endGuide() {
      this.setState({
        showGuide: false
      });
      window.removeEventListener('keydown', this.keyRecorder);
      localStorage.guider = true;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('keydown', this.keyRecorder);
      //n('App',this.initTime,'Mount');
    }
  }, {
    key: "keyRecorder",
    value: function keyRecorder(event) {
      if (event.key == "g") {
        var main = document.getElementById("main");
        var dis = getComputedStyle(main).display;
        if (dis == "none") main.style.display = "inline-block";else main.style.display = "none";
      }
    }
  }, {
    key: "render",
    value: function render() {
      var showGuide = this.state.showGuide;
      var _this$props44 = this.props,
        step = _this$props44.step,
        lang = _this$props44.lang,
        direction = _this$props44.direction,
        streamManager = _this$props44.streamManager,
        fAccess = _this$props44.fAccess;
      console.log("direction", direction);
      return /*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement(SetupC, {
        streamManager: streamManager,
        fAccess: fAccess,
        fastAccess: this.props.fastAccess
      }), /*#__PURE__*/React.createElement(First, {
        direction: direction,
        lang: lang,
        streamManager: this.props.streamManager
      }), /*#__PURE__*/React.createElement(Second, {
        direction: direction
      }), showGuide ? /*#__PURE__*/React.createElement(GuiderConnected, {
        end: this.endGuide,
        step: step
      }) : '', /*#__PURE__*/React.createElement(PopUpWrapper, null), /*#__PURE__*/React.createElement(DevToolC, null));
    }
  }]);
  return App;
}(React.Component);
var Nothing = /*#__PURE__*/function (_React$Component26) {
  _inherits(Nothing, _React$Component26);
  var _super35 = _createSuper(Nothing);
  function Nothing(props) {
    var _this68;
    _classCallCheck(this, Nothing);
    _this68 = _super35.call(this, props);
    _this68.initTime = Date.now();
    return _this68;
  }
  _createClass(Nothing, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      n('Nothing', this.initTime, 'Mount');
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Maman"));
    }
  }]);
  return Nothing;
}(React.Component);
var DevTool = /*#__PURE__*/function (_React$PureComponent10) {
  _inherits(DevTool, _React$PureComponent10);
  var _super36 = _createSuper(DevTool);
  function DevTool(props) {
    var _this69;
    _classCallCheck(this, DevTool);
    _this69 = _super36.call(this, props);
    _this69.log = _this69.log.bind(_assertThisInitialized(_this69));
    _this69.appendText = _this69.appendText.bind(_assertThisInitialized(_this69));
    _this69.log = _this69.log.bind(_assertThisInitialized(_this69));
    _this69.scrollHandler = scrollHandler.bind(_assertThisInitialized(_this69));
    return _this69;
  }
  _createClass(DevTool, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this70 = this;
      this.node = document.getElementById("devTool");
      if (window.innerWidth < 450) {
        var self = this;
        console.log = function () {
          self.log.apply(self, ['success'].concat(Array.prototype.slice.call(arguments)));
        };
        console.error = function () {
          self.log.apply(self, ['error'].concat(Array.prototype.slice.call(arguments)));
        };
      }
      var trackedTouchs = [];
      this.node.ontouchmove = function (event) {
        try {
          _this70.scrollHandler(_this70.node, event, trackedTouchs);
        } catch (e) {
          console.error(e);
        }
      };
      this.node.ontouchend = function () {
        trackedTouchs = [];
      };
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (!this.props.view) this.node.innerHTML = "";
    }
  }, {
    key: "log",
    value: function log(status) {
      var texts = [],
        index = 1,
        item,
        stringRepresentation,
        stringRepresentation2;
      while (item = arguments[index++]) {
        if (!is.String(item)) {
          if (!is.Number(item)) {
            stringRepresentation = item.toString();
            if (stringRepresentation === {}.toString()) {
              try {
                stringRepresentation2 = JSON.stringify(item);
                item = stringRepresentation2.substr(0, 60);
              } catch (e) {
                item = stringRepresentation;
              }
            }
          }
        }
        texts.push(item);
      }
      this.appendText(status, texts.join("  "));
    }
  }, {
    key: "appendText",
    value: function appendText(status, text) {
      //let p = `<p class='${status}'>${text}</p>`,
      var p = document.createElement("p"),
        node = this.node,
        childLength = node.childNodes.length;
      p.className = status;
      p.textContent = text;
      setTimeout(function () {
        node.appendChild(p);
        //node.innerHTML = node.innerHTML + p;
        node.scrollTop = node.scrollHeight;
        if (childLength >= node.childNodes.length) alert("Somethings is wrong");
      }, 15);
    }
  }, {
    key: "render",
    value: function render() {
      var show = this.props.view ? '' : 'whoosh';
      return /*#__PURE__*/React.createElement("div", {
        id: "devTool",
        className: show
      });
    }
  }]);
  return DevTool;
}(React.PureComponent);
var DevToolC = connect(function (state) {
  return {
    view: state.ui.show.devTool
  };
})(DevTool);

