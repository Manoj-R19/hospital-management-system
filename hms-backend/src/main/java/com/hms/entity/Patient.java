package com.hms.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(length = 36)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "aadhaar_hash", nullable = false, unique = true)
    private String aadhaarHash;

    @Column(name = "aadhaar_last4", nullable = false, length = 4)
    private String aadhaarLast4;

    private Integer age;

    private String gender;

    private String address;

    // ==========================
    // Insurance
    // ==========================
    @Column(name = "has_insurance")
    private Boolean hasInsurance = false;

    @Column(name = "insurance_provider")
    private String insuranceProvider;

    @Column(name = "policy_number")
    private String policyNumber;

    // ==========================
    // Health
    // ==========================
    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(name = "height_cm")
    private BigDecimal height;

    @Column(name = "weight_kg")
    private BigDecimal weight;

    // ==========================
    // Medical History
    // ==========================
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "medical_conditions")
    private List<String> medicalConditions;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "allergies")
    private List<String> allergies;

    // ==========================
    // Medicines
    // ==========================
    @Column(name = "taking_medicines")
    private Boolean takingMedicines = false;

    @Column(name = "medicine_name")
    private String medicineName;

    private String dosage;

    private String frequency;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "medicine_time")
    private List<String> medicineTime;

    @Column(name = "medicine_reason", columnDefinition = "TEXT")
    private String medicineReason;

    @Column(name = "medicine_duration")
    private String medicineDuration;

    // ==========================
    // Surgery
    // ==========================
    @Column(name = "previous_surgery")
    private Boolean previousSurgery = false;

    @Column(name = "surgery_name")
    private String surgeryName;

    @Column(name = "surgery_type")
    private String surgeryType;

    @Column(name = "surgery_hospital")
    private String surgeryHospital;

    @Column(name = "surgeon_name")
    private String surgeonName;

    @Column(name = "surgery_date")
    private LocalDate surgeryDate;

    @Column(name = "recovery_duration")
    private String recoveryDuration;

    @Column(name = "surgery_reason", columnDefinition = "TEXT")
    private String surgeryReason;

    @Column(name = "current_health_status")
    private String currentHealthStatus;

    // ==========================
    // Lifestyle
    // ==========================
    private Boolean smoking = false;

    private Boolean alcohol = false;

    // ==========================
    // Emergency Contact
    // ==========================
    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_number")
    private String emergencyContactNumber;

    @Column(name = "emergency_relationship")
    private String emergencyRelationship;

    // ==========================
    // Audit & Status
    // ==========================
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Legacy fields mapped for backward compatibility if queried anywhere
    @Column(name = "existing_conditions")
    private String existingConditions;

    @Column(name = "current_medicines")
    private String currentMedicines;

    @Column(name = "past_medical_history")
    private String pastMedicalHistory;

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

    public String getAadhaarHash() {
        return aadhaarHash;
    }

    public void setAadhaarHash(String aadhaarHash) {
        this.aadhaarHash = aadhaarHash;
    }

    public String getAadhaarLast4() {
        return aadhaarLast4;
    }

    public void setAadhaarLast4(String aadhaarLast4) {
        this.aadhaarLast4 = aadhaarLast4;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Boolean getHasInsurance() {
        return hasInsurance;
    }

    public void setHasInsurance(Boolean hasInsurance) {
        this.hasInsurance = hasInsurance;
    }

    public String getInsuranceProvider() {
        return insuranceProvider;
    }

    public void setInsuranceProvider(String insuranceProvider) {
        this.insuranceProvider = insuranceProvider;
    }

    public String getPolicyNumber() {
        return policyNumber;
    }

    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public BigDecimal getHeight() {
        return height;
    }

    public void setHeight(BigDecimal height) {
        this.height = height;
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }

    public List<String> getMedicalConditions() {
        return medicalConditions;
    }

    public void setMedicalConditions(List<String> medicalConditions) {
        this.medicalConditions = medicalConditions;
    }

    public List<String> getAllergies() {
        return allergies;
    }

    public void setAllergies(List<String> allergies) {
        this.allergies = allergies;
    }

    public Boolean getTakingMedicines() {
        return takingMedicines;
    }

    public void setTakingMedicines(Boolean takingMedicines) {
        this.takingMedicines = takingMedicines;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public List<String> getMedicineTime() {
        return medicineTime;
    }

    public void setMedicineTime(List<String> medicineTime) {
        this.medicineTime = medicineTime;
    }

    public String getMedicineReason() {
        return medicineReason;
    }

    public void setMedicineReason(String medicineReason) {
        this.medicineReason = medicineReason;
    }

    public String getMedicineDuration() {
        return medicineDuration;
    }

    public void setMedicineDuration(String medicineDuration) {
        this.medicineDuration = medicineDuration;
    }

    public Boolean getPreviousSurgery() {
        return previousSurgery;
    }

    public void setPreviousSurgery(Boolean previousSurgery) {
        this.previousSurgery = previousSurgery;
    }

    public String getSurgeryName() {
        return surgeryName;
    }

    public void setSurgeryName(String surgeryName) {
        this.surgeryName = surgeryName;
    }

    public String getSurgeryType() {
        return surgeryType;
    }

    public void setSurgeryType(String surgeryType) {
        this.surgeryType = surgeryType;
    }

    public String getSurgeryHospital() {
        return surgeryHospital;
    }

    public void setSurgeryHospital(String surgeryHospital) {
        this.surgeryHospital = surgeryHospital;
    }

    public String getSurgeonName() {
        return surgeonName;
    }

    public void setSurgeonName(String surgeonName) {
        this.surgeonName = surgeonName;
    }

    public LocalDate getSurgeryDate() {
        return surgeryDate;
    }

    public void setSurgeryDate(LocalDate surgeryDate) {
        this.surgeryDate = surgeryDate;
    }

    public String getRecoveryDuration() {
        return recoveryDuration;
    }

    public void setRecoveryDuration(String recoveryDuration) {
        this.recoveryDuration = recoveryDuration;
    }

    public String getSurgeryReason() {
        return surgeryReason;
    }

    public void setSurgeryReason(String surgeryReason) {
        this.surgeryReason = surgeryReason;
    }

    public String getCurrentHealthStatus() {
        return currentHealthStatus;
    }

    public void setCurrentHealthStatus(String currentHealthStatus) {
        this.currentHealthStatus = currentHealthStatus;
    }

    public Boolean getSmoking() {
        return smoking;
    }

    public void setSmoking(Boolean smoking) {
        this.smoking = smoking;
    }

    public Boolean getAlcohol() {
        return alcohol;
    }

    public void setAlcohol(Boolean alcohol) {
        this.alcohol = alcohol;
    }

    public String getEmergencyContactName() {
        return emergencyContactName;
    }

    public void setEmergencyContactName(String emergencyContactName) {
        this.emergencyContactName = emergencyContactName;
    }

    public String getEmergencyContactNumber() {
        return emergencyContactNumber;
    }

    public void setEmergencyContactNumber(String emergencyContactNumber) {
        this.emergencyContactNumber = emergencyContactNumber;
    }

    public String getEmergencyRelationship() {
        return emergencyRelationship;
    }

    public void setEmergencyRelationship(String emergencyRelationship) {
        this.emergencyRelationship = emergencyRelationship;
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

    public String getExistingConditions() {
        return existingConditions;
    }

    public void setExistingConditions(String existingConditions) {
        this.existingConditions = existingConditions;
    }

    public String getCurrentMedicines() {
        return currentMedicines;
    }

    public void setCurrentMedicines(String currentMedicines) {
        this.currentMedicines = currentMedicines;
    }

    public String getPastMedicalHistory() {
        return pastMedicalHistory;
    }

    public void setPastMedicalHistory(String pastMedicalHistory) {
        this.pastMedicalHistory = pastMedicalHistory;
    }
}
