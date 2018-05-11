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
import { ProjectListComponent } from './app/project/list/projectlist.component';
import { CodeExplorerComponent } from './app/project/code-explorer/code-explorer.component';
import { HttpClientModule } from '@angular/common/http';
import { PlatformCommmonsModule } from 'platform-commons';
import { PrismModule } from './app/prism-module/prism.module';
const routes: Routes = [
  {
    path: 'create',
    component: CreateProjectComponent
  },
  {
    path: 'list',
    component: ProjectListComponent
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
  declarations: [
    CreateProjectComponent,
    ProjectListComponent,
    CodeExplorerComponent
  ],
  exports: [
    RouterModule,
    CreateProjectComponent,
    CodeExplorerComponent,
    ProjectListComponent
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
