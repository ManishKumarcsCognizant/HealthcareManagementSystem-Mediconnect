package com.application.model;

/**
 * Auth response returned exclusively for Patient/User login and registration.
 * Contains only fields relevant to a user account.
 */
public class UserAuthResponse {

    private String token;
    private String email;
    private String username;
    private String role;       // always "user"
    private String gender;
    private String age;
    private String mobile;
    private String address;

    public UserAuthResponse() {}

    public UserAuthResponse(String token, String email, String username,
                            String role, String gender, String age,
                            String mobile, String address) {
        this.token    = token;
        this.email    = email;
        this.username = username;
        this.role     = role;
        this.gender   = gender;
        this.age      = age;
        this.mobile   = mobile;
        this.address  = address;
    }

    public String getToken()              { return token; }
    public void   setToken(String t)      { this.token = t; }

    public String getEmail()              { return email; }
    public void   setEmail(String e)      { this.email = e; }

    public String getUsername()           { return username; }
    public void   setUsername(String n)   { this.username = n; }

    public String getRole()               { return role; }
    public void   setRole(String r)       { this.role = r; }

    public String getGender()             { return gender; }
    public void   setGender(String g)     { this.gender = g; }

    public String getAge()                { return age; }
    public void   setAge(String a)        { this.age = a; }

    public String getMobile()             { return mobile; }
    public void   setMobile(String m)     { this.mobile = m; }

    public String getAddress()            { return address; }
    public void   setAddress(String a)    { this.address = a; }
}
