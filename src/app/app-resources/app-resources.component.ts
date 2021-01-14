import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';

@Component({
    selector: 'app-app-resources',
    templateUrl: './app-resources.component.html',
    styleUrls: ['./app-resources.component.scss']
})
export class AppResourcesComponent implements OnInit {

    rows: any[];
    selectedRow: any;

    constructor() { 

        const startOfYear = dayjs().startOf('year');
        function rnd() {
            return startOfYear.add(Math.floor(Math.random() * 365), 'day');
        }

        const colors = ['orange', 'green', 'purple'];

        this.rows = [{
            id: 1,
            title: 'Krystalle Logie',
            subtitle: 'Senior Sales Associate',
            img: 'assets/woman1.jpg'
        }, {
            id: 2,
            title: 'Izabel Riveles',
            subtitle: 'Senior Financial Analyst',
            img: 'assets/woman2.jpg'
        }, {
            id: 3,
            title: 'Rancell Qualtrough',
            subtitle: 'Information Systems Manager',
            img: 'assets/man2.jpg'
        }, {
            id: 4,
            title: 'Pearle Vowels',
            subtitle: 'Recruiter',
            img: 'assets/man1.jpg'
        }, {
            id: 5,
            title: 'Marysa Rable',
            subtitle: 'VP Product Management',
            img: 'assets/woman3.jpg'
        }];

        for (let i = 0; i < 5; i++) {
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

            this.rows[i].days = days;
        }

    }

    ngOnInit(): void {
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
