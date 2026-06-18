package com.hms.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.entity.Encounter;

public interface EncounterRepository extends JpaRepository<Encounter, UUID> {

    List<Encounter> findByPatientIdOrderByVisitDatetimeDesc(UUID patientId);

    List<Encounter> findByDoctorIdOrderByVisitDatetimeDesc(UUID doctorId);

    long countByVisitDatetimeBetween(LocalDateTime start, LocalDateTime end);

}