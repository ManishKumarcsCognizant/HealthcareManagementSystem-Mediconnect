import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Appointment } from 'src/app/models/appointment';
import { Prescription } from 'src/app/models/prescription';
import { DoctorService } from 'src/app/services/doctor.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-addprescription',
  templateUrl: './addprescription.component.html',
  styleUrls: ['./addprescription.component.css']
})
export class AddprescriptionComponent implements OnInit
{
  currRole = '';
  loggedUser = '';
  message = '';
  isSubmitted = false;
  isError = false;
  submittedFor = '';
  prescriptionobj = new Prescription();
  appointment : Observable<Appointment[]> | undefined;

  constructor(private _service : DoctorService, private _router: Router, private userService : UserService) { }

  ngOnInit(): void
  {
    this.loggedUser = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');
    this.currRole = (sessionStorage.getItem('ROLE') || '').replace(/"/g, '');

    this.appointment = this._service.getPatientListByDoctorEmail(this.loggedUser);

    // Prefill doctor name from profile
    this._service.getProfileDetails(this.loggedUser).subscribe((data: any[]) => {
      if (data && data.length > 0) {
        this.prescriptionobj.doctorname = data[0].doctorname || '';
      }
    });
  }

  addPrescription()
  {
    this._service.addPrescriptions(this.prescriptionobj).subscribe(
      data => {
        this.submittedFor = this.prescriptionobj.patientname;
        this.isSubmitted = true;
        this.isError = false;
        this.message = 'Prescription added successfully for ' + this.submittedFor;
        setTimeout(() => { this._router.navigate(['/doctordashboard']); }, 6000);
      },
      error => {
        this.isError = true;
        this.isSubmitted = true;
        this.message = 'Failed to add prescription. Please try again.';
        console.log(error.error);
      }
    );
  }

  addAnother() {
    this.isSubmitted = false;
    this.isError = false;
    this.message = '';
    this.prescriptionobj = new Prescription();
    this._service.getProfileDetails(this.loggedUser).subscribe((data: any[]) => {
      if (data && data.length > 0) this.prescriptionobj.doctorname = data[0].doctorname || '';
    });
  }
}
