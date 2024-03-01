import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGuard: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router
  ) {}

  login(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.toastr.success('Login successfull..!');
        this.loadUser();

        this.loggedIn.next(true);
        this.isLoggedInGuard = true;

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      })
      .catch((e) => {
        this.toastr.warning(e.message);
      });
  }

  loadUser() {
    this.afAuth.authState.subscribe({
      next: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
      },
    });
  }

  logOut() {
    this.afAuth.signOut().then(() => {
      this.toastr.success('Logged Out Successful..!');

      localStorage.removeItem('user');

      this.loggedIn.next(false);
      this.isLoggedInGuard = false;

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    });
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
