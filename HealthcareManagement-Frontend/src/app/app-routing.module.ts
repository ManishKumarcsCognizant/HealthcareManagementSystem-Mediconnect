import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddingdoctorComponent } from './components/addingdoctor/addingdoctor.component';
import { AddprescriptionComponent } from './components/addprescription/addprescription.component';
import { AdmindashboardComponent } from './components/admindashboard/admindashboard.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { ApprovalstatusComponent } from './components/approvalstatus/approvalstatus.component';
import { ApprovedoctorsComponent } from './components/approvedoctors/approvedoctors.component';
import { BookappointmentComponent } from './components/bookappointment/bookappointment.component';
import { CheckslotsComponent } from './components/checkslots/checkslots.component';
import { DoctordashboardComponent } from './components/doctordashboard/doctordashboard.component';
import { DoctorlistComponent } from './components/doctorlist/doctorlist.component';
import { DoctorprofileComponent } from './components/doctorprofile/doctorprofile.component';
import { LoginComponent } from './components/login/login.component';
import { PatientlistComponent } from './components/patientlist/patientlist.component';
import { PrescriptionlistComponent } from './components/prescriptionlist/prescriptionlist.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RegistrationsuccessComponent } from './components/registrationsuccess/registrationsuccess.component';
import { ScheduleslotsComponent } from './components/scheduleslots/scheduleslots.component';
import { UserdashboardComponent } from './components/userdashboard/userdashboard.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { WelcomepageComponent } from './components/welcomepage/welcomepage.component';
import { AdminGuard } from './guards/admin.guard';
import { DoctorGuard } from './guards/doctor.guard';
import { LoginGuard } from './guards/login.guard';
import { RouterGuard } from './guards/router.guard';
import { UserGuard } from './guards/user.guard';

/**
 * ═══════════════════════════════════════════════════════════════════════
 *                        app-routing.module.ts
 *  THE URL MAP of the Angular application.
 *  Defines EVERY URL path and which Component + Guard(s) apply to it.
 * ═══════════════════════════════════════════════════════════════════════
 *
 * HOW ANGULAR ROUTING WORKS:
 *  When you navigate to a URL (click a link, call router.navigate(), type in bar):
 *  1. Angular Router looks through the 'routes' array top-to-bottom
 *  2. Finds the first path that matches
 *  3. Runs any canActivate guards listed for that route
 *  4. If all guards return true → renders the component in <router-outlet>
 *  5. If any guard returns false → navigation is blocked
 *
 * GUARD LEGEND:
 *  canActivate: [LoginGuard]  → Blocks ALREADY-logged-in users from seeing /login
 *                               (prevents double-login)
 *  canActivate: [RouterGuard] → Blocks UNAUTHENTICATED users (any role must be logged in)
 *  canActivate: [AdminGuard]  → Blocks everyone EXCEPT admins (ROLE==='admin')
 *  canActivate: [DoctorGuard] → Blocks everyone EXCEPT doctors (ROLE==='doctor')
 *  canActivate: [UserGuard]   → Blocks everyone EXCEPT patients (ROLE==='user')
 *
 * ROUTE TABLE EXPLAINED:
 *  path:''                → WelcomepageComponent: Landing page at http://localhost:4200
 *  path:'login'           → LoginGuard: if already logged in, redirect AWAY from login
 *  path:'registration'    → No guard: anyone can register (not logged in yet)
 *  path:'userdashboard'   → RouterGuard: any logged-in user (further UI logic separates roles)
 *  path:'admindashboard'  → RouterGuard: similarly guarded
 *  path:'addDoctor'       → AdminGuard: ONLY admin can add doctors directly
 *  path:'appointments'    → DoctorGuard: ONLY doctors see their appointment list
 *  path:'approvedoctors'  → AdminGuard: ONLY admin can approve/reject doctors
 *  path:'bookappointment' → UserGuard: ONLY patients book appointments
 *  path:'scheduleslots'   → DoctorGuard: ONLY doctors schedule availability
 *  path:'checkslots'      → UserGuard: ONLY patients browse slots
 *  path:'addprescription' → DoctorGuard: ONLY doctors write prescriptions
 *  path:'prescriptionlist'→ UserGuard: ONLY patients view their prescriptions
 */
const routes: Routes = [
  // ── PUBLIC — no auth required ───────────────────────────────────────────
  {path:'',component:WelcomepageComponent},
  // LoginGuard: redirects already-logged-in users away from /login
  {path:'login',component:LoginComponent,canActivate:[LoginGuard]},
  {path:'registration',component:RegistrationComponent},
  {path:'registrationsuccess',component:RegistrationsuccessComponent},

  // ── AUTHENTICATED (any role) ─────────────────────────────────────────────
  {path:'userdashboard',component:UserdashboardComponent,canActivate:[RouterGuard]},
  {path:'doctorlist',component:DoctorlistComponent,canActivate:[RouterGuard]},
  {path:'userlist',component:UserlistComponent,canActivate:[RouterGuard]},
  {path:'patientlist',component:PatientlistComponent,canActivate:[RouterGuard]},
  {path:'approvalstatus',component:ApprovalstatusComponent,canActivate:[RouterGuard]},

  // ── ADMIN ONLY ────────────────────────────────────────────────────────────
  {path:'addDoctor',component:AddingdoctorComponent,canActivate:[AdminGuard]},
  {path:'admindashboard',component:AdmindashboardComponent,canActivate:[AdminGuard]},
  {path:'approvedoctors',component:ApprovedoctorsComponent,canActivate:[AdminGuard]},

  // ── DOCTOR ONLY ───────────────────────────────────────────────────────────
  {path:'appointments',component:AppointmentsComponent,canActivate:[DoctorGuard]},
  {path:'doctordashboard',component:DoctordashboardComponent,canActivate:[DoctorGuard]},
  {path:'scheduleslots',component:ScheduleslotsComponent,canActivate:[DoctorGuard]},
  {path:'addprescription',component:AddprescriptionComponent,canActivate:[DoctorGuard]},
  {path:'editdoctorprofile',component:DoctorprofileComponent,canActivate:[DoctorGuard]},

  // ── USER (PATIENT) ONLY ───────────────────────────────────────────────────
  {path:'bookappointment',component:BookappointmentComponent,canActivate:[UserGuard]},
  {path:'checkslots',component:CheckslotsComponent,canActivate:[UserGuard]},
  {path:'prescriptionlist',component:PrescriptionlistComponent,canActivate:[UserGuard]},
  {path:'edituserprofile',component:UserprofileComponent,canActivate:[UserGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // forRoot() = single router for entire app
  exports: [RouterModule]                   // Makes RouterModule available everywhere
})
export class AppRoutingModule { }
