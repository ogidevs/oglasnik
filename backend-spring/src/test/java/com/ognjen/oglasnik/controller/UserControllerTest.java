package com.ognjen.oglasnik.controller;

import com.ognjen.oglasnik.dto.AdDto;
import com.ognjen.oglasnik.dto.UserDto;
import com.ognjen.oglasnik.model.Role;
import com.ognjen.oglasnik.service.AdService;
import com.ognjen.oglasnik.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdService adService;

    @MockitoBean
    private UserService userService;

    @Test
    @WithMockUser(username = "testuser")
    void getCurrentUserAds_whenAuthenticated_shouldReturnUserAds() throws Exception {
        // Arrange
        AdDto ad1 = AdDto.builder().id(1L).naslov("Oglas 1").build();
        AdDto ad2 = AdDto.builder().id(2L).naslov("Oglas 2").build();
        given(adService.findAdsByUsername("testuser")).willReturn(List.of(ad1, ad2));

        // Act & Assert
        mockMvc.perform(get("/api/users/me/ads"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].naslov", is("Oglas 1")));
    }

    @Test
    void getCurrentUserAds_whenNotAuthenticated_shouldReturnForbidden() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/users/me/ads"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "testuser")
    void getCurrentUserInfo_whenAuthenticated_shouldReturnUserInfo() throws Exception {
        // Arrange
        UserDto userDto = UserDto.builder().id(1L).username("testuser").role(Role.ROLE_USER).email("test@test.com").build();
        given(userService.getUserInfo("testuser")).willReturn(userDto);

        // Act & Assert
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("testuser")))
                .andExpect(jsonPath("$.role", is("ROLE_USER")));
    }
}