package com.hms.dto.request;

import java.util.List;

public class CreateEncounterRequest {
    private String patientAadhaar;
    private String diagnosis;
    private String clinicalNotes;
    private List<CreatePrescriptionRequest> prescriptions;

    public String getPatientAadhaar() {
        return patientAadhaar;
    }

    public void setPatientAadhaar(String patientAadhaar) {
        this.patientAadhaar = patientAadhaar;
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

    public List<CreatePrescriptionRequest> getPrescriptions() {
        return prescriptions;
    }

    public void setPrescriptions(List<CreatePrescriptionRequest> prescriptions) {
        this.prescriptions = prescriptions;
    }
}

