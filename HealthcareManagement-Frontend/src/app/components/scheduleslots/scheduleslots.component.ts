import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Slots } from 'src/app/models/slots';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-scheduleslots',
  templateUrl: './scheduleslots.component.html',
  styleUrls: ['./scheduleslots.component.css']
})
export class ScheduleslotsComponent implements OnInit {

  loggedUser = '';
  doctorName = '';
  specialization = '';
  
  slot = new Slots();
  slots: Observable<Slots[]> | undefined;
  
  amAvailable: boolean = false;
  noonAvailable: boolean = false;
  pmAvailable: boolean = false;
  isAdding: boolean = false;

  constructor(private _service: DoctorService, private _router: Router) { }

  ngOnInit(): void {
    // 1. Get Logged In Email from session
    this.loggedUser = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');

    if (this.loggedUser) {
      // 2. Fetch actual details from DB based on email
      this._service.getDoctorByEmail(this.loggedUser).subscribe(
        (data: any[]) => {
          const doctor = Array.isArray(data) ? data[0] : data;
          if (!doctor) {
            console.error('No doctor found for email:', this.loggedUser);
            return;
          }
          this.doctorName = doctor.doctorname;
          this.specialization = doctor.specialization;
          console.log('Doctor loaded:', this.doctorName, this.specialization);
        },
        error => {
          console.error('Could not fetch doctor details from DB', error);
        }
      );

      // 4. Load the table
      this.slots = this._service.getSlotDetails(this.loggedUser);
    }
  }

  showForm() {
    this.isAdding = true;
  }

  addSlot() {
    // Always re-stamp doctor info at submission time (guards against async race on init)
    this.slot.email = this.loggedUser;
    this.slot.doctorname = this.doctorName;
    this.slot.specialization = this.specialization;

    // Convert Toggles to Slot Timings
    this.slot.amslot = this.amAvailable ? '9:00 AM - 12:00 PM' : 'empty';
    this.slot.noonslot = this.noonAvailable ? '1:00 PM - 4:00 PM' : 'empty';
    this.slot.pmslot = this.pmAvailable ? '5:00 PM - 8:00 PM' : 'empty';

    // MUST be 'unbooked' — backend and bookappointment both check for 'unbooked'
    this.slot.amstatus = this.amAvailable ? 'unbooked' : 'empty';
    this.slot.noonstatus = this.noonAvailable ? 'unbooked' : 'empty';
    this.slot.pmstatus = this.pmAvailable ? 'unbooked' : 'empty';

    this.slot.patienttype = 'Both IN & OUT';

    this._service.addBookingSlots(this.slot).subscribe(
      data => {
        // Reset form state
        this.isAdding = false;
        this.amAvailable = false;
        this.noonAvailable = false;
        this.pmAvailable = false;
        this.slot.date = '';
        // Reload the slots list to show the new entry
        this.slots = this._service.getSlotDetails(this.loggedUser);
      },
      error => {
        // Backend returns plain text "modified successfully" which Angular treats as error
        // Still treat as success and reload
        this.isAdding = false;
        this.amAvailable = false;
        this.noonAvailable = false;
        this.pmAvailable = false;
        this.slot.date = '';
        this.slots = this._service.getSlotDetails(this.loggedUser);
      }
    );
  }
}