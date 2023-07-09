import { Component, OnInit, DoCheck } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OrderItem } from 'src/app/models/order-item';
import { OrderItemService } from 'src/app/shared/order-item.service';
import { CheckoutService } from 'src/app/shared/checkout.service';
import { Custom } from 'src/app/models/custom';
import { DeliveryService } from 'src/app/shared/delivery.service';
import { Delivery } from 'src/app/models/delivery';
import { Console } from 'console';
import { Order } from 'src/app/models/order';
import { DeliveryItem } from 'src/app/models/delivery-item';
import { OrderService } from 'src/app/shared/order.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NotificationsService } from 'src/app/shared/notifications.service';
import { Notification } from 'src/app/models/notifications';
// import { FcmService } from 'src/app/shared/fcm.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutItems: OrderItem[] = [];
  model!: NgbDateStruct;
  selectedDeliveryMethod: string = 'PickUp';
  selectedPaymentMethod: string = '';
  DCity: string = '';
  item: any = {};
  cities: Delivery[] = [];
  Profile: any = [];

  orderItem: string = '';

  id: string = '';
  product: string = '';
  customization: string = '';
  color: string = '';
  note: string = '';
  quantity: number = 1;
  picture: string = '';
  subtotal: number = 0;
  Total: number = 0;

  deliveryObj: Delivery = {
    id: '',
    delivery_city: '',
    delivery_price: 0,
  };
  delivery_id: string = '';
  delivery_city: string = '';
  delivery_price: number = 0;

  subtotalCheckout: number = 0;
  selectedCityDeliveryPrice: number = 0;

  // checkoutItems: OrderItem[] = [];
  filteredItems: OrderItem[] = [];

  // notificationObj: any;

  // notificationObj: Notification = {
  //   id: '', // ID will be generated automatically by the service
  //   user: [], // Provide the UserProfile object
  //   text: '', // Notification message
  //   time: '', // Current timestamp
  //   status: 'new', // Set the initial status as 'new'
  //   order: , // Provide the OrderItem object
  // };

  orderObj: Order = {
    id: '',
    orderItem: [],
    order_date: '',
    order_time: '',
    order_status: '',
    payment_status: '',
    delivery: {
      id: '',
      fullName: '',
      phone: '',
      address: '',
      city: {
        id: '',
        delivery_city: '',
        delivery_price: 0,
      },
    },
    total: 0,
  };

  orderDate: string = '';
  orderTime: string = '';
  orderStatus: string = '';

  orderItemm: string = '';
  deliveryy: string = '';

  // for delivery
  addressObj: DeliveryItem = {
    id: '',
    fullName: '',
    phone: '',
    address: '',
    city: {
      id: '',
      delivery_city: '',
      delivery_price: 0,
    },
  };

  fullName: string = '';
  phone: string = '';
  address: string = '';
  cityy: any;
  selectedCity: any;

  constructor(
    private calendar: NgbCalendar,
    private route: ActivatedRoute,
    private itemData: CheckoutService,
    private deliveryData: DeliveryService,
    private orderData: OrderService,
    private router: Router,
    private afs: AngularFirestore,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.getCheckoutItems();

    setTimeout(() => {
      this.calculateSubtotal();
    }, 5000);
    setTimeout(() => {
      this.getAllDeliveries();
    }, 5000);
  }

  // get all categories
  getAllDeliveries() {
    this.deliveryData.getAllDelivery().subscribe(
      (res) => {
        this.cities = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;

          return data;
        });
        console.log('Cities', this.cities);
      },
      (err: any) => {
        alert('Error while fetching cities');
      }
    );
  }

  // get checkout items
  getCheckoutItems() {
    const userId = localStorage.getItem('userId');
    console.log('The userID: ', userId);

    if (!userId) {
      console.log('No user ID found in localStorage.');
      return;
    }

    this.itemData.getAllCheckoutItems().subscribe((prof) => {
      this.checkoutItems = prof.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;

        return { id, ...data } as OrderItem;
      });

      this.Profile = this.checkoutItems.filter(
        (userProfile) => userProfile.user.id === userId
      );

      console.log('Found profile:', this.Profile);
      // Filter checkoutItems based on userId
    });
  }

  deleteCheckoutItems() {
    this.Profile.forEach((item: OrderItem) => {
      this.itemData
        .deleteCheckoutItem(item)
        .then(() => {
          console.log('Checkout item deleted successfully');
        })
        .catch((error) => {
          console.error('Error deleting checkout item:', error);
        });
    });
    this.Profile = []; // Clear the Profile array after deleting the items
  }

  calculateSubtotal() {
    this.Profile.forEach((item: OrderItem) => {
      const productPrice = parseFloat(item.product.product_price.toString());
      let totalPrice = productPrice;

      const quantity = parseFloat(item.quantity.toString());

      item.customization.forEach((customization: Custom) => {
        const custPrice = parseFloat(customization.price.toString());
        if (!isNaN(custPrice)) {
          totalPrice += custPrice;
        }
      });

      if (!isNaN(productPrice) && !isNaN(quantity)) {
        item.subtotal = totalPrice * quantity;
      } else {
        item.subtotal = 0;
      }

      this.itemData
        .updateCheckoutItem(item)
        .then(() => {
          console.log('Subtotal updated:', item.subtotal);
          this.calculateSubtotalCheckout();
          // this.subtotal = item.subtotal;
        })
        .catch((error) => {
          console.error('Error updating order item:', error);
        });
    });
  }

  calculateSubtotalCheckout() {
    this.subtotalCheckout = 0; // Reset totalPriceCart to 0 before calculating

    this.Profile.forEach((item: OrderItem) => {
      this.subtotalCheckout += item.subtotal; // Add the subtotal of each item to totalPriceCart
    });

    console.log('Total price:', this.subtotalCheckout);
  }

  deliveryList: DeliveryService[] = [];

  // add custom
  addCity() {
    this.deliveryObj.delivery_city = this.delivery_city;

    this.deliveryObj.delivery_price = this.delivery_price;

    this.deliveryData.addDelivery(this.deliveryObj);
    console.log('Delivery obj : ', this.deliveryObj);
  }

  // calculate delivery
  calculateDelivery(sity: string) {
    console.log('calc del cities', this.cities);
    // this.delivery_city = this.selectedDeliveryMethod;
    console.log('City selected: ', sity);
    const selectedCity = this.cities.find((product) => product.id === sity);

    console.log('Selected City 2:', selectedCity);

    this.cityy = selectedCity;

    console.log('cityy:', this.cityy);

    if (selectedCity) {
      this.selectedCityDeliveryPrice = selectedCity.delivery_price;
    } else {
      this.selectedCityDeliveryPrice = 0; // Set default value if city not found
    }

    this.Total = this.selectedCityDeliveryPrice + this.subtotalCheckout;

    // this.addDeliveryAddress();
  }

  // add delivery address
  addDeliveryAddress() {
    this.addressObj.fullName = this.fullName;
    this.addressObj.phone = this.phone;
    this.addressObj.address = this.address;
    this.addressObj.city = this.cityy;

    console.log('address object:', this.addressObj);

    this.deliveryData.addDeliveryAddress(this.addressObj);
  }

  //add Order
  addOrder() {
    console.log('address object (add order):', this.addressObj);

    this.addDeliveryAddress();

    if (this.Profile) {
      this.orderObj.orderItem = this.Profile;
    }

    this.orderObj.order_date = this.orderDate;
    this.orderObj.delivery = this.addressObj;
    this.orderObj.total = this.Total;
    this.orderObj.order_status = 'pending';
    this.orderObj.payment_status = 'pending';
    this.orderObj.order_time = new Date().toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    console.log('order id: ', this.orderObj.id);

    this.deleteCheckoutItems();

    this.orderData.addOrder(this.orderObj);
    console.log('Object: ', this.orderObj);
    console.log('This Profile >> ', this.orderObj.orderItem[0].user);

    this.addNewNotification(this.orderObj);

    if (this.selectedPaymentMethod === 'bankTransfer') {
      const checkoutUrl = `/user/payment/${this.orderObj.id}`;
      this.router.navigateByUrl(checkoutUrl);
    } else if (this.selectedPaymentMethod === 'cod') {
      console.log('Cash on delivery');
    }

    // const checkoutUrl = `/user/payment/${this.orderObj.id}`;
    // this.router.navigateByUrl(checkoutUrl);
  }

  getMinDate(): NgbDateStruct {
    const today = this.calendar.getToday();
    const minDate = this.calendar.getNext(
      this.calendar.getNext(today, 'd', 1),
      'd',
      1
    );
    return minDate;
  }

  addNewNotification(order: Order) {
    const notificationObj: Notification = {
      id: '',
      //user: this.Profile, // Assuming this.Profile.user represents the UserProfile object
      text: this.orderObj.orderItem[0].user.name + ' created a new order!',
      time: new Date().toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      status: 'new',
      order: order,
    };

    this.notificationService
      .addNotificationItem(notificationObj)
      .then(() => {
        console.log('Notification added successfully');
      })
      .catch((error) => {
        console.error('Error adding notification:', error);
      });
  }
}
