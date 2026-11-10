package com.aiprompthub.service;

import com.aiprompthub.dto.GateModel.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class QualityGateServiceTest {

    private QualityGateService qualityGateService;
    private GateConfig config;

    @BeforeEach
    void setUp() {
        qualityGateService = new QualityGateService();
        config = GateConfig.builder()
                .minQuality(0.85)
                .regressionTolerance(0.02)
                .maxSecurityFailRatio(0.05)
                .maxAvgTokens(500)
                .build();
    }

    @Test
    @DisplayName("Should block deployment when a security probe fails (Table 7.1 sample v4)")
    void testGateBlocksOnSecurityProbeFailure() {
        EvaluationSummary current = EvaluationSummary.builder().qualityScore(0.89).build();
        EvaluationSummary baseline = EvaluationSummary.builder().qualityScore(0.86).build(); // delta = +0.03
        SecuritySummary security = SecuritySummary.builder()
                .failedProbeRatio(0.05)
                .failedProbesCount(1)
                .totalProbesCount(20)
                .failedProbeName("role override")
                .recommendation("Action: Add explicit role boundary instruction in prompt v5")
                .build();
        UsageSummary usage = UsageSummary.builder().avgTokens(412).build();

        GateDecision decision = qualityGateService.evaluate(config, current, baseline, security, usage);

        assertFalse(decision.isPassed(), "Gate should block deployment");
        assertEquals("BLOCKED", decision.getStatus());
        assertEquals(0.03, Math.round(decision.getDelta() * 100.0) / 100.0);
        assertTrue(decision.getReasons().stream().anyMatch(r -> r.contains("role override")));
    }

    @Test
    @DisplayName("Should pass deployment when all quality, regression, security and token thresholds hold (Table 7.2 v3)")
    void testGatePassesWhenAllConditionsMet() {
        EvaluationSummary current = EvaluationSummary.builder().qualityScore(0.87).build();
        EvaluationSummary baseline = EvaluationSummary.builder().qualityScore(0.82).build(); // delta = +0.05
        SecuritySummary security = SecuritySummary.builder()
                .failedProbeRatio(0.0)
                .failedProbesCount(0)
                .totalProbesCount(20)
                .build();
        UsageSummary usage = UsageSummary.builder().avgTokens(450).build();

        GateDecision decision = qualityGateService.evaluate(config, current, baseline, security, usage);

        assertTrue(decision.isPassed(), "Gate should allow deployment");
        assertEquals("APPROVED", decision.getStatus());
        assertTrue(decision.getReasons().isEmpty());
    }

    @Test
    @DisplayName("Should block deployment when quality score is below threshold")
    void testGateBlocksOnLowQuality() {
        EvaluationSummary current = EvaluationSummary.builder().qualityScore(0.82).build(); // < 0.85
        EvaluationSummary baseline = EvaluationSummary.builder().qualityScore(0.78).build();
        SecuritySummary security = SecuritySummary.builder().failedProbesCount(0).build();
        UsageSummary usage = UsageSummary.builder().avgTokens(490).build();

        GateDecision decision = qualityGateService.evaluate(config, current, baseline, security, usage);

        assertFalse(decision.isPassed());
        assertTrue(decision.getReasons().stream().anyMatch(r -> r.contains("below threshold")));
    }
}
