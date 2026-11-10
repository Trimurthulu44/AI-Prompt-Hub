package com.aiprompthub.repository;

import com.aiprompthub.entity.GateDecisionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GateDecisionRepository extends JpaRepository<GateDecisionEntity, UUID> {
    List<GateDecisionEntity> findByPromptVersionIdOrderByCheckedAtDesc(UUID promptVersionId);
    Optional<GateDecisionEntity> findTopByPromptVersionIdOrderByCheckedAtDesc(UUID promptVersionId);
}
