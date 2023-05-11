import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categoryList: Category[] = [];

  categoryObj: Category = {
    id: '',
    category_name: '',
  };
  id: string = '';
  category_name: string = '';

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
    this.id = '';
    this.category_name = '';
  }

  // add category
  addCategory() {
    if (this.category_name == '') {
      alert('Fill all input fields');
      return;
    }

    this.categoryObj.category_name = this.category_name;

    this.data.addCategory(this.categoryObj);
    this.resetForm();
  }

  // update category
  updateCategory() {}

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
}
