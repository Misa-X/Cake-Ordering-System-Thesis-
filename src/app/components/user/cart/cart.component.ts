import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Products } from 'src/app/models/products';
import { ActivatedRoute } from '@angular/router';
import { Customization } from 'src/app/models/customization';
import { Custom } from 'src/app/models/custom';
import { OrderItemService } from 'src/app/shared/order-item.service';
import { OrderItem } from 'src/app/models/order-item';

import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: OrderItem[] = [];
  showDataNotFound = true;
  message = '';

  selectedItem: OrderItem | null = null;

  // id: string = '';
  // quantity: number = 1;

  // Not Found Message
  messageTitle = 'No Products Found in Cart';
  messageDescription = 'Please, Add Products to Cart';

  // subtotal = 0;

  id: string = '';
  product: string = '';
  customization: string = '';
  color: string = '';
  note: string = '';
  quantity: number = 1;
  picture: string = '';
  subtotal: number = 0;

  constructor(
    private route: ActivatedRoute,
    private itemData: OrderItemService
  ) {}

  ngOnInit(): void {
    // Get the cart products
    this.getCartProduct();

    // this.calculateSubtotal();
  }

  removeCartProduct(item: OrderItem) {
    this.itemData.deleteOrderItem(item);

    // Recalling
    this.getCartProduct();
  }

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

  updateQuantity(item: OrderItem) {
    this.itemData
      .updateOrderItem(item)
      .then(() => {
        // Success, handle the updated item
        console.log('Order item updated successfully');
      })
      .catch((error) => {
        // Error, handle the error
        console.log('Error updating order item:', error);
      });

    // const iData = {
    //   id: this.selectedItem?.id,
    //   product: this.selectedItem?.product,
    //   customization: this.selectedItem?.customization,
    //   color: this.selectedItem?.color,
    //   note: this.selectedItem?.note,
    //   quantity: this.selectedItem?.quantity,
    //   picture: this.selectedItem?.picture,
    //   subtotal: this.selectedItem?.subtotal
    // }
  }

  deleteOrderItem(item: OrderItem) {
    this.itemData.deleteOrderItem(item);
  }

  calculateSubtotal() {
    this.subtotal = this.cartItems.reduce(
      (total, item) => total + item.quantity * item.subtotal,
      0
    );
  }
}
