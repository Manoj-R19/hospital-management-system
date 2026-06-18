package com.hms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.dto.request.DoctorRegistrationRequest;
import com.hms.dto.response.DoctorResponse;
import com.hms.service.DoctorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/doctor-registration")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class DoctorRegistrationController {

    private final DoctorService doctorService;

    public DoctorRegistrationController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping("/register")
    public ResponseEntity<DoctorResponse> registerDoctor(
            @Valid @RequestBody DoctorRegistrationRequest request) {

        DoctorResponse response =
                doctorService.registerDoctor(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

}
