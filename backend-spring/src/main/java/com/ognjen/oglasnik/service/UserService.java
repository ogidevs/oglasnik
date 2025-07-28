package com.ognjen.oglasnik.service;

import com.ognjen.oglasnik.dto.RegisterRequest;
import com.ognjen.oglasnik.dto.UserDto;
import com.ognjen.oglasnik.dto.UserUpdateDto;
import com.ognjen.oglasnik.model.Role;
import com.ognjen.oglasnik.model.User;
import com.ognjen.oglasnik.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // service/UserService.java
    public Page<UserDto> findAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("username").ascending());
        Page<User> userPage = userRepository.findAll(pageable);

        return userPage.map(user -> UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build());
    }

    public void registerUser(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalStateException("Korisničko ime već postoji.");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalStateException("Email već postoji.");
        }
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(Role.ROLE_USER);
        userRepository.save(newUser);
    }

    public UserDto getUserInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Korisnik nije pronađen: " + username));

        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Transactional
    public UserDto updateUserByAdmin(Long userId, UserUpdateDto userUpdateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Korisnik sa ID " + userId + " nije pronađen."));

        user.setEmail(userUpdateDto.getEmail());
        user.setRole(userUpdateDto.getRole());

        User savedUser = userRepository.save(user);
        return getUserInfo(savedUser.getUsername());
    }

    public void deleteUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oglas nije pronađen"));

        userRepository.delete(user);
    }
}