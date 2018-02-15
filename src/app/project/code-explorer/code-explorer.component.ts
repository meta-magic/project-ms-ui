/**
 * Created by pratik on 15/2/18.
 */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'code-explorer',
  template: `
   <amexio-card>
     <amexio-header>Code Explorer</amexio-header>
     <amexio-body>
       <div style="height: 300px">
         CODE Explorer here
       </div>
     </amexio-body>
   </amexio-card>

 `
})
export class CodeExplorerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
