package org.dyson.core.aop;

import org.springframework.security.core.Authentication;

public interface AuthenticationFacade {
    Authentication getAuth();

    String getUserIdentity();
}

