import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/shared/order.service';
import { PaymentService } from 'src/app/shared/payment.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css'],
})
export class OrderConfirmationComponent implements OnInit {
  order: any = {};
  orderID: string | null = '';

  constructor(
    private orderData: OrderService,
    private paymentData: PaymentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const orderId = params.get('id');
          this.orderID = orderId;
          console.log('orderId', orderId);
          // this.orders = orderId !== null ? orderId : '';

          return orderId ? this.orderData.getOrderById(orderId) : of(null);
        })
      )
      .subscribe((order: unknown) => {
        if (order) {
          this.order = order as Order;

          console.log('Order found: ');
        } else {
          console.log('Order not found.');
        }
      });
  }
}
