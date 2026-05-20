import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-doctorprofile',
  templateUrl: './doctorprofile.component.html',
  styleUrls: ['./doctorprofile.component.css']
})
export class DoctorprofileComponent implements OnInit {

  currentDoctor: Doctor = new Doctor();
  doctor: Doctor = new Doctor();
  msg = ' ';
  currRole = '';
  loggedUser = '';
  temp = false;
  isEditing = false;

  constructor(private _service: DoctorService, private activatedRoute: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {
    this.loggedUser = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');
    this.currRole = (sessionStorage.getItem('ROLE') || '').replace(/"/g, '');
    this.getProfileDetails(this.loggedUser);
  }

  editProfile() {
    this.doctor = { ...this.currentDoctor };
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  getProfileDetails(loggedUser: string) {
    this._service.getProfileDetails(loggedUser).subscribe((data: Doctor[]) => {
      if (data && data.length > 0) {
        this.currentDoctor = data[0];
        this.doctor = { ...data[0] };
      }
    });
  }

  updateDoctorProfile() {
    this._service.UpdateDoctorProfile(this.doctor).subscribe(
      data => {
        this.temp = true;
        this.currentDoctor = { ...this.doctor };
        this.isEditing = false;
        setTimeout(() => { this.temp = false; }, 4000);
      },
      error => {
        console.log('Profile update failed', error);
      }
    );
  }

}
