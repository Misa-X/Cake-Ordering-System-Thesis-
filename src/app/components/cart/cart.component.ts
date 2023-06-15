import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Products } from 'src/app/models/products';
import { ActivatedRoute } from '@angular/router';
import { Customization } from 'src/app/models/customization';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  // cartProducts: Products[] = [];
  cartProducts: Customization[] = [];
  showDataNotFound = true;

  // Not Found Message
  messageTitle = 'No Products Found in Cart';
  messageDescription = 'Please, Add Products to Cart';

  subtotal = 0;

  constructor(private data: DataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Access the form data from the route parameters
    this.route.queryParams.subscribe((params) => {
      const formData = params;

      // Use the form data
      // console.log(formData);
    });

    // Get the cart products
    this.getCartProduct();

    // this.calculateSubtotal();
  }

  removeCartProduct(product: Customization) {
    this.data.removeLocalCartProduct(product);

    // Recalling
    this.getCartProduct();
  }

  getCartProduct() {
    this.cartProducts = this.data.getLocalCartProducts();
    console.log('cart pro', this.cartProducts);
  }

  // calculateSubtotal() {
  //   this.subtotal = 0;
  //   this.cartProducts.forEach((product) => {
  //     this.subtotal += Number(product.product_price);
  //   });
  // }
}
