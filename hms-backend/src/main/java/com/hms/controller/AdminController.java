package com.hms.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.dto.request.DoctorRegistrationRequest;
import com.hms.dto.response.DoctorResponse;
import com.hms.dto.response.AdminResponse;
import com.hms.dto.response.PatientResponse;
import com.hms.dto.response.AdminDashboardStatsResponse;
import com.hms.entity.Appointment;
import com.hms.entity.Invoice;
import com.hms.entity.Doctor;
import com.hms.entity.Patient;
import com.hms.entity.User;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.InvoiceRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.UserRepository;
import com.hms.service.DoctorService;
import com.hms.service.AdminService;
import com.hms.service.PatientService;
import com.hms.exception.ResourceNotFoundException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AdminController {

    private final DoctorService doctorService;
    private final AdminService adminService;
    private final PatientService patientService;
    private final AppointmentRepository appointmentRepository;
    private final InvoiceRepository invoiceRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public AdminController(DoctorService doctorService,
                           AdminService adminService,
                           PatientService patientService,
                           AppointmentRepository appointmentRepository,
                           InvoiceRepository invoiceRepository,
                           DoctorRepository doctorRepository,
                           PatientRepository patientRepository,
                           UserRepository userRepository) {
        this.doctorService = doctorService;
        this.adminService = adminService;
        this.patientService = patientService;
        this.appointmentRepository = appointmentRepository;
        this.invoiceRepository = invoiceRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // Doctors Management
    // ==========================================

    @PostMapping("/doctors/register")
    public ResponseEntity<DoctorResponse> registerDoctor(@Valid @RequestBody DoctorRegistrationRequest request) {
        return ResponseEntity.ok(doctorService.registerDoctor(request));
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<DoctorResponse> getDoctorById(@PathVariable UUID id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @PutMapping("/doctors/{id}/verify")
    public ResponseEntity<Void> verifyDoctor(@PathVariable UUID id) {
        doctorService.verifyDoctor(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/doctors/{id}/blacklist")
    public ResponseEntity<Void> toggleDoctorBlacklist(@PathVariable UUID id, @RequestBody Map<String, Boolean> body) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        User user = doctor.getUser();
        
        Boolean blacklist = body.getOrDefault("blacklist", false);
        user.setIsActive(!blacklist); // active = false means blacklisted/blocked
        userRepository.save(user);
        
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Void> removeDoctor(@PathVariable UUID id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<DoctorResponse> updateDoctor(@PathVariable UUID id, @RequestBody Map<String, Object> updates) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        
        if (updates.containsKey("fullName")) {
            doctor.setFullName((String) updates.get("fullName"));
        }
        if (updates.containsKey("email")) {
            doctor.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("phoneNumber")) {
            doctor.setPhoneNumber((String) updates.get("phoneNumber"));
        }
        if (updates.containsKey("qualification")) {
            doctor.setQualification((String) updates.get("qualification"));
        }
        if (updates.containsKey("specialization")) {
            doctor.setSpecialization((String) updates.get("specialization"));
        }
        if (updates.containsKey("hospitalName")) {
            doctor.setHospitalName((String) updates.get("hospitalName"));
        }
        if (updates.containsKey("hospitalAddress")) {
            doctor.setHospitalAddress((String) updates.get("hospitalAddress"));
        }
        if (updates.containsKey("hospitalOpeningTime") && updates.get("hospitalOpeningTime") != null) {
            doctor.setHospitalOpeningTime(LocalTime.parse((String) updates.get("hospitalOpeningTime")));
        }
        if (updates.containsKey("hospitalClosingTime") && updates.get("hospitalClosingTime") != null) {
            doctor.setHospitalClosingTime(LocalTime.parse((String) updates.get("hospitalClosingTime")));
        }
        if (updates.containsKey("hospitalFacilities")) {
            doctor.setHospitalFacilities((List<String>) updates.get("hospitalFacilities"));
        }
        
        doctorRepository.save(doctor);
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    // ==========================================
    // Patients Management
    // ==========================================

    @GetMapping("/patients")
    public ResponseEntity<List<PatientResponse>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<PatientResponse> updatePatient(@PathVariable UUID id, @RequestBody Map<String, Object> updates) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        
        if (updates.containsKey("fullName")) {
            patient.setFullName((String) updates.get("fullName"));
        }
        if (updates.containsKey("email")) {
            patient.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("phoneNumber")) {
            patient.setPhoneNumber((String) updates.get("phoneNumber"));
        }
        if (updates.containsKey("age")) {
            patient.setAge((Integer) updates.get("age"));
        }
        if (updates.containsKey("gender")) {
            patient.setGender((String) updates.get("gender"));
        }
        if (updates.containsKey("address")) {
            patient.setAddress((String) updates.get("address"));
        }
        
        patientRepository.save(patient);
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping("/patients/{aadhaar}/history")
    public ResponseEntity<com.hms.dto.response.PatientHistoryResponse> getPatientHistory(@PathVariable String aadhaar) {
        return ResponseEntity.ok(patientService.getPatientHistory(aadhaar));
    }

    // ==========================================
    // Appointments Management
    // ==========================================

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @PostMapping("/appointments")
    public ResponseEntity<Appointment> createAppointment(@RequestBody Map<String, String> body) {
        UUID patientId = UUID.fromString(body.get("patientId"));
        UUID doctorId = UUID.fromString(body.get("doctorId"));
        LocalDate date = LocalDate.parse(body.get("appointmentDate"));
        LocalTime time = LocalTime.parse(body.get("appointmentTime"));
        String reason = body.getOrDefault("reason", "");

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Appointment appt = new Appointment();
        appt.setPatient(patient);
        appt.setDoctor(doctor);
        appt.setAppointmentDate(date);
        appt.setAppointmentTime(time);
        appt.setReason(reason);
        appt.setStatus("PENDING");

        return ResponseEntity.ok(appointmentRepository.save(appt));
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        
        if (body.containsKey("status")) {
            appt.setStatus(body.get("status"));
        }
        if (body.containsKey("appointmentDate")) {
            appt.setAppointmentDate(LocalDate.parse(body.get("appointmentDate")));
        }
        if (body.containsKey("appointmentTime")) {
            appt.setAppointmentTime(LocalTime.parse(body.get("appointmentTime")));
        }

        return ResponseEntity.ok(appointmentRepository.save(appt));
    }

    // ==========================================
    // Billing Management
    // ==========================================

    @GetMapping("/billing")
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceRepository.findAll());
    }

    @PostMapping("/billing")
    public ResponseEntity<Invoice> createInvoice(@RequestBody Map<String, Object> body) {
        UUID patientId = UUID.fromString((String) body.get("patientId"));
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        BigDecimal dueAmount = new BigDecimal(body.get("dueAmount").toString());
        String status = (String) body.getOrDefault("paymentStatus", "UNPAID");
        LocalDate date = LocalDate.now();

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Invoice invoice = new Invoice();
        invoice.setPatient(patient);
        invoice.setAmount(amount);
        invoice.setDueAmount(dueAmount);
        invoice.setPaymentStatus(status);
        invoice.setBillingDate(date);
        invoice.setInvoiceNumber("INV-" + System.currentTimeMillis() % 10000000L);

        return ResponseEntity.ok(invoiceRepository.save(invoice));
    }

    // ==========================================
    // Admin Profile & Overview Stats
    // ==========================================

    @GetMapping("/profile/{id}")
    public ResponseEntity<AdminResponse> getAdminById(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.getAdminById(id));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminDashboardStatsResponse> getDashboardStats() {
        long totalDocs = doctorRepository.count();
        long totalPats = patientRepository.count();
        long totalAppts = appointmentRepository.count();
        long pendingReqs = doctorRepository.findAll().stream().filter(d -> !Boolean.TRUE.equals(d.getIsVerified())).count();
        
        // Sum invoices where status is PAID (or compute total amount)
        BigDecimal totalRevenue = invoiceRepository.findAll().stream()
                .filter(i -> "PAID".equalsIgnoreCase(i.getPaymentStatus()))
                .map(Invoice::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Count appointments scheduled for today
        LocalDate today = LocalDate.now();
        long todayAct = appointmentRepository.findAll().stream()
                .filter(a -> today.equals(a.getAppointmentDate()))
                .count();

        return ResponseEntity.ok(new AdminDashboardStatsResponse(
                totalDocs,
                totalPats,
                totalAppts,
                totalRevenue,
                pendingReqs,
                todayAct
        ));
    }
}



