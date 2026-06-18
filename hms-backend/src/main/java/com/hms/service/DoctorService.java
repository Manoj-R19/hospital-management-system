package com.hms.service;

import com.hms.dto.request.DoctorRegistrationRequest;
import com.hms.dto.response.DoctorResponse;
import com.hms.entity.Doctor;
import com.hms.entity.User;
import com.hms.enums.UserRole;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.DoctorRepository;
import com.hms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DoctorService(
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public DoctorResponse registerDoctor(DoctorRegistrationRequest request) {

        // ===============================
        // Validation
        // ===============================

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        if (userRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            throw new IllegalArgumentException("Phone Number already exists");
        }

        if (doctorRepository.existsByGovtRegNumber(request.getGovtRegNumber())) {
            throw new IllegalArgumentException("Government Registration Number already exists");
        }

        // ===============================
        // Create User
        // ===============================

        User user = new User();

        user.setEmail(request.getEmail());

        user.setPhoneNumber(request.getPhoneNumber());

        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(UserRole.DOCTOR);

        user = userRepository.save(user);

        // ===============================
        // Create Doctor
        // ===============================

        Doctor doctor = new Doctor();

        doctor.setUser(user);

        doctor.setFullName(request.getFullName());

        doctor.setEmail(request.getEmail());

        doctor.setPhoneNumber(request.getPhoneNumber());

        doctor.setQualification(request.getQualification());

        doctor.setSpecialization(request.getSpecialization());

        doctor.setGovtRegNumber(request.getGovtRegNumber());

        doctor.setHospitalName(request.getHospitalName());

        doctor.setHospitalAddress(request.getHospitalAddress());

        doctor.setHospitalOpeningTime(
                request.getHospitalOpeningTime()
        );

        doctor.setHospitalClosingTime(
                request.getHospitalClosingTime()
        );

        doctor.setHospitalFacilities(
                request.getHospitalFacilities()
        );

        doctor.setCertificateFilePath(
                request.getCertificateFilePath()
        );

        doctor.setIsVerified(false);

        doctor = doctorRepository.save(doctor);

        return mapToResponse(doctor);
    }
        // ============================================
    // Get All Doctors
    // ============================================

    public List<DoctorResponse> getAllDoctors() {

        return doctorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }

    // ============================================
    // Get Doctor By ID
    // ============================================

    public DoctorResponse getDoctorById(UUID id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found with ID : " + id));

        return mapToResponse(doctor);

    }

    // ============================================
    // Get Doctor By User ID
    // ============================================

    public DoctorResponse getDoctorByUserId(UUID userId) {
        Doctor doctor = doctorRepository.findByUserId(userId).orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found for User ID : " + userId));

        return mapToResponse(doctor);

    }

    // ============================================
    // Verify Doctor
    // ============================================

    @Transactional
    public DoctorResponse verifyDoctor(UUID doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        doctor.setIsVerified(true);

        doctorRepository.save(doctor);

        return mapToResponse(doctor);

    }

    // ============================================
    // Delete Doctor
    // ============================================

    @Transactional
    public void deleteDoctor(UUID doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Doctor not found"));

        doctorRepository.delete(doctor);

    }

    // ============================================
    // Get Verified Doctors
    // ============================================

    public List<DoctorResponse> getVerifiedDoctors() {

        return doctorRepository.findAll()
                .stream()
                .filter(doctor -> Boolean.TRUE.equals(doctor.getIsVerified()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }
        // ============================================
    // Convert Entity to Response DTO
    // ============================================

    private DoctorResponse mapToResponse(Doctor doctor) {

        DoctorResponse response = new DoctorResponse();

        response.setId(doctor.getId());

        response.setFullName(doctor.getFullName());

        response.setEmail(doctor.getEmail());

        response.setPhoneNumber(doctor.getPhoneNumber());

        response.setQualification(doctor.getQualification());

        response.setSpecialization(doctor.getSpecialization());

        response.setGovtRegNumber(doctor.getGovtRegNumber());

        response.setHospitalName(doctor.getHospitalName());

        response.setHospitalAddress(doctor.getHospitalAddress());

        response.setHospitalOpeningTime(
                doctor.getHospitalOpeningTime()
        );

        response.setHospitalClosingTime(
                doctor.getHospitalClosingTime()
        );

        response.setHospitalFacilities(
                doctor.getHospitalFacilities()
        );

        response.setCertificateFilePath(
                doctor.getCertificateFilePath()
        );

        response.setIsVerified(
                doctor.getIsVerified()
        );

        response.setIsActive(
                doctor.getUser() != null ? doctor.getUser().getIsActive() : true
        );

        response.setCreatedAt(
                doctor.getCreatedAt()
        );

        response.setUpdatedAt(
                doctor.getUpdatedAt()
        );

        return response;
    }

}