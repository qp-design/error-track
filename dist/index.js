/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/ajax-hook/index.js":
/*!*****************************************!*\
  !*** ./node_modules/ajax-hook/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"hook\": () => (/* reexport safe */ _src_xhr_hook__WEBPACK_IMPORTED_MODULE_0__.hook),\n/* harmony export */   \"unHook\": () => (/* reexport safe */ _src_xhr_hook__WEBPACK_IMPORTED_MODULE_0__.unHook),\n/* harmony export */   \"proxy\": () => (/* reexport safe */ _src_xhr_proxy__WEBPACK_IMPORTED_MODULE_1__.proxy),\n/* harmony export */   \"unProxy\": () => (/* reexport safe */ _src_xhr_proxy__WEBPACK_IMPORTED_MODULE_1__.unProxy)\n/* harmony export */ });\n/* harmony import */ var _src_xhr_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/xhr-hook */ \"./node_modules/ajax-hook/src/xhr-hook.js\");\n/* harmony import */ var _src_xhr_proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/xhr-proxy */ \"./node_modules/ajax-hook/src/xhr-proxy.js\");\n/*\n * author: wendux\n * email: 824783146@qq.com\n * source code: https://github.com/wendux/Ajax-hook\n **/\n\n\n\n\n\n//# sourceURL=webpack://error-track/./node_modules/ajax-hook/index.js?");

/***/ }),

/***/ "./node_modules/ajax-hook/src/xhr-hook.js":
/*!************************************************!*\
  !*** ./node_modules/ajax-hook/src/xhr-hook.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"configEvent\": () => (/* binding */ configEvent),\n/* harmony export */   \"hook\": () => (/* binding */ hook),\n/* harmony export */   \"unHook\": () => (/* binding */ unHook)\n/* harmony export */ });\n/*\n * author: wendux\n * email: 824783146@qq.com\n * source code: https://github.com/wendux/Ajax-hook\n */\n\n// Save original XMLHttpRequest as _rxhr\nvar realXhr = \"_rxhr\"\n\nfunction configEvent(event, xhrProxy) {\n    var e = {};\n    for (var attr in event) e[attr] = event[attr];\n    // xhrProxy instead\n    e.target = e.currentTarget = xhrProxy\n    return e;\n}\n\nfunction hook(proxy) {\n    // Avoid double hookAjax\n    window[realXhr] = window[realXhr] || XMLHttpRequest\n\n    XMLHttpRequest = function () {\n        var xhr = new window[realXhr];\n        // We shouldn't hookAjax XMLHttpRequest.prototype because we can't\n        // guarantee that all attributes are on the prototype。\n        // Instead, hooking XMLHttpRequest instance can avoid this problem.\n        for (var attr in xhr) {\n            var type = \"\";\n            try {\n                type = typeof xhr[attr] // May cause exception on some browser\n            } catch (e) {\n            }\n            if (type === \"function\") {\n                // hookAjax methods of xhr, such as `open`、`send` ...\n                this[attr] = hookFunction(attr);\n            } else {\n                Object.defineProperty(this, attr, {\n                    get: getterFactory(attr),\n                    set: setterFactory(attr),\n                    enumerable: true\n                })\n            }\n        }\n        var that = this;\n        xhr.getProxy = function () {\n            return that\n        }\n        this.xhr = xhr;\n    }\n\n    // Generate getter for attributes of xhr\n    function getterFactory(attr) {\n        return function () {\n            var v = this.hasOwnProperty(attr + \"_\") ? this[attr + \"_\"] : this.xhr[attr];\n            var attrGetterHook = (proxy[attr] || {})[\"getter\"]\n            return attrGetterHook && attrGetterHook(v, this) || v\n        }\n    }\n\n    // Generate setter for attributes of xhr; by this we have an opportunity\n    // to hookAjax event callbacks （eg: `onload`） of xhr;\n    function setterFactory(attr) {\n        return function (v) {\n            var xhr = this.xhr;\n            var that = this;\n            var hook = proxy[attr];\n            // hookAjax  event callbacks such as `onload`、`onreadystatechange`...\n            if (attr.substring(0, 2) === 'on') {\n                that[attr + \"_\"] = v;\n                xhr[attr] = function (e) {\n                    e = configEvent(e, that)\n                    var ret = proxy[attr] && proxy[attr].call(that, xhr, e)\n                    ret || v.call(that, e);\n                }\n            } else {\n                //If the attribute isn't writable, generate proxy attribute\n                var attrSetterHook = (hook || {})[\"setter\"];\n                v = attrSetterHook && attrSetterHook(v, that) || v\n                this[attr + \"_\"] = v;\n                try {\n                    // Not all attributes of xhr are writable(setter may undefined).\n                    xhr[attr] = v;\n                } catch (e) {\n                }\n            }\n        }\n    }\n\n    // Hook methods of xhr.\n    function hookFunction(fun) {\n        return function () {\n            var args = [].slice.call(arguments)\n            if (proxy[fun]) {\n                var ret = proxy[fun].call(this, args, this.xhr)\n                // If the proxy return value exists, return it directly,\n                // otherwise call the function of xhr.\n                if (ret) return ret;\n            }\n            return this.xhr[fun].apply(this.xhr, args);\n        }\n    }\n\n    // Return the real XMLHttpRequest\n    return window[realXhr];\n}\n\nfunction unHook() {\n    if (window[realXhr]) XMLHttpRequest = window[realXhr];\n    window[realXhr] = undefined;\n}\n\n\n\n\n//# sourceURL=webpack://error-track/./node_modules/ajax-hook/src/xhr-hook.js?");

/***/ }),

/***/ "./node_modules/ajax-hook/src/xhr-proxy.js":
/*!*************************************************!*\
  !*** ./node_modules/ajax-hook/src/xhr-proxy.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"proxy\": () => (/* binding */ proxy),\n/* harmony export */   \"unProxy\": () => (/* binding */ unProxy)\n/* harmony export */ });\n/* harmony import */ var _xhr_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xhr-hook */ \"./node_modules/ajax-hook/src/xhr-hook.js\");\n/*\n * author: wendux\n * email: 824783146@qq.com\n * source code: https://github.com/wendux/Ajax-hook\n */\n\n\n\nvar events = ['load', 'loadend', 'timeout', 'error', 'readystatechange', 'abort'];\nvar eventLoad = events[0],\n    eventLoadEnd = events[1],\n    eventTimeout = events[2],\n    eventError = events[3],\n    eventReadyStateChange = events[4],\n    eventAbort = events[5];\n\n\nvar singleton,\n    prototype = 'prototype';\n\n\nfunction proxy(proxy) {\n    if (singleton) throw \"Proxy already exists\";\n    return singleton = new Proxy(proxy);\n}\n\nfunction unProxy() {\n    singleton = null\n    ;(0,_xhr_hook__WEBPACK_IMPORTED_MODULE_0__.unHook)()\n}\n\nfunction trim(str) {\n    return str.replace(/^\\s+|\\s+$/g, '');\n}\n\nfunction getEventTarget(xhr) {\n    return xhr.watcher || (xhr.watcher = document.createElement('a'));\n}\n\nfunction triggerListener(xhr, name) {\n    var xhrProxy = xhr.getProxy();\n    var callback = 'on' + name + '_';\n    var event = (0,_xhr_hook__WEBPACK_IMPORTED_MODULE_0__.configEvent)({type: name}, xhrProxy);\n    xhrProxy[callback] && xhrProxy[callback](event);\n    var evt;\n    if(typeof(Event) === 'function') {\n        evt = new Event(name,{bubbles: false});\n    } else {\n        // https://stackoverflow.com/questions/27176983/dispatchevent-not-working-in-ie11\n        evt = document.createEvent('Event');\n        evt.initEvent(name, false, true);\n    }\n    getEventTarget(xhr).dispatchEvent(evt);\n}\n\n\nfunction Handler(xhr) {\n    this.xhr = xhr;\n    this.xhrProxy = xhr.getProxy();\n}\n\nHandler[prototype] = Object.create({\n    resolve: function resolve(response) {\n        var xhrProxy = this.xhrProxy;\n        var xhr = this.xhr;\n        xhrProxy.readyState = 4;\n        xhr.resHeader = response.headers;\n        xhrProxy.response = xhrProxy.responseText = response.response;\n        xhrProxy.statusText = response.statusText;\n        xhrProxy.status = response.status;\n        triggerListener(xhr, eventReadyStateChange);\n        triggerListener(xhr, eventLoad);\n        triggerListener(xhr, eventLoadEnd);\n    },\n    reject: function reject(error) {\n        this.xhrProxy.status = 0;\n        triggerListener(this.xhr, error.type);\n        triggerListener(this.xhr, eventLoadEnd);\n    }\n});\n\nfunction makeHandler(next) {\n    function sub(xhr) {\n        Handler.call(this, xhr);\n    }\n\n    sub[prototype] = Object.create(Handler[prototype]);\n    sub[prototype].next = next;\n    return sub;\n}\n\nvar RequestHandler = makeHandler(function (rq) {\n    var xhr = this.xhr;\n    rq = rq || xhr.config;\n    xhr.withCredentials = rq.withCredentials;\n    xhr.open(rq.method, rq.url, rq.async !== false, rq.user, rq.password);\n    for (var key in rq.headers) {\n        xhr.setRequestHeader(key, rq.headers[key]);\n    }\n    xhr.send(rq.body);\n});\n\nvar ResponseHandler = makeHandler(function (response) {\n    this.resolve(response);\n});\n\nvar ErrorHandler = makeHandler(function (error) {\n    this.reject(error);\n});\n\nfunction Proxy(proxy) {\n    var onRequest = proxy.onRequest,\n        onResponse = proxy.onResponse,\n        onError = proxy.onError;\n\n    function handleResponse(xhr, xhrProxy) {\n        var handler = new ResponseHandler(xhr);\n        if (!onResponse) return handler.resolve();\n        var ret = {\n            response: xhrProxy.response,\n            status: xhrProxy.status,\n            statusText: xhrProxy.statusText,\n            config: xhr.config,\n            headers: xhr.resHeader || xhr.getAllResponseHeaders().split('\\r\\n').reduce(function (ob, str) {\n                if (str === \"\") return ob;\n                var m = str.split(\":\");\n                ob[m.shift()] = trim(m.join(':'));\n                return ob;\n            }, {})\n        };\n        onResponse(ret, handler);\n    }\n\n    function onerror(xhr, xhrProxy, e) {\n        var handler = new ErrorHandler(xhr);\n        var error = {config: xhr.config, error: e};\n        if (onError) {\n            onError(error, handler);\n        } else {\n            handler.next(error);\n        }\n    }\n\n    function preventXhrProxyCallback() {\n        return true;\n    }\n\n    function errorCallback(xhr, e) {\n        onerror(xhr, this, e);\n        return true;\n    }\n\n    function stateChangeCallback(xhr, xhrProxy) {\n        if (xhr.readyState === 4 && xhr.status !== 0) {\n            handleResponse(xhr, xhrProxy);\n        } else if (xhr.readyState !== 4) {\n            triggerListener(xhr, eventReadyStateChange);\n        }\n        return true;\n    }\n\n    return (0,_xhr_hook__WEBPACK_IMPORTED_MODULE_0__.hook)({\n        onload: preventXhrProxyCallback,\n        onloadend: preventXhrProxyCallback,\n        onerror: errorCallback,\n        ontimeout: errorCallback,\n        onabort: errorCallback,\n        onreadystatechange: function (xhr) {\n            return stateChangeCallback(xhr, this);\n        },\n        open: function open(args, xhr) {\n            var _this = this;\n            var config = xhr.config = {headers: {}};\n            config.method = args[0];\n            config.url = args[1];\n            config.async = args[2];\n            config.user = args[3];\n            config.password = args[4];\n            config.xhr = xhr;\n            var evName = 'on' + eventReadyStateChange;\n            if (!xhr[evName]) {\n                xhr[evName] = function () {\n                    return stateChangeCallback(xhr, _this);\n                };\n            }\n\n            var defaultErrorHandler = function defaultErrorHandler(e) {\n                onerror(xhr, _this, (0,_xhr_hook__WEBPACK_IMPORTED_MODULE_0__.configEvent)(e, _this));\n            };\n            [eventError, eventTimeout, eventAbort].forEach(function (e) {\n                var event = 'on' + e;\n                if (!xhr[event]) xhr[event] = defaultErrorHandler;\n            });\n\n            // 如果有请求拦截器，则在调用onRequest后再打开链接。因为onRequest最佳调用时机是在send前，\n            // 所以我们在send拦截函数中再手动调用open，因此返回true阻止xhr.open调用。\n            //\n            // 如果没有请求拦截器，则不用阻断xhr.open调用\n            if (onRequest) return true;\n        },\n        send: function (args, xhr) {\n            var config = xhr.config\n            config.withCredentials=xhr.withCredentials\n            config.body = args[0];\n            if (onRequest) {\n                // In 'onRequest', we may call XHR's event handler, such as `xhr.onload`.\n                // However, XHR's event handler may not be set until xhr.send is called in\n                // the user's code, so we use `setTimeout` to avoid this situation\n                var req = function () {\n                    onRequest(config, new RequestHandler(xhr));\n                }\n                config.async === false ? req() : setTimeout(req)\n                return true;\n            }\n        },\n        setRequestHeader: function (args, xhr) {\n            // Collect request headers\n            xhr.config.headers[args[0].toLowerCase()] = args[1];\n            return true;\n        },\n        addEventListener: function (args, xhr) {\n            var _this = this;\n            if (events.indexOf(args[0]) !== -1) {\n                var handler = args[1];\n                getEventTarget(xhr).addEventListener(args[0], function (e) {\n                    var event = (0,_xhr_hook__WEBPACK_IMPORTED_MODULE_0__.configEvent)(e, _this);\n                    event.type = args[0];\n                    event.isTrusted = true;\n                    handler.call(_this, event);\n                });\n                return true;\n            }\n        },\n        getAllResponseHeaders: function (_, xhr) {\n            var headers = xhr.resHeader\n            if (headers) {\n                var header = \"\";\n                for (var key in headers) {\n                    header += key + ': ' + headers[key] + '\\r\\n';\n                }\n                return header;\n            }\n        },\n        getResponseHeader: function (args, xhr) {\n            var headers = xhr.resHeader\n            if (headers) {\n                return headers[(args[0] || '').toLowerCase()];\n            }\n        }\n    });\n}\n\n\n\n\n\n\n//# sourceURL=webpack://error-track/./node_modules/ajax-hook/src/xhr-proxy.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var ajax_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ajax-hook */ \"./node_modules/ajax-hook/index.js\");\n// '@timestamp': string; // iso8601格式 例: 2021-11-11T00:00:01+0800\n// // mzt：门诊通，crm：销率王，makesense：标注系统，diagnosis：诊断医生\n// projectName: string;\n// // base-mgt-web：基础运营平台，clinic-mgt-web：运营平台，scrm-mgt-web：厂商后台, clinic-mgt-app-h5：app内嵌H5，clinic-mgt-mini：门诊通小程序\n// // crm-admin：销率王管理后台，crm-mini：销率王小程序\n// // makesense-web：标注系统，makesense-admin-web：标注管理端\n// // diagnosis-web：诊断PC\n// appName: string;\n// reqDomain: string; // 接口域名\n// reqUri: string; // 接口path\n// reqArgs: string; // get参数（注意要序列化），没有传空字符串\n// reqData: string; // post参数（注意要序列化），没有传空字符串\n// resData: string; // 接口响应体（注意要序列化）\n// resCode: string; // 业务code，取不到传空字符串\n// httpCode: string; // http code，（整型）\n// errMsg: string // 异常信息\n\nconst init = ({\n                projectName = '',\n                appName='',\n                successCode = [0, '0', '200', 200]\n              }) => {\n  (0,ajax_hook__WEBPACK_IMPORTED_MODULE_0__.proxy)({\n    //请求成功后进入\n    onResponse: (response, handler) => {\n      console.log(response, handler)\n      try {\n        const resData = JSON.parse(response.response) || {}\n        if (Reflect.has(resData, 'code')) {\n          if(!successCode.includes(resData.code)) {\n            const urlArray = response.config.method.toLocaleUpperCase() === 'GET' ? response.config.url.split('?') : [response.config.url]\n            const trackData = {\n              '@timestamp': new Date().toISOString(),\n              projectName,\n              appName,\n              reqDomain: location.host,\n              reqUri: urlArray[0],\n              reqArgs: response.config.method.toLocaleUpperCase() === 'GET' ? urlArray[1] : '',\n              reqData: response.config.body || '',\n              resData: response.response,\n              resCode: String(resData.code),\n              httpCode: '200',\n              errMsg: resData.msg\n            }\n            errorSubmit(trackData);\n          }\n        }\n      } catch (e) {\n\n      }\n      handler.next(response)\n    }\n  })\n}\n\nconst SLS_CONFIG = {\n  endpoint: 'cn-shanghai.log.aliyuncs.com',\n  projectname: 'webtrack-log',\n  logstore: 'webtrack-store'\n}\n\nconst errorSubmit = (errorData) => {\n  const url = `https://${SLS_CONFIG.projectname}.${SLS_CONFIG.endpoint}/logstores/${SLS_CONFIG.logstore}/track`;\n  fetch(url, {\n    method: 'POST',\n    body: JSON.stringify({\n      \"__topic__\": errorData.projectName,\n      \"__source__\": errorData.appName,\n      \"__logs__\": [errorData]\n    }),\n    headers: {\n      \"x-log-apiversion\": \"0.6.0\",\n      \"x-log-bodyrawsize\": \"1234\"\n    }\n  }).catch(err => {\n    console.log(err.message)\n  })\n\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (init);\n\n\n//# sourceURL=webpack://error-track/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});