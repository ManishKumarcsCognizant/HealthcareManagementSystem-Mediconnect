import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Doctor } from '../models/doctor';
import { Prescription } from '../models/prescription';
import { Slots } from '../models/slots';
import { User } from '../models/user';
import { Appointment } from '../models/appointment';

// This pulls the base URL (e.g., http://localhost:8081) from your environment file
const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  user = new User();
  doctor = new Doctor();

  constructor(private _http: HttpClient) { }

  /**
   * DOCTOR PROFILE & REGISTRATION METHODS
   */

  // Fetches a doctor's full profile object from the database using their email
  getDoctorByEmail(email: string): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/doctorlistbyemail/${email}`);
  }

  addDoctorFromRemote(doctor: Doctor): Observable<any> {
    return this._http.post<any>(`${NAV_URL}/addDoctor`, doctor);
  }

  getDoctorList(): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/doctorlist`);
  }

  getDoctorListByEmail(loggedUser: string): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/doctorlistbyemail/` + loggedUser);
  }

  public getProfileDetails(loggedUser: string): Observable<any> {
    return this._http.get(`${NAV_URL}/doctorProfileDetails/` + loggedUser);
  }

  public UpdateDoctorProfile(user: any): Observable<any> {
    return this._http.put<any>(`${NAV_URL}/updatedoctor`, user);
  }

  acceptDoctorApproval(email: string): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/acceptstatus/${email}`);
  }

  rejectDoctorApproval(email: string): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/rejectstatus/${email}`);
  }

  /**
   * SLOT & SCHEDULING METHODS
   */

  // Submits the new/updated slot object. 
  // responseType is set to 'text' because the backend returns a plain String.
  public addBookingSlots(slot: Slots): Observable<any> {
    return this._http.post<any>(`${NAV_URL}/addBookingSlots`, slot, { responseType: 'text' as 'json' });
  }

  getSlotDetails(loggedUser: string): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/slotDetails/` + loggedUser);
  }

  getSlotList(): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/slotDetails`);
  }

  getSlotListWithUniqueDoctors(): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/slotDetailsWithUniqueDoctors`);
  }

  getSlotListWithUniqueSpecializations(): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/slotDetailsWithUniqueSpecializations`);
  }

  /**
   * PATIENT & APPOINTMENT MANAGEMENT
   */

  getPatientList(): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/patientlist`);
  }

  getPatientListByEmail(email: string): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/patientlistbyemail/` + email);
  }

  getPatientListByDoctorEmail(email: string): Observable<Appointment[]> {
    return this._http.get<Appointment[]>(`${NAV_URL}/patientlistbydoctoremail/${email}`);
  }

  getPatientListByDoctorEmailAndDate(loggedUser: string): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/patientlistbydoctoremailanddate/` + loggedUser);
  }

  /**
   * APPROVAL & STATUS UPDATES
   */

  public acceptRequestForDoctorApproval(email: string): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/acceptstatus/` + email);
  }

  public rejectRequestForDoctorApproval(email: string): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/rejectstatus/` + email);
  }

public acceptRequestForPatientApproval(id: number): Observable<any> {
  return this._http.put<any>(`${NAV_URL}/updateAppointmentStatus/${id}/accept`, {}, { responseType: 'text' as 'json' });
}

public rejectRequestForPatientApproval(id: number): Observable<any> {
  return this._http.put<any>(`${NAV_URL}/updateAppointmentStatus/${id}/reject`, {}, { responseType: 'text' as 'json' });
}

public updateAppointmentStatus(id: number, status: string): Observable<any> {
  return this._http.put<any>(`${NAV_URL}/updateAppointmentStatus/${id}/${status}`, {}, { responseType: 'text' as 'json' });
}

  /**
   * PRESCRIPTION METHODS
   */

  public addPrescriptions(prescription: Prescription): Observable<any> {
    return this._http.post<any>(`${NAV_URL}/addPrescription`, prescription);
  }

}