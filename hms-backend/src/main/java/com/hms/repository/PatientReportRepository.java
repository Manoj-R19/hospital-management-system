package com.hms.repository;

import com.hms.entity.PatientReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PatientReportRepository extends JpaRepository<PatientReport, UUID> {
    List<PatientReport> findByPatientId(UUID patientId);
}
