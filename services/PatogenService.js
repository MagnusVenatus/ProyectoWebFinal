/**
 * Servicio: PatogenService
 * Toda la lógica de acceso a la base de datos para patógenos.
 * El controller solo orquesta; este servicio hace el trabajo con datos.
 */
const db = require('../config/db');
const Patogen = require('../models/Patogen');

/**
 * Retorna todos los patógenos ordenados por nombre.
 * @returns {Promise<Patogen[]>}
 */
function listarTodos() {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM patogenos ORDER BY nombre', (err, filas) => {
      if (err) return reject(err);
      resolve(filas.map(Patogen.fromDB));
    });
  });
}

/**
 * Retorna un patógeno por su ID.
 * @param {number|string} id
 * @returns {Promise<Patogen|null>}
 */
function obtenerPorId(id) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM patogenos WHERE id = ?', [id], (err, filas) => {
      if (err) return reject(err);
      if (filas.length === 0) return resolve(null);
      resolve(Patogen.fromDB(filas[0]));
    });
  });
}

/**
 * Inserta un nuevo patógeno en la base de datos.
 * @param {object} datos
 * @returns {Promise<{id: number, nombre: string}>}
 */
function agregar(datos) {
  const { nombre, resumen_publico, tratamiento_publico, resumen_experto, tratamiento_experto, fuente } = datos;
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO patogenos (nombre, resumen_publico, tratamiento_publico, resumen_experto, tratamiento_experto, fuente) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, resumen_publico || '', tratamiento_publico || '', resumen_experto || '', tratamiento_experto || '', fuente || ''],
      (err, resultado) => {
        if (err) return reject(err);
        resolve({ id: resultado.insertId, nombre });
      }
    );
  });
}

/**
 * Actualiza un patógeno existente.
 * @param {number|string} id
 * @param {object} datos
 * @returns {Promise<boolean>} true si se actualizó, false si no existía
 */
function editar(id, datos) {
  const { nombre, resumen_publico, tratamiento_publico, resumen_experto, tratamiento_experto, fuente } = datos;
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE patogenos SET nombre=?, resumen_publico=?, tratamiento_publico=?, resumen_experto=?, tratamiento_experto=?, fuente=? WHERE id=?',
      [nombre, resumen_publico || '', tratamiento_publico || '', resumen_experto || '', tratamiento_experto || '', fuente || '', id],
      (err, resultado) => {
        if (err) return reject(err);
        resolve(resultado.affectedRows > 0);
      }
    );
  });
}

/**
 * Elimina un patógeno por su ID.
 * @param {number|string} id
 * @returns {Promise<boolean>} true si se eliminó, false si no existía
 */
function eliminar(id) {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM patogenos WHERE id=?', [id], (err, resultado) => {
      if (err) return reject(err);
      resolve(resultado.affectedRows > 0);
    });
  });
}

/**
 * Busca nombres de patógenos que contengan el término (para autocompletado).
 * @param {string} q - Término parcial
 * @returns {Promise<string[]>}
 */
function sugerirLocales(q) {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT nombre FROM patogenos WHERE nombre LIKE ? LIMIT 10',
      [`%${q}%`],
      (err, filas) => {
        if (err) return reject(err);
        resolve(filas.map((f) => f.nombre));
      }
    );
  });
}

module.exports = { listarTodos, obtenerPorId, agregar, editar, eliminar, sugerirLocales };
