import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { OrderItem } from '../models/order-item';

import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderItemService {
  private itemDoc!: AngularFirestoreDocument<OrderItem>;
  constructor(private afs: AngularFirestore) {}

  // add order item
  addOrderItem(item: OrderItem) {
    item.id = this.afs.createId();
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
    return this.afs.doc('/Order-Item/' + item.id).delete();
  }

  // update order item
  updateOrderItem(item: OrderItem) {
    this.itemDoc = this.afs.doc(`/Order-Item/${item.id}`);
    const itemId = this.itemDoc.ref.id;
    item.id = itemId;
    return this.itemDoc.update(item);

    // return this.afs.doc(`/Order-Item/${id}`).update(item);
    // this.deleteOrderItem(item);
    // this.addOrderItem(item);
  }
}
