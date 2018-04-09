import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProjectMsUIModule } from '../src';
import { DemoComponent } from './demo.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AmexioWidgetModule } from 'amexio-ng-extensions';
import { RouterModule, Routes } from '@angular/router';
import { CreateProjectComponent } from '../src/app/project/create/createproject.component';
import { ProjectListComponent } from '../src/app/project/list/projectlist.component';
import { CodeExplorerComponent } from '../src/app/project/code-explorer/code-explorer.component';

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
  declarations: [DemoComponent],
  imports: [
    BrowserModule,

    HttpModule,
    FormsModule,
    AmexioWidgetModule,
    ProjectMsUIModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  bootstrap: [DemoComponent]
})
export class DemoModule {}
