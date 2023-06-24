import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

export interface Order {
  name: string;
  amount: number;
  date: string;
  status: string;
  paymentStatus: string;
  delivery: string;
  category: string;
  orderNumber: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'amount',
    'date',
    'status',
    'paymentStatus',
    'delivery',
    'category',
    'orderNumber',
  ];

  constructor(private dialog: MatDialog) {}

  dataSource!: MatTableDataSource<Order>;

  ngOnInit(): void {
    const ordersData: Order[] = [
      {
        name: 'Order 1',
        amount: 10,
        date: '2023-06-10',
        status: 'Pending',
        paymentStatus: 'Paid',
        delivery: 'On Time',
        category: 'Bread',
        orderNumber: '123456',
      },
      {
        name: 'Order 2',
        amount: 5,
        date: '2023-06-12',
        status: 'Completed',
        paymentStatus: 'Paid',
        delivery: 'Delayed',
        category: 'Cake',
        orderNumber: '789012',
      },
      // Add more orders here as needed
    ];

    this.dataSource = new MatTableDataSource(ordersData);
  }
}
