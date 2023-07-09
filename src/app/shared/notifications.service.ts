import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

import { Notification } from '../models/notifications';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import * as sgMail from '@sendgrid/mail';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private itemDoc!: AngularFirestoreDocument<Notification>;

  constructor(private afs: AngularFirestore) {}

  addNotificationItem(item: Notification) {
    const docRef = this.afs.collection('/Notifications').doc();
    const notificationId = docRef.ref.id;
    item.id = notificationId;
    return docRef.set(item);
  }

  updateNotificationStatus(item: Notification, status: 'read' | 'new') {
    // const status = 'read';

    // Update the subtotal field of the order item
    const notificationRef = this.afs.collection('/Notifications').doc(item.id);
    notificationRef
      .update({ status })
      .then(() => {
        console.log('Notification status updated successfully');
        // Optionally, you can perform any other actions after updating the payment status
      })
      .catch((error) => {
        console.error('Error updating notification status:', error);
      });

    // this.itemDoc = this.afs.doc(`/Notifications/${item.id}`);
    // return this.itemDoc.update({ status });
  }

  getNotifications(): Observable<Notification[]> {
    return this.afs.collection<Notification>('Notifications').valueChanges();
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return this.afs
      .collection<Notification>('Notifications', (ref) =>
        ref.where('status', '==', 'new')
      )
      .valueChanges();
  }
}
