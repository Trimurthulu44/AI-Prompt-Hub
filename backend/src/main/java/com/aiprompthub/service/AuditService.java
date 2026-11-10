package com.aiprompthub.service;

import com.aiprompthub.entity.AuditEvent;
import com.aiprompthub.entity.Organization;
import com.aiprompthub.repository.AuditEventRepository;
import com.aiprompthub.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditEventRepository auditEventRepository;
    private final OrganizationRepository organizationRepository;

    @Transactional
    public void record(UUID orgId, String developer, String action, String details) {
        Organization org = organizationRepository.findById(orgId).orElse(null);
        if (org == null) return;

        AuditEvent event = AuditEvent.builder()
                .organization(org)
                .developer(developer != null ? developer : "system")
                .action(action)
                .details(details)
                .createdAt(Instant.now())
                .build();

        auditEventRepository.save(event);
    }
}
