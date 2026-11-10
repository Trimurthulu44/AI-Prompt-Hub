package com.aiprompthub.controller;

import com.aiprompthub.config.JwtAuthFilter.UserPrincipal;
import com.aiprompthub.dto.PromptDto.SemanticSearchResultDTO;
import com.aiprompthub.service.SemanticSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/semantic-search")
@RequiredArgsConstructor
@Tag(name = "Semantic Search", description = "Vector similarity search and prompt deduplication using Sentence Transformers")
public class SemanticSearchController {

    private final SemanticSearchService semanticSearchService;

    @GetMapping
    @Operation(summary = "Search similar prompts", description = "Find duplicate and related prompts within organization")
    public ResponseEntity<List<SemanticSearchResultDTO>> search(
            @RequestParam String query,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(semanticSearchService.search(user.organizationId(), query));
    }
}
