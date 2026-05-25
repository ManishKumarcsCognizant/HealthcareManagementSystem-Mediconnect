import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new User();
  doctor = new Doctor();
  msg = "";
  adminEmail = "";
  adminPassword = "";
  activeTab: 'user' | 'doctor' | 'admin' = 'user';

  constructor(private _service: LoginService, private _router: Router) { }

  ngOnInit(): void {
    if (this._service.isLoggedIn()) {
      const role = this._service.userType();
      if (role === 'admin') this._router.navigate(['/admindashboard']);
      else if (role === 'doctor') this._router.navigate(['/doctordashboard']);
      else this._router.navigate(['/userdashboard']);
    }
  }

  switchTab(tab: 'user' | 'doctor' | 'admin') {
    this.activeTab = tab;
    this.msg = '';
  }

  loginUser()
  {
      this._service.loginUserFromRemote(this.user).subscribe(
        (data: any) => {
          console.log(data);
          // Store the JWT token returned by the unified AuthResponse
          if (data && data.token) {
            localStorage.setItem('TOKEN', `Bearer ${data.token}`);
          }
          localStorage.setItem('loggedUser', this.user.email);
          localStorage.setItem('USER', this.user.email);
          localStorage.setItem('ROLE', 'user');
          localStorage.setItem('name', data.name || data.username || this.user.email);
          localStorage.setItem('gender', data.gender || '');
          localStorage.setItem('age', data.age || '');
          this._router.navigate(['/userdashboard']);
        },
        (error: { error: any; }) => {
          console.log(error.error);
          this.msg="Bad credentials, please enter valid credentials !!!";
        }
      )
  }

  loginDoctor()
  {
      this._service.loginDoctorFromRemote(this.doctor).subscribe(
        (data: any) => {
          console.log(data);
          // Store the JWT token returned by the unified AuthResponse
          if (data && data.token) {
            localStorage.setItem('TOKEN', `Bearer ${data.token}`);
          }
          localStorage.clear();
          if (data && data.token) {
            localStorage.setItem('TOKEN', `Bearer ${data.token}`);
          }
          localStorage.setItem('loggedUser', this.doctor.email);
          localStorage.setItem('USER', this.doctor.email);
          localStorage.setItem('ROLE', 'doctor');
          localStorage.setItem('doctorname', data.name || data.doctorname || this.doctor.email);
          localStorage.setItem('name', data.name || data.doctorname || this.doctor.email);
          localStorage.setItem('gender', data.gender || '');
          this._router.navigate(['/doctordashboard']);
        },
        (error: { error: any; }) => {
          console.log(error.error);
          this.msg="Bad credentials, please enter valid credentials !!!";
        }
      )
  }

  adminLogin()
  {
    this._service.adminLoginFromRemote(this.adminEmail, this.adminPassword).subscribe(
      (data: any) => {
        localStorage.setItem('loggedUser', this.adminEmail);
        localStorage.setItem('gender', 'male');
        this._router.navigate(['/admindashboard']);
      },
      (error: any) => {
        console.log(error);
        this.msg = 'Bad admin credentials!!!';
      }
    );
  }

}
