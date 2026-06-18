package com.hms.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.entity.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, UUID> {

    Optional<Doctor> findByEmail(String email);
    Optional<Doctor> findByUserId(UUID userId);

    boolean existsByEmail(String email);

    boolean existsByGovtRegNumber(String govtRegNumber);

}