-- =============================================================
-- Script base: patogenosdb
-- Crear y poblar la base de datos del proyecto Patogenos
-- =============================================================

-- 1. Crear la base de datos con UTF-8 completo
CREATE DATABASE IF NOT EXISTS patogenosdb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Seleccionarla
USE patogenosdb;

-- 3. Forzar codificación UTF-8 en la sesión
SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

-- 4. Crear la tabla patogenos
CREATE TABLE IF NOT EXISTS patogenos (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  nombre              VARCHAR(200) NOT NULL,
  resumen_publico     TEXT,
  tratamiento_publico TEXT,
  resumen_experto     TEXT,
  tratamiento_experto TEXT,
  fuente              VARCHAR(500),
  creado_en           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Insertar datos de prueba
INSERT INTO patogenos (nombre, resumen_publico, tratamiento_publico, resumen_experto, tratamiento_experto, fuente)
VALUES
  (
    'Bacillus ficticio',
    'Bacteria ficticia que afecta la piel.',
    'Lavar y desinfectar; consultar al médico.',
    'Descripción técnica para expertos.',
    'Tratamiento específico para expertos.',
    'https://example.org/bacillus'
  ),
  (
    'Virus imaginario',
    'Virus hipotético que causa síntomas leves.',
    'Reposo e hidratación; medidas generales.',
    'Detalles virológicos y recomendaciones técnicas.',
    'Protocolos avanzados de tratamiento.',
    'https://example.org/virus'
  ),
  (
    'Wekitus Contagiosum',
    'Virus peligroso que te hace Wekito.',
    'Descanso severo.',
    'Virus de propagación entre pares con un 30% de contagio, altamente riesgoso.',
    'No hay tratamiento. Se recomienda aislamiento total y evitar contacto con otros individuos.',
    'De los deseos de un niño de 5 años'
  );

SELECT * FROM patogenos;
