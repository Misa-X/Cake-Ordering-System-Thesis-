import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { DataService } from 'src/app/shared/data.service';
import { Category } from 'src/app/models/category';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Input() isLoginPage: boolean = false;

  categories: any = {};

  constructor(
    private auth: AuthService,
    private data: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
    if (this.data) {
      this.categories = { ...this.data }; // Assign a copy of the received product data to the component variable
    }
  }

  getAllCategories() {
    this.data.getAllCategories().subscribe((res) => {
      this.categories = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data } as Category;
      });
    });
  }

  gotToOrders() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate(['/user/orders', userId]);
    } else {
      console.log('There Is an Error');
      // Handle the case when userId is not available
      // You can redirect to a login page or display an error message
    }
  }
  goToProfile() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate(['/user/profile', userId]);
    } else {
      console.log('There Is an Error');
      // Handle the case when userId is not available
      // You can redirect to a login page or display an error message
    }
  }

  logout() {
    localStorage.removeItem('userId');
    this.auth.logout();
  }
}
