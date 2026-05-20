import { Component, OnInit } from '@angular/core';
import { Doctor } from 'src/app/models/doctor';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-approvedoctors',
  templateUrl: './approvedoctors.component.html',
  styleUrls: ['./approvedoctors.component.css']
})
export class ApprovedoctorsComponent implements OnInit {

  currRole = '';
  loggedUser = '';
  doctors: Doctor[] = [];
  actionInProgress: { [email: string]: boolean } = {};

  constructor(private _service: DoctorService) { }

  ngOnInit(): void {
    this.loggedUser = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');
    this.currRole = (sessionStorage.getItem('ROLE') || '').replace(/"/g, '');
    this.loadDoctors();
  }

  loadDoctors(): void {
    this._service.getDoctorList().subscribe((data: Doctor[]) => {
      this.doctors = data;
    });
  }

  acceptRequest(curremail: string): void {
    this.actionInProgress[curremail] = true;
    this._service.acceptDoctorApproval(curremail).subscribe({
      next: () => {
        const doc = this.doctors.find(d => d.email === curremail);
        if (doc) doc.status = 'accept';
        this.actionInProgress[curremail] = false;
      },
      error: () => { this.actionInProgress[curremail] = false; }
    });
  }

  rejectRequest(curremail: string): void {
    this.actionInProgress[curremail] = true;
    this._service.rejectDoctorApproval(curremail).subscribe({
      next: () => {
        const doc = this.doctors.find(d => d.email === curremail);
        if (doc) doc.status = 'reject';
        this.actionInProgress[curremail] = false;
      },
      error: () => { this.actionInProgress[curremail] = false; }
    });
  }
}
