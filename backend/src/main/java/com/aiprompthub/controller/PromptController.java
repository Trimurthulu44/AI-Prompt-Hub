package com.aiprompthub.controller;

import com.aiprompthub.config.JwtAuthFilter.UserPrincipal;
import com.aiprompthub.dto.PromptDto.*;
import com.aiprompthub.entity.PromptVersion;
import com.aiprompthub.service.PromptService;
import com.aiprompthub.service.PromptVersionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prompts")
@RequiredArgsConstructor
@Tag(name = "Prompt Management", description = "CRUD, versioning, rollback, and asset governance")
public class PromptController {

    private final PromptService promptService;
    private final PromptVersionService versionService;

    @GetMapping
    @Operation(summary = "List prompts", description = "Get all prompts in authenticated organization")
    public ResponseEntity<List<PromptResponse>> listPrompts(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(promptService.getPrompts(user.organizationId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get prompt by ID")
    public ResponseEntity<PromptResponse> getPrompt(@PathVariable UUID id,
                                                    @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(promptService.getPrompt(id, user.organizationId()));
    }

    @PostMapping
    @Operation(summary = "Create prompt", description = "Create a new prompt asset inside project and application")
    public ResponseEntity<PromptResponse> createPrompt(@RequestBody CreatePromptRequest req,
                                                       @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(promptService.createPrompt(user.organizationId(), req, user.email()));
    }

    @GetMapping("/{id}/versions")
    @Operation(summary = "List prompt versions", description = "Retrieve immutable version history (v1, v2, v3...)")
    public ResponseEntity<List<PromptVersionResponse>> listVersions(@PathVariable UUID id,
                                                                    @AuthenticationPrincipal UserPrincipal user) {
        List<PromptVersion> list = versionService.getVersions(id, user.organizationId());
        List<PromptVersionResponse> dtos = list.stream().map(v -> PromptVersionResponse.builder()
                .id(v.getId())
                .promptId(v.getPrompt().getId())
                .versionNo(v.getVersionNo())
                .content(v.getContent())
                .changeInstruction(v.getChangeInstruction())
                .createdBy(v.getCreatedBy())
                .createdAt(v.getCreatedAt())
                .status(v.getStatus())
                .build()).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{id}/versions")
    @Operation(summary = "Create new version", description = "Submit a prompt change (used by developer and CI/CD pipelines)")
    public ResponseEntity<PromptVersionResponse> createVersion(@PathVariable UUID id,
                                                               @RequestBody CreateVersionRequest req,
                                                               @AuthenticationPrincipal UserPrincipal user) {
        PromptVersion v = versionService.createVersion(user.organizationId(), id, req, user.email());
        return ResponseEntity.ok(PromptVersionResponse.builder()
                .id(v.getId())
                .promptId(v.getPrompt().getId())
                .versionNo(v.getVersionNo())
                .content(v.getContent())
                .changeInstruction(v.getChangeInstruction())
                .createdBy(v.getCreatedBy())
                .createdAt(v.getCreatedAt())
                .status(v.getStatus())
                .build());
    }

    @PostMapping("/{id}/rollback")
    @Operation(summary = "Rollback prompt", description = "Controlled re-activation of an earlier approved version")
    public ResponseEntity<PromptVersionResponse> rollback(@PathVariable UUID id,
                                                          @RequestBody RollbackRequest req,
                                                          @AuthenticationPrincipal UserPrincipal user) {
        PromptVersion v = versionService.rollback(user.organizationId(), id, req.getTargetVersionNo(), user.email());
        return ResponseEntity.ok(PromptVersionResponse.builder()
                .id(v.getId())
                .promptId(v.getPrompt().getId())
                .versionNo(v.getVersionNo())
                .content(v.getContent())
                .changeInstruction(v.getChangeInstruction())
                .createdBy(v.getCreatedBy())
                .createdAt(v.getCreatedAt())
                .status(v.getStatus())
                .build());
    }
}
