import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';

@Component({
    selector: 'app-app-calendar',
    templateUrl: './app-calendar.component.html',
    styleUrls: ['./app-calendar.component.scss']
})
export class AppCalendarComponent implements OnInit {
    days: any[];

    from = dayjs().startOf('year').add(6, 'month');
    to = dayjs().endOf('year');

    constructor() {
        const startOfYear = dayjs().startOf('year').add(6, 'month');
        function rnd() {
            return startOfYear.add(Math.floor(Math.random() * 365), 'day');
        }
        const colors = ['orange', 'green', 'purple'];

        const days = [];
        for (let j = 0; j < 24; j++) {

            const duration = Math.floor(Math.random() * 5);
            const classes = colors[j % 3];


            let d = rnd();
            for (let k = 0; k < duration; k++) {
                days.push({
                    date: d,
                    class: classes
                });
                d = d.add(1, 'day');
            }
        }
        this.days = days;
    }

    ngOnInit(): void {
    }

    onForward(): void {
        this.from = this.from.add(6, 'month');
        this.to = this.to.add(6, 'month');
    }

    onBack(): void {
        this.from = this.from.add(-6, 'month');
        this.to = this.to.add(-6, 'month');
    }

    onDayClick(event) {
        console.log('day clicked: ', event);
    }

}
