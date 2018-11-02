import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ComponentFactoryResolver
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TabcodeComponent } from './tabcode.component';
import { CookieService } from 'platform-commons';
import { NotificationService } from 'platform-commons';
@Component({
  selector: 'code-explorer',
  template: `
    <amexio-row>
      <amexio-column [size]="3">
        <amexio-card [header]="false" [footer]="false" [show]="true" [header-align]="'center'" [body-height]="80"
                     [footer-align]="'right'">

          <amexio-body>
          <amexio-tab-view [action]="true" [body-height]="80">
          <amexio-tab-action>
                 <amexio-image style="cursor:pointer;" [icon-class]="'fa fa-refresh fa-lg'" [tooltip]="'Refresh'" (onClick)="onRefreshClick()"></amexio-image>
          </amexio-tab-action>
          <amexio-tab title="Source Code" [active]="true" [icon]="'fa fa-file-o'">
              <amexio-treeview [data-reader]="'children'" [data]="fileStructuredata" (nodeClick)="checkActiveTab(sourcetab,$event)"></amexio-treeview>
          </amexio-tab>
           
             </amexio-tab-view>
          </amexio-body>
        </amexio-card>
      </amexio-column>
      <amexio-column [size]="9">
        <amexio-card [body-height]="80" [header]="false" [footer]="false" [show]="true" [header-align]="'left'">

        <amexio-body>

              <amexio-tab-view #sourcetab [closable]="true" [tab-position]="'top'" [header-align]="'left'" [body-height]="80">
</amexio-tab-view>
          </amexio-body>
        </amexio-card>

      </amexio-column>
        
 <project-notification></project-notification>

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
          `,
  styles: [
    `
      .panel-panel {
        height: 488px !important;
      }
    `
  ]
})
export class CodeExplorerComponent implements OnInit {
  isHtml: boolean;
  isJson: boolean;
  isTypeScript: boolean;
  isCss: boolean;

  asyncFlag: boolean = false;

  showCommitWindow: boolean;
  showPullWindow: boolean;

  openingWindowFlag: boolean;
  URLDisabled: boolean;
  showErrorDialogue: boolean = false;

  File: any;
  fileStructuredata: any;
  publicIpAddress: any;
  sourceCode: any;
  protocol: any;
  inValidMessageData: any[] = [];
  unstagedTreeData: any;

  stageDataTree: any[] = [];
  syncRepository: any;

  stageFileSelected: any[] = [];
  unStageFileSelected: any[] = [];

  selectedTreeUnstageObject: any;
  selectedTreeStageObject: any;
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
    this.URLDisabled = false;

    this.resetFlag();
    this.stageDataTree = [];
    this.unstagedTreeData = [];
    this.msgData = [];
  }

  ngOnInit() {
    this.gethostdeatils();
  }
  gethostdeatils() {
    this.getSourceCodeTreeData();

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
  /* ``````````````````````````````````````````````````STAGE DATA TREE OPRATION HERE*/

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
    let title = data.text;
    if (!data.children && !sourcetab.setActiveTab(data.text)) {
      this.addTab(sourcetab, data);
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
        cmp.getFileDataBtnClick(data, '', '');

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
    let filedata: any;
    let tokenId = this.cookie.get('tokenid');

    const headers = new HttpHeaders({ tokenid: tokenId });
    const httpOptions = { headers: headers };
    this.http.get('/api/codepipeline/cps/explorer', httpOptions).subscribe(
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
          this.fileStructuredata = {
            children: []
          };
          this.fileStructuredata = responsedata.children;
        }
      }
    );
  }

  // CLOSE DIALOGUE BOX
  closeDialogue() {
    this.showErrorDialogue = false;
  }

 
}

//((git|ssh|http(s)?)|(git@[\w\.]+))(:(//)?)([\w\.@\:/\-~]+)(\.git)(/)?
