import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Products } from 'src/app/models/products';
import { ActivatedRoute } from '@angular/router';
import { Custom } from 'src/app/models/custom';
import { OrderItemService } from 'src/app/shared/order-item.service';
import { OrderItem } from 'src/app/models/order-item';
import { forkJoin } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CheckoutService } from 'src/app/shared/checkout.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: OrderItem[] = [];
  dt: OrderItem[] = [];
  selectedItems: OrderItem[] = [];
  showDataNotFound = true;
  message = '';

  // selectedItem: OrderItem[] = [];

  // Not Found Message
  messageTitle = 'No Products Found in Cart';
  messageDescription = 'Please, Add Products to Cart';

  checkoutItemObj: OrderItem = {
    id: '',
    product: {
      id: '',
      product_name: '',
      product_category: { id: '', category_name: '' },
      product_description: '',
      product_image: '',
      product_price: 0,
    },
    customization: [],
    color: '',
    note: '',
    quantity: 1,
    picture: '',
    subtotal: 0,
    // selected: false,
  };

  id: string = '';
  product: string = '';
  customization: string = '';
  color: string = '';
  note: string = '';
  quantity: number = 1;
  picture: string = '';
  subtotal: number = 0;

  orderItemCount: number = 0;

  totalPriceCart: number = 0;

  constructor(
    private route: ActivatedRoute,
    private itemData: OrderItemService,
    private firestore: AngularFirestore,
    private checkoutData: CheckoutService
  ) {}

  ngOnInit(): void {
    // Get the cart products
    this.getCartProduct();

    this.getOrderItemCount();
    setTimeout(() => {
      this.calculateSubtotal();
    }, 5000); // Delay of 10000 milliseconds (10 seconds)

    setTimeout(() => {
      this.calculateTotalPriceCart();
    }, 7000);

    // this.calculateSubtotal();
  }

  removeCartProduct(item: OrderItem) {
    this.itemData.deleteOrderItem(item);

    // Recalling
    this.getCartProduct();
  }

  //Orginal Get product
  getCartProduct() {
    this.itemData.getAllOrderItems().subscribe(
      (res) => {
        this.cartItems = res.map((e: any) => {
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

    this.cartItems.forEach((item) => {
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
        .updateOrderItem(item)
        .then(() => {
          console.log('Subtotal updated:', item.subtotal);
          this.calculateTotalPriceCart();
          // this.subtotal = item.subtotal;
        })
        .catch((error) => {
          console.error('Error updating order item:', error);
        });
    });
  }

  calculateCustomizations() {
    this.cartItems.forEach((item) => {
      const productPrice = parseFloat(item.product.product_price.toString());
      let totalPrice = productPrice; // Initialize totalPrice with the product price

      item.customization.forEach((customization: Custom) => {
        const custPrice = parseFloat(customization.price.toString());
        if (!isNaN(custPrice)) {
          totalPrice += custPrice;
        }
      });

      item.subtotal = totalPrice;

      this.itemData
        .updateOrderItem(item)
        .then(() => {
          console.log('Subtotal updated:', item.subtotal);
        })
        .catch((error) => {
          console.error('Error updating order item:', error);
        });
    });
  }

  calculateTotalPriceCart() {
    this.totalPriceCart = 0; // Reset totalPriceCart to 0 before calculating

    this.cartItems.forEach((item) => {
      this.totalPriceCart += item.subtotal; // Add the subtotal of each item to totalPriceCart
    });

    console.log('Total price:', this.totalPriceCart);
  }

  updateQuantity(item: OrderItem) {
    const productPrice = parseFloat(item.product.product_price.toString());
    const quantity = parseFloat(item.quantity.toString());

    if (!isNaN(productPrice) && !isNaN(quantity)) {
      item.subtotal = productPrice * quantity;
    } else {
      item.subtotal = 0;
    }

    this.itemData
      .updateOrderItem(item)
      .then(() => {
        this.subtotal = item.subtotal; // Update the subtotal locally after successful update in the database
        this.calculateSubtotal();
        this.calculateTotalPriceCart();
      })
      .catch((error) => {
        console.error('Error updating order item:', error);
      });
  }

  deleteOrderItem(item: OrderItem) {
    this.itemData.deleteOrderItem(item);
  }

  getOrderItemCount() {
    this.itemData.getOrderItemCount().subscribe(
      (count: number) => {
        this.orderItemCount = count;
      },
      (err: any) => {
        alert('Error while fetching order item count');
      }
    );
  }
  toggleSelection(product: OrderItem) {
    const index = this.selectedItems.indexOf(product);

    if (index > -1) {
      this.selectedItems.splice(index, 1); // Item was previously selected, remove it from the list
      // console.log(this.selectedItem);
    } else {
      this.selectedItems.push(product); // Item was not selected, add it to the list
      console.log(this.selectedItems);
    }
  }
  addCheckout() {
    for (const item of this.selectedItems) {
      this.checkoutData.addCheckoutItem(item);
    }
  }
}
