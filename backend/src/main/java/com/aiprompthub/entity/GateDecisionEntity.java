package com.aiprompthub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "gate_decision")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GateDecisionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_version_id", nullable = false)
    private PromptVersion promptVersion;

    @Column(nullable = false)
    private Boolean passed;

    @Column(nullable = false)
    @Builder.Default
    private String status = "COMPLETED"; // RUNNING, COMPLETED, FAILED

    @Column(nullable = false)
    private Double delta; // regression delta S(v_new) - S(v_base)

    @Column(columnDefinition = "TEXT")
    private String reasons; // semicolon separated or JSON

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "checked_at", nullable = false)
    @Builder.Default
    private Instant checkedAt = Instant.now();
}
