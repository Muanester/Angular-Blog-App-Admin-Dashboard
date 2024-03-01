import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private router: Router
  ) {}

  uploadImage(
    selectedImage: any,
    postData: any,
    formStatus: string,
    id: string
  ) {
    const filePath = `postIMG/${Date.now()}`;

    this.storage.upload(filePath, selectedImage).then(() => {
      this.storage
        .ref(filePath)
        .getDownloadURL()
        .subscribe({
          next: (URL) => {
            postData.postImgPath = URL;

            if (formStatus == 'Edit Post') {
              this.updateData(id, postData);
            } else {
              this.saveData(postData);
            }
          },
        });
    });
  }

  saveData(postData: any) {
    this.afs
      .collection('posts')
      .add(postData)
      .then(() => {
        this.toastr.success('Data Added Successfully..!');

        setTimeout(() => {
          this.router.navigate(['/posts']);
        }, 2000);
      });
  }

  loadData() {
    return this.afs
      .collection('posts')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;

            return { id, data };
          });
        })
      );
  }

  loadOneData(id: string) {
    return this.afs.collection('posts').doc(id).valueChanges();
  }

  updateData(id: string, postData: any) {
    this.afs
      .collection('posts')
      .doc(id)
      .update(postData)
      .then(() => {
        this.toastr.success('Post Updated Successfully..!');

        this.router.navigate(['/posts']);
      });
  }

  deleteImg(postImgPath: any, id: string) {
    this.storage.storage
      .refFromURL(postImgPath)
      .delete()
      .then(() => {
        this.deleteData(id);
      });
  }

  deleteData(id: string) {
    this.afs
      .collection('posts')
      .doc(id)
      .delete()
      .then(() => {
        this.toastr.warning('Post Deleted Successfully..!');
      });
  }

  markFeatured(id: string, featuredData: any) {
    this.afs
      .collection('posts')
      .doc(id)
      .update(featuredData)
      .then(() => {
        this.toastr.info('Featured Status Updated..!');
      });
  }
}
