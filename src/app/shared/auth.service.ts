import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@angular/fire/auth';
// import { auth } from 'firebase/compat/app'
import { Auth } from '@angular/fire/auth';
import { map, switchMap } from 'rxjs/operators';
//import * as admin from 'firebase-admin';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Firestore } from '@angular/fire/firestore';
import { uuidv4 } from '@firebase/util';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
  ) {}
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
            const userId = res.user.uid;
            localStorage.setItem('userId', userId);
            this.router.navigate(['/user/home']);
          }
        } else {
          this.router.navigate(['/verify-email']);
        }
      })
      .catch((err) => {
        alert('User not found' + err.message);
        this.router.navigate(['/login']);
      });
  }

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
  // register(email: string, password: string) {
  //   this.fireauth
  //     .createUserWithEmailAndPassword(email, password)
  //     .then((res) => {
  //       alert('Registration successful');
  //       this.router.navigate(['/login']);
  //       this.sendEmailVerification(res.user);

  //       // Assign "user" role to newly registered user
  //       if (res.user) {
  //         res.user
  //           .updateProfile({
  //             displayName: 'user',
  //             // Add other user profile data as needed
  //           })
  //           .then(() => {
  //             // User profile updated successfully
  //           })
  //           .catch((error) => {
  //             // Error updating user profile
  //           });
  //       }
  //     })
  //     .catch((err) => {
  //       alert(err.message);
  //       this.router.navigate(['/register']);
  //     });
  // }

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

  register(email: string, password: string) {
    this.fireauth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        if (res.user) {
          alert('Registration successful');
          this.router.navigate(['/login']);
          this.sendEmailVerification(res.user);

          // Create user profile document in Firestore
          const userId = res.user.uid;
          const userProfile = {
            id: userId,
            displayName: 'user',
            name: 'John Doe',
            email: email,
            phoneNumber: '123 456 789',
            address: 'Your Home',
            // Add other user profile data as needed
          };
          this.afs
            .collection('/userProfiles')
            .doc(userId)
            .set(userProfile)
            .then(() => {
              // User profile created successfully
            })
            .catch((error) => {
              // Error creating user profile
            });
        }
      })
      .catch((err) => {
        alert(err.message);
        this.router.navigate(['/register']);
      });
  }

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

  //get product by id
  getProfileById(id: string | null) {
    console.log('UserID: ', id);
    return this.afs
      .collection('/userProfiles', (ref) => ref.where('id', '==', id))
      .valueChanges()
      .pipe(
        map((profile) => profile[0]) // Retrieve the first matching product
      );
  }

  // get all products
  getAllProfiles() {
    return this.afs.collection('/userProfiles').snapshotChanges();
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
