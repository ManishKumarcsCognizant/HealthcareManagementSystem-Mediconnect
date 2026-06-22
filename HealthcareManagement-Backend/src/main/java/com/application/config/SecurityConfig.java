package com.application.config;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import jakarta.servlet.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandlerImpl;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.application.filter.JwtFilter;
import com.application.service.UserRegistrationService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserRegistrationService registrationService;

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(registrationService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/", "/authenticate",
                "/loginuser", "/logindoctor", "/loginadmin",
                "/registerUser", "/registeruser", "/registerdoctor", "/registeradmin"
            ).permitAll()
            .requestMatchers(
                "/doctorlist", "/getDoctorByEmail/**",
                "/slotDetails/**", "/slotDetailsWithUniqueDoctors", "/slotDetailsWithUniqueSpecializations",
                "/gettotaldoctors", "/gettotalslots", "/gettotalusers",
                "/gettotalpatients", "/gettotalappointments", "/gettotalprescriptions"
            ).permitAll()
            .requestMatchers(
                "/userlist", "/patientlist",
                "/acceptstatus/**", "/rejectstatus/**",
                "/acceptpatient/**", "/rejectpatient/**",
                "/addDoctor", "/approvedoctors","/admindashboard"
            ).hasRole("ADMIN")
            .requestMatchers(
                "/addBookingSlots", "/updateAppointmentStatus/**",
                "/patientlistbydoctoremail/**", "/patientlistbydoctoremailanddate/**",
                "/addPrescription", "/doctorProfileDetails/**", "/updatedoctor",
                "/prescriptionsbydoctoremail/**"
            ).hasRole("DOCTOR")
            .requestMatchers(
                "/bookNewAppointment", "/patientlistbyemail/**",
                "/profileDetails/**", "/updateuser", "/getprescriptionbyname/**"
            ).hasRole("USER")
            .anyRequest().authenticated())
        .exceptionHandling(exception -> exception.accessDeniedHandler(new AccessDeniedHandlerImpl()))
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

    http.authenticationProvider(authenticationProvider());
    http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList("*"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
}
