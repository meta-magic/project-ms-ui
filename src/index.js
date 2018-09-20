"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var amexio_ng_extensions_1 = require("amexio-ng-extensions");
var http_1 = require("@angular/common/http");
var platform_commons_1 = require("platform-commons");
var createproject_component_1 = require("./app/project/create/createproject.component");
var notification_component_1 = require("./app/project/notification.component");
var tabcode_component_1 = require("./app/project/code-explorer/tabcode.component");
var code_explorer_component_1 = require("./app/project/code-explorer/code-explorer.component");
var prism_component_1 = require("./app/prism/prism.component");
__export(require("./app/project/create/createproject.component"));
__export(require("./app/project/notification.component"));
__export(require("./app/project/code-explorer/code-explorer.component"));
__export(require("./app/prism/prism.component"));
var routes = [
    {
        path: 'create',
        component: createproject_component_1.CreateProjectComponent
    },
    {
        path: 'code-explorer',
        component: code_explorer_component_1.CodeExplorerComponent
    }
];
var ProjectMsUIModule = ProjectMsUIModule_1 = (function () {
    function ProjectMsUIModule() {
    }
    ProjectMsUIModule.forRoot = function () {
        return {
            ngModule: ProjectMsUIModule_1,
            providers: []
        };
    };
    return ProjectMsUIModule;
}());
ProjectMsUIModule = ProjectMsUIModule_1 = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            amexio_ng_extensions_1.AmexioWidgetModule,
            amexio_ng_extensions_1.AmexioPaneModule,
            amexio_ng_extensions_1.AmexioFormsModule,
            http_1.HttpClientModule,
            platform_commons_1.PlatformCommmonsModule.forRoot(),
            router_1.RouterModule.forChild(routes)
        ],
        entryComponents: [tabcode_component_1.TabcodeComponent],
        declarations: [
            createproject_component_1.CreateProjectComponent,
            notification_component_1.ProjectNotificationComponent,
            code_explorer_component_1.CodeExplorerComponent,
            tabcode_component_1.TabcodeComponent,
            prism_component_1.PrismComponent
        ],
        exports: [
            createproject_component_1.CreateProjectComponent,
            notification_component_1.ProjectNotificationComponent,
            code_explorer_component_1.CodeExplorerComponent,
            tabcode_component_1.TabcodeComponent,
            prism_component_1.PrismComponent
        ]
    })
], ProjectMsUIModule);
exports.ProjectMsUIModule = ProjectMsUIModule;
var ProjectMsUIModule_1;
