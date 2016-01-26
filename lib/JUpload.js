(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("JUpload", [], factory);
	else if(typeof exports === 'object')
		exports["JUpload"] = factory();
	else
		root["JUpload"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var JUpload = function () {
		function JUpload(el, options) {
			_classCallCheck(this, JUpload);
	
			//测试分支合并 冲突解决
			var that = this;
			that.$el = document.querySelector(el);
			that.settings = {
				maxSize: "",
				name: "uploadFileName",
	
				/**
	    * 文件筛选
	    * audio/* 可以接受所有的音频文件
	    * video/*	可以接受所有的视频文件
	    * image/*	可以接受所有的图片文件
	    */
				accept: "",
				postUrl: "",
				onClientLoad: null,
				onServerProgress: null,
				onServerReadyStateChange: null,
	
				onError: function onError(res) {
					alert("file upload error code = " + res.code + " message = " + res.message);
				},
				/**
	    * 成功回调函数
	    */
				onSuccess: function onSuccess() {
					console.log("upload success1");
				},
				/**
	    * 点击事件前验证
	    * @returns true | false
	    */
				onBeforeClick: function onBeforeClick() {
					return true;
				}
			};
	
			that.settings = Object.assign(that.settings, options);
	
			that.$el.style.cssText = "position:relative;";
	
			var input = document.createElement("input");
			input.id = "__upload_input__";
			input.type = "file";
			input.accept = that.settings.accept;
			input.style.cssText = "position:absolute;left:-10000px;top:-10000px;";
	
			that.$el.appendChild(input);
	
			that.$el.onclick = function () {
				if (that.settings.onBeforeClick()) {
					input.click();
				}
			};
			input.onchange = function () {
				var len = input.files.length;
				for (var i = 0; i < len; i++) {
					that.fileHandler(input.files[i]);
				}
			};
		}
	
		_createClass(JUpload, [{
			key: "fileHandler",
			value: function fileHandler(file) {
				var _this = this;
	
				var that = this;
				if (that.settings.maxSize != '' && file.size > that.settings.maxSize) {
					var obj = {
						code: 4001,
						message: "文件大小超出限制"
					};
					if (that.settings.onError) that.settings.onError(obj);
					console.log(JSON.stringify(obj));
					return;
				}
	
				if ('FileReader' in window) {
					var fileReader = new FileReader();
					fileReader.onload = function (e) {
						if (that.settings.onClientLoad) {
							that.settings.onClientLoad(e, file, _this);
						}
					};
					fileReader.readAsDataURL(file);
				} else {
					console.log("FileReader is not defined");
				}
	
				var xmlHttpRequest = new XMLHttpRequest();
	
				xmlHttpRequest.upload.onprogress = function (e) {
					if (that.settings.onServerProgress) {
						that.settings.onServerProgress(e, file);
					}
				};
				xmlHttpRequest.onreadystatechange = function (e) {
					if (that.settings.onServerReadyStateChange) {
						that.settings.onServerReadyStateChange(e, file, xmlHttpRequest.readyState);
					}
					if (that.settings.onSuccess && xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
						that.settings.onSuccess(e, file, xmlHttpRequest.responseText);
					}
				};
	
				var url = that.settings.postUrl;
				if (typeof that.settings.postUrl === "function") url = that.settings.postUrl();
				xmlHttpRequest.open("POST", url, true);
	
				var formData = new FormData();
				formData.append(that.settings.name, file);
				xmlHttpRequest.send(formData);
			}
		}]);
	
		return JUpload;
	}();

	exports.default = JUpload;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=JUpload.js.map