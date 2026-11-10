package com.aiprompthub.repository;

import com.aiprompthub.entity.PromptVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PromptVersionRepository extends JpaRepository<PromptVersion, UUID> {
    List<PromptVersion> findByPromptIdOrderByVersionNoDesc(UUID promptId);

    @Query("SELECT MAX(v.versionNo) FROM PromptVersion v WHERE v.prompt.id = :promptId")
    Optional<Integer> findMaxVersionNo(@Param("promptId") UUID promptId);

    @Query("SELECT v FROM PromptVersion v WHERE v.prompt.id = :promptId AND v.versionNo = :versionNo AND v.prompt.organization.id = :orgId")
    Optional<PromptVersion> findByPromptIdAndVersionNoAndOrganizationId(
            @Param("promptId") UUID promptId,
            @Param("versionNo") Integer versionNo,
            @Param("orgId") UUID orgId);

    @Query("SELECT v FROM PromptVersion v WHERE v.prompt.organization.id = :orgId")
    List<PromptVersion> findAllByOrganizationId(@Param("orgId") UUID orgId);
}
