import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { UserProfile } from 'src/app/models/user-profiles';
import { AuthService } from 'src/app/shared/auth.service';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  Profile: any = {};

  profileList: UserProfile[] = [];
  id: string | null = '';

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.auth.getAllProfiles().subscribe((prof) => {
      this.profileList = prof.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        console.log(this.profileList);

        return { id, ...data } as UserProfile;
      });
      console.log('The userID: ', localStorage.getItem('userId'));
      const userId = localStorage.getItem('userId');
      console.log('Data & ', this.profileList, 'Profile list');
      this.Profile = this.profileList.find(
        (userProfile) => userProfile.id === userId
      );

      if (this.Profile) {
        // The userProfile with matching user ID is found
        console.log('Found profile:', this.Profile);
      } else {
        // No matching userProfile is found
        console.log('Profile not found.');
      }
    });
  }
}
