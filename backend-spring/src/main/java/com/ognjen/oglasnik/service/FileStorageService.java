package com.ognjen.oglasnik.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Ne može se kreirati direktorijum za čuvanje fajlova.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Generiši jedinstveno ime fajla da se izbegnu konflikti
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + fileExtension;

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Naziv fajla sadrži neispravnu putanju: " + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Ne može se sačuvati fajl " + fileName + ". Pokušajte ponovo!", ex);
        }
    }

    // Metoda koja će generisati URL za pristup slici
    public String getFileUrl(String fileName) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();
    }
}