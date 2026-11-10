package com.aiprompthub.repository;

import com.aiprompthub.entity.UsageMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UsageMetadataRepository extends JpaRepository<UsageMetadata, UUID> {
    List<UsageMetadata> findByOrganizationIdOrderByRecordedAtDesc(UUID organizationId);
}
