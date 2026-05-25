package com.application.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.application.model.Admin;
import com.application.model.Doctor;
import com.application.model.User;
import com.application.repository.AdminRepository;
import com.application.repository.DoctorRegistrationRepository;
import com.application.repository.UserRegistrationRepository;

@Service
public class UserRegistrationService implements UserDetailsService
{
	@Autowired
	private UserRegistrationRepository userRegistrationRepo;

	@Autowired
	private DoctorRegistrationRepository doctorRegistrationRepo;

	@Autowired
	private AdminRepository adminRepository;
	
	public User saveUser(User user)
	{
		return userRegistrationRepo.save(user);
	}
	
	public User updateUserProfile(User user)
	{
		return userRegistrationRepo.save(user);
	}
	
	public List<User> getAllUsers()
	{
		return (List<User>)userRegistrationRepo.findAll();
	}
	
	public User fetchUserByEmail(String email)
	{
		return userRegistrationRepo.findByEmail(email);
	}
	
	public User fetchUserByUsername(String username)
	{
		return userRegistrationRepo.findByUsername(username);
	}
	
	public User fetchUserByEmailAndPassword(String email, String password)
	{
		return userRegistrationRepo.findByEmailAndPassword(email, password);
	}
	
	public List<User> fetchProfileByEmail(String email)
	{
		return (List<User>)userRegistrationRepo.findProfileByEmail(email);
	}
	
	public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException
	{
		// Check User table first
		User user = userRegistrationRepo.findByEmail(email);
		if (user != null) {
			return new org.springframework.security.core.userdetails.User(
				user.getEmail(), user.getPassword(),
				List.of(new SimpleGrantedAuthority("ROLE_USER")));
		}
		// Check Doctor table
		Doctor doctor = doctorRegistrationRepo.findByEmail(email);
		if (doctor != null) {
			return new org.springframework.security.core.userdetails.User(
				doctor.getEmail(), doctor.getPassword(),
				List.of(new SimpleGrantedAuthority("ROLE_DOCTOR")));
		}
		// Check Admin table
		Admin admin = adminRepository.findByEmail(email);
		if (admin != null) {
			return new org.springframework.security.core.userdetails.User(
				admin.getEmail(), admin.getPassword(),
				List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
		}
		throw new UsernameNotFoundException("No account found for email: " + email);
	}
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
	{		
		User user = userRegistrationRepo.findByUsername(username);
	    return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), new ArrayList<>());
	}
	
}