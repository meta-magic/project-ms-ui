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
            <amexio-button [type]="'success'" [tooltip]="'Files'"(onClick)="onFileClick($event)" [icon]="'fa fa-file-o'" > </amexio-button>
          </amexio-header>
          
          <amexio-body>
             
              <ng-container *ngIf="fileStructuredata && fileDataFromBack">
                <amexio-treeview [data]="fileStructuredata" (nodeClick)="getFileData($event)" [data-reader]="'children'">
                </amexio-treeview>
              </ng-container>
          

            <ng-container *ngIf="treeViewData">
              <amexio-row>
                <amexio-column size="12">
                  <amexio-accordion>
                    <amexio-accordion-tab header="Unstaged Changes" active="true">
                      <amexio-row>
                        <amexio-column size="12">
                          <amexio-tree-filter-view  [data]="File" [data-reader]="'item'">
                          </amexio-tree-filter-view>
                        </amexio-column>
                      </amexio-row>
                    </amexio-accordion-tab>
                    <amexio-accordion-tab header="Staged Changes">
                      <amexio-row>
                        <amexio-column size="12">
                          <amexio-tree-filter-view  [data]="File" [data-reader]="'item'">
                          </amexio-tree-filter-view>  
                        </amexio-column>
                      </amexio-row>
                    </amexio-accordion-tab>
                  </amexio-accordion>
                </amexio-column>
              </amexio-row>
            </ng-container>
            
          </amexio-body>
        </amexio-card>
      </amexio-column>

      <amexio-column [size]="9"   >
        <amexio-card [body-height]="79">
          <amexio-body>
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
  sourceCode: any;

  isHtml: boolean;

  isJson: boolean;

  isTypeScript: boolean;

  fileStructuredata: any;

  publicIpAddress: any;

  treeViewData: boolean;

  fileDataFromBack: boolean;

  isCss: boolean;

  File: any;
  mainData: any;

  constructor(
    public http: HttpClient,
    private cookie: CookieService,
    public cdf: ChangeDetectorRef
  ) {
    this.resetFlag();
    this.treeViewData = false;
    this.fileDataFromBack = true;
  }

  ngOnInit() {
    let ipAddress: any;
    this.publicIpAddress = '18.216.48.183';
    this.getSourceCodeTreeData();
    /* this.http.get('/api/user/person/findLoggedInUserInfo').subscribe(
     response => {
     ipAddress = response;
     },
     error => {
     },
     () => {
     this.publicIpAddress = ipAddress.response.publicIpAddress;
     this.getSourceCodeTreeData();
     }
     ); */
  }

  resetFlag() {
    this.isHtml = false;
    this.isTypeScript = false;
    this.isJson = false;
    this.isCss = false;
  }

  // on button click the files are display here in tree formate
  onFileClick() {
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
}
