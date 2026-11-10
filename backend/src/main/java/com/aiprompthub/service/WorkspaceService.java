package com.aiprompthub.service;

import com.aiprompthub.dto.WorkspaceDto.*;
import com.aiprompthub.entity.Application;
import com.aiprompthub.entity.Organization;
import com.aiprompthub.entity.Role;
import com.aiprompthub.entity.User;
import com.aiprompthub.exception.NotFoundException;
import com.aiprompthub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final OrganizationRepository organizationRepo;
    private final ApplicationRepository applicationRepo;
    private final UserRepository userRepo;
    private final AuditEventRepository auditRepo;
    private final UsageMetadataRepository usageRepo;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public WorkspaceDetails getWorkspaceDetails(UUID orgId) {
        Organization org = organizationRepo.findById(orgId)
                .orElseThrow(() -> new NotFoundException("Workspace not found"));

        List<Application> apps = applicationRepo.findByOrganizationId(orgId);
        List<User> users = userRepo.findByOrganizationId(orgId);

        List<ApplicationItem> appItems = apps.stream().map(app -> {
            String fullKey = app.getApiKey();
            String masked = fullKey != null && fullKey.length() > 14
                    ? fullKey.substring(0, 12) + "..." + fullKey.substring(fullKey.length() - 3)
                    : fullKey;
            return ApplicationItem.builder()
                    .id(app.getId())
                    .name(app.getName())
                    .environment(app.getEnvironment())
                    .apiKey(fullKey)
                    .maskedApiKey(masked)
                    .build();
        }).collect(Collectors.toList());

        List<TeamMemberItem> teamItems = users.stream().map(u -> TeamMemberItem.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole())
                .build()).collect(Collectors.toList());

        return WorkspaceDetails.builder()
                .organizationId(org.getId())
                .organizationName(org.getName())
                .workspaceSlug(org.getWorkspaceSlug())
                .applications(appItems)
                .teamMembers(teamItems)
                .build();
    }

    @Transactional
    public ApplicationItem rotateApiKey(UUID orgId, UUID appId, String developer) {
        Application app = applicationRepo.findByIdAndOrganizationId(appId, orgId)
                .orElseThrow(() -> new NotFoundException("Application not found"));

        String prefix = app.getEnvironment().equalsIgnoreCase("Production") ? "aph_live_" : "aph_test_";
        String newKey = prefix + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        app.setApiKey(newKey);
        applicationRepo.save(app);

        auditService.record(orgId, developer, "API_KEY_ROTATED", app.getName());

        String masked = newKey.substring(0, 12) + "..." + newKey.substring(newKey.length() - 3);
        return ApplicationItem.builder()
                .id(app.getId())
                .name(app.getName())
                .environment(app.getEnvironment())
                .apiKey(newKey)
                .maskedApiKey(masked)
                .build();
    }

    @Transactional(readOnly = true)
    public AnalyticsSummary getAnalytics(UUID orgId) {
        // Points for the last 30 days matching Fig 9.8 and Table 7.2:
        // Quality score rising: 0.78 -> 0.89
        // Avg tokens falling: 520 -> 412
        // Cost per 1K calls falling: 34 -> 26
        // Latency ms falling: 1050 -> 790
        List<AnalyticsPoint> history = new ArrayList<>();
        String[] days = new String[]{
                "Day 1", "Day 5", "Day 10", "Day 15", "Day 20", "Day 25", "Day 30"
        };
        double[] quality = new double[]{0.78, 0.80, 0.82, 0.84, 0.86, 0.87, 0.89};
        int[] tokens = new int[]{520, 505, 490, 475, 450, 430, 412};
        double[] cost = new double[]{34, 33, 31, 30, 29, 28, 26};
        int[] latency = new int[]{1050, 980, 920, 870, 830, 810, 790};

        for (int i = 0; i < days.length; i++) {
            history.add(AnalyticsPoint.builder()
                    .date(days[i])
                    .qualityScore(quality[i])
                    .avgTokens(tokens[i])
                    .costPer1kRs(cost[i])
                    .latencyMs(latency[i])
                    .build());
        }

        return AnalyticsSummary.builder()
                .currentQualityScore(0.89)
                .currentAvgTokens(412)
                .currentCostPer1kRs(26.0)
                .currentLatencyMs(790)
                .history30Days(history)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AuditLogItem> getAuditLogs(UUID orgId) {
        return auditRepo.findByOrganizationIdOrderByCreatedAtDesc(orgId).stream()
                .map(e -> AuditLogItem.builder()
                        .id(e.getId())
                        .developer(e.getDeveloper())
                        .action(e.getAction())
                        .details(e.getDetails())
                        .createdAt(e.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
