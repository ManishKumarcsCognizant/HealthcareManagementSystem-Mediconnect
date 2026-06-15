package com.application.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.application.service.UserRegistrationService;
import com.application.util.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter 
{
	private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);
	    @Autowired
	    private JwtUtils jwtUtil;
	 
	    @Autowired
	    private UserRegistrationService service;

	    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {

			String authorizationHeader = httpServletRequest.getHeader("Authorization");

			String token = null;
			String userEmail = null;

			if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
				token = authorizationHeader.substring(7);
				try {
					userEmail = jwtUtil.extractUsername(token);
				} catch (Exception e) {
					logger.debug("Failed to extract username from token: {}", e.getMessage());
				}
			} else {
				logger.debug("No Authorization header or does not start with Bearer");
			}

			if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

				UserDetails userDetails = service.loadUserByEmail(userEmail);

				boolean valid = false;
				try {
					valid = jwtUtil.validateToken(token, userDetails);
				} catch (Exception e) {
					logger.debug("Token validation error: {}", e.getMessage());
				}

				logger.debug("JWT token for user='{}' valid={}", userEmail, valid);

				if (valid) {

					UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
							new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
					usernamePasswordAuthenticationToken
							.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
					SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
					logger.debug("SecurityContext set for user={}", userEmail);
				}
			}
			filterChain.doFilter(httpServletRequest, httpServletResponse);
	    }
	}
