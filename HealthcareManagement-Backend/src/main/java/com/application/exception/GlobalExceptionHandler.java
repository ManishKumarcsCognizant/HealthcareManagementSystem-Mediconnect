package com.application.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({ BadCredentialsException.class })
    @ResponseBody
    public ResponseEntity<Map<String, String>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "unauthorized", "message", "Incorrect email or password. Please try again."));
    }

    @ExceptionHandler({ UsernameNotFoundException.class })
    @ResponseBody
    public ResponseEntity<Map<String, String>> handleUserNotFound(UsernameNotFoundException ex) {
        // Return same user-friendly message to avoid leaking which emails are registered
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "unauthorized", "message", "Incorrect email or password. Please try again."));
    }

    @ExceptionHandler({ Exception.class })
    @ResponseBody
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        // For unexpected errors return a simple friendly message
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "server_error", "message", "Something went wrong on our end. Please try again shortly."));
    }
}
