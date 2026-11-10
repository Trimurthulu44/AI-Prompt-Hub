package com.aiprompthub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "evaluation_run")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationRun {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_version_id", nullable = false)
    private PromptVersion promptVersion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dataset_id")
    private TestDataset dataset;

    @Column(name = "quality_score", nullable = false)
    private Double qualityScore; // S(v)

    @Column(nullable = false)
    private Double correctness; // 0.4 weight

    @Column(nullable = false)
    private Double relevance; // 0.2 weight

    @Column(name = "instruction_following", nullable = false)
    private Double instructionFollowing; // 0.25 weight

    @Column(name = "format_score", nullable = false)
    private Double formatScore; // 0.15 weight

    @Column(name = "tested_cases", nullable = false)
    @Builder.Default
    private Integer testedCases = 50;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
