package com.hms.dto.request;

import java.time.LocalTime;
import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class DoctorRegistrationRequest {

    // ===============================
    // Professional Identity
    // ===============================

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid Email")
    private String email;

    @NotBlank(message = "Phone Number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Phone Number must contain 10 digits")
    private String phoneNumber;

    // ===============================
    // Medical Credentials
    // ===============================

    @NotBlank(message = "Qualification is required")
    private String qualification;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @NotBlank(message = "Government Registration Number is required")
    private String govtRegNumber;

    // ===============================
    // Hospital Details
    // ===============================

    @NotBlank(message = "Hospital Name is required")
    private String hospitalName;

    @NotBlank(message = "Hospital Address is required")
    private String hospitalAddress;

    private LocalTime hospitalOpeningTime;

    private LocalTime hospitalClosingTime;

    private List<String> hospitalFacilities;

    // ===============================
    // Uploaded Certificate
    // ===============================

    private String certificateFilePath;

    // ===============================
    // Login
    // ===============================

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must contain minimum 8 characters")
    private String password;

    // ===============================
    // Getters & Setters
    // ===============================

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getGovtRegNumber() {
        return govtRegNumber;
    }

    public void setGovtRegNumber(String govtRegNumber) {
        this.govtRegNumber = govtRegNumber;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getHospitalAddress() {
        return hospitalAddress;
    }

    public void setHospitalAddress(String hospitalAddress) {
        this.hospitalAddress = hospitalAddress;
    }

    public LocalTime getHospitalOpeningTime() {
        return hospitalOpeningTime;
    }

    public void setHospitalOpeningTime(LocalTime hospitalOpeningTime) {
        this.hospitalOpeningTime = hospitalOpeningTime;
    }

    public LocalTime getHospitalClosingTime() {
        return hospitalClosingTime;
    }

    public void setHospitalClosingTime(LocalTime hospitalClosingTime) {
        this.hospitalClosingTime = hospitalClosingTime;
    }

    public List<String> getHospitalFacilities() {
        return hospitalFacilities;
    }

    public void setHospitalFacilities(List<String> hospitalFacilities) {
        this.hospitalFacilities = hospitalFacilities;
    }

    public String getCertificateFilePath() {
        return certificateFilePath;
    }

    public void setCertificateFilePath(String certificateFilePath) {
        this.certificateFilePath = certificateFilePath;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
