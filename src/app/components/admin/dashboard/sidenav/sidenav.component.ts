import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Observable, Subscription } from 'rxjs';
import { Notification } from 'src/app/models/notifications';
import { NotificationsService } from 'src/app/shared/notifications.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  notifications$: Observable<Notification[]> | undefined;
  unreadNotifications$: Observable<Notification[]> | undefined;
  private notificationsSubscription: Subscription | undefined;

  constructor(
    private auth: AuthService,
    private notificationService: NotificationsService
  ) {}
  ngOnInit() {
    this.notifications$ = this.notificationService.getNotifications();
    this.unreadNotifications$ =
      this.notificationService.getUnreadNotifications();
    this.subscribeToNotifications();
  }

  ngOnDestroy() {
    this.unsubscribeFromNotifications();
  }

  private subscribeToNotifications() {
    if (this.notifications$) {
      this.notificationsSubscription = this.notifications$.subscribe();
    }
  }

  private unsubscribeFromNotifications() {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
  }

  logout() {
    this.auth.logout();
  }

  handleNotificationClick(notification: Notification) {
    // Add your logic to handle the click event for the notification
    // console.log('Notification clicked:', notification);

    if (notification.status === 'new') {
      this.notificationService.updateNotificationStatus(notification, 'read');
    }
    console.log('Notification clicked:', notification);
  }
}
function ngOnInit() {
  throw new Error('Function not implemented.');
}
