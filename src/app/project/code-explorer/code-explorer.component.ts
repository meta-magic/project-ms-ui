import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { CookieService } from 'platform-commons';
import { clearImmediate } from 'timers';
@Component({
  selector: 'code-explorer',
  template: `
    <amexio-row>
      <amexio-column [size]="3">
        <amexio-card  [header]="true"  [footer]="false" [show]="true" [header-align]="'left'"
                      [body-height]="79  " [footer-align]="'right'">
          <amexio-header>
            Project Explorer
            <amexio-button [type]="'warning'" [tooltip]="'Share'" (onClick)="onShareClick($event)" [icon]="'fa fa-share-alt'" > </amexio-button>
            <amexio-button [type]="'success'" [tooltip]="'Files'" (onClick)="onFileClick($event)" [icon]="'fa fa-file-o'" > </amexio-button>
          </amexio-header>

          <amexio-body>

            <ng-container *ngIf="fileStructuredata && fileDataFromBack">
              <amexio-treeview [data]="fileStructuredata" (nodeClick)="getFileData($event)" [data-reader]="'children'">
              </amexio-treeview>
            </ng-container>


            <ng-container *ngIf="treeViewData">
              <amexio-row>
                <amexio-column size="12">
                  <amexio-tree-filter-view [data-reader]="'Data'"
                                           [http-method]="'get'"
                                           (nodeClick)="onShareTreeDataClick($event)"
                                           [http-url]="'assets/share.json'">
                  </amexio-tree-filter-view>
                 
                </amexio-column>
              </amexio-row>
            </ng-container>

          </amexio-body>
        </amexio-card>
      </amexio-column>

      <amexio-column [size]="9"   >
        <amexio-card [body-height]="79">
          <amexio-body>
            <ng-container *ngIf="commitWindow">
              <!--<amexio-tree-filter-view  [data]="docker" [data-reader]="'Data'">-->
              <!--</amexio-tree-filter-view>-->
              <amexio-window [show-window]="showBasicWindow"
                             type="window" [closable]="true" [footer] ="true">
                <amexio-header>
                 Commit Changes
                </amexio-header>
                <amexio-body>
                  <amexio-row>
                  
                    <amexio-column [size]="12">
                      <amexio-text-input [field-label]="'Repository URL'" name="URL"
                                         [(ngModel)]="commitAllDataClass.remoteURL"
                                         [place-holder]="'https://github.com/meta-magic/Amexio5API.git'"
                                         [enable-popover]="true"
                                         [icon-feedback]="true"
                                         [allow-blank]="false"
                                         [error-msg]="'Please enter proper URL'"
                      >
                      </amexio-text-input>
                    </amexio-column>

                  </amexio-row>
                  <amexio-row>
                    <amexio-column [size]="6">
                      <amexio-textarea-input [field-label]="'User Name'" name="username"
                                             [(ngModel)] ="commitAllDataClass.username"
                                             [place-holder]="'Enter your user name'"
                                             [error-msg]="'Please enter user name'"
                                             [icon-feedback]="true"
                                             [rows]="'1'"
                                             [columns]="'2'"
                                             [allow-blank]="false"
                                             [enable-popover]="true">
                      </amexio-textarea-input>
                    </amexio-column>
                    <amexio-column [size]="6">
                      <amexio-password-input [enable-popover]="true"
                                             [(ngModel)]="commitAllDataClass.password"
                                             [field-label]="'Password '"
                                             name ="Password"
                                             [place-holder]="'Enter your password'"
                                             [allow-blank]="false"
                                             [error-msg] ="'Please enter password'"
                                             [min-length]="6"
                                             [min-error-msg]="'Minimum 6 char required'"
                                             [max-length]="32"
                                             [max-error-msg]="'Maximum 32 char allowed'"
                                             [icon-feedback]="true">
                      </amexio-password-input>
                    </amexio-column>
                  </amexio-row>
                  <amexio-row>
                    <amexio-column [size]="12">
                      <amexio-textarea-input 
                                              [(ngModel)]="commitAllDataClass.commitMessage"
                                              [enable-popover]="true"
                                             [field-label]="'Commit Message'" 
                                             name ="Message"
                                             [place-holder]="'Add commit message ...'"
                                             [allow-blank]="true"
                                             [icon-feedback]="true"
                                             [rows]="'4'"
                                             [columns]="'2'">
                        
                      </amexio-textarea-input>
                     

                    </amexio-column>

                  </amexio-row>

                </amexio-body>
                <amexio-action>
                 
                  <amexio-button 
                                  (onClick)="onCommitChangesClick($event)"
                                 label="Commit Changes" type="green" [icon]="'fa fa fa-arrow-circle-up'">
                  </amexio-button>
                  <amexio-button (onClick)="showBasicWindow = false"
                                 label="Close" type="white"  [icon]="'fa fa-remove'">
                  </amexio-button>
                </amexio-action>
              </amexio-window>

            </ng-container>
            <amexio-label size="'small'">
              <ng-container *ngIf="sourceCode">

                <ng-container *ngIf="isCss">
                  <prism-block [code]="sourceCode" [language]="'css'"></prism-block>
                </ng-container>

                <ng-container *ngIf="isHtml">
                  <prism-block [code]="sourceCode" [language]="'html'"></prism-block>
                </ng-container>

                <ng-container *ngIf="isTypeScript">
                  <prism-block [code]="sourceCode" [language]="'typescript'"></prism-block>
                </ng-container>

                <ng-container *ngIf="isJson">
                  <prism-block [code]="sourceCode" [language]="'json'"></prism-block>
                </ng-container>


              </ng-container>
            </amexio-label>
          </amexio-body>
        </amexio-card>
      </amexio-column>
    </amexio-row>
    <amexio-dialogue [show-dialogue]="showErrorDialogue" (close)="closeDialogue()"
                     [custom]="true"
                     [title]="'Error Message'"
                     [type]="'confirm'">
      <amexio-body>
       <div *ngFor="let data of inValidMessageData">
       <li style="text-align: left">{{data}}</li>  
       </div>
        
      </amexio-body>

      <amexio-action>
        <amexio-button type="primary" (onClick)="closeDialogue()" [label]="'Ok'">
        </amexio-button>
      </amexio-action>
    </amexio-dialogue>  

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

  treeViewData: boolean;

  fileDataFromBack: boolean;

  showBasicWindow: boolean;

  isCss: boolean;

  commitWindow: boolean;

  File: any;

  fileStructuredata: any;

  publicIpAddress: any;

  mainData: any;

  sourceCode: any;

  showErrorDialogue: boolean = false;

  commitAllDataClass: CommitAllDataClass;

  inValidMessageData: any[] = [];

  constructor(
    public http: HttpClient,
    private cookie: CookieService,
    public cdf: ChangeDetectorRef
  ) {
    this.commitAllDataClass = new CommitAllDataClass();
    this.resetFlag();
    this.treeViewData = false;
    this.fileDataFromBack = true;
  }

  ngOnInit() {
    let ipAddress: any;
    // this.publicIpAddress = '18.219.125.0';
    //this.getSourceCodeTreeData();
    this.http.get('/api/user/person/findLoggedInUserInfo').subscribe(
      response => {
        ipAddress = response;
      },
      error => {},
      () => {
        this.publicIpAddress = ipAddress.response.publicIpAddress;
        this.getSourceCodeTreeData();
      }
    );
  }

  resetFlag() {
    this.isHtml = false;
    this.isTypeScript = false;
    this.isJson = false;
    this.isCss = false;
    this.commitWindow = false;
  }

  // on button click the files are display here in tree formate
  onFileClick(data: any) {
    this.fileDataFromBack = true;
    this.treeViewData = false;
    this.getSourceCodeTreeData();
  }

  onShareClick(data: any) {
    this.treeViewData = true;
    this.fileDataFromBack = false;
    this.File = {
      item: []
    };
  }

  //Method to get Source Code Data in tree format
  getSourceCodeTreeData() {
    this.fileDataFromBack = false;
    // let appUrl = 'http://host:8080/code-pipeline-service/projectExplorer/explorer';
    let appUrl = 'http://host:9870/projectExplorer/explorer';
    debugger;
    if (this.publicIpAddress) {
      appUrl = appUrl.replace('host', this.publicIpAddress);
    } else {
      appUrl = appUrl.replace('host', 'localhost');
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
        console.log('Error occured');
      },
      () => {
        if (filedata.response) {
          let responsedata: any;
          responsedata = JSON.parse(filedata.response);
          let stringData = {
            children: responsedata.children
          };

          this.fileStructuredata = null;
          this.fileDataFromBack = true;
          this.fileStructuredata = stringData;
        }
      }
    );
  }

  //Method to Get File Data
  getFileData(data: any) {
    //back end data comes on child click.

    if (!data.children) {
      // let appUrl =
      //   'http://host:8080/code-pipeline-service/projectExplorer/findSourceCode';
      let appUrl = 'http://host:9870/projectExplorer/findSourceCode';
      if (this.publicIpAddress) {
        appUrl = appUrl.replace('host', this.publicIpAddress);
      } else {
        appUrl = appUrl.replace('host', 'localhost');
      }
      if (data.leaf) {
        let filedata: any;
        const sourcePathJSON: any = {};
        sourcePathJSON['sourcePath'] = data.sourcePath;
        this.http.post(appUrl, sourcePathJSON).subscribe(
          res => {
            filedata = res;
          },
          err => {
            console.log('Error occured');
          },
          () => {
            const responseData = JSON.parse(filedata.response);
            this.sourceCode = '';
            if (responseData.source) {
              this.sourceCode = responseData.source;
              this.resetFlag();
              this.cdf.detectChanges();

              if (responseData.fileType) {
                this.resetFlag();
                if (responseData.fileType == 'html') {
                  this.isHtml = true;
                  return;
                } else if (responseData.fileType == 'json') {
                  this.isJson = true;
                  return;
                } else if (responseData.fileType == 'ts') {
                  this.isTypeScript = true;
                  return;
                } else if (responseData.fileType == 'css') {
                  this.isCss = true;
                  return;
                } else {
                  this.isHtml = true;
                }
              }
            }
          }
        );
      }
    }
  }

  onShareTreeDataClick(data: any) {
    this.commitWindow = true;
    this.showBasicWindow = !this.showBasicWindow;
  }
  onCommitChangesClick(data: any) {
    this.validateForm();
    let responseData: any;
    let requestJson = this.commitAllDataClass;
    this.http
      .post('/api/pipeline/SourceCodeSharing/commitAll', requestJson)
      .subscribe(
        response => {
          responseData = response;
        },
        err => {
          console.log('Error occured');
        },
        () => {
          if (responseData && responseData.errors) {
            this.inValidMessageData = responseData.errors;
          }
        }
      );
  }

  closeDialogue() {
    this.showErrorDialogue = false;
  }

  validateForm() {
    this.inValidMessageData = [];
    if (
      this.commitAllDataClass.remoteURL == '' ||
      this.commitAllDataClass.remoteURL == null
    ) {
      this.inValidMessageData.push('Repository url should not  empty');
      this.showErrorDialogue = true;
    }
    if (
      this.commitAllDataClass.username == '' ||
      this.commitAllDataClass.username == null
    ) {
      this.inValidMessageData.push('User name can not blank');
      this.showErrorDialogue = true;
    }
    if (
      this.commitAllDataClass.password == '' ||
      this.commitAllDataClass.password == null
    ) {
      this.inValidMessageData.push('Password can not empty');
      this.showErrorDialogue = true;
    }
    if (
      this.commitAllDataClass.commitMessage == '' ||
      this.commitAllDataClass.commitMessage == null
    ) {
      this.inValidMessageData.push('Commit message can not blank');
      this.showErrorDialogue = true;
    }
  }
}

export class CommitAllDataClass {
  remoteURL: string;
  username: string;
  password: string;
  commitMessage: string;
  constructor() {
    this.remoteURL = '';
    this.username = '';
    this.password = '';
    this.commitMessage = '';
  }
}
