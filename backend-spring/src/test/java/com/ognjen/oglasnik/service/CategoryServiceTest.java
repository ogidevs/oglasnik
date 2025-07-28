package com.ognjen.oglasnik.service;

import com.ognjen.oglasnik.repository.AdRepository;
import com.ognjen.oglasnik.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import jakarta.persistence.EntityNotFoundException;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private AdRepository adRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void deleteById_whenCategoryExistsAndIsNotUsed_shouldDeleteCategory() {
        // Arrange
        Long categoryId = 1L;
        when(categoryRepository.existsById(categoryId)).thenReturn(true);
        when(adRepository.existsByKategorijaId(categoryId)).thenReturn(false); // Kategorija se NE koristi

        // Act & Assert
        // Očekujemo da se metoda izvrši bez bacanja izuzetka
        assertDoesNotThrow(() -> categoryService.deleteById(categoryId));

        // Proveravamo da li je deleteById pozvana
        verify(categoryRepository, times(1)).deleteById(categoryId);
    }

    @Test
    void deleteById_whenCategoryIsUsed_shouldThrowIllegalStateException() {
        // Arrange
        Long categoryId = 2L;
        when(categoryRepository.existsById(categoryId)).thenReturn(true);
        when(adRepository.existsByKategorijaId(categoryId)).thenReturn(true); // Kategorija SE KORISTI

        // Act & Assert
        // Očekujemo da će biti bačen IllegalStateException
        assertThrows(IllegalStateException.class, () -> {
            categoryService.deleteById(categoryId);
        });

        // Proveravamo da deleteById NIKADA nije pozvana
        verify(categoryRepository, never()).deleteById(anyLong());
    }

    @Test
    void deleteById_whenCategoryDoesNotExist_shouldThrowEntityNotFoundException() {
        // Arrange
        Long categoryId = 99L;
        when(categoryRepository.existsById(categoryId)).thenReturn(false); // Kategorija NE postoji

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> {
            categoryService.deleteById(categoryId);
        });

        // Proveravamo da adRepository NIKADA nije ni pitan, jer je provera pala ranije
        verify(adRepository, never()).existsByKategorijaId(anyLong());
        verify(categoryRepository, never()).deleteById(anyLong());
    }
}