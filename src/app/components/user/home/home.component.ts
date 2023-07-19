import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Products } from 'src/app/models/products';
import { DataService } from 'src/app/shared/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { OrderItemService } from 'src/app/shared/order-item.service';
import { OrderItem } from 'src/app/models/order-item';
import { NotificationsService } from 'src/app/shared/notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  productList: Products[] = [];
  categories: Category[] = [];
  featuredProducts: Products[] = [];

  constructor(
    private data: DataService,
    private storage: AngularFireStorage,
    private orderIData: OrderItemService,
    private notif: NotificationsService
  ) {}

  ngOnInit(): void {
    // this.sendEmail();
    console.log('bla');

    this.data.getAllCategories().subscribe((res) => {
      this.categories = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data } as Category;
      });
    });

    this.data.getAllProducts().subscribe((res) => {
      this.productList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data } as Products;
      });

      // this.orderIData.getAllOrderItems().subscribe((orderItems) => {
      //   const productOrdersCount = this.calculateProductOrdersCount(this.productList, orderItems);
      //   const sortedProducts = this.sortProductsByOrdersCount(this.productList, productOrdersCount);
      //   this.featuredProducts = sortedProducts.slice(0, 3);
      // });
      this.orderIData.getAllOrderItems().subscribe((res) => {
        const orderItems = res.map((e: any) => {
          const data = e.payload.doc.data();
          const id = e.payload.doc.id;
          return { id, ...data } as OrderItem;
        });
        const productOrdersCount = this.calculateProductOrdersCount(
          this.productList,
          orderItems
        );
        const sortedProducts = this.sortProductsByOrdersCount(
          this.productList,
          productOrdersCount
        );
        this.featuredProducts = sortedProducts.slice(0, 3);
      });
    });
  }

  calculateProductOrdersCount(
    products: Products[],
    orderItems: OrderItem[]
  ): Map<string, number> {
    const productOrdersCount = new Map<string, number>();

    // Initialize productOrdersCount with initial count of 0 for all products
    products.forEach((product) => {
      productOrdersCount.set(product.id, 0);
    });

    // Count the number of orders for each product
    orderItems.forEach((orderItem) => {
      const productId = orderItem.product.id;
      if (productOrdersCount.has(productId)) {
        const currentCount = productOrdersCount.get(productId) || 0;
        productOrdersCount.set(productId, currentCount + 1);
      }
    });

    return productOrdersCount;
  }

  sortProductsByOrdersCount(
    products: Products[],
    productOrdersCount: Map<string, number>
  ): Products[] {
    return products.sort((a, b) => {
      const ordersCountA = productOrdersCount.get(a.id) || 0;
      const ordersCountB = productOrdersCount.get(b.id) || 0;
      return ordersCountB - ordersCountA;
    });
  }
}
