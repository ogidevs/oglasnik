package com.ognjen.oglasnik.controller;

import com.ognjen.oglasnik.dto.JwtResponse;
import com.ognjen.oglasnik.dto.LoginRequest;
import com.ognjen.oglasnik.dto.RegisterRequest;
import com.ognjen.oglasnik.service.AuthService;
import com.ognjen.oglasnik.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest loginRequest) {
        String token = authService.authenticate(loginRequest);
        return ResponseEntity.ok(new JwtResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        userService.registerUser(registerRequest);
        return ResponseEntity.ok("Korisnik uspešno registrovan!");
    }
}
