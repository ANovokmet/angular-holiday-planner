import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AngularHolidayPlannerModule } from 'projects/angular-holiday-planner/src/public-api';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AngularHolidayPlannerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
