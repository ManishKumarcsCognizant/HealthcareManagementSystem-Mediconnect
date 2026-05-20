import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from 'src/app/models/appointment';
import { Doctor } from 'src/app/models/doctor';
import { Slots } from 'src/app/models/slots';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-patientlist',
  templateUrl: './patientlist.component.html',
  styleUrls: ['./patientlist.component.css']
})
export class PatientlistComponent implements OnInit {

  currRole = '';
  loggedUser = '';
  patients : Observable<Appointment[]> | undefined;
  slots : Observable<Slots[]> | undefined;
  responses : Observable<any> | undefined;
  http: any;

  constructor(private _service : DoctorService) { }

  // ngOnInit(): void
  // {
  //   this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser')|| '{}');
  //   this.loggedUser = this.loggedUser.replace(/"/g, '');

  //   this.currRole = JSON.stringify(sessionStorage.getItem('ROLE')|| '{}'); 
  //   this.currRole = this.currRole.replace(/"/g, '');

  //   if(this.currRole === "user")
  //   {
  //     this.patients = this._service.getPatientListByDoctorEmail(this.loggedUser);
  //   }
  //   else
  //   {
  //     this.patients = this._service.getPatientList();
  //   }
  //   this.slots = this._service.getSlotDetails(this.loggedUser);
  // }
ngOnInit(): void {
  // Clean up session retrieval
  this.loggedUser = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');
  this.currRole = (sessionStorage.getItem('ROLE') || '').replace(/"/g, '');

  // FIX: Change "user" to "doctor" (or "DOCTOR" based on your storage)
  console.log("Current Role from session:", this.currRole); // Debugging line
  if (this.currRole.toLowerCase() === 'doctor') {
    // This calls your filtered API
    this.patients = this._service.getPatientListByDoctorEmail(this.loggedUser);
  } else {
    // This likely shows everything (for Admins)
    this.patients = this._service.getPatientList();
  }

  this.slots = this._service.getSlotDetails(this.loggedUser);
}
  // acceptRequest(slot : string)
  // {
  //   this.responses = this._service.acceptRequestForPatientApproval(slot);
  //   $("#acceptbtn").hide();
  //   $("#rejectbtn").hide();
  //   $("#acceptedbtn").show();
  //   $("#rejectedbtn").hide();
  // }
acceptRequest(patient: any) {
  this._service.acceptRequestForPatientApproval(patient)
    .subscribe(() => {
      patient.appointmentstatus = 'accept';
    });
}

rejectRequest(patient: any) {
  this._service.rejectRequestForPatientApproval(patient)
    .subscribe(() => {
      patient.appointmentstatus = 'reject';
    });
}


}
