package com.ognjen.oglasnik.aspect;

import com.ognjen.oglasnik.annotation.LogUserAction;
import com.ognjen.oglasnik.model.Log;
import com.ognjen.oglasnik.repository.LogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Arrays;

@Aspect
@Component
@RequiredArgsConstructor
public class UserActionLoggingAspect {

    private final LogRepository logRepository;
    private final HttpServletRequest request;

    @Around("@annotation(logUserAction)")
    public Object logUserAction(ProceedingJoinPoint joinPoint, LogUserAction logUserAction) throws Throwable {
        Object result = joinPoint.proceed();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return result;
        }

        String username = auth.getName();
        String ip = getClientIp(request);
        String userAgent = request.getHeader("User-Agent");

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String[] paramNames = signature.getParameterNames();
        Object[] args = joinPoint.getArgs();

        // Try to find 'id' parameter value
        String idValue = null;
        for (int i = 0; i < paramNames.length; i++) {
            if ("id".equals(paramNames[i])) {
                idValue = String.valueOf(args[i]);
                break;
            }
        }

        String details = "Args: " + Arrays.toString(args);
        if (idValue != null) {
            details += "; postId=" + idValue;
        }

        Log log = new Log();
        log.setUsername(username);
        log.setAction(logUserAction.value());
        log.setMethod(joinPoint.getSignature().toShortString());
        log.setTimestamp(Instant.now());
        log.setIpAddress(ip);
        log.setUserAgent(userAgent);
        log.setDetails(details);

        logRepository.save(log);

        return result;
    }

    // Handles proxy headers too (e.g. from nginx)
    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isEmpty()) {
            return forwarded.split(",")[0]; // first in list
        }
        return request.getRemoteAddr();
    }
}
