import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Products } from 'src/app/models/products';
import { DataService } from 'src/app/shared/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  productList: Products[] = [];
  categories: Category[] = [];
  filteredProductList: Products[] = [];
  selectedCategory: string = '';
  sortOption: string = '';
  searchQuery: string = '';
  category: any = {};

  constructor(
    private data: DataService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute
  ) {}

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
      this.filteredProductList = [...this.productList];
      this.route.queryParams.subscribe((params) => {
        this.searchQuery = params['query'] || '';
        this.searchProducts();

        this.category.id = params['queryC'] || '';
        this.filterProducts(this.category.id);
      });

      this.filterProducts('all');
    });
  }

  // FILTER Products by category
  filterProducts(categoryId: string): void {
    if (categoryId === 'all') {
      this.filteredProductList = [...this.productList];
    } else {
      this.filteredProductList = this.productList.filter(
        (product) => product.product_category.id === categoryId
      );
    }

    if (this.searchQuery.trim() !== '') {
      const lowercaseQuery = this.searchQuery.toLowerCase();
      this.filteredProductList = this.filteredProductList.filter(
        (product) =>
          product.product_name.toLowerCase().includes(lowercaseQuery) ||
          product.product_description.toLowerCase().includes(lowercaseQuery)
      );
    }

    this.selectedCategory = categoryId;
  }

  // SORT Products by price
  sortProducts(option: string): void {
    this.sortOption = option;
    if (option === 'priceAsc') {
      this.filteredProductList.sort(
        (a, b) => a.product_price - b.product_price
      );
    } else if (option === 'priceDesc') {
      this.filteredProductList.sort(
        (a, b) => b.product_price - a.product_price
      );
    }
  }

  //  SEARCH Products
  searchProducts(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredProductList = [...this.productList];
    } else {
      const lowercaseQuery = this.searchQuery.toLowerCase();
      this.filteredProductList = this.productList.filter(
        (product) =>
          product.product_name.toLowerCase().includes(lowercaseQuery) ||
          product.product_description.toLowerCase().includes(lowercaseQuery)
      );
    }
    this.selectedCategory = ''; // Clear category filter when performing search
  }
}
