package com.hms.repository;

import com.hms.entity.BloodDonor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BloodDonorRepository extends JpaRepository<BloodDonor, UUID> {
    Optional<BloodDonor> findByPatientId(UUID patientId);
    List<BloodDonor> findByIsEligibleTrue();
}
