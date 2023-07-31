import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/shared/order.service';
import { parseISO } from 'date-fns';
import { parse } from 'date-fns';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css'],
})
export class UserOrdersComponent implements OnInit {
  displayedColumns: string[] = [
    'orderNumber',
    'status',
    'paymentStatus',
    'delivery',
    'delivery date',
  ];

  ordersList: Order[] = [];
  userOrderList: Order[] = [];

  constructor(private dialog: MatDialog, private orderData: OrderService) {}

  dataSource!: MatTableDataSource<Order>;

  ngOnInit(): void {
    this.getAllOrders();
  }

  sortOrdersByDateDesc(orders: Order[]): Order[] {
    return orders.sort((a, b) => {
      const dateA = new Date(a.order_time);
      const dateB = new Date(b.order_time);
      console.log(dateA, '-', dateB);
      return dateB.getTime() - dateA.getTime();
    });
  }

  getAllOrders() {
    this.orderData.getAllOrders().subscribe(
      (res) => {
        this.ordersList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          // // Parse the Firestore date using date-fns parseISO function
          // data.order_time = new Date(parseISO(data.order_time));

          // data.order_time = parse(data.order_time, 'dd/MM/yy, HH.mm', new Date());
          try {
            // Parse the Firestore date using date-fns parse function with custom format
            const parsedDate = parse(
              data.order_time,
              'dd/MM/yy, HH.mm',
              new Date()
            );
            data.order_time = parsedDate;
          } catch (error) {
            console.error(`Error parsing date: ${data.order_time}`);
            data.order_time = new Date(); // Use a default date if parsing fails
          }

          return data;
        });

        console.log('This Order List: ', this.ordersList);
        // Filter orders based on userId
        const userId = localStorage.getItem('userId');
        this.userOrderList = this.ordersList.filter(
          (order: any) => order.orderItem[0].user.id === userId
        );

        // this.userOrderList = this.sortOrdersByDateDesc(this.userOrderList);

        // Sort the ordersList by order_time in descending order
        // this.ordersList.sort((a, b) => {
        //   return b.order_time.getTime() - a.order_time.getTime();

        // });
        this.userOrderList.sort((a, b) => {
          return b.order_time.getTime() - a.order_time.getTime();
        });

        console.log('Sorted Order List', this.ordersList);

        this.userOrderList.sort((a, b) => {
          return b.order_time.getTime() - a.order_time.getTime();
        });

        this.dataSource = new MatTableDataSource(this.userOrderList);
      },
      (err: any) => {
        alert('Error while fetching orders data');
      }
    );
  }

  onRowClick(row: any): void {
    console.log('Row clicked:', row.i);
  }
}
