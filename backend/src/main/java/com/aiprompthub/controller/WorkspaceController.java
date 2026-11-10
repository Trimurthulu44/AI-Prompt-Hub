package com.aiprompthub.controller;

import com.aiprompthub.config.JwtAuthFilter.UserPrincipal;
import com.aiprompthub.dto.WorkspaceDto.*;
import com.aiprompthub.service.WorkspaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/workspace")
@RequiredArgsConstructor
@Tag(name = "Workspace & Access Management", description = "Tenant isolation, applications, API credentials and RBAC roles")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @GetMapping
    @Operation(summary = "Get workspace details", description = "List applications, API credentials, and team roles (Admin, Developer, Viewer)")
    public ResponseEntity<WorkspaceDetails> getWorkspace(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(workspaceService.getWorkspaceDetails(user.organizationId()));
    }

    @PostMapping("/applications/{appId}/rotate-key")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVELOPER')")
    @Operation(summary = "Rotate API key", description = "Regenerate application-specific API key for CI/CD or SDK integration")
    public ResponseEntity<ApplicationItem> rotateKey(@PathVariable UUID appId,
                                                     @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(workspaceService.rotateApiKey(user.organizationId(), appId, user.email()));
    }
}
