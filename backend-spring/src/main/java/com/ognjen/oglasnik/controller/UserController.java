package com.ognjen.oglasnik.controller;

import com.ognjen.oglasnik.dto.AdDto;
import com.ognjen.oglasnik.dto.UserDto;
import com.ognjen.oglasnik.service.AdService;
import com.ognjen.oglasnik.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final AdService adService;
    private final UserService userService;

    @GetMapping("/me/ads")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AdDto>> getCurrentUserAds(@AuthenticationPrincipal UserDetails userDetails) {
        List<AdDto> userAds = adService.findAdsByUsername(userDetails.getUsername());
        return ResponseEntity.ok(userAds);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUserInfo(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto userInfo = userService.getUserInfo(userDetails.getUsername());
        return ResponseEntity.ok(userInfo);
    }
}