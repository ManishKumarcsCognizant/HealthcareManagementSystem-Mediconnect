package com.application.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.application.model.Admin;
import com.application.model.AuthResponse;
import com.application.service.AdminService;
import com.application.util.JwtUtils;

@RestController
public class AdminController
{
	@Autowired
	private AdminService adminService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtUtils jwtUtils;

	@PostMapping("/registeradmin")
	public ResponseEntity<?> registerAdmin(@RequestBody Admin adminRequest)
	{
		String email = adminRequest.getEmail();
		if (email == null || email.trim().isEmpty())
		{
			return new ResponseEntity<>("Email is required", HttpStatus.BAD_REQUEST);
		}
		Admin existing = adminService.findByEmail(email.trim());
		if (existing != null)
		{
			return new ResponseEntity<>("Admin with " + email + " already exists", HttpStatus.CONFLICT);
		}
		adminRequest.setPassword(passwordEncoder.encode(adminRequest.getPassword()));
		Admin saved = adminService.save(adminRequest);
		return new ResponseEntity<>(saved, HttpStatus.OK);
	}

	@PostMapping("/loginadmin")
	public ResponseEntity<?> loginAdmin(@RequestBody Admin adminRequest) throws Exception
	{
		String email    = adminRequest.getEmail();
		String password = adminRequest.getPassword();

		if (email == null || password == null)
		{
			return new ResponseEntity<>("Email and password are required", HttpStatus.BAD_REQUEST);
		}

		Admin admin = adminService.findByEmail(email.trim());

		if (admin == null || !passwordEncoder.matches(password, admin.getPassword()))
		{
			return new ResponseEntity<>("Invalid admin credentials", HttpStatus.UNAUTHORIZED);
		}

		String token = jwtUtils.generateToken(admin.getEmail());
		AuthResponse response = new AuthResponse(
			token,
			admin.getEmail(),
			admin.getAdminname(),
			"admin",
			null,
			null,
			null
		);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
