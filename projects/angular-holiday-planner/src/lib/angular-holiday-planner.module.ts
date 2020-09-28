import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarViewComponent } from './calendar-view.component';
import { DateFormatPipe } from './date-format.pipe';
import { ResourceViewComponent } from './resource-view.component';
import { ResourceViewRowDirective } from './resource-view-row.directive';
import { ResourceViewTitleDirective } from './resource-view-title.directive';



@NgModule({
    declarations: [
        CalendarViewComponent,
        DateFormatPipe,
        ResourceViewComponent,
        ResourceViewRowDirective,
        ResourceViewTitleDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        CalendarViewComponent,
        ResourceViewComponent,
        ResourceViewRowDirective,
        ResourceViewTitleDirective
    ]
})
export class AngularHolidayPlannerModule { }
