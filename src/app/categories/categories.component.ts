import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categoryArray: Array<any>;
  formCategory: string;
  formStatus: string = 'Add';
  categoryId: string;

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.categoryService.loadData().subscribe({
      next: (val) => {
        this.categoryArray = val;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSubmit(formData: any) {
    let categoryData: Category = {
      category: formData.value.category,
    };

    if (this.formStatus == 'Add') {
      this.categoryService.saveData(categoryData);
    } else if (this.formStatus == 'Edit') {
      this.categoryService.updateData(this.categoryId, categoryData);
      this.formStatus = 'Add';
    }

    formData.reset();
  }

  onEdit(category: string, id: string) {
    this.formCategory = category;
    this.categoryId = id;
    this.formStatus = 'Edit';
  }

  onDelete(id: string) {
    this.categoryService.deleteData(id);
  }
}
