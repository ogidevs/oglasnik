-- Dodajemo 5 kategorija
INSERT INTO category (naziv) VALUES ('Računari');          -- ID će biti 1
INSERT INTO category (naziv) VALUES ('Telefoni');          -- ID će biti 2
INSERT INTO category (naziv) VALUES ('Automobili');        -- ID će biti 3
INSERT INTO category (naziv) VALUES ('Nekretnine');        -- ID će biti 4
INSERT INTO category (naziv) VALUES ('Kućni ljubimci');    -- ID će biti 5

-- Dodajemo dva korisnika: jedan običan i jedan admin
-- Lozinke su 'password' i 'admin', hešovane sa BCrypt-om.
-- Možeš generisati svoje heševe na https://www.browserling.com/bcrypt
INSERT INTO users (username, email, password, role) VALUES ('user', 'user@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.aA.w2eOfg2wK1g.wJmsJk.aJJaG.a', 'ROLE_USER');
INSERT INTO users (username, email, password, role) VALUES ('admin', 'admin@example.com', '$2a$10$OHY.3iGpjG0rA931D3K52.lU20s5g2i3.axWV1b21FvYaoY82u3uS', 'ROLE_ADMIN');

-- Dodajemo nekoliko oglasa da baza ne bude prazna
-- Obrati pažnju na user_id i category_id
INSERT INTO ad (naslov, opis, cena, datum_kreiranja, user_id, category_id) VALUES
('Laptop Dell XPS 15', 'Skoro nov, korišćen za programiranje. Baterija odlična.', 950.00, NOW(), 1, 1),
('iPhone 13 Pro', 'Očuvan, 128GB, sim-free. Sitni tragovi korišćenja.', 600.00, NOW(), 1, 2),
('VW Golf 7', '2015. godište, 1.6 TDI, prešao 150.000km. Registrovan.', 10500.00, NOW(), 2, 3);

-- Dodajemo slike za prvi oglas
INSERT INTO image (url, ad_id) VALUES ('https://example.com/slika1_dell.jpg', 1);
INSERT INTO image (url, ad_id) VALUES ('https://example.com/slika2_dell.jpg', 1);