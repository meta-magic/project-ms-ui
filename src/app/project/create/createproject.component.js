"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var CreateProjectComponent = (function () {
    function CreateProjectComponent(http, ls, cookieService, loaderService, msgService, _notificationService, route, _route, _cdf) {
        this.http = http;
        this.ls = ls;
        this.cookieService = cookieService;
        this.loaderService = loaderService;
        this.msgService = msgService;
        this._notificationService = _notificationService;
        this.route = route;
        this._route = _route;
        this._cdf = _cdf;
        this.asyncFlag = false;
        this.msgData = [];
        // projectUUID: string;
        this.validationMsgArray = [];
        // isValidateForm: boolean = false;
        this.portDisableFlag = true;
        this.showCard = false;
        this.disblefields = false;
        this.showUpadteBtn = false;
        this.showThemeFlag = true;
        this.isLoading = false;
        this.migrationStatusDialogue = false;
        this.projectCreationModel = new ProjectCreationModel();
        this.themes = [];
        this.amexioThemes = [];
        this.materialthemes = [];
        this.getThemeData();
        this.getProjectList();
    }
    CreateProjectComponent.prototype.ngOnInit = function () { };
    CreateProjectComponent.prototype.getThemes = function (col) {
        var themearray = [];
        themearray.push(col);
        return themearray;
    };
    //GET PROJECT LIST OF LOGGED IN USER
    CreateProjectComponent.prototype.getProjectList = function () {
        var _this = this;
        this.validationMsgArray = [];
        var projectDataList;
        this.http.get('/api/project/project/findByProjectOwner').subscribe(function (response) {
            projectDataList = response;
        }, function (error) {
            _this.validationMsgArray = [];
            _this.validationMsgArray.push('Unable to connect to server');
            _this.createErrorData();
        }, function () {
            if (projectDataList.success) {
                _this.projectList = projectDataList;
            }
            else {
                _this.validationMsgArray.push(projectDataList.errorMessage);
                // this.isValidateForm = true;
                _this.createErrorData();
            }
        });
    };
    CreateProjectComponent.prototype.openProjectUi = function () {
        this.showCard = true;
        this.portDisableFlag = true;
        this.disblefields = false;
        this.showUpadteBtn = false;
        this.projectCreationModel = new ProjectCreationModel();
    };
    CreateProjectComponent.prototype.onBlurCheck = function (rUrl) {
        if (rUrl != null && rUrl.isComponentValid) {
        }
        else {
            this.msgData = [];
            this.msgData.push('Repository URL is not valid ,Please check');
            this._notificationService.showWarningData(this.msgData);
        }
    };
    //GET PROJECT DETAILS OF SELECTED PROJECT IN READ ONLY FORM
    CreateProjectComponent.prototype.onProjectSelect = function (event) {
        var _this = this;
        this.loaderService.showLoader();
        this.validationMsgArray = [];
        var selectProject;
        this.themeID = '';
        this.showThemeFlag = false;
        // this.projectCreationModel = new ProjectCreationModel();
        var projectUUID = event.projectUUID;
        this.http
            .get('/api/project/project/selectProject?projectUUID=' + projectUUID)
            .subscribe(function (response) {
            selectProject = response;
        }, function (err) {
            _this.loaderService.hideLoader();
            _this.validationMsgArray.push('Unable to connect to server');
            // this.isValidateForm = true;
            _this.createErrorData();
        }, function () {
            if (selectProject.success) {
                _this.showCard = true;
                _this.projectId = selectProject.response.projectUUID;
                _this.projectCreationModel.projectName =
                    selectProject.response.projectName;
                _this.projectCreationModel.projectDescription =
                    selectProject.response.projectDescription;
                _this.projectCreationModel.themeUUID =
                    selectProject.response.themeUUID;
                _this.themeID = selectProject.response.themeUUID;
                _this.showThemeFlag = true;
                _this.serverPort = selectProject.response.serverPort;
                _this.portDisableFlag = false;
                _this.newTokenid = selectProject.response.newtokenId;
                _this.cookieService.set('tokenid', _this.newTokenid);
                _this.msgService.sendMessage({
                    projectId: _this.projectId
                });
                _this._cdf.detectChanges();
                _this.showUpadteBtn = true;
                _this.disableUpdateBtn = true;
                _this.disblefields = true;
                _this.loaderService.hideLoader();
            }
            else {
                _this.loaderService.hideLoader();
                _this.validationMsgArray.push(selectProject.errorMessage);
                _this.createErrorData();
            }
        });
    };
    //Set Theme
    CreateProjectComponent.prototype.setTheme = function (col) {
        this.projectCreationModel.themeUUID = col.themeUUID;
        if (this.themeID == this.projectCreationModel.themeUUID) {
            this.disableUpdateBtn = true;
        }
        else {
            this.disableUpdateBtn = false;
        }
    };
    //To close Window
    // okErrorBtnClick() {
    //   this.isValidateForm = false;
    //   this.validationMsgArray = [];
    // }
    //Reset Project Data
    CreateProjectComponent.prototype.cancelProject = function () {
        this.projectCreationModel = new ProjectCreationModel();
    };
    CreateProjectComponent.prototype.createInvalidCompErrorData = function () {
        var errorData = [];
        var errorObj = {};
        errorObj['data'] = [];
        errorObj.data = this.validationMsgArray;
        errorData.push(errorObj);
        this._notificationService.showerrorData('Invalid Component', errorData);
    };
    CreateProjectComponent.prototype.createErrorData = function () {
        var errorData = [];
        var errorObj = {};
        errorObj['data'] = [];
        errorObj.data = this.validationMsgArray;
        errorData.push(errorObj);
        this._notificationService.showerrorData('Error Message', errorData);
    };
    CreateProjectComponent.prototype.onUpdate = function () {
        var _this = this;
        this.validationMsgArray = [];
        var response;
        this.asyncFlag = true;
        this.validationMsgArray = [];
        this.msgData = [];
        var requestJson = {
            projectUUID: this.projectId,
            themeUUID: this.projectCreationModel.themeUUID
        };
        this.http.post('/api/project/project/update', requestJson).subscribe(function (res) {
            response = res;
        }, function (err) {
            _this.validationMsgArray = [];
            _this.validationMsgArray.push('Unable to connect to server');
            // this.isValidateForm = true;
            _this.createErrorData();
            _this.asyncFlag = false;
        }, function () {
            if (response.success) {
                _this.asyncFlag = false;
                _this.themeID = _this.projectCreationModel.themeUUID;
                _this.uiCreatedEvent({ ui_created: true });
                _this.msgData.push(response.successMessage);
                _this._notificationService.showSuccessData(_this.msgData);
            }
            else {
                if (response.errorMessage == null) {
                    _this.validationMsgArray.push(response.errors);
                    // this.isValidateForm = true;
                    _this.createErrorData();
                    _this.asyncFlag = false;
                }
                else {
                    _this.validationMsgArray.push(response.errorMessage);
                    // this.isValidateForm = true;
                    _this.createErrorData();
                    _this.asyncFlag = false;
                }
            }
        });
    };
    //UI CREATED EVENT ADDED
    CreateProjectComponent.prototype.uiCreatedEvent = function (string) {
        window.postMessage(string, window.location.origin);
    };
    CreateProjectComponent.prototype.ValidateAndSave = function () {
        this.validationMsgArray = [];
        if (this.projectCreationModel.projectName == '') {
            this.validationMsgArray.push('Please enter project name');
        }
        if (this.projectCreationModel.projectDescription == '') {
            this.validationMsgArray.push('Please enter project description');
        }
        if (this.projectCreationModel.themeUUID == null ||
            this.projectCreationModel.themeUUID == '') {
            this.validationMsgArray.push('Please select theme');
        }
        if (this.validationMsgArray && this.validationMsgArray.length >= 1) {
            this.createInvalidCompErrorData();
            return;
        }
        else {
            this.saveProjectCreation();
        }
    };
    //Save Method to create Project
    CreateProjectComponent.prototype.saveProjectCreation = function () {
        var _this = this;
        var response;
        this.asyncFlag = true;
        this.msgData = [];
        this.validationMsgArray = [];
        this.loaderService.showLoader();
        var requestJson = {
            projectName: this.projectCreationModel.projectName,
            projectDescription: this.projectCreationModel.projectDescription,
            themeUUID: this.projectCreationModel.themeUUID
        };
        this.http.post('/api/project/project/save ', requestJson).subscribe(function (res) {
            response = res;
        }, function (err) {
            _this.validationMsgArray.push('Unable to connect to server');
            // this.isValidateForm = true;
            _this.createErrorData();
            _this.asyncFlag = false;
            _this.loaderService.hideLoader();
        }, function () {
            if (response.success) {
                _this.ls.remove('platformInfo');
                var platformInfo = {
                    desire3dversionid: 2,
                    projectMigrated: true
                };
                _this.ls.set('platformInfo', platformInfo);
                _this.newTokenid = response.response.tokenid;
                _this.projectId = response.response.projectUUID;
                _this.cookieService.set('tokenid', _this.newTokenid);
                _this.asyncFlag = false;
                _this.msgData.push(response.successMessage);
                _this._notificationService.showSuccessData(_this.msgData);
                _this.loaderService.hideLoader();
                _this.clearData();
                _this.getProjectList();
                _this.msgService.sendMessage({
                    projectId: _this.projectId,
                    saveproject: true
                });
                _this.showtask();
            }
            else {
                _this.validationMsgArray.push(response.errorMessage);
                _this.createErrorData();
                _this.asyncFlag = false;
                _this.loaderService.hideLoader();
            }
        });
    };
    CreateProjectComponent.prototype.showtask = function () {
        this.confirmdialogue = !this.confirmdialogue;
    };
    CreateProjectComponent.prototype.checkStatus = function (data) {
        if (data === 'ok') {
            this.msgService.sendMessage({
                path: 'home/codepipeline/task-ui',
                title: 'Task Details'
            });
        }
    };
    // findInstance() {
    //   this.validationMsgArray = [];
    //   let instanceresponse: any;
    //   this.http.post('/api/pipeline/Instance/getHostDetails', {}).subscribe(
    //     res => {
    //       instanceresponse = res;
    //     },
    //     err => {
    //       this.validationMsgArray.push(
    //         'Unable to connect to server, please try after sometime.'
    //       );
    //       // this.isValidateForm = true;
    //       this.createErrorData();
    //     },
    //     () => {
    //       if (instanceresponse.success) {
    //         this.openProjectUi();
    //       } else {
    //         this.validationMsgArray.push(
    //           'Unable to connect to server, please try after sometime.'
    //         );
    //         // this.isValidateForm = true;
    //         this.createErrorData();
    //       }
    //     }
    //   );
    // }
    CreateProjectComponent.prototype.clearData = function () {
        this.projectCreationModel = new ProjectCreationModel();
    };
    // To Fetch Theme Data from DB
    CreateProjectComponent.prototype.getThemeData = function () {
        var _this = this;
        var response;
        this.http.get('/api/project/themes/findAll').subscribe(function (res) {
            response = res;
        }, function (err) {
            // this.validationMsgArray.push('Unable to connect to server');
            // this.isValidateForm = true;
            _this.asyncFlag = false;
        }, function () {
            if (response.success) {
                _this.themes = response.response;
                _this.iterateData(_this.themes);
            }
            else if (!response.success && response.errors) {
                _this.validationMsgArray.push(response.errorMessage);
                _this.createErrorData();
            }
        });
    };
    CreateProjectComponent.prototype.iterateData = function (themes) {
        var _this = this;
        themes.forEach(function (obj) {
            if (obj.themeType == '1') {
                var obj1 = {
                    themeUUID: obj.themeUUID,
                    themesName: obj.themesName,
                    themesDescription: obj.themesDescription,
                    themesIcon: obj.themesIcon,
                    themeType: obj.themeType
                };
                _this.amexioThemes.push(obj1);
            }
            else {
                var obj2 = {
                    themeUUID: obj.themeUUID,
                    themesName: obj.themesName,
                    themesDescription: obj.themesDescription,
                    themesIcon: obj.themesIcon,
                    themeType: obj.themeType
                };
                _this.materialthemes.push(obj2);
            }
        });
    };
    return CreateProjectComponent;
}());
CreateProjectComponent = __decorate([
    core_1.Component({
        selector: 'project-create',
        template: "\n  <amexio-row>\n    <amexio-column [size]=\"3\">\n   <amexio-card  [header]=\"false\" [footer]=\"true\" [footer-align]=\"'right'\"  [body-height]=\"80\">\n    <amexio-body [padding]=\"'0px'\">\n     <amexio-listbox [enable-checkbox]=\"false\"\n                [header]=\"'Projects'\"\n                [search-placeholder]=\"'Search'\"\n                [data]=\"projectList\"\n                [filter]=\"true\"\n                [data-reader]=\"'response'\"\n                [display-field]=\"'projectName'\"\n                [border]=\"'none'\"\n                (onRowClick)=\"onProjectSelect($event)\">\n</amexio-listbox>\n</amexio-body>\n<amexio-action>\n <amexio-button\n    [label]=\"'New'\"\n    [type]=\"'secondary'\"\n    [tooltip]=\"'New'\"\n    [size]=\"'default'\"\n    [icon]=\"'fa fa-plus fa-lg'\"\n    (onClick)=\"openProjectUi()\">\n    </amexio-button>\n</amexio-action>\n</amexio-card>\n    </amexio-column>\n  <amexio-column [size]=\"9\">\n  <ng-container *ngIf=\"showCard\">\n   <div class=\"loadingnav\" *ngIf=\"loaderService.isLoading\"></div>\n <amexio-form [form-name]=\"'validateForm'\"  [body-height]=\"80\" [header]=\"true\" [show-error]=\"true\" [footer-align]=\"'right'\">\n\n    <amexio-form-header>\n             Project Creation\n    </amexio-form-header>\n<amexio-form-body>\n                           <amexio-row>\n        <amexio-column [size]=\"6\">\n          <amexio-text-input  [(ngModel)]=\"projectCreationModel.projectName\" [field-label]=\"'Name'\" name =\"projectCreationModel.projectName\"\n                            [place-holder]=\"'Enter Name'\"\n                            [enable-popover]=\"true\"\n                            [min-length]=\"3\" [max-length]=\"128\"\n                             [min-error-msg]=\"'Minimun 3  characters project name required'\"\n                             [max-error-msg]=\"'Maximun 128 characters  project name allowed'\"\n                            [allow-blank]=\"false\"\n                            error-msg=\"Please enter project name\"\n                            [icon-feedback]=\"true\"\n                            [disabled]=\"disblefields\">\n          </amexio-text-input>\n        </amexio-column>\n        <amexio-column [size]=\"6\">\n          <amexio-textarea-input [field-label]=\"'Description'\" name =\"projectCreationModel.projectDescription\"\n                          [place-holder]=\"'Enter Description'\"\n                          [icon-feedback]=\"true\"\n                           [allow-blank]=\"false\"\n                            error-msg=\"Please enter  project description\"\n                            [enable-popover]=\"true\"\n                           [rows]=\"'2'\"\n                           [columns]=\"'1'\"\n                          [disabled]=\"disblefields\"\n                          [(ngModel)]=\"projectCreationModel.projectDescription\">\n          </amexio-textarea-input>\n        </amexio-column>\n<ng-container *ngIf=\"!portDisableFlag\">\n         <amexio-column [size]=\"12\">\n\n         Server Port:{{serverPort}}\n        </amexio-column>\n                </ng-container>\n                <amexio-column [size]=\"12\">\n         <amexio-label >Material themes</amexio-label>\n         </amexio-column>\n       </amexio-row>\n        <amexio-row>\n                <amexio-column [size]=\"4\" *ngFor=\"let col of materialthemes\">\n                <div class=\"proj-ui\">\n <amexio-card [header]=\"true\"\n                [footer]=\"false\"\n                [show]=\"true\"\n                [header-align]=\"left\">\n            <amexio-header>\n            <div *ngIf=\"showThemeFlag\">\n            <amexio-radio-group\n                name =\"projectCreationModel.themeUUID\"\n                [display-field]=\"'themesName'\"\n                [allow-blank]=\"true\"\n                [value-field]=\"'themeUUID'\"\n                [data]=\"getThemes(col)\"\n                [default-value]=\"projectCreationModel.themeUUID\"\n                (onSelection)=\"setTheme(col)\" style=\"display: inline;\">\n           </amexio-radio-group>\n                      </div>\n                    </amexio-header>\n                    <amexio-body>\n                            <amexio-image [path]=\"'assets/images/theme-icons/'+col.themesIcon\"></amexio-image> <br/>\n                    </amexio-body>\n                </amexio-card>\n                </div>\n  </amexio-column>\n            </amexio-row>\n\n </amexio-form-body>\n   <amexio-form-action>\n    <ng-container *ngIf=\"!showUpadteBtn\">\n     <amexio-button\n    [label]=\"'Cancel'\"\n    [type]=\"'secondary'\"\n    [tooltip]=\"'Cancel'\"\n    [size]=\"'default'\"\n    [icon]=\"'fa fa-close'\"\n    (onClick)=\"cancelProject()\">\n    </amexio-button>\n    </ng-container>\n     <ng-container *ngIf=\"showUpadteBtn\">\n    <amexio-button\n    [label]=\"'Update'\"\n    [loading]=\"asyncFlag\"\n    [type]=\"'primary'\"\n    [tooltip]=\"'Update'\"\n    [disabled]=\"disableUpdateBtn\"\n    [size]=\"'default'\"\n    [icon]=\"'fa fa-save'\"\n    (onClick)=\"onUpdate()\">\n    </amexio-button>\n     </ng-container>\n          <ng-container *ngIf=\"!showUpadteBtn\">\n    <amexio-button\n    [label]=\"'Save'\"\n    [loading]=\"asyncFlag\"\n    [type]=\"'primary'\"\n    [tooltip]=\"'Save'\"\n    [size]=\"'default'\"\n    [icon]=\"'fa fa-save'\"\n    [disabled]=\"false\"\n    [form-bind]=\"'validateForm'\"\n    (onClick)=\"ValidateAndSave()\">\n    </amexio-button>\n    </ng-container>\n</amexio-form-action>\n\n </amexio-form>\n\n  </ng-container>\n   <ng-container *ngIf=\"!showCard\">\n                <amexio-card [header]=\"true\"\n                [footer]=\"false\"\n                [show]=\"true\"\n                [footer-align]=\"'right'\"\n                [body-height]=\"80\">\n                    <amexio-header>\n                     Help Document\n                    </amexio-header>\n                    <amexio-body>\n                    </amexio-body>\n                </amexio-card>\n                </ng-container>\n  </amexio-column>\n  <amexio-dialogue [show-dialogue]=\"confirmdialogue\"\n               [title]=\"'Confirm'\"\n               [message]=\"'Do you want to view created project status?'\"\n               [message-type]=\"'confirm'\"\n               [type]=\"'confirm'\"\n               (actionStatus)=\"checkStatus($event)\">\n</amexio-dialogue>\n\n<project-notification></project-notification>\n   \n</amexio-row>\n\n  "
    })
], CreateProjectComponent);
exports.CreateProjectComponent = CreateProjectComponent;
var ProjectCreationModel = (function () {
    function ProjectCreationModel() {
        this.projectDescription = '';
        this.projectName = '';
        this.themeUUID = '6FF7B738-EE02-4367-9168-FD5327E3FCBB';
    }
    return ProjectCreationModel;
}());
exports.ProjectCreationModel = ProjectCreationModel;
