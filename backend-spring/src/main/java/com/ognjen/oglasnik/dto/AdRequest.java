package com.ognjen.oglasnik.dto;

import lombok.Data;
import java.util.List;

@Data
public class AdRequest {
    private String naslov;
    private String opis;
    private double cena;
    private Long kategorijaId;
    private List<String> slikeUrl; // Lista URL-ova slika
}