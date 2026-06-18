package com.hms.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class PatientResponse {
    private UUID id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String aadhaarLast4;
    private Integer age;
    private String gender;
    private String address;

    private Boolean hasInsurance;
    private String insuranceProvider;
    private String policyNumber;

    private String bloodGroup;
    private BigDecimal height;
    private BigDecimal weight;

    private List<String> medicalConditions;
    private List<String> allergies;

    private Boolean takingMedicines;
    private String medicineName;
    private String dosage;
    private String frequency;
    private List<String> medicineTime;
    private String medicineReason;
    private String medicineDuration;

    private Boolean previousSurgery;
    private String surgeryName;
    private String surgeryType;
    private String surgeryHospital;
    private String surgeonName;
    private LocalDate surgeryDate;
    private String recoveryDuration;
    private String surgeryReason;
    private String currentHealthStatus;

    private Boolean smoking;
    private Boolean alcohol;

    private String emergencyContactName;
    private String emergencyContactNumber;
    private String emergencyRelationship;

    private String existingConditions;
    private String currentMedicines;
    private String pastMedicalHistory;


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
