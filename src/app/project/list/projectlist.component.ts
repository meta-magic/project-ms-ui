import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  projectList: any;
  constructor(private http: HttpClient) {}
  ngOnInit() {}
  getProjectList() {
    let projectDataList: any;

    this.http.get('/api/project/project/findByProjectOwner').subscribe(
      response => {
        projectDataList = response;
      },
      error => {},
      () => {
        this.projectList = projectDataList;
      }
    );
  }
}
