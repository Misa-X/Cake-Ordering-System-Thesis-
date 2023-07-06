import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private afs: AngularFirestore) {}

  // add order
  addOrder(order: Order) {
    const docRef = this.afs.collection('/Order').doc();
    const orderId = docRef.ref.id;
    order.id = orderId;
    return docRef.set(order);
  }

  // get all orders
  getAllOrders() {
    return this.afs.collection('/Order').snapshotChanges();
  }

  // get order by id
  getOrderById(id: string) {
    return this.afs
      .collection('/Order', (ref) => ref.where('id', '==', id))
      .valueChanges()
      .pipe(
        map((order) => order[0]) // Retrieve the first matching order
      );
  }

  updatePaymentStatus(order: Order) {
    const orderRef = this.afs.collection('/Order').doc(order.id);
    orderRef
      .update({ payment_status: 'Approved' })
      .then(() => {
        console.log('Payment status updated successfully');
        // Optionally, you can perform any other actions after updating the payment status
      })
      .catch((error) => {
        console.error('Error updating payment status:', error);
      });
  }

  // delete order item
  deleteOrder(order: Order) {
    return this.afs.doc('/Order/' + order.id).delete();
  }
}
