import { ReturnStatement } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Products } from 'src/app/models/products';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  productList: Products[] = [];
  productObj: Products = {
    id: '',
    product_name: '',
    product_category: '',
    product_description: '',
    product_image: '',
    product_price: 0,
  };
  id: string = '';
  product_name: string = '';
  product_category: string = '';
  product_description: string = '';
  product_image: string = '';
  product_price: number = 0;

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.data.getAllProducts().subscribe(
      (res) => {
        this.productList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
      },
      (err: any) => {
        alert('Error while fetching product data');
      }
    );
  }

  resetForm() {
    this.id = '';
    this.product_name = '';
    this.product_category = '';
    this.product_description = '';
    this.product_image = '';
    this.product_price = 0;
  }

  addProduct() {
    if (
      this.product_name == '' ||
      this.product_description == '' ||
      this.product_category == '' ||
      this.product_price == 0
    ) {
      alert('Fill all input fields');
      return;
    }

    this.productObj.product_name = this.product_name;
    this.productObj.product_image = this.product_image;
    this.productObj.product_description = this.product_description;
    this.productObj.product_category = this.product_category;
    this.productObj.product_price = this.product_price;

    this.data.addProduct(this.productObj);
    this.resetForm();
  }

  updateProduct() {}

  deleteProduct(product: Products) {
    if (
      window.confirm(
        'Are you sure you want to delete' + product.product_name + ' ?'
      )
    ) {
      this.data.deleteProduct(product);
    }
  }
}
