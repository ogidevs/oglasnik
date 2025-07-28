package com.ognjen.oglasnik.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ognjen.oglasnik.dto.ErrorResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;

@Slf4j
@Component
public class FilterExceptionHandler extends OncePerRequestFilter {

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            handleException(response, e);
        }
    }

    private void handleException(HttpServletResponse response, Exception e) throws IOException {
        // *** KLJUČNA PROMENA: Prvo tražimo pravi uzrok (cause) ***
        Throwable cause = e;
        while (cause.getCause() != null) {
            cause = cause.getCause();
        }

        HttpStatus status;
        String message;

        // Sada proveravamo tip PRAVOG uzroka
        if (cause instanceof EntityNotFoundException) {
            status = HttpStatus.NOT_FOUND;
            message = cause.getMessage();
        } else if (cause instanceof AccessDeniedException) {
            status = HttpStatus.FORBIDDEN;
            message = "Pristup odbijen. Nemate potrebne dozvole.";
        } else if (cause instanceof AuthenticationException) {
            status = HttpStatus.UNAUTHORIZED;
            message = "Autentifikacija nije uspela: " + cause.getMessage();
        } else if (cause instanceof IllegalStateException || cause instanceof IllegalArgumentException) {
            status = HttpStatus.BAD_REQUEST;
            message = cause.getMessage();
        } else {
            // Generalna, neočekivana greška
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = "Došlo je do neočekivane greške na serveru: ";
            message += cause.getMessage();
            // Logovanje originalnog, spoljnog izuzetka je ovde važno
            // log.error("Unhandled exception in filter chain", e);
        }

        log.error(String.valueOf(cause));
        // Kreiramo i šaljemo odgovor
        ErrorResponse errorResponse = new ErrorResponse(message, status, Instant.now());
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}