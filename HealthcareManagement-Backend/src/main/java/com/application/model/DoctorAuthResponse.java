package com.application.model;

/**
 * Auth response returned exclusively for Doctor login and registration.
 * Contains only fields relevant to a doctor account.
 */
public class DoctorAuthResponse {

    private String token;
    private String email;
    private String doctorname;
    private String role;           // always "doctor"
    private String gender;
    private String specialization;
    private String experience;
    private String previoushospital;
    private String mobile;
    private String address;
    private String status;         // "pending" | "accepted" | "rejected"

    public DoctorAuthResponse() {}

    public DoctorAuthResponse(String token, String email, String doctorname,
                               String role, String gender, String specialization,
                               String experience, String previoushospital,
                               String mobile, String address, String status) {
        this.token           = token;
        this.email           = email;
        this.doctorname      = doctorname;
        this.role            = role;
        this.gender          = gender;
        this.specialization  = specialization;
        this.experience      = experience;
        this.previoushospital = previoushospital;
        this.mobile          = mobile;
        this.address         = address;
        this.status          = status;
    }

    public String getToken()                    { return token; }
    public void   setToken(String t)            { this.token = t; }

    public String getEmail()                    { return email; }
    public void   setEmail(String e)            { this.email = e; }

    public String getDoctorname()               { return doctorname; }
    public void   setDoctorname(String n)       { this.doctorname = n; }

    public String getRole()                     { return role; }
    public void   setRole(String r)             { this.role = r; }

    public String getGender()                   { return gender; }
    public void   setGender(String g)           { this.gender = g; }

    public String getSpecialization()           { return specialization; }
    public void   setSpecialization(String s)   { this.specialization = s; }

    public String getExperience()               { return experience; }
    public void   setExperience(String e)       { this.experience = e; }

    public String getPrevioushospital()         { return previoushospital; }
    public void   setPrevioushospital(String p) { this.previoushospital = p; }

    public String getMobile()                   { return mobile; }
    public void   setMobile(String m)           { this.mobile = m; }

    public String getAddress()                  { return address; }
    public void   setAddress(String a)          { this.address = a; }

    public String getStatus()                   { return status; }
    public void   setStatus(String s)           { this.status = s; }
}
