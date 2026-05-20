import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from 'src/app/models/appointment';
import { Doctor } from 'src/app/models/doctor';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-approvalstatus',
  templateUrl: './approvalstatus.component.html',
  styleUrls: ['./approvalstatus.component.css']
})
export class ApprovalstatusComponent implements OnInit {

  currRole = '';
  loggedUser = '';
  approval : Observable<Doctor[]> | undefined;
  appointment : Observable<Appointment[]> | undefined;

  constructor(private _service : DoctorService) { }

  ngOnInit(): void {
    this.loggedUser = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');
    this.currRole = (sessionStorage.getItem('ROLE') || '').replace(/"/g, '').toLowerCase();

    if (this.currRole === 'doctor') {
      this.approval = this._service.getDoctorListByEmail(this.loggedUser);
    } else if (this.currRole === 'user') {
      this.appointment = this._service.getPatientListByEmail(this.loggedUser);
    }
  }
}
