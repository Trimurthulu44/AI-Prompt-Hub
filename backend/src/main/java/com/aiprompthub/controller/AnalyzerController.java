package com.aiprompthub.controller;

import com.aiprompthub.dto.PromptDto.PromptAnalysisResponse;
import com.aiprompthub.dto.PromptDto.PromptOptimizeResponse;
import com.aiprompthub.service.AiServiceClient;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analyzer")
@RequiredArgsConstructor
@Tag(name = "AI Analyzer & Optimizer", description = "Detection of ambiguity, missing instructions, format issues, and automated prompt optimization")
public class AnalyzerController {

    private final AiServiceClient aiServiceClient;

    @PostMapping("/analyze")
    @Operation(summary = "Analyze prompt", description = "Flag ambiguity, missing instructions, format issues and risky wording")
    public ResponseEntity<PromptAnalysisResponse> analyze(@RequestBody Map<String, String> body) {
        String content = body.getOrDefault("content", "");
        return ResponseEntity.ok(aiServiceClient.analyzePrompt(content));
    }

    @PostMapping("/optimize")
    @Operation(summary = "Optimize prompt", description = "Generate improved candidate prompts with enhanced guardrails and lower token cost")
    public ResponseEntity<PromptOptimizeResponse> optimize(@RequestBody Map<String, String> body) {
        String content = body.getOrDefault("content", "");
        return ResponseEntity.ok(aiServiceClient.optimizePrompt(content));
    }
}
