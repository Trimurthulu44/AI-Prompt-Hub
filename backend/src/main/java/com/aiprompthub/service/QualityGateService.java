package com.aiprompthub.service;

import com.aiprompthub.dto.GateModel.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QualityGateService {

    public GateDecision evaluate(GateConfig cfg, EvaluationSummary cur,
                                 EvaluationSummary baseline, SecuritySummary sec,
                                 UsageSummary usage) {
        List<String> reasons = new ArrayList<>();

        // 1. S(v) >= tau_q
        if (cur.getQualityScore() < cfg.getMinQuality()) {
            reasons.add(String.format("Quality score %.2f is below threshold %.2f",
                    cur.getQualityScore(), cfg.getMinQuality()));
        }

        // 2. delta = S(v_new) - S(v_base) >= -epsilon
        double delta = (baseline != null)
                ? (cur.getQualityScore() - baseline.getQualityScore())
                : 0.0;
        if (delta < -cfg.getRegressionTolerance()) {
            reasons.add(String.format("Regression against baseline: delta %.2f is below tolerance -%.2f",
                    delta, cfg.getRegressionTolerance()));
        }

        // 3. R_sec(v) <= tau_s
        if (sec.getFailedProbeRatio() > cfg.getMaxSecurityFailRatio() || sec.getFailedProbesCount() > 0) {
            String probeInfo = sec.getFailedProbeName() != null ? " (" + sec.getFailedProbeName() + ")" : "";
            reasons.add("Security probes failed" + probeInfo);
        }

        // 4. C(v) <= tau_c
        if (usage.getAvgTokens() > cfg.getMaxAvgTokens()) {
            reasons.add(String.format("Token usage %d exceeds ceiling %d",
                    usage.getAvgTokens(), cfg.getMaxAvgTokens()));
        }

        boolean passed = reasons.isEmpty();
        String recommendation = passed
                ? "All quality gate checks passed. Deployment to production approved."
                : (sec.getRecommendation() != null
                    ? sec.getRecommendation()
                    : "Review flagged failure conditions before resubmitting prompt version.");

        return GateDecision.builder()
                .passed(passed)
                .delta(delta)
                .reasons(reasons)
                .recommendation(recommendation)
                .status(passed ? "APPROVED" : "BLOCKED")
                .build();
    }
}
