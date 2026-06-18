package com.hms.entity;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "doctors")
public class Doctor {

@Id
@GeneratedValue(strategy = GenerationType.UUID)
@JdbcTypeCode(SqlTypes.CHAR)
@Column(length = 36)
private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // ==========================
    // Professional Identity
    // ==========================

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    // ==========================
    // Medical Credentials
    // ==========================

    @Column(nullable = false)
    private String qualification;

    @Column(nullable = false)
    private String specialization;

    @Column(name = "govt_reg_number", nullable = false, unique = true)
    private String govtRegNumber;

    @Column(name = "certificate_file_path")
    private String certificateFilePath;

    // ==========================
    // Hospital Details
    // ==========================

    @Column(name = "hospital_name", nullable = false)
    private String hospitalName;

    @Column(name = "hospital_address", columnDefinition = "TEXT")
    private String hospitalAddress;

    @Column(name = "hospital_opening_time")
    private LocalTime hospitalOpeningTime;

    @Column(name = "hospital_closing_time")
    private LocalTime hospitalClosingTime;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "doctor_facilities",
            joinColumns = @JoinColumn(name = "doctor_id")
    )
    @Column(name = "facility")
    private List<String> hospitalFacilities = new ArrayList<>();

    // ==========================
    // Verification
    // ==========================

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    // ==========================
    // Audit
    // ==========================

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ==========================
    // Constructors
    // ==========================

    public Doctor() {
    }
        // ==========================
    // Getters and Setters
    // ==========================

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public String getCertificateFilePath() {
        return certificateFilePath;
    }

    public void setCertificateFilePath(String certificateFilePath) {
        this.certificateFilePath = certificateFilePath;
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

}