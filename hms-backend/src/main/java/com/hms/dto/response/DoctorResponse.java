package com.hms.dto.response;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public class DoctorResponse {

    private UUID id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String qualification;

    private String specialization;

    private String govtRegNumber;

    private String hospitalName;

    private String hospitalAddress;

    private LocalTime hospitalOpeningTime;

    private LocalTime hospitalClosingTime;

    private List<String> hospitalFacilities;

    private String certificateFilePath;

    private Boolean isVerified;

    private Boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // ==========================
    // Getters & Setters
    // ==========================

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}