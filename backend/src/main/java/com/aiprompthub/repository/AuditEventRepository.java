package com.aiprompthub.repository;

import com.aiprompthub.entity.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, UUID> {
    List<AuditEvent> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);
}
