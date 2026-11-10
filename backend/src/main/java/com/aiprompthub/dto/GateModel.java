package com.aiprompthub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class GateModel {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GateConfig {
        @Builder.Default
        private double minQuality = 0.85; // tau_q
        @Builder.Default
        private double regressionTolerance = 0.02; // epsilon
        @Builder.Default
        private double maxSecurityFailRatio = 0.05; // tau_s (5%)
        @Builder.Default
        private int maxAvgTokens = 500; // tau_c
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EvaluationSummary {
        private double qualityScore; // S(v)
        private double correctness;
        private double relevance;
        private double instructionFollowing;
        private double formatScore;
        private int testedCases;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SecuritySummary {
        private double failedProbeRatio; // R_sec(v)
        private int failedProbesCount;
        private int totalProbesCount;
        private String failedProbeName;
        private String reason;
        private String recommendation;
        private boolean promptInjectionPassed;
        private boolean systemLeakagePassed;
        private boolean piiExposurePassed;
        private boolean roleOverridePassed;
        private boolean unsafeContentPassed;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsageSummary {
        private int avgTokens; // C(v)
        private double costPer1kRs;
        private int latencyMs;
        private String modelName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GateDecision {
        private boolean passed;
        private double delta;
        private List<String> reasons;
        private String recommendation;
        private String status;
    }
}
