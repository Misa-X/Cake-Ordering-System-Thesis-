import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

import { Notification } from '../models/notifications';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import emailjs from 'emailjs-com';

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

  sendEmail(
    toEmail: string,
    toName: string,
    fromName: string,
    themessage: string
  ) {
    const serviceID = 'service_vfoiu1a';
    const templateID = 'template_d293c6t';
    const userID = 'akM8E6TNzXE5uRHPK';
    // const templateParams = {
    //   to_email: toEmail,
    // };
    return new Promise((resolve, reject) => {
      emailjs
        .send(
          serviceID,
          templateID,
          {
            to_name: toName,
            to_email: toEmail,
            from_name: fromName,
            message: themessage,
            reply_to: 'Sweet & Salty',
            // to_name: 'Recipient Name',
            // message: 'This is a test email sent from my Angular app!',
          },
          userID
        )
        .then((response) => {
          console.log('Email sent:', response.status);
          resolve(response);
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          reject(error);
        });
    });
  }
}
