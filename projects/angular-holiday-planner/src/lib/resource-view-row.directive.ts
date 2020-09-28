import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[resourceViewRow]' })
export class ResourceViewRowDirective {
    constructor(public template: TemplateRef<any>) { }
}
