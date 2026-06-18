package com.hms.service;

import com.hms.dto.request.PatientRegistrationRequest;
import com.hms.dto.response.PatientHistoryResponse;
import com.hms.dto.response.PatientResponse;
import com.hms.entity.Encounter;
import com.hms.entity.Patient;
import com.hms.entity.PatientReport;
import com.hms.entity.Prescription;
import com.hms.entity.User;
import com.hms.enums.UserRole;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.EncounterRepository;
import com.hms.repository.PatientReportRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.PrescriptionRepository;
import com.hms.repository.UserRepository;
import com.hms.util.AadhaarUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PatientReportRepository reportRepository;
    private final EncounterRepository encounterRepository;
    private final PrescriptionRepository prescriptionRepository;

    @Autowired
    public PatientService(PatientRepository patientRepository,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          PatientReportRepository reportRepository,
                          EncounterRepository encounterRepository,
                          PrescriptionRepository prescriptionRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.reportRepository = reportRepository;
        this.encounterRepository = encounterRepository;
        this.prescriptionRepository = prescriptionRepository;
    }

    @Transactional
    public PatientResponse registerPatient(PatientRegistrationRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (userRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            throw new IllegalArgumentException("Phone number already in use");
        }
        String aadhaarHash = AadhaarUtil.hash(request.getAadhaarNumber());
        if (patientRepository.findByAadhaarHash(aadhaarHash).isPresent()) {
            throw new IllegalArgumentException("Aadhaar number already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.PATIENT);
        user = userRepository.save(user);

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setFullName(request.getFullName());
        patient.setEmail(request.getEmail());
        patient.setPhoneNumber(request.getPhoneNumber());
        patient.setAadhaarHash(aadhaarHash);
        patient.setAadhaarLast4(AadhaarUtil.extractLast4(request.getAadhaarNumber()));
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setAddress(request.getAddress());
        patient.setHasInsurance(request.getHasInsurance());
        patient.setInsuranceProvider(request.getInsuranceProvider());
        patient.setPolicyNumber(request.getPolicyNumber());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setHeight(request.getHeight());
        patient.setWeight(request.getWeight());
        patient.setMedicalConditions(request.getMedicalConditions());
        patient.setAllergies(request.getAllergies());
        patient.setTakingMedicines(request.getTakingMedicines());
        patient.setMedicineName(request.getMedicineName());
        patient.setDosage(request.getDosage());
        patient.setFrequency(request.getFrequency());
        patient.setMedicineTime(request.getMedicineTime());
        patient.setMedicineReason(request.getMedicineReason());
        patient.setMedicineDuration(request.getMedicineDuration());
        patient.setPreviousSurgery(request.getPreviousSurgery());
        patient.setSurgeryName(request.getSurgeryName());
        patient.setSurgeryType(request.getSurgeryType());
        patient.setSurgeryHospital(request.getSurgeryHospital());
        patient.setSurgeonName(request.getSurgeonName());
        patient.setSurgeryDate(request.getSurgeryDate());
        patient.setRecoveryDuration(request.getRecoveryDuration());
        patient.setSurgeryReason(request.getSurgeryReason());
        patient.setCurrentHealthStatus(request.getCurrentHealthStatus());
        patient.setSmoking(request.getSmoking());
        patient.setAlcohol(request.getAlcohol());
        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactNumber(request.getEmergencyContactNumber());
        patient.setEmergencyRelationship(request.getEmergencyRelationship());
        patient = patientRepository.save(patient);

        return mapToResponse(patient);
    }

    public PatientResponse getPatientById(UUID id) {
        return mapToResponse(patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found")));
    }

    public PatientResponse getPatientByUserId(UUID userId) {
        return mapToResponse(patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found")));
    }

    public PatientResponse getPatientByAadhaar(String aadhaar) {
        String hash = AadhaarUtil.hash(aadhaar);
        return mapToResponse(patientRepository.findByAadhaarHash(hash)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with this Aadhaar")));
    }

    public PatientHistoryResponse getPatientHistory(String aadhaar) {
        String hash = AadhaarUtil.hash(aadhaar);
        Patient patient = patientRepository.findByAadhaarHash(hash)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        PatientHistoryResponse response = new PatientHistoryResponse();
        response.setPatientId(AadhaarUtil.mask(aadhaar));
        response.setName(patient.getFullName());
        response.setAge(patient.getAge());
        response.setGender(patient.getGender());
        response.setAddress(patient.getAddress());
        response.setExistingConditions(patient.getExistingConditions());
        response.setCurrentMedicines(patient.getCurrentMedicines());
        response.setPastMedicalHistory(patient.getPastMedicalHistory());

        List<PatientReport> reports = reportRepository.findByPatientId(patient.getId());
        response.setScanningReports(reports.stream().map(r -> {
            PatientHistoryResponse.ReportDto dto = new PatientHistoryResponse.ReportDto();
            dto.setReportId(r.getId());
            dto.setFileName(r.getFileName());
            dto.setUploadedAt(r.getCreatedAt());
            dto.setUploadedBy(r.getUploadedBy());
            dto.setDownloadUrl("/api/files/reports/" + r.getId());
            return dto;
        }).collect(Collectors.toList()));

        List<Encounter> encounters = encounterRepository.findByPatientIdOrderByVisitDatetimeDesc(patient.getId());
        response.setCheckupHistory(encounters.stream().map(e -> {
            PatientHistoryResponse.EncounterWithPrescriptionsDto dto = new PatientHistoryResponse.EncounterWithPrescriptionsDto();
            dto.setEncounterId(e.getId());
            dto.setVisitDate(e.getVisitDatetime());
            dto.setDoctorName(e.getDoctor().getFullName());
            dto.setHospitalName(e.getHospitalName());
            dto.setSpecialization(e.getDoctor().getSpecialization());
            dto.setDiagnosis(e.getDiagnosis());
            dto.setNotes(e.getClinicalNotes());
            
            // Map Prescriptions later via PrescriptionService or simple mapper. Leaving empty list for now.
            // In a real app we would map this properly.
            dto.setPrescriptions(List.of());
            return dto;
        }).collect(Collectors.toList()));

        return response;
    }

    private PatientResponse mapToResponse(Patient patient) {
        PatientResponse res = new PatientResponse();
        res.setId(patient.getId());
        res.setFullName(patient.getFullName());
        res.setEmail(patient.getEmail());
        res.setPhoneNumber(patient.getPhoneNumber());
        res.setAadhaarLast4(patient.getAadhaarLast4());
        res.setAge(patient.getAge());
        res.setGender(patient.getGender());
        res.setAddress(patient.getAddress());
        res.setHasInsurance(patient.getHasInsurance());
        res.setInsuranceProvider(patient.getInsuranceProvider());
        res.setPolicyNumber(patient.getPolicyNumber());
        res.setBloodGroup(patient.getBloodGroup());
        res.setHeight(patient.getHeight());
        res.setWeight(patient.getWeight());
        res.setMedicalConditions(patient.getMedicalConditions());
        res.setAllergies(patient.getAllergies());
        res.setTakingMedicines(patient.getTakingMedicines());
        res.setMedicineName(patient.getMedicineName());
        res.setDosage(patient.getDosage());
        res.setFrequency(patient.getFrequency());
        res.setMedicineTime(patient.getMedicineTime());
        res.setMedicineReason(patient.getMedicineReason());
        res.setMedicineDuration(patient.getMedicineDuration());
        res.setPreviousSurgery(patient.getPreviousSurgery());
        res.setSurgeryName(patient.getSurgeryName());
        res.setSurgeryType(patient.getSurgeryType());
        res.setSurgeryHospital(patient.getSurgeryHospital());
        res.setSurgeonName(patient.getSurgeonName());
        res.setSurgeryDate(patient.getSurgeryDate());
        res.setRecoveryDuration(patient.getRecoveryDuration());
        res.setSurgeryReason(patient.getSurgeryReason());
        res.setCurrentHealthStatus(patient.getCurrentHealthStatus());
        res.setSmoking(patient.getSmoking());
        res.setAlcohol(patient.getAlcohol());
        res.setEmergencyContactName(patient.getEmergencyContactName());
        res.setEmergencyContactNumber(patient.getEmergencyContactNumber());
        res.setEmergencyRelationship(patient.getEmergencyRelationship());
        res.setExistingConditions(patient.getExistingConditions());
        res.setCurrentMedicines(patient.getCurrentMedicines());
        res.setPastMedicalHistory(patient.getPastMedicalHistory());
        return res;
    }

    public List<PatientResponse> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}



