import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { CookieService } from 'platform-commons';
import { clearImmediate } from 'timers';
import { any } from 'codelyzer/util/function';
@Component({
  selector: 'code-explorer',
  template: `
    <amexio-row>
      <amexio-column [size]="3">
        <amexio-card  [header]="true"  [footer]="false" [show]="true" [header-align]="'left'"
                      [body-height]="79" [footer-align]="'right'">
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
                  <amexio-treeview [data-reader]="'data'"
                                   [http-method]="'get'"
                                   (nodeClick)="onShareTreeDataClick($event)"
                                   [http-url]="'assets/share.json'">
                  </amexio-treeview>



                </amexio-column>
              </amexio-row>
            </ng-container>

          </amexio-body>
        </amexio-card>
      </amexio-column>

      <amexio-column [size]="9"   >
        <amexio-card [body-height]="79">
          <amexio-body>
            <ng-container *ngIf="commitAllWindow">

              <amexio-window [show-window]="showCommitAllWindow"
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
                                             [place-holder]="'Enter GitHub user name'"
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
                                             [place-holder]="'Enter GitHub password'"
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
                  <amexio-button (onClick)="showCommitAllWindow = false"
                                 label="Cancel" type="white"  [icon]="'fa fa-remove'">
                  </amexio-button>

                  <amexio-button
                    (onClick)="onCommitChangesClick($event)"
                    label="Commit Changes" type="green" [icon]="'fa fa fa-arrow-circle-up'">
                  </amexio-button>

                </amexio-action>
              </amexio-window>  </ng-container>

            <ng-container *ngIf="commitWindow">

              <amexio-window [show-window]="showCommitWindow"   [body-height]="85"
                             type="window" [closable]="true" [footer] ="true">
                <amexio-header>
                  Commit Changes
                </amexio-header>
                <amexio-body>
                  <amexio-card>
                    <amexio-body>
                      <amexio-row>
                        <amexio-column [size]="5">


                          <amexio-panel [header]="true"
                                        [title]="'Unstaged Changes'"
                                        [expanded]="true"
                                        [height] ="'90px'"
                          >

                            <amexio-header>
                              <amexio-button   [size]="'small'" [tooltip]="'Add one file '" type="green"  [icon]="'fa fa-plus-circle'" (onClick)="onAddFileClick($event)"></amexio-button>
                              <amexio-button  [size]="'medium'" [tooltip]="'Add all file '" type="yellow"  [icon]="'fa fa-plus'" ></amexio-button>

                            </amexio-header>
                            <amexio-row>
                              <amexio-column size="12">

                                <!--<amexio-treeview [enable-checkbox]="true"  [data]="fileStructuredata" (nodeClick)="getUnstagedClickData($event)" [data-reader]="'children'" >-->
                                <!--</amexio-treeview>-->

                                <amexio-treeview  [enable-checkbox]="true"
                                                  [data]="unstagedTreeData"
                                                  [data-reader]="'demo'"
                                                  (nodeClick)="getUnstagedClickData($event)"
                                >
                                </amexio-treeview>
                              </amexio-column>
                            </amexio-row>
                          </amexio-panel>

                        </amexio-column>
                        <amexio-column [size]="7">

                          <amexio-textarea-input
                            [(ngModel)]="commitAllDataClass.commitMessage"
                            [enable-popover]="true"
                            [field-label]="'Commit Message'"
                            name ="Message"
                            [place-holder]="'Add commit message ...'"
                            [allow-blank]="true"
                            [icon-feedback]="true"
                            [rows]="'5'"
                            [columns]="'2'">

                          </amexio-textarea-input>


                        </amexio-column>
                      </amexio-row>
                    </amexio-body>
                  </amexio-card>
                  <amexio-card  >
                    <amexio-body>


                      <amexio-row>
                        <amexio-column [size]="5">

                          <amexio-panel [header]="true"
                                        [title]="'Staged Changes'"
                                        [expanded]="true"
                                        [height] ="'40px'">

                            <amexio-header>
                              <amexio-button   [size]="'small'" [tooltip]="'Remove one file '" type="green"  (onClick)="onRemoveFileClick($event)"[icon]="'fa fa-minus-circle'"></amexio-button>
                              <amexio-button   [size]="'medium'" [tooltip]="'Remove all file '" type="yellow"  [icon]="'fa fa-minus'" ></amexio-button>

                            </amexio-header>
                            <amexio-row>
                              <amexio-column size="12">
                                <amexio-treeview [enable-checkbox]="true"
                                                 [data]="stageData"
                                                 (nodeClick)="getStageDataClick($event)"
                                >
                                </amexio-treeview>

                              </amexio-column>
                            </amexio-row>
                          </amexio-panel>
                          <!--<ng-container *ngIf="fileStructuredata && fileDataFromBack">-->
                          <!--<amexio-treeview [data]="fileStructuredata" (nodeClick)="getFileData($event)" [data-reader]="'children'">-->
                          <!--</amexio-treeview>-->
                          <!--</ng-container>-->

                        </amexio-column>
                        <amexio-column [size]="7">

                          <amexio-column [size]="12">
                            <amexio-textarea-input [field-label]="'User Name'" name="username"
                                                   [(ngModel)] ="commitAllDataClass.username"
                                                   [place-holder]="'Enter GitHub user name'"
                                                   [error-msg]="'Please enter user name'"
                                                   [icon-feedback]="true"
                                                   [rows]="'1'"
                                                   [columns]="'2'"
                                                   [allow-blank]="false"
                                                   [enable-popover]="true">
                            </amexio-textarea-input>
                          </amexio-column>
                          <amexio-column [size]="12">
                            <amexio-password-input [enable-popover]="true"
                                                   [(ngModel)]="commitAllDataClass.password"
                                                   [field-label]="'Password '"
                                                   name ="Password"
                                                   [place-holder]="'Enter GitHub password'"
                                                   [allow-blank]="false"
                                                   [error-msg] ="'Please enter password'"
                                                   [min-length]="6"
                                                   [min-error-msg]="'Minimum 6 char required'"
                                                   [max-length]="32"
                                                   [max-error-msg]="'Maximum 32 char allowed'"
                                                   [icon-feedback]="true">
                            </amexio-password-input>
                          </amexio-column>


                        </amexio-column>


                      </amexio-row>
                    </amexio-body>
                  </amexio-card>

                </amexio-body>
                <amexio-action>
                  <amexio-button (onClick)="showCommitWindow = false"
                                 label="Cancel" type="white"  [icon]="'fa fa-remove'">
                  </amexio-button>
                  <amexio-button

                    label="Commit" type="green" [icon]="'fa fa-cloud-upload'" (onClick)= "onCommitDataClick($event)">
                  </amexio-button>


                </amexio-action>
              </amexio-window>

            </ng-container>

            <ng-container *ngIf="pullWindow">
              <amexio-window [show-window]="showPullWindow"
                             type="window" [closable]="true" [footer] ="true" >
                <amexio-header>
                  Pull Request
                </amexio-header>
                <amexio-body>
                  <amexio-row>
                    <amexio-column [size]="12">
                      <amexio-textarea-input [field-label]="'User Name'" name="username"
                                             [(ngModel)] ="commitAllDataClass.username"
                                             [place-holder]="'Enter GitHub user name'"
                                             [error-msg]="'Please enter user name'"
                                             [icon-feedback]="true"
                                             [rows]="'1'"
                                             [columns]="'2'"
                                             [allow-blank]="false"
                                             [enable-popover]="true">
                      </amexio-textarea-input>
                    </amexio-column>
                    <amexio-column [size]="12">
                      <amexio-password-input [enable-popover]="true"
                                             [(ngModel)]="commitAllDataClass.password"
                                             [field-label]="'Password '"
                                             name ="Password"
                                             [place-holder]="'Enter GitHub password'"
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
                </amexio-body>
                <amexio-action>
                  <amexio-button (onClick)="showPullWindow = false"
                                 label="Cancel" type="white"  [icon]="'fa fa-remove'">
                  </amexio-button>
                  <amexio-button

                    label="Ok" type="green" [icon]="'fa fa fa-hand-o-right'"   (onClick)="onPullRequestClick($event)" >
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

  showCommitAllWindow: boolean;
  showCommitWindow: boolean;
  showPullWindow: boolean;

  isCss: boolean;

  commitAllWindow: boolean;
  commitWindow: boolean;
  pullWindow: boolean;

  File: any;

  fileStructuredata: any;

  publicIpAddress: any;

  mainData: any;

  sourceCode: any;

  stageData: any;

  showErrorDialogue: boolean = false;

  commitAllDataClass: CommitAllDataClass;

  addStageFile: any[] = [];

  inValidMessageData: any[] = [];

  unstagedTreeData: any;
  unstageData: any[] = [];
  selectedTreeUnstageObject: any;
  selectedTreeStageObject: any;
  constructor(
    public http: HttpClient,
    private cookie: CookieService,
    public cdf: ChangeDetectorRef
  ) {
    this.commitAllDataClass = new CommitAllDataClass();
    this.resetFlag();
    this.treeViewData = false;
    this.fileDataFromBack = true;
    this.cookie.set(
      'tokenid',
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJtdGVpZFwiOlwiMTFwYmM2ZGNmLTdiZGQtNDMwNC1iZjc5LWFkYTE0ZGMyZGU5N1wiLFwibG9naW5JZFwiOlwiNWJiNjAxZDgtZWI3YS00MjhlLTliM2QtZTI4N2M5ZjBlYTNiXCIsXCJ1c2VySWRcIjpcImMyZjkwMGNlLTAzMzMtNGExYy1hMjZjLTVjNGViYjkyYWU0YVwiLFwicGVyc29uSWRcIjpcIjNkMzJjN2RlLWQyMzAtNGFmOS1iN2FlLTZjZDllZjJiOWY3YVwiLFwiYXBwU2Vzc2lvbklkXCI6XCI5Mjc4YjU0Ny1mMzU3LTRlOTMtOGVhNi0wYTNmYmU0ZmU5OWJcIixcInByb2plY3RJZFwiOlwiYmU0YzExNDMtYTRhZC00NzBhLWIyYzgtYzBkODgyZDAzOGQzXCIsXCJwcm9qZWN0VmVyc2lvbklkXCI6XCIxLjBcIixcInByb2plY3ROYW1lXCI6XCJhcHBjb21cIixcImFtZXhpb1ZlcnNpb25cIjpcIjQuMFwiLFwicHJvamVjdEdyb3VwSWRcIjpcImZmNDViZjgwLTg2NTktNGFmZC04ZjY3LTFmMmQxNTEyOWMyMFwifSIsImV4cCI6MTUyMzk0NzcwOX0.aZeNXxYMnEyIgYnhuEA91ZL40J-g0UVRYIdIgQflSzDsnEGHl2u-vfsuIn4YytDNj5pWXwm7Ro6pXxMYFfCwVQ'
    );
    this.stageData = null;
    this.stageData = [];

    this.unstagedTreeData = {
      demo: [
        {
          text: '.angular-cli.json',
          expanded: false,
          leaf: true,
          icon: 'fa fa-file-code-o',
          sourcePath:
            '/home/ubuntu/desire3d/projects/c2f900ce-0333-4a1c-a26c-5c4ebb92ae4a/73d5102b-3f84-4b81-89c3-f50edded6666/codeexplorer/.angular-cli.json'
        },
        {
          text: 'typings.d.ts',
          expanded: false,
          leaf: true,
          icon: 'fa fa-file-code-o',
          sourcePath:
            '/home/ubuntu/desire3d/projects/c2f900ce-0333-4a1c-a26c-5c4ebb92ae4a/73d5102b-3f84-4b81-89c3-f50edded6666/codeexplorer/src/typings.d.ts'
        },
        {
          text: 'index.html',
          expanded: false,
          leaf: true,
          icon: 'fa fa-file-code-o',
          sourcePath:
            '/home/ubuntu/desire3d/projects/c2f900ce-0333-4a1c-a26c-5c4ebb92ae4a/73d5102b-3f84-4b81-89c3-f50edded6666/codeexplorer/src/index.html'
        },
        {
          text: 'favicon.ico',
          expanded: false,
          leaf: true,
          icon: 'fa fa-file-code-o',
          sourcePath:
            '/home/ubuntu/desire3d/projects/c2f900ce-0333-4a1c-a26c-5c4ebb92ae4a/73d5102b-3f84-4b81-89c3-f50edded6666/codeexplorer/src/favicon.ico'
        },
        {
          text: 'package.json',
          expanded: false,
          leaf: true,
          icon: 'fa fa-file-code-o',
          sourcePath:
            '/home/ubuntu/desire3d/projects/c2f900ce-0333-4a1c-a26c-5c4ebb92ae4a/73d5102b-3f84-4b81-89c3-f50edded6666/codeexplorer/package.json'
        }
      ]
    };
  }

  ngOnInit() {
    let ipAddress: any;
    this.publicIpAddress = '18.188.202.61';
    this.getSourceCodeTreeData();
    // this.http.get('/api/user/person/findLoggedInUserInfo').subscribe(
    //   response => {
    //     ipAddress = response;
    //   },
    //   error => {},
    //   () => {
    //     this.publicIpAddress = ipAddress.response.publicIpAddress;
    //     this.getSourceCodeTreeData();
    //   }
    // );
  }

  getUnstagedClickData(data: any) {
    this.selectedTreeUnstageObject = data;
    if (data.text) {
      this.addStageFile = data.text;
    }
  }

  onAddFileClick(data: any) {
    // REMOVE FROM UNSTAGE
    this.unstagedTreeData.demo.forEach((child: any, index: any) => {
      if (this.selectedTreeUnstageObject == child) {
        this.unstagedTreeData.demo.splice(index, 1);
        console.log('deleted');
      }
    });

    // ADD DATA TO STAGE DATA
    this.addStageData();
  }
  addStageData() {
    if (this.selectedTreeUnstageObject != null) {
      this.stageData.push(this.selectedTreeUnstageObject);
      this.selectedTreeUnstageObject = null;
    }
  }
  getStageDataClick(data: any) {
    debugger;
    this.selectedTreeStageObject = data;
  }

  onRemoveFileClick(data: any) {
    //RETURN DATA TO UNSTAGE
    debugger;
    this.stageData.forEach((child: any, index: any) => {
      if (this.selectedTreeStageObject == child) {
        this.stageData.splice(index, 1);
      }
    });

    this.removeFormStageData();
  }
  removeFormStageData() {
    //RETURN DATA TO UNSTAGE

    if (this.selectedTreeStageObject != null) {
      this.unstagedTreeData.demo.push(this.selectedTreeStageObject);
      this.selectedTreeStageObject = null;
    }
  }
  resetFlag() {
    this.isHtml = false;
    this.isTypeScript = false;
    this.isJson = false;
    this.isCss = false;
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
    //     code for cookies - instance data display .............
    let filedata: any;
    const headers = new HttpHeaders({
      tokenid:
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJtdGVpZFwiOlwiMTFwYmM2ZGNmLTdiZGQtNDMwNC1iZjc5LWFkYTE0ZGMyZGU5N1wiLFwibG9naW5JZFwiOlwiNWJiNjAxZDgtZWI3YS00MjhlLTliM2QtZTI4N2M5ZjBlYTNiXCIsXCJ1c2VySWRcIjpcImMyZjkwMGNlLTAzMzMtNGExYy1hMjZjLTVjNGViYjkyYWU0YVwiLFwicGVyc29uSWRcIjpcIjNkMzJjN2RlLWQyMzAtNGFmOS1iN2FlLTZjZDllZjJiOWY3YVwiLFwiYXBwU2Vzc2lvbklkXCI6XCI5Mjc4YjU0Ny1mMzU3LTRlOTMtOGVhNi0wYTNmYmU0ZmU5OWJcIixcInByb2plY3RJZFwiOlwiYmU0YzExNDMtYTRhZC00NzBhLWIyYzgtYzBkODgyZDAzOGQzXCIsXCJwcm9qZWN0VmVyc2lvbklkXCI6XCIxLjBcIixcInByb2plY3ROYW1lXCI6XCJhcHBjb21cIixcImFtZXhpb1ZlcnNpb25cIjpcIjQuMFwiLFwicHJvamVjdEdyb3VwSWRcIjpcImZmNDViZjgwLTg2NTktNGFmZC04ZjY3LTFmMmQxNTEyOWMyMFwifSIsImV4cCI6MTUyMzk0NzcwOX0.aZeNXxYMnEyIgYnhuEA91ZL40J-g0UVRYIdIgQflSzDsnEGHl2u-vfsuIn4YytDNj5pWXwm7Ro6pXxMYFfCwVQ'
    });
    // const headers = new HttpHeaders({ tokenid: tokenId });
    const httpOptions = { headers: headers };
    this.http.get(appUrl, httpOptions).subscribe(
      res => {
        filedata = res;

        //     let filedata: any;
        //     let tokenId = this.cookie.get('tokenid');
        //
        //     const headers = new HttpHeaders({ tokenid: tokenId });
        //     const httpOptions = { headers: headers };
        //     this.http.get(appUrl, httpOptions).subscribe(
        //       res => {
        //         filedata = res;
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
    if (data.id === 'commitAllWindow') {
      this.commitAllWindow = true;
      this.showCommitAllWindow = true;
      this.pullWindow = false;
      this.commitWindow = false;
    } else if (data.id === 'pullWindow') {
      this.pullWindow = true;
      this.showPullWindow = true;
      this.commitAllWindow = false;
    } else if (data.id === 'commitWindow') {
      this.commitWindow = true;
      this.showCommitWindow = true;
      this.commitAllWindow = false;
      this.pullWindow = false;
    }
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
  onPullRequestClick(data: any) {
    this.inValidMessageData = [];
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
  }
  onCommitDataClick(data: any) {
    this.inValidMessageData = [];
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
