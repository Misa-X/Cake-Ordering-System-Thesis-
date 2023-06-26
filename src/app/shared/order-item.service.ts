import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { OrderItem } from '../models/order-item';

import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

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
    docRef.then((doc) => {
      const updatedOrderItem = { ...orderItemData, id: doc.id };
      // Do whatever you need to do with the updatedOrderItem
      console.log(updatedOrderItem);
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

  // delete order item
  deleteOrderItem(item: OrderItem) {
    return this.afs.doc('/Order-Item/' + item.id).delete();
  }

  /*

  // update order item
  updateOrderItem(item: OrderItem) {
    const orderItemId = item.id;
    console.log('Item ID: ', orderItemId);

    // Create a query to find the document with the matching order-item ID
    // const query = this.afs.collection('Order-Item', (ref) =>
    //   ref.where('orderItemId', '==', orderItemId)
    // );
    // const query = this.afs.collection('Order-Item');
    const query = this.afs.collection('Order-Item');
    const documentIds: string[] = [];

    query.get().subscribe((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const documentId = doc.id;
        documentIds.push(documentId);
      });

      console.log('Document IDs:', documentIds);
    });
    // const query = this.afs.collection('Order-Item', (ref) =>
    //   ref.where('orderItemId', '==', orderItemId)
    // );

    // Execute the query
    query.get().subscribe((snapshot) => {
      console.log('Query snapshot:', snapshot.size);
      snapshot.forEach((doc) => {
        const documentId = doc.id;
        // Use the documentId as needed
        console.log('The Document ID:', documentId);

        this.itemDoc = this.afs.doc(`/Order-Item/${documentId}`);

        const itemId = this.itemDoc.ref.id;

        item.id = itemId;
        console.log(itemId);

        this.itemDoc
          .update(item)
          .then(() => {
            // Success, handle the updated item
            console.log('Order item updated successfully');
          })
          .catch((error) => {
            // Error, handle the error
            console.log('Error updating order item:', error);
          });
      });
    });

    // this.itemDoc = this.afs.doc(`/Order-Item/${item.id}`);

    // const itemId = this.itemDoc.ref.id;

    // item.id = itemId;
    // console.log(itemId);
    // return this.itemDoc.update(item);

    // return this.afs.doc(`/Order-Item/${id}`).update(item);
    // this.deleteOrderItem(item);
    // this.addOrderItem(item);
  }

*/

  // TEST --------------------->

  updateOrderItem(item: OrderItem) {
    this.itemDoc = this.afs.doc(`/Order-Item/${item.id}`);
    const itemId = this.itemDoc.ref.id;
    item.id = itemId;
    return this.itemDoc.update(item);

    // this.itemDoc = this.afs.collection('Order-Item').doc<any>(item.id);
    // return this.itemDoc.update(item);
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

    // return this.afs
    //   .collection('Order-Item')
    //   .valueChanges()
    //   .pipe(
    //     map((items) => items.length),
    //     catchError((error) => {
    //       console.log('Error while fetching order item count:', error);
    //       return throwError(
    //         'An error occurred while fetching order item count.'
    //       );
    //     })
    //   );
  }
}
