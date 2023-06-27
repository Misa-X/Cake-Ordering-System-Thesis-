import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OrderItem } from 'src/app/models/order-item';
import { OrderItemService } from 'src/app/shared/order-item.service';
import { CheckoutService } from 'src/app/shared/checkout.service';
import { Custom } from 'src/app/models/custom';
import { DeliveryService } from 'src/app/shared/delivery.service';
import { Delivery } from 'src/app/models/delivery';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutItems: OrderItem[] = [];
  model!: NgbDateStruct;
  selectedDeliveryMethod: string = 'PickUp';
  item: any = {};
  cities: Delivery[] = [];

  orderItem: string = '';

  id: string = '';
  product: string = '';
  customization: string = '';
  color: string = '';
  note: string = '';
  quantity: number = 1;
  picture: string = '';
  subtotal: number = 0;

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

  constructor(
    private calendar: NgbCalendar,
    private route: ActivatedRoute,
    private itemData: CheckoutService,
    private deliveryData: DeliveryService
  ) {}

  ngOnInit(): void {
    this.getCheckoutItems();
    this.getAllDeliveries();

    setTimeout(() => {
      this.calculateSubtotal();
    }, 5000);
    setTimeout(() => {
      this.getAllDeliveries();
    }, 5000);

    setTimeout(() => {
      this.calculateDelivery();
    }, 5000);

    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const itemId = params.get('id');

          this.orderItem = itemId !== null ? itemId : '';

          return itemId ? this.itemData.getCheckoutItemById(itemId) : of(null);
        })
      )
      .subscribe((item: unknown) => {
        if (item) {
          this.item = item as OrderItem;
        } else {
          console.log('Item not found.');
        }
      });
  }

  // get all categories
  getAllDeliveries() {
    this.deliveryData.getAllDelivery().subscribe(
      (res) => {
        this.cities = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          console.log('delivery data: ', data);
          console.log('delivery cities: ', this.cities);
          return data;
        });
      },
      (err: any) => {
        alert('Error while fetching cities');
      }
    );
  }

  getCheckoutItems() {
    this.itemData.getAllCheckoutItems().subscribe(
      (res) => {
        this.checkoutItems = res.map((e: any) => {
          const data = e.payload.doc.data();
          const id = e.payload.doc.id;

          return { id, ...data } as OrderItem;
        });
      },
      (err: any) => {
        alert('Error while fetching cart items');
      }
    );
  }

  calculateSubtotal() {
    // this.cartItems.forEach((item) => {
    //   this.subtotal = item.product.product_price * item.quantity;
    // });

    this.checkoutItems.forEach((item) => {
      const productPrice = parseFloat(item.product.product_price.toString());
      let totalPrice = productPrice;
      // console.log('Customizations: ', item.customization);
      // console.log('This Product Price: ', productPrice);
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

    this.checkoutItems.forEach((item) => {
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

  calculateDelivery() {
    const selectedCity = this.cities.find(
      (city) => city.delivery_city === this.delivery_city
    );
    if (selectedCity) {
      this.selectedCityDeliveryPrice = selectedCity.delivery_price;
    } else {
      this.selectedCityDeliveryPrice = 0; // Set default value if city not found
    }
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
}
