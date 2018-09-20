"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var tabcode_component_1 = require("./tabcode.component");
var CodeExplorerComponent = (function () {
    function CodeExplorerComponent(http, cookie, _notificationService, cdf, componentFactoryResolver) {
        this.http = http;
        this.cookie = cookie;
        this._notificationService = _notificationService;
        this.cdf = cdf;
        this.componentFactoryResolver = componentFactoryResolver;
        this.asyncFlag = false;
        this.showErrorDialogue = false;
        this.inValidMessageData = [];
        this.stageDataTree = [];
        this.stageFileSelected = [];
        this.unStageFileSelected = [];
        this.openTabData = [];
        this.tabcount = 0;
        this.URLDisabled = false;
        this.resetFlag();
        this.stageDataTree = [];
        this.unstagedTreeData = [];
        this.msgData = [];
    }
    CodeExplorerComponent.prototype.ngOnInit = function () {
        this.gethostdeatils();
    };
    CodeExplorerComponent.prototype.gethostdeatils = function () {
        var _this = this;
        var responsedata;
        this.http.post('/api/pipeline/Instance/getHostDetails', {}).subscribe(function (response) {
            responsedata = response;
        }, function (error) { }, function () {
            if (responsedata.response) {
                _this.publicIpAddress = responsedata.response.hostIpAddress;
                _this.protocol = responsedata.response.protocol;
                _this.getSourceCodeTreeData();
            }
            else {
                _this.publicIpAddress = '';
                _this.protocol = '';
            }
        });
    };
    CodeExplorerComponent.prototype.createInvalidCompErrorData = function () {
        var errorData = [];
        var errorObj = {};
        errorObj['data'] = [];
        errorObj.data = this.inValidMessageData;
        errorData.push(errorObj);
        this._notificationService.showerrorData('Invalid Component', errorData);
    };
    CodeExplorerComponent.prototype.createErrorData = function () {
        var errorData = [];
        var errorObj = {};
        errorObj['data'] = [];
        errorObj.data = this.inValidMessageData;
        errorData.push(errorObj);
        this._notificationService.showerrorData('Error Message', errorData);
    };
    /*````````````````````````````````````````````````UNSTAGE DATA TREE OPRATION*/
    CodeExplorerComponent.prototype.getUnstagedClickData = function (data) {
        var _this = this;
        this.unStageFileSelected = [];
        this.selectedTreeUnstageObject = null;
        this.selectedTreeUnstageObject = data;
        this.selectedTreeUnstageObject.forEach(function (checkFileUnstage, index) {
            if (checkFileUnstage.checked) {
                _this.unStageFileSelected.push(checkFileUnstage);
            }
        });
    };
    CodeExplorerComponent.prototype.onOneFileToStage = function (data) {
        var _this = this;
        this.removeUnstageData();
        this.unStageFileSelected.forEach(function (obj) {
            obj.checked = false;
            _this.stageDataTree.push(obj);
        });
        this.unStageFileSelected = [];
    };
    CodeExplorerComponent.prototype.removeUnstageData = function () {
        var localArray = [];
        var localTreeData;
        this.unstagedTreeData.forEach(function (objUnstage, index) {
            if (!objUnstage.checked) {
                localArray.push(objUnstage);
            }
        });
        this.unstagedTreeData = localArray;
    };
    CodeExplorerComponent.prototype.onAllFileToStage = function (data) {
        var _this = this;
        this.unstagedTreeData.forEach(function (obj, index) {
            obj.checked = false;
            _this.stageDataTree.push(obj);
        });
        this.unstagedTreeData.forEach(function (obj, index) {
            obj.checked = false;
            _this.unstagedTreeData.splice(index);
        });
    };
    /* ``````````````````````````````````````````````````STAGE DATA TREE OPRATION HERE*/
    CodeExplorerComponent.prototype.getStageDataClick = function (data) {
        var _this = this;
        this.stageFileSelected = [];
        this.selectedTreeStageObject = null;
        this.selectedTreeStageObject = data;
        this.selectedTreeStageObject.forEach(function (fileStageCheck, index) {
            if (fileStageCheck.checked) {
                _this.stageFileSelected.push(fileStageCheck);
            }
        });
    };
    CodeExplorerComponent.prototype.onSelectedReturnToUnstage = function (data) {
        var _this = this;
        this.removeFormStageData();
        this.stageFileSelected.forEach(function (obj) {
            if (obj.checked) {
                obj.checked = false;
                _this.unstagedTreeData.push(obj);
            }
        });
        this.stageFileSelected = [];
    };
    CodeExplorerComponent.prototype.removeFormStageData = function () {
        var localArray = [];
        var localTreeData;
        this.stageDataTree.forEach(function (objUnstage, index) {
            if (!objUnstage.checked) {
                localArray.push(objUnstage);
            }
        });
        this.stageDataTree = localArray;
    };
    CodeExplorerComponent.prototype.onAllReturnToUnstage = function () {
        var _this = this;
        this.stageDataTree.forEach(function (obj, index) {
            obj.checked = false;
            _this.unstagedTreeData.push(obj);
        });
        this.stageDataTree.forEach(function (obj, index) {
            obj.checked = false;
            _this.stageDataTree.splice(index);
        });
    };
    // ALL PRISM FLAG CLOSE HERE
    CodeExplorerComponent.prototype.resetFlag = function () {
        this.isHtml = false;
        this.isTypeScript = false;
        this.isJson = false;
        this.isCss = false;
    };
    // PRISM TREE DATA CLEARING BUTTON CLICK
    CodeExplorerComponent.prototype.clearPrismDisplayData = function () {
        this.sourceCode = '';
        //this.unableToConnectDialogue = true;
    };
    //Add Tab
    CodeExplorerComponent.prototype.checkActiveTab = function (sourcetab, data) {
        var title = data.text;
        if (!data.children && !sourcetab.setActiveTab(data.text)) {
            this.addTab(sourcetab, data);
        }
    };
    CodeExplorerComponent.prototype.addTab = function (sourcetab, data) {
        if (!data.children) {
            this.tabcount++;
            var title = data.text;
            this.openTabData.push(data);
            var cmp_1 = sourcetab.addDynamicTab(title, 'black', true, tabcode_component_1.TabcodeComponent);
            if (data) {
                var responsedata_1;
                cmp_1.getIpAddress().subscribe(function (response) {
                    responsedata_1 = response;
                }, function (error) { }, function () {
                    if (responsedata_1.response) {
                        cmp_1.publicIpAddress = responsedata_1.response.hostIpAddress;
                        cmp_1.protocol = responsedata_1.response.protocol;
                        cmp_1.getFileDataBtnClick(data, cmp_1.publicIpAddress, cmp_1.protocol);
                    }
                    else {
                        cmp_1.publicIpAddress = '';
                        cmp_1.protocol = '';
                    }
                });
            }
        }
    };
    //Reload the source code
    CodeExplorerComponent.prototype.onRefreshClick = function () {
        this.getSourceCodeTreeData();
    };
    //Method to get Source Code FROM BACKEND AND USE FOR THE TREE STRUCTURE DATA DISPLAY
    CodeExplorerComponent.prototype.getSourceCodeTreeData = function () {
        var _this = this;
        this.inValidMessageData = [];
        // this.fileDataFromBack = false;
        // let appUrl = 'http://host:8080/code-pipeline-service/projectExplorer/explorer';
        var appUrl = 'protocol://host:9870/projectExplorer/explorer';
        if (this.publicIpAddress) {
            appUrl = appUrl.replace('host', this.publicIpAddress);
            appUrl = appUrl.replace('protocol', this.protocol);
        }
        else {
            appUrl = appUrl.replace('host', 'localhost');
            appUrl = appUrl.replace('protocol', this.protocol);
            "";
        }
        var filedata;
        var tokenId = this.cookie.get('tokenid');
        var headers = new http_1.HttpHeaders({ tokenid: tokenId });
        var httpOptions = { headers: headers };
        this.http.get(appUrl, httpOptions).subscribe(function (res) {
            filedata = res;
        }, function (err) {
            _this.inValidMessageData = [];
            _this.inValidMessageData.push('Unable To Connect Server');
            _this.createErrorData();
        }, function () {
            if (filedata.response) {
                var responsedata = void 0;
                responsedata = JSON.parse(filedata.response);
                _this.fileStructuredata = {
                    children: []
                };
                _this.fileStructuredata = responsedata.children;
            }
        });
    };
    // CLOSE DIALOGUE BOX
    CodeExplorerComponent.prototype.closeDialogue = function () {
        this.showErrorDialogue = false;
    };
    CodeExplorerComponent.prototype.treeOfUnstagedData = function () {
        var _this = this;
        var responseData;
        this.http.get('assets/json/share.json').subscribe(function (response) {
            responseData = response;
        }, function (err) {
            _this.inValidMessageData = [];
            _this.inValidMessageData.push('Unable To Connect Server');
            _this.showErrorDialogue = true;
        }, function () {
            _this.unstagedTreeData = responseData;
        });
    };
    return CodeExplorerComponent;
}());
CodeExplorerComponent = __decorate([
    core_1.Component({
        selector: 'code-explorer',
        template: "\n    <amexio-row>\n      <amexio-column [size]=\"3\">\n        <amexio-card [header]=\"false\" [footer]=\"false\" [show]=\"true\" [header-align]=\"'center'\" [body-height]=\"80\"\n                     [footer-align]=\"'right'\">\n\n          <amexio-body>\n          <amexio-tab-view [action]=\"true\" [body-height]=\"80\">\n          <amexio-tab-action>\n                 <amexio-image style=\"cursor:pointer;\" [icon-class]=\"'fa fa-refresh fa-lg'\" [tooltip]=\"'Refresh'\" (onClick)=\"onRefreshClick()\"></amexio-image>\n          </amexio-tab-action>\n          <amexio-tab title=\"Source Code\" [active]=\"true\" [icon]=\"'fa fa-file-o'\">\n              <amexio-treeview [data-reader]=\"'children'\" [data]=\"fileStructuredata\" (nodeClick)=\"checkActiveTab(sourcetab,$event)\"></amexio-treeview>\n          </amexio-tab>\n           \n             </amexio-tab-view>\n          </amexio-body>\n        </amexio-card>\n      </amexio-column>\n      <amexio-column [size]=\"9\">\n        <amexio-card [body-height]=\"80\" [header]=\"false\" [footer]=\"false\" [show]=\"true\" [header-align]=\"'left'\">\n\n        <amexio-body>\n\n              <amexio-tab-view #sourcetab [closable]=\"true\" [tab-position]=\"'top'\" [header-align]=\"'left'\" [body-height]=\"80\">\n</amexio-tab-view>\n          </amexio-body>\n        </amexio-card>\n\n      </amexio-column>\n        \n <project-notification></project-notification>\n\n    <amexio-dialogue [show-dialogue]=\"showErrorDialogue\" (close)=\"closeDialogue()\" [custom]=\"true\"\n                     [title]=\"'Error Message'\" [type]=\"'confirm'\">\n      <amexio-body>\n        <div *ngFor=\"let data of inValidMessageData\">\n          <li style=\"text-align: left\">{{data}}</li>\n        </div>\n      </amexio-body>\n      <amexio-action>\n        <amexio-button type=\"primary\" (onClick)=\"closeDialogue()\" [label]=\"'Ok'\"></amexio-button>\n      </amexio-action>\n    </amexio-dialogue>\n    </amexio-row>\n          ",
        styles: [
            "\n      .panel-panel {\n        height: 488px !important;\n      }\n    "
        ]
    })
], CodeExplorerComponent);
exports.CodeExplorerComponent = CodeExplorerComponent;
//((git|ssh|http(s)?)|(git@[\w\.]+))(:(//)?)([\w\.@\:/\-~]+)(\.git)(/)?
