package com.hms.service;

import com.hms.dto.request.SetReminderRequest;
import com.hms.dto.response.ReminderResponse;
import com.hms.entity.Patient;
import com.hms.entity.Prescription;
import com.hms.entity.Reminder;
import com.hms.entity.ReminderLog;
import com.hms.enums.ReminderStatus;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.PatientRepository;
import com.hms.repository.PrescriptionRepository;
import com.hms.repository.ReminderLogRepository;
import com.hms.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final ReminderLogRepository reminderLogRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;

    @Autowired
    public ReminderService(ReminderRepository reminderRepository,
                           ReminderLogRepository reminderLogRepository,
                           PrescriptionRepository prescriptionRepository,
                           PatientRepository patientRepository) {
        this.reminderRepository = reminderRepository;
        this.reminderLogRepository = reminderLogRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public ReminderResponse setReminder(UUID patientUserId, SetReminderRequest request) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Prescription prescription = prescriptionRepository.findById(request.getPrescriptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        Reminder reminder = new Reminder();
        reminder.setPatient(patient);
        reminder.setPrescription(prescription);
        reminder.setMedicineName(request.getMedicineName());
        reminder.setDosage(request.getDosage());
        reminder.setReminderTime(request.getReminderTime());
        reminder.setStartDate(request.getStartDate());
        reminder.setEndDate(request.getEndDate());
        reminder.setIsActive(true);
        reminder = reminderRepository.save(reminder);

        return mapToResponse(reminder);
    }

    public List<ReminderResponse> getActiveReminders(UUID patientUserId) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        return reminderRepository.findByPatientIdAndIsActiveTrue(patient.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ReminderResponse> getTodayReminders(UUID patientUserId) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        
        LocalDate today = LocalDate.now();
        List<Reminder> reminders = reminderRepository
                .findByPatientIdAndIsActiveTrueAndStartDateLessThanEqualAndEndDateGreaterThanEqual(patient.getId(), today, today);
                
        return reminders.stream().map(r -> {
            ReminderResponse res = mapToResponse(r);
            // compute status for today
            res.setStatus(ReminderStatus.PENDING.name()); // default
            // we would check reminder_logs for today to see if taken/skipped
            return res;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void markReminderStatus(UUID reminderId, String statusStr, String notes) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found"));
                
        ReminderStatus status = ReminderStatus.valueOf(statusStr.toUpperCase());
        
        ReminderLog log = new ReminderLog();
        log.setReminder(reminder);
        log.setPatient(reminder.getPatient());
        
        LocalDateTime scheduledFor = LocalDateTime.of(LocalDate.now(), reminder.getReminderTime());
        log.setScheduledFor(scheduledFor);
        log.setStatus(status);
        log.setNotes(notes);
        reminderLogRepository.save(log);
    }

    private ReminderResponse mapToResponse(Reminder reminder) {
        ReminderResponse res = new ReminderResponse();
        res.setId(reminder.getId());
        res.setPrescriptionId(reminder.getPrescription().getId());
        res.setMedicineName(reminder.getMedicineName());
        res.setDosage(reminder.getDosage());
        res.setReminderTime(reminder.getReminderTime());
        res.setStartDate(reminder.getStartDate());
        res.setEndDate(reminder.getEndDate());
        res.setIsActive(reminder.getIsActive());
        return res;
    }
}



