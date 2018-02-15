import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'project-list',
  template: `
    
  <amexio-button [label]="'New project'"
    [type]="'danger'"
    [tooltip]="'New project'" >
  </amexio-button>
  
  Available Projects
  <ul>
    <li>Project One</li>
    <li>Project Two</li>
    <li>Project Three</li>
  </ul>
  `
})
export class ProjectListComponent implements OnInit {
  ngOnInit() {}
}
