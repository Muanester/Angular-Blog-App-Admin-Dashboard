import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrl: './all-post.component.css',
})
export class AllPostComponent implements OnInit {
  postArray: Array<any>;

  constructor(private postService: PostsService) {}

  ngOnInit(): void {
    this.postService.loadData().subscribe({
      next: (data) => {
        this.postArray = data;
      },
    });
  }

  onDelete(postImgPath: string, id: string) {
    this.postService.deleteImg(postImgPath, id);
  }
}
