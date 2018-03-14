import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'platform-commons';
import { CookieService } from 'platform-commons';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'project-create',
  template: `

  <amexio-card [header]="true" [footer]="true" [footer-align]="'right'"
  [body-height]="75">
    <amexio-header>
      Project Creation
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
           [field-label]="'Amexio Themes'"
           name ="theme"
           [display-field]="'themesName'"
           [value-field]="'themeUUID'"
           [data]="amexioThemes"
           [default-value]="projectCreationModel.themeUUID"  
           (onSelection)="setTheme($event)">
        </amexio-radio-group>
      
        </amexio-column>  
        <amexio-column [size]="6">
        <amexio-radio-group
           [field-label]="'Material Themes'"
           name ="theme"
           [display-field]="'themesName'"
           [value-field]="'themeUUID'"
           [data]="materialthemes"
           [default-value]="projectCreationModel.themeUUID"  
           (onSelection)="setTheme($event)">
        </amexio-radio-group>
        </amexio-column>  
        
      </amexio-row>
    </amexio-body>
    <amexio-action>
    <amexio-button
    [label]="'Save'"
    [loading]="asyncFlag"
    [type]="'primary'"
    [tooltip]="'Save'"
    [size]="'small'" 
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
  serverPort: any;
  newTokenid: string;
  msgData: any = [];
  projectUUID: string;
  validationMsgArray: any = [];
  isValidateForm: boolean = false;
  themes: any;
  amexioThemes: any;
  materialthemes: any;
  constructor(
    private http: HttpClient,
    private ls: LocalStorageService,
    private cookieService: CookieService,
    private route: ActivatedRoute
  ) {
    this.projectCreationModel = new ProjectCreationModel();
    this.amexioThemes = [];
    this.materialthemes = [];
    this.getThemeData();
  }

  ngOnInit(): void {
    debugger;

    this.route.params.forEach(p => {
      // console.log('test1',p)
      let id = p.id;
      if (id == null || id == '') {
        // console.log('tset2',id)
        this.projectCreationModel = new ProjectCreationModel();
      } else {
        this.getProjData(id);
      }
    });

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

  clearData() {
    this.projectCreationModel = new ProjectCreationModel();
  }
  getProjData(projectUUID: any) {
    let projectData: any;
    this.projectCreationModel = new ProjectCreationModel();
    this.http
      .get('/api/project/project/findByProjectUUID?projectUUID=' + projectUUID)
      .subscribe(
        response => {
          projectData = response;
        },
        err => {
          console.log('Error occured');
        },
        () => {
          console.log(projectData.response);
          this.projectCreationModel.projectName =
            projectData.response.projectName;
          this.projectCreationModel.projectDescription =
            projectData.response.projectDescription;
          this.projectCreationModel.themeUUID = projectData.response.themeUUID;
          this.serverPort = projectData.response.serverPort;
        }
      );
  }
  getThemeData() {
    let response: any;
    this.http.get('/api/project/themes/findAll').subscribe(
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
          this.themes = response.response;
          console.log('themes', this.themes);
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
        console.log('amexiotheme', this.amexioThemes);
      } else {
        const obj2 = {
          themeUUID: obj.themeUUID,
          themesName: obj.themesName,
          themesDescription: obj.themesDescription,
          themeType: obj.themeType
        };
        this.materialthemes.push(obj2);
        console.log('material', this.materialthemes);
      }
    });
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
