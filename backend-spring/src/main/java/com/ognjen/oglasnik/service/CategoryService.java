package com.ognjen.oglasnik.service;

import com.ognjen.oglasnik.model.Category;
import com.ognjen.oglasnik.repository.AdRepository;
import com.ognjen.oglasnik.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final AdRepository adRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteById(Long id) {
        // Prvo proveravamo da li kategorija uopšte postoji
        if (!categoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Kategorija sa ID " + id + " nije pronađena.");
        }

        // KLJUČNA PROVERA: Proveravamo da li se kategorija koristi
        if (adRepository.existsByKategorijaId(id)) {
            // Ako se koristi, bacamo izuzetak sa jasnom porukom.
            // Ovaj izuzetak će uhvatiti naš FilterExceptionHandler.
            throw new IllegalStateException("Nije moguće obrisati kategoriju jer postoje oglasi koji je koriste.");
        }

        // Ako provera prođe, brišemo kategoriju.
        categoryRepository.deleteById(id);
    }
}