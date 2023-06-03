package org.dyson.ecommerce.sale.configs;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Slf4j
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(registry ->
                registry.requestMatchers("/",
                        "/api-docs/**",
                        "/webjars/**",
                        "/swagger-ui/**",
                        "/login**",
                        "/error**",
                        "/actuator/prometheus",
                        "/api/*/diners/qrcode/**",
                        "/api/*/test",
                        "/api/*/diners/authenticate/**",
                        "/api/*/login/**",
                        "/dev-docs",
                        "/api/*/authenticate/**",
                        "/api/*/registry/**"
                    ).permitAll()
                    .anyRequest().authenticated()
            )
            .oauth2ResourceServer(configurer -> configurer.jwt(withDefaults()));
//            .sessionManagement(configurer -> configurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//            .oauth2Login(withDefaults());
//            .oauth2Client(withDefaults());
        return http.build();
    }
}
