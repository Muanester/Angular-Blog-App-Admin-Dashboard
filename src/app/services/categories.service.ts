import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private afs: AngularFirestore, private toastr: ToastrService) {}

  saveData(data: any) {
    this.afs
      .collection('categories')
      .add(data)
      .then(() => {
        this.toastr.success('Category Added Successfully ..!');
      })
      .catch((err) => this.toastr.error('Error', err));
  }

  loadData() {
    return this.afs
      .collection('categories')
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

  updateData(id: string, editData: Category) {
    this.afs
      .collection('categories')
      .doc(id)
      .update(editData)
      .then(() => {
        this.toastr.success('Category Updated Successfully ..!');
      });
  }

  deleteData(id: string) {
    this.afs
      .collection('categories')
      .doc(id)
      .delete()
      .then(() => {
        this.toastr.success('Category Deleted Successfully ..!');
      });
  }
}
