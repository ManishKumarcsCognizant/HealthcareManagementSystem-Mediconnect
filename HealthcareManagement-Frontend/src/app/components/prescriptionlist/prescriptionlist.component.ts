import { Component, OnInit } from '@angular/core';
import { Prescription } from 'src/app/models/prescription';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-prescriptionlist',
  templateUrl: './prescriptionlist.component.html',
  styleUrls: ['./prescriptionlist.component.css']
})
export class PrescriptionlistComponent implements OnInit {

  prescriptionlist: Prescription[] = [];
  loggedUser = '';
  patientName = '';
  loading = true;

  constructor(private _service : UserService) { }

  ngOnInit(): void {
    this.loggedUser = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');

    // First try to get the patientname from the user's own appointments
    // (prescriptions are saved using appointment.patientname, not registration username)
    this._service.getPatientListByEmail(this.loggedUser).subscribe((appointments: any[]) => {
      if (appointments && appointments.length > 0) {
        // Use the patientname from the most recent appointment
        const nameFromAppointment = appointments[0].patientname || '';
        this._service.getPrescriptionsByName(nameFromAppointment).subscribe((rx: Prescription[]) => {
          this.prescriptionlist = rx;
          this.loading = false;
        }, () => { this.loading = false; });
      } else {
        // Fallback: try registration username
        this._service.getProfileDetails(this.loggedUser).subscribe((data: any[]) => {
          if (data && data.length > 0) {
            this.patientName = data[0].username || '';
            this._service.getPrescriptionsByName(this.patientName).subscribe((rx: Prescription[]) => {
              this.prescriptionlist = rx;
              this.loading = false;
            }, () => { this.loading = false; });
          } else {
            this.loading = false;
          }
        }, () => { this.loading = false; });
      }
    }, () => {
      // If appointments endpoint fails, fall back to profile username
      this._service.getProfileDetails(this.loggedUser).subscribe((data: any[]) => {
        if (data && data.length > 0) {
          this.patientName = data[0].username || '';
          this._service.getPrescriptionsByName(this.patientName).subscribe((rx: Prescription[]) => {
            this.prescriptionlist = rx;
            this.loading = false;
          }, () => { this.loading = false; });
        } else {
          this.loading = false;
        }
      }, () => { this.loading = false; });
    });
  }

  onPrint() {
    window.print();
  }
}
