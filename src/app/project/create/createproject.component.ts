import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'platform-commons';
import { CookieService } from 'platform-commons';
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
          <amexio-text-input [(ngModel)]="projectCreationModel.projectName" [field-label]="'Name'" name ="projectCreationModel.projectName"
                            [place-holder]="'Enter name'"
                            [icon-feedback]="true">
          </amexio-text-input>
        </amexio-column>
        <amexio-column [size]="6">
          <amexio-text-input [field-label]="'Description'" name ="projectCreationModel.projectDescription"
                          [place-holder]="'Enter project description'"
                          [icon-feedback]="true"
                          [(ngModel)]="projectCreationModel.projectDescription">
          </amexio-text-input>
        </amexio-column>    
        <amexio-column [size]="6">
        <amexio-radio-group
           [field-label]="'Theme'"
           name ="theme"
           [data-reader]="'response'"
           [display-field]="'themesName'"
           [value-field]="'themeUUID'"
           [horizontal]="true"
           [http-method]="'get'"
           [http-url]="'/api/project/themes/findAll'"
           [default-value]="projectCreationModel.themeUUID"  
           (onSelection)="setTheme($event)">
        </amexio-radio-group>
        </amexio-column>  
      </amexio-row>
    </amexio-body>
    <amexio-action>
    <amexio-button
    [label]="'save'"
    [loading]="asyncFlag"
    [type]="'secondary'"
    [tooltip]="'save'" 
    (onClick)="saveProject()">
    </amexio-button>
    </amexio-action>    
  </amexio-card>
   <amexio-notification 
   [data]="msgData"
   [vertical-position]="'top'"
   [horizontal-position]="'right'"
   [auto-dismiss-msg]="true"
   [auto-dismiss-msg-interval]="7000">
</amexio-notification>
<amexio-dialogue [show-dialogue]="isValidateForm" [message-type]="'error'" [closable]="false" [title]="'Error'" [type]="'alert'" [custom]="true">
<amexio-body>
    <ol>
        <li *ngFor="let msgObj of validationMsgArray let index=index">{{msgObj}}</li>
    </ol>
</amexio-body>
<amexio-action>
    <amexio-button type="primary" (onClick)="okErrorBtnClick()" [label]="'Ok'">
    </amexio-button>
</amexio-action>
</amexio-dialogue>

  

  `
})
export class CreateProjectComponent implements OnInit {
  projectCreationModel: ProjectCreationModel;
  asyncFlag: boolean = false;
  newTokenid: string;
  msgData: any = [];
  validationMsgArray: any = [];
  isValidateForm: boolean = false;
  constructor(
    private http: HttpClient,
    private ls: LocalStorageService,
    private cookieService: CookieService
  ) {
    this.projectCreationModel = new ProjectCreationModel();
  }

  ngOnInit() {
    /*  if (localStorage.getItem('project_details')) {
      this.emittProjectSaveEvent(localStorage.getItem('project_details'));
    }*/
  }

  // saveProject(event: any) {
  //   let msg = this.projectname;
  //   const message1 = {
  //     ms_id: 'project_ms',
  //     data: {
  //       name: msg
  //     }
  //   };
  //   localStorage.setItem('project_details', JSON.stringify(message1));
  //   this.emittProjectSaveEvent(JSON.stringify(message1));
  // }

  // emittProjectSaveEvent(string: any) {
  //   window.postMessage(string, window.location.origin);
  // }
  setTheme(themeData: any) {
    this.projectCreationModel.themeUUID = themeData.themeUUID;
  }
  validateFormFields() {
    debugger;
    let isValid: boolean = false;
    this.validationMsgArray = [];
    if (this.projectCreationModel.projectName == '') {
      this.validationMsgArray.push('Invalid (Blank) Project Name.');
    }
    if (this.projectCreationModel.projectDescription == '') {
      this.validationMsgArray.push('Invalid (Blank) Project Description.');
    }
    if (
      this.projectCreationModel.themeUUID == null ||
      this.projectCreationModel.themeUUID == ''
    ) {
      this.validationMsgArray.push('Invalid (Blank) Theme.');
    }
  }
  okErrorBtnClick() {
    this.isValidateForm = false;
    this.validationMsgArray = [];
  }

  saveProject() {
    this.validateFormFields();
    if (this.validationMsgArray && this.validationMsgArray.length >= 1) {
      this.isValidateForm = true;
      return;
    } else {
      this.isValidateForm = false;
      this.saveProjectCreation();
    }
  }
  saveProjectCreation() {
    let response: any;
    this.asyncFlag = true;

    const requestJson = {
      projectName: this.projectCreationModel.projectName,
      projectDescription: this.projectCreationModel.projectDescription,
      themeUUID: this.projectCreationModel.themeUUID
    };
    this.http.post('/api/project/project/save ', requestJson).subscribe(
      res => {
        response = res;
      },
      err => {
        this.validationMsgArray.push('Unable to connect to server');
        this.isValidateForm = true;
        this.asyncFlag = false;
      },
      () => {
        if (response.success) {
          this.newTokenid = response.response.tokenid;
          this.cookieService.set('tokenid', this.newTokenid);
          this.asyncFlag = false;
          this.msgData.push(response.successMessage);
          this.clearData();
        } else if (!response.success && response.errors) {
          this.validationMsgArray.push(response.errorMessage);
          this.asyncFlag = false;
        }
      }
    );
  }

  clearData() {
    this.projectCreationModel = new ProjectCreationModel();
  }
}
export class ProjectCreationModel {
  projectName: string;
  projectDescription: string;
  themeUUID: string;

  constructor() {
    this.projectDescription = '';
    this.projectName = '';
    this.themeUUID = '';
  }
}
