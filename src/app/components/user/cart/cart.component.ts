import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Products } from 'src/app/models/products';
import { ActivatedRoute, Router } from '@angular/router';
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
  // selectedItems: OrderItem[] = [];
  showDataNotFound = true;
  message = '';

  Profile: any = [];

  // selectedItem: OrderItem[] = [];

  // Not Found Message
  messageTitle = 'No Products Found in Cart';
  messageDescription = 'Please, Add Products to Cart';

  checkoutItemObj: OrderItem = {
    id: '',
    user: {
      id: '',
      name: '',
      email: '',
      phoneNumber: '',
      address: {
        street: '',
        city: { id: '', delivery_city: '', delivery_price: 0 },
      },
      image: '',
    },
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
    selected: false,
  
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
    private checkoutData: CheckoutService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Get the cart products
    this.getCartProduct();

    setTimeout(() => {
      this.getOrderItemCount();
    }, 5000);

     setTimeout(() => {
      this.calculateTotalPriceCart();
    }, 5000);
    
  }

  removeCartProduct(item: OrderItem) {
    this.itemData.deleteOrderItem(item);

    // Recalling
    this.getCartProduct();
  }

  getCartProduct() {
    this.itemData.getAllOrderItems().subscribe((prof) => {
      this.cartItems = prof.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        // console.log(this.cartItems);

        return { id, ...data, selected: false } as OrderItem;
      });

      const userId = localStorage.getItem('userId');
      this.Profile = this.cartItems.filter(
        (userProfile) => userProfile.user.id === userId
      );
      this.calculateTotalPriceCart();

      // Update selectedItems array with items that are also in Profile array
      // this.selectedItems = this.selectedItems.filter((selectedItem) =>
      //   this.Profile.some((item: OrderItem) => item.id === selectedItem.id)
      // );

      if (this.Profile.length > 0) {
        // Cart items with matching user ID are found
        // console.log('Found profile:', this.Profile);
      } else {
        // No matching cart items are found
        console.log('No cart items found for the user.');
      }

      if (this.Profile) {
        // The userProfile with matching user ID is found
        // console.log('Found profile:', this.Profile);
      } else {
        // No matching userProfile is found
        console.log('Profile not found.');
      }
    });
  }

  calculateSubtotal() {
    const userId = localStorage.getItem('userId');
    this.Profile = this.cartItems.filter(
      (userProfile) => userProfile.user.id === userId
    );
    // console.log('Profile cart items: ', this.Profile);
    // this.cartItems.forEach((item) => {
    //   this.subtotal = item.product.product_price * item.quantity;
    // });

    this.Profile.forEach((item: OrderItem) => {
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
          console.log('Subtotal updatedd:', item.subtotal);
          // this.calculateTotalPriceCart();
          // this.subtotal = item.subtotal;
        })
        .catch((error) => {
          console.error('Error updating order item:', error);
        });
    });
  }

  // In your component class
  updateCartItem(item: any) {
    // this.toggleSelection(item);
    this.calculateTotalPriceCart();
  }

  calculateTotalPriceCart() {
    console.log('Profile test 2: ', this.Profile);
    // console.log('This Selected Product: ', this.selectedItems);

    // const userId = localStorage.getItem('userId');
    // this.Profile = this.cartItems.filter(
    //   (userProfile) => userProfile.user.id === userId
    // );
    this.totalPriceCart = 0; // Reset totalPriceCart to 0 before calculating

    this.Profile.forEach((item: { subtotal: number }) => {
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


    // const itemIndex = this.cartItems.findIndex(
    //   (cartItem) => cartItem.id === item.id
    // );
    // if (itemIndex > -1) {
    //   this.cartItems[itemIndex] = item; // Update the item in the cartItems array

    //   const selectedItemsIndex = this.selectedItems.findIndex(
    //     (selectedItem) => selectedItem.id === item.id
    //   );
    //   if (selectedItemsIndex > -1) {
    //     this.selectedItems[selectedItemsIndex] = item; // Update the item in the selectedItems array
    //   }
    // }


    this.itemData
      .updateOrderItem(item)
      .then(() => {
        this.subtotal = item.subtotal; // Update the subtotal locally after successful update in the database
        this.calculateSubtotal();
        // this.calculateTotalPriceCart();

        // this.selectedItems.splice(0, this.selectedItems.length); // delete items in selectedcart items
      })
      .catch((error) => {
        console.error('Error updating order item:', error);
      });
  }

  deleteOrderItem(item: OrderItem) {
    this.itemData.deleteOrderItem(item);
  }

  getOrderItemCount() {
    const userId = localStorage.getItem('userId');
    this.Profile = this.cartItems.filter(
      (userProfile) => userProfile.user.id === userId
    );
    console.log(this.Profile.length);
    this.orderItemCount = this.Profile.length;
  }

  // toggleSelection(product: OrderItem) {
  //   // this.totalPriceCart -= this.totalPriceCart;
  //   // const index = this.selectedItems.indexOf(product);
  //   const index = this.selectedItems.findIndex(
  //     (item) => item.id === product.id
  //   );

  //   if (index > -1) {
  //     this.selectedItems.splice(index, 1); // Item was previously selected, remove it from the list
  //     // this.totalPriceCart -= this.totalPriceCart;
  //   } else {
  //     this.selectedItems.push(product); // Item was not selected, add it to the list
  //   }

  //   product.selected = !product.selected;
  //   this.calculateTotalPriceCart(); // Recalculate the total price after changing selection

  //   console.log('Selected Cart Items:', this.selectedItems);
  // }


  addCheckout() {
    for (const item of this.Profile) {
      this.checkoutData.addCheckoutItem(item);
    }

   this.deleteOrderItem(this.Profile)

const addedItemId = this.checkoutItemObj.id;
   
    // Navigate to the checkout page with the order item ID as a parameter
    const checkoutUrl = `/user/checkout/${addedItemId}`;
    this.router.navigateByUrl(checkoutUrl);
  }
}
