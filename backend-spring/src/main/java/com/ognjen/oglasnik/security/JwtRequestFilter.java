package com.ognjen.oglasnik.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 1. Ako nema hedera ili ne počinje sa "Bearer ", preskoči ovaj filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Izvuci token iz hedera (bez "Bearer ")
        jwt = authHeader.substring(7);

        try {
            // 3. Izvuci korisničko ime iz tokena
            username = jwtUtil.extractUsername(jwt);
        } catch (Exception e) {
            // Ako token ne može da se parsira, ne radi ništa, pusti da dalje ide kao neautentifikovan
            filterChain.doFilter(request, response);
            return;
        }


        // 4. Ako imamo korisničko ime i korisnik još uvek nije autentifikovan u ovom zahtevu
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 5. Učitaj podatke o korisniku iz baze
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 6. Ako je token validan...
            if (jwtUtil.isTokenValid(jwt, userDetails)) {

                // Kreiraj autentifikacioni token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // Kredencijali su null jer smo već validirali JWT
                        userDetails.getAuthorities()
                );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Postavi autentifikaciju u SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Nastavi lanac filtera
        filterChain.doFilter(request, response);
    }
}