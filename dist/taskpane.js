/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/logo-filled.png":
/*!********************************!*\
  !*** ./assets/logo-filled.png ***!
  \********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "assets/logo-filled.png";

/***/ }),

/***/ "./src/taskpane/taskpane.css":
/*!***********************************!*\
  !*** ./src/taskpane/taskpane.css ***!
  \***********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "2e020911c607dbb9d45f.css";

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
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		__webpack_require__.b = (typeof document !== 'undefined' && document.baseURI) || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"taskpane": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
!function() {
/*!**********************************!*\
  !*** ./src/taskpane/taskpane.js ***!
  \**********************************/
/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

var API_KEY_SETTING = "SECTORS_API_KEY";

// The initialize function must be run each time a new page is loaded
Office.onReady(function () {
  document.getElementById("sideload-msg").style.display = "none";
  document.getElementById("app-body").style.display = "flex";
  document.getElementById("save-api-key").onclick = saveApiKey;
  document.getElementById("clear-api-key").onclick = clearApiKey;
  renderCurrentKey();
});
function saveApiKey() {
  var input = document.getElementById("api-key-input");
  var apiKey = (input.value || "").trim();
  if (!apiKey) {
    setStatus("Please enter an API key.", true);
    return;
  }
  Office.context.document.settings.set(API_KEY_SETTING, apiKey);
  Office.context.document.settings.saveAsync(function (result) {
    if (result.status === Office.AsyncResultStatus.Succeeded) {
      input.value = "";
      renderCurrentKey();
      setStatus("API key saved for this workbook.", false);
      return;
    }
    var errMsg = result.error && result.error.message ? result.error.message : "Unknown error";
    setStatus("Failed to save key: ".concat(errMsg), true);
  });
}
function clearApiKey() {
  Office.context.document.settings.set(API_KEY_SETTING, "");
  Office.context.document.settings.saveAsync(function (result) {
    if (result.status === Office.AsyncResultStatus.Succeeded) {
      renderCurrentKey();
      setStatus("API key cleared.", false);
      return;
    }
    var errMsg = result.error && result.error.message ? result.error.message : "Unknown error";
    setStatus("Failed to clear key: ".concat(errMsg), true);
  });
}
function renderCurrentKey() {
  var currentKey = Office.context.document.settings.get(API_KEY_SETTING) || "";
  document.getElementById("current-key-value").textContent = maskApiKey(currentKey);
}
function maskApiKey(key) {
  if (!key) {
    return "Not set";
  }
  if (key.length <= 6) {
    return "*".repeat(key.length);
  }
  return "".concat(key.slice(0, 3), "...").concat(key.slice(-3));
}
function setStatus(message, isError) {
  var status = document.getElementById("api-key-status");
  status.textContent = message;
  status.className = isError ? "ms-font-s status-message error" : "ms-font-s status-message success";
}
}();
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
!function() {
"use strict";
/*!************************************!*\
  !*** ./src/taskpane/taskpane.html ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
// Imports
var ___HTML_LOADER_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./taskpane.css */ "./src/taskpane/taskpane.css"), __webpack_require__.b);
var ___HTML_LOADER_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ../../assets/logo-filled.png */ "./assets/logo-filled.png"), __webpack_require__.b);
// Module
var code = "<!-- Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT License. -->\n<!-- This file shows how to design a first-run page that provides a welcome screen to the user about the features of the add-in. -->\n\n<!DOCTYPE html>\n<html>\n\n<head>\n    <meta charset=\"UTF-8\" />\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <title>Sectors Task Pane Add-in</title>\n\n    <!-- Office JavaScript API -->\n    <" + "script type=\"text/javascript\" src=\"https://appsforoffice.microsoft.com/lib/1/hosted/office.js\"><" + "/script>\n\n    <!-- For more information on Fluent UI, visit https://developer.microsoft.com/fluentui#/. -->\n    <link rel=\"stylesheet\" href=\"https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/office-ui-fabric-core/11.1.0/css/fabric.min.css\"/>\n\n    <!-- Template styles -->\n    <link href=\"" + ___HTML_LOADER_IMPORT_0___ + "\" rel=\"stylesheet\" type=\"text/css\" />\n</head>\n\n<body class=\"ms-font-m ms-welcome ms-Fabric\">\n    <header class=\"ms-welcome__header ms-bgColor-neutralLighter\">\n        <img width=\"90\" height=\"90\" src=\"" + ___HTML_LOADER_IMPORT_1___ + "\" alt=\"Sectors\" title=\"Sectors\" />\n        <h1 class=\"ms-font-su\">Sectors API</h1>\n    </header>\n    <section id=\"sideload-msg\" class=\"ms-welcome__main\">\n        <h2 class=\"ms-font-xl\">Please <a target=\"_blank\" href=\"https://learn.microsoft.com/office/dev/add-ins/testing/test-debug-office-add-ins#sideload-an-office-add-in-for-testing\">sideload</a> your add-in to see app body.</h2>\n    </section>\n    <main id=\"app-body\" class=\"ms-welcome__main\" style=\"display: none;\">\n        <h2 class=\"ms-font-xl\">Store your API key securely for this workbook</h2>\n        <p class=\"ms-font-m app-description\">The key is saved in workbook settings, so it does not appear in worksheet formulas.</p>\n\n        <div class=\"key-card\">\n            <label class=\"ms-font-m\" for=\"api-key-input\">Sectors API Key</label>\n            <input id=\"api-key-input\" class=\"api-key-input\" type=\"password\" placeholder=\"Paste your API key\" autocomplete=\"off\" />\n            <div class=\"actions-row\">\n                <button id=\"save-api-key\" class=\"ms-Button ms-Button--primary\" type=\"button\">\n                    <span class=\"ms-Button-label\">Save Key</span>\n                </button>\n                <button id=\"clear-api-key\" class=\"ms-Button\" type=\"button\">\n                    <span class=\"ms-Button-label\">Clear</span>\n                </button>\n            </div>\n            <p class=\"ms-font-s current-key\">Current key: <span id=\"current-key-value\">Not set</span></p>\n            <p id=\"api-key-status\" class=\"ms-font-s status-message\" aria-live=\"polite\"></p>\n        </div>\n    </main>\n</body>\n\n</html>\n";
// Exports
/* harmony default export */ __webpack_exports__["default"] = (code);
}();
/******/ })()
;
//# sourceMappingURL=taskpane.js.map