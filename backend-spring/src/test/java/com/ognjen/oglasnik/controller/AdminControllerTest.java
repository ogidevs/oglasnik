package com.ognjen.oglasnik.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ognjen.oglasnik.dto.UserDto;
import com.ognjen.oglasnik.model.Category;
import com.ognjen.oglasnik.model.Role;
import com.ognjen.oglasnik.service.AdService;
import com.ognjen.oglasnik.service.CategoryService;
import com.ognjen.oglasnik.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private AdService adService;

    @MockitoBean
    private CategoryService categoryService;

    // --- Testovi za User Management ---

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllUsers_whenAdmin_shouldReturnUserList() throws Exception {
        // Arrange
        UserDto userDto = UserDto.builder().id(1L).username("testuser").role(Role.ROLE_USER).build();
        List<UserDto> userDtos = List.of(userDto);

        Page<UserDto> userDtoPage = new PageImpl<>(userDtos);

        given(userService.findAllUsers(0, 10)).willReturn(userDtoPage);

        // Act & Assert
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].username", is("testuser")));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getAllUsers_whenUser_shouldReturnForbidden() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getAllUsers_whenNotAuthenticated_shouldReturnForbidden() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteUser_whenAdmin_shouldReturnNoContent() throws Exception {
        // Arrange
        Long userId = 1L;
        doNothing().when(userService).deleteUserById(userId);

        // Act & Assert
        mockMvc.perform(delete("/api/admin/users/{id}", userId))
                .andExpect(status().isNoContent());
    }

    // --- Testovi za Category Management ---

    @Test
    @WithMockUser(roles = "ADMIN")
    void createCategory_whenAdmin_shouldReturnCreated() throws Exception {
        // Arrange
        Category newCategory = new Category();
        newCategory.setNaziv("Nova Kategorija");

        Category savedCategory = new Category();
        savedCategory.setId(1L);
        savedCategory.setNaziv("Nova Kategorija");

        given(categoryService.save(any(Category.class))).willReturn(savedCategory);

        // Act & Assert
        mockMvc.perform(post("/api/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCategory)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.naziv", is("Nova Kategorija")));
    }

    @Test
    @WithMockUser(roles = "USER")
    void createCategory_whenUser_shouldReturnForbidden() throws Exception {
        // Arrange
        Category newCategory = new Category();
        newCategory.setNaziv("Nova Kategorija");

        // Act & Assert
        mockMvc.perform(post("/api/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCategory)))
                .andExpect(status().isForbidden());
    }
}