package com.aiprompthub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "prompt_version", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"prompt_id", "version_no"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromptVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_id", nullable = false)
    private Prompt prompt;

    @Column(name = "version_no", nullable = false)
    private Integer versionNo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "change_instruction", columnDefinition = "TEXT")
    private String changeInstruction;

    @Column(name = "created_by", length = 120)
    private String createdBy;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private VersionStatus status = VersionStatus.SUBMITTED;

    @Column(name = "embedding_vector", columnDefinition = "TEXT")
    private String embeddingVector;
}
