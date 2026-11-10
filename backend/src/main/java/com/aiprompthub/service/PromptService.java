package com.aiprompthub.service;

import com.aiprompthub.dto.PromptDto.*;
import com.aiprompthub.entity.*;
import com.aiprompthub.exception.NotFoundException;
import com.aiprompthub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PromptService {

    private final PromptRepository promptRepository;
    private final PromptVersionRepository versionRepository;
    private final ProjectRepository projectRepository;
    private final ApplicationRepository applicationRepository;
    private final OrganizationRepository organizationRepository;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<PromptResponse> getPrompts(UUID orgId) {
        List<Prompt> list = promptRepository.findByOrganizationId(orgId);
        List<PromptResponse> responses = new ArrayList<>();
        for (Prompt p : list) {
            List<PromptVersion> versions = versionRepository.findByPromptIdOrderByVersionNoDesc(p.getId());
            Integer latestVersionNo = versions.isEmpty() ? 0 : versions.get(0).getVersionNo();
            VersionStatus latestStatus = versions.isEmpty() ? VersionStatus.DRAFT : versions.get(0).getStatus();

            responses.add(PromptResponse.builder()
                    .id(p.getId())
                    .name(p.getName())
                    .description(p.getDescription())
                    .projectId(p.getProject() != null ? p.getProject().getId() : null)
                    .projectName(p.getProject() != null ? p.getProject().getName() : "")
                    .applicationId(p.getApplication() != null ? p.getApplication().getId() : null)
                    .applicationName(p.getApplication() != null ? p.getApplication().getName() : "")
                    .environment(p.getApplication() != null ? p.getApplication().getEnvironment() : "Production")
                    .latestVersionNo(latestVersionNo)
                    .latestStatus(latestStatus)
                    .createdAt(p.getCreatedAt())
                    .build());
        }
        return responses;
    }

    @Transactional(readOnly = true)
    public PromptResponse getPrompt(UUID promptId, UUID orgId) {
        Prompt p = promptRepository.findByIdAndOrganizationId(promptId, orgId)
                .orElseThrow(() -> new NotFoundException("Prompt not found"));

        List<PromptVersion> versions = versionRepository.findByPromptIdOrderByVersionNoDesc(p.getId());
        Integer latestVersionNo = versions.isEmpty() ? 0 : versions.get(0).getVersionNo();
        VersionStatus latestStatus = versions.isEmpty() ? VersionStatus.DRAFT : versions.get(0).getStatus();

        return PromptResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .projectId(p.getProject() != null ? p.getProject().getId() : null)
                .projectName(p.getProject() != null ? p.getProject().getName() : "")
                .applicationId(p.getApplication() != null ? p.getApplication().getId() : null)
                .applicationName(p.getApplication() != null ? p.getApplication().getName() : "")
                .environment(p.getApplication() != null ? p.getApplication().getEnvironment() : "Production")
                .latestVersionNo(latestVersionNo)
                .latestStatus(latestStatus)
                .createdAt(p.getCreatedAt())
                .build();
    }

    @Transactional
    public PromptResponse createPrompt(UUID orgId, CreatePromptRequest req, String developer) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new NotFoundException("Organization not found"));

        Project project = null;
        if (req.getProjectId() != null) {
            project = projectRepository.findByIdAndOrganizationId(req.getProjectId(), orgId).orElse(null);
        }
        if (project == null) {
            List<Project> projects = projectRepository.findByOrganizationId(orgId);
            if (!projects.isEmpty()) project = projects.get(0);
        }

        Application application = null;
        if (req.getApplicationId() != null) {
            application = applicationRepository.findByIdAndOrganizationId(req.getApplicationId(), orgId).orElse(null);
        }
        if (application == null) {
            List<Application> apps = applicationRepository.findByOrganizationId(orgId);
            if (!apps.isEmpty()) application = apps.get(0);
        }

        Prompt prompt = Prompt.builder()
                .organization(org)
                .project(project)
                .application(application)
                .name(req.getName())
                .description(req.getDescription())
                .createdAt(Instant.now())
                .build();
        Prompt saved = promptRepository.save(prompt);

        // Create initial v1
        String content = req.getInitialContent() != null ? req.getInitialContent() : "You are an AI assistant.";
        PromptVersion v1 = PromptVersion.builder()
                .prompt(saved)
                .versionNo(1)
                .content(content)
                .changeInstruction(req.getChangeInstruction() != null ? req.getChangeInstruction() : "Initial prompt")
                .createdBy(developer)
                .createdAt(Instant.now())
                .status(VersionStatus.SUBMITTED)
                .build();
        versionRepository.save(v1);

        auditService.record(orgId, developer, "PROMPT_CREATED", saved.getName() + " (v1)");

        return getPrompt(saved.getId(), orgId);
    }
}
