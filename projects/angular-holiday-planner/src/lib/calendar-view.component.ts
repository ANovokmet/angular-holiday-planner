import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import * as dayjs from 'dayjs';
import * as weekday from 'dayjs/plugin/weekday';
import * as isoWeek from 'dayjs/plugin/isoWeek';

interface Month {
    startOf: dayjs.Dayjs;
    firstWeekOffset: number;
    weeks: Day[][];
}

interface Day {
    value: number;
    date: dayjs.Dayjs;
    key: string;
    class: string | string[];
    weekend: boolean;
}

const DAYS_PER_WEEK = 7;
@Component({
    selector: 'ahp-calendar-view',
    templateUrl: './calendar-view.component.html',
    styleUrls: ['./calendar-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarViewComponent implements OnInit {
    months: Month[] = [];
    weekDayNames: any[];
    numCols = 7;
    customDays: any;
    _classes: { [key: string]: string | string[] };

    constructor() {
        dayjs.extend(weekday);
        dayjs.extend(isoWeek);

        this.customDays = {};
        const today = dayjs().startOf('day');
        this.customDays[this.getKey(today)] = 'today';

        this.weekDayNames = this.getWeekDayNames();
    }

    @Input()
    set days(value: { date: dayjs.Dayjs, class: string | string[] }[]) {
        this._classes = {};
        for (const item of value) {
            const key = this.getKey(item.date);
            const customClass = this.customDays[key];
            this._classes[key] = customClass ? [customClass, item.class] : item.class;
        }
    }

    @Input()
    from: dayjs.Dayjs = dayjs().startOf('year').add(6, 'month');

    @Input()
    to: dayjs.Dayjs = dayjs().startOf('year').add(12, 'month');

    ngOnInit(): void {
        this.createMonths();
        console.log(this.months);
    }

    getClass(day: Day) {

    }

    private getWeekDayNames(): string[] {
        const weekDayNames = [];
        let c = dayjs().startOf('isoWeek');
        for (let i = 0; i < DAYS_PER_WEEK; i++) {
            weekDayNames.push(c.format('dd')[0]);
            c = c.add(1, 'day');
        }
        return weekDayNames;
    }

    private createMonths() {
        let current = this.from;
        this.months = [];
        while (current < this.to) {
            const _firstWeekOffset = (DAYS_PER_WEEK + current.day() - current.startOf('isoWeek').day()) % DAYS_PER_WEEK;
            const week = this._createWeekCells(current, _firstWeekOffset);
            this.months.push(week);
            current = current.add(1, 'month');
        }
    }

    getKey(value: dayjs.Dayjs): string {
        return value.format('DDMMYYYY');
    }

    _dateClass(date: dayjs.Dayjs) {

        const classes: string[] = [];
        const d = date.day();
        if (d === 6 || d === 0) {
            classes.push('weekend');
        }

        const k = date.format('DDMMYYYY');
        const c = this.customDays[k];
        if (c) {
            classes.push(c.class);
        }

        return classes;
    }

    _cellClicked(item: Day, event: MouseEvent) {
        console.log(item.date.format());
    }

    private _createWeekCells(startOfMonth: dayjs.Dayjs, _firstWeekOffset: number) {
        const daysInMonth = startOfMonth.daysInMonth();
        let current = startOfMonth;
        const month: Month = {
            startOf: startOfMonth,
            firstWeekOffset: _firstWeekOffset,
            weeks: [[]]
        };
        for (let i = 0, cell = _firstWeekOffset; i < daysInMonth; i++, cell++) {
            if (cell === DAYS_PER_WEEK) {
                month.weeks.push([]);
                cell = 0;
            }

            month.weeks[month.weeks.length - 1].push({
                date: current,
                value: current.date(),
                key: this.getKey(current),
                class: this._dateClass(current),
                weekend: current.day() === 6 || current.day() === 0
            });
            current = current.add(1, 'day');
        }

        return month;
    }
}
