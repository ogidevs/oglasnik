package com.ognjen.oglasnik.service;

import com.ognjen.oglasnik.dto.AdDto;
import com.ognjen.oglasnik.dto.AdRequest;
import com.ognjen.oglasnik.model.Ad;
import com.ognjen.oglasnik.model.Category;
import com.ognjen.oglasnik.model.Image;
import com.ognjen.oglasnik.model.User;
import com.ognjen.oglasnik.repository.AdRepository;
import com.ognjen.oglasnik.repository.CategoryRepository;
import com.ognjen.oglasnik.repository.ImageRepository;
import com.ognjen.oglasnik.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service("adService")
@RequiredArgsConstructor
public class AdService {

    private final AdRepository adRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ImageRepository imageRepository;

    public List<AdDto> findAll() {
        List<Ad> ads = adRepository.findAll(); // primer
        return ads.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public Optional<AdDto> findById(Long id) {
        return adRepository.findById(id).map(this::convertToDto);
    }

    public boolean isOwner(Long adId, String username) {
        if (adId == null || username == null) {
            return false;
        }
        return adRepository.findById(adId)
                .map(ad -> ad.getKorisnik().getUsername().equals(username))
                .orElse(false);
    }

    public Page<AdDto> searchAds(String keyword, Long categoryId, Pageable pageable) {
        Specification<Ad> spec = (root, query, criteriaBuilder) -> {
            // Kreiramo listu uslova (predikata)
            List<Predicate> predicates = new ArrayList<>();

            // 1. Ako je keyword prosleđen, dodaj uslov za pretragu naslova
            if (keyword != null && !keyword.isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("naslov")), // root.get("naslov") je polje 'naslov' u Ad entitetu
                        "%" + keyword.toLowerCase() + "%"
                ));
            }

            // 2. Ako je categoryId prosleđen, dodaj uslov za pretragu po kategoriji
            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("kategorija").get("id"), // Pratimo relaciju: ad -> kategorija -> id
                        categoryId
                ));
            }

            // 3. Spajamo sve uslove sa AND operatorom
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Ad> adPage = adRepository.findAll(spec, pageable);

        // Mapiramo Page<Ad> u Page<AdDto>
        return adPage.map(this::convertToDto);
    }

    @Transactional
    public AdDto createAd(AdRequest adRequest, String username) {
        User korisnik = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen: " + username));

        Category kategorija = categoryRepository.findById(adRequest.getKategorijaId())
                .orElseThrow(() -> new EntityNotFoundException("Kategorija nije pronađena: " + adRequest.getKategorijaId()));

        Ad ad = new Ad();
        ad.setNaslov(adRequest.getNaslov());
        ad.setOpis(adRequest.getOpis());
        ad.setCena(adRequest.getCena());
        ad.setDatumKreiranja(Instant.now());
        ad.setKorisnik(korisnik);
        ad.setKategorija(kategorija);

        // Kreiranje i povezivanje slika sa oglasom
        if (adRequest.getSlikeUrl() != null) {
            List<Image> slike = adRequest.getSlikeUrl().stream().map(url -> {
                Image img = new Image();
                img.setUrl(url);
                img.setAd(ad); // Povezujemo sliku sa oglasom
                return img;
            }).collect(Collectors.toList());
            ad.setSlike(slike);
        }

        Ad savedAd = adRepository.save(ad);
        return convertToDto(savedAd);
    }

    @Transactional
    public AdDto updateAd(Long adId, AdRequest adRequest) {
        Ad ad = adRepository.findById(adId)
                .orElseThrow(() -> new EntityNotFoundException("Oglas sa ID " + adId + " nije pronađen."));

        Category kategorija = categoryRepository.findById(adRequest.getKategorijaId())
                .orElseThrow(() -> new EntityNotFoundException("Kategorija sa ID " + adRequest.getKategorijaId() + " nije pronađena."));

        ad.setNaslov(adRequest.getNaslov());
        ad.setOpis(adRequest.getOpis());
        ad.setCena(adRequest.getCena());
        ad.setKategorija(kategorija);
        imageRepository.deleteAll(ad.getSlike());
        ad.getSlike().clear();

        if (adRequest.getSlikeUrl() != null) {
            List<Image> newImgs = adRequest.getSlikeUrl().stream().map(url -> {
                Image img = new Image();
                img.setUrl(url);
                img.setAd(ad);
                return img;
            }).toList();
            ad.getSlike().addAll(newImgs);
        }

        Ad savedAd = adRepository.save(ad);
        return convertToDto(savedAd);
    }

    public List<AdDto> findAdsByUsername(String username) {
        List<Ad> ads = adRepository.findByKorisnikUsername(username);
        return ads.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAd(Long adId) {
        adRepository.deleteById(adId);
    }

    @Transactional
    public void deleteAdByAdmin(Long adId) {
        Ad ad = adRepository.findById(adId)
                .orElseThrow(() -> new EntityNotFoundException("Oglas nije pronađen"));

        adRepository.delete(ad);
    }

    private AdDto convertToDto(Ad ad) {
        return AdDto.builder()
                .id(ad.getId())
                .naslov(ad.getNaslov())
                .opis(ad.getOpis())
                .cena(ad.getCena())
                .datumKreiranja(ad.getDatumKreiranja())
                .korisnikUsername(ad.getKorisnik().getUsername())
                .kategorijaNaziv(ad.getKategorija().getNaziv())
                .slikeUrl(ad.getSlike().stream().map(Image::getUrl).collect(Collectors.toList()))
                .build();
    }
}