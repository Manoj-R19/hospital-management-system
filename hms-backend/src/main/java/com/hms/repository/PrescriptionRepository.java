package com.hms.repository;

import com.hms.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {
    List<Prescription> findByEncounterId(UUID encounterId);
    List<Prescription> findByPatientId(UUID patientId);
    List<Prescription> findByPatientIdAndIsActiveTrue(UUID patientId);
}
