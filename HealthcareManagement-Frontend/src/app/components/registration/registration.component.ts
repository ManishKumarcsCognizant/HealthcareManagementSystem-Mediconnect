import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor';
import { User } from 'src/app/models/user';
import { DoctorService } from 'src/app/services/doctor.service';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  user = new User();
  doctor = new Doctor();
  msg = ' ';
  confirmPassword = '';
  confirmDoctorPassword = '';
  confirmPasswordBlurred = false;
  confirmDoctorPasswordBlurred = false;
  activeTab: 'user' | 'doctor' = 'user';

  constructor(private _registrationService : RegistrationService, private _doctorService : DoctorService, private _router : Router) { }

  ngOnInit(): void {}

  switchTab(tab: 'user' | 'doctor') {
    this.activeTab = tab;
    this.msg = ' ';
    this.confirmPasswordBlurred = false;
    this.confirmDoctorPasswordBlurred = false;
  }

  registerUser()
  {
    if (this.user.password !== this.confirmPassword) {
      this.msg = 'Passwords do not match. Please re-enter.';
      return;
    }
    this._registrationService.registerUserFromRemote(this.user).subscribe(
      data => {
        console.log("Registration Success");
        sessionStorage.setItem("username",this.user.username);
        sessionStorage.setItem("gender",this.user.gender);
        this._router.navigate(['/registrationsuccess']);
      },
    error => {
      console.log("Registration Failed", error);
      if (error.status === 0) {
        this.msg = "Cannot connect to server. Check CORS/Security settings.";
      } else if (error.status === 403) {
        this.msg = "Registration blocked by security/CORS. Server returned 403.";
      } else if (error.error) {
        this.msg = error.error;
      } else {
        this.msg = "User with " + this.user.email + " already exists !!!";
      }
    }
    )
  }

  registerDoctor()
  {
    if (this.doctor.password !== this.confirmDoctorPassword) {
      this.msg = 'Passwords do not match. Please re-enter.';
      return;
    }
    this._registrationService.registerDoctorFromRemote(this.doctor).subscribe(
      data => {
        console.log("Registration Success");
        sessionStorage.setItem("doctorname",this.doctor.doctorname);
        sessionStorage.setItem("gender",this.doctor.gender);
        this._router.navigate(['/registrationsuccess']);
      },
      error => {
        console.log("Registration Failed", error);
        if (error.status === 0) {
          this.msg = "Cannot connect to server. Please ensure the backend is running.";
        } else if (error.error && typeof error.error === 'string') {
          this.msg = error.error;
        } else {
          this.msg = "Doctor with " + this.doctor.email + " already exists !!!";
        }
      }
    )
  }

}
