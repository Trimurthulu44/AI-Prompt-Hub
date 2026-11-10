package com.aiprompthub.service;

import com.aiprompthub.config.JwtTokenProvider;
import com.aiprompthub.dto.AuthDto.*;
import com.aiprompthub.entity.Organization;
import com.aiprompthub.entity.Role;
import com.aiprompthub.entity.User;
import com.aiprompthub.exception.BadRequestException;
import com.aiprompthub.exception.UnauthorizedException;
import com.aiprompthub.repository.OrganizationRepository;
import com.aiprompthub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditService auditService;

    @Transactional
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        // Verify workspace slug if provided
        if (req.getWorkspaceSlug() != null && !req.getWorkspaceSlug().isBlank()) {
            if (!user.getOrganization().getWorkspaceSlug().equalsIgnoreCase(req.getWorkspaceSlug())) {
                throw new UnauthorizedException("User does not belong to specified workspace: " + req.getWorkspaceSlug());
            }
        }

        String token = jwtTokenProvider.generateToken(
                user.getId(), user.getEmail(), user.getRole(), user.getOrganization().getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        auditService.record(user.getOrganization().getId(), user.getName(), "USER_LOGIN", user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .organizationId(user.getOrganization().getId())
                .organizationName(user.getOrganization().getName())
                .workspaceSlug(user.getOrganization().getWorkspaceSlug())
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new BadRequestException("Email already registered: " + req.getEmail());
        }

        String slug = req.getWorkspaceSlug() != null && !req.getWorkspaceSlug().isBlank()
                ? req.getWorkspaceSlug().toLowerCase().replaceAll("\\s+", "-")
                : req.getOrganizationName().toLowerCase().replaceAll("\\s+", "-");

        Organization org = organizationRepository.findByWorkspaceSlug(slug).orElseGet(() -> {
            Organization newOrg = Organization.builder()
                    .name(req.getOrganizationName())
                    .workspaceSlug(slug)
                    .createdAt(Instant.now())
                    .build();
            return organizationRepository.save(newOrg);
        });

        User user = User.builder()
                .organization(org)
                .name(req.getAdminName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(Role.ADMIN)
                .createdAt(Instant.now())
                .build();
        User savedUser = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(
                savedUser.getId(), savedUser.getEmail(), savedUser.getRole(), org.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser.getId());

        auditService.record(org.getId(), savedUser.getName(), "WORKSPACE_REGISTERED", org.getName());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .userId(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .organizationId(org.getId())
                .organizationName(org.getName())
                .workspaceSlug(org.getWorkspaceSlug())
                .build();
    }
}
