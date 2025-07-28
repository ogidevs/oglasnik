package com.ognjen.oglasnik.service;

import com.ognjen.oglasnik.dto.AdDto;
import com.ognjen.oglasnik.dto.AdRequest;
import com.ognjen.oglasnik.model.Ad;
import com.ognjen.oglasnik.model.Category;
import com.ognjen.oglasnik.model.User;
import com.ognjen.oglasnik.repository.AdRepository;
import com.ognjen.oglasnik.repository.CategoryRepository;
import com.ognjen.oglasnik.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Omogućava Mockito anotacije
class AdServiceTest {

    // Mock-ujemo zavisnosti. Mockito će kreirati lažne objekte.
    @Mock
    private AdRepository adRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CategoryRepository categoryRepository;

    // Kreiramo pravu instancu AdService-a i automatski joj "ubacujemo" mock-ovane repozitorijume.
    @InjectMocks
    private AdService adService;

    private User testUser;
    private Category testCategory;
    private Ad testAd;

    // @BeforeEach se izvršava pre svakog @Test-a
    @BeforeEach
    void setUp() {
        // Kreiramo testne objekte koje ćemo koristiti u više testova
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setNaziv("Test Kategorija");

        testAd = new Ad();
        testAd.setId(1L);
        testAd.setNaslov("Test Oglas");
        testAd.setOpis("Opis testa");
        testAd.setCena(100.0);
        testAd.setDatumKreiranja(Instant.now());
        testAd.setKorisnik(testUser);
        testAd.setKategorija(testCategory);
    }

    @Test
    void findById_whenAdExists_shouldReturnAdDto() {
        // 1. Arrange (Priprema)
        // Definišemo ponašanje mock-a: "Kada neko pozove adRepository.findById(1L), vrati Optional sa našim testnim oglasom."
        when(adRepository.findById(1L)).thenReturn(Optional.of(testAd));

        // 2. Act (Izvršenje)
        // Pozivamo metodu koju testiramo
        Optional<AdDto> foundAd = adService.findById(1L);

        // 3. Assert (Provera)
        // Proveravamo da li je rezultat ispravan
        assertThat(foundAd).isPresent();
        assertThat(foundAd.get().getNaslov()).isEqualTo("Test Oglas");
        assertThat(foundAd.get().getKorisnikUsername()).isEqualTo("testuser");

        // (Opciono) Proveravamo da li je metoda na mock-u pozvana tačno jednom
        verify(adRepository, times(1)).findById(1L);
    }

    @Test
    void findById_whenAdDoesNotExist_shouldReturnEmptyOptional() {
        // Arrange
        // "Kada neko pozove findById sa BILO KOJIM Long brojem, vrati prazan Optional."
        when(adRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act
        Optional<AdDto> foundAd = adService.findById(99L);

        // Assert
        assertThat(foundAd).isNotPresent();
        verify(adRepository, times(1)).findById(99L);
    }

    @Test
    void createAd_withValidData_shouldSaveAndReturnAdDto() {
        // Arrange
        AdRequest adRequest = new AdRequest();
        adRequest.setNaslov("Novi Oglas");
        adRequest.setOpis("Novi opis");
        adRequest.setCena(200.0);
        adRequest.setKategorijaId(1L);

        // Definišemo ponašanje svih potrebnih mock-ova
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        // "Kada neko pozove adRepository.save sa BILO KOJIM Ad objektom, vrati taj isti objekat nazad."
        when(adRepository.save(any(Ad.class))).thenAnswer(invocation -> {
            Ad adToSave = invocation.getArgument(0);
            adToSave.setId(2L); // Simuliramo da je baza dodelila novi ID
            return adToSave;
        });

        // Act
        AdDto createdAd = adService.createAd(adRequest, "testuser");

        // Assert
        assertThat(createdAd).isNotNull();
        assertThat(createdAd.getNaslov()).isEqualTo("Novi Oglas");
        assertThat(createdAd.getId()).isEqualTo(2L);
        assertThat(createdAd.getKorisnikUsername()).isEqualTo("testuser");

        // Proveravamo da li je save metoda pozvana
        verify(adRepository, times(1)).save(any(Ad.class));
    }
}