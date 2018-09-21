import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';

import { FormsModule } from '@angular/forms';
import {
  AmexioWidgetModule,
  AmexioPaneModule,
  AmexioFormsModule
} from 'amexio-ng-extensions';
import { HttpClientModule } from '@angular/common/http';
import { PlatformCommmonsModule } from 'platform-commons';
import { CreateProjectComponent } from './app/project/create/createproject.component';
import { ProjectNotificationComponent} from './app/project/notification.component';
import { TabcodeComponent } from './app/project/code-explorer/tabcode.component';
import { CodeExplorerComponent } from './app/project/code-explorer/code-explorer.component';
import { PrismComponent } from './app/prism/prism.component';



export * from './app/project/create/createproject.component';
export * from './app/project/notification.component';
export * from './app/project/code-explorer/code-explorer.component';
export * from './app/prism/prism.component';
export * from './app/project/code-explorer/tabcode.component';





const routes: Routes = [
  {
    path: 'create',
    component: CreateProjectComponent
  },
  {
    path: 'code-explorer',
    component: CodeExplorerComponent
  }
];

@NgModule({
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
})
export class ProjectMsUIModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ProjectMsUIModule,
      providers: []
    };
  }
}
