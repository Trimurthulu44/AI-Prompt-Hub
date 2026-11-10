package com.aiprompthub.controller;

import com.aiprompthub.config.JwtAuthFilter.UserPrincipal;
import com.aiprompthub.dto.WorkspaceDto.AnalyticsSummary;
import com.aiprompthub.dto.WorkspaceDto.AuditLogItem;
import com.aiprompthub.service.WorkspaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Analytics & Audit", description = "Usage metrics, token cost, latency, quality trends, and enterprise audit events")
public class AnalyticsController {

    private final WorkspaceService workspaceService;

    @GetMapping("/analytics")
    @Operation(summary = "Get 30-day analytics", description = "Token usage, monthly cost in Rs, latency in ms, and quality score over time")
    public ResponseEntity<AnalyticsSummary> getAnalytics(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(workspaceService.getAnalytics(user.organizationId()));
    }

    @GetMapping("/audit")
    @Operation(summary = "Get audit logs", description = "Track every version creation, rollback, gate decision, user change and key rotation")
    public ResponseEntity<List<AuditLogItem>> getAuditLogs(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(workspaceService.getAuditLogs(user.organizationId()));
    }
}
