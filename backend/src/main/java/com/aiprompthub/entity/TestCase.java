package com.aiprompthub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "test_case")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCase {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dataset_id", nullable = false)
    private TestDataset dataset;

    @Column(name = "input_text", columnDefinition = "TEXT", nullable = false)
    private String inputText;

    @Column(name = "expected_behavior", columnDefinition = "TEXT", nullable = false)
    private String expectedBehavior;
}
