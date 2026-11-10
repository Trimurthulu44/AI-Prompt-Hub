package com.aiprompthub.repository;

import com.aiprompthub.entity.Prompt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PromptRepository extends JpaRepository<Prompt, UUID> {
    List<Prompt> findByOrganizationId(UUID organizationId);
    Optional<Prompt> findByIdAndOrganizationId(UUID id, UUID organizationId);
    Optional<Prompt> findByNameAndOrganizationId(String name, UUID organizationId);
}
