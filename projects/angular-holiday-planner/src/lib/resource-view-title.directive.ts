import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[resourceViewTitle]' })
export class ResourceViewTitleDirective {
    constructor(public template: TemplateRef<any>) { }
}
