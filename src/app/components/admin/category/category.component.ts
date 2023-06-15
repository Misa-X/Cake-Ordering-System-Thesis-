import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Custom } from 'src/app/models/custom';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categoryList: Category[] = [];
  customList: Custom[] = [];

  categoryObj: Category = {
    id: '',
    category_name: '',
  };

  customObj: Custom = {
    id: '',
    name: '',
    type: '',
    price: 0,
  };

  selectedCategory: Category | null = null;
  selectedCustom: Custom | null = null;

  id: string = '';
  category_name: string = '';

  custom_id: string = '';
  name: string = '';
  type: string = '';
  price: number = 0;

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  // get all categories
  getAllCategories() {
    this.data.getAllCategories().subscribe(
      (res) => {
        this.categoryList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
      },
      (err: any) => {
        alert('Error while fetching category data');
      }
    );
  }

  resetForm() {
    this.selectedCategory = null;
    this.id = '';
    this.category_name = '';
  }

  resetCustomForm() {
    this.selectedCustom = null;
    this.custom_id = '';
    this.name = '';
    this.type = '';
    this.price = 0;
  }

  // add category
  addCategory() {
    if (this.category_name == '') {
      alert('Fill all input fields');
      return;
    }

    this.categoryObj.category_name = this.category_name;

    if (this.selectedCategory) {
      // Update existing category
      this.categoryObj.id = this.selectedCategory.id;
      this.data.updateCategory(this.categoryObj);
    } else {
      // Add new category
      this.data.addCategory(this.categoryObj);
    }
    this.resetForm();
  }

  // update category
  updateCategory(category: Category) {
    this.selectedCategory = { ...category }; // Make a copy of the selected category
    this.id = this.selectedCategory.id;
    this.category_name = this.selectedCategory.category_name;
  }

  // delete category
  deleteCategory(category: Category) {
    if (
      window.confirm(
        'Are you sure you want to delete' + category.category_name + ' ?'
      )
    ) {
      this.data.deleteCategory(category);
    }
  }

  // add custom
  addCustom() {
    if (this.name == '') {
      alert('Fill all input fields');
      return;
    }

    this.customObj.name = this.name;
    this.customObj.type = this.type;
    this.customObj.price = this.price;

    if (this.selectedCustom) {
      // Update existing customization
      this.customObj.id = this.selectedCustom.id;
      this.data.updateCustom(this.customObj);
    } else {
      // Add new customization
      this.data.addCustom(this.customObj);
    }
    this.resetCustomForm();
  }

  // update category
  updateCustom(custom: Custom) {
    this.selectedCustom = { ...custom }; // Make a copy of the selected customization
    this.custom_id = this.selectedCustom.id;
    this.name = this.selectedCustom.name;
    this.type = this.selectedCustom.type;
    this.price = this.selectedCustom.price;
  }
}
