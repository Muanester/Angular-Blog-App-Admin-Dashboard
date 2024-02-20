import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css',
})
export class NewPostComponent implements OnInit {
  constructor(private categoryService: CategoriesService) {}

  permalink: string = '';
  imgSrc: any = './assets/placeholder.png';
  selectedImg: any;

  categories: Array<any>;

  ngOnInit(): void {
    this.categoryService.loadData().subscribe({
      next: (val) => {
        this.categories = val;
      },
    });
  }

  onTitleChanged(event: any) {
    const title = event.target.value;
    this.permalink = title.replaceAll(' ', '-');
  }

  showPreview(event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target.result;
    };

    reader.readAsDataURL(event.target.files[0]);
    this.selectedImg = event.target.files[0];
  }
}
