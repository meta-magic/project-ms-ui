"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var TabcodeComponent = (function () {
    function TabcodeComponent(http) {
        this.http = http;
    }
    TabcodeComponent.prototype.ngOnInit = function () { };
    TabcodeComponent.prototype.getIpAddress = function () {
        return this.http.post('/api/pipeline/Instance/getHostDetails', {});
    };
    TabcodeComponent.prototype.getFileDataBtnClick = function (data, publicIpAddress, protocol) {
        var _this = this;
        this.publicIpAddress = publicIpAddress;
        this.protocol = protocol;
        //back end data comes on child click.
        if (!data.children) {
            var appUrl = 'protocol://host:9870/projectExplorer/findSourceCode';
            if (this.publicIpAddress) {
                appUrl = appUrl.replace('host', this.publicIpAddress);
                appUrl = appUrl.replace('protocol', this.protocol);
            }
            else {
                appUrl = appUrl.replace('host', 'localhost');
                appUrl = appUrl.replace('protocol', this.protocol);
            }
            if (data.leaf) {
                var filedata_1;
                var sourcePathJSON = {};
                sourcePathJSON['sourcePath'] = data.sourcePath;
                this.http.post(appUrl, sourcePathJSON).subscribe(function (res) {
                    filedata_1 = res;
                }, function (err) {
                    console.log('Error occured');
                }, function () {
                    var responseData = JSON.parse(filedata_1.response);
                    _this.sourceCode = '';
                    if (responseData.source) {
                        _this.sourceCode = responseData.source;
                        _this.resetFlag();
                        if (responseData.fileType) {
                            _this.resetFlag();
                            if (responseData.fileType == 'html') {
                                _this.isHtml = true;
                                return;
                            }
                            else if (responseData.fileType == 'json') {
                                _this.isJson = true;
                                return;
                            }
                            else if (responseData.fileType == 'ts') {
                                _this.isTypeScript = true;
                                return;
                            }
                            else if (responseData.fileType == 'css') {
                                _this.isCss = true;
                                return;
                            }
                            else {
                                _this.isHtml = true;
                            }
                        }
                    }
                });
            }
        }
    };
    TabcodeComponent.prototype.resetFlag = function () {
        this.isHtml = false;
        this.isTypeScript = false;
        this.isJson = false;
        this.isCss = false;
    };
    return TabcodeComponent;
}());
__decorate([
    core_1.Input()
], TabcodeComponent.prototype, "sourceCode");
__decorate([
    core_1.Input()
], TabcodeComponent.prototype, "isHtml");
__decorate([
    core_1.Input()
], TabcodeComponent.prototype, "isJson");
__decorate([
    core_1.Input()
], TabcodeComponent.prototype, "isTypeScript");
__decorate([
    core_1.Input()
], TabcodeComponent.prototype, "isCss");
__decorate([
    core_1.Input()
], TabcodeComponent.prototype, "publicIpAddress");
__decorate([
    core_1.Input()
], TabcodeComponent.prototype, "protocol");
TabcodeComponent = __decorate([
    core_2.Component({
        selector: 'tab-code',
        template: "\n  <div *ngIf=\"!sourceCode\" class=\"loadingnav\">\n\n  -  </div>\n  <amexio-label size=\"'small'\">\n\n              <ng-container *ngIf=\"sourceCode\">\n                <ng-container *ngIf=\"isCss\">\n                  <prism-block [code]=\"sourceCode\" [language]=\"'css'\"></prism-block>\n                </ng-container>\n                <ng-container *ngIf=\"isHtml\">\n                  <prism-block [code]=\"sourceCode\" [language]=\"'html'\"></prism-block>\n                </ng-container>\n                <ng-container *ngIf=\"isTypeScript\">\n                  <prism-block [code]=\"sourceCode\" [language]=\"'typescript'\"></prism-block>\n                </ng-container>\n                <ng-container *ngIf=\"isJson\">\n                  <prism-block [code]=\"sourceCode\" [language]=\"'json'\"></prism-block>\n                </ng-container>\n              </ng-container>\n            </amexio-label>\n"
    })
], TabcodeComponent);
exports.TabcodeComponent = TabcodeComponent;
