package com.ognjen.oglasnik.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ognjen.oglasnik.dto.AdDto;
import com.ognjen.oglasnik.dto.AdRequest;
import com.ognjen.oglasnik.service.AdService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest // Diže celu aplikaciju
@AutoConfigureMockMvc // Konfiguriše MockMvc za slanje zahteva
public class AdControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AdService adService;

    @Test
    void getAdById_whenAdExists_shouldReturnOk() throws Exception {
        // Arrange
        AdDto adDto = AdDto.builder()
                .id(1L)
                .naslov("Test Oglas")
                .korisnikUsername("prodavac")
                .kategorijaNaziv("Test kategorija")
                .datumKreiranja(Instant.now())
                .build();
        given(adService.findById(1L)).willReturn(Optional.of(adDto));

        // Act & Assert
        // Ovaj endpoint je javan, tako da ne treba @WithMockUser
        mockMvc.perform(get("/api/ads/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.naslov").value("Test Oglas"));
    }

    @Test
    void getAdById_whenAdDoesNotExist_shouldReturnNotFound() throws Exception {
        // Arrange
        given(adService.findById(99L)).willReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get("/api/ads/99"))
                .andExpect(status().isNotFound());
    }

    // --- Testovi za zaštićene endpointe ---

    @Test
    @WithMockUser(username = "testuser")
    void createAd_whenAuthenticated_shouldReturnCreated() throws Exception {
        // Arrange
        AdRequest adRequest = new AdRequest();
        adRequest.setNaslov("Novi Oglas");

        AdDto createdDto = AdDto.builder().id(2L).naslov("Novi Oglas").build();
        given(adService.createAd(any(AdRequest.class), eq("testuser"))).willReturn(createdDto);

        // Act & Assert
        mockMvc.perform(post("/api/ads")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adRequest)))
                .andExpect(status().isCreated());
    }

    @Test
    void createAd_whenNotAuthenticated_shouldReturnForbidden() throws Exception {
        // Arrange
        AdRequest adRequest = new AdRequest();
        adRequest.setNaslov("Novi Oglas");

        // Act & Assert
        mockMvc.perform(post("/api/ads")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "not_owner", roles = "USER")
    void deleteAd_whenUserIsNotOwner_shouldReturnForbidden() throws Exception {
        // Arrange
        Long adId = 1L;
        // U @SpringBootTest okruženju, @PreAuthorize radi savršeno.
        // Mi samo moramo da mu damo vrednost za `isOwner` proveru.
        given(adService.isOwner(adId, "not_owner")).willReturn(false);

        // Act & Assert
        mockMvc.perform(delete("/api/ads/{id}", adId))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "owner", roles = "USER")
    void deleteAd_whenUserIsOwner_shouldReturnNoContent() throws Exception {
        // Arrange
        Long adId = 1L;
        given(adService.isOwner(adId, "owner")).willReturn(true);
        doNothing().when(adService).deleteAd(adId);

        // Act & Assert
        mockMvc.perform(delete("/api/ads/{id}", adId))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteAd_whenUserIsAdmin_shouldReturnNoContent() throws Exception {
        // Arrange
        Long adId = 1L;
        // Admin prolazi `hasRole('ADMIN')` proveru, `isOwner` se ne izvršava.
        doNothing().when(adService).deleteAd(adId);

        // Act & Assert
        mockMvc.perform(delete("/api/ads/{id}", adId))
                .andExpect(status().isNoContent());
    }
}