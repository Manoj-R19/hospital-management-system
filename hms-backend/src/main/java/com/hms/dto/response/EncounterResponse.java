package com.hms.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public class EncounterResponse {
    private UUID encounterId;
    private LocalDateTime visitDatetime;
    private String doctorName;
    private String hospitalName;
    private String specialization;
    private String diagnosis;
    private String clinicalNotes;

    public UUID getEncounterId() {
        return encounterId;
    }

    public void setEncounterId(UUID encounterId) {
        this.encounterId = encounterId;
    }

    public LocalDateTime getVisitDatetime() {
        return visitDatetime;
    }

    public void setVisitDatetime(LocalDateTime visitDatetime) {
        this.visitDatetime = visitDatetime;
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

    public String getClinicalNotes() {
        return clinicalNotes;
    }

    public void setClinicalNotes(String clinicalNotes) {
        this.clinicalNotes = clinicalNotes;
    }
}

