package com.hms.repository;

import com.hms.entity.BloodStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BloodStockRepository extends JpaRepository<BloodStock, UUID> {
    Optional<BloodStock> findByBloodGroup(String bloodGroup);
}
