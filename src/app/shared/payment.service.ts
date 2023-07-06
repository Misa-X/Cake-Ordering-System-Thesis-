import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private afs: AngularFirestore) {}

  // add payment
  addPayment(payment: Payment) {
    const docRef = this.afs.collection('/Payment').doc();
    const paymentId = docRef.ref.id;
    payment.id = paymentId;
    return docRef.set(payment);
    // payment.id = this.afs.createId();
    // return this.afs.collection('/Payment').add(payment);
  }

  // get all payments
  getAllPayments() {
    return this.afs.collection('/Payment').snapshotChanges();
  }

  updatePaymentStatus(payment: Payment) {
    const paymentRef = this.afs.collection('/Payment').doc(payment.id);
    paymentRef
      .update({ payment_status: 'Approved' })
      .then(() => {
        console.log('Payment status updated successfully');
        // Optionally, you can perform any other actions after updating the payment status
      })
      .catch((error) => {
        console.error('Error updating payment status:', error);
      });
  }

  // get payment by id
  getPaymentById(id: string) {
    return this.afs
      .collection('/Payment', (ref) => ref.where('order.id', '==', id))
      .valueChanges()
      .pipe(map((order) => order[0]));
  }

  // delete payment
  deletePayment(payment: Payment) {
    return this.afs.doc('/Payment/' + payment.id).delete();
  }
}
