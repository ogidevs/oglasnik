package com.ognjen.oglasnik.controller;

import com.ognjen.oglasnik.model.Category;
import com.ognjen.oglasnik.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryService categoryService;

    // JAVNA FUNKCIONALNOST: Dobijanje svih kategorija za filtere
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.findAll();
    }
}