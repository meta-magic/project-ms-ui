import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'platform-commons';
import { CookieService } from 'platform-commons';
import { MessagingService } from 'platform-commons';
import { LoaderService } from 'platform-commons';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'project-create',
  template: `
  <amexio-row>
    <amexio-column [size]="3">
   <amexio-form  [header]="false" [show-error]="false" [footer-align]="'right'"  [body-height]="76">
    <amexio-form-body [padding]="'0px'">
     <amexio-listbox [enable-checkbox]="false"
                [header]="'Projects'"
                [search-placeholder]="'Search'"
                [data]="projectList"
                [filter]="true"
                [data-reader]="'response'"
                [display-field]="'projectName'"
                [border]="'none'"
                (onRowClick)="onProjectSelect($event)">
</amexio-listbox>
</amexio-form-body>
<amexio-form-action>
 <amexio-button
    [label]="'New'"
    [type]="'secondary'"
    [tooltip]="'New'"
    [size]="'default'"
    [icon]="'fa fa-plus fa-lg'"
    (onClick)="findInstance()">
    </amexio-button>
</amexio-form-action>
</amexio-form>
    </amexio-column>
  <amexio-column [size]="9">
  <ng-container *ngIf="showCard">
   <div class="loadingnav" *ngIf="loaderService.isLoading"></div>
 <amexio-form #projform [form-name]="'validateForm'" [header]="true" [show-error]="false" [footer-align]="'right'">

    <amexio-form-header>
             Project Creation
    </amexio-form-header>
<amexio-form-body>
                     <amexio-tab-view [closable]="false" (onClick)="onTabClick($event)"  [body-height]="55">
                          <amexio-tab title="Project Configuration" [active]="projecttabFlag">
                           <amexio-row>
        <amexio-column [size]="6">
          <amexio-text-input  [(ngModel)]="projectCreationModel.projectName" [field-label]="'Name'" name ="projectCreationModel.projectName"
                            [place-holder]="'Enter Name'"
                            [enable-popover]="true"
                            [min-length]="3" [max-length]="128"
                             [min-error-msg]="'Minimun 3  characters project name required'"
                             [max-error-msg]="'Maximun 128 characters  project name allowed'"
                            [allow-blank]="false"
                            error-msg="Please enter project name"
                            [icon-feedback]="true"
                            [disabled]="disblefields">
          </amexio-text-input>
        </amexio-column>
        <amexio-column [size]="6">
          <amexio-textarea-input [field-label]="'Description'" name ="projectCreationModel.projectDescription"
                          [place-holder]="'Enter Description'"
                          [icon-feedback]="true"
                           [allow-blank]="false"
                            error-msg="Please enter  project description"
                            [enable-popover]="true"
                           [rows]="'2'"
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
                <amexio-column [size]="12">
         <amexio-label >Material themes</amexio-label>
         </amexio-column>
       </amexio-row>
        <amexio-row>
                <amexio-column [size]="4" *ngFor="let col of materialthemes">
                <div class="proj-ui">
 <amexio-card [header]="true"
                [footer]="false"
                [show]="true"
                [header-align]="left">
            <amexio-header>
            <div *ngIf="showThemeFlag">
            <amexio-radio-group
                name ="projectCreationModel.themeUUID"
                [display-field]="'themesName'"
                [allow-blank]="true"
                [value-field]="'themeUUID'"
                [data]="getThemes(col)"
                [default-value]="projectCreationModel.themeUUID"
                (onSelection)="setTheme(col)" style="display: inline;">
           </amexio-radio-group>
                      </div>
                    </amexio-header>
                    <amexio-body>
                            <amexio-image [path]="'assets/images/theme-icons/'+col.themesIcon"></amexio-image> <br/>
                    </amexio-body>
                </amexio-card>
                </div>
  </amexio-column>
            </amexio-row>
         </amexio-tab>
<amexio-tab title="Source Code Configuration" [active]="sourcetabFlag" [disabled] = "tabdisabledFlag">
<amexio-row>
<amexio-column [size]="6">
 <amexio-radio-group
           [field-label]="'Git Repository Type'"
            [allow-blank]="false"
           name="projectCreationModel.respositoryTypeId"
           [display-field]="'respositoryType'"
           [value-field]="'respositoryTypeId'"
           [horizontal]="true"
           [data-reader]="'response.data'"
           [data]="respositoryTypeData"
           [disabled]="disblefields"
           [default-value]="projectCreationModel.respositoryTypeId"
           >
        </amexio-radio-group>
</amexio-column>
<amexio-column [size]="6">
 <amexio-text-input #rUrl [(ngModel)]="projectCreationModel.repositoryURL" [field-label]="'Git Repository URL'" name ="projectCreationModel.repositoryURL"
                            [place-holder]="'https://github.com/meta-magic/demoapp.git'"
                            [enable-popover]="true"
                            (onBlur)="onBlurCheck(rUrl)"
                            [pattern]="'/((http|https):\/\/)?[A-Za-z0-9\.-]{3,}\.[A-Za-z]{2}/'"
                            [allow-blank]="false"
                            error-msg="Please Enter Repository URL"
                            [icon-feedback]="true">
          </amexio-text-input>
</amexio-column>
<amexio-column [size]="6">
 <amexio-text-input [(ngModel)]="projectCreationModel.repositoryUsername" [field-label]="'User name or email address'" name ="projectCreationModel.repositoryUsername"
                            [place-holder]="'Enter GitHub user name or email address'"
                            [enable-popover]="true"
                            [allow-blank]="false"
                            error-msg="Please enter User name"
                            [icon-feedback]="true"
                            [disabled]="disbleUserFlag">
 </amexio-text-input>
</amexio-column>
<amexio-column [size]="6">
<amexio-password-input
     [enable-popover]="true"
     [field-label]="'Password'"
     name ="newPassword"
     [place-holder]="'Enter GitHub Password'"
     [allow-blank]="false"
     [error-msg] ="' Please Enter New Password'"
     [icon-feedback]="true"
     [(ngModel)]="projectCreationModel.repositoryPassword"
     [disabled]="disbleUserFlag">
</amexio-password-input>
</amexio-column>
</amexio-row>
</amexio-tab>
</amexio-tab-view>
 </amexio-form-body>
   <amexio-form-action>
    <ng-container *ngIf="!showUpadteBtn">
     <amexio-button
    [label]="'Cancel'"
    [type]="'secondary'"
    [tooltip]="'Cancel'"
    [size]="'default'"
    [icon]="'fa fa-close'"
    [disabled]="disableCancelBtn"
    (onClick)="cancelProject()">
    </amexio-button>
    </ng-container>
       <ng-container *ngIf="showNext">
    <amexio-button
    [label]="'Next'"
    [type]="'secondary'"
    [tooltip]="'Next'"
    [disabled]="disableCancelBtn"
    [size]="'default'"
    [icon]="'fa fa-arrow-right'"
    (onClick)="onNextClick(projform)">
    </amexio-button>
    </ng-container>
     <ng-container *ngIf="showUpadteBtn">
    <amexio-button
    [label]="'Update'"
    [loading]="asyncFlag"
    [type]="'primary'"
    [tooltip]="'Update'"
    [disabled]="disableUpdateBtn"
    [size]="'default'"
    [icon]="'fa fa-save'"
    (onClick)="onUpdate()">
    </amexio-button>
     </ng-container>
    <ng-container *ngIf="showSaveBtn">
    <amexio-button
    [label]="'Save'"
    [loading]="asyncFlag"
    [type]="'primary'"
    [tooltip]="'Save'"
    [size]="'default'"
    [icon]="'fa fa-save'"
    [disabled]="disableBtn"
    (onClick)="saveProject(projform)">
    </amexio-button>
    </ng-container>
</amexio-form-action>

 </amexio-form>

  </ng-container>
   <ng-container *ngIf="!showCard">
                <amexio-card [header]="true"
                [footer]="false"
                [show]="true"
                [footer-align]="'right'"
                [body-height]="75">
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
<amexio-dialogue [show-dialogue]="warningdialogue"
               [message-type]="'warning'"
               [closable]="true"
               [custom]="true" (close)="warningdialogue = !warningdialogue"
               [type]="'alert'">
               <amexio-body>
    <ol>
        <li *ngFor="let msgObjone of WarningMsgArray let index=index">{{msgObjone}}</li>
    </ol>
</amexio-body>
<amexio-action>
    <amexio-button type="primary" (onClick)="okWarningBtnClick()" [label]="'Ok'">
    </amexio-button>
</amexio-action>
</amexio-dialogue>
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
  respositoryTypeData: any;
  showCard: boolean = false;
  projectId: string;
  projecttabFlag: boolean = true;
  sourcetabFlag: boolean;
  disblefields: boolean = false;
  disbleUserFlag: boolean;
  showSaveBtn: boolean;
  showUpadteBtn: boolean = false;
  showNext: boolean = true;
  disableBtn: boolean;
  disableCancelBtn: boolean;
  disableUpdateBtn: boolean;
  confirmdialogue: boolean;
  showerrorFlag: boolean = false;
  tabdisabledFlag: boolean = true;

  WarningMsgArray: any = [];
  warningdialogue: boolean = false;
  themeID: any;
  radiogroupData: any;
  showThemeFlag: boolean = true;
  isLoading: boolean = false;
  constructor(
    private http: HttpClient,
    private ls: LocalStorageService,
    private cookieService: CookieService,
    public loaderService: LoaderService,
    private msgService: MessagingService,
    private route: ActivatedRoute,
    private _route: Router,
    private _cdf: ChangeDetectorRef
  ) {
    this.projectCreationModel = new ProjectCreationModel();
    this.themes = [];
    this.amexioThemes = [];
    this.materialthemes = [];
    this.getThemeData();
    this.getProjectList();
    this.respositoryTypeData = {
      response: {
        data: [
          {
            respositoryType: 'Public',
            respositoryTypeId: '1',
            disabled: false
          },
          {
            respositoryType: 'Private',
            respositoryTypeId: '2',
            disabled: true
          }
        ]
      }
    };
  }

  ngOnInit() {}
  getThemes(col: any): any[] {
    let themearray: any = [];
    themearray.push(col);
    return themearray;
  }

  onTabClick(event: any) {
    if (event.title == 'Project Configuration') {
      this.projecttabFlag = true;
      this.sourcetabFlag = false;
      this.showNext = true;
      this.showSaveBtn = false;
    } else {
      this.projecttabFlag = false;
      this.sourcetabFlag = true;
      this.showNext = false;
      this.showSaveBtn = true;
    }
  }

  //GET PROJECT LIST OF LOGGED IN USER
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
    this.disblefields = false;
    this.projecttabFlag = true;
    this.sourcetabFlag = false;
    this.tabdisabledFlag = true;
    this.showUpadteBtn = false;
    this.showNext = true;
    this.disableBtn = false;
    this.showSaveBtn = false;
    this.showerrorFlag = false;
    this.disableCancelBtn = false;
    this.projectCreationModel = new ProjectCreationModel();
  }

  onBlurCheck(rUrl: any) {
    if (rUrl != null && rUrl.isComponentValid) {
    } else {
      this.validationMsgArray = [];
      this.validationMsgArray.push('Repository URL is not valid ,Please check');
      this.isValidateForm = true;
    }
  }
  //GET PROJECT DETAILS OF SELECTED PROJECT IN READ ONLY FORM
  onProjectSelect(event: any) {
    let selectProject: any;
    this.themeID = '';
    this.showThemeFlag = false;
    // this.projectCreationModel = new ProjectCreationModel();
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
            this.themeID = selectProject.response.themeUUID;
            this.showThemeFlag = true;
            this.serverPort = selectProject.response.serverPort;
            this.portDisableFlag = false;
            this.newTokenid = selectProject.response.newtokenId;
            this.cookieService.set('tokenid', this.newTokenid);
            this.msgService.sendMessage({ projectId: this.projectId });
            this._cdf.detectChanges();
            this.showUpadteBtn = true;
            this.disableUpdateBtn = true;
            this.showSaveBtn = false;
            this.showNext = false;
            this.disableCancelBtn = true;
            this.disblefields = true;
            this.tabdisabledFlag = true;
            this.projecttabFlag = true;
            this.sourcetabFlag = false;
          } else {
            this.validationMsgArray.push(selectProject.errorMessage);
            this.isValidateForm = true;
          }
        }
      );
  }

  //Set Theme
  setTheme(col: any) {
    this.projectCreationModel.themeUUID = col.themeUUID;
    if (this.themeID == this.projectCreationModel.themeUUID) {
      this.disableUpdateBtn = true;
    } else {
      this.disableUpdateBtn = false;
    }
  }

  //To close Window
  okErrorBtnClick() {
    this.isValidateForm = false;
    this.validationMsgArray = [];
  }

  //To close window
  okWarningBtnClick() {
    this.warningdialogue = false;
    this.WarningMsgArray = [];
  }

  //Reset Project Data
  cancelProject() {
    this.projectCreationModel = new ProjectCreationModel();
  }
  onNextClick(projform: any) {
    let isValid: boolean = false;
    this.validationMsgArray = [];
    let invalidfield: any;
    invalidfield = projform.getErrorMsgData();

    // this.validateFormFields();
    invalidfield.forEach((obj: any) => {
      if (obj.label == 'Name') {
        this.validationMsgArray.push('Invalid (Blank) Project Name.');
      }
      if (obj.label == 'Description') {
        this.validationMsgArray.push('Invalid (Blank) Project Description.');
      }
    });
    if (this.validationMsgArray && this.validationMsgArray.length >= 1) {
      this.isValidateForm = true;
      return;
    } else {
      this.isValidateForm = false;
      this.projecttabFlag = false;
      this.sourcetabFlag = true;
      this.tabdisabledFlag = false;
      this._cdf.detectChanges();
      this.showSaveBtn = true;
      this.showNext = false;
      this.showerrorFlag = true;
    }
  }

  onUpdate() {
    let response: any;
    this.asyncFlag = true;
    const requestJson = {
      projectUUID: this.projectId,
      themeUUID: this.projectCreationModel.themeUUID
    };
    this.http.post('/api/project/project/update', requestJson).subscribe(
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
          this.asyncFlag = false;
          this.themeID = this.projectCreationModel.themeUUID;
          this.uiCreatedEvent({ ui_created: true });
          this.msgData.push(response.successMessage);
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
  //UI CREATED EVENT ADDED
  uiCreatedEvent(string: any) {
    window.postMessage(string, window.location.origin);
  }
  //To Save Project Details
  saveProject(projform: any) {
    //  this.validateSourceFormFields();
    let isValid: boolean = false;
    this.validationMsgArray = [];
    let invalidSourceFields: any;
    invalidSourceFields = projform.getErrorMsgData();
    invalidSourceFields.forEach((obj1: any) => {
      if (obj1.label == 'Git Repository URL') {
        this.validationMsgArray.push('Invalid (Blank) respository Type.');
      }
      if (obj1.label == 'Git Repository Type') {
        this.validationMsgArray.push('Invalid (Blank) Respository URL.');
      }
      {
        if (obj1.label == 'User name or email address') {
          this.validationMsgArray.push('Invalid (Blank) User Name.');
        }
        if (obj1.label == 'Password') {
          this.validationMsgArray.push('Invalid (Blank) Password');
        }
      }
    });
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
    this.loaderService.showLoader();
    const requestJson = {
      projectName: this.projectCreationModel.projectName,
      projectDescription: this.projectCreationModel.projectDescription,
      themeUUID: this.projectCreationModel.themeUUID,
      respositoryTypeId: this.projectCreationModel.respositoryTypeId,
      repositoryURL: this.projectCreationModel.repositoryURL,
      repositoryUsername: this.projectCreationModel.repositoryUsername,
      repositoryPassword: this.projectCreationModel.repositoryPassword
    };
    this.http.post('/api/project/project/save ', requestJson).subscribe(
      res => {
        response = res;
      },
      err => {
        this.validationMsgArray.push('Unable to connect to server');
        this.isValidateForm = true;
        this.asyncFlag = false;
        this.loaderService.hideLoader();
      },
      () => {
        if (response.success) {
          this.newTokenid = response.response.tokenid;
          this.projectId = response.response.projectUUID;
          this.cookieService.set('tokenid', this.newTokenid);
          this.asyncFlag = false;
          this.msgData.push(response.successMessage);
          this.loaderService.hideLoader();
          this.clearData();
          this.getProjectList();
          this.msgService.sendMessage({
            projectId: this.projectId,
            saveproject: true
          });
          this.showtask();
        } else {
          if (response.errorMessage == null) {
            response.errors.forEach((error: any, index: any) => {
              this.validationMsgArray.push(response.errors);
            });
            this.isValidateForm = true;
            this.asyncFlag = false;
            this.loaderService.hideLoader();
          } else if (response.errors !== null) {
            this.validationMsgArray.push(response.errorMessage);
            response.errors.forEach((error: any, index: any) => {
              this.validationMsgArray.push(response.errors);
            });
            this.isValidateForm = true;
            this.asyncFlag = false;
            this.loaderService.hideLoader();
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
      this.msgService.sendMessage({
        path: 'home/codepipeline/task-ui',
        title: 'Task Details'
      });
    }
  }

  findInstance() {
    let instanceresponse: any;
    this.http.post('/api/pipeline/Instance/getHostDetails', {}).subscribe(
      res => {
        instanceresponse = res;
      },
      err => {
        this.validationMsgArray.push('Unable to connect to server, please try after sometime.');
        this.isValidateForm = true;
      },
      () => {
        if (instanceresponse.success) {
          this.openProjectUi();
        } else {
          this.validationMsgArray.push('Unable to connect to server, please try after sometime.');
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
          themesIcon: obj.themesIcon,
          themeType: obj.themeType
        };
        this.amexioThemes.push(obj1);
      } else {
        const obj2 = {
          themeUUID: obj.themeUUID,
          themesName: obj.themesName,
          themesDescription: obj.themesDescription,
          themesIcon: obj.themesIcon,
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
  respositoryTypeId: any;
  repositoryURL: string;
  repositoryUsername: string;
  repositoryPassword: string;
  constructor() {
    this.projectDescription = '';
    this.projectName = '';
    this.themeUUID = '6FF7B738-EE02-4367-9168-FD5327E3FCBB';
    this.respositoryTypeId = '1';
    this.repositoryURL = '';
    this.repositoryUsername = '';
    this.repositoryPassword = '';
  }
}
