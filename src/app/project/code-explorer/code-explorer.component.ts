import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ComponentFactoryResolver
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { TabcodeComponent } from './tabcode.component';
import { CookieService } from 'platform-commons';
import { clearImmediate } from 'timers';
import { NotificationComponent } from '../notification.component';
import { NotificationService } from 'platform-commons';
import { any } from 'codelyzer/util/function';
@Component({
  selector: 'code-explorer',
  //language=Angular2HTML
  template: `
    <amexio-row>
      <amexio-column [size]="3">
        <amexio-card [header]="false" [footer]="false" [show]="true" [header-align]="'center'" [body-height]="82"
                     [footer-align]="'right'">
      
          <amexio-body>
          <amexio-tab-view [action]="true" [body-height]="70">
           <amexio-tab-action>
                 <amexio-image style="cursor:pointer;" [icon-class]="'fa fa-refresh fa-lg'" [tooltip]="'Refresh'" (onClick)="onRefreshClick()"></amexio-image>
    </amexio-tab-action>
                     <amexio-tab title="Source Code" [active]="true" [icon]="'fa fa-file-o'">
              <amexio-treeview [data]="fileStructuredata" (nodeClick)="addTab(sourcetab,$event)"></amexio-treeview>
            </amexio-tab>
             <amexio-tab title="Git" [active]="false" [icon]="'fa fa-github'">
              <amexio-row>
                <amexio-column size="12">
                  <amexio-treeview [data]="shareTreeJSonData"
                                   (nodeClick)=" onShareBtnDataClick($event) "></amexio-treeview>
                </amexio-column>
              </amexio-row>
          
             </amexio-tab>
             </amexio-tab-view>
          </amexio-body>
        </amexio-card>
      </amexio-column>
      <amexio-column [size]="9">
        <amexio-card [body-height]="82" [header]="false" [footer]="false" [show]="true" [header-align]="'left'">
      
        <amexio-body>
          
              <amexio-tab-view #sourcetab [closable]="true" [tab-position]="'top'" [header-align]="'left'" [body-height]="70">
</amexio-tab-view>
          </amexio-body>
        </amexio-card>
       
      </amexio-column>
        <amexio-window [show-window]="showCommitAllWindow" (close)="closeCommitAllWindow()" type="window"
                             [closable]="true" [footer]="true">
                <amexio-header> Commit Changes</amexio-header>
                <amexio-body>
                  <amexio-row>
                    <amexio-column [size]="12">
                      <amexio-text-input #rUrl [field-label]="'Repository URL'" name="URL" [disabled]="URLDisabled"
                                         (onBlur)="onBlurCheck(rUrl)"
                                         [pattern]="'/((http|https):\/\/)?[A-Za-z0-9\.-]{3,}\.[A-Za-z]{2}/'"
                                         [(ngModel)]="commitAllDataClass.repositoryURL"
                                         [place-holder]="'https://github.com/meta-magic/demoapp.git'"
                                         [enable-popover]="true" [icon-feedback]="true" [allow-blank]="false"
                                         [error-msg]="'Please enter proper URL'"></amexio-text-input>
                    </amexio-column>
                  </amexio-row>
                  <amexio-row>
                    <amexio-column [size]="6">
                      <amexio-textarea-input [field-label]="'User name or email address'" name="username"
                                             [(ngModel)]="commitAllDataClass.username"
                                             [place-holder]="'Enter GitHub user name or email address'"
                                             [error-msg]="'Please enter user name'" [icon-feedback]="true" [rows]="'1'"
                                             [columns]="'2'" [allow-blank]="false"
                                             [enable-popover]="true"></amexio-textarea-input>
                    </amexio-column>
                    <amexio-column [size]="6">
                      <amexio-password-input [enable-popover]="true" [(ngModel)]="commitAllDataClass.password"
                                             [field-label]="'Password '" name="Password"
                                             [place-holder]="'Enter GitHub password'" [allow-blank]="false"
                                             [error-msg]="'Please enter password'"
                                             [icon-feedback]="true"></amexio-password-input>
                    </amexio-column>
                  </amexio-row>
                  <amexio-row>
                    <amexio-column [size]="12">
                      <amexio-textarea-input [(ngModel)]="commitAllDataClass.commitMessage" [enable-popover]="true"
                                             [field-label]="'Commit Message'" name="Message"
                                             [place-holder]="'Add commit message ...'" [allow-blank]="true"
                                             [icon-feedback]="true" [rows]="'4'"
                                             [columns]="'2'"></amexio-textarea-input>
                    </amexio-column>
                  </amexio-row>
                </amexio-body>
                <amexio-action>
                  <amexio-button (onClick)="closeCommitAllWindow()" label="Cancel" type="white"
                                 [icon]="'fa fa-remove'"></amexio-button>
                  <amexio-button (onClick)="onCommitAllChangesClick($event)" label="Commit Changes" type="green"
                                [loading]="asyncFlag" [icon]="'fa fa fa-arrow-circle-up'"></amexio-button>
                </amexio-action>
              </amexio-window>

              <amexio-window [show-window]="showCommitWindow" [body-height]="'85'" (close)="closeCommitWindow()"
                             type="window" [closable]="true" [footer]="true">
                <amexio-header> Commit Changes</amexio-header>
                <amexio-body>
                  <amexio-row>
                    <amexio-column [size]="4">
                      <!--<amexio-panel [header]="true" [title]="'Unstaged Changes'" [expanded]="true"-->
                      <!--[height]="250">-->
                      <amexio-card [header]="true" [header-align]="'left'" [body-height]="'40'">
                        <amexio-header>
                          <amexio-label [size]="'small'">Unstaged Changes</amexio-label>
                          <amexio-button [size]="'small'" [tooltip]="'Add Selected '" type="green"
                                         [icon]="'fa fa-plus-circle'"
                                         (onClick)="onOneFileToStage($event)"></amexio-button>
                          <amexio-button [size]="'medium'" [tooltip]="'Add all '" type="yellow"
                                         (onClick)="onAllFileToStage($event)" [icon]="'fa fa-plus'"></amexio-button>
                        </amexio-header>
                        <amexio-body>
                          <amexio-row>
                            <amexio-column size="12">
                            
                              <amexio-treeview [enable-checkbox]="true" [data]="unstagedTreeData"
                                               (onTreeNodeChecked)="getUnstagedClickData($event)"></amexio-treeview>
                            </amexio-column>
                          </amexio-row>
                        </amexio-body>
                      </amexio-card>
                      <amexio-card [header]="true" [header-align]="'left'" [body-height]="'40'">
                        <amexio-header>
                          <amexio-label [size]="'small'"> Staged Changes</amexio-label>
                          <amexio-button [size]="'small'" [tooltip]="'Remove Selected  '" type="green"
                                         (onClick)="onSelectedReturnToUnstage($event)"
                                         [icon]="'fa fa-minus-circle'"></amexio-button>
                          <amexio-button [size]="'medium'" [tooltip]="'Remove all '" type="yellow"
                                         (onClick)="onAllReturnToUnstage()" [icon]="'fa fa-minus'"></amexio-button>
                        </amexio-header>
                        <amexio-body>
                          <amexio-row>
                            <amexio-column size="12">
                              <amexio-treeview [enable-checkbox]="true" [data]="stageDataTree"
                                               (onTreeNodeChecked)="getStageDataClick($event)"></amexio-treeview>
                            </amexio-column>
                          </amexio-row>
                        </amexio-body>
                      </amexio-card>                                               <!--</amexio-panel>-->
                    </amexio-column>
                    <amexio-column [size]="8">
                      <amexio-row>
                        <amexio-column size="12">
                          <amexio-text-input [field-label]="'Repository URL'" name="URL" [disabled]="URLDisabled"
                                         [pattern]="'/((http|https):\/\/)?[A-Za-z0-9\.-]{3,}\.[A-Za-z]{2}/'"
                                         [(ngModel)]="commitAllDataClass.repositoryURL"
                                         [place-holder]="'https://github.com/meta-magic/Amexio5API.git'"
                                         [enable-popover]="true" [icon-feedback]="true" [allow-blank]="false"
                                         [error-msg]="'Please enter proper URL'"></amexio-text-input>
                          <amexio-textarea-input [(ngModel)]="gitCommitDataClass.commitMessage" [enable-popover]="true"
                                                 [field-label]="'Commit Message'" name="Message"
                                                 [place-holder]="'Add commit message ...'" [allow-blank]="true"
                                                 [icon-feedback]="true" [rows]="'3'"
                                                 [columns]="'2'"></amexio-textarea-input>
                          <amexio-textarea-input [field-label]="'User name or email address'" name="username"
                                                 [(ngModel)]="gitCommitDataClass.username"
                                                 [place-holder]="'Enter GitHub user name or email address'"
                                                 [error-msg]="'Please enter user name'" [icon-feedback]="true"
                                                 [rows]="'1'" [columns]="'2'" [allow-blank]="false"
                                                 [enable-popover]="true"></amexio-textarea-input>
                          <amexio-password-input [enable-popover]="true" [(ngModel)]="gitCommitDataClass.password"
                                                 [field-label]="'Password '" name="Password"
                                                 [place-holder]="'Enter GitHub password'" [allow-blank]="false"
                                                 [error-msg]="'Please enter password'" [min-length]="6"
                                                 [icon-feedback]="true"></amexio-password-input>
                        </amexio-column>
                      </amexio-row>
                    </amexio-column>
                  </amexio-row>
                </amexio-body>
                <amexio-action>
                  <amexio-button (onClick)="closeCommitWindow()" label="Cancel" type="white"
                                 [icon]="'fa fa-remove'"></amexio-button>
                  <amexio-button label="Commit" type="green" [icon]="'fa fa-cloud-upload'"
                                 (onClick)="onCommitDataClick($event)"></amexio-button>
                </amexio-action>
              </amexio-window>
              <amexio-window [show-window]="showPullWindow" (close)="closePullWindow()" type="window" [closable]="true"
                             [footer]="true">
                <amexio-header> Pull Request</amexio-header>
                <amexio-body>
                  <amexio-row>
                    <amexio-column [size]="12">
                      <amexio-text-input [field-label]="'Repository URL'" name="URL" [disabled]="URLDisabled"
                                         [pattern]="'/((http|https):\/\/)?[A-Za-z0-9\.-]{3,}\.[A-Za-z]{2}/'"
                                         [(ngModel)]="commitAllDataClass.repositoryURL"
                                         [place-holder]="'https://github.com/meta-magic/Amexio5API.git'"
                                         [enable-popover]="true" [icon-feedback]="true" [allow-blank]="false"
                                         [error-msg]="'Please enter proper URL'"></amexio-text-input>
                      <amexio-textarea-input [field-label]="'User name or email address'" name="username"
                                             [(ngModel)]="gitPullDataClass.username"
                                             [place-holder]="'Enter GitHub user name or email address'"
                                             [error-msg]="'Please enter user name'" [icon-feedback]="true" [rows]="'1'"
                                             [columns]="'2'" [allow-blank]="false"
                                             [enable-popover]="true"></amexio-textarea-input>
                    </amexio-column>
                    <amexio-column [size]="12">
                      <amexio-password-input [field-label]="'Password '" name="Password" [enable-popover]="true"
                                             [(ngModel)]="gitPullDataClass.password"
                                             [place-holder]="'Enter GitHub password'" [allow-blank]="false"
                                             [error-msg]="'Please enter password'" [min-length]="6"
                                             [icon-feedback]="true"></amexio-password-input>
                    </amexio-column>
                  </amexio-row>
                </amexio-body>
                <amexio-action>
                  <amexio-button (onClick)="closePullWindow()" label="Cancel" type="white"
                                 [icon]="'fa fa-remove'"></amexio-button>
                  <amexio-button label="Ok" type="green" [icon]="'fa fa fa-hand-o-right'" 
                                 (onClick)="onPullRequestClick($event)"></amexio-button>
                </amexio-action>
              </amexio-window>

 <app-notification></app-notification>

    <amexio-dialogue [show-dialogue]="showErrorDialogue" (close)="closeDialogue()" [custom]="true"
                     [title]="'Error Message'" [type]="'confirm'">
      <amexio-body>
        <div *ngFor="let data of inValidMessageData">
          <li style="text-align: left">{{data}}</li>
        </div>
      </amexio-body>
      <amexio-action>
        <amexio-button type="primary" (onClick)="closeDialogue()" [label]="'Ok'"></amexio-button>
      </amexio-action>
    </amexio-dialogue> 
    </amexio-row>
    <!--<amexio-floating-button [position-top]="'30px'" [position-left]="'40px'" [label]="'top-left'" [icon]="'fa fa-snowflake-o'"></amexio-floating-button>-->
          `,
  styles: [
    `
      .panel-panel{
        height:488px!important;
      }
    `
  ]
})
export class CodeExplorerComponent implements OnInit {
  isHtml: boolean;
  isJson: boolean;
  isTypeScript: boolean;
  isCss: boolean;

  commitAllDataClass: CommitAllDataClass;
  gitCommitDataClass: GitCommitDataClass;
  gitPullDataClass: GitPullDataClass;

  asyncFlag: boolean = false;
  showCommitAllWindow: boolean;
  showCommitWindow: boolean;
  showPullWindow: boolean;

  // commitAllWindow: boolean;
  // commitWindow: boolean;
  // pullWindow: boolean;

  // treeViewData: boolean;
  // fileDataFromBack: boolean;
  openingWindowFlag: boolean;
  URLDisabled: boolean;
  showErrorDialogue: boolean = false;
  // unableToConnectDialogue: boolean = false;

  File: any;
  fileStructuredata: any = [];
  publicIpAddress: any;
  sourceCode: any;
  protocol: any;
  inValidMessageData: any[] = [];
  // unableToConnectServerMsg: any[] = [];
  unstagedTreeData: any;
  shareTreeJSonData: any;

  stageDataTree: any[] = [];
  syncRepository: any;

  stageFileSelected: any[] = [];
  unStageFileSelected: any[] = [];

  selectedTreeUnstageObject: any;
  selectedTreeStageObject: any;
  enableCommitAndPullWindow: boolean;
  msgData: any[];
  openTabData: any = [];
  tabcount: number = 0;

  constructor(
    public http: HttpClient,
    private cookie: CookieService,
    public _notificationService: NotificationService,
    public cdf: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.commitAllDataClass = new CommitAllDataClass();
    this.gitCommitDataClass = new GitCommitDataClass();
    this.gitPullDataClass = new GitPullDataClass();
    this.URLDisabled = false;

    // this.treeOfUnstagedData();
    this.resetFlag();
    this.resetModel();
    // this.treeViewData = false;
    // this.fileDataFromBack = true;
    this.stageDataTree = [];
    this.unstagedTreeData = [];
    // this.syncMappedRepositoryURL();
    this.msgData = [];
  }

  ngOnInit() {
    // this.unstagedTreeData =

    this.shareTreeJSonData = [
      {
        text: 'Commit All',
        id: 'showCommitAllWindow',
        icon: 'fa fa-upload',
        tooltip: 'Commit All Files'
      },
      // {
      //   text: 'Commit',
      //   id: 'showCommitWindow',
      //   icon: 'fa fa-cloud-upload',
      //   tooltip: 'Commit Selected Files'
      // },
      {
        text: 'Pull/Update',
        id: 'showPullWindow',
        icon: 'fa fa-cloud-download',
        tooltip: 'GitHub Login Here'
      }
    ];

    this.gethostdeatils();
    this.syncMappedRepositoryURL();
  }
  gethostdeatils() {
    let responsedata: any;
    this.http.post('/api/pipeline/Instance/getHostDetails', {}).subscribe(
      response => {
        responsedata = response;
      },
      error => {},
      () => {
        if (responsedata.response) {
          this.publicIpAddress = responsedata.response.hostIpAddress;
          this.protocol = responsedata.response.protocol;
          this.getSourceCodeTreeData();
        } else {
          this.publicIpAddress = '';
          this.protocol = '';
        }
      }
    );
  }
  createInvalidCompErrorData() {
    let errorData: any[] = [];
    let errorObj: any = {};
    errorObj['data'] = [];
    errorObj.data = this.inValidMessageData;
    errorData.push(errorObj);
    this._notificationService.showerrorData('Invalid Component', errorData);
  }

  createErrorData() {
    let errorData: any[] = [];
    let errorObj: any = {};
    errorObj['data'] = [];
    errorObj.data = this.inValidMessageData;
    errorData.push(errorObj);
    this._notificationService.showerrorData('Error Message', errorData);
  }
  /*````````````````````````````````````````````````UNSTAGE DATA TREE OPRATION*/
  getUnstagedClickData(data: any) {
    this.unStageFileSelected = [];
    this.selectedTreeUnstageObject = null;
    this.selectedTreeUnstageObject = data;
    this.selectedTreeUnstageObject.forEach(
      (checkFileUnstage: any, index: any) => {
        if (checkFileUnstage.checked) {
          this.unStageFileSelected.push(checkFileUnstage);
        }
      }
    );
  }

  onOneFileToStage(data: any) {
    this.removeUnstageData();
    this.unStageFileSelected.forEach(obj => {
      obj.checked = false;
      this.stageDataTree.push(obj);
    });
    this.unStageFileSelected = [];
  }
  removeUnstageData() {
    let localArray: any[] = [];
    let localTreeData: any;
    this.unstagedTreeData.forEach((objUnstage: any, index: any) => {
      if (!objUnstage.checked) {
        localArray.push(objUnstage);
      }
    });
    this.unstagedTreeData = localArray;
  }
  onAllFileToStage(data: any) {
    this.unstagedTreeData.forEach((obj: any, index: any) => {
      obj.checked = false;
      this.stageDataTree.push(obj);
    });
    this.unstagedTreeData.forEach((obj: any, index: any) => {
      obj.checked = false;
      this.unstagedTreeData.splice(index);
    });
  }
  /* ``````````````````````````````````````````````````STAGE DATA TREE OPRATION HERE*/

  getStageDataClick(data: any) {
    this.stageFileSelected = [];
    this.selectedTreeStageObject = null;
    this.selectedTreeStageObject = data;
    this.selectedTreeStageObject.forEach((fileStageCheck: any, index: any) => {
      if (fileStageCheck.checked) {
        this.stageFileSelected.push(fileStageCheck);
      }
    });
  }
  onSelectedReturnToUnstage(data: any) {
    this.removeFormStageData();
    this.stageFileSelected.forEach((obj: any) => {
      if (obj.checked) {
        obj.checked = false;
        this.unstagedTreeData.push(obj);
      }
    });
    this.stageFileSelected = [];
  }
  removeFormStageData() {
    let localArray: any[] = [];
    let localTreeData: any;
    this.stageDataTree.forEach((objUnstage: any, index: any) => {
      if (!objUnstage.checked) {
        localArray.push(objUnstage);
      }
    });
    this.stageDataTree = localArray;
  }
  onAllReturnToUnstage() {
    this.stageDataTree.forEach((obj: any, index: any) => {
      obj.checked = false;
      this.unstagedTreeData.push(obj);
    });
    this.stageDataTree.forEach((obj: any, index: any) => {
      obj.checked = false;
      this.stageDataTree.splice(index);
    });
  }

  // ALL PRISM FLAG CLOSE HERE
  resetFlag() {
    this.isHtml = false;
    this.isTypeScript = false;
    this.isJson = false;
    this.isCss = false;
  }

  // PRISM TREE DATA CLEARING BUTTON CLICK
  clearPrismDisplayData() {
    this.sourceCode = '';
    //this.unableToConnectDialogue = true;
  }
  //Add Tab
  checkActiveTab(sourcetab: any, data: any) {
    let title = data.data.node.text;
    if (!sourcetab.setActiveTab(data.data.node.text)) {
      let cmp = sourcetab.addDynamicTab(title, 'black', true, TabcodeComponent);
    }
  }
  addTab(sourcetab: any, data: any) {
    if (!data.children) {
      this.tabcount++;
      let title = data.text;
      this.openTabData.push(data);
      let cmp = sourcetab.addDynamicTab(title, 'black', true, TabcodeComponent);
      if (data) {
        let responsedata: any;
        cmp.getIpAddress().subscribe(
          (response: any) => {
            responsedata = response;
          },
          (error: any) => {},
          () => {
            if (responsedata.response) {
              cmp.publicIpAddress = responsedata.response.hostIpAddress;
              cmp.protocol = responsedata.response.protocol;
              cmp.getFileDataBtnClick(data, cmp.publicIpAddress, cmp.protocol);
            } else {
              cmp.publicIpAddress = '';
              cmp.protocol = '';
            }
          }
        );
      }
    }
  }
  //Reload the source code
  onRefreshClick() {
    this.getSourceCodeTreeData();
  }

  //Method to get Source Code FROM BACKEND AND USE FOR THE TREE STRUCTURE DATA DISPLAY
  getSourceCodeTreeData() {
    this.inValidMessageData = [];
    // this.fileDataFromBack = false;
    // let appUrl = 'http://host:8080/code-pipeline-service/projectExplorer/explorer';
    let appUrl = 'protocol://host:9870/projectExplorer/explorer';

    if (this.publicIpAddress) {
      appUrl = appUrl.replace('host', this.publicIpAddress);
      appUrl = appUrl.replace('protocol', this.protocol);
    } else {
      appUrl = appUrl.replace('host', 'localhost');
      appUrl = appUrl.replace('protocol', this.protocol);

      ``;
    }
    let filedata: any;
    let tokenId = this.cookie.get('tokenid');

    const headers = new HttpHeaders({ tokenid: tokenId });
    const httpOptions = { headers: headers };
    this.http.get(appUrl, httpOptions).subscribe(
      res => {
        filedata = res;
      },
      err => {
        this.inValidMessageData = [];
        this.inValidMessageData.push('Unable To Connect Server');
        this.createErrorData();
      },
      () => {
        if (filedata.response) {
          let responsedata: any;
          responsedata = JSON.parse(filedata.response);
          this.fileStructuredata = responsedata.children;
        }
      }
    );
  }

  onBlurCheck(data: any) {
    if (data != null && data.isComponentValid) {
    } else {
      this.msgData = [];
      this.msgData.push('Repository URL is not valid ,Please check');
      this._notificationService.showWarningData(this.msgData);
    }
  }

  // FLAG USE FOR THE WINDOWS OPEN FOR THE TREE OF COMMIT, COMMITALL, PULL/UPDATE TREE
  onShareBtnDataClick(data: any) {
    if (data.id === 'showCommitAllWindow') {
      this.syncMappedRepositoryURL();
      this.showCommitAllWindow = true;
      this.sourceCode = '';
    }
    if (this.enableCommitAndPullWindow && data.id === 'showCommitWindow') {
      this.syncMappedRepositoryURL();
      this.showCommitWindow = true;
    } else if (data.id == 'showCommitWindow') {
      this.msgData = [];
      this.msgData.push(
        'Repository not found. No repository is mapped to selected project yet'
      );
      // this.showErrorDialogue = true;
      this._notificationService.showWarningData(this.msgData);
    }

    if (this.enableCommitAndPullWindow && data.id === 'showPullWindow') {
      this.syncMappedRepositoryURL();
      this.showPullWindow = true;
      this.sourceCode = '';
    } else if (data.id == 'showPullWindow') {
      this.msgData = [];
      this.msgData.push(
        'Repository not found. No repository is mapped to selected project yet'
      );
      // this.showErrorDialogue = true;
      this._notificationService.showWarningData(this.msgData);
    }
  }
  // ON COMMIT CHANGES BUTTON CLICK OPRATION HERE

  //SERVICE CALL HERE FOR THE COMMIT AND COMMIT ALL AND PULL UPDATE
  onCommitAllChangesClick(data: any) {
    this.validateCommitAllForm();
    if (this.inValidMessageData && this.inValidMessageData.length >= 1) {
      this.createInvalidCompErrorData();
    } else {
      let responseData: any;
      this.asyncFlag = true;
      this.msgData = [];
      let RequestOptions = {
        repositoryURL: this.commitAllDataClass.repositoryURL,
        username: this.commitAllDataClass.username,
        password: this.commitAllDataClass.password,
        commitMessage: this.commitAllDataClass.commitMessage,
        firstCommit: this.commitAllDataClass.firstCommit
      };

      this.http
        .post('/api/pipeline/SourceCodeSharing/commitAll', RequestOptions)
        .subscribe(
          response => {
            responseData = response;
          },
          err => {
            this.inValidMessageData = [];
            this.inValidMessageData.push('Unable To Connect Server');
            this.createErrorData();
            this.asyncFlag = false;
          },
          () => {
            if (responseData.success) {
              this.msgData.push(responseData.successMessage);
              this._notificationService.showSuccessData(this.msgData);
              this.commitAllDataClass = new CommitAllDataClass();
              this.showCommitAllWindow = false;
              this.asyncFlag = false;
            }

            if (responseData && responseData.errors) {
              this.inValidMessageData.push(responseData.errors);
              this.createErrorData();
              this.asyncFlag = false;
            }
          }
        );
    }
  }
  // VALIDATION OF COMMIT WINDOW
  onCommitDataClick(data: any) {
    this.validateCommitForm();
    this.gitCommitDataClass.files = [];
    if (this.inValidMessageData && this.inValidMessageData.length == 0) {
      this.stageDataTree.forEach((objTree: any) => {
        let objTreeData = {
          name: objTree.text,
          path: objTree.sourcePath
        };

        this.gitCommitDataClass.files.push(objTreeData);
      });
      let responseData: any;
      this.http
        .post('/api/pipeline/SourceCodeSharing/commit', this.gitCommitDataClass)
        .subscribe(
          response => {
            responseData = response;
          },
          err => {
            this.inValidMessageData = [];
            this.inValidMessageData.push('Unable To Connect Server');
            this.createErrorData();
          },
          () => {
            if (responseData && responseData.errors) {
              this.inValidMessageData = responseData.errors;
            }
          }
        );
    }
  }
  //VALIDATION OF PULL WINDOW
  onPullRequestClick(data: any) {
    this.validatePullForm();
    if (this.inValidMessageData && this.inValidMessageData.length >= 1) {
      this.createInvalidCompErrorData();
    } else {
      let responseData: any;
      this.asyncFlag = true;
      this.msgData = [];
      this.http
        .post('/api/pipeline/SourceCodeSharing/pull', this.gitPullDataClass)
        .subscribe(
          response => {
            responseData = response;
          },
          err => {
            this.inValidMessageData = [];
            this.inValidMessageData.push('Unable To Connect Server');
            this.createErrorData();
            this.asyncFlag = false;
          },
          () => {
            if (responseData && responseData.errors) {
              this.inValidMessageData.push(responseData.errorMessage);
              this.createErrorData();
              this.asyncFlag = false;
            } else if (responseData.success) {
              this.gitPullDataClass = new GitPullDataClass();
              this.showPullWindow = false;
              this.msgData.push(responseData.successMessage);
              this._notificationService.showSuccessData(this.msgData);
              this.asyncFlag = false;
            }
          }
        );
    }
  }

  // VALIDATION OF COMMIT ALL DATA WINDOW
  validateCommitAllForm() {
    this.inValidMessageData = [];
    if (
      this.commitAllDataClass.repositoryURL == '' ||
      this.commitAllDataClass.repositoryURL == null
    ) {
      this.inValidMessageData.push('Repository url should not  empty');
      // this.showErrorDialogue = true;
    }
    if (
      this.commitAllDataClass.username == '' ||
      this.commitAllDataClass.username == null
    ) {
      this.inValidMessageData.push('User name can not blank');
      // this.showErrorDialogue = true;
    }
    if (
      this.commitAllDataClass.password == '' ||
      this.commitAllDataClass.password == null
    ) {
      this.inValidMessageData.push('Password can not empty');
      // this.showErrorDialogue = true;
    }
    if (
      this.commitAllDataClass.commitMessage == '' ||
      this.commitAllDataClass.commitMessage == null
    ) {
      this.inValidMessageData.push('Commit message can not blank');
      // this.showErrorDialogue = true;
    }
  }
  validateCommitForm() {
    this.inValidMessageData = [];
    if (
      this.gitCommitDataClass.username == '' ||
      this.gitCommitDataClass.username == null
    ) {
      this.inValidMessageData.push('User name can not blank');
      // this.showErrorDialogue = true;
    }
    if (
      this.gitCommitDataClass.password == '' ||
      this.gitCommitDataClass.password == null
    ) {
      this.inValidMessageData.push('Password can not empty');
      // this.showErrorDialogue = true;
    }
    if (
      this.gitCommitDataClass.commitMessage == '' ||
      this.gitCommitDataClass.commitMessage == null
    ) {
      this.inValidMessageData.push('Commit message can not blank');
      // this.showErrorDialogue = true;
    }
  }
  validatePullForm() {
    this.inValidMessageData = [];
    if (
      this.gitPullDataClass.username == '' ||
      this.gitPullDataClass.username == null
    ) {
      this.inValidMessageData.push('User name can not blank');
      // this.showErrorDialogue = true;
    }
    if (
      this.gitPullDataClass.password == '' ||
      this.gitPullDataClass.password == null
    ) {
      this.inValidMessageData.push('Password can not empty');
      // this.showErrorDialogue = true;
    }
  }

  // CLOSE DIALOGUE BOX
  closeDialogue() {
    this.showErrorDialogue = false;
  }

  //CLOSE COMMIT ALL WINDOW
  closeCommitAllWindow() {
    this.resetModel();
    this.showCommitAllWindow = false;
  }
  //CLOSE COMMIT WINDOW
  closeCommitWindow() {
    this.resetModel();
    this.onAllReturnToUnstage();
    this.showCommitWindow = false;
  }
  //CLOSE PULL WINDOW
  closePullWindow() {
    this.resetModel();
    this.showPullWindow = false;
  }
  // USE FOR CLEARING ALL DATA WHEN CANCEL OR COMMIT BUTTON CLICK
  resetModel() {
    this.commitAllDataClass.username = '';
    this.commitAllDataClass.password = '';
    this.commitAllDataClass.commitMessage = '';
    this.commitAllDataClass.repositoryURL = '';

    this.gitPullDataClass.username = '';
    this.gitPullDataClass.password = '';

    this.gitCommitDataClass.username = '';
    this.gitCommitDataClass.password = '';
    this.gitCommitDataClass.commitMessage = '';
    this.gitCommitDataClass.files = [];
  }
  syncMappedRepositoryURL() {
    let responseData: any;
    let firstCommit: boolean;
    this.http
      .post('/api/pipeline/SourceCodeSharingQuery/findProjectRepository', {})
      .subscribe(
        response => {
          responseData = response;
        },
        err => {
          this.inValidMessageData = [];
          this.inValidMessageData.push('Unable To Connect Server');
          this.showErrorDialogue = true;
        },
        () => {
          if (responseData.success) {
            // repository is present i.e firstCommit = false
            if (
              responseData.response &&
              responseData.response.repositoryURL &&
              responseData.response.repositoryURL != ''
            ) {
              this.commitAllDataClass.repositoryURL =
                responseData.response.repositoryURL;
              this.URLDisabled = true;
              this.commitAllDataClass.firstCommit = false;
              this.enableCommitAndPullWindow = true;
            }
          } else {
            // repository is not present i.e firstCommit = true
            this.URLDisabled = false;
            this.commitAllDataClass.firstCommit = true;
          }
        }
      );
  }

  treeOfUnstagedData() {
    let responseData: any;
    this.http.get('assets/json/share.json').subscribe(
      response => {
        responseData = response;
      },
      err => {
        this.inValidMessageData = [];
        this.inValidMessageData.push('Unable To Connect Server');
        this.showErrorDialogue = true;
      },
      () => {
        this.unstagedTreeData = responseData;
      }
    );
  }
}

// CLASS FOR THE  2 WAY BINDING OF HTML AND TS (BIND ) HERE
//FOR THE COMMIT ALL FILE BINDING
export class CommitAllDataClass {
  repositoryURL: string;
  username: string;
  password: string;
  commitMessage: string;
  firstCommit: boolean;

  constructor() {
    this.repositoryURL = '';
    this.username = '';
    this.password = '';
    this.commitMessage = '';
    this.firstCommit = true;
  }
}
// FOR THE ONLY ONE COMMIT FILE DATA BINDING

export class GitCommitDataClass {
  commitMessage: string;
  username: string;
  password: string;
  files: FileModel[];
  constructor() {
    this.commitMessage = '';
    this.username = '';
    this.password = '';
    this.files = [];
  }
}
// THIS IS FOR THE PULL DATA BINDING
export class GitPullDataClass {
  username: string;
  password: string;
  constructor() {
    this.username = '';
    this.password = '';
  }
}

//FOR MULTIPLE FILES ARE CONNECTED TO THE COMMIT CHANGES BUTTON CALL TO COMMIT ONLY
export class FileModel {
  name: string;
  path: string;
  constructor() {
    this.name = '';
    this.path = '';
  }
}

//((git|ssh|http(s)?)|(git@[\w\.]+))(:(//)?)([\w\.@\:/\-~]+)(\.git)(/)?
