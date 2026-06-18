package com.hms.service;

import com.hms.dto.request.CreateEncounterRequest;
import com.hms.dto.request.CreatePrescriptionRequest;
import com.hms.dto.response.EncounterResponse;
import com.hms.dto.response.PrescriptionResponse;
import com.hms.entity.Doctor;
import com.hms.entity.Encounter;
import com.hms.entity.Patient;
import com.hms.entity.Prescription;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.DoctorRepository;
import com.hms.repository.EncounterRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.PrescriptionRepository;
import com.hms.util.AadhaarUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    private final EncounterRepository encounterRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Autowired
    public PrescriptionService(EncounterRepository encounterRepository,
                               PrescriptionRepository prescriptionRepository,
                               PatientRepository patientRepository,
                               DoctorRepository doctorRepository) {
        this.encounterRepository = encounterRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @Transactional
    public EncounterResponse createEncounter(UUID doctorUserId, CreateEncounterRequest request) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        
        Patient patient = patientRepository.findByAadhaarHash(AadhaarUtil.hash(request.getPatientAadhaar()))
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Encounter encounter = new Encounter();
        encounter.setDoctor(doctor);
        encounter.setPatient(patient);
        encounter.setHospitalName(doctor.getHospitalName());
        encounter.setDiagnosis(request.getDiagnosis());
        encounter.setClinicalNotes(request.getClinicalNotes());
        encounter.setIsEditable(true);
        encounter = encounterRepository.save(encounter);

        if (request.getPrescriptions() != null && !request.getPrescriptions().isEmpty()) {
            for (CreatePrescriptionRequest pReq : request.getPrescriptions()) {
                Prescription p = new Prescription();
                p.setEncounter(encounter);
                p.setPatient(patient);
                p.setDoctor(doctor);
                p.setMedicineName(pReq.getMedicineName());
                p.setDosage(pReq.getDosage());
                p.setFrequency(pReq.getFrequency());
                p.setDurationText(pReq.getDurationText());
                p.setDurationDays(pReq.getDurationDays());
                p.setInstructions(pReq.getInstructions());
                prescriptionRepository.save(p);
            }
        }

        return mapEncounterToResponse(encounter);
    }

    public List<PrescriptionResponse> getPrescriptionsByEncounter(UUID encounterId) {
        return prescriptionRepository.findByEncounterId(encounterId)
                .stream().map(this::mapPrescriptionToResponse).collect(Collectors.toList());
    }

    public List<PrescriptionResponse> getActivePrescriptionsByPatient(UUID patientId) {
        return prescriptionRepository.findByPatientIdAndIsActiveTrue(patientId)
                .stream().map(this::mapPrescriptionToResponse).collect(Collectors.toList());
    }

    public EncounterResponse mapEncounterToResponse(Encounter encounter) {
        EncounterResponse res = new EncounterResponse();
        res.setEncounterId(encounter.getId());
        res.setVisitDatetime(encounter.getVisitDatetime());
        res.setDoctorName(encounter.getDoctor().getFullName());
        res.setHospitalName(encounter.getHospitalName());
        res.setSpecialization(encounter.getDoctor().getSpecialization());
        res.setDiagnosis(encounter.getDiagnosis());
        res.setClinicalNotes(encounter.getClinicalNotes());
        return res;
    }

    public PrescriptionResponse mapPrescriptionToResponse(Prescription prescription) {
        PrescriptionResponse res = new PrescriptionResponse();
        res.setId(prescription.getId());
        res.setEncounterId(prescription.getEncounter() != null ? prescription.getEncounter().getId() : null);
        res.setMedicineName(prescription.getMedicineName());
        res.setDosage(prescription.getDosage());
        res.setFrequency(prescription.getFrequency());
        res.setDurationText(prescription.getDurationText());
        res.setDurationDays(prescription.getDurationDays());
        res.setInstructions(prescription.getInstructions());
        res.setIsActive(prescription.getIsActive());
        return res;
    }
}



