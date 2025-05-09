/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extensionContext = exports.code4i = void 0;
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(__webpack_require__(1));
const path = __importStar(__webpack_require__(2));
const cp = __importStar(__webpack_require__(3));
const vscode_1 = __webpack_require__(1);
const componentsTreeDataProvider_1 = __webpack_require__(4);
const aiSimilarityResultsProvider_1 = __webpack_require__(5);
let serverProcess;
function activate(context) {
    exports.extensionContext = context;
    const codeForIBMiExtension = vscode_1.extensions.getExtension('halcyontechltd.code-for-ibmi');
    if (!codeForIBMiExtension) {
        throw new Error(vscode_1.l10n.t("This extension requires the 'halcyontechltd.code-for-ibmi' extension to be installed and activated!"));
    }
    const startCommand = vscode.commands.registerCommand('aiSearchSimilarities.start', async () => {
        const serverPath = path.join(context.extensionPath, 'SRC', 'code_similarity.py');
        serverProcess = cp.spawn('python', [serverPath], { shell: true });
        serverProcess.stdout?.on('data', (data) => {
            console.log(`Server: ${data}`);
        });
        serverProcess.stderr?.on('data', (data) => {
            console.error(`Server Error: ${data}`);
        });
        vscode.window.showInformationMessage('Flask server started!');
        // Open the webview
        const panel = vscode.window.createWebviewPanel('aiSearchSimilarities', 'AI Search Similarities', vscode.ViewColumn.One, { enableScripts: true });
        // Set a custom icon for the webview panel
        panel.iconPath = {
            light: vscode.Uri.file(path.join(context.extensionPath, 'resources', 'light', 'icon.png')),
            dark: vscode.Uri.file(path.join(context.extensionPath, 'resources', 'dark', 'icon.png'))
        };
        const webviewPath = vscode.Uri.file(path.join(context.extensionPath, 'SRC', 'web-views', 'code-similarity-ui.html'));
        panel.webview.html = (await vscode.workspace.fs.readFile(webviewPath)).toString();
    });
    context.subscriptions.push(startCommand);
    const componentsTreeDataProvider = new componentsTreeDataProvider_1.ComponentsTreeDataProvider();
    vscode.window.registerTreeDataProvider('componentsView', componentsTreeDataProvider);
    context.subscriptions.push(vscode.commands.registerCommand('componentsView.refresh', () => componentsTreeDataProvider.refresh()));
    const aiSimilarityResultsProvider = new aiSimilarityResultsProvider_1.AiSimilarityResultsProvider();
    vscode.window.registerTreeDataProvider('aiSimilarityResults', aiSimilarityResultsProvider);
    context.subscriptions.push(vscode.commands.registerCommand('aiSimilarityResults.openWebview', async (node) => {
        const panel = vscode.window.createWebviewPanel('aiSimilarityResult', `Similarity Result: ${node.label}`, vscode.ViewColumn.One, { enableScripts: true });
        const webviewPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'web-views', 'code-similarity-ui.html'));
        panel.webview.html = (await vscode.workspace.fs.readFile(webviewPath)).toString();
    }));
}
function deactivate() {
    if (serverProcess) {
        serverProcess.kill();
    }
}


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentsTreeDataProvider = exports.ComponentNode = void 0;
const vscode = __importStar(__webpack_require__(1));
class ComponentNode {
    label;
    children;
    constructor(label, children = []) {
        this.label = label;
        this.children = children;
    }
}
exports.ComponentNode = ComponentNode;
class ComponentsTreeDataProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    components = [
        new ComponentNode('Component 1', [
            new ComponentNode('Subcomponent 1.1'),
            new ComponentNode('Subcomponent 1.2')
        ]),
        new ComponentNode('Component 2', [
            new ComponentNode('Subcomponent 2.1')
        ])
    ];
    getTreeItem(element) {
        const treeItem = new vscode.TreeItem(element.label, element.children.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        return treeItem;
    }
    getChildren(element) {
        if (element) {
            return element.children;
        }
        else {
            return this.components;
        }
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.ComponentsTreeDataProvider = ComponentsTreeDataProvider;


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiSimilarityResultsProvider = void 0;
const vscode = __importStar(__webpack_require__(1));
class SimilarityResultNode {
    label;
    description;
    constructor(label, description) {
        this.label = label;
        this.description = description;
    }
}
class AiSimilarityResultsProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    results = [
        new SimilarityResultNode('Result 1', 'Description of Result 1'),
        new SimilarityResultNode('Result 2', 'Description of Result 2')
    ];
    getTreeItem(element) {
        const treeItem = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.None);
        treeItem.description = element.description;
        treeItem.command = {
            command: 'aiSimilarityResults.openWebview',
            title: 'Open Similarity Result',
            arguments: [element]
        };
        return treeItem;
    }
    getChildren() {
        return this.results;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.AiSimilarityResultsProvider = AiSimilarityResultsProvider;


/***/ })
/******/ 	]);
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map