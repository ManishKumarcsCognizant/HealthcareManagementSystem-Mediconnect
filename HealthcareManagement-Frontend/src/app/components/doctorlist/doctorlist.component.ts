import { Component, OnInit } from '@angular/core';
import { Doctor } from 'src/app/models/doctor';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-doctorlist',
  templateUrl: './doctorlist.component.html',
  styleUrls: ['./doctorlist.component.css']
})
export class DoctorlistComponent implements OnInit {

  allDoctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  searchQuery: string = '';

  constructor(private _service: DoctorService) { }

  ngOnInit(): void {
    this._service.getDoctorList().subscribe((data: Doctor[]) => {
      this.allDoctors = data;
      this.filteredDoctors = data;
    });
  }

  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.filteredDoctors = this.allDoctors;
    } else {
      this.filteredDoctors = this.allDoctors.filter(d =>
        d.doctorname.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q)
      );
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredDoctors = this.allDoctors;
  }

}
