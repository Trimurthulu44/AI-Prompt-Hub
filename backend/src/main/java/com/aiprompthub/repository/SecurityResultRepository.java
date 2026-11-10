package com.aiprompthub.repository;

import com.aiprompthub.entity.SecurityResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SecurityResultRepository extends JpaRepository<SecurityResult, UUID> {
    List<SecurityResult> findByPromptVersionIdOrderByCreatedAtDesc(UUID promptVersionId);
    Optional<SecurityResult> findTopByPromptVersionIdOrderByCreatedAtDesc(UUID promptVersionId);
}
