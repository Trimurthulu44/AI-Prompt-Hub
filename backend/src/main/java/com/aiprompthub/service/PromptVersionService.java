package com.aiprompthub.service;

import com.aiprompthub.dto.PromptDto.CreateVersionRequest;
import com.aiprompthub.entity.Prompt;
import com.aiprompthub.entity.PromptVersion;
import com.aiprompthub.entity.VersionStatus;
import com.aiprompthub.exception.NotFoundException;
import com.aiprompthub.repository.PromptRepository;
import com.aiprompthub.repository.PromptVersionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PromptVersionService {

    private final PromptRepository promptRepo;
    private final PromptVersionRepository versionRepo;
    private final AuditService auditService;

    @Transactional
    public PromptVersion createVersion(UUID orgId, UUID promptId,
                                       CreateVersionRequest req, String developer) {
        // Tenant-scoped lookup: a prompt from another organization is never visible
        Prompt prompt = promptRepo.findByIdAndOrganizationId(promptId, orgId)
                .orElseThrow(() -> new NotFoundException("Prompt not found"));
        int next = versionRepo.findMaxVersionNo(promptId).orElse(0) + 1;

        PromptVersion v = new PromptVersion();
        v.setPrompt(prompt);
        v.setVersionNo(next); // v1, v2, v3 ...
        v.setContent(req.getContent());
        v.setChangeInstruction(req.getChangeInstruction());
        v.setCreatedBy(developer);
        v.setCreatedAt(Instant.now());
        v.setStatus(VersionStatus.SUBMITTED);

        PromptVersion saved = versionRepo.save(v);
        auditService.record(orgId, developer, "VERSION_CREATED", promptId + ":v" + next);
        return saved;
    }

    @Transactional
    public PromptVersion rollback(UUID orgId, UUID promptId, int versionNo,
                                  String developer) {
        PromptVersion target = versionRepo
                .findByPromptIdAndVersionNoAndOrganizationId(promptId, versionNo, orgId)
                .orElseThrow(() -> new NotFoundException("Version not found"));

        target.setStatus(VersionStatus.APPROVED); // re-activate, never overwrite
        auditService.record(orgId, developer, "VERSION_ROLLBACK", promptId + ":v" + versionNo);
        return target;
    }

    @Transactional(readOnly = true)
    public List<PromptVersion> getVersions(UUID promptId, UUID orgId) {
        promptRepo.findByIdAndOrganizationId(promptId, orgId)
                .orElseThrow(() -> new NotFoundException("Prompt not found"));
        return versionRepo.findByPromptIdOrderByVersionNoDesc(promptId);
    }

    @Transactional(readOnly = true)
    public PromptVersion getVersion(UUID versionId) {
        return versionRepo.findById(versionId)
                .orElseThrow(() -> new NotFoundException("Version not found"));
    }
}
