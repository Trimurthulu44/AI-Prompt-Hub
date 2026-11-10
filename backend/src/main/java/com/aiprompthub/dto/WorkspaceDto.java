package com.aiprompthub.dto;

import com.aiprompthub.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class WorkspaceDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WorkspaceDetails {
        private UUID organizationId;
        private String organizationName;
        private String workspaceSlug;
        private List<ApplicationItem> applications;
        private List<TeamMemberItem> teamMembers;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplicationItem {
        private UUID id;
        private String name;
        private String environment;
        private String apiKey;
        private String maskedApiKey;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TeamMemberItem {
        private UUID id;
        private String name;
        private String email;
        private Role role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnalyticsPoint {
        private String date;
        private double qualityScore;
        private int avgTokens;
        private double costPer1kRs;
        private int latencyMs;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnalyticsSummary {
        private double currentQualityScore;
        private int currentAvgTokens;
        private double currentCostPer1kRs;
        private int currentLatencyMs;
        private List<AnalyticsPoint> history30Days;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuditLogItem {
        private UUID id;
        private String developer;
        private String action;
        private String details;
        private Instant createdAt;
    }
}
