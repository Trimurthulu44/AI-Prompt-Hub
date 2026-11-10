package com.aiprompthub.service;

import com.aiprompthub.dto.PromptDto.CreateVersionRequest;
import com.aiprompthub.entity.Organization;
import com.aiprompthub.entity.Prompt;
import com.aiprompthub.entity.PromptVersion;
import com.aiprompthub.entity.VersionStatus;
import com.aiprompthub.exception.NotFoundException;
import com.aiprompthub.repository.PromptRepository;
import com.aiprompthub.repository.PromptVersionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class PromptVersionServiceTest {

    private PromptVersionService versionService;
    private Map<UUID, Prompt> promptStore;
    private List<PromptVersion> versionStore;
    private List<String> auditLogs;

    private UUID orgId;
    private UUID promptId;
    private Prompt prompt;

    @BeforeEach
    void setUp() {
        promptStore = new HashMap<>();
        versionStore = new ArrayList<>();
        auditLogs = new ArrayList<>();

        orgId = UUID.randomUUID();
        promptId = UUID.randomUUID();
        Organization org = Organization.builder().id(orgId).name("Acme Corp").build();
        prompt = Prompt.builder().id(promptId).organization(org).name("customer-support-system").build();
        promptStore.put(promptId, prompt);

        // Simple dynamic proxy for PromptRepository
        PromptRepository promptRepo = (PromptRepository) Proxy.newProxyInstance(
                getClass().getClassLoader(),
                new Class<?>[]{PromptRepository.class},
                (proxy, method, args) -> {
                    if ("findByIdAndOrganizationId".equals(method.getName())) {
                        UUID pid = (UUID) args[0];
                        UUID oid = (UUID) args[1];
                        Prompt p = promptStore.get(pid);
                        if (p != null && p.getOrganization().getId().equals(oid)) {
                            return Optional.of(p);
                        }
                        return Optional.empty();
                    }
                    return null;
                }
        );

        // Simple dynamic proxy for PromptVersionRepository
        PromptVersionRepository versionRepo = (PromptVersionRepository) Proxy.newProxyInstance(
                getClass().getClassLoader(),
                new Class<?>[]{PromptVersionRepository.class},
                (proxy, method, args) -> {
                    if ("findMaxVersionNo".equals(method.getName())) {
                        return versionStore.stream().map(PromptVersion::getVersionNo).max(Integer::compareTo);
                    }
                    if ("save".equals(method.getName())) {
                        PromptVersion v = (PromptVersion) args[0];
                        if (v.getId() == null) v.setId(UUID.randomUUID());
                        versionStore.add(v);
                        return v;
                    }
                    if ("findByPromptIdAndVersionNoAndOrganizationId".equals(method.getName())) {
                        UUID pid = (UUID) args[0];
                        Integer vno = (Integer) args[1];
                        UUID oid = (UUID) args[2];
                        return versionStore.stream()
                                .filter(v -> v.getPrompt().getId().equals(pid)
                                        && v.getVersionNo().equals(vno)
                                        && v.getPrompt().getOrganization().getId().equals(oid))
                                .findFirst();
                    }
                    return null;
                }
        );

        // Stub audit service
        AuditService auditService = new AuditService(null, null) {
            @Override
            public void record(UUID oId, String developer, String action, String details) {
                auditLogs.add(action + ":" + details);
            }
        };

        versionService = new PromptVersionService(promptRepo, versionRepo, auditService);
    }

    @Test
    @DisplayName("Should create next version v2 when v1 exists and record audit log")
    void testCreateNextVersion() {
        // Given v1 exists
        versionStore.add(PromptVersion.builder().prompt(prompt).versionNo(1).build());

        CreateVersionRequest req = CreateVersionRequest.builder()
                .content("Updated content")
                .changeInstruction("Add JSON output")
                .build();

        PromptVersion created = versionService.createVersion(orgId, promptId, req, "priya@acme-corp.com");

        assertNotNull(created);
        assertEquals(2, created.getVersionNo());
        assertEquals(VersionStatus.SUBMITTED, created.getStatus());
        assertEquals("Updated content", created.getContent());
        assertTrue(auditLogs.stream().anyMatch(log -> log.contains("VERSION_CREATED")));
    }

    @Test
    @DisplayName("Should rollback to earlier version by re-activating without overwriting history")
    void testRollbackReactivation() {
        PromptVersion v1 = PromptVersion.builder()
                .id(UUID.randomUUID())
                .prompt(prompt)
                .versionNo(1)
                .content("Initial prompt")
                .status(VersionStatus.ROLLED_BACK)
                .createdAt(Instant.now())
                .build();
        versionStore.add(v1);

        PromptVersion rolledBack = versionService.rollback(orgId, promptId, 1, "ravi@acme-corp.com");

        assertEquals(VersionStatus.APPROVED, rolledBack.getStatus());
        assertEquals(1, rolledBack.getVersionNo());
        assertTrue(auditLogs.stream().anyMatch(log -> log.contains("VERSION_ROLLBACK")));
    }

    @Test
    @DisplayName("Should reject cross-tenant prompt access")
    void testTenantIsolationCrossTenantRejected() {
        UUID otherOrgId = UUID.randomUUID();
        CreateVersionRequest req = CreateVersionRequest.builder().content("Hacked").build();

        assertThrows(NotFoundException.class, () ->
                versionService.createVersion(otherOrgId, promptId, req, "attacker@other.com"));
    }
}
