/**
 * Created by pratik on 15/2/18.
 */
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'code-explorer',
  template: `
<amexio-card [header]="true"
[footer]="false"
[show]="true">
    <amexio-header>
      Project Explore
    </amexio-header>
    <amexio-body>
     <amexio-row>
            <amexio-column [size]="4">
                <ng-container *ngIf="fileStructuredata">
                    <amexio-treeview (nodeClick)="getFileData($event)" [data]="fileStructuredata">
                        <ng-template #amexioTreeTemplate let-tree let-icon="icon" let-node="node">
                            <i [attr.class]="node.icon"></i> &nbsp; {{tree.text}}
                        </ng-template>
                    </amexio-treeview>
                </ng-container>
            </amexio-column>
            <amexio-column [size]="6">
                <ng-container *ngIf="isHtml">
                {{sourceCode}}
                </ng-container>
                <ng-container *ngIf="isTypeScript">
                {{sourceCode}}
                </ng-container>
            </amexio-column>
        </amexio-row>
    </amexio-body>
</amexio-card>

 `
})
export class CodeExplorerComponent implements OnInit {
  sourceCode: any = '';

  isHtml: boolean;

  isTypeScript: boolean;

  fileStructuredata: any = [];

  publicIpAddress: any;

  constructor(public http: HttpClient) {}

  ngOnInit() {
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

  getSourceCodeTreeData() {
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
          console.log('filestr', responsedata.children);
          this.fileStructuredata = responsedata.children;
        }
      }
    );
  }

  getFileData(data: any) {
    let appUrl = 'http://host:9870/projectExplorer/findSourceCode';
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
            console.log('sourc', responseData.source);
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
