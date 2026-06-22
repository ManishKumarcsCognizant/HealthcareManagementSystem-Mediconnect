package com.application.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.application.model.AuthRequest;
import com.application.model.UserAuthResponse;
import com.application.model.DoctorAuthResponse;
import com.application.model.Doctor;
import com.application.model.User;
import com.application.service.DoctorRegistrationService;
import com.application.service.UserRegistrationService;
import com.application.util.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
public class LoginController 
{
	
	@Autowired
	private UserRegistrationService userRegisterService;
	
	@Autowired
    private JwtUtils jwtUtil;
	
	@Autowired
    private AuthenticationManager authenticationManager;
	
	@Autowired
	private DoctorRegistrationService doctorRegisterService;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@GetMapping("/")
    public String welcomeMessage()
    {
    	return "Welcome to HealthCare Management system !!!";
    }
    
    @PostMapping("/authenticate")
    public ResponseEntity<String> generateToken(@RequestBody AuthRequest authRequest) throws Exception 
    {
		try {
			System.out.println(authRequest.getEmail());
			System.out.println(authRequest.getPassword());
			List<User> users = userRegisterService.getAllUsers();
			String currentEmail = "";
			for (User obj : users) {
				if (obj.getEmail().equalsIgnoreCase(authRequest.getEmail())) {
					currentEmail = obj.getUsername();
				}
			}
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(currentEmail, authRequest.getPassword()));
			return new ResponseEntity<String>(jwtUtil.generateToken(authRequest.getEmail()), HttpStatus.OK);
		} catch (AuthenticationException ex) {
			// Return a user-friendly message without technical details
			return new ResponseEntity<String>("Incorrect username or password", HttpStatus.UNAUTHORIZED);
		}
    }
	
	@PostMapping("/loginuser")
	public ResponseEntity<?> loginUser(@RequestBody User user) throws Exception
	{
		String currEmail = user.getEmail();
		String currPassword = user.getPassword();

		User userObj = null;
		if(currEmail != null && currPassword != null)
		{
			userObj = userRegisterService.fetchUserByEmail(currEmail);
			if(userObj == null || !passwordEncoder.matches(currPassword, userObj.getPassword()))
			{
				userObj = null;
			}
		}
		if(userObj == null)
		{
			return new ResponseEntity<>("Incorrect username or password", HttpStatus.UNAUTHORIZED);
		}

		String token = jwtUtil.generateToken(userObj.getEmail());

		UserAuthResponse response = new UserAuthResponse(
			token,
			userObj.getEmail(),
			userObj.getUsername(),
			"user",           // Hardcoded role string for Angular's localStorage
			userObj.getGender(),
			userObj.getAge(),
			userObj.getMobile(),
			userObj.getAddress()
		);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping("/logindoctor")
	public ResponseEntity<?> loginDoctor(@RequestBody Doctor doctor) throws Exception
	{
		String currEmail = doctor.getEmail();
		String currPassword = doctor.getPassword();

		Doctor doctorObj = null;
		if(currEmail != null && currPassword != null)
		{
			doctorObj = doctorRegisterService.fetchDoctorByEmail(currEmail);
			if(doctorObj == null || !passwordEncoder.matches(currPassword, doctorObj.getPassword()))
			{
				doctorObj = null;
			}
		}
		if(doctorObj == null)
		{
			return new ResponseEntity<>("Incorrect username or password", HttpStatus.UNAUTHORIZED);
		}

		String token = jwtUtil.generateToken(doctorObj.getEmail());

		DoctorAuthResponse response = new DoctorAuthResponse(
			token,
			doctorObj.getEmail(),
			doctorObj.getDoctorname(),
			"doctor",
			doctorObj.getGender(),
			doctorObj.getSpecialization(),
			doctorObj.getExperience(),
			doctorObj.getPrevioushospital(),
			doctorObj.getMobile(),
			doctorObj.getAddress(),
			doctorObj.getStatus()
		);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

}
