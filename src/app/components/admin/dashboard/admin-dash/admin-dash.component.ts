import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { Products } from 'src/app/models/products';
import { DataService } from 'src/app/shared/data.service';
import { OrderService } from 'src/app/shared/order.service';

@Component({
  selector: 'app-admin-dash',
  templateUrl: './admin-dash.component.html',
  styleUrls: ['./admin-dash.component.css'],
})
export class AdminDashComponent implements OnInit {
  ordersList: Order[] = [];
  productList: any[] = [];
  orderTotal: Number = 0;
  approvedOrders: Order[] = [];
  pendingOrders: Order[] = [];

  constructor(
    private orderData: OrderService,
    private productData: DataService
  ) {}

  ngOnInit(): void {
    this.getAllOrders();
    this.getAllProducts();
  }

  getAllOrders() {
    this.orderData.getAllOrders().subscribe(
      (res) => {
        this.ordersList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
        console.log(this.ordersList);
        this.ordersList.forEach((order: any) => {
          if (order.payment_status === 'Approved') {
            // Append the order to the ApprovedList
            this.approvedOrders.push(order);
          }

          if (order.order_status === 'pending') {
            // Append the order to the ApprovedList
            this.pendingOrders.push(order);
          }
        });
        this.approvedOrders.forEach((order: any) => {
          this.orderTotal += order.total;
        });
      },
      (err: any) => {
        alert('Error while fetching orders data');
      }
    );
  }
  // get all products
  getAllProducts() {
    this.productData.getAllProducts().subscribe(
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
}
