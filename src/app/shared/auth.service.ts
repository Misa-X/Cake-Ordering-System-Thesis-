import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@angular/fire/auth';
// import { auth } from 'firebase/compat/app'
import { Auth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
//import * as admin from 'firebase-admin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fireauth: AngularFireAuth, private router: Router) {}
  // new login method
  login(email: string, password: string) {
    this.fireauth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        localStorage.setItem('token', 'true');

        if (res.user?.emailVerified) {
          if (res.user.displayName === 'admin') {
            this.router.navigate(['/dash']);
          } else {
            this.router.navigate(['/user/home']);
          }
        } else {
          this.router.navigate(['/verify-email']);
        }
      })
      .catch((err) => {
        alert(err.message);
        this.router.navigate(['/login']);
      });
  }

  //Original login method
  // login(email: string, password: string) {
  //   this.fireauth.signInWithEmailAndPassword(email, password).then(
  //     (res) => {
  //       localStorage.setItem('token', 'true');

  //       if (res.user?.emailVerified == true) {
  //         this.router.navigate(['/home']);
  //       } else {
  //         this.router.navigate(['/verify-email']);
  //       }
  //     },
  //     (err) => {
  //       alert(err.message);
  //       this.router.navigate(['/login']);
  //     }
  //   );
  // }

  // register an admin user
  registerAdmin(email: string, password: string) {
    this.fireauth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        alert('Registration successful');
        this.router.navigate(['/login']);
        this.sendEmailVerification(res.user);

        // Assign "user" role to newly registered user
        if (res.user) {
          res.user
            .updateProfile({
              displayName: 'admin',
              // Add other user profile data as needed
            })
            .then(() => {
              // User profile updated successfully
            })
            .catch((error) => {
              // Error updating user profile
            });
        }
      })
      .catch((err) => {
        alert(err.message);
        this.router.navigate(['/register']);
      });
  }

  // new register method basic user
  register(email: string, password: string) {
    this.fireauth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        alert('Registration successful');
        this.router.navigate(['/login']);
        this.sendEmailVerification(res.user);

        // Assign "user" role to newly registered user
        if (res.user) {
          res.user
            .updateProfile({
              displayName: 'user',
              // Add other user profile data as needed
            })
            .then(() => {
              // User profile updated successfully
            })
            .catch((error) => {
              // Error updating user profile
            });
        }
      })
      .catch((err) => {
        alert(err.message);
        this.router.navigate(['/register']);
      });
  }

  // original register method
  // register(email: string, password: string) {
  //   this.fireauth.createUserWithEmailAndPassword(email, password).then(
  //     (res) => {
  //       alert('Registration successful');
  //       this.router.navigate(['/login']);
  //       this.sendEmailVerification(res.user);
  //     },
  //     (err) => {
  //       alert(err.message);
  //       this.router.navigate(['/register']);
  //     }
  //   );
  // }

  //sign out
  logout() {
    this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  //forgot password

  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(
      () => {
        this.router.navigate(['/veriy-email']);
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }

  //email verification
  sendEmailVerification(user: any) {
    user.sendEmailVerification().then(
      () => {
        this.router.navigate(['/verify-email']);
      },
      (err: any) => {
        alert('Something went wrong');
      }
    );
  }

  //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider()).then(
      (res) => {
        this.router.navigate(['/home']);
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  //set custom claims
}
