import { Component } from '@angular/core';
import * as dayjs from 'dayjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'demo';
    rows: any[];
    selectedRow: any;

    constructor() {
        const startOfYear = dayjs().startOf('year').add(6, 'month');
        function rnd() {
            return startOfYear.add(Math.floor(Math.random() * 365), 'day');
        }

        const colors = ['orange', 'green', 'purple'];

        const images = [
            'assets/woman1.jpg',
            'assets/woman2.jpg',
            'assets/man2.jpg',
            'assets/woman3.jpg',
            'assets/man1.jpg',
        ];



        this.rows = [];
        for (let i = 0; i < 8; i++) {
            const days = [];
            for (let j = 0; j < 30; j++) {

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

            this.rows.push({
                id: i,
                title: 'Katarina Patunec',
                subtitle: 'Customer Services',
                img: images[i % 5],
                days
            });
        }
    }

    onDayClick(event) {
        console.log('day clicked: ', event);
    }

    onHeaderClick(event) {
        console.log('header clicked: ', event);
    }

    onRowClick(event) {
        console.log('row clicked: ', event);
        this.selectedRow = event.row;
    }
}
