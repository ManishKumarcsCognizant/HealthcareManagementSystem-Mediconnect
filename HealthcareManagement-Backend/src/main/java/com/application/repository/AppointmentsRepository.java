package com.application.repository;

import com.application.model.Appointments;
import java.util.List;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface AppointmentsRepository extends CrudRepository<Appointments,Integer>
{
	
	public List<Appointments> findByEmail(String email);
	
	public List<Appointments> findBySlot(String slot);
	
	public List<Appointments> findByDoctorname(String doctorname);
	
	@Transactional
	@Modifying
	@Query(value = "update slots set amstatus = 'booked' where doctorname = ?1 and date = ?2", nativeQuery = true)
	public void updateAmstatus(String doctorname, String date);
	
	@Transactional
	@Modifying
	@Query(value = "update slots set noonstatus = 'booked' where doctorname = ?1 and date = ?2", nativeQuery = true)
	public void updateNoonstatus(String doctorname, String date);
	
	@Transactional
	@Modifying
	@Query(value = "update slots set pmstatus = 'booked' where doctorname = ?1 and date = ?2", nativeQuery = true)
	public void updatePmstatus(String doctorname, String date);

	// ── Pending: slot is held while awaiting doctor approval ────────────────
	@Transactional
	@Modifying
	@Query(value = "update slots set amstatus = 'pending' where doctorname = ?1 and date = ?2", nativeQuery = true)
	public void setPendingAmstatus(String doctorname, String date);

	@Transactional
	@Modifying
	@Query(value = "update slots set noonstatus = 'pending' where doctorname = ?1 and date = ?2", nativeQuery = true)
	public void setPendingNoonstatus(String doctorname, String date);

	@Transactional
	@Modifying
	@Query(value = "update slots set pmstatus = 'pending' where doctorname = ?1 and date = ?2", nativeQuery = true)
	public void setPendingPmstatus(String doctorname, String date);

	// ── Restore: free slot back to available when doctor rejects ────────────
	@Transactional
	@Modifying
	@Query(value = "update slots set amstatus = 'unbooked' where doctorname = ?1 and date = ?2", nativeQuery = true)
	public void restoreAmstatus(String doctorname, String date);

	@Transactional
	@Modifying
	@Query(value = "update slots set noonstatus = 'unbooked' where doctorname = ?1 and date = ?2", nativeQuery = true)
	public void restoreNoonstatus(String doctorname, String date);

	@Transactional
	@Modifying
	@Query(value = "update slots set pmstatus = 'unbooked' where doctorname = ?1 and date = ?2", nativeQuery = true)
	public void restorePmstatus(String doctorname, String date);

	@Transactional
	@Modifying
	@Query(value = "update appointments set patientid = ?1 where doctorname = ?2 and patientname = ?3 and date = ?4", nativeQuery = true)
	public void UpdatePatientid(String patientID, String doctorname, String patientname, String date);

	@Transactional
	@Modifying
	@Query(value = "update appointments set appointmentstatus = ?2 where id = ?1", nativeQuery = true)
	public void updateAppointmentStatusById(int id, String status);
	
}
