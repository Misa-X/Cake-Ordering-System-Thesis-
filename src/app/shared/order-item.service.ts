import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { OrderItem } from '../models/order-item';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderItemService {
  constructor(private afs: AngularFirestore) {}

  // add order item
  addOrderItem(item: OrderItem) {
    return this.afs.collection('/Order-Item').add(item);
  }

  // get all order items
  getAllOrderItems() {
    return this.afs.collection('/Order-Item').snapshotChanges();
  }

  // get order item by id
  getOrderItemById(id: string) {
    return this.afs
      .collection('/Order-Item', (ref) => ref.where('id', '==', id))
      .valueChanges()
      .pipe(map((item) => item[0]));
  }

  // delete order item
  deleteOrderItem(item: OrderItem) {
    return this.afs.doc('/Oder-Item/' + item.id).delete();
  }

  // update order item
  updateOrderItem(item: OrderItem) {
    this.deleteOrderItem(item);
    this.addOrderItem(item);
  }
}
