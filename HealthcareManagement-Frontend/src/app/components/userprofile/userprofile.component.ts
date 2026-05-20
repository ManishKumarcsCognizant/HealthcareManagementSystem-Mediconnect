import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  currentUser: User = new User();
  user: User = new User();
  msg = ' ';
  currRole = '';
  loggedUser = '';
  temp = false;
  isEditing = false;

  constructor(private _service: UserService, private activatedRoute: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {
    this.loggedUser = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');
    this.currRole = (sessionStorage.getItem('ROLE') || '').replace(/"/g, '');
    this.getProfileDetails(this.loggedUser);
  }

  editProfile() {
    this.user = { ...this.currentUser };
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  getProfileDetails(loggedUser: string) {
    this._service.getProfileDetails(loggedUser).subscribe((data: User[]) => {
      if (data && data.length > 0) {
        this.currentUser = data[0];
        this.user = { ...data[0] };
      }
    });
  }

  updateUserProfile() {
    this._service.UpdateUserProfile(this.user).subscribe(
      data => {
        this.temp = true;
        this.currentUser = { ...this.user };
        this.isEditing = false;
        setTimeout(() => { this.temp = false; }, 4000);
      },
      error => {
        console.log('Profile update failed', error);
      }
    );
  }

}
