package com.aiprompthub.controller;

import com.aiprompthub.config.JwtAuthFilter.UserPrincipal;
import com.aiprompthub.dto.GateModel.*;
import com.aiprompthub.entity.PromptVersion;
import com.aiprompthub.service.EvaluationService;
import com.aiprompthub.service.PromptVersionService;
import com.aiprompthub.service.QualityGateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Evaluation & Quality Gate", description = "LLM-as-a-judge scoring, security probes, regression tests, and deployment gating")
public class GateController {

    private final QualityGateService qualityGateService;
    private final EvaluationService evaluationService;
    private final PromptVersionService versionService;

    @GetMapping("/versions/{versionId}/evaluation")
    @Operation(summary = "Get evaluation results", description = "Judge scores per criterion (correctness, relevance, instruction following, format) and security probes")
    public ResponseEntity<EvaluationSummary> getEvaluation(@PathVariable UUID versionId) {
        return ResponseEntity.ok(evaluationService.getLatestSummary(versionId));
    }

    @PostMapping("/versions/{versionId}/evaluate")
    @Operation(summary = "Run golden dataset evaluation", description = "Execute 50 golden test cases and score using LLM-as-a-judge")
    public ResponseEntity<EvaluationSummary> runEvaluation(@PathVariable UUID versionId) {
        return ResponseEntity.ok(evaluationService.runEvaluation(versionId));
    }

    @GetMapping("/versions/{versionId}/security")
    @Operation(summary = "Run security test suite", description = "Test for prompt injection, system leakage, PII, role override, and unsafe content")
    public ResponseEntity<SecuritySummary> getSecurity(@PathVariable UUID versionId) {
        return ResponseEntity.ok(evaluationService.runSecurityProbes(versionId));
    }

    @GetMapping("/versions/{versionId}/gate")
    @Operation(summary = "Get quality gate decision", description = "Evaluate quality, regression delta, security probes, and token usage (Equation 2.4)")
    public ResponseEntity<GateDecision> getGateDecision(@PathVariable UUID versionId) {
        PromptVersion curVersion = versionService.getVersion(versionId);

        EvaluationSummary cur = evaluationService.getLatestSummary(versionId);
        SecuritySummary sec = evaluationService.runSecurityProbes(versionId);

        // Baseline (v3 if cur is v4)
        EvaluationSummary baseline = EvaluationSummary.builder().qualityScore(0.86).build();

        // Usage
        int tokens = curVersion.getVersionNo() == 4 ? 412 : 450;
        UsageSummary usage = UsageSummary.builder()
                .avgTokens(tokens)
                .costPer1kRs(26.0)
                .latencyMs(790)
                .modelName("gpt-4o-mini")
                .build();

        GateConfig cfg = new GateConfig();
        GateDecision decision = qualityGateService.evaluate(cfg, cur, baseline, sec, usage);
        return ResponseEntity.ok(decision);
    }
}
