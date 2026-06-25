/**
 * Rutas: /api/patogenos
 * El middleware requireAdmin protege las rutas de escritura.
 */
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/PatogenController');

function requireAdmin(req, res, next) {
  const token = req.get('x-admin-token');
  if (token === 'admintoken123') return next();
  return res.status(401).json({ error: 'No autorizado' });
}

router.get('/',          controller.listar);
router.get('/suggest',   controller.sugerir);
router.get('/external',  controller.buscarExterno);
router.get('/:id',       controller.obtener);
router.post('/',         requireAdmin, controller.agregar);
router.put('/:id',       requireAdmin, controller.editar);
router.delete('/:id',    requireAdmin, controller.eliminar);

module.exports = router;
