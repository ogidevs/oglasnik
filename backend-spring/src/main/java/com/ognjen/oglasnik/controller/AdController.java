package com.ognjen.oglasnik.controller;

import com.ognjen.oglasnik.annotation.LogUserAction;
import com.ognjen.oglasnik.dto.AdDto;
import com.ognjen.oglasnik.dto.AdRequest;
import com.ognjen.oglasnik.service.AdService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ads")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdController {

    private final AdService adService;

    // JAVNA FUNKCIONALNOST: Pregled, pretraga i filter
    @GetMapping
    public ResponseEntity<Page<AdDto>> getAllAds(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        // Kreiramo Pageable objekat, sortiramo po datumu kreiranja opadajuće
        Pageable pageable = PageRequest.of(page, size, Sort.by("datumKreiranja").descending());

        Page<AdDto> adPage = adService.searchAds(keyword, categoryId, pageable);
        return ResponseEntity.ok(adPage);
    }

    // JAVNA FUNKCIONALNOST: Detaljan pregled jednog oglasa
    @GetMapping("/{id}")
    @LogUserAction("Details about post")
    public ResponseEntity<AdDto> getAdById(@PathVariable Long id) {
        return adService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // KORISNIČKA FUNKCIONALNOST: Kreiranje oglasa (potrebna autentifikacija)
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @LogUserAction("Created post")
    public ResponseEntity<AdDto> createAd(@RequestBody AdRequest adRequest, @AuthenticationPrincipal UserDetails userDetails) {
        AdDto createdAd = adService.createAd(adRequest, userDetails.getUsername());
        return new ResponseEntity<>(createdAd, HttpStatus.CREATED);
    }

    // KORISNIČKA FUNKCIONALNOST: Brisanje sopstvenog oglasa
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @adService.isOwner(#id, principal.username)")
    @LogUserAction("Deleted post")
    public ResponseEntity<Void> deleteAd(@PathVariable Long id) {
        try {
            adService.deleteAd(id);
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @adService.isOwner(#id, principal.username)")
    @LogUserAction("Updated post")
    public ResponseEntity<AdDto> updateAd(@PathVariable Long id, @RequestBody AdRequest adRequest) {
        // Servisna metoda `updateAd` ne mora da se menja, jer ne radi proveru vlasništva
        AdDto updatedAd = adService.updateAd(id, adRequest);
        return ResponseEntity.ok(updatedAd);
    }
}