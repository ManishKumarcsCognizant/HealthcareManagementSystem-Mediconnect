package com.application.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.application.model.Doctor;
import com.application.model.Slots;
import com.application.model.User;
import com.application.service.DoctorRegistrationService;
import com.application.service.UserRegistrationService;

@RestController
public class RegistrationController 
{
	@Autowired
	private UserRegistrationService userRegisterService;
	
	@Autowired
	private DoctorRegistrationService doctorRegisterService;
	
	@PostMapping({"/registerUser", "/registeruser"})
	public ResponseEntity<?> registerUser(@RequestBody User user)
	{
			String currEmail = user.getEmail();
			if (currEmail != null) {
				currEmail = currEmail.trim();
			}
			if(currEmail != null && !"".equals(currEmail))
			{
				User userObj = userRegisterService.fetchUserByEmail(currEmail);
				if(userObj != null)
				{
					return new ResponseEntity<>("User with "+currEmail+" already exists !!!", HttpStatus.CONFLICT);
				}
			}
		User userObj = userRegisterService.saveUser(user);
		return new ResponseEntity<User>(userObj, HttpStatus.OK);
	}
	
	@PostMapping("/registerdoctor")
	public ResponseEntity<?> registerDoctor(@RequestBody Doctor doctor)
	{
			String currEmail = doctor.getEmail();
			if (currEmail != null) {
				currEmail = currEmail.trim();
			}
			if(currEmail != null && !"".equals(currEmail))
			{
				Doctor doctorObj = doctorRegisterService.fetchDoctorByEmail(currEmail);
				if(doctorObj != null)
				{
					return new ResponseEntity<>("Doctor with "+currEmail+" already exists !!!", HttpStatus.CONFLICT);
				}
			}
		Doctor doctorObj = doctorRegisterService.saveDoctor(doctor);
		return new ResponseEntity<Doctor>(doctorObj, HttpStatus.OK);
	}
	
	@PostMapping("/addDoctor")
	public Doctor addNewDoctor(@RequestBody Doctor doctor) throws Exception
	{
		Doctor doctorObj = null;
		doctorObj = doctorRegisterService.saveDoctor(doctor);
		return doctorObj;
	}
	
	@GetMapping("/gettotalusers")
	public ResponseEntity<List<Integer>> getTotalSlots() throws Exception
	{
		List<User> users = userRegisterService.getAllUsers();
		List<Integer> al = new ArrayList<>();
		al.add(users.size());
		return new ResponseEntity<List<Integer>>(al, HttpStatus.OK);
	}

}
