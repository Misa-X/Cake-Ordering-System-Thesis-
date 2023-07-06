import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { OrderItem } from '../models/order-item';

import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Custom } from '../models/custom';

@Injectable({
  providedIn: 'root',
})
export class OrderItemService {
  private itemDoc!: AngularFirestoreDocument<OrderItem>;
  constructor(private afs: AngularFirestore) {}

  // add order item
  // addOrderItem(item: OrderItem) {
  //   item.id = this.afs.createId();
  //   return this.afs.collection('/Order-Item').add(item);
  // }

  addOrderItem(item: OrderItem) {
    const { id, ...orderItemData } = item;
    // Add the orderItemData to Firestore without specifying the document ID
    const docRef = this.afs.collection('Order-Item').add(orderItemData);

    // Retrieve the generated document ID and set it as the id field
    return docRef.then((doc) => {
      const updatedOrderItem = { ...orderItemData, id: doc.id };
      // Do whatever you need to do with the updatedOrderItem
      // console.log(updatedOrderItem);
      return docRef;
    });
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

  getOrdersByUser(userId: string): Observable<any[]> {
    return this.afs
      .collection('/Order-Item', (ref) => ref.where('userId', '==', userId))
      .valueChanges();
  }

  // delete order item
  deleteOrderItem(item: OrderItem) {
    return this.afs.doc('/Order-Item/' + item.id).delete();
  }

  updateOrderItem(item: OrderItem) {
    this.itemDoc = this.afs.doc(`/Order-Item/${item.id}`);
    const itemId = this.itemDoc.ref.id;
    item.id = itemId;
    return this.itemDoc.update(item);
  }

  getOrderItemCount(): Observable<number> {
    return this.afs
      .collection('Order-Item')
      .valueChanges()
      .pipe(
        tap((items) => console.log()), //('Order Items:', items)
        map((items) => items.length),
        catchError((error) => {
          console.log('Error while fetching order item count:', error);
          return throwError(
            'An error occurred while fetching order item count.'
          );
        })
      );
  }

  calculateSubtotal(orderItem: OrderItem): number {
    let subtotal = 0;

    // Add product_price to subtotal
    subtotal += orderItem.product.product_price;

    // Add customization prices to subtotal
    orderItem.customization.forEach((custom: Custom) => {
      subtotal += custom.price;
    });

    return subtotal;
  }

  updateOrderItemSubtotal(item: OrderItem) {
    const subtotal = this.calculateSubtotal(item);

    // Update the subtotal field of the order item
    this.itemDoc = this.afs.doc(`/Order-Item/${item.id}`);
    return this.itemDoc.update({ subtotal });
  }
}
