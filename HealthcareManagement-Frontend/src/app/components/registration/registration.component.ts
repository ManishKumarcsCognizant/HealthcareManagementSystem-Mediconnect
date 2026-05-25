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

  // Show/hide toggles
  showUserPassword = false;
  showUserConfirm = false;
  showDoctorPassword = false;
  showDoctorConfirm = false;

  // Password touched trackers
  userPasswordTouched = false;
  doctorPasswordTouched = false;

  constructor(private _registrationService: RegistrationService, private _doctorService: DoctorService, private _router: Router) { }

  ngOnInit(): void {}

  switchTab(tab: 'user' | 'doctor') {
    this.activeTab = tab;
    this.msg = ' ';
    this.confirmPasswordBlurred = false;
    this.confirmDoctorPasswordBlurred = false;
  }

  // ── Password Rules ────────────────────────────────────────────
  hasMinLength(pw: string)   { return pw?.length >= 8; }
  hasUppercase(pw: string)   { return /[A-Z]/.test(pw); }
  hasLowercase(pw: string)   { return /[a-z]/.test(pw); }
  hasNumber(pw: string)      { return /[0-9]/.test(pw); }
  hasSpecial(pw: string)     { return /[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/.test(pw); }

  isPasswordValid(pw: string): boolean {
    return this.hasMinLength(pw) && this.hasUppercase(pw) && this.hasLowercase(pw) && this.hasNumber(pw) && this.hasSpecial(pw);
  }

  passwordStrength(pw: string): number {
    if (!pw) return 0;
    let score = 0;
    if (this.hasMinLength(pw))  score++;
    if (this.hasUppercase(pw))  score++;
    if (this.hasLowercase(pw))  score++;
    if (this.hasNumber(pw))     score++;
    if (this.hasSpecial(pw))    score++;
    return score; // 0–5
  }

  strengthLabel(pw: string): string {
    const s = this.passwordStrength(pw);
    if (s <= 1) return 'Very Weak';
    if (s === 2) return 'Weak';
    if (s === 3) return 'Fair';
    if (s === 4) return 'Good';
    return 'Strong';
  }

  strengthClass(pw: string): string {
    const s = this.passwordStrength(pw);
    if (s <= 1) return 'strength-very-weak';
    if (s === 2) return 'strength-weak';
    if (s === 3) return 'strength-fair';
    if (s === 4) return 'strength-good';
    return 'strength-strong';
  }

  registerUser() {
    if (!this.isPasswordValid(this.user.password)) {
      this.msg = 'Password does not meet the requirements.';
      return;
    }
    if (this.user.password !== this.confirmPassword) {
      this.msg = 'Passwords do not match. Please re-enter.';
      return;
    }
    this._registrationService.registerUserFromRemote(this.user).subscribe(
      (data: any) => {
        if (data && data.token) {
          localStorage.setItem('TOKEN', `Bearer ${data.token}`);
        }
        localStorage.setItem('loggedUser', data.email || this.user.email);
        localStorage.setItem('USER',       data.email || this.user.email);
        localStorage.setItem('ROLE',       'user');
        localStorage.setItem('name',       data.name  || this.user.username);
        localStorage.setItem('gender',     data.gender || this.user.gender);
        localStorage.setItem('age',        data.age   || this.user.age);
        this._router.navigate(['/userdashboard']);
      },
      error => {
        if (error.status === 0) {
          this.msg = 'Cannot connect to server.';
        } else if (error.error) {
          this.msg = error.error;
        } else {
          this.msg = 'User with ' + this.user.email + ' already exists!!!';
        }
      }
    );
  }

  registerDoctor() {
    if (!this.isPasswordValid(this.doctor.password)) {
      this.msg = 'Password does not meet the requirements.';
      return;
    }
    if (this.doctor.password !== this.confirmDoctorPassword) {
      this.msg = 'Passwords do not match. Please re-enter.';
      return;
    }
    this._registrationService.registerDoctorFromRemote(this.doctor).subscribe(
      (data: any) => {
        if (data && data.token) {
          localStorage.setItem('TOKEN', `Bearer ${data.token}`);
        }
        localStorage.setItem('loggedUser',  data.email   || this.doctor.email);
        localStorage.setItem('USER',        data.email   || this.doctor.email);
        localStorage.setItem('ROLE',        'doctor');
        localStorage.setItem('doctorname',  data.name    || this.doctor.doctorname);
        localStorage.setItem('name',        data.name    || this.doctor.doctorname);
        localStorage.setItem('gender',      data.gender  || this.doctor.gender);
        this._router.navigate(['/doctordashboard']);
      },
      error => {
        if (error.status === 0) {
          this.msg = 'Cannot connect to server.';
        } else if (error.error && typeof error.error === 'string') {
          this.msg = error.error;
        } else {
          this.msg = 'Doctor with ' + this.doctor.email + ' already exists!!!';
        }
      }
    );
  }

}
