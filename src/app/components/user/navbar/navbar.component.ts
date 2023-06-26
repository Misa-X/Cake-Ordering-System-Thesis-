import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { DataService } from 'src/app/shared/data.service';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Input() isLoginPage: boolean = false;

  categories: any = {};

  constructor(private auth: AuthService, private data: DataService) {}

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

  logout() {
    this.auth.logout();
  }
}
