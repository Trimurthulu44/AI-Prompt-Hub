package com.aiprompthub.config;

import com.aiprompthub.entity.Application;
import com.aiprompthub.repository.ApplicationRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final ApplicationRepository applicationRepository;

    public JwtAuthFilter(JwtTokenProvider tokenProvider, @Lazy ApplicationRepository applicationRepository) {
        this.tokenProvider = tokenProvider;
        this.applicationRepository = applicationRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = resolveToken(request);

        if (StringUtils.hasText(token)) {
            // Check if it is an API Key (starts with aph_)
            if (token.startsWith("aph_")) {
                Optional<Application> appOpt = applicationRepository.findByApiKey(token);
                if (appOpt.isPresent()) {
                    Application app = appOpt.get();
                    UserPrincipal principal = new UserPrincipal(
                            app.getId(),
                            app.getName() + "@ci-agent",
                            "DEVELOPER",
                            app.getOrganization().getId()
                    );
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            principal, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_DEVELOPER")));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } else if (tokenProvider.validateToken(token)) {
                Claims claims = tokenProvider.getClaims(token);
                UUID userId = UUID.fromString(claims.getSubject());
                String email = claims.get("email", String.class);
                String role = claims.get("role", String.class);
                UUID orgId = UUID.fromString(claims.get("orgId", String.class));

                UserPrincipal principal = new UserPrincipal(userId, email, role, orgId);
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        principal, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        String apiKeyHeader = request.getHeader("X-API-Key");
        if (StringUtils.hasText(apiKeyHeader)) {
            return apiKeyHeader;
        }
        return null;
    }

    public record UserPrincipal(UUID id, String email, String role, UUID organizationId) {}
}
