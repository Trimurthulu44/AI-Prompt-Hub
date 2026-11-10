package com.aiprompthub.repository;

import com.aiprompthub.entity.EvaluationRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EvaluationRunRepository extends JpaRepository<EvaluationRun, UUID> {
    List<EvaluationRun> findByPromptVersionIdOrderByCreatedAtDesc(UUID promptVersionId);
    Optional<EvaluationRun> findTopByPromptVersionIdOrderByCreatedAtDesc(UUID promptVersionId);
}
