/**
 * Controlador: AdminController
 * Maneja la autenticación de administradores.
 */

/** POST /api/admin/login */
const login = (req, res) => {
  const { user, pass } = req.body;
  if (user === 'Admin' && pass === '12345') {
    return res.json({ ok: true, token: 'admintoken123' });
  }
  res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
};

module.exports = { login };
