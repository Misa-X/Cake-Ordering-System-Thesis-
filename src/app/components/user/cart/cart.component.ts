import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Products } from 'src/app/models/products';
import { ActivatedRoute } from '@angular/router';
import { Customization } from 'src/app/models/customization';
import { Custom } from 'src/app/models/custom';
import { OrderItemService } from 'src/app/shared/order-item.service';
import { OrderItem } from 'src/app/models/order-item';
import { forkJoin } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: OrderItem[] = [];
  dt: OrderItem[] = [];
  showDataNotFound = true;
  message = '';

  selectedItem: OrderItem | null = null;

  // Not Found Message
  messageTitle = 'No Products Found in Cart';
  messageDescription = 'Please, Add Products to Cart';

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
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    // Get the cart products
    this.getCartProduct();

    this.getOrderItemCount();
  }

  removeCartProduct(item: OrderItem) {
    this.itemData.deleteOrderItem(item);

    // Recalling
    this.getCartProduct();
  }

  //from chatgpt u can delete
  getCartProduct() {
    let data_list: OrderItem[] = [];

    this.itemData.getAllOrderItems().subscribe(
      (res) => {
        this.cartItems = res.map((e: any) => {
          const data = e.payload.doc.data();
          const id = e.payload.doc.id;
          let totalCustPrice = 0;

          data_list.push(data);

          return { id, ...data } as OrderItem;
        });

        console.log('item:', data_list);

        data_list.forEach((data) => {
          let itemCustPrice = 0;

          data.customization.forEach((customization: Custom) => {
            const custPrice = parseFloat(customization.price.toString());
            itemCustPrice += custPrice;
          });
          console.log('Total Customization price for item:', itemCustPrice);
          const qty_total = data.quantity * data.product.product_price;
          console.log('Qty Total: ', qty_total);

          let subtotal_price = qty_total + itemCustPrice;
          data.subtotal = subtotal_price;

          console.log('Item SubTotal (qty ft cust) : ', subtotal_price);
          this.calculateTotalPriceCart();
        });

        // Calculate customization for each cart item
        // this.cartItems.forEach((item) => {
        //   this.calculateCustomization(item);
        // });
        // this.calculateCustomizations();

        // this.calculateSubtotal();
      },
      (err: any) => {
        alert('Error while fetching cart items');
      }
    );
  }

  //Orginal Get product
  // getCartProduct() {
  //   let data_list: OrderItem[] = []; // Declare an array to store the data

  //   this.itemData.getAllOrderItems().subscribe(
  //     (res) => {
  //       this.cartItems = res.map((e: any) => {
  //         const data = e.payload.doc.data();
  //         const id = e.payload.doc.id;
  //         let totalCustPrice = 0;
  //         // console.log('this data: ', data);
  //         data_list.push(data);

  //         // data.customization.forEach((customization: Custom) => {
  //         //   const custPrice = parseFloat(customization.price.toString());
  //         //   totalCustPrice += custPrice;

  //         // console.log('Some Customization prices : ', custPrice);
  //         // });
  //         // console.log('Total Customizations', totalCustPrice);
  //         // const qty_total = data.quantity * data.product.product_price;
  //         // // console.log('Cust Total: ', qty_total);

  //         // let subtotal_price = qty_total + totalCustPrice;
  //         // data.subtotal = subtotal_price;
  //         // console.log('Item SubTotal (qty ft cust) : ', subtotal_price);

  //         // this.itemData.updateOrderItem(data);
  //         // this.itemData
  //         //   .updateOrderItem(data)
  //         //   .then(() => {
  //         //     this.subtotal = data.subtotal; // Update the subtotal locally after successful update in the database
  //         //   })
  //         //   .catch((error) => {
  //         //     console.error('Error updating order item:', error);
  //         //   });

  //         return { id, ...data } as OrderItem;
  //       });

  //       console.log('item:', data_list);

  //       let totalCustPrice = 0;
  //       data_list.forEach((data) => {
  //         data.customization.forEach((customization: Custom) => {
  //           const custPrice = parseFloat(customization.price.toString());
  //           totalCustPrice += custPrice;
  //           console.log('Some Customization prices : ', custPrice);
  //         });
  //       });

  //       // Calculate customization for each cart item
  //       // this.cartItems.forEach((item) => {
  //       //   this.calculateCustomization(item);
  //       // });
  //       // this.calculateCustomizations();

  //       // this.calculateSubtotal();
  //     },
  //     (err: any) => {
  //       alert('Error while fetching cart items');
  //     }
  //   );
  // }

  calculateSubtotal() {
    // this.cartItems.forEach((item) => {
    //   this.subtotal = item.product.product_price * item.quantity;
    // });

    this.cartItems.forEach((item) => {
      const productPrice = parseFloat(item.product.product_price.toString());
      const quantity = parseFloat(item.quantity.toString());

      if (!isNaN(productPrice) && !isNaN(quantity)) {
        item.subtotal = productPrice * quantity;
      } else {
        item.subtotal = 0;
      }
    });
  }

  // calculateCustomization(item: OrderItem) {
  //   console.log('its working');
  //   const productPrice = parseFloat(item.product.product_price.toString());
  //   let totalPrice = productPrice; // Initialize totalPrice with the product price

  //   item.customization.forEach((customization: Custom) => {
  //     const custPrice = parseFloat(customization.price.toString());
  //     if (!isNaN(custPrice)) {
  //       totalPrice += custPrice;
  //     }
  //   });

  //   item.subtotal = totalPrice;

  //   this.itemData
  //     .updateOrderItem(item)
  //     .then(() => {
  //       console.log('Subtotal updated:', item.subtotal);
  //       // this.subtotal = item.subtotal;
  //     })
  //     .catch((error) => {
  //       console.error('Error updating order item:', error);
  //     });
  // }

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
  }

  updateQuantity(item: OrderItem) {
    // console.log(item);
    // this.itemData.updateOrderItem(item);

    // this.itemData
    //   .updateOrderItem(item)
    //   .then(() => {
    //     this.calculateSubtotal(); // Update the subtotal locally after successful update in the database
    //   })
    //   .catch((error) => {
    //     console.error('Error updating order item:', error);
    //   });

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
}
