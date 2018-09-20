/**
 * Created by dattaram on 10/4/18.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
/* Import prism core */
require("prismjs/prism");
/* Import the language you need to highlight */
require("prismjs/components/prism-typescript");
var PrismComponent = (function () {
    function PrismComponent(_renderer, _el) {
        this._renderer = _renderer;
        this._el = _el;
        this.nativeElement = _el.nativeElement;
    }
    PrismComponent.prototype.ngAfterViewInit = function () {
        this.preNode = this._renderer.createElement('pre');
        this.codeNode = this._renderer.createElement('code');
        this._renderer.addClass(this.codeNode, 'language-' + this.language);
        this._renderer.appendChild(this.nativeElement, this.preNode);
        this._renderer.appendChild(this.preNode, this.codeNode);
        this.codeNode.textContent = this.code;
        Prism.highlightElement(this.codeNode);
    };
    return PrismComponent;
}());
__decorate([
    core_1.Input()
], PrismComponent.prototype, "code");
__decorate([
    core_1.Input()
], PrismComponent.prototype, "language");
PrismComponent = __decorate([
    core_1.Component({
        selector: 'prism-block',
        template: ""
    })
], PrismComponent);
exports.PrismComponent = PrismComponent;
