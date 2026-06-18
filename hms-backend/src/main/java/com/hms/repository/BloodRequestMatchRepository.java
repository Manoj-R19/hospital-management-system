package com.hms.repository;

import com.hms.entity.BloodRequestMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface BloodRequestMatchRepository extends JpaRepository<BloodRequestMatch, UUID> {
    List<BloodRequestMatch> findByRequestId(UUID requestId);
}
