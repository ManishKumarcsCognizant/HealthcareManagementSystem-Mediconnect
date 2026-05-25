import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Doctor } from '../models/doctor';
import { User } from '../models/user';
import { map } from "rxjs/operators";

const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user = new User();
  doctor = new Doctor();

  constructor(private _http : HttpClient) { }

  public loginUserFromRemote(user : User)
  {
    return this._http.post<any>(`${NAV_URL}/loginuser`, user).pipe(
      map(data => {
        localStorage.setItem('USER', user.email);
        localStorage.setItem('ROLE', 'user');
        if (data && data.token) {
          localStorage.setItem('TOKEN', `Bearer ${data.token}`);
        } else {
          localStorage.removeItem('TOKEN');
        }
        return data;
      })
    );
  }

  public loginDoctorFromRemote(doctor : Doctor)
  {
    return this._http.post<any>(`${NAV_URL}/logindoctor`, doctor).pipe(
      map(data => {
        localStorage.setItem('USER', doctor.email);
        localStorage.setItem('ROLE', 'doctor');
        if (data && data.token) {
          localStorage.setItem('TOKEN', `Bearer ${data.token}`);
        } else {
          localStorage.removeItem('TOKEN');
        }
        return data;
      })
    );
  }

  /** True when USER and ROLE are both set */
  isLoggedIn(): boolean {
    const user = localStorage.getItem('USER');
    const role = localStorage.getItem('ROLE');
    return !!user && user.length > 0 && !!role && role.length > 0;
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn() && (localStorage.getItem('ROLE') || '').toLowerCase() === 'user';
  }

  isDoctorLoggedIn(): boolean {
    return this.isLoggedIn() && (localStorage.getItem('ROLE') || '').toLowerCase() === 'doctor';
  }

  isAdminLoggedIn(): boolean {
    return this.isLoggedIn() && (localStorage.getItem('ROLE') || '').toLowerCase() === 'admin';
  }

  getAuthenticatedToken() {
    return localStorage.getItem('TOKEN');
  }

  getAuthenticatedUser() {
    return localStorage.getItem('USER');
  }

  userType() {
    return (localStorage.getItem('ROLE') || '').toLowerCase();
  }

  public adminLoginFromRemote(email: string, password: string): Observable<any> {
    return this._http.post<any>(`${NAV_URL}/loginadmin`, { email, password }).pipe(
      map(data => {
        localStorage.setItem('USER', email);
        localStorage.setItem('ROLE', 'admin');
        if (data && data.token) {
          localStorage.setItem('TOKEN', `Bearer ${data.token}`);
          localStorage.setItem('name', data.name || 'Admin');
        } else {
          localStorage.removeItem('TOKEN');
        }
        return data;
      })
    );
  }

}
