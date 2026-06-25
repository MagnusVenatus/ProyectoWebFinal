/**
 * Controlador: PatogenController
 * Solo orquesta peticiones HTTP ↔ servicios.
 * No contiene lógica de negocio ni acceso directo a la BD.
 */
const PatogenService  = require('../services/PatogenService');
const WikipediaService = require('../services/WikipediaService');

/** GET /api/patogenos — Lista todos los patógenos */
const listar = async (req, res) => {
  try {
    const items = await PatogenService.listarTodos();
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Error listando patógenos' });
  }
};

/** GET /api/patogenos/:id — Obtiene un patógeno por ID */
const obtener = async (req, res) => {
  try {
    const patogen = await PatogenService.obtenerPorId(req.params.id);
    if (!patogen) return res.status(404).json({ error: 'No encontrado' });
    res.json(patogen);
  } catch {
    res.status(500).json({ error: 'Error obteniendo patógeno' });
  }
};

/** POST /api/patogenos — Agrega un nuevo patógeno */
const agregar = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre obligatorio' });
  try {
    const resultado = await PatogenService.agregar(req.body);
    res.status(201).json(resultado);
  } catch {
    res.status(500).json({ error: 'Error al agregar' });
  }
};

/** PUT /api/patogenos/:id — Edita un patógeno existente */
const editar = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre obligatorio' });
  try {
    const actualizado = await PatogenService.editar(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
    res.json({ id: req.params.id, nombre });
  } catch {
    res.status(500).json({ error: 'Error al editar' });
  }
};

/** DELETE /api/patogenos/:id — Elimina un patógeno */
const eliminar = async (req, res) => {
  try {
    const eliminado = await PatogenService.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Eliminado correctamente' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};

/**
 * GET /api/patogenos/suggest?q= — Autocompletado combinando BD local + Wikipedia.
 * Devuelve objetos { nombre, fuente } para que el frontend sepa el origen.
 */
const sugerir = async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json([]);
  try {
    const locales = await PatogenService.sugerirLocales(q);
    const localSet = new Set(locales.map((n) => n.toLowerCase()));

    let wikiTitles = [];
    try {
      const wikiHits = await WikipediaService.search(q, 5);
      wikiTitles = wikiHits
        .map((h) => h.title)
        .filter((t) => !localSet.has(t.toLowerCase()));
    } catch { /* Wikipedia opcional */ }

    const resultado = [
      ...locales.map((n) => ({ nombre: n, fuente: 'local' })),
      ...wikiTitles.map((t) => ({ nombre: t, fuente: 'wikipedia' }))
    ].slice(0, 12);

    res.json(resultado);
  } catch {
    res.status(500).json([]);
  }
};

/**
 * GET /api/patogenos/external?q= — Búsqueda en Wikipedia cuando no existe en BD.
 */
const buscarExterno = async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'q requerido' });
  try {
    const hits = await WikipediaService.search(q, 5);
    const results = [];
    for (const h of hits) {
      const summary = await WikipediaService.getSummary(h.title);
      if (summary) results.push(summary);
    }
    res.json(results);
  } catch {
    res.status(500).json({ error: 'Error búsqueda externa' });
  }
};

module.exports = { listar, obtener, agregar, editar, eliminar, sugerir, buscarExterno };
