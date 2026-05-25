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

import com.application.model.UserAuthResponse;
import com.application.model.DoctorAuthResponse;
import com.application.model.Doctor;
import com.application.model.Slots;
import com.application.model.User;
import com.application.service.DoctorRegistrationService;
import com.application.service.UserRegistrationService;
import com.application.util.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
public class RegistrationController 
{
	@Autowired
	private UserRegistrationService userRegisterService;
	
	@Autowired
	private DoctorRegistrationService doctorRegisterService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	/** Used to mint a JWT immediately after a successful registration */
	@Autowired
	private JwtUtils jwtUtils;
	
	@PostMapping({"/registerUser", "/registeruser"})
	public ResponseEntity<?> registerUser(@RequestBody User user)
	{
			String currEmail = user.getEmail();
			if (currEmail != null) {
				currEmail = currEmail.trim();
			}
			if(currEmail != null && !"".equals(currEmail))
			{
				User existing = userRegisterService.fetchUserByEmail(currEmail);
				if(existing != null)
				{
					return new ResponseEntity<>("User with "+currEmail+" already exists !!!", HttpStatus.CONFLICT);
				}
			}
		// BCrypt-encode the plain-text password before persisting
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		User saved = userRegisterService.saveUser(user);

		// Generate JWT using the saved email as the subject
		String token = jwtUtils.generateToken(saved.getEmail());

		UserAuthResponse response = new UserAuthResponse(
			token,
			saved.getEmail(),
			saved.getUsername(),
			"user",
			saved.getGender(),
			saved.getAge(),
			saved.getMobile(),
			saved.getAddress()
		);
		return new ResponseEntity<>(response, HttpStatus.OK);
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
				Doctor existing = doctorRegisterService.fetchDoctorByEmail(currEmail);
				if(existing != null)
				{
					return new ResponseEntity<>("Doctor with "+currEmail+" already exists !!!", HttpStatus.CONFLICT);
				}
			}
		// BCrypt-encode the plain-text password before persisting
		doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
		Doctor saved = doctorRegisterService.saveDoctor(doctor);

		// Generate JWT using the saved email as the subject
		String token = jwtUtils.generateToken(saved.getEmail());

		DoctorAuthResponse response = new DoctorAuthResponse(
			token,
			saved.getEmail(),
			saved.getDoctorname(),
			"doctor",
			saved.getGender(),
			saved.getSpecialization(),
			saved.getExperience(),
			saved.getPrevioushospital(),
			saved.getMobile(),
			saved.getAddress(),
			saved.getStatus()
		);
		return new ResponseEntity<>(response, HttpStatus.OK);
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
