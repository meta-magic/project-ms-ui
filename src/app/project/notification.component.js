"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var ProjectNotificationComponent = (function () {
    function ProjectNotificationComponent(_notificationService) {
        this._notificationService = _notificationService;
    }
    ProjectNotificationComponent.prototype.ngOnInit = function () { };
    return ProjectNotificationComponent;
}());
ProjectNotificationComponent = __decorate([
    core_1.Component({
        selector: 'project-notification',
        template: "\n  <amexio-notification\n        [data]=\"_notificationService.errorData\"\n        [vertical-position]=\"'top'\"\n        [horizontal-position]=\"'right'\"\n        [close-on-escape] =\"true\"\n        [background-color]=\"'red'\"\n        [auto-dismiss-msg]=\"true\"\n        [auto-dismiss-msg-interval]=\"6000\">\n        <ng-template #amexioNotificationTemp let-data=\"data\" >\n            <amexio-box [box-width]=\"'300px'\">\n              <amexio-image [icon-class]=\"'\tfa fa-times-circle-o'\" style=\"font-size: 25px;\">\n              </amexio-image>\n           \n              <amexio-label font-color=\"white\">{{_notificationService.title}}</amexio-label><br/>            \n              <amexio-label font-color=\"white\" *ngFor=\"let msgObj of data.data\" >{{msgObj}}</amexio-label><br/>\n            </amexio-box>\n        </ng-template>\n      </amexio-notification>\n<amexio-notification\n        [data]=\"_notificationService.successData\"\n        [vertical-position]=\"'top'\"\n        [horizontal-position]=\"'right'\"\n        [close-on-escape] =\"true\"\n        [background-color]=\"'green'\"\n        [auto-dismiss-msg]=\"true\"\n        [auto-dismiss-msg-interval]=\"6000\">\n        <ng-template #amexioNotificationTemp let-data=\"data\" >\n           <amexio-box [box-width]=\"'375px'\">\n              <amexio-image [icon-class]=\"'\tfa fa-check'\" style=\"font-size: 25px;\">\n              </amexio-image>\n              <amexio-label font-color=\"white\" >{{data}}</amexio-label><br/>\n          </amexio-box>\n        </ng-template>\n      </amexio-notification>\n    <amexio-notification\n        [data]=\"_notificationService.warningData\"\n        [vertical-position]=\"'top'\"\n        [horizontal-position]=\"'right'\"\n        [close-on-escape] =\"true\"\n        [background-color]=\"'orange'\"\n        [foreground-color]=\"'black'\"\n        [auto-dismiss-msg]=\"true\"\n        [auto-dismiss-msg-interval]=\"6000\">\n        <ng-template #amexioNotificationTemp let-data=\"data\" >\n          <amexio-box [box-width]=\"'350px'\">\n              <amexio-image [icon-class]=\"'\tfa fa-exclamation-triangle'\" style=\"font-size: 25px;\">\n              </amexio-image> \n          \n              <amexio-label font-color=\"white\" >{{data}}</amexio-label><br/>\n            </amexio-box>\n        </ng-template>\n      </amexio-notification>\n\n      <amexio-notification\n        [data]=\"_notificationService.infoData\"\n        [vertical-position]=\"'top'\"\n        [horizontal-position]=\"'right'\"\n        [close-on-escape] =\"true\"\n        [background-color]=\"'yellow'\"\n        [foreground-color]=\"'black'\"\n        [auto-dismiss-msg]=\"true\"\n        [auto-dismiss-msg-interval]=\"6000\">\n        <ng-template #amexioNotificationTemp let-data=\"data\" >\n          <amexio-box [box-width]=\"'350px'\" >\n            <amexio-image [icon-class]=\"'\tfa fa-info-circle fa-2x'\" >\n            </amexio-image>\n            <amexio-label size=\"small-bold\" font-color=\"black\">{{data}}</amexio-label>\n          </amexio-box>\n        </ng-template>\n      </amexio-notification>\n"
    })
], ProjectNotificationComponent);
exports.ProjectNotificationComponent = ProjectNotificationComponent;
