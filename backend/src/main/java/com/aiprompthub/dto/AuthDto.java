package com.aiprompthub.dto;

import com.aiprompthub.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

public class AuthDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginRequest {
        private String email;
        private String password;
        private String workspaceSlug;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegisterRequest {
        private String organizationName;
        private String workspaceSlug;
        private String adminName;
        private String email;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        private String refreshToken;
        private UUID userId;
        private String name;
        private String email;
        private Role role;
        private UUID organizationId;
        private String organizationName;
        private String workspaceSlug;
    }
}
