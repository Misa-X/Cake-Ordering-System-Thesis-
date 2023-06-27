import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Delivery } from '../models/delivery';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private deliveryDoc!: AngularFirestoreDocument<Delivery>;

  constructor(private afs: AngularFirestore) {}

  addDelivery(delivery: Delivery) {
    delivery.id = this.afs.createId();
    return this.afs.collection('/Delivery').add(delivery);

    // const { id, ...deliveryData } = delivery;
    // // Add the orderItemData to Firestore without specifying the document ID
    // const docRef = this.afs.collection('Delivery').add(deliveryData);

    // // Retrieve the generated document ID and set it as the id field
    // return docRef.then((doc) => {
    //   const updateDelivery = { ...deliveryData, id: doc.id };

    //   return docRef;
    // });
  }

  // get all order items
  getAllDelivery() {
    return this.afs.collection('/Delivery').snapshotChanges();
  }
  // get order item by id
  getCheckoutItemById(id: string) {
    return this.afs
      .collection('/Delivery', (ref) => ref.where('id', '==', id))
      .valueChanges()
      .pipe(map((del) => del[0]));
  }

  // delete order item
  deleteDelivery(delivery: Delivery) {
    return this.afs.doc('/Delivery/' + delivery.id).delete();
  }

  updateCheckoutItem(delivery: Delivery) {
    this.deliveryDoc = this.afs.doc(`/Delivery/${delivery.id}`);
    const deliveryId = this.deliveryDoc.ref.id;
    delivery.id = deliveryId;
    return this.deliveryDoc.update(delivery);
  }
}
