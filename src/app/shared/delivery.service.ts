import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Delivery } from '../models/delivery';
import { DeliveryItem } from '../models/delivery-item';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private deliveryDoc!: AngularFirestoreDocument<Delivery>;
  private addressDoc!: AngularFirestoreDocument<DeliveryItem>;

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

  // DELIVERY ADDRESS ------------->

  // add delivery address
  addDeliveryAddress(address: DeliveryItem) {
    address.id = this.afs.createId();
    return this.afs.collection('/Delivery-address').add(address);
  }

  // get all delivery address
  getAllDeliveryAddress() {
    return this.afs.collection('/Delivery-address').snapshotChanges();
  }

  // delete delivery address
  deleteDeliveryAddress(address: DeliveryItem) {
    return this.afs.doc('/Delivery-address/' + address.id).delete();
  }

  // update delivery address
  updateDeliveryAddress(address: DeliveryItem) {
    this.addressDoc = this.afs.doc(`/Delivery-address/${address.id}`);
    const addressId = this.addressDoc.ref.id;
    address.id = addressId;
    return this.addressDoc.update(address);
  }
}
