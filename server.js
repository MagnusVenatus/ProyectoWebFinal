const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/patogenos', require('./routes/patogenos'));
app.use('/api/admin',     require('./routes/admin'));

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
