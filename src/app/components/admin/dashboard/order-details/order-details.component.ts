import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/shared/order.service';
import { PaymentService } from 'src/app/shared/payment.service';
import { MatDialog } from '@angular/material/dialog';
import { CheckPaymentsComponent } from '../check-payments/check-payments.component';
import { Payment } from 'src/app/models/payment';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  orders: string = '';
  order: any = {};
  payment: any = {};
  receipt_url: string = '';
  orderID: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private orderData: OrderService,
    private paymentData: PaymentService,
    private dialog: MatDialog
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

          console.log('Order found: ', this.orders);
        } else {
          console.log('Order not found.');
        }
      });

    setTimeout(() => {
      this.get_payment_receipt();
    }, 5000);
  }

  get_payment_receipt() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const paymentId = params.get('id');
          console.log('payment OrderId', paymentId);

          return paymentId
            ? this.paymentData.getPaymentById(paymentId)
            : of(null);
        })
      )
      .subscribe((payment: unknown) => {
        if (payment) {
          this.payment = payment as Order;

          console.log('Payment found: ', this.payment.order.id);
          this.receipt_url = this.payment.payment_receipt;
        } else {
          console.log('Order not found.');
        }
      });
  }
  openReceiptDialog() {
    const dialogRef = this.dialog.open(CheckPaymentsComponent, {
      data: { receiptUrl: this.receipt_url }, // Pass the receipt URL to the dialog component
    });
  }

  updateOrderPaymentStatus() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const paymentId = params.get('id');
          console.log('payment OrderId', paymentId);

          return paymentId
            ? this.paymentData.getPaymentById(paymentId)
            : of(null);
        })
      )
      .subscribe((payment: unknown) => {
        if (payment) {
          this.payment = payment as Payment;

          console.log('Payment record found: ', this.payment);

          if (this.payment.payment_status !== 'Approved') {
            this.paymentData.updatePaymentStatus(this.payment);
            console.log('Payment status successfully updated');
            // Optionally, you can navigate to a success page or perform any other actions.
          } else {
            console.log('Payment is already approved');
          }
        } else {
          console.log('Order not found.');
        }
      });

    if (this.order.payment_status !== 'Approved') {
      this.orderData.updatePaymentStatus(this.order);
      console.log('Order Payment status successfully updated');
      // Optionally, you can navigate to a success page or perform any other actions.
    } else {
      console.log('Order Payment Status is already approved');
    }
  }
}
