import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@angular/fire/auth';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import * as jwt_decode from 'jwt-decode';
// import * as jwt from 'jsonwebtoken';
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

import { environment } from 'src/environments/environment';
import { UserProfile } from '../models/user-profiles';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
  ) {}
  // private jwtSecret = environment.jwtSecret;
  // start of login method
  // async login(email: string, password: string) {
  //   try {
  //     const userCredential = await this.fireauth.signInWithEmailAndPassword(
  //       email,
  //       password
  //     );
  //     const user = userCredential.user;

  //     if (user?.emailVerified) {
  //       const token = this.generateJwtToken(user.uid);
  //       localStorage.setItem('token', token);

  //       if (user.displayName === 'admin') {
  //         this.router.navigate(['/dash']);
  //       } else {
  //         localStorage.setItem('userId', user.uid);
  //         this.router.navigate(['/user/home']);
  //       }
  //     } else {
  //       this.router.navigate(['/verify-email']);
  //     }
  //   } catch (err: any) {
  //     // Use 'any' type for 'err'
  //     alert('User not found' + err.message);
  //     this.router.navigate(['/login']);
  //   }
  // }

  // // Generate a JWT token
  // private generateJwtToken(uid: string): string {
  //   const payload = {
  //     sub: uid,
  //     // Add additional claims if needed (e.g., roles, permissions, etc.)
  //   };

  //   return jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' }); // Adjust the expiration time as needed
  // }

  //end of method

  // new login method
  login(email: string, password: string) {
    this.fireauth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        localStorage.setItem('token', 'true');

        if (res.user?.emailVerified) {
          if (res.user.displayName === 'admin') {
            this.router.navigate(['/dash/admin-dash']);
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

  async getUserRole(uid: string): Promise<string | null> {
    try {
      const doc = await this.afs
        .collection('/userProfiles')
        .doc(uid)
        .get()
        .toPromise();
      const role = doc?.get('displayName') as string | undefined; // Use optional chaining

      if (role !== 'admin') {
        this.router.navigate(['/user/home']);
      }
      return role ?? null; // Use nullish coalescing
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
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

  //get profile by id
  getProfileById(id: string | null) {
    // console.log('UserID: ', id);
    return this.afs
      .collection('/userProfiles', (ref) => ref.where('id', '==', id))
      .valueChanges()
      .pipe(
        map((profile) => profile[0]) // Retrieve the first matching product
      );
  }

  // get all profile
  getAllProfiles() {
    return this.afs.collection('/userProfiles').snapshotChanges();
  }

  //  update profile
  updateProfile(profile: UserProfile): Promise<void> {
    const profileRef = this.afs.collection('/userProfiles').doc(profile.id);

    // console.log('profile ref: ', profile.id);

    // profileRef
    //   .update(profile)
    //   .then(() => {
    //     console.log('Profile updated successfully');
    //   })
    //   .catch((error) => {
    //     console.error('Error updating profile:', error);
    //   });

    return profileRef.update(profile);
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
}
