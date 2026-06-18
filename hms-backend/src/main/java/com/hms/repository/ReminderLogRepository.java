package com.hms.repository;

import com.hms.entity.ReminderLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReminderLogRepository extends JpaRepository<ReminderLog, UUID> {
    List<ReminderLog> findByPatientIdOrderByScheduledForDesc(UUID patientId);
    List<ReminderLog> findByReminderIdOrderByScheduledForDesc(UUID reminderId);
}
