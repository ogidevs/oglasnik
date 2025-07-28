package com.ognjen.oglasnik.controller;

import com.ognjen.oglasnik.dto.LogDto;
import com.ognjen.oglasnik.dto.UserDto;
import com.ognjen.oglasnik.dto.UserUpdateDto;
import com.ognjen.oglasnik.model.Category;
import com.ognjen.oglasnik.service.AdService;
import com.ognjen.oglasnik.service.CategoryService;
import com.ognjen.oglasnik.service.LogService;
import com.ognjen.oglasnik.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final AdService adService;
    private final CategoryService categoryService;
    private final LogService logService;

    // --- Upravljanje korisnicima ---
    @GetMapping("/users")
    public Page<UserDto> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return userService.findAllUsers(page, size);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserUpdateDto userUpdateDto) {
        UserDto updatedUser = userService.updateUserByAdmin(id, userUpdateDto);
        return ResponseEntity.ok(updatedUser);
    }


    // --- Upravljanje oglasima ---
    @DeleteMapping("/ads/{id}")
    public ResponseEntity<Void> deleteAnyAd(@PathVariable Long id) {
        adService.deleteAdByAdmin(id);
        return ResponseEntity.noContent().build();
    }

    // --- Upravljanje kategorijama ---
    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category savedCategory = categoryService.save(category);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/logs")
    public Page<LogDto> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String username
    ) {
        if (username != null && !username.isBlank()) {
            return logService.getLogsByUsername(username, page, size);
        }
        return logService.getLogs(page, size);
    }
}
