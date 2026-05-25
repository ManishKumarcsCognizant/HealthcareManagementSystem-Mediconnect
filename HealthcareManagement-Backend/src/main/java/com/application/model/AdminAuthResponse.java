package com.application.model;

/**
 * Auth response returned exclusively for Admin login and registration.
 * Contains only fields relevant to an admin account.
 */
public class AdminAuthResponse {

    private String token;
    private String email;
    private String adminname;
    private String role;   // always "admin"

    public AdminAuthResponse() {}

    public AdminAuthResponse(String token, String email, String adminname, String role) {
        this.token     = token;
        this.email     = email;
        this.adminname = adminname;
        this.role      = role;
    }

    public String getToken()                  { return token; }
    public void   setToken(String t)          { this.token = t; }

    public String getEmail()                  { return email; }
    public void   setEmail(String e)          { this.email = e; }

    public String getAdminname()              { return adminname; }
    public void   setAdminname(String n)      { this.adminname = n; }

    public String getRole()                   { return role; }
    public void   setRole(String r)           { this.role = r; }
}
