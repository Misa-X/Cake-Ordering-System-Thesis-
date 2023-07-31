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
import { NotificationsService } from 'src/app/shared/notifications.service';
import { Notification } from 'src/app/models/notifications';
import { CheckDesignsComponent } from '../check-designs/check-designs.component';

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
  design_url: string = '';
  orderID: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private orderData: OrderService,
    private paymentData: PaymentService,
    private dialog: MatDialog,
    private notificationService: NotificationsService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const orderId = params.get('id');
          this.orderID = orderId;
          console.log('orderId', orderId);

          return orderId ? this.orderData.getOrderById(orderId) : of(null);
        })
      )
      .subscribe((order: unknown) => {
        if (order) {
          this.order = order as Order;
          this.design_url = this.order.orderItem.picture;

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
          console.log('Payment not found.');
        }
      });
  }
  openReceiptDialog() {
    const dialogRef = this.dialog.open(CheckPaymentsComponent, {
      data: { receiptUrl: this.receipt_url }, // Pass the receipt URL to the dialog component
    });
  }

  openDesignDialog() {
    const dialogRef = this.dialog.open(CheckDesignsComponent, {
      data: { receiptUrl: this.design_url }, // Pass the receipt URL to the dialog component
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
            this.addNewNotification(this.order);
            console.log('Payment status successfully updated');
          } else {
            console.log('Payment is already approved');
          }
        } else {
          console.log('Order not found.');
        }
      });

    if (this.order.payment_status !== 'Approved') {
      this.orderData.updatePaymentStatus(this.order);
      this.addNewNotification(this.order);
      console.log('Order Payment status successfully updated');
      // Optionally, you can navigate to a success page or perform any other actions.
    } else {
      console.log('Order Payment Status is already approved');
    }
  }

  // update order status
  updateOrderStatus(order: Order) {
    order.order_status = 'Canceled';

    this.orderData.updateOrderStatus(order);
  }

  completeOrder(order: Order) {
    order.order_status = 'Completed';

    this.orderData.updateOrderStatus(order);
  }

  addNewNotification(payment: Order) {
    const notificationObj: Notification = {
      id: '',
      text:
        this.order.orderItem[0].user.name +
        ' Your payment for order: ' +
        this.order.id +
        ' has been approved',
      time: new Date().toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      status: 'new',
      order: payment,
    };

    this.sendEmail();

    this.notificationService
      .addNotificationItem(notificationObj)
      .then(() => {
        console.log('Notification added successfully');
      })
      .catch((error) => {
        console.error('Error adding notification:', error);
      });
  }

  sendEmail() {
    const toName = this.order.orderItem[0].user.name;
    const toEmail = this.order.orderItem[0].user.email;
    const fromName = 'Sweet and Salty Bakery';
    const themessage =
      ' Your payment for order: ' + this.order.id + ' has been approved';

    this.notificationService
      .sendEmail(toEmail, toName, fromName, themessage)
      .then(() => {
        // Email sent successfully
        alert('Email sent successfully!');
      })
      .catch((error) => {
        // Error sending email
        alert('Error sending email. Please try again later.');
        console.error('Error sending email:', error);
      });
  }
}
