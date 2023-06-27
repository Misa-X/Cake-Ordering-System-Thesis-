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
export class CheckoutService {
  private itemDoc!: AngularFirestoreDocument<OrderItem>;
  constructor(private afs: AngularFirestore) {}

  addCheckoutItem(item: OrderItem) {
    const { id, ...checkoutItemData } = item;
    // Add the orderItemData to Firestore without specifying the document ID
    const docRef = this.afs.collection('Checkout-Item').add(checkoutItemData);

    // Retrieve the generated document ID and set it as the id field
    return docRef.then((doc) => {
      const updateCheckoutItem = { ...checkoutItemData, id: doc.id };
      // Do whatever you need to do with the updatedOrderItem
      // console.log(updatedOrderItem);
      return docRef;
    });
  }

  // get all order items
  getAllCheckoutItems() {
    return this.afs.collection('/Checkout-Item').snapshotChanges();
  }
  // get order item by id
  getCheckoutItemById(id: string) {
    return this.afs
      .collection('/Checkout-Item', (ref) => ref.where('id', '==', id))
      .valueChanges()
      .pipe(map((item) => item[0]));
  }

  // delete order item
  deleteCheckoutItem(item: OrderItem) {
    return this.afs.doc('/Checkout-Item/' + item.id).delete();
  }

  updateCheckoutItem(item: OrderItem) {
    this.itemDoc = this.afs.doc(`/Checkout-Item/${item.id}`);
    const itemId = this.itemDoc.ref.id;
    item.id = itemId;
    return this.itemDoc.update(item);
  }

  getCheckoutItemCount(): Observable<number> {
    return this.afs
      .collection('Checkout-Item')
      .valueChanges()
      .pipe(
        tap((items) => console.log()), //('Checkout Items:', items)
        map((items) => items.length),
        catchError((error) => {
          console.log('Error while fetching Checkout item count:', error);
          return throwError(
            'An error occurred while fetching Checkout item count.'
          );
        })
      );
  }

  calculateSubtotal(checkoutitem: OrderItem): number {
    let subtotal = 0;

    // Add product_price to subtotal
    subtotal += checkoutitem.product.product_price;

    // Add customization prices to subtotal
    checkoutitem.customization.forEach((custom: Custom) => {
      subtotal += custom.price;
    });

    return subtotal;
  }

  updateCheckoutItemSubtotal(item: OrderItem) {
    const subtotal = this.calculateSubtotal(item);

    // Update the subtotal field of the order item
    this.itemDoc = this.afs.doc(`/Checkout-Item/${item.id}`);
    return this.itemDoc.update({ subtotal });
  }
}
