import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { OrderService } from 'src/app/shared/order.service';
import { of } from 'rxjs';
import { Order } from 'src/app/models/order';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Products } from 'src/app/models/products';
import { Payment } from 'src/app/models/payment';
import { PaymentService } from 'src/app/shared/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  countdownDate!: Date; // Add the '!' operator to indicate it will be initialized later

  countdownTimer: any;
  remainingTime!: number;

  order: any = {};
  userName: string = '';
  productt: any = [];
  orders: string = '';

  selectedFile: File | null = null;

  constructor(
    private orderData: OrderService,
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const orderId = params.get('id');

          this.orders = orderId !== null ? orderId : '';

          return orderId ? this.orderData.getOrderById(orderId) : of(null);
        })
      )
      .subscribe((order: unknown) => {
        if (order) {
          this.order = order as Order;

          this.order.orderItem.forEach((product: any) => {
            this.productt.push(product);
          });
          console.log('found products', this.productt);

          console.log(typeof this.productt, this.productt[0].product_name);
        } else {
          console.log('Order not found.');
        }
      });

    setTimeout(() => {
      this.run_timer();
    }, 5000);
  }
  run_timer() {
    const orderTime = new Date(this.order.order_time);
    // this.countdownDate = new Date(); // Set the countdown start date/time
    this.countdownDate = new Date(orderTime.getTime() + 24 * 60 * 60 * 1000);

    this.startCountdown();
  }

  startCountdown() {
    this.countdownTimer = setInterval(() => {
      const now = new Date().getTime();
      this.remainingTime = this.countdownDate.getTime() - now;

      if (this.remainingTime <= 0) {
        // Countdown timer has expired
        clearInterval(this.countdownTimer);
        // Perform any necessary actions when the timer expires
      }
    }, 1000);
  }

  stopCountdown() {
    clearInterval(this.countdownTimer);
  }

  ngOnDestroy() {
    this.stopCountdown();
  }
  getFormattedTime(): string {
    const hours = Math.floor(this.remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor(
      (this.remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((this.remainingTime % (1000 * 60)) / 1000);

    // Format the time as desired, for example: HH:MM:SS
    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(
      seconds
    )}`;
  }

  private padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  makePayment() {
    if (this.selectedFile) {
      const filePath = `payment_receipts/${this.order.id}_${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);

      // Save the payment with the uploaded picture
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              const payment: Payment = {
                id: '',
                order: this.order,
                payment_method: 'Bank Transfer', // Add the payment method
                payment_status: 'Pending', // Add the payment status
                payment_receipt: url, // Add the uploaded picture URL
              };

              this.paymentService
                .addPayment(payment)
                .then(() => {
                  console.log('Payment added successfully');
                  // Optionally, you can navigate to a success page or perform any other actions.
                })
                .catch((error) => {
                  console.error('Error adding payment:', error);
                });
            });
          })
        )
        .subscribe();
    } else {
      console.error('No file selected');
    }
  }
}
