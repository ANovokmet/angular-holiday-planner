# AngularHolidayPlanner

This library consists of two calendar components. *Resource view* which displays a scrollable overview of several people's calendars through months, and a *Calendar view* which displays a single calendar containing several months, and shows a single person's calendar.

You will understand once you see the [Demo](https://anovokmet.github.io/angular-holiday-planner).

# Installation

```
npm install angular-holiday-planner --save
```

## Usage

```javascript
import { AngularHolidayPlannerModule } from 'projects/angular-holiday-planner';

@NgModule({
    ...
    imports: [
        ...
        AngularHolidayPlannerModule
    ],
    ...
})
export class AppModule { }
```

# Components

## Resource view

```html
<ahp-resource-view [rows]="rows"></ahp-resource-view>
```

### Row

Options for a single row in the view.

- id - Unique ID of row.
- title {`string`} - Title used by the default row template.
- subtitle {`string`} - Subtitle used by the default row template.
- img {`string`} - URL to an image. Used by the default row template.
- days {`Day[]`} - Days to mark on the resource view.

### Day

Options for a single day (of resource) in the view.

- `date` (DayJs) - Date of rendered day.
- `class` (string|string[]) - Classes to apply to the date cell.

### Inputs

- `rows` (Resource[]) - List of resource objects that will render in the component.
- `startDate` {`dayjs.Dayjs`} - Date the view will center on initially. By default this is the current date.
- `sideContainerWidth` {`string`} - Width of the side container, eg. '200px'
- `maxDate` {`Dayjs`} - Maximum date the view will be scrollable to. No more days will load upon reaching this date. Infinite scroll must be true for this property to work.
- `minDate` {`Dayjs`} - Minimum date the view will be scrollable to. No more days will load upon reaching this date. Infinite scroll must be true for this property to work.
- `infiniteScroll` {`bool`} - if true more days will load upon scrolling to the end of the container.
- `customDays` - Object containing custom days on the time line. Can specify custom classes to apply on a specific day, eg. holiday. Keys of object should be dates in 'DDMMYYYY' format, and values should be `Day` objects containing CSS classes to apply.

### Outputs

- `rowClick` - Emits when a resource is clicked.
- `dayClick` - Emits when a specific resource date is clicked.
- `headerClick` - Emits when date header is clicked (name of day, eg. "M")

### Methods

- `centerOn(date, behavior = 'smooth')` - Scrolls the view to a specific day.

### Directives

- `*resourceViewRow` - Custom template to show as a row header (resource info card).
- `*resourceViewTitle` - Custom template to show instead of the current time range displayed in the title.

## Calendar view

```html
<ahp-calendar-view [days]="days"></ahp-calendar-view>
```

### Inputs

- `days` {`Day[]`} - List of day objects to display on the calendar.
- `from` {`DayJs`} - Date the calendar starts on.
- `to` {`DayJs`} - Date the calendar ends on.

### Outputs

- `dayClick` - Emits when a specific resource date is clicked.

## Development

To start a development build

```
    npm run start
```

The app should be running at `http://localhost:4200`.