import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Post } from '../../models/post';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css',
})
export class NewPostComponent implements OnInit {
  permaLink: string = '';
  imgSrc: any = './assets/placeholder.png';
  selectedImg: any;

  categories: Array<any>;

  postForm: FormGroup;

  docId: string;

  post: any;

  formStatus: string = 'Add New Post';
  formStatusMsg: string = 'You can add your new post here.';

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe({
      next: (val) => {
        this.docId = val['id'];

        if (this.docId) {
          this.postService.loadOneData(val['id']).subscribe({
            next: (post) => {
              this.post = post;

              this.postForm = this.fb.group({
                title: [
                  this.post.title,
                  [Validators.required, Validators.minLength(10)],
                ],
                permalink: new FormControl({
                  value: this.permaLink,
                  disabled: true,
                }),
                excerpt: [
                  this.post.excerpt,
                  [Validators.required, Validators.minLength(50)],
                ],
                category: [
                  `${this.post.category.categoryId}-${this.post.category.category}`,
                  Validators.required,
                ],
                postImg: ['', Validators.required],
                content: [this.post.content, Validators.required],
              });

              this.imgSrc = this.post.postImgPath;

              this.formStatus = 'Edit Post';
              this.formStatusMsg = 'You can edit your post here.';
            },
          });
        } else {
          this.postForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(10)]],
            permalink: new FormControl({
              value: this.permaLink,
              disabled: true,
            }),
            excerpt: ['', [Validators.required, Validators.minLength(50)]],
            category: ['', Validators.required],
            postImg: ['', Validators.required],
            content: ['', Validators.required],
          });
        }
      },
    });
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe({
      next: (val) => {
        this.categories = val;
      },
    });
  }

  get fc() {
    return this.postForm.controls;
  }

  onTitleChanged(event: any) {
    const title = event.target.value;
    this.permaLink = title.replaceAll(' ', '-');
  }

  showPreview(event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target.result;
    };

    reader.readAsDataURL(event.target.files[0]);
    this.selectedImg = event.target.files[0];
  }

  onSubmit() {
    let splitted = this.postForm.value.category.split('-');

    const postData: Post = {
      title: this.postForm.value.title,
      permalink: 'permalink',
      category: {
        categoryId: splitted[0],
        category: splitted[1],
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date(),
    };

    this.postService.uploadImage(
      this.selectedImg,
      postData,
      this.formStatus,
      this.docId
    );

    this.postForm.reset();
    this.imgSrc = './assets/placeholder.png';
  }
}
