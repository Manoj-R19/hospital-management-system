package com.hms.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class PatientHistoryResponse {
    private String patientId; // Aadhaar masked
    private String name;
    private Integer age;
    private String gender;
    private String address;
    private String existingConditions;
    private String currentMedicines;
    private String pastMedicalHistory;
    
    private List<ReportDto> scanningReports;
    private List<EncounterWithPrescriptionsDto> checkupHistory;

    public static class ReportDto {
        private UUID reportId;
        private String fileName;
        private LocalDateTime uploadedAt;
        private String uploadedBy;
        private String downloadUrl;

        public UUID getReportId() {
            return reportId;
        }

        public void setReportId(UUID reportId) {
            this.reportId = reportId;
        }

        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }

        public LocalDateTime getUploadedAt() {
            return uploadedAt;
        }

        public void setUploadedAt(LocalDateTime uploadedAt) {
            this.uploadedAt = uploadedAt;
        }

        public String getUploadedBy() {
            return uploadedBy;
        }

        public void setUploadedBy(String uploadedBy) {
            this.uploadedBy = uploadedBy;
        }

        public String getDownloadUrl() {
            return downloadUrl;
        }

        public void setDownloadUrl(String downloadUrl) {
            this.downloadUrl = downloadUrl;
        }
    }

    public static class EncounterWithPrescriptionsDto {
        private UUID encounterId;
        private LocalDateTime visitDate;
        private String doctorName;
        private String hospitalName;
        private String specialization;
        private String diagnosis;
        private String notes;
        private List<PrescriptionResponse> prescriptions;

        public UUID getEncounterId() {
            return encounterId;
        }

        public void setEncounterId(UUID encounterId) {
            this.encounterId = encounterId;
        }

        public LocalDateTime getVisitDate() {
            return visitDate;
        }

        public void setVisitDate(LocalDateTime visitDate) {
            this.visitDate = visitDate;
        }

        public String getDoctorName() {
            return doctorName;
        }

        public void setDoctorName(String doctorName) {
            this.doctorName = doctorName;
        }

        public String getHospitalName() {
            return hospitalName;
        }

        public void setHospitalName(String hospitalName) {
            this.hospitalName = hospitalName;
        }

        public String getSpecialization() {
            return specialization;
        }

        public void setSpecialization(String specialization) {
            this.specialization = specialization;
        }

        public String getDiagnosis() {
            return diagnosis;
        }

        public void setDiagnosis(String diagnosis) {
            this.diagnosis = diagnosis;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }

        public List<PrescriptionResponse> getPrescriptions() {
            return prescriptions;
        }

        public void setPrescriptions(List<PrescriptionResponse> prescriptions) {
            this.prescriptions = prescriptions;
        }
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public List<ReportDto> getScanningReports() {
        return scanningReports;
    }

    public void setScanningReports(List<ReportDto> scanningReports) {
        this.scanningReports = scanningReports;
    }

    public List<EncounterWithPrescriptionsDto> getCheckupHistory() {
        return checkupHistory;
    }

    public void setCheckupHistory(List<EncounterWithPrescriptionsDto> checkupHistory) {
        this.checkupHistory = checkupHistory;
    }
}

