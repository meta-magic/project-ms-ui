import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'platform-commons';
import { CookieService } from 'platform-commons';
import { MessagingService } from 'platform-commons';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'project-create',
  template: `
  <amexio-row>
    <amexio-column [size]="3">
    <amexio-card [header]="false" [footer]="true" [footer-align]="'right'"
  [body-height]="82">
  
    <amexio-body>
     <amexio-listbox [enable-checkbox]="false"
                [header]="'Projects'"
                [search-placeholder]="'Search Project'"
                [data]="projectList"
                [filter]="true"
                [data-reader]="'response'"
                [display-field]="'projectName'"
                (onRowClick)="onProjectSelect($event)">
</amexio-listbox>
</amexio-body>
<amexio-action>
 <amexio-button
    [label]="'New'"
    [type]="'secondary'"
    [tooltip]="'New'"
    [size]="'default'" 
    [icon]="'fa fa-plus fa-lg'"
    (onClick)="findInstance()">
    </amexio-button>
</amexio-action>
</amexio-card>
    </amexio-column>
  <amexio-column [size]="9">
  <ng-container *ngIf="showCard">
  <amexio-card [header]="true" [footer]="true" [footer-align]="'right'"
  [body-height]="82">
    <amexio-header>
             Project Creation          
    </amexio-header>
    <amexio-body>
      <amexio-row>
        <amexio-column [size]="6">
          <amexio-text-input [(ngModel)]="projectCreationModel.projectName" [field-label]="'Name'" name ="projectCreationModel.projectName"
                            [place-holder]="'Enter Name'"
                            [icon-feedback]="true"
                            [disabled]="disblefields">
          </amexio-text-input>
        </amexio-column>
        <amexio-column [size]="6">
          <amexio-textarea-input [field-label]="'Description'" name ="projectCreationModel.projectDescription"
                          [place-holder]="'Enter Description'"
                          [icon-feedback]="true"
                           [rows]="'1'"
                           [columns]="'1'"
                          [disabled]="disblefields"
                          [(ngModel)]="projectCreationModel.projectDescription">
          </amexio-textarea-input>
        </amexio-column>   
<ng-container *ngIf="!portDisableFlag">
         <amexio-column [size]="12">

         Server Port:{{serverPort}}
        </amexio-column>   
                </ng-container>

        <amexio-column [size]="6">
       
       
        <amexio-radio-group
           [field-label]="'Amexio Themes'"
           name ="projectCreationModel.themeUUID"
           [display-field]="'themesName'"
           [value-field]="'themeUUID'"
           [data]="amexioThemes"
           [disabled]="disblefields"
           [default-value]="projectCreationModel.themeUUID"
           (onSelection)="setTheme($event)">
        </amexio-radio-group>
      
        </amexio-column>  
        <amexio-column [size]="6">
        <amexio-radio-group
           [field-label]="'Material Themes'"
           name ="projectCreationModel.themeUUID"
           [display-field]="'themesName'"
           [value-field]="'themeUUID'"
           [data]="materialthemes"
           [disabled]="disblefields"
           [default-value]="projectCreationModel.themeUUID"
           (onSelection)="setTheme($event)">
        </amexio-radio-group>
        </amexio-column>  
        
      </amexio-row>
    </amexio-body>
    <amexio-action>
     <amexio-button
    [label]="'Cancel'"
    [type]="'secondary'"
    [tooltip]="'Cancel'"
    [size]="'default'" 
    [icon]="'fa fa-close'" 
    [disabled]="disableBtn"
    (onClick)="cancelProject()">
    </amexio-button>
    <amexio-button
    [label]="'Save'"
    [loading]="asyncFlag"
    [type]="'primary'"
    [tooltip]="'Save'"
    [size]="'default'"
    [icon]="'fa fa-save'"  
    [disabled]="disableBtn"
    (onClick)="saveProject()">
    </amexio-button>
    </amexio-action>    
  </amexio-card>
  </ng-container>
   <ng-container *ngIf="!showCard">
                <amexio-card [header]="true"
                [footer]="false"
                [show]="true"
                [footer-align]="'right'"
                [body-height]="82">
                    <amexio-header>
                     Help Document
                    </amexio-header>
                    <amexio-body>
                    </amexio-body>
                </amexio-card>
                </ng-container>
  </amexio-column>
  <amexio-dialogue [show-dialogue]="confirmdialogue"
               [title]="'Confirm'"
               [message]="'Do you want to view created project status?'"
               [message-type]="'confirm'"
               [type]="'confirm'"
               (actionStatus)="checkStatus($event)">
</amexio-dialogue>
   <amexio-notification 
   [data]="msgData"
   [vertical-position]="'top'"
   [horizontal-position]="'right'"
   [auto-dismiss-msg]="true"
   [auto-dismiss-msg-interval]="7000">
</amexio-notification>
<amexio-dialogue [show-dialogue]="isValidateForm" [message-type]="'error'" [closable]="true" [title]="'Error'" [type]="'alert'" [custom]="true" (close)="isValidateForm = !isValidateForm">
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
</amexio-row>
  
  `
})
export class CreateProjectComponent implements OnInit {
  projectCreationModel: ProjectCreationModel;
  asyncFlag: boolean = false;
  serverPort: any;
  newTokenid: string;
  msgData: any = [];
  // projectUUID: string;
  validationMsgArray: any = [];
  isValidateForm: boolean = false;
  portDisableFlag: boolean = true;
  themes: any;
  amexioThemes: any;
  materialthemes: any;
  projectList: any;
  showCard: boolean = false;
  projectId: string;
  disblefields: boolean = false;
  disableBtn: boolean = false;
  confirmdialogue: boolean;
  constructor(
    private http: HttpClient,
    private ls: LocalStorageService,
    private cookieService: CookieService,
    private msgService: MessagingService,
    private route: ActivatedRoute,
    private _route: Router
  ) {
    this.projectCreationModel = new ProjectCreationModel();
    this.themes = [];
    this.amexioThemes = [];
    this.materialthemes = [];
    this.getThemeData();
    this.getProjectList();
  }

  ngOnInit() {}

  //GET PROJECT LIST
  getProjectList() {
    let projectDataList: any;

    this.http.get('/api/project/project/findByProjectOwner').subscribe(
      response => {
        projectDataList = response;
      },
      error => {
        this.validationMsgArray.push('Unable to connect to server');
        this.isValidateForm = true;
      },
      () => {
        if (projectDataList.success) {
          this.projectList = projectDataList;
        } else {
          this.validationMsgArray.push(projectDataList.errorMessage);
          this.isValidateForm = true;
        }
      }
    );
  }

  openProjectUi() {
    this.showCard = true;
    this.portDisableFlag = true;
    this.disableBtn = false;
    this.disblefields = false;
    this.projectCreationModel = new ProjectCreationModel();
  }

  //GET PROJECT DETAILS OF SELECTED PROJECT IN READ ONLY FORM
  onProjectSelect(event: any) {
    let selectProject: any;
    this.projectCreationModel = new ProjectCreationModel();
    const projectUUID = event.projectUUID;
    this.http
      .get('/api/project/project/selectProject?projectUUID=' + projectUUID)
      .subscribe(
        response => {
          selectProject = response;
        },
        err => {
          this.validationMsgArray.push('Unable to connect to server');
          this.isValidateForm = true;
        },
        () => {
          if (selectProject.success) {
            this.showCard = true;
            this.projectId = selectProject.response.projectUUID;
            this.projectCreationModel.projectName =
              selectProject.response.projectName;
            this.projectCreationModel.projectDescription =
              selectProject.response.projectDescription;
            this.projectCreationModel.themeUUID =
              selectProject.response.themeUUID;
            this.serverPort = selectProject.response.serverPort;
            this.portDisableFlag = false;
            this.newTokenid = selectProject.response.newtokenId;
            this.cookieService.set('tokenid', this.newTokenid);
            this.msgService.sendMessage({ projectId: this.projectId });
            this.disableBtn = true;
            this.disblefields = true;
          } else {
            this.validationMsgArray.push(selectProject.errorMessage);
            this.isValidateForm = true;
          }
        }
      );
  }

  //Set Theme
  setTheme(themeData: any) {
    this.projectCreationModel.themeUUID = themeData.themeUUID;
  }

  //Validate Form Fields
  validateFormFields() {
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

  //To close Window
  okErrorBtnClick() {
    this.isValidateForm = false;
    this.validationMsgArray = [];
  }

  //Reset Project Data
  cancelProject() {
    this.projectCreationModel = new ProjectCreationModel();
  }

  //To Save Project Details
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

  //Save Method to create Project
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
          this.projectId = response.response.projectUUID;
          this.cookieService.set('tokenid', this.newTokenid);
          this.asyncFlag = false;
          this.msgData.push(response.successMessage);
          this.clearData();
          this.getProjectList();
          this.msgService.sendMessage({ projectId: this.projectId });
          this.showtask();
        } else {
          if (response.errorMessage == null) {
            this.validationMsgArray.push(response.errors);
            this.isValidateForm = true;
            this.asyncFlag = false;
          } else {
            this.validationMsgArray.push(response.errorMessage);
            this.isValidateForm = true;
            this.asyncFlag = false;
          }
        }
      }
    );
  }
  showtask() {
    this.confirmdialogue = !this.confirmdialogue;
  }
  checkStatus(data: any) {
    if (data === 'ok') {
      this._route.navigate(['home/codepipeline/task-ui']);
    }
  }

  findInstance() {
    let instanceresponse: any;
    this.http.post('/api/pipeline/Instance/validateUserInstance', {}).subscribe(
      res => {
        instanceresponse = res;
      },
      err => {
        this.validationMsgArray.push('Unable to connect to server');
        this.isValidateForm = true;
      },
      () => {
        if (instanceresponse.success) {
          this.openProjectUi();
        } else {
          this.validationMsgArray.push(
            'User instance not in a running state, start instance from Instance Management Screen.'
          );
          this.isValidateForm = true;
        }
      }
    );
  }

  clearData() {
    this.projectCreationModel = new ProjectCreationModel();
  }

  // To Fetch Theme Data from DB
  getThemeData() {
    let response: any;
    this.http.get('/api/project/themes/findAll').subscribe(
      res => {
        response = res;
      },
      err => {
        // this.validationMsgArray.push('Unable to connect to server');
        // this.isValidateForm = true;
        this.asyncFlag = false;
      },
      () => {
        if (response.success) {
          this.themes = response.response;
          this.iterateData(this.themes);
        } else if (!response.success && response.errors) {
          this.validationMsgArray.push(response.errorMessage);
        }
      }
    );
  }

  iterateData(themes: any) {
    themes.forEach((obj: any) => {
      if (obj.themeType == '1') {
        const obj1 = {
          themeUUID: obj.themeUUID,
          themesName: obj.themesName,
          themesDescription: obj.themesDescription,
          themeType: obj.themeType
        };
        this.amexioThemes.push(obj1);
      } else {
        const obj2 = {
          themeUUID: obj.themeUUID,
          themesName: obj.themesName,
          themesDescription: obj.themesDescription,
          themeType: obj.themeType
        };
        this.materialthemes.push(obj2);
      }
    });
  }
}
export class ProjectCreationModel {
  projectName: string;
  projectDescription: string;
  themeUUID: any;

  constructor() {
    this.projectDescription = '';
    this.projectName = '';
    this.themeUUID = null;
  }
}
