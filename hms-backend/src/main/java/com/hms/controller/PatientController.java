package com.hms.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.config.CustomUserDetails;
import com.hms.dto.request.SetReminderRequest;
import com.hms.dto.response.PatientResponse;
import com.hms.dto.response.PrescriptionResponse;
import com.hms.dto.response.ReminderResponse;
import com.hms.entity.Appointment;
import com.hms.repository.AppointmentRepository;
import com.hms.service.PatientService;
import com.hms.service.PrescriptionService;
import com.hms.service.ReminderService;
import com.hms.exception.ResourceNotFoundException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patient")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class PatientController {

    private final PatientService patientService;
    private final PrescriptionService prescriptionService;
    private final ReminderService reminderService;
    private final AppointmentRepository appointmentRepository;

    public PatientController(
            PatientService patientService,
            PrescriptionService prescriptionService,
            ReminderService reminderService,
            AppointmentRepository appointmentRepository) {

        this.patientService = patientService;
        this.prescriptionService = prescriptionService;
        this.reminderService = reminderService;
        this.appointmentRepository = appointmentRepository;
    }


    // ==========================================
    // Patient Profile
    // ==========================================

    @GetMapping("/profile")
    public ResponseEntity<PatientResponse> getProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        return ResponseEntity.ok(
                patientService.getPatientByUserId(
                        userDetails.getUser().getId()
                )
        );
    }

    // ==========================================
    // Active Prescriptions
    // ==========================================

    @GetMapping("/prescriptions/active")
    public ResponseEntity<List<PrescriptionResponse>> getActivePrescriptions(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        PatientResponse patient =
                patientService.getPatientByUserId(
                        userDetails.getUser().getId()
                );

        return ResponseEntity.ok(
                prescriptionService.getActivePrescriptionsByPatient(
                        patient.getId()
                )
        );
    }

    // ==========================================
    // Set Reminder
    // ==========================================

    @PostMapping("/reminders")
    public ResponseEntity<ReminderResponse> setReminder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody SetReminderRequest request) {

        return ResponseEntity.ok(
                reminderService.setReminder(
                        userDetails.getUser().getId(),
                        request
                )
        );
    }

    // ==========================================
    // Get Active Reminders
    // ==========================================

    @GetMapping("/reminders")
    public ResponseEntity<List<ReminderResponse>> getActiveReminders(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        return ResponseEntity.ok(
                reminderService.getActiveReminders(
                        userDetails.getUser().getId()
                )
        );
    }

    // ==========================================
    // Today's Reminders
    // ==========================================

    @GetMapping("/reminders/today")
    public ResponseEntity<List<ReminderResponse>> getTodayReminders(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        return ResponseEntity.ok(
                reminderService.getTodayReminders(
                        userDetails.getUser().getId()
                )
        );
    }

    // ==========================================
    // Update Reminder Status
    // ==========================================

    @PatchMapping("/reminders/{id}/status")
    public ResponseEntity<Void> markReminderStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");
        String notes = body.getOrDefault("notes", "");

        reminderService.markReminderStatus(
                id,
                status,
                notes
        );

        return ResponseEntity.ok().build();
    }

    // ==========================================
    // Patient Appointments & Rescheduling
    // ==========================================

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getPatientAppointments(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        PatientResponse patient = patientService.getPatientByUserId(userDetails.getUser().getId());
        return ResponseEntity.ok(appointmentRepository.findByPatientId(patient.getId()));
    }

    @PutMapping("/appointments/{id}/reschedule")
    public ResponseEntity<Appointment> rescheduleAppointment(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        if (body.containsKey("appointmentDate")) {
            appt.setAppointmentDate(LocalDate.parse(body.get("appointmentDate")));
        }
        if (body.containsKey("appointmentTime")) {
            appt.setAppointmentTime(LocalTime.parse(body.get("appointmentTime")));
        }
        appt.setStatus("PENDING"); // Set back to pending for approval
        return ResponseEntity.ok(appointmentRepository.save(appt));
    }
}