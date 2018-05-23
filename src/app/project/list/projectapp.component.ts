import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'project-app',
  template: `
<iframe #iframe1 style="width: 100%; height: 600px" src="" frameborder="0" allowfullscren="allowfullscren"></iframe>
`
})
export class ProjectAppComponent implements OnInit {
  @ViewChild('iframe1') iframe: ElementRef;
  publicIpAddress: any;
  previewURL: any;
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.getHostDetails();
  }
  ngAfterViewInit() {}

  getHostDetails() {
    let ipAddress: any;

    this.http.post('/api/pipeline/Instance/getHostDetails', {}).subscribe(
      response => {
        ipAddress = response;
      },
      err => {},
      () => {
        if (ipAddress.response) {
          this.publicIpAddress = ipAddress.response.hostIpAddress;
          this.previewURL = ipAddress.response.previewURL;
          this.onPreview();
        } else {
          this.publicIpAddress = '';
          this.previewURL = '';
        }
      }
    );
  }

  onPreview() {
    let previewResponse: any;
    this.http.get('/api/project/appPreview/preview').subscribe(
      response => {
        previewResponse = response;
      },
      err => {},
      () => {
        if (previewResponse != null) {
          if (this.previewURL && this.previewURL != '') {
            this.iframe.nativeElement.src = this.previewURL;
          } else {
            let ip =
              this.publicIpAddress != null ? this.publicIpAddress : 'localhost';
            let projectName = previewResponse.response;
            this.iframe.nativeElement.src =
              'http://' + ip + '/' + projectName + '/' + 'index.html';
          }
        }
      }
    );
  }
}
