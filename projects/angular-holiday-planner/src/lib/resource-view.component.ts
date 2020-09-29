import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter,
    HostListener, Input, NgZone, OnInit, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import * as dayjs from 'dayjs';
import * as minMax from 'dayjs/plugin/minMax';
import { debounce, throttle } from 'lodash-es';
import { ResourceViewRowDirective } from './resource-view-row.directive';
import { ResourceViewTitleDirective } from './resource-view-title.directive';

const DAY_WIDTH = 40;
const SCROLLABLE_THRESHOLD_DELTA = 200;
const SCROLLABLE_RANGE_EXPAND_WIDTH = 400;

interface Day {
    title: string;
    value: number;
    date: dayjs.Dayjs;
    key: string;
    class: string | string[];
    today: boolean;
    left: number;
    weekend: boolean;
}

export interface Resource {
    id: number;
    title: string;
    subtitle?: string;
    img?: string;
    days: { date: dayjs.Dayjs; class: string | string[]; }[];
}

export interface RowClickEvent {
    event: MouseEvent;
    row: Resource;
}

export interface DayClickEvent {
    event: MouseEvent;
    row: Resource;
    date: dayjs.Dayjs;
}

export interface HeaderClickEvent {
    event: MouseEvent;
    date: dayjs.Dayjs;
}

@Component({
    selector: 'ahp-resource-view',
    templateUrl: './resource-view.component.html',
    styleUrls: ['./resource-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceViewComponent implements OnInit, AfterViewInit {

    constructor(private cdr: ChangeDetectorRef, private zone: NgZone) {
        this.checkScrollableThresholdHit = debounce(this._checkScrollableThresholdHit.bind(this), 250);
        this.updateRange = throttle(this._updateRange.bind(this), 250);
        dayjs.extend(minMax);

        this._referenceDate = this.startDate;

        this._scrollableLeft = -1200;
        this._scrollableRight = 1200;
        this._scrollableFrom = this.positionToDate(this._scrollableLeft);
        this._scrollableTo = this.positionToDate(this._scrollableRight);
        this._scrollableLeftThreshold = this._scrollableLeft + SCROLLABLE_THRESHOLD_DELTA;
        this._scrollableRightThreshold = this._scrollableRight - SCROLLABLE_THRESHOLD_DELTA;

        this.createDays();
    }

    @Input()
    set rows(value: Resource[]) {
        this._classes = {};
        const result: any[] = [];
        for (const row of value) {
            this._classes[row.id] = {};
            if (row.days) {
                for (const day of row.days) {
                    const key = this.getKey(day.date);
                    this._classes[row.id][key] = day.class;
                }
            }
            result.push(row);
        }
        this._rows = result;
    }
    get rows(): Resource[] {
        return this._rows;
    }

    @Input()
    startDate: dayjs.Dayjs = dayjs().startOf('day');

    @Input()
    sideContainerWidth = '200px';

    @Input()
    maxDate: dayjs.Dayjs = dayjs().startOf('year').add(12, 'month');

    @Input()
    minDate: dayjs.Dayjs = dayjs().startOf('year').add(6, 'month');

    @Input()
    infiniteScroll = true;

    @Input()
    customDays = {};

    @ViewChild('scrollHeader', { static: true }) scrollHeader: ElementRef<HTMLElement>;
    @ViewChild('scrollBody', { static: true }) scrollBody: ElementRef<HTMLElement>;

    _classes: { [rowId: number]: { [key: string]: any } } = {};
    days: Day[] = [];
    to: dayjs.Dayjs;
    from: dayjs.Dayjs;
    today: Day;

    private _rows: Resource[] = [];
    private _today: dayjs.Dayjs = dayjs();
    private _referenceDate: dayjs.Dayjs;
    private _referenceScrollLeft: number;
    private _scrollableFrom: dayjs.Dayjs;
    private _scrollableTo: dayjs.Dayjs;
    private _scrollableLeft: number;
    private _scrollableRight: number;
    private _scrollableLeftThreshold: number;
    private _scrollableRightThreshold: number;
    private checkScrollableThresholdHit: (scrollLeft: number, clientWidth: number) => void;
    private updateRange: (left: number, right: number) => void;

    @ContentChild(ResourceViewRowDirective) rowTemplate: ResourceViewRowDirective;
    @ContentChild(ResourceViewTitleDirective) titleTemplate: ResourceViewTitleDirective;

    @Output()
    public rowClick = new EventEmitter<RowClickEvent>();

    @Output()
    public dayClick = new EventEmitter<DayClickEvent>();

    @Output()
    public headerClick = new EventEmitter<HeaderClickEvent>();

    createDays(): void {
        let current = this._scrollableFrom;
        this.days = [];
        let left = 0;
        while (current < this._scrollableTo) {
            const key = this.getKey(current);
            const day = {
                title: current.format('dd')[0],
                value: current.date(),
                key,
                date: current,
                class: this._dateClass(current),
                today: current.isSame(this._today, 'date'),
                left,
                weekend: current.day() === 6 || current.day() === 0
            };
            if (day.today) {
                this.today = day;
            }
            this.days.push(day);
            left += DAY_WIDTH;
            current = current.add(1, 'day');
        }
    }

    ngAfterViewChecked() {
        console.log('view checked')
    }

    getKey(value: dayjs.Dayjs): string {
        return value.format('DDMMYYYY');
    }

    ngAfterViewInit(): void {
        this.centerOn(this.startDate, 'auto');
        this.cdr.detectChanges();
    }

    ngOnInit(): void {
        const { scrollLeft, clientWidth } = this.scrollBody.nativeElement;
        this._updateRange(scrollLeft, scrollLeft + clientWidth);
        this._referenceScrollLeft = this.dateToPosition(this._referenceDate);
        this.zone.runOutsideAngular(() => {
            this.scrollBody.nativeElement.addEventListener('scroll', this.onBodyScroll.bind(this));
        });
    }

    centerOn(date: dayjs.Dayjs, behavior: ScrollBehavior = 'smooth'): void {
        const { clientWidth } = this.scrollBody.nativeElement;
        const left = this.dateToPosition(date);
        this.scrollBody.nativeElement.scrollTo({
            left: left + DAY_WIDTH / 2 - clientWidth / 2.0,
            behavior
        });
    }

    onBodyScroll(event: Event): void {
        const { scrollLeft, clientWidth } = this.scrollBody.nativeElement;
        this.scrollHeader.nativeElement.scrollLeft = scrollLeft;

        this.checkScrollableThresholdHit(scrollLeft, clientWidth);
        this.updateRange(scrollLeft, scrollLeft + clientWidth);
    }

    _checkScrollableThresholdHit(scrollLeft, clientWidth): void {
        if (scrollLeft - this._referenceScrollLeft < this._scrollableLeftThreshold) {
            console.debug('left threshold hit');
            this._expandScrollableRange(this._scrollableLeft - SCROLLABLE_RANGE_EXPAND_WIDTH, this._scrollableRight);
        }

        if (scrollLeft + clientWidth - this._referenceScrollLeft > this._scrollableRightThreshold) {
            console.debug('right threshold hit');
            this._expandScrollableRange(this._scrollableLeft, this._scrollableRight + SCROLLABLE_RANGE_EXPAND_WIDTH);
        }
    }

    _expandScrollableRange(scrollableLeft: number, scrollableRight: number): void {
        const scrollableLeftChange = this._scrollableLeft - scrollableLeft;

        this._scrollableLeft = scrollableLeft;
        this._scrollableRight = scrollableRight;

        this._scrollableFrom = this.minDate && !this.infiniteScroll ?
            dayjs.max(this.positionToDate(this._scrollableLeft), this.minDate) : this.positionToDate(this._scrollableLeft);
        this._scrollableTo = this.maxDate && !this.infiniteScroll ?
            dayjs.min(this.positionToDate(this._scrollableRight), this.maxDate) : this.positionToDate(this._scrollableRight);
        this._scrollableLeftThreshold = this._scrollableLeft + SCROLLABLE_THRESHOLD_DELTA;
        this._scrollableRightThreshold = this._scrollableRight - SCROLLABLE_THRESHOLD_DELTA;

        this.scrollBody.nativeElement.scrollLeft += scrollableLeftChange;
        this.scrollHeader.nativeElement.scrollLeft = this.scrollBody.nativeElement.scrollLeft;

        this.createDays();
        this.cdr.detectChanges();

        this._referenceScrollLeft = this.dateToPosition(this._referenceDate);
    }

    _updateRange(left: number, right: number): void {
        const startIndex = Math.floor(left / DAY_WIDTH);
        const endIndex = Math.floor(right / DAY_WIDTH) - 1;

        const from = this.days[startIndex].date;
        const to = this.days[endIndex].date;

        this.from = from;
        this.to = to;

        this.cdr.detectChanges();
    }

    _dateClass(date: dayjs.Dayjs): string[] {
        const classes: string[] = [];
        const d = date.day();
        if (d === 6 || d === 0) {
            classes.push('weekend');
        }

        const k = this.getKey(date);
        const c = this.customDays[k];
        if (c) {
            classes.push(c.class);
        }

        return classes;
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize(): void {
        const { scrollLeft, clientWidth } = this.scrollBody.nativeElement;
        this.checkScrollableThresholdHit(scrollLeft, clientWidth);
        this.updateRange(scrollLeft, scrollLeft + clientWidth);
    }

    positionToDate(x: number): dayjs.Dayjs {
        const numDays = Math.floor(x / DAY_WIDTH);
        return this._referenceDate.add(numDays, 'day');
    }

    dateToPosition(date: dayjs.Dayjs): number {
        const diff = date.diff(this._scrollableFrom, 'day');
        return this.days[diff].left;
    }

    onBodyClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        const row = target.closest<HTMLElement>('[data-row-id]');
        if (row) {
            this.rowClick.emit({
                event,
                row: this.rows[+row.dataset.rowId]
            });
        }

        const day = target.closest<HTMLElement>('[data-day-id]');
        if (row) {
            this.dayClick.emit({
                event,
                row: row && this.rows[+row.dataset.rowId],
                date: day && this.days[+day.dataset.dayId].date
            });
        }
    }

    onHeaderClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (target.dataset.dayId != null) {
            const day = this.days[+target.dataset.dayId];
            this.headerClick.emit({
                event,
                date: day && day.date
            });
            this.centerOn(day.date);
        }
    }

    trackById(index, item): any {
        return item.id;
    }

    trackByKey(index, item): any {
        return item.key;
    }
}
