package com.aiprompthub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "security_result")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecurityResult {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_version_id", nullable = false)
    private PromptVersion promptVersion;

    @Column(nullable = false)
    private Boolean passed;

    @Column(name = "failed_probes_count", nullable = false)
    private Integer failedProbesCount;

    @Column(name = "total_probes_count", nullable = false)
    @Builder.Default
    private Integer totalProbesCount = 20;

    @Column(name = "failed_probe_name")
    private String failedProbeName;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    @Column(name = "prompt_injection_passed")
    @Builder.Default
    private Boolean promptInjectionPassed = true;

    @Column(name = "system_leakage_passed")
    @Builder.Default
    private Boolean systemLeakagePassed = true;

    @Column(name = "pii_exposure_passed")
    @Builder.Default
    private Boolean piiExposurePassed = true;

    @Column(name = "role_override_passed")
    @Builder.Default
    private Boolean roleOverridePassed = true;

    @Column(name = "unsafe_content_passed")
    @Builder.Default
    private Boolean unsafeContentPassed = true;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
