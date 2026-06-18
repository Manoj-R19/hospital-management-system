package com.hms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dto.request.LoginRequest;
import com.hms.dto.request.PatientRegistrationRequest;
import com.hms.dto.request.AdminRegistrationRequest;
import com.hms.dto.response.AuthResponse;
import com.hms.dto.response.PatientResponse;
import com.hms.dto.response.AdminResponse;
import com.hms.enums.UserRole;
import com.hms.service.AuthService;
import com.hms.service.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {

    private final AuthService authService;
    private final PatientService patientService;

    // @Autowired removed
    public AuthController(
            AuthService authService,
            PatientService patientService) {

        this.authService = authService;
        this.patientService = patientService;
    }

    // ===========================
    // ADMIN LOGIN
    // ===========================

    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> adminLogin(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request, UserRole.ADMIN)
        );
    }

    // ===========================
    // DOCTOR LOGIN
    // ===========================

    @PostMapping("/doctor/login")
    public ResponseEntity<AuthResponse> doctorLogin(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request, UserRole.DOCTOR)
        );
    }

    // ===========================
    // PATIENT LOGIN
    // ===========================

    @PostMapping("/patient/login")
    public ResponseEntity<AuthResponse> patientLogin(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request, UserRole.PATIENT)
        );
    }

    // ===========================
    // PATIENT REGISTER
    // ===========================

    @PostMapping("/patient/register")
    public ResponseEntity<PatientResponse> patientRegister(
            @Valid @RequestBody PatientRegistrationRequest request) {

        return ResponseEntity.ok(
                patientService.registerPatient(request)
        );
    }

    // ===========================
    // ADMIN REGISTER
    // ===========================

    @PostMapping("/admin/register")
    public ResponseEntity<AdminResponse> adminRegister(
            @Valid @RequestBody AdminRegistrationRequest request) {

        return ResponseEntity.ok(
                authService.registerAdmin(request)
        );
    }

}