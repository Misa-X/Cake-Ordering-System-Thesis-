import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OrderItem } from 'src/app/models/order-item';
import { OrderItemService } from 'src/app/shared/order-item.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  model!: NgbDateStruct;
  selectedDeliveryMethod: string = 'PickUp';
  item: any = {};

  orderItem: string = '';

  constructor(
    private calendar: NgbCalendar,
    private route: ActivatedRoute,
    private itemData: OrderItemService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const itemId = params.get('id');

          this.orderItem = itemId !== null ? itemId : '';

          return itemId ? this.itemData.getOrderItemById(itemId) : of(null);
        })
      )
      .subscribe((item: unknown) => {
        if (item) {
          this.item = item as OrderItem;
        } else {
          console.log('Item not found.');
        }
      });
  }

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
