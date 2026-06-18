package com.hms.repository;

import com.hms.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, UUID> {
    List<Reminder> findByPatientId(UUID patientId);
    List<Reminder> findByPatientIdAndIsActiveTrue(UUID patientId);
    List<Reminder> findByPatientIdAndIsActiveTrueAndStartDateLessThanEqualAndEndDateGreaterThanEqual(UUID patientId, LocalDate date1, LocalDate date2);
}
