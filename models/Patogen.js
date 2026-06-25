/**
 * Modelo: Patogen
 * Representa un patógeno tal como se almacena en la base de datos.
 * No contiene lógica de negocio ni acceso a datos.
 */
class Patogen {
  constructor(id, nombre, resumen_publico, tratamiento_publico, resumen_experto, tratamiento_experto, fuente) {
    this.id = id;
    this.nombre = nombre;
    this.resumen_publico = resumen_publico || '';
    this.tratamiento_publico = tratamiento_publico || '';
    this.resumen_experto = resumen_experto || '';
    this.tratamiento_experto = tratamiento_experto || '';
    this.fuente = fuente || '';
  }

  /**
   * Crea una instancia de Patogen a partir de una fila de la base de datos.
   * @param {object} fila - Fila de MySQL
   * @returns {Patogen}
   */
  static fromDB(fila) {
    return new Patogen(
      fila.id,
      fila.nombre,
      fila.resumen_publico,
      fila.tratamiento_publico,
      fila.resumen_experto,
      fila.tratamiento_experto,
      fila.fuente
    );
  }
}

module.exports = Patogen;
