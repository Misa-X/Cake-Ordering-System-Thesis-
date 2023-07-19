import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { DataService } from 'src/app/shared/data.service';
import { Category } from 'src/app/models/category';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Notification } from 'src/app/models/notifications';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  notifications$: Observable<Notification[]> | undefined;
  unreadNotifications$: Observable<Notification[]> | undefined;
  private notificationsSubscription: Subscription | undefined;

  // userNotifications: any = [];

  @Input() isLoginPage: boolean = false;
  searchQuery: string = '';

  categories: any = {};

  constructor(
    private auth: AuthService,
    private data: DataService,
    private router: Router,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.notifications$ = this.notificationService.getNotifications();

    // console.log('outside:', this.userNotifications);
    // this.userNotifications = this.notifications$.filter(
    //   (userProfile) => userProfile.order.orderItem[0].user.id === userId
    // );

    this.unreadNotifications$ =
      this.notificationService.getUnreadNotifications();
    this.subscribeToNotifications();

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.unreadNotifications$ = this.unreadNotifications$.pipe(
        map((notifications: Notification[]) =>
          notifications.filter(
            (notification) => notification.order.orderItem[0].user.id === userId
          )
        )
      );
      // this.userNotifications = this.notifications$;
      // console.log('inside:', notifications);
    }

    this.getAllCategories();
    if (this.data) {
      this.categories = { ...this.data }; // Assign a copy of the received product data to the component variable
    }
  }

  ngOnDestroy() {
    this.unsubscribeFromNotifications();
  }

  getAllCategories() {
    this.data.getAllCategories().subscribe((res) => {
      this.categories = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data } as Category;
      });
    });
  }

  searchProducts(): void {
    if (this.searchQuery.trim() !== '') {
      this.router.navigate(['/user/products'], {
        queryParams: { query: this.searchQuery },
      });
      this.searchQuery = '';
    }
  }

  gotToOrders() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate(['/user/orders', userId]);
    } else {
      console.log('There Is an Error');
      // Handle the case when userId is not available
      // You can redirect to a login page or display an error message
    }
  }
  goToProfile() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate(['/user/profile', userId]);
    } else {
      console.log('There Is an Error');
      // Handle the case when userId is not available
      // You can redirect to a login page or display an error message
    }
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

  handleNotificationClick(notification: Notification) {
    // Add your logic to handle the click event for the notification
    // console.log('Notification clicked:', notification);

    if (notification.status === 'new') {
      this.notificationService.updateNotificationStatus(notification, 'read');
    }
    console.log('Notification clicked:', notification);
  }

  logout() {
    localStorage.removeItem('userId');
    this.auth.logout();
  }
}
