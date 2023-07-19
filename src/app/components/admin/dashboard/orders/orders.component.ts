import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/shared/order.service';

// export interface Order {
//   name: string;
//   amount: number;
//   date: string;
//   status: string;
//   paymentStatus: string;
//   delivery: string;
//   category: string;
//   orderNumber: string;
// }

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  displayedColumns: string[] = [
    'orderNumber',
    'customer',
    'delivery date',
    'status',
    'paymentStatus',
    'delivery',
  ];

  ordersList: Order[] = [];

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
        console.log(this.ordersList);
        this.dataSource = new MatTableDataSource(this.ordersList);
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
