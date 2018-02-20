import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'project-create',
  template: `

  <amexio-card [header]="true" [footer]="true" [footer-align]="'right'">
    <amexio-header>
      Project Create
    </amexio-header>
    <amexio-body>
      <amexio-row>
        <amexio-column [size]="6">
          <amexio-text-input [(ngModel)]="projectname" [field-label]="'Name'" name ="name"
                            [place-holder]="'Enter name'"
                            [icon-feedback]="true">
          </amexio-text-input>
        </amexio-column>
        <amexio-column [size]="6">
          <amexio-text-input [field-label]="'Description'" name ="description"
                          [place-holder]="'Enter project description'"
                          [icon-feedback]="true">
          </amexio-text-input>
        </amexio-column>      
      </amexio-row>
    </amexio-body>
    <amexio-action >
      <amexio-button [label]="'Cancel'" [type]="'secondary'"></amexio-button>
      <amexio-button [label]="'Save'" [type]="'primary'" (onClick)="saveProject($event)"></amexio-button>
    </amexio-action>    
  </amexio-card>
  
  

  `
})
export class CreateProjectComponent implements OnInit {
  projectname = '';

  constructor() {}

  ngOnInit() {
    /*  if (localStorage.getItem('project_details')) {
      this.emittProjectSaveEvent(localStorage.getItem('project_details'));
    }*/
  }

  saveProject(event: any) {
    let msg = this.projectname;
    const message1 = {
      ms_id: 'project_ms',
      data: {
        name: msg
      }
    };
    localStorage.setItem('project_details', JSON.stringify(message1));
    this.emittProjectSaveEvent(JSON.stringify(message1));
  }

  emittProjectSaveEvent(string: any) {
    window.postMessage(string, window.location.origin);
  }
}
