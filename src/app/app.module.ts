import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AngularHolidayPlannerModule } from 'projects/angular-holiday-planner/src/public-api';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppResourcesComponent } from './app-resources/app-resources.component';
import { AppCalendarComponent } from './app-calendar/app-calendar.component';

const routes: Routes = [
    { path: 'resources', component: AppResourcesComponent },
    { path: 'calendar', component: AppCalendarComponent },
    { path: '', redirectTo: '/resources', pathMatch: 'full' }
];

@NgModule({
    declarations: [
        AppComponent,
        AppResourcesComponent,
        AppCalendarComponent
    ],
    imports: [
        BrowserModule,
        AngularHolidayPlannerModule,
        // BrowserAnimationsModule,
        // LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        // MatSidenavModule,
        MatIconModule,
        // MatListModule,
        RouterModule.forRoot(routes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
