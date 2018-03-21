/**
 * Created by pratik on 15/2/18.
 */
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'code-explorer',
  template: `
<amexio-row>
<amexio-column [size]="12">
<amexio-card [header]="true"
[footer]="false"
[body-height]="82"
[show]="true">
    <amexio-header>
      Project Code Explorer
    </amexio-header>
    <amexio-body>
     <amexio-row>
            <amexio-column [size]="3">
            <amexio-card  [header]="true" [footer]="false" [show]="true" [body-height]="82" [footer-align]="'right'">
          <amexio-header>
               Code Structure
          </amexio-header>
          <amexio-body>
                <ng-container *ngIf="fileStructuredata">
                <amexio-tree-filter-view (nodeClick)="getFileData($event)" [data]="fileStructuredata" [data-reader]="'response'">
                        <ng-template #amexioTreeTemplate let-tree let-icon="icon" let-node="node">
                            <i [attr.class]="node.icon"></i> &nbsp; {{tree.text}}
                        </ng-template>
                        </amexio-tree-filter-view>
                </ng-container>
                </amexio-body>
                </amexio-card>
            </amexio-column>
           
            <amexio-column [size]="9">
            
            <amexio-panel [header]="false"
                expanded="true" [height]="700">
                <div style = "height:500px;">   
            
      <ng-container *ngIf="isHtml">
      {{sourceCode}}
      </ng-container>
      <ng-container *ngIf="isTypeScript">
      {{sourceCode}}
      </ng-container> 
      </div>
                </amexio-panel>
               
            </amexio-column>
            
        </amexio-row>
    </amexio-body>
</amexio-card>
</amexio-column>
</amexio-row>
 `,
  styles: [
    `
   .panel-panel{
     height:500px!important;
   }
   `
  ]
})
export class CodeExplorerComponent implements OnInit {
  sourceCode: any = '';

  isHtml: boolean;

  isTypeScript: boolean;

  fileStructuredata: any;

  publicIpAddress: any;

  constructor(public http: HttpClient) {
    this.fileStructuredata = {
      response: []
    };
  }

  ngOnInit() {
    this.getSourceCodeTreeData();

    let ipAddress: any;
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

  //Method to get Source Code Data in tree format
  getSourceCodeTreeData() {
    // let appUrl = 'http://host:8080/code-pipeline-service/projectExplorer/explorer';
    let appUrl = 'http://host:9870/projectExplorer/explorer';
    if (this.publicIpAddress) {
      appUrl = appUrl.replace('host', this.publicIpAddress);
    } else {
      appUrl = appUrl.replace('host', 'localhost');
    }
    let filedata: any;

    this.http.get(appUrl).subscribe(
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
          this.fileStructuredata.response = responsedata.children;
        }
      }
    );
  }

  //Method to Get File Data
  getFileData(data: any) {
    let appUrl =
      'http://host:8080/code-pipeline-service/projectExplorer/findSourceCode';
    // let appUrl = 'http://host:9870/projectExplorer/findSourceCode';
    if (this.publicIpAddress) {
      appUrl = appUrl.replace('host', this.publicIpAddress);
    } else {
      appUrl = appUrl.replace('host', 'localhost');
    }
    if (data.leaf) {
      let filedata: any;
      let sourcePathJSON: any = {};
      sourcePathJSON['sourcePath'] = data.sourcePath;
      this.http.post(appUrl, sourcePathJSON).subscribe(
        res => {
          filedata = res;
        },
        err => {
          console.log('Error occured');
        },
        () => {
          let responseData = JSON.parse(filedata.response);
          if (responseData.source) {
            this.sourceCode = responseData.source;
          }
          if (responseData.fileType && responseData.fileType === 'html') {
            this.isHtml = true;
            this.isTypeScript = false;
          } else {
            this.isHtml = false;
            this.isTypeScript = true;
          }
        }
      );
    }
  }
}
