package com.aiprompthub.repository;

import com.aiprompthub.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findByOrganizationId(UUID organizationId);
    Optional<Application> findByApiKey(String apiKey);
    Optional<Application> findByIdAndOrganizationId(UUID id, UUID organizationId);
}
