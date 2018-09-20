/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { ProjectMsUIModule }  from 'project-ms-ui';
import {RouterModule} from  '@angular/router';
import { AmexioWidgetModule } from  'amexio-ng-extensions';

@Component({
  selector: 'app',
  template: `<router-outlet></router-outlet>`
})
class AppComponent {}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, RouterModule, ProjectMsUIModule, AmexioWidgetModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
