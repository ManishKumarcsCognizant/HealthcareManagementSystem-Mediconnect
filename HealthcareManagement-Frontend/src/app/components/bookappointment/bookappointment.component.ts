import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Appointment } from 'src/app/models/appointment';
import { DoctorService } from 'src/app/services/doctor.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-bookappointment',
  templateUrl: './bookappointment.component.html',
  styleUrls: ['./bookappointment.component.css']
})
export class BookappointmentComponent implements OnInit {

  loggedUser = '';
  message = '';
  appointment = new Appointment();

  allDoctors: any[] = [];
  allSlots: any[] = [];

  uniqueSpecializations: string[] = [];
  filteredDoctors: any[] = [];
  availableDates: string[] = [];
  availableSlots: string[] = [];

  noSlotsForDoctor = false;
  loadingSlots = false;

  constructor(private _service: DoctorService, private _router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.loggedUser = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');

    // Load accepted doctors — handle both 'accept' (from approval flow) and 'Approved' (seeded data)
    this._service.getDoctorList().subscribe((data: any[]) => {
      this.allDoctors = data.filter(d => {
        const s = (d.status || '').toLowerCase().trim();
        return s === 'accept' || s === 'approved';
      });
      this.uniqueSpecializations = [...new Set(this.allDoctors.map(d => d.specialization))];
    });

    // Load all slots upfront
    this._service.getSlotList().subscribe((data: any[]) => {
      this.allSlots = data;
    });
  }

  onSpecializationChange(): void {
    this.filteredDoctors = this.allDoctors.filter(
      d => d.specialization === this.appointment.specialization
    );
    // Reset downstream
    this.appointment.doctorname = '';
    this.appointment.date = '';
    this.appointment.slot = '';
    this.availableDates = [];
    this.availableSlots = [];
    this.noSlotsForDoctor = false;
  }

  onDoctorChange(): void {
    this.appointment.date = '';
    this.appointment.slot = '';
    this.availableSlots = [];
    this.noSlotsForDoctor = false;

    const doctorSlots = this.allSlots.filter(
      s => s.doctorname === this.appointment.doctorname
    );

    // Only include dates where at least one slot is available (unbooked/Available + not empty)
    this.availableDates = doctorSlots
      .filter(s =>
        (this.isSlotAvailable(s.amstatus) && s.amslot !== 'empty') ||
        (this.isSlotAvailable(s.noonstatus) && s.noonslot !== 'empty') ||
        (this.isSlotAvailable(s.pmstatus) && s.pmslot !== 'empty')
      )
      .map(s => s.date);

    this.noSlotsForDoctor = this.availableDates.length === 0;
  }

  onDateChange(): void {
    this.appointment.slot = '';
    this.availableSlots = [];

    const slotEntry = this.allSlots.find(
      s => s.doctorname === this.appointment.doctorname && s.date === this.appointment.date
    );

    if (!slotEntry) return;

    if (this.isSlotAvailable(slotEntry.amstatus) && slotEntry.amslot !== 'empty') {
      this.availableSlots.push('AM slot');
    }
    if (this.isSlotAvailable(slotEntry.noonstatus) && slotEntry.noonslot !== 'empty') {
      this.availableSlots.push('Noon slot');
    }
    if (this.isSlotAvailable(slotEntry.pmstatus) && slotEntry.pmslot !== 'empty') {
      this.availableSlots.push('PM slot');
    }
  }

  // Handles 'unbooked', 'Available', 'available' — all mean the slot is free
  isSlotAvailable(status: string): boolean {
    const s = (status || '').toLowerCase().trim();
    return s === 'unbooked' || s === 'available';
  }

  bookAppointment(): void {
    this.message = '';
    this.userService.addBookingAppointments(this.appointment).subscribe(
      () => this._router.navigate(['/userdashboard']),
      error => {
        if (error.error && typeof error.error === 'string') {
          this.message = error.error;
        } else {
          this.message = 'Booking failed. Please try again.';
        }
      }
    );
  }
}

