import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Products } from 'src/app/models/products';
import { DataService } from 'src/app/shared/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  productList: Products[] = [];
  categories: Category[] = [];

  constructor(private data: DataService, private storage: AngularFireStorage) {}

  ngOnInit(): void {
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
    });
  }
}
