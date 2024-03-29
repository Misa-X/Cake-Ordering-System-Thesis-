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
import { OrderItem } from 'src/app/models/order-item';
import { OrderItemService } from 'src/app/shared/order-item.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  cartItems: OrderItem[] = [];
  notifications$: Observable<Notification[]> | undefined;
  unreadNotifications$: Observable<Notification[]> | undefined;
  private notificationsSubscription: Subscription | undefined;

  Profile: any = [];
  orderItemCount: number = 0;

  // userNotifications: any = [];

  @Input() isLoginPage: boolean = false;
  searchQuery: string = '';

  categories: any = {};

  constructor(
    private auth: AuthService,
    private data: DataService,
    private itemData: OrderItemService,
    private router: Router,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.notifications$ = this.notificationService.getNotifications();

    this.unreadNotifications$ =
      this.notificationService.getUnreadNotifications();
    this.subscribeToNotifications();

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.unreadNotifications$ = this.unreadNotifications$.pipe(
        map((notifications: Notification[]) =>
          notifications.filter((notification) => {
            const orderId = notification.order.orderItem[0].user.name;
            const userIdMatch =
              notification.order.orderItem[0].user.id === userId;
            const textContainsOrderId = notification.text.includes(orderId);
            return userIdMatch && !textContainsOrderId;
          })
        )
      );
    }
    this.getCartProduct();
    this.getAllCategories();
    if (this.data) {
      this.categories = { ...this.data }; // Assign a copy of the received product data to the component variable
    }
  }

  ngOnDestroy() {
    this.unsubscribeFromNotifications();
  }

  getCartProduct() {
    this.itemData.getAllOrderItems().subscribe((prof) => {
      this.cartItems = prof.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;

        return { id, ...data, selected: false } as OrderItem;
      });

      const userId = localStorage.getItem('userId');
      this.Profile = this.cartItems.filter(
        (userProfile) => userProfile.user.id === userId
      );
    });
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

  filterCategory(selectedCategoryId: string): void {
    this.router.navigate(['/user/products'], {
      queryParams: { queryC: selectedCategoryId },
    });
  }

  gotToOrders() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate(['/user/orders', userId]);
    } else {
      console.log('There Is an Error');
    }
  }
  goToProfile() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate(['/user/profile', userId]);
    } else {
      console.log('There Is an Error');
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
