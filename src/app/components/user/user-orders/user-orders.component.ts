import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/shared/order.service';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css'],
})
export class UserOrdersComponent implements OnInit {
  displayedColumns: string[] = [
    'orderNumber',
    'customer',
    'delivery date',
    'status',
    'paymentStatus',
    'delivery',
    'category',
  ];

  ordersList: Order[] = [];
  userOrderList: Order[] = [];

  constructor(private dialog: MatDialog, private orderData: OrderService) {}

  dataSource!: MatTableDataSource<Order>;

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders() {
    this.orderData.getAllOrders().subscribe(
      (res) => {
        this.ordersList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });

        console.log('This Order List: ', this.ordersList);
        // Filter orders based on userId
        const userId = localStorage.getItem('userId');
        console.log(userId);
        this.userOrderList = this.ordersList.filter(
          (order: any) => order.orderItem[0].user.id === userId
        );

        console.log(this.userOrderList);
        this.dataSource = new MatTableDataSource(this.userOrderList);
      },
      (err: any) => {
        alert('Error while fetching orders data');
      }
    );
  }

  onRowClick(row: any): void {
    // Perform actions when a row is clicked
    console.log('Row clicked:', row.i);
    // You can navigate to a detailed view or perform any other action here
  }
}
