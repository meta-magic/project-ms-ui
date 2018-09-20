import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Input, NgModule, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AmexioFormsModule, AmexioPaneModule, AmexioWidgetModule } from 'amexio-ng-extensions';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CookieService, LoaderService, LocalStorageService, MessagingService, NotificationService, PlatformCommmonsModule } from 'platform-commons';
import 'prismjs/prism';
import 'prismjs/components/prism-typescript';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var CreateProjectComponent = (function () {
    function CreateProjectComponent(http$$1, ls, cookieService, loaderService, msgService, _notificationService, route, _route, _cdf) {
        this.http = http$$1;
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
    /**
     * @return {?}
     */
    CreateProjectComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () { };
    /**
     * @param {?} col
     * @return {?}
     */
    CreateProjectComponent.prototype.getThemes = /**
     * @param {?} col
     * @return {?}
     */
    function (col) {
        var /** @type {?} */ themearray = [];
        themearray.push(col);
        return themearray;
    };
    //GET PROJECT LIST OF LOGGED IN USER
    /**
     * @return {?}
     */
    CreateProjectComponent.prototype.getProjectList = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.validationMsgArray = [];
        var /** @type {?} */ projectDataList;
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
                // this.isValidateForm = true;
                _this.createErrorData();
            }
        });
    };
    /**
     * @return {?}
     */
    CreateProjectComponent.prototype.openProjectUi = /**
     * @return {?}
     */
    function () {
        this.showCard = true;
        this.portDisableFlag = true;
        this.disblefields = false;
        this.showUpadteBtn = false;
        this.projectCreationModel = new ProjectCreationModel();
    };
    /**
     * @param {?} rUrl
     * @return {?}
     */
    CreateProjectComponent.prototype.onBlurCheck = /**
     * @param {?} rUrl
     * @return {?}
     */
    function (rUrl) {
        if (rUrl != null && rUrl.isComponentValid) {
        }
        else {
            this.msgData = [];
            this.msgData.push('Repository URL is not valid ,Please check');
            this._notificationService.showWarningData(this.msgData);
        }
    };
    //GET PROJECT DETAILS OF SELECTED PROJECT IN READ ONLY FORM
    /**
     * @param {?} event
     * @return {?}
     */
    CreateProjectComponent.prototype.onProjectSelect = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        this.loaderService.showLoader();
        this.validationMsgArray = [];
        var /** @type {?} */ selectProject;
        this.themeID = '';
        this.showThemeFlag = false;
        // this.projectCreationModel = new ProjectCreationModel();
        var /** @type {?} */ projectUUID = event.projectUUID;
        this.http
            .get('/api/project/project/selectProject?projectUUID=' + projectUUID)
            .subscribe(function (response) {
            selectProject = response;
        }, function (err) {
            _this.loaderService.hideLoader();
            _this.validationMsgArray.push('Unable to connect to server');
            // this.isValidateForm = true;
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
    /**
     * @param {?} col
     * @return {?}
     */
    CreateProjectComponent.prototype.setTheme = /**
     * @param {?} col
     * @return {?}
     */
    function (col) {
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
    /**
     * @return {?}
     */
    CreateProjectComponent.prototype.cancelProject = /**
     * @return {?}
     */
    function () {
        this.projectCreationModel = new ProjectCreationModel();
    };
    /**
     * @return {?}
     */
    CreateProjectComponent.prototype.createInvalidCompErrorData = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ errorData = [];
        var /** @type {?} */ errorObj = {};
        errorObj['data'] = [];
        errorObj.data = this.validationMsgArray;
        errorData.push(errorObj);
        this._notificationService.showerrorData('Invalid Component', errorData);
    };
    /**
     * @return {?}
     */
    CreateProjectComponent.prototype.createErrorData = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ errorData = [];
        var /** @type {?} */ errorObj = {};
        errorObj['data'] = [];
        errorObj.data = this.validationMsgArray;
        errorData.push(errorObj);
        this._notificationService.showerrorData('Error Message', errorData);
    };
    /**
     * @return {?}
     */
    CreateProjectComponent.prototype.onUpdate = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.validationMsgArray = [];
        var /** @type {?} */ response;
        this.asyncFlag = true;
        this.validationMsgArray = [];
        this.msgData = [];
        var /** @type {?} */ requestJson = {
            projectUUID: this.projectId,
            themeUUID: this.projectCreationModel.themeUUID
        };
        this.http.post('/api/project/project/update', requestJson).subscribe(function (res) {
            response = res;
        }, function (err) {
            _this.validationMsgArray = [];
            _this.validationMsgArray.push('Unable to connect to server');
            // this.isValidateForm = true;
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
                    // this.isValidateForm = true;
                    _this.createErrorData();
                    _this.asyncFlag = false;
                }
                else {
                    _this.validationMsgArray.push(response.errorMessage);
                    // this.isValidateForm = true;
                    // this.isValidateForm = true;
                    _this.createErrorData();
                    _this.asyncFlag = false;
                }
            }
        });
    };
    //UI CREATED EVENT ADDED
    /**
     * @param {?} string
     * @return {?}
     */
    CreateProjectComponent.prototype.uiCreatedEvent = /**
     * @param {?} string
     * @return {?}
     */
    function (string) {
        window.postMessage(string, window.location.origin);
    };
    /**
     * @return {?}
     */
    CreateProjectComponent.prototype.ValidateAndSave = /**
     * @return {?}
     */
    function () {
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
    /**
     * @return {?}
     */
    CreateProjectComponent.prototype.saveProjectCreation = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ response;
        this.asyncFlag = true;
        this.msgData = [];
        this.validationMsgArray = [];
        this.loaderService.showLoader();
        var /** @type {?} */ requestJson = {
            projectName: this.projectCreationModel.projectName,
            projectDescription: this.projectCreationModel.projectDescription,
            themeUUID: this.projectCreationModel.themeUUID
        };
        this.http.post('/api/project/project/save ', requestJson).subscribe(function (res) {
            response = res;
        }, function (err) {
            _this.validationMsgArray.push('Unable to connect to server');
            // this.isValidateForm = true;
            // this.isValidateForm = true;
            _this.createErrorData();
            _this.asyncFlag = false;
            _this.loaderService.hideLoader();
        }, function () {
            if (response.success) {
                _this.ls.remove('platformInfo');
                var /** @type {?} */ platformInfo = {
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
    /**
     * @return {?}
     */
    CreateProjectComponent.prototype.showtask = /**
     * @return {?}
     */
    function () {
        this.confirmdialogue = !this.confirmdialogue;
    };
    /**
     * @param {?} data
     * @return {?}
     */
    CreateProjectComponent.prototype.checkStatus = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
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
    /**
     * @return {?}
     */
    CreateProjectComponent.prototype.clearData = /**
     * @return {?}
     */
    function () {
        this.projectCreationModel = new ProjectCreationModel();
    };
    // To Fetch Theme Data from DB
    /**
     * @return {?}
     */
    CreateProjectComponent.prototype.getThemeData = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ response;
        this.http.get('/api/project/themes/findAll').subscribe(function (res) {
            response = res;
        }, function (err) {
            // this.validationMsgArray.push('Unable to connect to server');
            // this.isValidateForm = true;
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
    /**
     * @param {?} themes
     * @return {?}
     */
    CreateProjectComponent.prototype.iterateData = /**
     * @param {?} themes
     * @return {?}
     */
    function (themes) {
        var _this = this;
        themes.forEach(function (obj) {
            if (obj.themeType == '1') {
                var /** @type {?} */ obj1 = {
                    themeUUID: obj.themeUUID,
                    themesName: obj.themesName,
                    themesDescription: obj.themesDescription,
                    themesIcon: obj.themesIcon,
                    themeType: obj.themeType
                };
                _this.amexioThemes.push(obj1);
            }
            else {
                var /** @type {?} */ obj2 = {
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
    CreateProjectComponent.decorators = [
        { type: Component, args: [{
                    selector: 'project-create',
                    template: "\n  <amexio-row>\n    <amexio-column [size]=\"3\">\n   <amexio-card  [header]=\"false\" [footer]=\"true\" [footer-align]=\"'right'\"  [body-height]=\"80\">\n    <amexio-body [padding]=\"'0px'\">\n     <amexio-listbox [enable-checkbox]=\"false\"\n                [header]=\"'Projects'\"\n                [search-placeholder]=\"'Search'\"\n                [data]=\"projectList\"\n                [filter]=\"true\"\n                [data-reader]=\"'response'\"\n                [display-field]=\"'projectName'\"\n                [border]=\"'none'\"\n                (onRowClick)=\"onProjectSelect($event)\">\n</amexio-listbox>\n</amexio-body>\n<amexio-action>\n <amexio-button\n    [label]=\"'New'\"\n    [type]=\"'secondary'\"\n    [tooltip]=\"'New'\"\n    [size]=\"'default'\"\n    [icon]=\"'fa fa-plus fa-lg'\"\n    (onClick)=\"openProjectUi()\">\n    </amexio-button>\n</amexio-action>\n</amexio-card>\n    </amexio-column>\n  <amexio-column [size]=\"9\">\n  <ng-container *ngIf=\"showCard\">\n   <div class=\"loadingnav\" *ngIf=\"loaderService.isLoading\"></div>\n <amexio-form [form-name]=\"'validateForm'\"  [body-height]=\"80\" [header]=\"true\" [show-error]=\"true\" [footer-align]=\"'right'\">\n\n    <amexio-form-header>\n             Project Creation\n    </amexio-form-header>\n<amexio-form-body>\n                           <amexio-row>\n        <amexio-column [size]=\"6\">\n          <amexio-text-input  [(ngModel)]=\"projectCreationModel.projectName\" [field-label]=\"'Name'\" name =\"projectCreationModel.projectName\"\n                            [place-holder]=\"'Enter Name'\"\n                            [enable-popover]=\"true\"\n                            [min-length]=\"3\" [max-length]=\"128\"\n                             [min-error-msg]=\"'Minimun 3  characters project name required'\"\n                             [max-error-msg]=\"'Maximun 128 characters  project name allowed'\"\n                            [allow-blank]=\"false\"\n                            error-msg=\"Please enter project name\"\n                            [icon-feedback]=\"true\"\n                            [disabled]=\"disblefields\">\n          </amexio-text-input>\n        </amexio-column>\n        <amexio-column [size]=\"6\">\n          <amexio-textarea-input [field-label]=\"'Description'\" name =\"projectCreationModel.projectDescription\"\n                          [place-holder]=\"'Enter Description'\"\n                          [icon-feedback]=\"true\"\n                           [allow-blank]=\"false\"\n                            error-msg=\"Please enter  project description\"\n                            [enable-popover]=\"true\"\n                           [rows]=\"'2'\"\n                           [columns]=\"'1'\"\n                          [disabled]=\"disblefields\"\n                          [(ngModel)]=\"projectCreationModel.projectDescription\">\n          </amexio-textarea-input>\n        </amexio-column>\n<ng-container *ngIf=\"!portDisableFlag\">\n         <amexio-column [size]=\"12\">\n\n         Server Port:{{serverPort}}\n        </amexio-column>\n                </ng-container>\n                <amexio-column [size]=\"12\">\n         <amexio-label >Material themes</amexio-label>\n         </amexio-column>\n       </amexio-row>\n        <amexio-row>\n                <amexio-column [size]=\"4\" *ngFor=\"let col of materialthemes\">\n                <div class=\"proj-ui\">\n <amexio-card [header]=\"true\"\n                [footer]=\"false\"\n                [show]=\"true\"\n                [header-align]=\"left\">\n            <amexio-header>\n            <div *ngIf=\"showThemeFlag\">\n            <amexio-radio-group\n                name =\"projectCreationModel.themeUUID\"\n                [display-field]=\"'themesName'\"\n                [allow-blank]=\"true\"\n                [value-field]=\"'themeUUID'\"\n                [data]=\"getThemes(col)\"\n                [default-value]=\"projectCreationModel.themeUUID\"\n                (onSelection)=\"setTheme(col)\" style=\"display: inline;\">\n           </amexio-radio-group>\n                      </div>\n                    </amexio-header>\n                    <amexio-body>\n                            <amexio-image [path]=\"'assets/images/theme-icons/'+col.themesIcon\"></amexio-image> <br/>\n                    </amexio-body>\n                </amexio-card>\n                </div>\n  </amexio-column>\n            </amexio-row>\n\n </amexio-form-body>\n   <amexio-form-action>\n    <ng-container *ngIf=\"!showUpadteBtn\">\n     <amexio-button\n    [label]=\"'Cancel'\"\n    [type]=\"'secondary'\"\n    [tooltip]=\"'Cancel'\"\n    [size]=\"'default'\"\n    [icon]=\"'fa fa-close'\"\n    (onClick)=\"cancelProject()\">\n    </amexio-button>\n    </ng-container>\n     <ng-container *ngIf=\"showUpadteBtn\">\n    <amexio-button\n    [label]=\"'Update'\"\n    [loading]=\"asyncFlag\"\n    [type]=\"'primary'\"\n    [tooltip]=\"'Update'\"\n    [disabled]=\"disableUpdateBtn\"\n    [size]=\"'default'\"\n    [icon]=\"'fa fa-save'\"\n    (onClick)=\"onUpdate()\">\n    </amexio-button>\n     </ng-container>\n          <ng-container *ngIf=\"!showUpadteBtn\">\n    <amexio-button\n    [label]=\"'Save'\"\n    [loading]=\"asyncFlag\"\n    [type]=\"'primary'\"\n    [tooltip]=\"'Save'\"\n    [size]=\"'default'\"\n    [icon]=\"'fa fa-save'\"\n    [disabled]=\"false\"\n    [form-bind]=\"'validateForm'\"\n    (onClick)=\"ValidateAndSave()\">\n    </amexio-button>\n    </ng-container>\n</amexio-form-action>\n\n </amexio-form>\n\n  </ng-container>\n   <ng-container *ngIf=\"!showCard\">\n                <amexio-card [header]=\"true\"\n                [footer]=\"false\"\n                [show]=\"true\"\n                [footer-align]=\"'right'\"\n                [body-height]=\"80\">\n                    <amexio-header>\n                     Help Document\n                    </amexio-header>\n                    <amexio-body>\n                    </amexio-body>\n                </amexio-card>\n                </ng-container>\n  </amexio-column>\n  <amexio-dialogue [show-dialogue]=\"confirmdialogue\"\n               [title]=\"'Confirm'\"\n               [message]=\"'Do you want to view created project status?'\"\n               [message-type]=\"'confirm'\"\n               [type]=\"'confirm'\"\n               (actionStatus)=\"checkStatus($event)\">\n</amexio-dialogue>\n\n<project-notification></project-notification>\n   \n</amexio-row>\n\n  "
                },] },
    ];
    /** @nocollapse */
    CreateProjectComponent.ctorParameters = function () { return [
        { type: HttpClient, },
        { type: LocalStorageService, },
        { type: CookieService, },
        { type: LoaderService, },
        { type: MessagingService, },
        { type: NotificationService, },
        { type: ActivatedRoute, },
        { type: Router, },
        { type: ChangeDetectorRef, },
    ]; };
    return CreateProjectComponent;
}());
var ProjectCreationModel = (function () {
    function ProjectCreationModel() {
        this.projectDescription = '';
        this.projectName = '';
        this.themeUUID = '6FF7B738-EE02-4367-9168-FD5327E3FCBB';
    }
    return ProjectCreationModel;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ProjectNotificationComponent = (function () {
    function ProjectNotificationComponent(_notificationService) {
        this._notificationService = _notificationService;
    }
    /**
     * @return {?}
     */
    ProjectNotificationComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () { };
    ProjectNotificationComponent.decorators = [
        { type: Component, args: [{
                    selector: 'project-notification',
                    template: "\n  <amexio-notification\n        [data]=\"_notificationService.errorData\"\n        [vertical-position]=\"'top'\"\n        [horizontal-position]=\"'right'\"\n        [close-on-escape] =\"true\"\n        [background-color]=\"'red'\"\n        [auto-dismiss-msg]=\"true\"\n        [auto-dismiss-msg-interval]=\"6000\">\n        <ng-template #amexioNotificationTemp let-data=\"data\" >\n            <amexio-box [box-width]=\"'300px'\">\n              <amexio-image [icon-class]=\"'\tfa fa-times-circle-o'\" style=\"font-size: 25px;\">\n              </amexio-image>\n           \n              <amexio-label font-color=\"white\">{{_notificationService.title}}</amexio-label><br/>            \n              <amexio-label font-color=\"white\" *ngFor=\"let msgObj of data.data\" >{{msgObj}}</amexio-label><br/>\n            </amexio-box>\n        </ng-template>\n      </amexio-notification>\n<amexio-notification\n        [data]=\"_notificationService.successData\"\n        [vertical-position]=\"'top'\"\n        [horizontal-position]=\"'right'\"\n        [close-on-escape] =\"true\"\n        [background-color]=\"'green'\"\n        [auto-dismiss-msg]=\"true\"\n        [auto-dismiss-msg-interval]=\"6000\">\n        <ng-template #amexioNotificationTemp let-data=\"data\" >\n           <amexio-box [box-width]=\"'375px'\">\n              <amexio-image [icon-class]=\"'\tfa fa-check'\" style=\"font-size: 25px;\">\n              </amexio-image>\n              <amexio-label font-color=\"white\" >{{data}}</amexio-label><br/>\n          </amexio-box>\n        </ng-template>\n      </amexio-notification>\n    <amexio-notification\n        [data]=\"_notificationService.warningData\"\n        [vertical-position]=\"'top'\"\n        [horizontal-position]=\"'right'\"\n        [close-on-escape] =\"true\"\n        [background-color]=\"'orange'\"\n        [foreground-color]=\"'black'\"\n        [auto-dismiss-msg]=\"true\"\n        [auto-dismiss-msg-interval]=\"6000\">\n        <ng-template #amexioNotificationTemp let-data=\"data\" >\n          <amexio-box [box-width]=\"'350px'\">\n              <amexio-image [icon-class]=\"'\tfa fa-exclamation-triangle'\" style=\"font-size: 25px;\">\n              </amexio-image> \n          \n              <amexio-label font-color=\"white\" >{{data}}</amexio-label><br/>\n            </amexio-box>\n        </ng-template>\n      </amexio-notification>\n\n      <amexio-notification\n        [data]=\"_notificationService.infoData\"\n        [vertical-position]=\"'top'\"\n        [horizontal-position]=\"'right'\"\n        [close-on-escape] =\"true\"\n        [background-color]=\"'yellow'\"\n        [foreground-color]=\"'black'\"\n        [auto-dismiss-msg]=\"true\"\n        [auto-dismiss-msg-interval]=\"6000\">\n        <ng-template #amexioNotificationTemp let-data=\"data\" >\n          <amexio-box [box-width]=\"'350px'\" >\n            <amexio-image [icon-class]=\"'\tfa fa-info-circle fa-2x'\" >\n            </amexio-image>\n            <amexio-label size=\"small-bold\" font-color=\"black\">{{data}}</amexio-label>\n          </amexio-box>\n        </ng-template>\n      </amexio-notification>\n"
                },] },
    ];
    /** @nocollapse */
    ProjectNotificationComponent.ctorParameters = function () { return [
        { type: NotificationService, },
    ]; };
    return ProjectNotificationComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var TabcodeComponent = (function () {
    function TabcodeComponent(http$$1) {
        this.http = http$$1;
    }
    /**
     * @return {?}
     */
    TabcodeComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () { };
    /**
     * @return {?}
     */
    TabcodeComponent.prototype.getIpAddress = /**
     * @return {?}
     */
    function () {
        return this.http.post('/api/pipeline/Instance/getHostDetails', {});
    };
    /**
     * @param {?} data
     * @param {?} publicIpAddress
     * @param {?} protocol
     * @return {?}
     */
    TabcodeComponent.prototype.getFileDataBtnClick = /**
     * @param {?} data
     * @param {?} publicIpAddress
     * @param {?} protocol
     * @return {?}
     */
    function (data, publicIpAddress, protocol) {
        var _this = this;
        this.publicIpAddress = publicIpAddress;
        this.protocol = protocol;
        //back end data comes on child click.
        if (!data.children) {
            var /** @type {?} */ appUrl = 'protocol://host:9870/projectExplorer/findSourceCode';
            if (this.publicIpAddress) {
                appUrl = appUrl.replace('host', this.publicIpAddress);
                appUrl = appUrl.replace('protocol', this.protocol);
            }
            else {
                appUrl = appUrl.replace('host', 'localhost');
                appUrl = appUrl.replace('protocol', this.protocol);
            }
            if (data.leaf) {
                var /** @type {?} */ filedata_1;
                var /** @type {?} */ sourcePathJSON = {};
                sourcePathJSON['sourcePath'] = data.sourcePath;
                this.http.post(appUrl, sourcePathJSON).subscribe(function (res) {
                    filedata_1 = res;
                }, function (err) {
                    console.log('Error occured');
                }, function () {
                    var /** @type {?} */ responseData = JSON.parse(filedata_1.response);
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
    /**
     * @return {?}
     */
    TabcodeComponent.prototype.resetFlag = /**
     * @return {?}
     */
    function () {
        this.isHtml = false;
        this.isTypeScript = false;
        this.isJson = false;
        this.isCss = false;
    };
    TabcodeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'tab-code',
                    template: "\n  <div *ngIf=\"!sourceCode\" class=\"loadingnav\">\n\n  -  </div>\n  <amexio-label size=\"'small'\">\n\n              <ng-container *ngIf=\"sourceCode\">\n                <ng-container *ngIf=\"isCss\">\n                  <prism-block [code]=\"sourceCode\" [language]=\"'css'\"></prism-block>\n                </ng-container>\n                <ng-container *ngIf=\"isHtml\">\n                  <prism-block [code]=\"sourceCode\" [language]=\"'html'\"></prism-block>\n                </ng-container>\n                <ng-container *ngIf=\"isTypeScript\">\n                  <prism-block [code]=\"sourceCode\" [language]=\"'typescript'\"></prism-block>\n                </ng-container>\n                <ng-container *ngIf=\"isJson\">\n                  <prism-block [code]=\"sourceCode\" [language]=\"'json'\"></prism-block>\n                </ng-container>\n              </ng-container>\n            </amexio-label>\n"
                },] },
    ];
    /** @nocollapse */
    TabcodeComponent.ctorParameters = function () { return [
        { type: HttpClient, },
    ]; };
    TabcodeComponent.propDecorators = {
        "sourceCode": [{ type: Input },],
        "isHtml": [{ type: Input },],
        "isJson": [{ type: Input },],
        "isTypeScript": [{ type: Input },],
        "isCss": [{ type: Input },],
        "publicIpAddress": [{ type: Input },],
        "protocol": [{ type: Input },],
    };
    return TabcodeComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var CodeExplorerComponent = (function () {
    function CodeExplorerComponent(http$$1, cookie, _notificationService, cdf, componentFactoryResolver) {
        this.http = http$$1;
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
    /**
     * @return {?}
     */
    CodeExplorerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.gethostdeatils();
    };
    /**
     * @return {?}
     */
    CodeExplorerComponent.prototype.gethostdeatils = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ responsedata;
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
    /**
     * @return {?}
     */
    CodeExplorerComponent.prototype.createInvalidCompErrorData = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ errorData = [];
        var /** @type {?} */ errorObj = {};
        errorObj['data'] = [];
        errorObj.data = this.inValidMessageData;
        errorData.push(errorObj);
        this._notificationService.showerrorData('Invalid Component', errorData);
    };
    /**
     * @return {?}
     */
    CodeExplorerComponent.prototype.createErrorData = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ errorData = [];
        var /** @type {?} */ errorObj = {};
        errorObj['data'] = [];
        errorObj.data = this.inValidMessageData;
        errorData.push(errorObj);
        this._notificationService.showerrorData('Error Message', errorData);
    };
    /*````````````````````````````````````````````````UNSTAGE DATA TREE OPRATION*/
    /**
     * @param {?} data
     * @return {?}
     */
    CodeExplorerComponent.prototype.getUnstagedClickData = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
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
    /**
     * @param {?} data
     * @return {?}
     */
    CodeExplorerComponent.prototype.onOneFileToStage = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        this.removeUnstageData();
        this.unStageFileSelected.forEach(function (obj) {
            obj.checked = false;
            _this.stageDataTree.push(obj);
        });
        this.unStageFileSelected = [];
    };
    /**
     * @return {?}
     */
    CodeExplorerComponent.prototype.removeUnstageData = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ localArray = [];
        this.unstagedTreeData.forEach(function (objUnstage, index) {
            if (!objUnstage.checked) {
                localArray.push(objUnstage);
            }
        });
        this.unstagedTreeData = localArray;
    };
    /**
     * @param {?} data
     * @return {?}
     */
    CodeExplorerComponent.prototype.onAllFileToStage = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
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
    /**
     * @param {?} data
     * @return {?}
     */
    CodeExplorerComponent.prototype.getStageDataClick = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
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
    /**
     * @param {?} data
     * @return {?}
     */
    CodeExplorerComponent.prototype.onSelectedReturnToUnstage = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
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
    /**
     * @return {?}
     */
    CodeExplorerComponent.prototype.removeFormStageData = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ localArray = [];
        this.stageDataTree.forEach(function (objUnstage, index) {
            if (!objUnstage.checked) {
                localArray.push(objUnstage);
            }
        });
        this.stageDataTree = localArray;
    };
    /**
     * @return {?}
     */
    CodeExplorerComponent.prototype.onAllReturnToUnstage = /**
     * @return {?}
     */
    function () {
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
    /**
     * @return {?}
     */
    CodeExplorerComponent.prototype.resetFlag = /**
     * @return {?}
     */
    function () {
        this.isHtml = false;
        this.isTypeScript = false;
        this.isJson = false;
        this.isCss = false;
    };
    // PRISM TREE DATA CLEARING BUTTON CLICK
    /**
     * @return {?}
     */
    CodeExplorerComponent.prototype.clearPrismDisplayData = /**
     * @return {?}
     */
    function () {
        this.sourceCode = '';
        //this.unableToConnectDialogue = true;
    };
    //Add Tab
    /**
     * @param {?} sourcetab
     * @param {?} data
     * @return {?}
     */
    CodeExplorerComponent.prototype.checkActiveTab = /**
     * @param {?} sourcetab
     * @param {?} data
     * @return {?}
     */
    function (sourcetab, data) {
        var /** @type {?} */ title = data.text;
        if (!data.children && !sourcetab.setActiveTab(data.text)) {
            this.addTab(sourcetab, data);
        }
    };
    /**
     * @param {?} sourcetab
     * @param {?} data
     * @return {?}
     */
    CodeExplorerComponent.prototype.addTab = /**
     * @param {?} sourcetab
     * @param {?} data
     * @return {?}
     */
    function (sourcetab, data) {
        if (!data.children) {
            this.tabcount++;
            var /** @type {?} */ title = data.text;
            this.openTabData.push(data);
            var /** @type {?} */ cmp_1 = sourcetab.addDynamicTab(title, 'black', true, TabcodeComponent);
            if (data) {
                var /** @type {?} */ responsedata_1;
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
    /**
     * @return {?}
     */
    CodeExplorerComponent.prototype.onRefreshClick = /**
     * @return {?}
     */
    function () {
        this.getSourceCodeTreeData();
    };
    //Method to get Source Code FROM BACKEND AND USE FOR THE TREE STRUCTURE DATA DISPLAY
    /**
     * @return {?}
     */
    CodeExplorerComponent.prototype.getSourceCodeTreeData = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.inValidMessageData = [];
        // this.fileDataFromBack = false;
        // let appUrl = 'http://host:8080/code-pipeline-service/projectExplorer/explorer';
        var /** @type {?} */ appUrl = 'protocol://host:9870/projectExplorer/explorer';
        if (this.publicIpAddress) {
            appUrl = appUrl.replace('host', this.publicIpAddress);
            appUrl = appUrl.replace('protocol', this.protocol);
        }
        else {
            appUrl = appUrl.replace('host', 'localhost');
            appUrl = appUrl.replace('protocol', this.protocol);
            
        }
        var /** @type {?} */ filedata;
        var /** @type {?} */ tokenId = this.cookie.get('tokenid');
        var /** @type {?} */ headers = new HttpHeaders({ tokenid: tokenId });
        var /** @type {?} */ httpOptions = { headers: headers };
        this.http.get(appUrl, httpOptions).subscribe(function (res) {
            filedata = res;
        }, function (err) {
            _this.inValidMessageData = [];
            _this.inValidMessageData.push('Unable To Connect Server');
            _this.createErrorData();
        }, function () {
            if (filedata.response) {
                var /** @type {?} */ responsedata = void 0;
                responsedata = JSON.parse(filedata.response);
                _this.fileStructuredata = {
                    children: []
                };
                _this.fileStructuredata = responsedata.children;
            }
        });
    };
    // CLOSE DIALOGUE BOX
    /**
     * @return {?}
     */
    CodeExplorerComponent.prototype.closeDialogue = /**
     * @return {?}
     */
    function () {
        this.showErrorDialogue = false;
    };
    /**
     * @return {?}
     */
    CodeExplorerComponent.prototype.treeOfUnstagedData = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ responseData;
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
    CodeExplorerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'code-explorer',
                    template: "\n    <amexio-row>\n      <amexio-column [size]=\"3\">\n        <amexio-card [header]=\"false\" [footer]=\"false\" [show]=\"true\" [header-align]=\"'center'\" [body-height]=\"80\"\n                     [footer-align]=\"'right'\">\n\n          <amexio-body>\n          <amexio-tab-view [action]=\"true\" [body-height]=\"80\">\n          <amexio-tab-action>\n                 <amexio-image style=\"cursor:pointer;\" [icon-class]=\"'fa fa-refresh fa-lg'\" [tooltip]=\"'Refresh'\" (onClick)=\"onRefreshClick()\"></amexio-image>\n          </amexio-tab-action>\n          <amexio-tab title=\"Source Code\" [active]=\"true\" [icon]=\"'fa fa-file-o'\">\n              <amexio-treeview [data-reader]=\"'children'\" [data]=\"fileStructuredata\" (nodeClick)=\"checkActiveTab(sourcetab,$event)\"></amexio-treeview>\n          </amexio-tab>\n           \n             </amexio-tab-view>\n          </amexio-body>\n        </amexio-card>\n      </amexio-column>\n      <amexio-column [size]=\"9\">\n        <amexio-card [body-height]=\"80\" [header]=\"false\" [footer]=\"false\" [show]=\"true\" [header-align]=\"'left'\">\n\n        <amexio-body>\n\n              <amexio-tab-view #sourcetab [closable]=\"true\" [tab-position]=\"'top'\" [header-align]=\"'left'\" [body-height]=\"80\">\n</amexio-tab-view>\n          </amexio-body>\n        </amexio-card>\n\n      </amexio-column>\n        \n <project-notification></project-notification>\n\n    <amexio-dialogue [show-dialogue]=\"showErrorDialogue\" (close)=\"closeDialogue()\" [custom]=\"true\"\n                     [title]=\"'Error Message'\" [type]=\"'confirm'\">\n      <amexio-body>\n        <div *ngFor=\"let data of inValidMessageData\">\n          <li style=\"text-align: left\">{{data}}</li>\n        </div>\n      </amexio-body>\n      <amexio-action>\n        <amexio-button type=\"primary\" (onClick)=\"closeDialogue()\" [label]=\"'Ok'\"></amexio-button>\n      </amexio-action>\n    </amexio-dialogue>\n    </amexio-row>\n          ",
                    styles: [
                        "\n      .panel-panel {\n        height: 488px !important;\n      }\n    "
                    ]
                },] },
    ];
    /** @nocollapse */
    CodeExplorerComponent.ctorParameters = function () { return [
        { type: HttpClient, },
        { type: CookieService, },
        { type: NotificationService, },
        { type: ChangeDetectorRef, },
        { type: ComponentFactoryResolver, },
    ]; };
    return CodeExplorerComponent;
}());

//((git|ssh|http(s)?)|(git@[\w\.]+))(:(//)?)([\w\.@\:/\-~]+)(\.git)(/)?

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Created by dattaram on 10/4/18.
 */
var PrismComponent = (function () {
    function PrismComponent(_renderer, _el) {
        this._renderer = _renderer;
        this._el = _el;
        this.nativeElement = _el.nativeElement;
    }
    /**
     * @return {?}
     */
    PrismComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.preNode = this._renderer.createElement('pre');
        this.codeNode = this._renderer.createElement('code');
        this._renderer.addClass(this.codeNode, 'language-' + this.language);
        this._renderer.appendChild(this.nativeElement, this.preNode);
        this._renderer.appendChild(this.preNode, this.codeNode);
        this.codeNode.textContent = this.code;
        Prism.highlightElement(this.codeNode);
    };
    PrismComponent.decorators = [
        { type: Component, args: [{
                    selector: 'prism-block',
                    template: ""
                },] },
    ];
    /** @nocollapse */
    PrismComponent.ctorParameters = function () { return [
        { type: Renderer2, },
        { type: ElementRef, },
    ]; };
    PrismComponent.propDecorators = {
        "code": [{ type: Input },],
        "language": [{ type: Input },],
    };
    return PrismComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var routes = [
    {
        path: 'create',
        component: CreateProjectComponent
    },
    {
        path: 'code-explorer',
        component: CodeExplorerComponent
    }
];
var ProjectMsUIModule = (function () {
    function ProjectMsUIModule() {
    }
    /**
     * @return {?}
     */
    ProjectMsUIModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: ProjectMsUIModule,
            providers: []
        };
    };
    ProjectMsUIModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        AmexioWidgetModule,
                        AmexioPaneModule,
                        AmexioFormsModule,
                        HttpClientModule,
                        PlatformCommmonsModule.forRoot(),
                        RouterModule.forChild(routes)
                    ],
                    entryComponents: [TabcodeComponent],
                    declarations: [
                        CreateProjectComponent,
                        ProjectNotificationComponent,
                        CodeExplorerComponent,
                        TabcodeComponent,
                        PrismComponent
                    ],
                    exports: [
                        CreateProjectComponent,
                        ProjectNotificationComponent,
                        CodeExplorerComponent,
                        TabcodeComponent,
                        PrismComponent
                    ]
                },] },
    ];
    return ProjectMsUIModule;
}());

export { ProjectMsUIModule, CreateProjectComponent, ProjectCreationModel, ProjectNotificationComponent, CodeExplorerComponent, PrismComponent };
