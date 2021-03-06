import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AmexioWidgetModule,
  AmexioPaneModule,
  AmexioFormsModule
} from 'amexio-ng-extensions';
import { RouterModule, Routes } from '@angular/router';
import { CreateProjectComponent } from './app/project/create/createproject.component';
import { NotificationComponent } from './app/project/notification.component';
import { ProjectAppComponent } from './app/project/list/projectapp.component';
import { CodeExplorerComponent } from './app/project/code-explorer/code-explorer.component';
import { TabcodeComponent } from './app/project/code-explorer/tabcode.component';
import { HttpClientModule } from '@angular/common/http';
import { PlatformCommmonsModule } from 'platform-commons';
import { PrismModule } from './app/prism-module/prism.module';
const routes: Routes = [
  {
    path: 'create',
    component: CreateProjectComponent
  },
  {
    path: 'app',
    component: ProjectAppComponent
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
    PlatformCommmonsModule,
    PrismModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [TabcodeComponent],
  declarations: [
    CreateProjectComponent,
    ProjectAppComponent,
    NotificationComponent,
    TabcodeComponent,
    CodeExplorerComponent
  ],
  exports: [RouterModule]
})
export class ProjectMsUIModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ProjectMsUIModule,
      providers: []
    };
  }
}
