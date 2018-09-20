/**
 * Created by dattaram on 10/4/18.
 */
import { Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import 'prismjs/prism';
import 'prismjs/components/prism-typescript';
export declare class PrismComponent implements AfterViewInit {
    private _renderer;
    private _el;
    code: string;
    language: string;
    private preNode;
    private codeNode;
    private nativeElement;
    ngAfterViewInit(): void;
    constructor(_renderer: Renderer2, _el: ElementRef);
}
