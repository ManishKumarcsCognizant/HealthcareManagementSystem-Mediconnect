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
    this.loggedUser = (localStorage.getItem('loggedUser') || '').replace(/"/g, '');
    this.currRole = (localStorage.getItem('ROLE') || '').replace(/"/g, '');
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
    const doc = this.doctors.find(d => d.email === curremail);
    // If the doctor is already accepted, ask for confirmation before rejecting
    if (doc && doc.status === 'accept') {
      const confirmed = window.confirm(`Doctor ${doc.doctorname} is already accepted.\nAre you sure you want to reject this doctor? This will revoke their access.`);
      if (!confirmed) {
        return;
      }
    }

    this.actionInProgress[curremail] = true;
    this._service.rejectDoctorApproval(curremail).subscribe({
      next: () => {
        const d = this.doctors.find(x => x.email === curremail);
        if (d) d.status = 'reject';
        this.actionInProgress[curremail] = false;
      },
      error: () => { this.actionInProgress[curremail] = false; }
    });
  }
}
