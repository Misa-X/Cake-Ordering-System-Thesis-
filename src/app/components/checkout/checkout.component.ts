import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  model!: NgbDateStruct;
  selectedDeliveryMethod: string = 'PickUp';

  constructor(private calendar: NgbCalendar) {}

  ngOnInit(): void {}

  getMinDate(): NgbDateStruct {
    const today = this.calendar.getToday();
    const minDate = this.calendar.getNext(
      this.calendar.getNext(today, 'd', 1),
      'd',
      1
    );
    return minDate;
  }
}
