package com.aiprompthub.dto;

import com.aiprompthub.entity.VersionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class PromptDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreatePromptRequest {
        private String name;
        private String description;
        private UUID projectId;
        private UUID applicationId;
        private String initialContent;
        private String changeInstruction;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateVersionRequest {
        private String content;
        private String changeInstruction;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RollbackRequest {
        private Integer targetVersionNo;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PromptResponse {
        private UUID id;
        private String name;
        private String description;
        private UUID projectId;
        private String projectName;
        private UUID applicationId;
        private String applicationName;
        private String environment;
        private Integer latestVersionNo;
        private VersionStatus latestStatus;
        private Instant createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PromptVersionResponse {
        private UUID id;
        private UUID promptId;
        private Integer versionNo;
        private String content;
        private String changeInstruction;
        private String createdBy;
        private Instant createdAt;
        private VersionStatus status;
        private Double qualityScore;
        private Double regressionDelta;
        private String gateDecision;
        private Integer tokens;
        private Double costRs;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PromptAnalysisResponse {
        private boolean hasAmbiguity;
        private List<String> ambiguityFlags;
        private boolean hasMissingInstructions;
        private List<String> missingInstructionFlags;
        private boolean hasFormatIssues;
        private List<String> formatIssueFlags;
        private boolean hasSecurityRisks;
        private List<String> securityRisks;
        private List<String> improvementSuggestions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PromptOptimizeResponse {
        private String originalContent;
        private String optimizedContent;
        private List<String> improvementsApplied;
        private double estimatedTokenSavingsPercent;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SemanticSearchResultDTO {
        private UUID promptId;
        private String promptName;
        private Integer versionNo;
        private double similarity;
        private String matchLevel; // "Likely duplicate", "Related", "Versions", "Unrelated"
        private String actionPillColor; // red, orange, yellow, gray
    }
}
