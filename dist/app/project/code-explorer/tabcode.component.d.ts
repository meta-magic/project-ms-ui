import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export declare class TabcodeComponent implements OnInit {
    http: HttpClient;
    sourceCode: string;
    isHtml: boolean;
    isJson: boolean;
    isTypeScript: boolean;
    isCss: boolean;
    publicIpAddress: any;
    protocol: any;
    constructor(http: HttpClient);
    ngOnInit(): void;
    getIpAddress(): any;
    getFileDataBtnClick(data: any, publicIpAddress: any, protocol: any): void;
    resetFlag(): void;
}
