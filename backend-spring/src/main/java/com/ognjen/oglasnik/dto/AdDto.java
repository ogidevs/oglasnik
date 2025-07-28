package com.ognjen.oglasnik.dto;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class AdDto {
    private Long id;
    private String naslov;
    private String opis;
    private double cena;
    private Instant datumKreiranja;
    private String korisnikUsername; // Samo username, ne ceo User objekat
    private String kategorijaNaziv; // Samo naziv kategorije
    private List<String> slikeUrl; // Lista URL-ova slika
}