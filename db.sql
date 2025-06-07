
create database  db_proy;
use db_proy;
CREATE TABLE usuarios (
    idUsuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(100) NULL,
    esTemporal boolean default false
);

CREATE TABLE roles (
    idRoles BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);


CREATE TABLE usuario_roles (
    usuarioId BIGINT NOT NULL,
    rolId BIGINT NOT NULL,
    PRIMARY KEY (usuarioId, rolId),
    CONSTRAINT fk_usuario FOREIGN KEY (usuarioId) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
    CONSTRAINT fk_rol FOREIGN KEY (rolId) REFERENCES roles(idRoles) ON DELETE CASCADE
);


CREATE TABLE casas (
    idCasa BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    numHabitaciones INT NOT NULL,
    numBaños INT NOT NULL
);
ALTER TABLE casas MODIFY numBaños INT NULL;
ALTER TABLE casas MODIFY numHabitaciones INT NULL;
ALTER TABLE casas
ADD COLUMN email VARCHAR(255) NOT NULL;


CREATE TABLE imagenes_casa(
    idImagenes BIGINT AUTO_INCREMENT PRIMARY KEY,
    casaId BIGINT,
    url_imagen VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255),
    FOREIGN KEY (casaId) REFERENCES casas(idCasa) ON DELETE CASCADE
);

CREATE TABLE caracteristicas (
    idCaracteristica BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(100) NOT NULL
);
CREATE TABLE casa_caracteristicas (
    casaId BIGINT,
    caracteristicaId BIGINT,
    PRIMARY KEY (casaId, caracteristicaId),
    FOREIGN KEY (casaId) REFERENCES casas(idCasa) ON DELETE CASCADE,
    FOREIGN KEY (caracteristicaId) REFERENCES caracteristicas(idCaracteristica) ON DELETE CASCADE
);
CREATE TABLE alquileres (
    idAlquiler BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuarioId BIGINT,
    casaId BIGINT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    FOREIGN KEY (usuarioId) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (casaId) REFERENCES casas(idCasa)
);
ALTER TABLE alquileres ADD COLUMN precio DOUBLE NOT NULL DEFAULT 0.0;

INSERT INTO casas (nombre, direccion, ciudad, precio, descripcion, numHabitaciones, numBaños, email) 
VALUES ('Casa Campo', 'Calle El Cueto s/n, Lugones, Siero', 'Lugones', 20, 'Casa de campo moderna y funcional, con espacios abiertos y diseño acogedor.', 3, 4, 'nahircorralesrodriguez@gmail.com'),
('Casa Rural El Bosque', 'Camino de los Robles 7, Cangas de Onís', 'Cangas de Onís', 45, 'Encantadora casa rural rodeada de naturaleza, ideal para desconectar.', 3, 2, 'nahircorralesrodriguez@gmail.com'),
('Apartamento Playa Salinas', 'Avenida del Mar 32, Salinas', 'Salinas', 35, 'Apartamento luminoso a pocos metros de la playa, perfecto para vacaciones.', 2, 1, 'nahircorralesrodriguez@gmail.com'),
('Casa Montaña Covadonga', 'Barrio Alto, Covadonga', 'Covadonga', 50, 'Casa tradicional en la montaña con vistas espectaculares.', 3, 3, 'nahircorralesrodriguez@gmail.com'),
('Piso Moderno Gijón', 'Calle de la Arena 15, Gijón', 'Gijón', 40, 'Piso de diseño moderno en pleno centro, cerca de la playa y restaurantes.', 2, 1, 'nahircorralesrodriguez@gmail.com'),
('Estudio Urbano Oviedo', 'Avenida de Galicia 8, Oviedo', 'Oviedo', 25, 'Pequeño estudio funcional y céntrico, ideal para estudiantes y trabajadores.', 1, 1, 'nahircorralesrodriguez@gmail.com'),
('Casa de Piedra Somiedo', 'Lugar Braña Vieja, Somiedo', 'Somiedo', 30, 'Casa de piedra con encanto rústico, perfecta para amantes de la montaña.', 2, 2, 'nahircorralesrodriguez@gmail.com'),
('Chalet Privado Avilés', 'Calle del Sol 20, Avilés', 'Avilés', 50, 'Chalet independiente con jardín privado y espacios amplios.', 3, 3, 'nahircorralesrodriguez@gmail.com'),
('Casa Rural Taramundi', 'Camino de la Fuente 3, Taramundi', 'Taramundi', 15, 'Pequeña casa rural acogedora en un entorno tranquilo y natural.', 1, 1, 'nahircorralesrodriguez@gmail.com');



INSERT INTO caracteristicas (nombre, descripcion) VALUES
('Deficiencia visual', 'Casas amplias con mejoras para la ayuda de personas con baja o nula vista'),
('Teletrabajo', 'Espacio acondicionado para trabajo remoto'),
('Asperger', 'Regulación de luces e insonorización para minimizar estímulos externos.'),
('Alergenos piel', 'Con sábanas y toallas lavadas con productos hipoalergénicos.'),
('Movilidad reducida', 'Accesos adaptados y espacios amplios para facilitar la movilidad.'),
('Niños', 'Zona segura con áreas de juego y mobiliario adecuado para menores.'),
('Mascotas', 'Espacios adaptados para animales domésticos con áreas al aire libre.'),
('Trabajo remoto', 'Conectividad estable, escritorio y mobiliario ergonómico.'),
('Climatización', 'Regulación térmica eficiente con calefacción y aire acondicionado.'),
('Naturaleza', 'Ubicación con espacios verdes y contacto directo con la naturaleza.'),
('Piscina', 'Piscina privada o comunitaria con mantenimiento regular.');

INSERT INTO casa_caracteristicas (casaId, caracteristicaId) VALUES
(1, 1),(1, 4),(2, 7),(2, 10), (3, 3),(3, 2), (3, 8),(3, 1),(4, 6),(4, 5), (4, 9), (5, 7), (6, 10), (7, 2),(8, 3), (9, 1),(9, 6), (9, 10); 
INSERT INTO casa_caracteristicas (casaId, caracteristicaId) VALUES (1, 5);
INSERT INTO casa_caracteristicas (casaId, caracteristicaId) VALUES (1, 6);
INSERT INTO casa_caracteristicas (casaId, caracteristicaId) VALUES (1, 10);


INSERT INTO imagenes_casa (casaId, url_imagen, descripcion) 
VALUES 
(1, '/imagenes/casaCampo.jpg', 'Amplia casa de campo con estructura tradicional y detalles modernos.'),
(1, '/imagenes/salon.jpg', 'Salón espacioso con sofá grande y mesa central, ideal para reuniones y descanso.'),
(2, '/imagenes/casa.webp', 'Casa dos plantas '), 
(2, '/imagenes/baño1.webp', 'baño sencillo'),
(2, '/imagenes/casa.webp', 'Casa dos plantas '),
(3, '/imagenes/casa-granja.webp', 'Casa en medio de la nada'),
(3, '/imagenes/principal1.webp', 'bonita habitacion '),
(4, '/imagenes/CasaAislada.webp', 'casa grande'),
(5, '/imagenes/CasaAislada.webp', 'casa grande'),
(6, '/imagenes/baño.webp', 'baño'),
(6, '/imagenes/cocina-comedor.webp', 'cocina comedor'),
(7, '/imagenes/cocinaIsla.webp', 'cocina'),
(7, '/imagenes/infantil 2 niños.webp', 'cocina'),
(8, '/imagenes/Cocina-Salon.webp', 'cocina'),
(8, '/imagenes/Cocina-Salon.webp', 'cocina'),
(9, '/imagenes/hab.webp', 'habitacion'),
(9, '/imagenes/hab.webp', 'habitacion'),
(9, '/imagenes/habitacionLujosa.webp', 'habitacion');

INSERT INTO roles (nombre) VALUES
('ROLE_USER'),
('ROLE_ADMIN');

INSERT INTO usuarios (nombre, email, contraseña, esTemporal) VALUES
('Nahir Corrales Rodríguez', 'nahircorralesrodriguez@gmail.com', '123456', FALSE);

INSERT INTO usuario_roles (usuarioId, rolId) VALUES
(1, 1), -- Asigna ROLE_USER
(1, 2); -- Asigna ROLE_ADMIN
UPDATE usuarios 
SET contraseña = '$2a$12$dallQGxchFa8IN7.nhqrbeCHfHuit1LWztK8gj4Da0cp18KHYxpg2' 
WHERE idUsuario = 1;


DELETE FROM usuarios 
WHERE esTemporal = true 
AND idUsuario IN (
    SELECT usuarioId FROM alquileres WHERE fecha_fin < NOW()
);

UPDATE alquileres 
SET usuarioId = NULL 
WHERE usuarioId IN (SELECT idUsuario FROM usuarios WHERE esTemporal = true AND fecha_fin < NOW());

DELETE FROM usuarios 
WHERE esTemporal = true 
AND idUsuario IN (SELECT usuarioId FROM alquileres WHERE fecha_fin < NOW());

SET SQL_SAFE_UPDATES = 1;
SET GLOBAL event_scheduler = ON;
/*para activar lo siguiente*/

DELIMITER $$

CREATE EVENT eliminarUsuariosTemporales
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO 
BEGIN
    UPDATE alquileres 
    SET usuarioId = NULL 
    WHERE usuarioId IN (
        SELECT idUsuario FROM usuarios WHERE esTemporal = true AND idUsuario IN (
            SELECT usuarioId FROM alquileres WHERE fecha_fin < NOW()
        )
    );
    DELETE FROM usuarios 
    WHERE esTemporal = true 
    AND idUsuario IN (
        SELECT usuarioId FROM alquileres WHERE fecha_fin < NOW()
    );
END $$

DELIMITER ;



