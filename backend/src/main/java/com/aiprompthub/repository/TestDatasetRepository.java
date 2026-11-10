package com.aiprompthub.repository;

import com.aiprompthub.entity.TestDataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TestDatasetRepository extends JpaRepository<TestDataset, UUID> {
    List<TestDataset> findByOrganizationId(UUID organizationId);
    Optional<TestDataset> findByIdAndOrganizationId(UUID id, UUID organizationId);
    Optional<TestDataset> findByPromptId(UUID promptId);
}
