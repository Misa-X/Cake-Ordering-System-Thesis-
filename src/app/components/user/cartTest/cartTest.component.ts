import { Component, OnInit } from '@angular/core';
import { OrderItemService } from 'src/app/shared/order-item.service';
import { OrderItem } from 'src/app/models/order-item';
import { Custom } from 'src/app/models/custom';
import { CheckoutService } from 'src/app/shared/checkout.service';

@Component({
  selector: 'app-cartTest',
  templateUrl: './cartTest.component.html',
  styleUrls: ['./cartTest.component.css'],
})
export class CartTestComponent implements OnInit {
  cartItems: OrderItem[] = [];
  selectedItems: OrderItem[] = [];
  orderItemCount: number = 0;
  totalPriceCart: number = 0;
  

  constructor(
    private itemData: OrderItemService,
    private checkoutData: CheckoutService
  ) {}

  ngOnInit() {
    this.getCartProduct();
  }

// Get cart items
  getCartProduct() {
    this.itemData.getAllOrderItems().subscribe((prof) => {
      this.cartItems = prof.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data, selected: false } as OrderItem;
      });

      this.calculateTotalPriceCart();
      this.updateSelectedItems();
    });
  }

  updateSelectedItems() {
    // Update selectedItems array with items that are also in cartItems array
    this.selectedItems = this.cartItems.filter((item) =>
      this.selectedItems.some((selectedItem) => selectedItem.id === item.id)
    );
  }

// Calculate total
  calculateTotalPriceCart() {
    this.totalPriceCart = this.selectedItems.reduce(
      (total, item) => total + item.subtotal,
      0
    );
  }

    // Calculate subtotal
  //  calculateSubtotal() {
  //   const userId = localStorage.getItem('userId');
  //   this.Profile = this.cartItems.filter(
  //     (userProfile) => userProfile.user.id === userId
  //   );    

  //   this.Profile.forEach((item: OrderItem) => {
  //     const productPrice = parseFloat(item.product.product_price.toString());
  //     let totalPrice = productPrice;
  //     const quantity = parseFloat(item.quantity.toString());

  //     item.customization.forEach((customization: Custom) => {
  //       const custPrice = parseFloat(customization.price.toString());
  //       if (!isNaN(custPrice)) {
  //         totalPrice += custPrice;
  //       }
  //     });

  //     if (!isNaN(productPrice) && !isNaN(quantity)) {
  //       item.subtotal = totalPrice * quantity;
  //     } else {
  //       item.subtotal = 0;
  //     }

  //     this.itemData
  //       .updateOrderItem(item)
  //       .then(() => {
  //         console.log('Subtotal updatedd:', item.subtotal);
  //       })
  //       .catch((error) => {
  //         console.error('Error updating order item:', error);
  //       });
  //   });
  // }

  toggleSelection(product: OrderItem) {
    product.selected = !product.selected;
    this.updateSelectedItems();
    this.calculateTotalPriceCart();
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
        this.calculateTotalPriceCart();
        this.updateSelectedItems();
      })
      .catch((error) => {
        console.error('Error updating order item:', error);
      });
  }

  deleteOrderItem(item: OrderItem) {
    this.itemData.deleteOrderItem(item);
  }

  addCheckout() {
    for (const item of this.selectedItems) {
      this.checkoutData.addCheckoutItem(item);
    }
  }
}
